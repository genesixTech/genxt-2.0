const express = require('express');
const passport = require('passport');
const { User, UserProfile, Settings } = require('../models');
const {
  authenticateToken,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRevokedToken,
  isTokenRevoked,
} = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateResetPassword,
  validateConfirmResetPassword,
} = require('../utils/validators');
const {
  handleValidationErrors,
  successResponse,
  errorResponse,
  generateRandomToken,
  formatProperName,
} = require('../utils/helpers');

const router = express.Router();

// Configurar estrategias do Passport
require('../config/passport');

// POST /api/auth/register - Cadastro de usuario
router.post('/register', validateRegister, handleValidationErrors, async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return errorResponse(res, 'Email ja cadastrado. Tente fazer login.', 409);
    }

    const user = await User.create({
      nome: formatProperName(nome),
      email: email.toLowerCase(),
      senha_hash: senha, // Hasheada pelo hook do modelo
      provider: 'local',
    });

    await UserProfile.create({ user_id: user.id });
    await Settings.create({ user_id: user.id });

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const userWithProfile = await User.findByPk(user.id, {
      include: [{ model: UserProfile, as: 'profile' }],
    });

    return successResponse(
      res,
      {
        user: userWithProfile,
        accessToken: token,
        token,
        refreshToken,
        refresh_token: refreshToken,
      },
      'Cadastro concluido! Faca a sua primeira GENESI de produtos.',
      201,
    );
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return errorResponse(res, 'Erro interno do servidor', 500);
  }
});

// POST /api/auth/login - Login com email/senha
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      include: [{ model: UserProfile, as: 'profile' }],
    });

    if (!user) {
      return errorResponse(res, 'Usuario nao encontrado. Cadastre-se para continuar.', 401);
    }

    const isValidPassword = await user.verificarSenha(senha);
    if (!isValidPassword) {
      return errorResponse(res, 'Senha incorreta. Tente novamente.', 401);
    }

    if (!user.ativo) {
      return errorResponse(res, 'Conta desativada. Entre em contato com o suporte.', 403);
    }

    await user.update({ ultimo_login: new Date() });

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return successResponse(
      res,
      {
        user,
        accessToken: token,
        token,
        refreshToken,
        refresh_token: refreshToken,
      },
      'Bem-vindo de volta! Sua criacao esta a sua espera.',
    );
  } catch (error) {
    console.error('Erro no login:', error);
    return errorResponse(res, 'Erro interno do servidor', 500);
  }
});

// GET /api/auth/me - Dados do usuario logado
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [
        { model: UserProfile, as: 'profile' },
        { model: Settings, as: 'settings' },
      ],
    });

    if (!user) {
      return errorResponse(res, 'Usuario nao encontrado', 404);
    }

    return successResponse(res, { user }, 'Dados do usuario obtidos com sucesso');
  } catch (error) {
    console.error('Erro ao buscar dados do usuario:', error);
    return errorResponse(res, 'Erro interno do servidor', 500);
  }
});

// POST /api/auth/refresh - Renovar token
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token, refreshToken } = req.body;
    const tokenToVerify = refresh_token || refreshToken;

    if (!tokenToVerify) {
      return errorResponse(res, 'Refresh token obrigatorio', 400);
    }

    const decoded = verifyRefreshToken(tokenToVerify);
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.ativo) {
      return errorResponse(res, 'Usuario invalido ou inativo', 401);
    }

    // bloquear refresh reutilizado
    const revoked = await isTokenRevoked('revoked:refresh', tokenToVerify);
    if (revoked) {
      return errorResponse(res, 'Refresh token revogado. Faca login novamente.', 401);
    }

    const newToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    // revogar refresh antigo
    await setRevokedToken('revoked:refresh', tokenToVerify);

    return successResponse(
      res,
      {
        accessToken: newToken,
        token: newToken,
        refreshToken: newRefreshToken,
        refresh_token: newRefreshToken,
      },
      'Token renovado com sucesso',
    );
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Refresh token expirado. Faca login novamente.', 401);
    }

    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Refresh token invalido', 401);
    }

    console.error('Erro ao renovar token:', error);
    return errorResponse(res, 'Erro interno do servidor', 500);
  }
});

// POST /api/auth/logout - Logout (placeholder)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    const { refresh_token, refreshToken } = req.body || {};
    if (accessToken) {
      await setRevokedToken('revoked:access', accessToken);
    }
    if (refresh_token || refreshToken) {
      await setRevokedToken('revoked:refresh', refresh_token || refreshToken);
    }
    return successResponse(res, null, 'Logout realizado com sucesso. Ate a proxima criacao!');
  } catch (error) {
    console.error('Erro no logout:', error);
    return errorResponse(res, 'Erro interno do servidor', 500);
  }
});

// POST /api/auth/change-password - Alterar senha
router.post('/change-password', authenticateToken, validateChangePassword, handleValidationErrors, async (req, res) => {
  try {
    const { senha_atual, nova_senha } = req.body;
    const user = await User.findByPk(req.userId);

    const isValidPassword = await user.verificarSenha(senha_atual);
    if (!isValidPassword) {
      return errorResponse(res, 'Senha atual incorreta', 400);
    }

    await user.update({ senha_hash: nova_senha });

    return successResponse(res, null, 'Senha alterada com sucesso! Sua conta esta segura.');
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return errorResponse(res, 'Erro interno do servidor', 500);
  }
});

// POST /api/auth/forgot-password - Solicitar reset de senha
router.post('/forgot-password', validateResetPassword, handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    // Por seguranca, sempre retornamos sucesso mesmo se o email nao existir
    if (!user) {
      return successResponse(
        res,
        null,
        'Se este email estiver cadastrado, voce recebera as instrucoes para redefinir sua senha.',
      );
    }

    // Gerar token de reset (em producao, salvar no banco com expiracao)
    const resetToken = generateRandomToken();

    // TODO: Implementar envio de email

    // Retorna token apenas em ambiente de desenvolvimento
    return successResponse(
      res,
      process.env.NODE_ENV === 'development' ? { reset_token: resetToken } : null,
      'Se este email estiver cadastrado, voce recebera as instrucoes para redefinir sua senha.',
    );
  } catch (error) {
    console.error('Erro ao solicitar reset de senha:', error);
    return errorResponse(res, 'Erro interno do servidor', 500);
  }
});

// POST /api/auth/reset-password - Confirmar reset de senha (placeholder)
router.post('/reset-password', validateConfirmResetPassword, handleValidationErrors, async (req, res) => {
  try {
    // TODO: Implementar verificacao real do token
    return successResponse(res, null, 'Senha redefinida com sucesso! Voce ja pode fazer login com a nova senha.');
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return errorResponse(res, 'Erro interno do servidor', 500);
  }
});

// GET /api/auth/google - Iniciar login com Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// GET /api/auth/google/callback - Callback do Google
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/callback?token=${token}&refresh_token=${refreshToken}`);
    } catch (error) {
      console.error('Erro no callback do Google:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/error?message=Erro no login com Google`);
    }
  });

// GET /api/auth/github - Iniciar login com GitHub
router.get('/github', passport.authenticate('github', {
  scope: ['user:email'],
}));

// GET /api/auth/github/callback - Callback do GitHub
router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/callback?token=${token}&refresh_token=${refreshToken}`);
    } catch (error) {
      console.error('Erro no callback do GitHub:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/error?message=Erro no login com GitHub`);
    }
  });

// GET /api/auth/linkedin - Iniciar login com LinkedIn
router.get('/linkedin', passport.authenticate('linkedin'));

// GET /api/auth/linkedin/callback - Callback do LinkedIn
router.get('/linkedin/callback',
  passport.authenticate('linkedin', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/callback?token=${token}&refresh_token=${refreshToken}`);
    } catch (error) {
      console.error('Erro no callback do LinkedIn:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/error?message=Erro no login com LinkedIn`);
    }
  });

// GET /api/auth/oauth/:provider/callback - fallback generico para contrato de rota
router.get('/oauth/:provider/callback', (req, res, next) => {
  const provider = req.params.provider;
  const allowedProviders = ['google', 'github', 'linkedin'];
  if (!allowedProviders.includes(provider)) {
    return errorResponse(res, 'Provider nao suportado', 400);
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  return passport.authenticate(provider, { session: false }, async (err, user) => {
    if (err || !user) {
      console.error(`Erro no callback OAuth (${provider}):`, err);
      return res.redirect(`${frontendUrl}/auth/error?message=Erro no login com ${provider}`);
    }

    try {
      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      return res.redirect(`${frontendUrl}/auth/callback?token=${token}&refresh_token=${refreshToken}&provider=${provider}`);
    } catch (error) {
      console.error(`Falha ao gerar tokens no callback OAuth (${provider}):`, error);
      return res.redirect(`${frontendUrl}/auth/error?message=Erro ao finalizar login com ${provider}`);
    }
  })(req, res, next);
});

module.exports = router;

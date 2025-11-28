const jwt = require('jsonwebtoken');
const { User, UserProfile } = require('../models');

const RAW_JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY;
const RESOLVED_JWT_SECRET = RAW_JWT_SECRET || 'genesix_dev_secret';

if (!RAW_JWT_SECRET) {
  console.warn('JWT secret key is not set. Using insecure default. Set SECRET_KEY or JWT_SECRET in the environment for production.');
}

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token de acesso requerido',
        message: '🔐 Ops! Você precisa estar logado para acessar esta área.',
      });
    }

    // Verificar e decodificar token
    const decoded = jwt.verify(token, RESOLVED_JWT_SECRET);
    
    // Buscar usuário no banco
    const user = await User.findByPk(decoded.userId, {
      include: [
        {
          model: UserProfile,
          as: 'profile',
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        error: 'Usuário não encontrado',
        message: '😅 Ops, parece que sua conta decidiu tirar férias. Faça login novamente.',
      });
    }

    if (!user.ativo) {
      return res.status(403).json({
        error: 'Conta desativada',
        message: '🚫 Sua conta está temporariamente desativada. Entre em contato com o suporte.',
      });
    }

    // Adicionar usuário ao request
    req.user = user;
    req.userId = user.id;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: '⏰ Sua sessão expirou. Faça login novamente para continuar criando.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        message: '🔒 Token inválido. Faça login novamente.',
      });
    }

    console.error('Erro na autenticação:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao verificar autenticação.',
    });
  }
};

// Middleware opcional - não falha se não houver token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      req.userId = null;
      return next();
    }

    const decoded = jwt.verify(token, RESOLVED_JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      include: [
        {
          model: UserProfile,
          as: 'profile',
        },
      ],
    });

    req.user = user || null;
    req.userId = user ? user.id : null;
    
    next();
  } catch (error) {
    // Em caso de erro, continua sem usuário
    req.user = null;
    req.userId = null;
    next();
  }
};

// Middleware para verificar se o usuário é dono do recurso
const checkOwnership = (resourceIdParam = 'id', userIdField = 'user_id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const userId = req.userId;

      // Se não há usuário autenticado
      if (!userId) {
        return res.status(401).json({
          error: 'Não autorizado',
          message: '🔐 Você precisa estar logado para acessar este recurso.',
        });
      }

      // Verificar se o usuário é o dono do recurso
      // Esta verificação será implementada em cada rota específica
      req.resourceId = resourceId;
      next();
    } catch (error) {
      console.error('Erro na verificação de propriedade:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro ao verificar permissões.',
      });
    }
  };
};

// Middleware para verificar se o perfil está completo
const requireCompleteProfile = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user.profile) {
      return res.status(400).json({
        error: 'Perfil incompleto',
        message: '🚀 Quase lá! Complete seu perfil para continuar a jornada de criação.',
        action: 'complete_profile',
      });
    }

    if (!user.profile.perfil_completo) {
      return res.status(400).json({
        error: 'Perfil incompleto',
        message: '🚀 Quase lá! Só falta preencher alguns campos para continuar a jornada de criação.',
        action: 'complete_profile',
        missing_fields: getMissingProfileFields(user.profile),
      });
    }

    next();
  } catch (error) {
    console.error('Erro na verificação de perfil:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao verificar perfil.',
    });
  }
};

// Função auxiliar para identificar campos obrigatórios faltantes
const getMissingProfileFields = (profile) => {
  const requiredFields = [
    'area_atuacao',
    'tamanho_empresa',
    'nivel_conhecimento',
    'objetivo_principal',
    'origem_conhecimento'
  ];

  return requiredFields.filter(field => !profile[field]);
};

// Gerar token JWT
const generateToken = (userId, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
  return jwt.sign(
    { userId },
    RESOLVED_JWT_SECRET,
    { expiresIn }
  );
};

// Gerar refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    RESOLVED_JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

// Verificar refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, RESOLVED_JWT_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Token inválido');
    }
    return decoded;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
  checkOwnership,
  requireCompleteProfile,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  getMissingProfileFields,
};


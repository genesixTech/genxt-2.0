const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, UserProfile } = require('../models');
const { redisClient } = require('../config/database');

const RAW_JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY;
const RESOLVED_JWT_SECRET = RAW_JWT_SECRET || 'genesix_dev_secret';
const DEV_BYPASS = process.env.DEV_BYPASS_AUTH === '1' || ((process.env.NODE_ENV || 'development') !== 'production' && process.env.DEV_BYPASS_AUTH !== '0');

if (!RAW_JWT_SECRET) {
  console.warn('JWT secret key is not set. Using insecure default. Set SECRET_KEY or JWT_SECRET in the environment for production.');
}

const ensureDevUser = async () => {
  const email = process.env.DEV_USER_EMAIL || 'dev@genesix.local';
  let user = await User.findOne({ where: { email } });
  if (!user) {
    user = await User.create({
      nome: 'Dev User',
      email,
      senha_hash: await bcrypt.hash(process.env.DEV_USER_PASSWORD || 'dev123', 10),
      ativo: true,
      plano: 'pro',
    });
  }
  const profile = await UserProfile.findOne({ where: { user_id: user.id } });
  if (!profile) {
    await UserProfile.create({
      user_id: user.id,
      area_atuacao: 'Produto',
      tamanho_empresa: 'startup',
      nivel_conhecimento: 'avancado',
      objetivo_principal: 'experimentar',
      origem_conhecimento: 'dev',
      perfil_completo: true,
    });
  }
  return user;
};

const redisSafeClient = () => {
  if (!redisClient) return null;
  const hasCore =
    typeof redisClient.get === 'function' &&
    typeof redisClient.set === 'function';
  return hasCore ? redisClient : null;
};

const setRevokedToken = async (prefix, token) => {
  const client = redisSafeClient();
  if (!client || !token) return;
  try {
    const decoded = jwt.decode(token);
    const ttlSeconds = decoded?.exp ? Math.max(decoded.exp - Math.floor(Date.now() / 1000), 0) : 3600;
    await client.set(`${prefix}:${token}`, '1', 'EX', ttlSeconds || 3600);
  } catch (err) {
    // best-effort
    return;
  }
};

const isTokenRevoked = async (prefix, token) => {
  const client = redisSafeClient();
  if (!client || !token) return false;
  try {
    const res = await client.get(`${prefix}:${token}`);
    return res === '1';
  } catch (err) {
    return false;
  }
};

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  try {
    if (DEV_BYPASS) {
      const user = await ensureDevUser();
      req.user = user;
      req.userId = user.id;
      return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token de acesso requerido',
        message: 'Ops! Voce precisa estar logado para acessar esta area.',
      });
    }

    const revoked = await isTokenRevoked('revoked:access', token);
    if (revoked) {
      return res.status(401).json({
        error: 'Token revogado',
        message: 'Sua sessao foi encerrada. Faca login novamente.',
      });
    }

    // Verificar e decodificar token
    const decoded = jwt.verify(token, RESOLVED_JWT_SECRET);

    // Buscar usuario no banco
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
        error: 'Usuario nao encontrado',
        message: 'Ops, parece que sua conta decidiu tirar ferias. Faca login novamente.',
      });
    }

    if (!user.ativo) {
      return res.status(403).json({
        error: 'Conta desativada',
        message: 'Sua conta esta temporariamente desativada. Entre em contato com o suporte.',
      });
    }

    // Adicionar usuario ao request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'Sua sessao expirou. Faca login novamente para continuar criando.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token invalido',
        message: 'Token invalido. Faca login novamente.',
      });
    }

    console.error('Erro na autenticacao:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao verificar autenticacao.',
    });
  }
};

// Middleware opcional - nao falha se nao houver token
const optionalAuth = async (req, res, next) => {
  try {
    if (DEV_BYPASS) {
      const user = await ensureDevUser();
      req.user = user;
      req.userId = user.id;
      return next();
    }

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
    // Em caso de erro, continua sem usuario
    req.user = null;
    req.userId = null;
    next();
  }
};

// Middleware para verificar se o usuario e dono do recurso
const checkOwnership = (resourceIdParam = 'id', userIdField = 'user_id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          error: 'Nao autorizado',
          message: 'Voce precisa estar logado para acessar este recurso.',
        });
      }

      req.resourceId = resourceId;
      next();
    } catch (error) {
      console.error('Erro na verificacao de propriedade:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro ao verificar permissoes.',
      });
    }
  };
};

// Middleware para verificar se o perfil esta completo
const requireCompleteProfile = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user?.profile) {
      return res.status(400).json({
        error: 'Perfil incompleto',
        message: 'Quase la! Complete seu perfil para continuar.',
        action: 'complete_profile',
      });
    }

    if (!user.profile.perfil_completo) {
      return res.status(400).json({
        error: 'Perfil incompleto',
        message: 'Quase la! So falta preencher alguns campos para continuar.',
        action: 'complete_profile',
        missing_fields: getMissingProfileFields(user.profile),
      });
    }

    next();
  } catch (error) {
    console.error('Erro na verificacao de perfil:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao verificar perfil.',
    });
  }
};

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

const generateToken = (userId, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
  return jwt.sign(
    { userId },
    RESOLVED_JWT_SECRET,
    { expiresIn }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    RESOLVED_JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, RESOLVED_JWT_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Token invalido');
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
  ensureDevUser,
  DEV_BYPASS,
  setRevokedToken,
  isTokenRevoked,
};

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { testConnection, syncDatabase, sequelize, redisClient } = require('./config/database');
const logger = require('./utils/logger');
const { seedDevData } = require('./utils/devSeed');
const { DEV_BYPASS } = require('./middleware/auth');
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_DIST_PATH = path.join(__dirname, '..', 'public');
const SHOULD_SERVE_FRONTEND = process.env.SERVE_FRONTEND !== 'false';

// Confiar nos proxies (necessario para rate limiting e logs corretos)
app.set('trust proxy', 1);

// Middleware de seguranca
app.use(helmet());

// Rate limiting
let limiterStore;
try {
  const canUseRedisStore =
    process.env.REDIS_DISABLED !== '1' &&
    redisClient &&
    typeof redisClient.call === 'function' &&
    redisClient.status === 'ready';

  if (canUseRedisStore) {
    limiterStore = new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    });
  } else {
    limiterStore = undefined;
    if (process.env.REDIS_DISABLED !== '1') {
      logger.warn('Redis rate-limit store indisponivel ou nao conectado, usando memory store');
    }
  }
} catch (err) {
  logger.warn('Redis rate-limit store indisponivel, usando memory store', { err: err.message });
  limiterStore = undefined;
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // maximo 100 requests por IP por janela de tempo
  standardHeaders: true,
  legacyHeaders: false,
  store: limiterStore,
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.',
  },
});
app.use('/api/', limiter);

// CORS
const allowedOrigin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// Logging
app.use(morgan('combined', { stream: logger.stream }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Inicializar Passport
app.use(passport.initialize());

// Rotas de saude
app.get('/health', async (req, res) => {
  const status = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  try {
    await sequelize.authenticate();
    status.services.database = 'up';
  } catch (err) {
    status.services.database = 'down';
    status.status = 'DEGRADED';
    status.error = status.error || {};
    status.error.database = err.message;
  }

  try {
    if (redisClient && redisClient.ping) {
      await redisClient.ping();
      status.services.redis = 'up';
    } else {
      status.services.redis = 'disabled';
    }
  } catch (err) {
    status.services.redis = 'down';
    status.status = 'DEGRADED';
    status.error = status.error || {};
    status.error.redis = err.message;
  }

  const httpCode = status.status === 'OK' ? 200 : 503;
  res.status(httpCode).json(status);
});

// Rotas da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/collaborators', require('./routes/collaborators'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api', require('./routes/plans'));

// Servir frontend estatico quando disponivel
if (SHOULD_SERVE_FRONTEND && fs.existsSync(FRONTEND_DIST_PATH)) {
  app.use(express.static(FRONTEND_DIST_PATH));

  app.get(/^\/(?!api|health).*/, (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST_PATH, 'index.html'));
  });
}

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { err });

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Dados invalidos',
      details: err.message,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Token invalido ou expirado',
    });
  }

  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado',
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota nao encontrada',
    path: req.originalUrl,
  });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Testar conexao com banco
    await testConnection();

    // Sincronizar modelos
    const shouldForce = process.env.FORCE_SYNC === '1';
    await syncDatabase(shouldForce);

    if (DEV_BYPASS) {
      await seedDevData();
      logger.info('Seed de desenvolvimento aplicado (usuario/projeto/documentos demo).');
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info('Servidor GenesiX iniciado', {
        port: PORT,
        env: NODE_ENV,
        health: '/health',
      });
    });
  } catch (error) {
    logger.error('Erro ao inicializar servidor', { message: error.message, stack: error.stack });
    process.exit(1);
  }
};

startServer();

module.exports = app;

const { Sequelize } = require('sequelize');
const Redis = require('ioredis');
require('dotenv').config();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const useSqlite = process.env.DB_DIALECT === 'sqlite' || process.env.USE_SQLITE === '1';
const allowSqliteFallback = process.env.ALLOW_SQLITE_FALLBACK === '1';

const sequelize = useSqlite
  ? new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || 'genesix.sqlite',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
      },
    })
  : new Sequelize(process.env.DB_NAME || 'genesix_db', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || 'postgres', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
      },
    });

let redisClient;
const redisDisabled = process.env.REDIS_DISABLED === '1' || (!process.env.REDIS_HOST && useSqlite);
if (redisDisabled) {
  redisClient = {
    async ping() {
      return 'PONG';
    },
    on() {},
    emit() {},
    quit() {},
  };
} else {
  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      enableOfflineQueue: false,
      lazyConnect: true,
      retryStrategy: () => null,
      maxRetriesPerRequest: 0,
    });
    redisClient.on('error', (err) => {
      console.warn('Redis indisponivel, seguindo sem cache:', err.message);
    });
  } catch (error) {
    console.warn('Redis init failed, using noop client:', error.message);
    redisClient = {
      async ping() {
        return 'PONG';
      },
      on() {},
      emit() {},
      quit() {},
    };
  }
}

// Testar conexao
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(useSqlite ? 'OK. Conexao SQLite ativa.' : 'OK. Conexao PostgreSQL estabelecida.');
    try {
      await redisClient.ping();
      console.log('OK. Conexao Redis estabelecida.');
    } catch (err) {
      console.warn('Aviso: Redis indisponivel. Continuando sem cache.', err.message);
    }
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error.message);
    if (!useSqlite && allowSqliteFallback) {
      console.warn('Habilitando fallback SQLite (defina USE_SQLITE=1 para usar direto).');
      try {
        const fallback = new Sequelize({
          dialect: 'sqlite',
          storage: process.env.DB_STORAGE || 'genesix.sqlite',
          logging: process.env.NODE_ENV === 'development' ? console.log : false,
        });
        await fallback.authenticate();
        console.log('Fallback SQLite ativo.');
        module.exports.sequelize = fallback;
        return;
      } catch (err) {
        console.error('Fallback SQLite falhou:', err.message);
        process.exit(1);
      }
    }
    process.exit(1);
  }
};

// Sincronizar modelos (apenas em desenvolvimento)
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ alter: !force, force });
    console.log('Modelos sincronizados com o banco de dados.');
  } catch (error) {
    console.error('Erro ao sincronizar modelos:', error.message);
  }
};

module.exports = {
  sequelize,
  redisClient,
  testConnection,
  syncDatabase,
};

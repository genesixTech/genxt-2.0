const { createLogger, format, transports } = require('winston');

const level = process.env.LOG_LEVEL || 'info';

const logger = createLogger({
  level,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'genesix-backend' },
  transports: [
    new transports.Console({
      handleExceptions: true,
    }),
  ],
});

logger.stream = {
  write(message) {
    logger.info(message.trim());
  },
};

module.exports = logger;

import pino from 'pino';

export const getLogger = (level: 'info' | 'debug' | 'error') =>
  pino({
    level,
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
            },
          }
        : undefined,
  });

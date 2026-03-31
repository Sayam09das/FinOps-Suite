import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';
const transport = (() => {
  if (!isDev) {
    return undefined;
  }

  try {
    require.resolve('pino-pretty');

    return {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    };
  } catch {
    return undefined;
  }
})();

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  ...(transport ? { transport } : {}),
});

export type Logger = typeof logger;

import Redis from 'ioredis';
import { logger } from '../../common/logger';

const redisHost = process.env.REDIS_HOST ?? '127.0.0.1';
const redisPort = Number(process.env.REDIS_PORT ?? 6379);
const redisConnectTimeout = Number(process.env.REDIS_CONNECT_TIMEOUT_MS ?? 1000);
const redisRetryCooldownMs = Number(process.env.REDIS_RETRY_COOLDOWN_MS ?? 60000);

const redis = new Redis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  enableOfflineQueue: false,
  connectTimeout: redisConnectTimeout,
  retryStrategy: () => null,
  reconnectOnError: () => false,
});

let connectPromise: Promise<boolean> | null = null;
let lastConnectFailureAt = 0;
let hasLoggedUnavailable = false;

const logRedisUnavailable = (error: unknown): void => {
  if (hasLoggedUnavailable) {
    return;
  }

  hasLoggedUnavailable = true;
  logger.warn(
    {
      error,
      host: redisHost,
      port: redisPort,
    },
    'Redis unavailable; continuing without cache and queue features'
  );
};

redis.on('connect', () => {
  hasLoggedUnavailable = false;
  lastConnectFailureAt = 0;
  logger.info({ host: redisHost, port: redisPort }, 'Redis connected');
});

redis.on('error', (error) => {
  if (redis.status !== 'ready') {
    logRedisUnavailable(error);
    return;
  }

  logger.error({ error }, 'Redis error');
});

redis.on('end', () => {
  if (redis.status !== 'ready') {
    logRedisUnavailable(new Error('Redis connection ended'));
  }
});

export const isRedisReady = (): boolean => redis.status === 'ready';

export const ensureRedisConnection = async (): Promise<boolean> => {
  if (isRedisReady()) {
    return true;
  }

  if (connectPromise) {
    return connectPromise;
  }

  const now = Date.now();
  if (lastConnectFailureAt && now - lastConnectFailureAt < redisRetryCooldownMs) {
    return false;
  }

  connectPromise = redis
    .connect()
    .then(() => true)
    .catch((error: unknown) => {
      lastConnectFailureAt = Date.now();
      logRedisUnavailable(error);
      return false;
    })
    .finally(() => {
      connectPromise = null;
    });

  return connectPromise;
};

export default redis;

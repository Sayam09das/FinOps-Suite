import { afterEach, vi } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET ??= 'test-access-secret';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret';
process.env.DATABASE_URL ??= 'mongodb://127.0.0.1:27017/finops_suite_test';

vi.mock('../src/config/db', () => ({
  default: {
    user: {
      count: vi.fn().mockResolvedValue(0),
    },
  },
  connectToDatabase: vi.fn().mockResolvedValue(undefined),
  disconnectFromDatabase: vi.fn().mockResolvedValue(undefined),
  pingDatabase: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../src/config/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('../src/config/cloudinary', () => ({
  default: {
    uploader: {
      upload_stream: vi.fn(),
      destroy: vi.fn(),
    },
  },
}));

vi.mock('../src/infrastructure/cache/redis', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
  ensureRedisConnection: vi.fn().mockResolvedValue(false),
  isRedisReady: vi.fn().mockReturnValue(false),
}));

vi.mock('../src/infrastructure/queue/notification.queue', () => ({
  startNotificationWorker: vi.fn().mockResolvedValue(null),
  stopNotificationWorker: vi.fn().mockResolvedValue(undefined),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

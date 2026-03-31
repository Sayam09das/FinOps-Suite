"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
process.env.NODE_ENV = 'test';
(_a = process.env).JWT_SECRET ?? (_a.JWT_SECRET = 'test-access-secret');
(_b = process.env).JWT_REFRESH_SECRET ?? (_b.JWT_REFRESH_SECRET = 'test-refresh-secret');
(_c = process.env).DATABASE_URL ?? (_c.DATABASE_URL = 'mongodb://127.0.0.1:27017/finops_suite_test');
vitest_1.vi.mock('../src/config/db', () => ({
    default: {
        user: {
            count: vitest_1.vi.fn().mockResolvedValue(0),
        },
    },
    connectToDatabase: vitest_1.vi.fn().mockResolvedValue(undefined),
    disconnectFromDatabase: vitest_1.vi.fn().mockResolvedValue(undefined),
    pingDatabase: vitest_1.vi.fn().mockResolvedValue(undefined),
}));
vitest_1.vi.mock('../src/config/logger', () => ({
    logger: {
        info: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock('../src/config/cloudinary', () => ({
    default: {
        uploader: {
            upload_stream: vitest_1.vi.fn(),
            destroy: vitest_1.vi.fn(),
        },
    },
}));
vitest_1.vi.mock('../src/infrastructure/cache/redis', () => ({
    default: {
        get: vitest_1.vi.fn(),
        set: vitest_1.vi.fn(),
        del: vitest_1.vi.fn(),
    },
    ensureRedisConnection: vitest_1.vi.fn().mockResolvedValue(false),
    isRedisReady: vitest_1.vi.fn().mockReturnValue(false),
}));
vitest_1.vi.mock('../src/infrastructure/queue/notification.queue', () => ({
    startNotificationWorker: vitest_1.vi.fn().mockResolvedValue(null),
    stopNotificationWorker: vitest_1.vi.fn().mockResolvedValue(undefined),
}));
(0, vitest_1.afterEach)(() => {
    vitest_1.vi.clearAllMocks();
    vitest_1.vi.resetModules();
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = __importDefault(require("../../src/app/app"));
const db_1 = require("../../src/config/db");
(0, vitest_1.describe)('Health Integration Tests', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.mocked(db_1.pingDatabase).mockResolvedValue(undefined);
    });
    (0, vitest_1.it)('returns API health data from the mounted health route', async () => {
        const response = await (0, supertest_1.default)(app_1.default).get('/api/health');
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body).toMatchObject({
            success: true,
            message: 'OK',
            data: {
                db: 'connected',
            },
        });
        (0, vitest_1.expect)(response.body.data).toHaveProperty('timestamp');
        (0, vitest_1.expect)(response.body.data).toHaveProperty('uptime');
    });
});

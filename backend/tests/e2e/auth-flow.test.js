"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = __importDefault(require("../../src/app/app"));
const authState = vitest_1.vi.hoisted(() => ({
    users: new Map(),
}));
vitest_1.vi.mock('../../src/modules/auth/auth.repository', () => ({
    authRepository: {
        findByEmail: vitest_1.vi.fn(async (email) => authState.users.get(email) ?? null),
        findById: vitest_1.vi.fn(async (id) => {
            return Array.from(authState.users.values()).find((user) => user.id === id) ?? null;
        }),
        createUser: vitest_1.vi.fn(async (email, hashedPassword) => {
            const user = {
                id: `user-${authState.users.size + 1}`,
                email,
                password: hashedPassword,
                createdAt: new Date(),
            };
            authState.users.set(email, user);
            return user;
        }),
    },
}));
(0, vitest_1.describe)('Auth E2E Flow', () => {
    (0, vitest_1.beforeEach)(() => {
        authState.users.clear();
    });
    (0, vitest_1.it)('registers and logs in a user through the auth routes', async () => {
        const user = {
            email: 'test@example.com',
            password: 'password@123',
        };
        const registerResponse = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send(user);
        (0, vitest_1.expect)(registerResponse.status).toBe(201);
        (0, vitest_1.expect)(registerResponse.body).toMatchObject({
            success: true,
            data: {
                email: user.email,
            },
        });
        const storedUser = authState.users.get(user.email);
        (0, vitest_1.expect)(storedUser).toBeDefined();
        (0, vitest_1.expect)(await bcrypt_1.default.compare(user.password, storedUser.password)).toBe(true);
        const loginResponse = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
            email: user.email,
            password: user.password,
        });
        (0, vitest_1.expect)(loginResponse.status).toBe(200);
        (0, vitest_1.expect)(loginResponse.body).toMatchObject({
            success: true,
            data: {
                user: {
                    email: user.email,
                },
            },
        });
        (0, vitest_1.expect)(loginResponse.body.data).toHaveProperty('accessToken');
        (0, vitest_1.expect)(loginResponse.body.data).toHaveProperty('refreshToken');
    });
});

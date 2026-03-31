import bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { login, register } from '../../src/modules/auth/auth.controller';

const authState = vi.hoisted(() => ({
  users: new Map<
    string,
    { id: string; email: string; password: string; createdAt: Date }
  >(),
}));

const createMockResponse = () => {
  let statusCode = 200;
  let responseBody: unknown;

  const response = {
    status: vi.fn((code: number) => {
      statusCode = code;
      return response;
    }),
    json: vi.fn((body: unknown) => {
      responseBody = body;
      return response;
    }),
  };

  return {
    res: response,
    getStatusCode: () => statusCode,
    getBody: () => responseBody,
  };
};

vi.mock('../../src/modules/auth/auth.repository', () => ({
  authRepository: {
    findByEmail: vi.fn(async (email: string) => authState.users.get(email) ?? null),
    findById: vi.fn(async (id: string) => {
      return Array.from(authState.users.values()).find((user) => user.id === id) ?? null;
    }),
    createUser: vi.fn(async (email: string, hashedPassword: string) => {
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

describe('Auth E2E Flow', () => {
  beforeEach(() => {
    authState.users.clear();
  });

  it('registers and logs in a user through the auth controllers', async () => {
    const user = {
      email: 'test@example.com',
      password: 'password@123',
    };

    const registerResult = createMockResponse();
    await register({ body: user } as never, registerResult.res as never);

    expect(registerResult.getStatusCode()).toBe(201);
    expect(registerResult.getBody()).toMatchObject({
      success: true,
      data: {
        email: user.email,
      },
    });

    const storedUser = authState.users.get(user.email);
    expect(storedUser).toBeDefined();
    expect(await bcrypt.compare(user.password, storedUser!.password)).toBe(true);

    const loginResult = createMockResponse();
    await login({ body: user } as never, loginResult.res as never);

    expect(loginResult.getStatusCode()).toBe(200);
    expect(loginResult.getBody()).toMatchObject({
      success: true,
      data: {
        user: {
          email: user.email,
        },
      },
    });

    const loginBody = loginResult.getBody() as {
      data: Record<string, unknown>;
    };
    expect(loginBody.data).toHaveProperty('accessToken');
    expect(loginBody.data).toHaveProperty('refreshToken');
  });
});

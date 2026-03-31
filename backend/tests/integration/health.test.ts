import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pingDatabase } from '../../src/config/db';
import { healthCheck } from '../../src/modules/health/health.controller';

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

describe('Health Integration Tests', () => {
  beforeEach(() => {
    vi.mocked(pingDatabase).mockResolvedValue(undefined);
  });

  it('returns API health data when the database ping succeeds', async () => {
    const { res, getStatusCode, getBody } = createMockResponse();
    const next = vi.fn();

    await healthCheck({} as never, res as never, next);

    expect(vi.mocked(pingDatabase)).toHaveBeenCalledTimes(1);
    expect(next).not.toHaveBeenCalled();
    expect(getStatusCode()).toBe(200);
    expect(getBody()).toMatchObject({
      success: true,
      message: 'OK',
      data: {
        db: 'connected',
      },
    });

    const body = getBody() as { data: Record<string, unknown> };
    expect(body.data).toHaveProperty('timestamp');
    expect(body.data).toHaveProperty('uptime');
  });
});

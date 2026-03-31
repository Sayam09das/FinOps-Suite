import { describe, expect, it } from 'vitest';
import { createPagination } from '../../src/common/utils/pagination';

describe('createPagination', () => {
  it('creates pagination args for the first page', () => {
    const result = createPagination({ page: 1, limit: 10 }, {});

    expect(result).toMatchObject({
      page: 1,
      limit: 10,
      skip: 0,
      args: {
        skip: 0,
        take: 10,
        orderBy: { date: 'desc' },
      },
    });
  });

  it('clamps the limit to the maximum supported value', () => {
    const result = createPagination({ page: 2, limit: 500 }, {});

    expect(result).toMatchObject({
      page: 2,
      limit: 50,
      skip: 50,
      args: {
        skip: 50,
        take: 50,
      },
    });
  });
});

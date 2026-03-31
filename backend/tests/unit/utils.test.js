"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const pagination_1 = require("../../src/common/utils/pagination");
(0, vitest_1.describe)('createPagination', () => {
    (0, vitest_1.it)('creates pagination args for the first page', () => {
        const result = (0, pagination_1.createPagination)({ page: 1, limit: 10 }, {});
        (0, vitest_1.expect)(result).toMatchObject({
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
    (0, vitest_1.it)('clamps the limit to the maximum supported value', () => {
        const result = (0, pagination_1.createPagination)({ page: 2, limit: 500 }, {});
        (0, vitest_1.expect)(result).toMatchObject({
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

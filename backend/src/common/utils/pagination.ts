import { Prisma } from '@prisma/client';

interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
  where?: Prisma.TransactionWhereInput; // Generic Prisma where
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const createPagination = <T>(options: PaginationOptions, prismaModel: any) => {
  const page = Math.max(1, Number(options.page || 1));
  const limit = Math.max(1, Math.min(50, Number(options.limit || 10))); // Max 50
  const skip = (page - 1) * limit;

  const args: Prisma.TransactionFindManyArgs = {
    where: options.where,
    skip,
    take: limit,
    orderBy: { date: 'desc' } as any, // Default, override if needed
  };

  return { page, limit, skip, args };
};

export const getPaginationMeta = async <T>(prismaModel: any, where: Prisma.TransactionWhereInput) => {
  const total = await prismaModel.count({ where });
  return { total };
};


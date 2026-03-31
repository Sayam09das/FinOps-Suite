import { Prisma } from '@prisma/client';

interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
  where?: any;
}

export interface PaginationResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const createPagination = (options: PaginationOptions, prismaModel: any) => {
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


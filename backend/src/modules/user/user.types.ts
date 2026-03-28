import { Prisma } from '@prisma/client';

export interface UpdateUserInput {
  email?: string;
}

export type ProfileUser = {
  id: string;
  email: string;
  createdAt: Date;
};

export interface GetProfileResponse {
  id: string;
  email: string;
  createdAt: Date;
}

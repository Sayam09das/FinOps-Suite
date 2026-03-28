export interface UserPayload {
  userId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshInput {
  token: string;
}

export interface PrismaUser {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
}

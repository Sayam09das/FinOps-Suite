import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "./auth.repository";
import type { RegisterInput, LoginInput, RefreshInput, AuthTokens, UserPayload, PrismaUser } from "./auth.types";

const ACCESS_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

// Register
export const registerUser = async (input: RegisterInput): Promise<PrismaUser> => {
  const { email, password } = input;
  
  const existingUser = await authRepository.findByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser(email, hashedPassword);

  return user;
};

// Login
export const loginUser = async (input: LoginInput): Promise<{
  user: PrismaUser;
} & AuthTokens> => {
  const { email, password } = input;

  const user = await authRepository.findByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = jwt.sign(
    { userId: user.id } as UserPayload,
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id } as UserPayload,
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};

// Refresh (new)
export const refreshAccessToken = async (input: RefreshInput): Promise<{ accessToken: string }> => {
  const { token } = input;

  const decoded = jwt.verify(token, REFRESH_SECRET) as UserPayload;

  const user = await authRepository.findById(decoded.userId);

  if (!user) {
    throw new Error("User not found");
  }

  const newAccessToken = jwt.sign(
    { userId: user.id } as UserPayload,
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  return { accessToken: newAccessToken };
};

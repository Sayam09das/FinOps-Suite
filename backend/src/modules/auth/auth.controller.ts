import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, refreshAccessToken } from "./auth.service";
import { registerSchema, loginSchema, refreshSchema } from "./auth.validation";
import { z } from 'zod';
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ApiResponse } from "../../common/utils/apiResponse";

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await registerUser(validatedData);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const data = await loginUser(validatedData);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const validatedData = refreshSchema.parse(req.body);
    const { accessToken } = await refreshAccessToken({
      token: validatedData.token ?? validatedData.refreshToken!,
    });

    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    }
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

// Logout (stateless - client deletes tokens)
export const logout = async (req: Request, res: Response) => {
  // Optional: invalidate server-side if blacklisting implemented
  res.json({
    success: true,
    message: 'Logged out successfully. Clear tokens on client.',
  });
};

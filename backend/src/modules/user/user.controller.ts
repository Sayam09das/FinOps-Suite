import { Request, Response } from "express";
import { getUserProfile, updateUserProfile } from "./user.service";
import { updateUserSchema } from "./user.validation";
import { z } from 'zod';

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    email: string;
    createdAt: Date;
  };
};
import { asyncHandler } from "../../common/utils/asyncHandler";
import { ApiResponse } from "../../common/utils/apiResponse";

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    const profile = await getUserProfile(user.id);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

// Update current user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const validatedData = updateUserSchema.parse(req.body);
    const { user } = req as AuthenticatedRequest;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    const profile = await updateUserProfile(user.id, validatedData);

    res.json({
      success: true,
      data: profile,
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

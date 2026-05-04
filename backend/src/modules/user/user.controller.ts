import type { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { ApiResponse } from '../../common/utils/apiResponse';
import { getUserProfile, updateUserProfile } from './user.service';
import type { UpdateCurrentUserInput } from './user.types';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    ApiResponse.error('Unauthorized', res, 401);
    return;
  }

  const profile = await getUserProfile(userId);
  ApiResponse.success(profile, res, 200, 'Current user loaded');
});

export const getAdminAccess = asyncHandler(async (req: Request, res: Response) => {
  ApiResponse.success(
    {
      role: req.user?.role,
      message: 'Admin access granted.',
    },
    res,
    200,
    'Admin access granted',
  );
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    ApiResponse.error('Unauthorized', res, 401);
    return;
  }

  const profile = await updateUserProfile(userId, req.body as UpdateCurrentUserInput);
  ApiResponse.success(profile, res, 200, 'Profile updated');
});

import type { Request, Response } from 'express';
import { ApiResponse } from '../../common/utils/apiResponse';
import { handleOAuth } from './oauth.service';
import { validateRequest } from '../../common/middleware/validation.middleware';
import { oauthSchema } from './oauth.validation';

export const oauthCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await handleOAuth(req.body);
    // sendAuthResponse will set cookies
    const { sendAuthResponse } = await import('./auth.controller');
    sendAuthResponse(session, res, 200, 'OAuth login successful');
  } catch (error) {
    if (error instanceof Error) {
      ApiResponse.error(error.message, res, 400);
      return;
    }
    ApiResponse.error('OAuth failed', res, 500);
  }
};

export const oauthHandler = [validateRequest(oauthSchema), oauthCallback];


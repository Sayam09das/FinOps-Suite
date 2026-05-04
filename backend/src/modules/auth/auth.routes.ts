import { Router } from 'express';
import { protect } from '../../common/middleware/auth.middleware';
import { createAccountLimiter, loginLimiter } from '../../config/rateLimit';
import { validateRequest } from '../../common/middleware/validation.middleware';
import { confirmPasswordReset, getSession, login, refresh, register, requestPasswordReset } from './auth.controller';
import { oauthHandler } from './oauth.controller';
import { forgotPasswordSchema, loginSchema, refreshSchema, registerSchema, resetPasswordSchema } from './auth.validation';
import { logout as logoutHandler } from './logout.controller';

const router = Router();

router.post('/register', createAccountLimiter, validateRequest(registerSchema), register);
router.post('/login', loginLimiter, validateRequest(loginSchema), login);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), requestPasswordReset);
router.post('/reset-password', validateRequest(resetPasswordSchema), confirmPasswordReset);
router.post('/refresh', validateRequest(refreshSchema), refresh);
router.post('/logout', logoutHandler);
router.post('/oauth', oauthHandler);
router.get('/me', protect, getSession);

export default router;

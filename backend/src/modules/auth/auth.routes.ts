import { Router } from "express";
import { register, login, refreshToken, logout } from "./auth.controller";
import { registerSchema, loginSchema, refreshSchema } from "./auth.validation";
import { validateRequest } from "../../common/middleware/validation.middleware";
import { protect } from "../../common/middleware/auth.middleware";
import { getProfile } from "../user/user.controller";

const router = Router();

// Public auth routes
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/refresh", validateRequest(refreshSchema), refreshToken);

// Protected auth routes
router.get("/me", protect, getProfile);
router.post("/logout", protect, logout);

export default router;

import { Router } from "express";
import { getProfile, updateProfile } from "./user.controller";
import { updateUserSchema, getProfileSchema } from "./user.validation";
import { validateRequest } from "../../common/middleware/validation.middleware";
import { protect } from "../../common/middleware/auth.middleware";

const router = Router({ mergeParams: true });

// Protected user routes
router.get("/me", protect, getProfile);
router.patch("/me", protect, validateRequest(updateUserSchema), updateProfile);

export default router;

import { Router } from "express";
import { protect } from "../../common/middleware/auth.middleware";

const router = Router();

router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: (req as any).user,
  });
});

export default router;


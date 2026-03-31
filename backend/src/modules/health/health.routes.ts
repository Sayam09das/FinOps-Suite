import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { healthCheck } from "./health.controller";

const router = Router();

router.get("/", asyncHandler(healthCheck));

export default router;

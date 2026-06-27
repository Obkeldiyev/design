import { Router } from "express";
import { SuperAdminController } from "../controllers/superadmin.controller";
import { requireSuperAdminSecret } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", requireSuperAdminSecret, SuperAdminController.createSuperAdmin);
router.get("/stats", requireSuperAdminSecret, SuperAdminController.getStats);

export default router;

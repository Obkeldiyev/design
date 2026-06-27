import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import businessRoutes from "./business.routes";
import designRoutes from "./design.routes";
import websiteRoutes from "./website.routes";
import superadminRoutes from "./superadmin.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/business", businessRoutes);
router.use("/design", designRoutes);
router.use("/website", websiteRoutes);
router.use("/superadmin", superadminRoutes);

export default router;
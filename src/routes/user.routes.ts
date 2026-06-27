import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateJwt } from "../middlewares/auth.middleware";

const router = Router();

router.get("/profile", authenticateJwt, UserController.getProfile);
router.put("/profile", authenticateJwt, UserController.updateProfile);

export default router;

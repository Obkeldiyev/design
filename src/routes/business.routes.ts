import { Router } from "express";
import { BusinessController } from "../controllers/business.controller";
import { authenticateJwt } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateJwt, BusinessController.createBusiness);
router.get("/", authenticateJwt, BusinessController.listBusinesses);
router.get("/:id", authenticateJwt, BusinessController.getBusiness);
router.put("/:id", authenticateJwt, BusinessController.updateBusiness);
router.delete("/:id", authenticateJwt, BusinessController.deleteBusiness);

export default router;

import { Router } from "express";
import { DesignController } from "../controllers/design.controller";
import { authenticateJwt } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateJwt, DesignController.createDesign);
router.get("/", authenticateJwt, DesignController.listDesigns);
router.get("/:id", authenticateJwt, DesignController.getDesign);
router.put("/:id", authenticateJwt, DesignController.updateDesign);
router.delete("/:id", authenticateJwt, DesignController.deleteDesign);

export default router;

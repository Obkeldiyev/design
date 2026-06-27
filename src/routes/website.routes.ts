import { Router } from "express";
import { WebsiteController } from "../controllers/website.controller";
import { authenticateJwt } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateJwt, WebsiteController.createWebsite);
router.get("/", authenticateJwt, WebsiteController.listWebsites);
router.get("/:id", authenticateJwt, WebsiteController.getWebsite);
router.put("/:id", authenticateJwt, WebsiteController.updateWebsite);
router.delete("/:id", authenticateJwt, WebsiteController.deleteWebsite);

export default router;

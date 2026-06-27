import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/google/failure" }),
  AuthController.googleCallback
);

router.get("/google/failure", AuthController.googleFailure);
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/refresh-token", AuthController.refreshToken);

export default router;

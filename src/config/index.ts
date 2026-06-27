import dotenv from "dotenv";

dotenv.config();

export const config = {
  jwtSecret: process.env.JWT_SECRET || "replace-this-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || "http://localhost:9000/auth/google/callback",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  superAdminSecret: process.env.SUPERADMIN_SECRET || "superadmin-secret",
};

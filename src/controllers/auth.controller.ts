import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { signToken, verifyToken } from "../utils/jwt";
import { ErrorHandler } from "../errors/errorHandler";

const prisma = new PrismaClient();

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, password } = req.body;
      if (!firstName || !lastName || !email || !password) {
        return next(new ErrorHandler("Missing required fields", 400));
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return next(new ErrorHandler("User already exists", 409));
      }

      const hashedPassword = await argon2.hash(password);
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          registrationType: "EMAIL",
        },
      });

      const token = signToken({ id: user.id, email: user.email });
      return res.status(201).json({ success: true, token, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Email and password are required", 400));
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) {
        return next(new ErrorHandler("Invalid credentials", 401));
      }

      const validPassword = await argon2.verify(user.password, password);
      if (!validPassword) {
        return next(new ErrorHandler("Invalid credentials", 401));
      }

      const token = signToken({ id: user.id, email: user.email, roleId: user.roleId });
      return res.json({ success: true, token, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as any;
      if (!user) {
        return next(new ErrorHandler("Google authentication failed", 401));
      }
      const token = signToken({ id: user.id, email: user.email });
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth-success?token=${token}`);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async googleFailure(req: Request, res: Response) {
    res.status(401).json({ success: false, message: "Google login failed" });
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      if (!token) {
        return next(new ErrorHandler("Token is required", 400));
      }

      const payload = verifyToken(token) as { id: string; email: string; roleId?: string | null };
      const newToken = signToken({ id: payload.id, email: payload.email, roleId: payload.roleId });
      return res.json({ success: true, token: newToken });
    } catch (error: any) {
      return next(new ErrorHandler("Invalid token", 401));
    }
  }
}

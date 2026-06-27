import { Request, Response, NextFunction } from "express";
import prisma from "../models";
import { ErrorHandler } from "../errors/errorHandler";

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return next(new ErrorHandler("Unauthorized", 401));
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
          registrationType: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      return res.json({ success: true, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return next(new ErrorHandler("Unauthorized", 401));
      }

      const { firstName, lastName, avatarUrl } = req.body;
      const user = await prisma.user.update({
        where: { id: userId },
        data: { firstName, lastName, avatarUrl },
      });

      return res.json({ success: true, user });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}

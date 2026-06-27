import { ErrorHandler } from "../errors/errorHandler";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const client = new PrismaClient();

export class SuperAdminController {
  static async createSuperAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, username, password, provider, providerAccountId, permissions } = req.body;
      if (!firstName || !lastName || !email || !username) {
        return next(new ErrorHandler("Missing required super admin fields", 400));
      }

      const existingAdmin = await client.superAdmin.findUnique({ where: { email } });
      if (existingAdmin) {
        return next(new ErrorHandler("SuperAdmin already exists", 409));
      }

      const superAdmin = await client.superAdmin.create({
        data: {
          firstName,
          lastName,
          email,
          username,
          password,
          provider,
          providerAccountId,
          permissions: permissions || {},
        },
      });

      return res.status(201).json({ success: true, superAdmin });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const [userCount, businessCount, designCount, websiteCount, subscriptionCount] = await Promise.all([
        client.user.count(),
        client.business.count(),
        client.design.count(),
        client.website.count(),
        client.subscription.count(),
      ]);

      return res.json({
        success: true,
        stats: {
          users: userCount,
          businesses: businessCount,
          designs: designCount,
          websites: websiteCount,
          subscriptions: subscriptionCount,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}

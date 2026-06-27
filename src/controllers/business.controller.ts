import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { ErrorHandler } from "../errors/errorHandler";

const prisma = new PrismaClient();

export class BusinessController {
  static async createBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, slug, description, industry, logoUrl, phone, email, address, website, socialLinks } = req.body;
      const userId = (req as any).user?.id;

      const business = await prisma.business.create({
        data: {
          ownerId: userId,
          name,
          slug,
          description,
          industry,
          logoUrl,
          phone,
          email,
          address,
          website,
          socialLinks,
        },
      });
      return res.status(201).json({ success: true, business });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async listBusinesses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const businesses = await prisma.business.findMany({ where: { ownerId: userId } });
      return res.json({ success: true, businesses });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const business = await prisma.business.findUnique({ where: { id } });
      if (!business) {
        return next(new ErrorHandler("Business not found", 404));
      }
      return res.json({ success: true, business });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async updateBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const business = await prisma.business.update({ where: { id }, data });
      return res.json({ success: true, business });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async deleteBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.business.delete({ where: { id } });
      return res.json({ success: true });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}

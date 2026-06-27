import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { ErrorHandler } from "../errors/errorHandler";

const prisma = new PrismaClient();

export class WebsiteController {
  static async createWebsite(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, subdomain, customDomain, status, seo, config, pages, businessId } = req.body;
      const website = await prisma.website.create({
        data: {
          title,
          subdomain,
          customDomain,
          status,
          seo,
          config,
          businessId,
          pages: { create: pages || [] },
        },
      });
      return res.status(201).json({ success: true, website });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async listWebsites(req: Request, res: Response, next: NextFunction) {
    try {
      const websites = await prisma.website.findMany();
      return res.json({ success: true, websites });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getWebsite(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const website = await prisma.website.findUnique({ where: { id } });
      if (!website) {
        return next(new ErrorHandler("Website not found", 404));
      }
      return res.json({ success: true, website });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async updateWebsite(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const website = await prisma.website.update({ where: { id }, data });
      return res.json({ success: true, website });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async deleteWebsite(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.website.delete({ where: { id } });
      return res.json({ success: true });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}

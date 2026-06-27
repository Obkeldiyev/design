import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { ErrorHandler } from "../errors/errorHandler";

const prisma = new PrismaClient();

export class DesignController {
  static async createDesign(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, slug, type, status, data, pages, businessId } = req.body;
      const design = await prisma.design.create({
        data: {
          title,
          slug,
          type,
          status,
          data,
          businessId,
          pages: { create: pages || [] },
        },
      });
      return res.status(201).json({ success: true, design });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async listDesigns(req: Request, res: Response, next: NextFunction) {
    try {
      const designs = await prisma.design.findMany();
      return res.json({ success: true, designs });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getDesign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const design = await prisma.design.findUnique({ where: { id } });
      if (!design) {
        return next(new ErrorHandler("Design not found", 404));
      }
      return res.json({ success: true, design });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async updateDesign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const design = await prisma.design.update({ where: { id }, data });
      return res.json({ success: true, design });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async deleteDesign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.design.delete({ where: { id } });
      return res.json({ success: true });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}

import { ErrorHandler } from "@errors";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const client = new PrismaClient();

export class SuperAdminController {
    static async createSuperAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (error: any) {
            new ErrorHandler(error.message, error.status)
        }
    }
}
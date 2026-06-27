import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthenticatedRequest } from "../interfaces";
import { ErrorHandler } from "../errors/errorHandler";
import { config } from "../config";

export async function authenticateJwt(req: Request, res: Response, next: NextFunction) {
  const authenticatedReq = req as AuthenticatedRequest;
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new ErrorHandler("Authorization header missing", 401));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = verifyToken(token) as { id: string; email: string; roleId?: string | null };
    authenticatedReq.user = payload;
    return next();
  } catch (error: any) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
}

export function requireRole(roleId: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authenticatedReq = req as AuthenticatedRequest;
    if (authenticatedReq.user?.roleId !== roleId) {
      return next(new ErrorHandler("Forbidden", 403));
    }
    return next();
  };
}

export function requireSuperAdminSecret(req: Request, res: Response, next: NextFunction) {
  const secret = req.headers["x-superadmin-secret"] as string | undefined;
  if (!secret || secret !== config.superAdminSecret) {
    return next(new ErrorHandler("SuperAdmin access denied", 403));
  }
  return next();
}

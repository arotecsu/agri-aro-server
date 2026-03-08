import type { NextFunction, Request, Response } from "express";
import { jwtService } from "../auth/jwt";

export interface AuthRequest extends Request {
  userId: string;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  body: any;
  headers: Record<string, string | string[] | undefined>;
}

class AuthMiddleware {
  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization as string | undefined;
    const token = authHeader ? authHeader.split(" ")[1] : "";

    if (!token) return res.sendStatus(401);

    const decoded = jwtService.verifyToken(token);

    if (!decoded) return res.sendStatus(401);

    req.userId = decoded.userId;
    next();
  }
}

export const authMiddleware = new AuthMiddleware();

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth/jwt";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Middleware de autenticação JWT
 * Verifica se o token é válido antes de permitir acesso à rota
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token não fornecido",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({
        success: false,
        message: "Formato de token inválido",
      });
    }

    const [scheme, token] = parts;

    if (scheme !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Token scheme inválido",
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Token inválido ou expirado",
      });
    }

    req.user = decoded as { id: string; email: string };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Erro ao validar token",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export default authMiddleware;

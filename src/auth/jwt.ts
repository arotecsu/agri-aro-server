import jwt from "jsonwebtoken";
import { envService } from "../config/env";

const JWT_KEY = envService.get("JWT_KEY")!;

export type JwtPayload = {
  id: string;
};

export class JwtService {
  generateToken(payload: JwtPayload): string {
    const token = jwt.sign(payload, JWT_KEY, {
      expiresIn: 60 * 60 * 24 * 30,
      //s * min * hour * day
    });

    return token;
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      var decoded = jwt.verify(token, JWT_KEY);
      return decoded as JwtPayload;
    } catch (err: any) {
      console.log(err.message);
      return null;
    }
  }
}

export const jwtService = new JwtService();

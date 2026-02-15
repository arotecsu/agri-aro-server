import { NextFunction, Response, Request } from "express";

import { getTokenHeader } from "./auth";
import { hasUserById } from "./firebase";
import { verifyToken } from "./jwt";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = getTokenHeader(req);

  if (!token) {
    res.send({
      status: "failed",
      message: "Invalid request",
    });
    return;
  }

  const data = verifyToken(token);

  if (data == null) {
    res.send({
      status: "failed",
      message: "Invalid token",
    });
    return;
  }

  if (!(await hasUserById(data.uid))) {
    res.send({
      status: "failed",
      message: "Invalid user",
    });
    return;
  }
  next();
}

export { authMiddleware };

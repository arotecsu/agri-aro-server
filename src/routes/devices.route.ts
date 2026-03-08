import { Router } from "express";
import type { Request, Response } from "express";
import { devicesController } from "../controllers/devices.controller";
import {
  authMiddleware,
  type AuthRequest,
} from "../middleware/auth.middleware";

export const devicesRouter = Router();

devicesRouter.get(
  "/:deviceId",
  (req, res, next) => authMiddleware.use(req as any, res, next),
  (req: Request, res: Response) =>
    devicesController.get(req as AuthRequest, res),
);
devicesRouter.get(
  "/:deviceId/data",
  (req, res, next) => authMiddleware.use(req as any, res, next),
  (req: Request, res: Response) =>
    devicesController.getSensData(req as AuthRequest, res),
);
devicesRouter.post("/:serieId/send", (req: Request, res: Response) =>
  devicesController.sendData(req, res),
);

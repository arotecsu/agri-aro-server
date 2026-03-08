import type { Express, Request, Response } from "express";
import { loggerMiddleware } from "../middleware/logger.middleware";
import { authRouter } from "./auth.route";
import { profileRouter } from "./profile.route";
import { authMiddleware } from "../middleware/auth.middleware";
import { fieldsRouter } from "./fields.route";
import { devicesRouter } from "./devices.route";
import { soilsRouter } from "./soils.route";
import { cropsRouter } from "./crops.route";

export function loadRoutes(app: Express) {
  app.use(loggerMiddleware);
  app.get("/", (req: Request, res: Response) => {
    res.json({
      message: "Agri ARO API is running",
    });
  });

  app.use("/auth", authRouter);
  app.use(
    "/profile",
    (req, res, next) => authMiddleware.use(req as any, res, next),
    profileRouter,
  );
  app.use(
    "/fields",
    (req, res, next) => authMiddleware.use(req as any, res, next),
    fieldsRouter,
  );
  app.use("/devices", devicesRouter);
  app.use("/soils", soilsRouter);
  app.use("/crops", cropsRouter);
}

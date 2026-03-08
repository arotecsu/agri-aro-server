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
  app.use("/profile", authMiddleware.use, profileRouter);
  app.use("/fields", authMiddleware.use, fieldsRouter);
  app.use("/devices", authMiddleware.use, devicesRouter);
  app.use("/soils", soilsRouter);
  app.use("/crops", cropsRouter);

  /*


  app.get("/params/fields", authMiddleware, GetFieldsParamsRoute);

  */
}

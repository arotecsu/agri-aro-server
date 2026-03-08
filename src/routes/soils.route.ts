import { Router } from "express";
import { soilsController } from "../controllers/soils.controller";

export const soilsRouter = Router();

soilsRouter.get("/", soilsController.getSoils);

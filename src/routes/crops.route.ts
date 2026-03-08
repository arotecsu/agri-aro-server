import { Router } from "express";
import { cropsController } from "../controllers/crops.controller";

export const cropsRouter = Router();

cropsRouter.get("/", cropsController.getCrops);

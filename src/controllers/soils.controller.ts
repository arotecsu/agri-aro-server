import type { Request, Response } from "express";
import { Soil } from "../database/models";

class SoilsController {
  async getSoils(req: Request, res: Response) {
    try {
      const soils = await Soil.find();

      if (!soils || soils.length === 0) {
        return res.status(200).json({
          soils: [],
        });
      }

      res.json({
        soils,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching soils",
      });
    }
  }
}

export const soilsController = new SoilsController();

import type { Request, Response } from "express";
import { Crop } from "../database/models";

class CropsController {
  async getCrops(req: Request, res: Response) {
    try {
      const crops = await Crop.find();

      if (!crops || crops.length === 0) {
        return res.status(200).json({
          crops: [],
        });
      }

      res.json({
        crops,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching crops",
      });
    }
  }
}

export const cropsController = new CropsController();

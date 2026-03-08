import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { Device } from "../database/models/device";
import { SensorReading } from "../database/models/sensor-reading";
import { socketService } from "../services/socket";

class DevicesController {
  get = async (req: AuthRequest, res: Response): Promise<void> => {
    const deviceId = req.params.deviceId as string;

    const device = await Device.findById(deviceId);
    if (!device) {
      res.sendStatus(404);
      return;
    }

    res.json({ device });
  };

  getSensData = async (req: AuthRequest, res: Response): Promise<void> => {
    const deviceId = req.params.deviceId as string;

    const device = await Device.findById(deviceId);
    if (!device) {
      res.sendStatus(404);
      return;
    }

    const minDate = req.query.minDate as string | undefined;
    const maxDate = req.query.maxDate as string | undefined;

    if (!minDate || !maxDate) {
      res.status(400).json({ error: "minDate and maxDate are required" });
      return;
    }

    const readings = await SensorReading.find({
      deviceId,
      moment: {
        $gte: new Date(minDate),
        $lte: new Date(maxDate),
      },
    });

    res.json({ readings });
  };

  sendData = async (req: Request, res: Response): Promise<void> => {
    const serieId = req.params.serieId as string;

    const device = await Device.findOne({ serieId });
    if (!device) {
      res.sendStatus(404);
      return;
    }

    const {
      phosphorus,
      nitrogen,
      ph,
      potassium,
      temperature,
      ambientHumidity,
      soilMoisture,
    } = req.body;

    const newReading = await SensorReading.create({
      deviceId: device._id,
      phosphorus,
      nitrogen,
      ph,
      potassium,
      temperature,
      ambientHumidity,
      soilMoisture,
    });

    socketService.emitToField(
      device._id.toString(),
      "send_data",
      JSON.stringify({
        phosphorus,
        nitrogen,
        ph,
        potassium,
        temperature,
        ambientHumidity,
        soilMoisture,
      }),
    );

    res.json({
      data: newReading,
    });
  };
}

export const devicesController = new DevicesController();

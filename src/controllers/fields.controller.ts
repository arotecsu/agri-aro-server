import type { Request, Response } from "express";
import { User } from "../database/models/user";
import type { AuthRequest } from "../middleware/auth.middleware";
import { Device } from "../database/models/device";
import { Field, SoilCrop } from "../database/models";
class FieldsController {
  async getAll(req: AuthRequest, res: Response) {
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) return res.sendStatus(401);

    const ownFields = await Field.find({ userId })
      .populate("cropType")
      .populate("soilType");

    const associatedFields = await Field.find({ associates: user.email })
      .populate("cropType")
      .populate("soilType");

    const allFields = [...ownFields, ...associatedFields];

    res.json({
      fields: allFields,
    });
  }

  async create(req: AuthRequest, res: Response) {
    const { userId } = req;

    const {
      fieldName,
      deviceId,
      cropType,
      soilType,
      address,
      position,
      fieldSize,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404);

    const field = await Field.create({
      fieldName,
      userId,
      cropType,
      soilType,
      address,
      position,
      fieldSize,
      associates: [],
    });

    if (deviceId) {
      const device = await Device.findOne({ deviceId });
      if (device) {
        device.userId = userId;
        device.fieldId = field._id;
        await device.save();
      }
    }

    const populated = await (
      await field.populate("cropType")
    ).populate("soilType");

    res.status(201).json({
      field: populated,
    });
  }

  async getById(req: AuthRequest, res: Response) {
    const { fieldId } = req.params;

    const field = await Field.findById(fieldId)
      .populate("cropType")
      .populate("soilType");

    if (!field) return res.status(404);

    res.json({
      field,
    });
  }

  async update(req: AuthRequest, res: Response) {
    const { fieldId } = req.params;
    const { fieldName, cropType, soilType, address, position, fieldSize } =
      req.body;

    const field = await Field.findByIdAndUpdate(
      fieldId,
      {
        fieldName,
        cropType,
        soilType,
        address,
        position,
        fieldSize,
      },
      { new: true },
    )
      .populate("cropType")
      .populate("soilType");

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Campo não encontrado",
      });
    }

    res.json({
      field,
    });
  }

  async delete(req: AuthRequest, res: Response) {
    const { fieldId } = req.params;

    const field = await Field.findByIdAndDelete(fieldId);

    if (!field) return res.status(404);

    // Desassociar dispositivo
    const device = await Device.findOne({ fieldId });
    if (device) {
      device.userId = undefined;
      device.fieldId = undefined;
      await device.save();
    }

    res.sendStatus(200);
  }

  async addAssociate(req: AuthRequest, res: Response) {
    const { fieldId } = req.params;
    const { email } = req.body;

    const field = await Field.findById(fieldId);

    if (!field) return res.status(404);

    // Verificar se já é associado
    if (field.associates.includes(email)) return res.status(400);

    field.associates.push(email);
    await field.save();

    const populated = await (
      await field.populate("cropType")
    ).populate("soilType");

    res.json({
      field: populated,
    });
  }

  async removeAssociate(req: AuthRequest, res: Response) {
    const { fieldId, email } = req.params;

    const field = await Field.findById(fieldId);

    if (!field) return res.status(404);

    field.associates = field.associates.filter((e: string) => e !== email);
    await field.save();

    const populated = await (
      await field.populate("cropType")
    ).populate("soilType");

    res.json({
      field: populated,
    });
  }

  async getParams(req: AuthRequest, res: Response) {
    const { fieldId } = req.params;

    const field = await Field.findById(fieldId);
    if (!field) return res.sendStatus(404);

    const params = await SoilCrop.findOne({
      cropType: field.cropType,
      soilType: field.soilType,
    });

    if (!params) return res.sendStatus(404);

    res.json({
      params,
    });
  }
}

export const fieldsController = new FieldsController();

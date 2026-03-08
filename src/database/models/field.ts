import mongoose, { Schema } from "mongoose";

const fieldSchema = new Schema(
  {
    fieldName: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cropType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },
    soilType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Soil",
      required: true,
    },
    fieldSize: { type: Number, required: true },
    address: String,
    position: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    associates: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Field = mongoose.model("Field", fieldSchema);

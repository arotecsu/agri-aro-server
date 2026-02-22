import mongoose, { Schema, Document } from "mongoose";

export interface IField extends Document {
  id?: string;
  field_name: string;
  user_id: string;
  device_id: string;
  crop_type: string;
  soil_type: string;
  field_size?: string;
  address: string;
  position: {
    latitude: string;
    longitude: string;
  };
  associates?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const fieldSchema = new Schema<IField>(
  {
    id: { type: String, unique: true, sparse: true },
    field_name: { type: String, required: true },
    user_id: { type: String, required: true },
    device_id: { type: String, required: true },
    crop_type: { type: String, required: true },
    soil_type: { type: String, required: true },
    field_size: { type: String, sparse: true },
    address: { type: String, required: true },
    position: {
      latitude: { type: String, required: true },
      longitude: { type: String, required: true },
    },
    associates: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Field = mongoose.model<IField>("Field", fieldSchema);

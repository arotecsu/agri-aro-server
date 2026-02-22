import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDevice extends Document {
  id?: string;
  device_id: string;
  device_name: string;
  user_id?: string;
  field_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const deviceSchema = new Schema<IDevice>(
  {
    id: { type: String, unique: true, sparse: true },
    device_id: { type: String, required: true, unique: true },
    device_name: { type: String, required: true },
    user_id: { type: String, sparse: true },
    field_id: { type: String, sparse: true },
  },
  { timestamps: true },
);

export const Device = mongoose.model<IDevice>("Device", deviceSchema);

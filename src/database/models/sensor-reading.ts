import mongoose, { Schema, Document } from "mongoose";

export interface ISensorReading extends Document {
  device_id: string;
  field_id?: string;
  user_id?: string;
  moment: Date;
  phosphorus: number;
  nitrogen: number;
  ph: number;
  potassium: number;
  temperature: number;
  ambient_humidity: number;
  soil_moisture: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const sensorReadingSchema = new Schema<ISensorReading>(
  {
    device_id: { type: String, required: true, index: true },
    field_id: { type: String, sparse: true },
    user_id: { type: String, sparse: true },
    moment: { type: Date, required: true, index: true },
    phosphorus: { type: Number, required: true, default: 0 },
    nitrogen: { type: Number, required: true, default: 0 },
    ph: { type: Number, required: true, default: 0 },
    potassium: { type: Number, required: true, default: 0 },
    temperature: { type: Number, required: true, default: 0 },
    ambient_humidity: { type: Number, required: true, default: 0 },
    soil_moisture: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

// Índice composto para consultas eficientes
sensorReadingSchema.index({ device_id: 1, moment: -1 });
sensorReadingSchema.index({ field_id: 1, moment: -1 });
sensorReadingSchema.index({ user_id: 1, moment: -1 });

export const SensorReading = mongoose.model<ISensorReading>(
  "SensorReading",
  sensorReadingSchema,
);

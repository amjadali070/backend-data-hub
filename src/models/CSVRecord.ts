// src/models/CSVRecord.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ICSVRecord extends Document {
  data: any; // This field can store any JSON structure
}

const CSVRecordSchema: Schema = new Schema(
  {
    data: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICSVRecord>("CSVRecord", CSVRecordSchema);

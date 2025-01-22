// src/models/XLSXRecord.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IXLSXRecord extends Document {
  data: any; // This field can store any JSON structure
}

const XLSXRecordSchema: Schema = new Schema(
  {
    data: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IXLSXRecord>("XLSXRecord", XLSXRecordSchema);

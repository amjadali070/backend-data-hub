// src/controllers/GetUploadedDataController.ts

import { Request, Response } from "express";
import XLSXRecord from "../models/XLSXRecord";

export const getUploadedData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const records = await XLSXRecord.find(); // Retrieve all uploaded records
    res.status(200).json(records);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching uploaded data.", error: err.message });
  }
};

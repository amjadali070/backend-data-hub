// src/controllers/ImportXLSXController.ts

import { Request, Response } from "express";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import XLSXRecord from "../models/XLSXRecord";

export const importXLSX = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded." });
    return;
  }

  const filePath = req.file.path;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Insert each row of the XLSX file as a document in the XLSXRecord collection
    const insertedRecords = await XLSXRecord.insertMany(
      sheetData.map((record) => ({ data: record }))
    );

    res.status(201).json({
      message: "XLSX data imported successfully.",
      count: insertedRecords.length,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      message: "Error processing XLSX file.",
      error: err.message,
    });
  } finally {
    // Remove the file after processing
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Failed to remove file:", unlinkErr);
      }
    });
  }
};

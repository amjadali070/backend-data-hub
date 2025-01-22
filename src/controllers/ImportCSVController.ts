// src/controllers/ImportCSVController.ts

import { Request, Response } from "express";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import CSVRecord from "../models/CSVRecord";
import { RequestHandler } from "express-serve-static-core";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const importCSV = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded." });
    return;
  }

  const filePath = req.file.path;
  const results: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      try {
        // Insert each CSV row as a document in the CSVRecord collection.
        const insertedRecords = await CSVRecord.insertMany(
          results.map((record) => ({ data: record }))
        );
        res.status(201).json({
          message: "CSV data imported successfully.",
          count: insertedRecords.length,
        });
      } catch (err: any) {
        console.error(err);
        res
          .status(500)
          .json({ message: "Error storing CSV data.", error: err.message });
      } finally {
        // Remove the file after processing
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to remove file:", unlinkErr);
          }
        });
      }
    })
    .on("error", (err) => {
      console.error("Error processing CSV file:", err);
      res
        .status(500)
        .json({ message: "Error processing CSV file", error: err.message });
    });
};

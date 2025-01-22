// src/routes/importXlsxRoutes.ts

import { Router } from "express";
import multer from "multer";
import { importXLSX } from "../controllers/ImportXLSXController";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Please upload an XLSX file.") as any,
      false
    );
  }
};

const upload = multer({ storage, fileFilter });

const router = Router();

// The field name in the form should be 'xlsxFile'
router.post("/import-xlsx", upload.single("xlsxFile"), importXLSX);

export default router;

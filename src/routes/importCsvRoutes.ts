import { Router } from "express";
import multer from "multer";
import { importCSV } from "../controllers/ImportCSVController";
import { getCSVData } from "../controllers/GetCSVDataController";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Please upload a CSV file.") as any, false);
  }
};

const upload = multer({ storage, fileFilter });

const router = Router();

router.post("/import-csv", upload.single("csvFile"), importCSV);
router.get("/csv-data", getCSVData);

export default router;

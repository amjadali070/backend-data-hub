// src/routes/getUploadedDataRoutes.ts

import { Router } from "express";
import { getUploadedData } from "../controllers/GetUploadedDataController";

const router = Router();

// Route to get all uploaded data
router.get("/uploaded-data", getUploadedData);

export default router;

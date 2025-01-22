import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import importCsvRoutes from "./routes/importCsvRoutes";
import authRoutes from "./routes/authRoutes";
import importXlsxRoutes from "./routes/importXlsxRoutes"; // Add XLSX import routes
import getUploadedDataRoutes from "./routes/getUploadedDataRoutes"; // Add uploaded data retrieval routes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Optionally, serve uploaded files if needed (use with caution in production)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api", importCsvRoutes); // CSV import routes
app.use("/api", importXlsxRoutes); // XLSX import routes
app.use("/api", getUploadedDataRoutes); // Route to retrieve uploaded data

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI!)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

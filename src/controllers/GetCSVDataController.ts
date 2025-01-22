import { Request, Response } from "express";
import CSVRecord from "../models/CSVRecord";

export const getCSVData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { search, limit = 10, page = 1 } = req.query;

    const query: any = {};
    if (search) {
      query["data"] = { $regex: new RegExp(search as string, "i") };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const data = await CSVRecord.find(query).skip(skip).limit(Number(limit));

    const totalRecords = await CSVRecord.countDocuments(query);

    res.status(200).json({
      data,
      totalRecords,
      currentPage: Number(page),
      totalPages: Math.ceil(totalRecords / Number(limit)),
    });
  } catch (error: any) {
    console.error("Error fetching CSV data:", error);
    res
      .status(500)
      .json({ message: "Error fetching CSV data", error: error.message });
  }
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // The token is expected to be in the format "Bearer <token>"
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      // Attach the user payload (e.g., id, username) to the request object
      (req as any).user = user;
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

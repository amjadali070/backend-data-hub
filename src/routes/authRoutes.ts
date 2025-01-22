import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/profile", authenticateJWT, getProfile);

export default router;

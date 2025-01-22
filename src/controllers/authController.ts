    // src/controllers/authController.ts
    import { Request, Response } from "express";
    import jwt from "jsonwebtoken";
    import User, { IUser } from "../models/User";
    import dotenv from "dotenv";

    dotenv.config();

    const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

    export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    try {
        // Check if a user already exists with the same email or username
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
        res.status(400).json({
            message: "User with provided email or username already exists",
        });
        return;
        }

        const newUser: IUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
    };

    export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
        }

        // Create a JWT token with user information
        const token = jwt.sign(
        { id: user._id, username: user.username },
        JWT_SECRET,
        {
            expiresIn: "1h",
        }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
    };

    export const getProfile = async (
    req: Request,
    res: Response
    ): Promise<void> => {
    try {
        // The authenticateJWT middleware attaches a `user` property to `req`
        const user = await User.findById((req as any).user.id).select("-password");
        if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
    };

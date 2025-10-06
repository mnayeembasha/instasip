import { type Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET,NODE_ENV } from "../config";

export const generateTokenAndSetCookie = (userId: string, res: Response) => {
    const token = jwt.sign({ userId }, JWT_SECRET!, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // prevent XSS attacks
        secure: NODE_ENV === "production", 
        sameSite: NODE_ENV === "production" ? "none" : "lax",
    });
};

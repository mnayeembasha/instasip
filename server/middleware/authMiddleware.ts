import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { User } from "../models/User";

interface CustomJWTPayload extends JwtPayload {
    userId: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }
        const decodedData = jwt.verify(token, JWT_SECRET!) as CustomJWTPayload;
        if (!decodedData) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        const user = await User.findById(decodedData.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User Not Found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in auth middleware", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


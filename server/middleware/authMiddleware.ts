import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { User } from "../models/User";
import redisClient from "../lib/redisClient";

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

        const cacheKey = `user:${decodedData.userId}`;
        
        const cachedUserData = await redisClient.get(cacheKey);
        let userData;
        
        if (cachedUserData) {
            userData = JSON.parse(cachedUserData);
        } else {
            userData = await User.findById(decodedData.userId).select("-password");
            if (!userData) {
                return res.status(401).json({ message: "Unauthorized - User Not Found" });
            }
            await redisClient.setEx(cacheKey, 180, JSON.stringify(userData));
        }

        req.user = userData;
        next();
    } catch (error) {
        console.error("Error in auth middleware", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
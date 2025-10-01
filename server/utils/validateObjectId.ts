import mongoose from "mongoose";
import { type Response } from "express";

export function validateObjectId(id: string, errorMessage:string,res: Response): boolean {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: errorMessage });
        return false;
    }
    return true;
}

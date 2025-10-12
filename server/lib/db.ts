import mongoose from 'mongoose';
import { MONGODB_URI } from '../config';
let isConnected = false;

export const connectDB = async (): Promise<void> => {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log(`MongoDB connected`);
         isConnected = true;
    } catch (error) {
        console.error(`Database connection error: ${error}`);
        throw error;
    }
};

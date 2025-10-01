import mongoose from 'mongoose';
import { MONGODB_URI } from '../config';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log(`MongoDB connected`);
    } catch (error) {
        console.error(`Database connection error: ${error}`);
        process.exit(1);
    }
};
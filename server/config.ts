import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const NODE_ENV  = process.env.NODE_ENV;
export const JWT_SECRET = process.env.JWT_SECRET;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
export const DEFAULT_PRODUCT_IMAGE = "https://via.placeholder.com/400x400/cccccc/ffffff?text=Product+Image";

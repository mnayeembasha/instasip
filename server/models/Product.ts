import mongoose from 'mongoose';
import { DEFAULT_PRODUCT_IMAGE } from '../config';

export interface ProductDocument extends mongoose.Document {
    name: string;
    price: number;
    description: string;
    image: string;
    imagePublicId:string;
    stock: number;
    category: string;
    isActive: boolean;
}

const productSchema = new mongoose.Schema<ProductDocument>({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 1000
    },
    image: {
        type: String,
        default: DEFAULT_PRODUCT_IMAGE
    },
    imagePublicId: {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Product = mongoose.model<ProductDocument>("Product", productSchema);
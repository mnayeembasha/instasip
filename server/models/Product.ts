import mongoose from "mongoose";
import { DEFAULT_PRODUCT_IMAGE } from "../config";
import { generateSlug, sluggify } from "../utils/generateSlug";

export interface ProductDocument extends mongoose.Document {
  name: string;
  slug: string;
  price: number;
  description: string;
  image: string;
  imagePublicId: string;
  stock: number;
  category: string;
  isActive: boolean;
}

const productSchema = new mongoose.Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      unique: true,
      // required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    image: {
      type: String,
      default: DEFAULT_PRODUCT_IMAGE,
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", async function (next) {
  if (this.isNew && !this.slug) {
    const baseSlug = sluggify(this.name);
    let slug = baseSlug;

    const ProductModel = mongoose.models.Product;
    if (!ProductModel) {
      return next(new Error("Product model is not defined"));
    }

    const existingSlugs = await ProductModel.find({
      slug: new RegExp(`^${baseSlug}(-\\d+)?$`),
    }).select("slug");

    if (existingSlugs.length > 0) {
      const numbers = existingSlugs
        .map((doc) => {
          const slug = doc.slug;
            if (!slug) return 0;
            const match = slug.match(/-(\d+)$/);
            return match ? parseInt(match[1], 10) : 0;

        })
        .sort((a, b) => a - b);

      const lastNumber = numbers.length >0 ? numbers[numbers.length - 1]:0;
      const nextNumber = lastNumber ? lastNumber + 1 : 1;
      slug = `${baseSlug}-${nextNumber}`;
    }

    this.slug = slug;
    next();
  }
  next();
});
export const Product = mongoose.model<ProductDocument>("Product",productSchema);

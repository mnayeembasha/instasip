import mongoose from "mongoose";

export interface CartItemDocument {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface CartDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  items: CartItemDocument[];
  updatedAt: Date;
  createdAt: Date;
}

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema<CartDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
cartSchema.index({ user: 1 });

export const Cart = mongoose.model<CartDocument>("Cart", cartSchema);

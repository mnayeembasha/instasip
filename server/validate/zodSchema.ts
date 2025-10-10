import { z } from "zod";

export const registerZodSchema = z.object({
    name: z.string({ message: "Name is required" })
           .min(2, "Name should contain at least 2 characters")
           .max(50, "Name should not exceed 50 characters"),
    phone: z.string({ message: "Phone is required" })
            .length(10, "Phone number should contain 10 digits")
            .regex(/^[+]?[\d\s-()]+$/, "Invalid phone number format"),
    password: z.string({ message: "Password is required" })
               .min(6, "Password should contain at least 6 characters"),
});

export const loginZodSchema = z.object({
    phone: z.string({ message: "Phone is required" })
            .length(10, "Phone number should contain 10 digits")
            .regex(/^[+]?[\d\s-()]+$/, "Invalid phone number format"),
    password: z.string({ message: "Password is required" })
        .min(6, "Password should contain at least 6 characters"),
});

export const productCreateZodSchema = z.object({
    name: z.string({ message: "Product name is required" })
        .min(2, "Product name should contain at least 2 characters")
        .max(100, "Product name should not exceed 100 characters"),
    price: z.number({ message: "Price should be valid number" })
        .min(0, "Price cannot be negative"),
    description: z.string({ message: "Description is required" })
        .min(10, "Description should contain at least 10 characters")
        .max(1000, "Description should not exceed 1000 characters"),
    image: z.string().optional(),
    stock: z.number({ message: "Stock Quantity should be valid number" })
        .min(0, "Stock cannot be negative"),
    category: z.string({ message: "Category is required" })
        .min(2, "Category should contain at least 2 characters"),
});

export const orderCreateZodSchema = z.object({
    items: z.array(z.object({
        product: z.string({ message: "Product ID is required" }),
        quantity: z.number({ message: "Quantity is required" })
            .min(1, "Quantity should be at least 1"),
    })).min(1, "At least one item is required"),
    shippingAddress: z.object({
        street: z.string({ message: "Street address is required" }),
        city: z.string({ message: "City is required" }),
        state: z.string({ message: "State is required" }),
        zipCode: z.string({ message: "Zip code is required" }),
        country: z.string().optional(),
    }),
    razorpayOrderId: z.string({ message: "Payment order ID is required" }),
    razorpayPaymentId: z.string({ message: "Payment ID is required" }),
    razorpaySignature: z.string({ message: "Payment signature is required" }),
});

export const addToCartZodSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").int("Quantity must be an integer"),
});

export const updateCartItemZodSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1").int("Quantity must be an integer"),
});
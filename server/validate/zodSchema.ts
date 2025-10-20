import { z } from "zod";

export const registerZodSchema = z.object({
    name: z.string({ message: "Name is required" })
           .min(2, "Name should contain at least 2 characters")
           .max(50, "Name should not exceed 50 characters"),
    email: z.string({ message: "Email is required" })
           .email({message:"Email should be valid"}),
    phone: z.string({message:"Phone Number is required"})
            .regex(/^\d{10}$/, "Phone Number must be exactly 10 digits"),
    password: z.string({ message: "Password is required" })
               .min(6, "Password should contain at least 6 characters"),
});

export const loginZodSchema = z.object({
    phone: z.string({message:"Phone Number is required"})
            .regex(/^\d{10}$/, "Phone Number must be exactly 10 digits"),
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
        street: z.string({ message: "Street address is required" })
            .trim()
            .min(10, "Street address must be at least 10 characters")
            .max(200, "Street address cannot exceed 200 characters"),
            // .regex(/^[a-zA-Z0-9\s,.\-#/]+$/, "Street address contains invalid characters"),
        
        city: z.string({ message: "City is required" })
            .trim()
            .min(2, "City name must be at least 2 characters")
            .max(100, "City name cannot exceed 100 characters")
            .regex(/^[a-zA-Z\s]+$/, "City name should contain only letters"),
        
        state: z.string({ message: "State is required" })
            .trim()
            .min(2, "State name must be at least 2 characters")
            .max(100, "State name cannot exceed 100 characters")
            .regex(/^[a-zA-Z\s]+$/, "State name should contain only letters"),
        
        zipCode: z.string({ message: "ZIP/PIN code is required" })
            .trim()
            .regex(/^[1-9][0-9]{5}$/, "Invalid PIN code. Must be 6 digits and cannot start with 0"),
        
        country: z.string()
            .default("India")
            .optional()
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
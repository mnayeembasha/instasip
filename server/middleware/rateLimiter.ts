import rateLimit from 'express-rate-limit';
import {type Request} from "express";

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many login attempts. Please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

// export const orderRateLimiter = rateLimit({
//     windowMs: 60 * 60 * 1000, // 1 hour
//     max: 10, // 10 orders per hour
//     message: 'Too many orders. Please try again later.',
//     skip: (req:Request) => req.user?.isAdmin, // Skip for admins
// });

export const paymentRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30, // 30 payment attempts per hour
    message: 'Too many payment attempts. Please contact support.',
});
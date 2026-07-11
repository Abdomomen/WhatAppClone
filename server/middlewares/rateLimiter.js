import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 10, 
    message: { message: "Too many requests from this IP, please try again later" }, 
    standardHeaders: 'draft-7', 
    legacyHeaders: false, 
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    limit: 100, 
    message: { message: "Too many requests from this IP, please try again later" },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

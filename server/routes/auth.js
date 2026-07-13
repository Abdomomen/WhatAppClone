import { Router } from "express";
import { login, logout, register, refershToken } from "../controllers/auth.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { loginSchema,registerSchema } from "../validation/auth.js";
import validate from "../middlewares/validation.js";
const userRouter= Router()


userRouter.post("/register",authLimiter,validate(registerSchema),register)
userRouter.post("/login",authLimiter,validate(loginSchema),login)
userRouter.post("/refresh",refershToken)
userRouter.post("/logout",logout)

export default userRouter
import { Router } from "express";
import { login, logout, register, refershToken } from "../controllers/auth.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const userRouter= Router()


userRouter.post("/register",authLimiter,register)
userRouter.post("/login",authLimiter,login)
userRouter.post("/refershToken",refershToken)
userRouter.post("/logout",logout)

export default userRouter
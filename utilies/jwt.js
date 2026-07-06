import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const generateAccessToken=(payload)=>{
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"15m"})
}
const generateRefreshToken=(payload)=>{
    return jwt.sign(payload,process.env.JWT_REFRESH,{expiresIn:"7d"})
}

const verifyToken=(token)=>{
    return jwt.verify(token,process.env.JWT_SECRET)
}

const verifyRefreshToken=(token)=>{
    return jwt.verify(token,process.env.JWT_REFRESH)
}

export {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken
}

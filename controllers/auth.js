
import asyncWrapper from "../middlewares/asyncWrapper.js"

import {authServices} from "../services/auth.js"
// auth 


const login=asyncWrapper(async(req,res)=>{
    let {email,password} = req.body
    let result=await authServices.login({email,password})
    res.cookie("refreshToken",result.refreshToken,{httpOnly:true,secure:true,sameSite:"strict",maxAge:7*24*60*60*1000})
    res.status(200).json({
        success:true,
        user:result.user,
        accessToken:result.accessToken,
    })
})


const register=asyncWrapper(async(req,res)=>{
    let {name,username,password,email,bio} = req.body
    let result=await authServices.register({name,username,password,email,bio})
    res.cookie("refreshToken",result.refreshToken,{httpOnly:true,secure:true,sameSite:"strict",maxAge:7*24*60*60*1000})
    res.status(201).json({
        success:true,
        user:result.user,
        accessToken:result.accessToken,
    })
})

const refershToken=asyncWrapper(async(req,res)=>{
    let {refreshToken} = req.cookies
    let result=await authServices.refershToken({refreshToken})
    res.cookie("refreshToken",result.refreshToken,{httpOnly:true,secure:true,sameSite:"strict",maxAge:7*24*60*60*1000})
    res.status(200).json({
        success:true,
        user:result.user,
        accessToken:result.accessToken,
    })
})

const logout= asyncWrapper(async (req,res)=>{
    let {refreshToken} = req.cookies
    let result=await authServices.logout({refreshToken})
    res.clearCookie("refreshToken")
    res.status(200).json({
        success:true,
        message:"Logout successfully"
    })
})

export {
    login,
    register,
    refershToken,
    logout
}
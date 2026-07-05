import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import http from "http"
import initWebSocketServer from "./ws/server.js"
import globalError from "./middlewares/error.js"
import authRouter from "./routes/auth.js"
const app= express();
const server= http.createServer(app)
initWebSocketServer(server)

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use("/api/v1/auth",userRouter)
app.use(globalError)
server.listen(3000,()=>{
    console.log("server is running on port 3000")
})

// todo list 
// 1. define the project structure / pattern design 
// 2: install socket.io or ws 
// 3: install cloudinary 

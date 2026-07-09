import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import initWebSocketServer from "./ws/server.js";
import globalError from "./middlewares/error.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import groupRouter from "./routes/group.js";
import { connectDB } from "./db/connectDb.js";
import conversationRouter from "./routes/conversation.js";
// connect to DB
connectDB();
const app = express();
const server = http.createServer(app);
initWebSocketServer(server);

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/groups", groupRouter);
app.use("/api/v1/conversations",conversationRouter)
app.use(globalError);

server.listen(3000, () => {
  console.log("server is running on port 3000");
});
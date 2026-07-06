import { WebSocketServer } from "ws";
import {verifyToken} from "../utilies/jwt.js  "
import manager from "./wsManager.js";
function initWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ server: httpServer });
  wss.on("connection", (ws,req) => {
    let url= new URL(req.url,`http://localhost:3000`)
    let token=url.searchParams.get("token")
    let user=verifyToken(token)
    if(!user){
      ws.close()
      return
    }
    ws.userId=user.id
    console.log("client connected");
    manager.set(user.id,new Set())
    manager.get(ws.userId).add(ws)
    ws.on("message", (message) => {
      console.log("Received message:", message.toString());
      // Echo message back to the client
      ws.send(`Echo: ${message.toString()}`);
    });
  });
}

export default initWebSocketServer;

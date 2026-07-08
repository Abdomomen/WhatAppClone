import { WebSocketServer } from "ws";
import {verifyToken} from "../utilies/jwt.js"
import manager from "./wsManager.js";
// helper functions 

function sendJson(ws,msg){
  ws.send(JSON.stringify(msg))
}



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
    if(manager.has(user.id)){
      manager.get(user.id).add(ws)
    }else{
      manager.set(user.id,new Set())
      manager.get(user.id).add(ws)
    }
    ws.on("message", (message) => {
      console.log("Received message:", message.toString());
      // Echo message back to the client
      ws.send(`Echo: ${message.toString()}`);
    });

    ws.on("close", () => {
      console.log("client disconnected");
      let sockets=manager.get(ws.userId)
      if(!sockets) return 
      sockets.delete(ws)
      if(sockets.size===0){
        manager.delete(ws.userId)
      }
    });

    ws.on("error",(err)=>{
      console.log("error",err)
    })
  });
}

export default initWebSocketServer;

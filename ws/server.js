import { WebSocketServer } from "ws";

function initWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ server: httpServer });
  wss.on("connection", (ws) => {
    console.log("client connected");
    ws.on("message", (message) => {
      console.log("Received message:", message.toString());
      // Echo message back to the client
      ws.send(`Echo: ${message.toString()}`);
    });
  });
}

export default initWebSocketServer;

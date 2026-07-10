import { WebSocketServer } from "ws";
import { verifyToken } from "../utilies/jwt.js";
import manager from "./wsManager.js";
import messageHandler from "./handlers/message.js";

function initWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://localhost:3000`);
    const token = url.searchParams.get("token");

    let user;
    try {
      user = verifyToken(token);
    } catch {
      ws.close(4001, "Unauthorized");
      return;
    }

    ws.userId = user.id;
    console.log(`Client connected: ${user.id}`);

    if (manager.has(user.id)) {
      manager.get(user.id).add(ws);
    } else {
      manager.set(user.id, new Set([ws]));
    }

    ws.on("message", (raw) => messageHandler(ws, raw));

    ws.on("close", () => {
      console.log(`Client disconnected: ${user.id}`);
      const sockets = manager.get(ws.userId);
      if (!sockets) return;
      sockets.delete(ws);
      if (sockets.size === 0) {
        manager.delete(ws.userId);
      }
    });

    ws.on("error", (err) => {
      console.error(`WS error for user ${ws.userId}:`, err.message);
    });
  });
}

export default initWebSocketServer;

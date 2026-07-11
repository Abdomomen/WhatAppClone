import msgServices from "../../services/message.js";
import conversationStateServices from "../../services/conversationState.js";

function sendJson(ws, msg) {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify(msg));
  }
}

async function messageHandler(ws, raw) {
  let data;
  try {
    data = JSON.parse(raw.toString());
  } catch {
    return sendJson(ws, { type: "error", message: "Invalid JSON" });
  }

  const { type } = data;

  if (type === "sendPrivate") return msgServices.sendPrivate(ws, data);
  if (type === "sendGroup") return msgServices.sendGroup(ws, data);
  if (type === "editMsg") return msgServices.editMsg(ws, data);
  if (type === "deleteMsg") return msgServices.deleteMsg(ws, data);
  if (type === "typing") return msgServices.typing(ws, data);
  if (type === "stopTyping") return msgServices.stopTyping(ws, data);
  if (type === "markAsRead") return handleMarkAsRead(ws, data);

  sendJson(ws, { type: "error", message: `Unknown event type: "${type}"` });
}

async function handleMarkAsRead(ws, data) {
  try {
    const { conversationId, messageId } = data;
    if (!conversationId || !messageId) {
      return sendJson(ws, {
        type: "error",
        message: "markAsRead requires conversationId and messageId",
      });
    }

    await conversationStateServices.markAsRead(
      ws.userId,
      conversationId,
      messageId,
    );

    await msgServices.broadcastReadReceipt(ws, conversationId, messageId);
  } catch (err) {
    sendJson(ws, { type: "error", message: err.message });
    console.error("Error in markAsRead handler:", err);
  }
}

export default messageHandler;

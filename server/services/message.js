import Message from "../models/msg.js";
import Conversation from "../models/conversation.js";
import Group from "../models/group.js";
import manager from "../ws/wsManager.js";
import { WebSocket } from "ws";
import conversationStateServices from "./conversationState.js";
// helper functions
async function getConversationMembers(conversation) {
  if (conversation.type === "private") {
    return conversation.members.map((id) => id.toString());
  } else {
    let group = await Group.findById(conversation.group);
    if (!group) throw new Error("group not found 🤷‍♀️");
    return group.members.map((id) => id.toString());
  }
}

function sendMsgToUser(userId, msg, type = "newMsg") {
  let sockets = manager.get(userId);
  if (sockets) {
    for (let s of sockets) {
      if (s.readyState === 1) {
        s.send(
          JSON.stringify({
            type,
            data: msg,
          }),
        );
      }
    }
  }
}

const msgServices = {
  sendPrivate: async (ws, data) => {
    try {
      if (data.conversation) {
        let conversation = await Conversation.findById(data.conversation);
        if (!conversation) throw new Error("conversation not found 🤷‍♀️");

        const memberIds = conversation.members.map((id) => id.toString());
        if (!memberIds.includes(ws.userId))
          throw new Error(
            "Conversation Error: You are not a member of this conversation",
          );

        const toUser = data.to || memberIds.find((id) => id !== ws.userId);
        if (!toUser) throw new Error("Recipient not found in conversation");

        let formatedMsg = {
          sender: ws.userId,
          conversation: data.conversation,
          content: data.content,
        };

        let msg = await Message.create(formatedMsg);
        conversation.lastMessage = msg._id;
        await Promise.all([
          conversation.save(),
          // Sender has read their own message by definition
          conversationStateServices.markAsRead(
            ws.userId,
            data.conversation,
            msg._id,
          ),
        ]);
        sendMsgToUser(ws.userId, msg);
        sendMsgToUser(toUser, msg);
      } else {
        if (!data.to)
          throw new Error(
            "Recipient user ID (to) is required to start a conversation",
          );

        let existenceConversation = await Conversation.findOne({
          type: "private",
          members: {
            $all: [ws.userId, data.to],
            $size: 2,
          },
        });
        if (existenceConversation) {
          let msg = await Message.create({
            sender: ws.userId,
            conversation: existenceConversation._id,
            content: data.content,
          });
          existenceConversation.lastMessage = msg._id;
          await Promise.all([
            existenceConversation.save(),
            conversationStateServices.markAsRead(
              ws.userId,
              existenceConversation._id,
              msg._id,
            ),
          ]);
          sendMsgToUser(ws.userId, msg);
          sendMsgToUser(data.to, msg);
          return;
        }
        let conversation = new Conversation({
          type: "private",
          members: [ws.userId, data.to],
        });
        let msg = await Message.create({
          sender: ws.userId,
          conversation: conversation._id,
          content: data.content,
        });
        conversation.lastMessage = msg._id;
        await Promise.all([
          conversation.save(),
          // New conversation: create state docs for both users
          conversationStateServices.createStatesForPrivate(
            ws.userId,
            data.to,
            conversation._id,
          ),
          // Sender has already read their own first message
          conversationStateServices.markAsRead(
            ws.userId,
            conversation._id,
            msg._id,
          ),
        ]);
        sendMsgToUser(ws.userId, msg);
        sendMsgToUser(data.to, msg);
      }
    } catch (error) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: error.message,
          }),
        );
      }
      console.error("Error in sendPrivate:", error);
    }
  },
  sendGroup: async (ws, data) => {
    try {
      let { conversationId, content } = data;
      let conversation = await Conversation.findById(conversationId);
      if (!conversation) throw new Error("conversation not found 🤷‍♀️");
      if (conversation.type !== "group")
        throw new Error("conversation is not a group 🤷‍♀️");
      let group = await Group.findById(conversation.group);
      if (!group) throw new Error("group not found 🤷‍♀️");
      let membersId = group.members.map((i) => i.toString());
      if (!membersId.includes(ws.userId))
        throw new Error("you are not a member of this group 🤷‍♀️");
      let msg = await Message.create({
        sender: ws.userId,
        conversation: conversationId,
        content,
      });
      conversation.lastMessage = msg._id;
      await conversation.save();
      for (let id of membersId) {
        sendMsgToUser(id, msg);
      }
    } catch (error) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: error.message,
          }),
        );
      }
      console.error("Error in sendGroup:", error);
    }
  },
  editMsg: async (ws, data) => {
    try {
      let { messageId, content } = data;
      let msg = await Message.findById(messageId);
      if (!msg) throw new Error("message not found 🤷‍♀️");
      if (msg.sender.toString() !== ws.userId)
        throw new Error("you are not the sender of this message 🤷‍♀️");
      msg.content = content;
      await msg.save();
      let conversation = await Conversation.findById(msg.conversation);
      if (!conversation) throw new Error("conversation not found 🤷‍♀️");

      let membersId = await getConversationMembers(conversation);
      for (let id of membersId) {
        sendMsgToUser(id, msg, "message_updated");
      }
    } catch (error) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: error.message,
          }),
        );
      }
      console.error("Error in editMsg:", error);
    }
  },
  deleteMsg: async (ws, data) => {
    try {
      let { messageId } = data;
      let msg = await Message.findById(messageId);
      if (!msg) throw new Error("message not found 🤷‍♀️");
      if (msg.sender.toString() !== ws.userId)
        throw new Error("you are not the sender of this message 🤷‍♀️");
      msg.deleted = true;
      msg.content = "";
      await msg.save();
      let conversation = await Conversation.findById(msg.conversation);
      if (!conversation) throw new Error("conversation not found 🤷‍♀️");

      let memberIds = await getConversationMembers(conversation);
      for (let id of memberIds) {
        sendMsgToUser(id, msg, "message_deleted");
      }
    } catch (error) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: error.message,
          }),
        );
      }
      console.error("Error in deleteMsg:", error);
    }
  },
  typing: async (ws, data) => {
    try {
      let { conversationId, isTyping } = data;
      let conversation = await Conversation.findById(conversationId);
      if (!conversation) throw new Error("conversation not found 🤷‍♀️");
      let memberIds = await getConversationMembers(conversation);
      if (!memberIds.includes(ws.userId))
        throw new Error("you are not a member of this conversation 🤷‍♀️");

      for (let id of memberIds) {
        if (id === ws.userId) continue;
        sendMsgToUser(
          id,
          { conversationId, senderId: ws.userId, isTyping },
          "typing",
        );
      }
    } catch (error) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: error.message,
          }),
        );
      }
      console.error("Error in typing:", error);
    }
  },
  stopTyping: async (ws, data) => {
    try {
      let { conversationId } = data;
      let conversation = await Conversation.findById(conversationId);
      if (!conversation) throw new Error("conversation not found 🤷‍♀️");
      let memberIds = await getConversationMembers(conversation);
      if (!memberIds.includes(ws.userId))
        throw new Error("you are not a member of this conversation 🤷‍♀️");
      for (let id of memberIds) {
        if (id === ws.userId) continue;
        sendMsgToUser(
          id,
          { conversationId, senderId: ws.userId },
          "stopTyping",
        );
      }
    } catch (error) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: error.message,
          }),
        );
      }
      console.error("Error in stopTyping:", error);
    }
  },

  broadcastReadReceipt: async (ws, conversationId, messageId) => {
    let conversation = await Conversation.findById(conversationId);
    if (!conversation) return;
    let memberIds = await getConversationMembers(conversation);
    for (let id of memberIds) {
      if (id === ws.userId) continue;
      sendMsgToUser(
        id,
        { conversationId, readBy: ws.userId, messageId },
        "read_receipt",
      );
    }
  },
};

export default msgServices;

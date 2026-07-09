import Conversation from "../models/conversation.js";

const conversationServices = {
  getConversations: async (userId) => {
    const conversations = await Conversation.find({ members: userId })
      .populate("members", "username profilePicture _id")
      .populate("lastMessage", "content createdAt sender");
    return conversations;
  },

  getConversation: async (userId, conversationId) => {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      members: userId,
    })
      .populate("members", "username profilePicture _id")
      .populate("lastMessage", "content createdAt sender");
    if (!conversation) {
      const err = new Error("Conversation not found");
      err.statusCode = 404;
      throw err;
    }
    return conversation;
  },

  deleteConversation: async (userId, conversationId) => {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      members: userId,
    });
    if (!conversation) {
      const err = new Error("Conversation not found");
      err.statusCode = 404;
      throw err;
    }
    await Conversation.findByIdAndDelete(conversationId);
  },
};

export default conversationServices;

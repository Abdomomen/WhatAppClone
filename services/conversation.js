import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
const conversationServices = {
  getConversations: async (userId) => {
    const conversations = await Conversation.find({ members: userId })
      .populate("members", "username avatar _id")
      .populate("lastMessage", "content createdAt sender");
    return conversations;
  },

  getConversation: async (userId, conversationId) => { // get conversation messages
    // first check if the user is the member of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      members: userId,
    });
    if (!conversation) {
      const err = new Error("Conversation not found");
      err.statusCode = 404;
      throw err;
    }
    // then get the messages
    const messages = await Message.find({
      conversation: conversationId,
    }).sort({createdAt:1}).populate("sender", "username avatar _id")
    return messages;
  },
};

export default conversationServices;

import Conversation from "../models/conversation.js";
import Message from "../models/msg.js";
import conversationStateServices from "./conversationState.js";

const conversationServices = {
  getConversations: async (userId) => {
    const conversations = await Conversation.find({ members: userId })
      .populate("members", "username avatar _id")
      .populate("lastMessage", "content createdAt sender");

    const conversationIds = conversations.map((c) => c._id);
    const unreadMap = await conversationStateServices.getUnreadCountsForUser(
      userId,
      conversationIds,
    );

    return conversations.map((c) => ({
      ...c.toObject(),
      unreadCount: unreadMap.get(c._id.toString()) ?? 0,
    }));
  },

  getConversation: async (userId, conversationId) => {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      members: userId,
    });
    if (!conversation) {
      const err = new Error("Conversation not found");
      err.statusCode = 404;
      throw err;
    }
    const messages = await Message.find({
      conversation: conversationId,
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username avatar _id");
    return messages;
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
    conversation.members = conversation.members.filter(
      (id) => id.toString() !== userId.toString(),
    );
    if (conversation.members.length === 0) {
      await Message.deleteMany({ conversation: conversationId });
      await Conversation.findByIdAndDelete(conversationId);
    } else {
      await conversation.save();
    }
  },
};

export default conversationServices;

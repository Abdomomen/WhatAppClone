import ConversationState from "../models/conversationState.js";
import Message from "../models/msg.js";

const conversationStateServices = {
  
  createState: async (userId, conversationId) => {
    await ConversationState.updateOne(
      { user: userId, conversation: conversationId },
      { $setOnInsert: { user: userId, conversation: conversationId } },
      { upsert: true },
    );
  },

  
  createStatesForPrivate: async (user1Id, user2Id, conversationId) => {
    await Promise.all([
      conversationStateServices.createState(user1Id, conversationId),
      conversationStateServices.createState(user2Id, conversationId),
    ]);
  },

  
  createStateForGroup: async (adminId, conversationId) => {
    await conversationStateServices.createState(adminId, conversationId);
  },

  
  createStateForMember: async (memberId, conversationId) => {
    await conversationStateServices.createState(memberId, conversationId);
  },

  
  markAsRead: async (userId, conversationId, messageId) => {
    await ConversationState.updateOne(
      { user: userId, conversation: conversationId },
      { $set: { lastReadMessage: messageId } },
    );
  },

 
  getUnreadCount: async (userId, conversationId) => {
    const state = await ConversationState.findOne({
      user: userId,
      conversation: conversationId,
    });

    const query = {
      conversation: conversationId,
      sender: { $ne: userId },
    };

    if (state?.lastReadMessage) {
      query._id = { $gt: state.lastReadMessage };
    }

    return Message.countDocuments(query);
  },


  getUnreadCountsForUser: async (userId, conversationIds) => {
    const states = await ConversationState.find({
      user: userId,
      conversation: { $in: conversationIds },
    });

    const stateMap = new Map(
      states.map((s) => [s.conversation.toString(), s.lastReadMessage]),
    );

    const results = await Promise.all(
      conversationIds.map(async (convId) => {
        const lastRead = stateMap.get(convId.toString());
        const query = { conversation: convId, sender: { $ne: userId } };
        if (lastRead) query._id = { $gt: lastRead };
        const count = await Message.countDocuments(query);
        return [convId.toString(), count];
      }),
    );

    return new Map(results);
  },
};

export default conversationStateServices;

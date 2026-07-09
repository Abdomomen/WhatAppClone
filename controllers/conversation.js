import conversationServices from "../services/conversation.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";

const getConversations = asyncWrapper(async (req, res) => {
  const conversations = await conversationServices.getConversations(
    req.user.id,
  );
  res.status(200).json({ success: true, conversations });
});

const getConversation = asyncWrapper(async (req, res) => {
  const conversation = await conversationServices.getConversation(
    req.user.id,
    req.params.conversationId,
  );
  res.status(200).json({ success: true, conversation });
});

const deleteConversation = asyncWrapper(async (req, res) => {
  await conversationServices.deleteConversation(
    req.user.id,
    req.params.conversationId,
  );
  res
    .status(200)
    .json({ success: true, message: "Conversation deleted successfully" });
});

export { getConversations, getConversation, deleteConversation };
        
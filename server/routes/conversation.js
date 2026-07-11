import { Router } from "express";

import verifyJwt from "../middlewares/verifyjwt.js";
import validate from "../middlewares/validation.js";
import {
  getConversation,
  getConversations,
  deleteConversation,
} from "../controllers/conversation.js";
import { generalLimiter } from "../middlewares/rateLimiter.js";
import {
  getConversationSchema,
  deleteConversationSchema,
  getConversationsSchema,
} from "../validation/conversation.js";

const conversationRouter = Router();

conversationRouter.get(
  "/",
  generalLimiter,
  verifyJwt,
  validate(getConversationsSchema),
  getConversations,
);
conversationRouter.get(
  "/:conversationId",
  generalLimiter,
  verifyJwt,
  validate(getConversationSchema),
  getConversation,
);
conversationRouter.delete(
  "/:conversationId",
  generalLimiter,
  verifyJwt,
  validate(deleteConversationSchema),
  deleteConversation,
);

export default conversationRouter;

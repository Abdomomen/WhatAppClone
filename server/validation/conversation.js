import { z } from "zod";

const objectIdSchema = z
  .string()
  .min(1, "ID is required")
  .regex(/^[a-f\d]{24}$/i, "Invalid ID format");

const getConversationSchema = z.object({
  conversationId: objectIdSchema,
});

const deleteConversationSchema = z.object({
  conversationId: objectIdSchema,
});

const getConversationsSchema = z.object({});

export {
  getConversationSchema,
  deleteConversationSchema,
  getConversationsSchema,
};

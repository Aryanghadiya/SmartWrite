
import { z } from "zod";

export const insertConversationSchema = z.object({
  title: z.string(),
});

export const insertMessageSchema = z.object({
  conversationId: z.string(),
  role: z.string(),
  content: z.string(),
});

export type Conversation = {
  id: string;
  title: string;
  createdAt: Date;
};

export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  createdAt: Date;
};

export type InsertMessage = z.infer<typeof insertMessageSchema>;

export const conversations = {};
export const messages = {};

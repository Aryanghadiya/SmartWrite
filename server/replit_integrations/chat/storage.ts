
import { Conversation, Message } from "../../models";

export interface IChatStorage {
  getConversation(id: string): Promise<any | undefined>;
  getAllConversations(): Promise<any[]>;
  createConversation(title: string): Promise<any>;
  deleteConversation(id: string): Promise<void>;
  getMessagesByConversation(conversationId: string): Promise<any[]>;
  createMessage(conversationId: string, role: string, content: string): Promise<any>;
}

export const chatStorage: IChatStorage = {
  async getConversation(id: string) {
    try {
      const conversation = await Conversation.findById(id);
      return conversation;
    } catch (error) {
      return undefined;
    }
  },

  async getAllConversations() {
    return await Conversation.find().sort({ createdAt: -1 });
  },

  async createConversation(title: string) {
    const conversation = new Conversation({ title });
    return await conversation.save();
  },

  async deleteConversation(id: string) {
    await Message.deleteMany({ conversationId: id });
    await Conversation.findByIdAndDelete(id);
  },

  async getMessagesByConversation(conversationId: string) {
    return await Message.find({ conversationId }).sort({ createdAt: 1 });
  },

  async createMessage(conversationId: string, role: string, content: string) {
    const message = new Message({ conversationId, role, content });
    return await message.save();
  },
};

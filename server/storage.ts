
import { User, Document, Analysis } from "./models";
import { type InsertUser, type InsertDocument } from "../shared/schema";

export interface IStorage {
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: InsertUser): Promise<any>;
  getDocument(id: string): Promise<any | undefined>;
  createDocument(doc: InsertDocument): Promise<any>;
  updateDocument(id: string, doc: Partial<InsertDocument>): Promise<any | undefined>;
  createAnalysis(analysis: any): Promise<any>;
  getAnalysesByUserId(userId: string): Promise<any[]>;
}

export class MongoStorage implements IStorage {
  async getUser(id: string): Promise<any | undefined> {
    const user = await User.findById(id);
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    const user = await User.findOne({ username });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<any> {
    const user = new User(insertUser);
    return await user.save();
  }

  async getDocument(id: string): Promise<any | undefined> {
    try {
      const doc = await Document.findById(id);
      return doc || undefined;
    } catch (error) {
      return undefined;
    }
  }

  async createDocument(doc: InsertDocument): Promise<any> {
    const newDoc = new Document(doc);
    return await newDoc.save();
  }

  async updateDocument(id: string, doc: Partial<InsertDocument>): Promise<any | undefined> {
    try {
      const updatedDoc = await Document.findByIdAndUpdate(id, doc, { new: true });
      return updatedDoc || undefined;
    } catch (error) {
      return undefined;
    }
  }

  async createAnalysis(analysis: any): Promise<any> {
    const newAnalysis = new Analysis(analysis);
    return await newAnalysis.save();
  }

  async getAnalysesByUserId(userId: string): Promise<any[]> {
    return await Analysis.find({ userId }).sort({ createdAt: -1 });
  }
}

export const storage = new MongoStorage();

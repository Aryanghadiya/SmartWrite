
import { z } from "zod";

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = InsertUser & { id: string };

export const insertDocumentSchema = z.object({
  title: z.string().default("Untitled Document"),
  content: z.string().default(""),
  audience: z.string().default("general"),
  relationship: z.string().default("peer"),
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = InsertDocument & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export const analysisResultSchema = z.object({
  grammar: z.object({
    errors: z.array(z.object({
      text: z.string(),
      suggestion: z.string(),
      explanation: z.string(),
      type: z.enum(["grammar", "spelling", "punctuation", "style"]),
      startIndex: z.number(),
      endIndex: z.number(),
    })),
  }),
  tone: z.object({
    detected: z.string(),
    confidence: z.number(),
    breakdown: z.record(z.number()),
  }),
  scores: z.object({
    clarity: z.number(),
    grammar: z.number(),
    confidence: z.number(),
    engagement: z.number(),
    professionalism: z.number(),
    readability: z.number(),
    overall: z.number(),
  }),
  readability: z.object({
    issues: z.array(z.object({
      type: z.enum(["wordy", "passive", "jargon", "repeated", "confusing"]),
      text: z.string(),
      suggestion: z.string(),
      startIndex: z.number(),
      endIndex: z.number(),
    })),
  }),
  emotions: z.object({
    detected: z.array(z.string()),
    regretRisk: z.enum(["low", "medium", "high"]),
    warning: z.string().optional(),
  }),
  intentAnalysis: z.object({
    intendedMeaning: z.string(),
    perceivedMeaning: z.string(),
    warnings: z.array(z.object({
      type: z.enum(["rude", "passive_aggressive", "insecure", "over_apologizing", "dominant"]),
      description: z.string(),
    })),
  }),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export const insertAnalysisSchema = z.object({
  userId: z.string(),
  originalText: z.string(),
  result: analysisResultSchema,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = InsertAnalysis & { id: string; createdAt: Date };

export const readerReactionSchema = z.object({
  reactions: z.array(z.object({
    audience: z.string(),
    emotionalReaction: z.string(),
    riskLevel: z.enum(["low", "medium", "high"]),
    saferRewrite: z.string(),
  })),
});

export type ReaderReaction = z.infer<typeof readerReactionSchema>;

export const toneTransformSchema = z.object({
  rewritten: z.string(),
  changes: z.array(z.string()),
});

export type ToneTransform = z.infer<typeof toneTransformSchema>;

// Chat models
export const insertConversationSchema = z.object({
  title: z.string(),
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = InsertConversation & {
  id: string;
  createdAt: Date;
};

export const insertMessageSchema = z.object({
  conversationId: z.string(),
  role: z.string(),
  content: z.string(),
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = InsertMessage & {
  id: string;
  createdAt: Date;
};

// Mock objects for compatibility if needed, though they shouldn't be used
export const users = {};
export const documents = {};
export const conversations = {};
export const messages = {};

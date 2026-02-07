import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/chat";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Untitled Document"),
  content: text("content").notNull().default(""),
  audience: text("audience").default("general"),
  relationship: text("relationship").default("peer"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

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

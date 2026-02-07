import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import {
  ANALYSIS_SYSTEM_PROMPT,
  REACTIONS_SYSTEM_PROMPT,
  TONE_TRANSFORM_PROMPT,
  PARAPHRASE_PROMPT,
  SUMMARIZE_PROMPT,
  CHAT_SYSTEM_PROMPT,
} from "./ai-prompts";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { text, audience = "general", relationship = "peer" } = req.body;

      if (!text || text.trim().length < 5) {
        return res.status(400).json({ error: "Text must be at least 5 characters" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content: ANALYSIS_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `Analyze the following text. Target audience: ${audience}. Relationship: writing to a ${relationship}.\n\nText:\n${text}`,
          },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 4096,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "No response from AI" });
      }

      const analysis = JSON.parse(content);
      res.json(analysis);
    } catch (error: any) {
      console.error("Analysis error:", error?.message || error);
      res.status(500).json({ error: "Analysis failed. Please try again." });
    }
  });

  app.post("/api/ai/reactions", async (req, res) => {
    try {
      const { text, audiences = ["recruiter", "manager", "professor", "client", "teammate"] } = req.body;

      if (!text || text.trim().length < 5) {
        return res.status(400).json({ error: "Text must be at least 5 characters" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content: REACTIONS_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `Analyze how each of these audiences would react to this text: ${audiences.join(", ")}.\n\nText:\n${text}`,
          },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 4096,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "No response from AI" });
      }

      const reactions = JSON.parse(content);
      res.json(reactions);
    } catch (error: any) {
      console.error("Reactions error:", error?.message || error);
      res.status(500).json({ error: "Reaction prediction failed." });
    }
  });

  app.post("/api/ai/transform-tone", async (req, res) => {
    try {
      const { text, targetTone } = req.body;

      if (!text || !targetTone) {
        return res.status(400).json({ error: "Text and targetTone are required" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content: TONE_TRANSFORM_PROMPT,
          },
          {
            role: "user",
            content: `Rewrite this text in a ${targetTone} tone:\n\n${text}`,
          },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 2048,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "No response from AI" });
      }

      const result = JSON.parse(content);
      res.json(result);
    } catch (error: any) {
      console.error("Tone transform error:", error?.message || error);
      res.status(500).json({ error: "Tone transformation failed." });
    }
  });

  app.post("/api/ai/paraphrase", async (req, res) => {
    try {
      const { text } = req.body;

      if (!text || text.trim().length < 5) {
        return res.status(400).json({ error: "Text must be at least 5 characters" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: PARAPHRASE_PROMPT },
          { role: "user", content: text },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 2048,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "No response from AI" });
      }

      const result = JSON.parse(content);
      res.json(result);
    } catch (error: any) {
      console.error("Paraphrase error:", error?.message || error);
      res.status(500).json({ error: "Paraphrasing failed." });
    }
  });

  app.post("/api/ai/summarize", async (req, res) => {
    try {
      const { text } = req.body;

      if (!text || text.trim().length < 20) {
        return res.status(400).json({ error: "Text must be at least 20 characters" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: SUMMARIZE_PROMPT },
          { role: "user", content: text },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 1024,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "No response from AI" });
      }

      const result = JSON.parse(content);
      res.json(result);
    } catch (error: any) {
      console.error("Summarize error:", error?.message || error);
      res.status(500).json({ error: "Summarization failed." });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, writingContext = "", history = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const messages: any[] = [
        {
          role: "system",
          content: `${CHAT_SYSTEM_PROMPT}\n\nUser's current writing:\n${writingContext || "(No writing context provided)"}`,
        },
        ...history.slice(-10).map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
        { role: "user", content: message },
      ];

      const stream = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages,
        stream: true,
        max_completion_tokens: 2048,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error("Chat error:", error?.message || error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Chat failed" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Chat failed." });
      }
    }
  });

  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateMoodboardRequestSchema } from "@shared/schema";
import { generateMoodboard } from "./services/unsplash";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/generate", async (req, res) => {
    try {
      const parsed = generateMoodboardRequestSchema.safeParse(req.body);
      
      if (!parsed.success) {
        const error = fromError(parsed.error);
        return res.status(400).json({ error: error.message });
      }

      const { prompt } = parsed.data;
      const result = await generateMoodboard(prompt);
      
      return res.json(result);
    } catch (error) {
      console.error("Error generating moodboard:", error);
      return res.status(500).json({ 
        error: "Failed to generate moodboard. Please try again." 
      });
    }
  });

  return httpServer;
}

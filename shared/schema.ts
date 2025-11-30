import { z } from "zod";

export const moodboardImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
  photographer: z.string().optional(),
  photographerUrl: z.string().url().optional(),
});

export const generateMoodboardRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(200, "Prompt too long"),
});

export const generateMoodboardResponseSchema = z.object({
  images: z.array(moodboardImageSchema),
  prompt: z.string(),
});

export type MoodboardImage = z.infer<typeof moodboardImageSchema>;
export type GenerateMoodboardRequest = z.infer<typeof generateMoodboardRequestSchema>;
export type GenerateMoodboardResponse = z.infer<typeof generateMoodboardResponseSchema>;

export const presets = [
  { id: "minimalist", label: "Minimalist", prompt: "Minimalist clean design, white space, simple shapes, modern aesthetic" },
  { id: "retro", label: "Retro", prompt: "Retro vintage 80s aesthetic, neon signs, old school vibes, nostalgic" },
  { id: "nature", label: "Nature", prompt: "Lush nature landscape, green forests, peaceful scenery, organic beauty" },
  { id: "industrial", label: "Industrial", prompt: "Industrial urban architecture, concrete, steel, raw textures, warehouses" },
  { id: "cyberpunk", label: "Cyberpunk", prompt: "Cyberpunk city at night, neon lights, futuristic technology, dystopian" },
  { id: "vaporwave", label: "Vaporwave", prompt: "Vaporwave aesthetic, pink and purple gradients, retro computers, palm trees" },
] as const;

export type PresetId = typeof presets[number]["id"];

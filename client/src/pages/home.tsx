import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { HeroSection } from "@/components/hero-section";
import { PromptInput } from "@/components/prompt-input";
import { PresetButtons } from "@/components/preset-buttons";
import { MoodboardGrid } from "@/components/moodboard-grid";
import { type MoodboardImage, type GenerateMoodboardResponse } from "@shared/schema";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<MoodboardImage[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (promptText: string) => {
      const response = await apiRequest("POST", "/api/generate", { prompt: promptText });
      const data = await response.json();
      return data as GenerateMoodboardResponse;
    },
    onSuccess: (data) => {
      setImages(data.images);
      setCurrentPrompt(data.prompt);
      toast({
        title: "Moodboard Generated",
        description: `Created ${data.images.length} images for "${data.prompt}"`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Please type a prompt or select a preset to generate a moodboard.",
        variant: "destructive",
      });
      return;
    }
    generateMutation.mutate(prompt.trim());
  };

  const handlePresetSelect = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="fixed inset-0 grid-pattern opacity-50 pointer-events-none" />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <HeroSection />

        <section className="max-w-4xl mx-auto px-4 md:px-8 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onGenerate={handleGenerate}
              isLoading={generateMutation.isPending}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8"
          >
            <PresetButtons
              onSelect={handlePresetSelect}
              selectedPrompt={prompt}
            />
          </motion.div>
        </section>

        <AnimatePresence mode="wait">
          {(images.length > 0 || generateMutation.isPending) && (
            <motion.section
              key="moodboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-8 pb-24"
            >
              <MoodboardGrid
                images={images}
                isLoading={generateMutation.isPending}
                prompt={currentPrompt}
              />
            </motion.section>
          )}
        </AnimatePresence>

        <footer className="relative z-10 py-12 text-center">
          <p className="text-muted-foreground text-sm">
            Powered by AI imagination. Built with love.
          </p>
        </footer>
      </div>
    </div>
  );
}

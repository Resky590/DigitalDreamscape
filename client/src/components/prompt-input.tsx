import { motion } from "framer-motion";
import { Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export function PromptInput({
  value,
  onChange,
  onGenerate,
  isLoading,
}: PromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      onGenerate();
    }
  };

  return (
    <motion.div
      className="glass rounded-2xl p-6 md:p-8 animate-float"
      style={{ animationDuration: "8s" }}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your vibe... (e.g., Cyberpunk city at night)"
            disabled={isLoading}
            data-testid="input-prompt"
            className="w-full h-14 md:h-16 px-6 bg-slate-800/50 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-base md:text-lg disabled:opacity-50"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        <Button
          onClick={onGenerate}
          disabled={isLoading || !value.trim()}
          data-testid="button-generate"
          className="h-14 md:h-16 px-8 md:px-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-base md:text-lg rounded-xl transition-all duration-300 glow-gradient disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-visible"
        >
          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Generate
              </>
            )}
          </span>
          {!isLoading && (
            <div className="absolute inset-0 rounded-xl animate-pulse-glow opacity-70" />
          )}
        </Button>
      </div>

      <p className="text-muted-foreground text-sm mt-4 text-center md:text-left">
        Tip: Be specific with colors, moods, and styles for better results
      </p>
    </motion.div>
  );
}

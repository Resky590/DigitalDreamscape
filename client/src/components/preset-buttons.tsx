import { motion } from "framer-motion";
import { Minimize2, Clock, TreeDeciduous, Factory, Cpu, Waves } from "lucide-react";
import { presets, type PresetId } from "@shared/schema";

interface PresetButtonsProps {
  onSelect: (prompt: string) => void;
  selectedPrompt: string;
}

const presetIcons: Record<PresetId, typeof Minimize2> = {
  minimalist: Minimize2,
  retro: Clock,
  nature: TreeDeciduous,
  industrial: Factory,
  cyberpunk: Cpu,
  vaporwave: Waves,
};

const presetColors: Record<PresetId, string> = {
  minimalist: "hover:border-slate-400 hover:text-slate-200",
  retro: "hover:border-orange-400 hover:text-orange-300",
  nature: "hover:border-green-400 hover:text-green-300",
  industrial: "hover:border-amber-400 hover:text-amber-300",
  cyberpunk: "hover:border-purple-400 hover:text-purple-300",
  vaporwave: "hover:border-pink-400 hover:text-pink-300",
};

const activeColors: Record<PresetId, string> = {
  minimalist: "border-slate-400 bg-slate-400/10 text-slate-200",
  retro: "border-orange-400 bg-orange-400/10 text-orange-300",
  nature: "border-green-400 bg-green-400/10 text-green-300",
  industrial: "border-amber-400 bg-amber-400/10 text-amber-300",
  cyberpunk: "border-purple-400 bg-purple-400/10 text-purple-300",
  vaporwave: "border-pink-400 bg-pink-400/10 text-pink-300",
};

export function PresetButtons({ onSelect, selectedPrompt }: PresetButtonsProps) {
  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-4">
        Or choose a quick preset:
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {presets.map((preset, index) => {
          const Icon = presetIcons[preset.id];
          const isActive = selectedPrompt === preset.prompt;

          return (
            <motion.button
              key={preset.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => onSelect(preset.prompt)}
              data-testid={`button-preset-${preset.id}`}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full
                border text-sm font-medium
                transition-all duration-300
                ${
                  isActive
                    ? activeColors[preset.id]
                    : `border-white/20 text-muted-foreground ${presetColors[preset.id]}`
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {preset.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

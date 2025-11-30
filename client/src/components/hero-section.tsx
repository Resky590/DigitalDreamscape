import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <header className="pt-16 pb-8 md:pt-24 md:pb-12 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center gap-2 mb-6"
      >
        <div className="relative">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <div className="absolute inset-0 animate-ping">
            <Sparkles className="w-8 h-8 text-purple-400 opacity-20" />
          </div>
        </div>
        <span className="text-sm font-medium uppercase tracking-widest text-purple-400">
          AI Moodboard Generator
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 max-w-5xl mx-auto"
      >
        <span className="text-foreground">AI Powered Design:</span>
        <br />
        <span className="text-gradient animate-gradient-x bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400">
          Curate Your Digital Dreamscape
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
      >
        Generate aesthetic moodboards instantly. Type your own vibe or choose a preset.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-8 flex justify-center gap-4"
      >
        <div className="flex -space-x-2">
          {[
            "bg-gradient-to-br from-purple-500 to-fuchsia-500",
            "bg-gradient-to-br from-cyan-500 to-blue-500",
            "bg-gradient-to-br from-pink-500 to-rose-500",
          ].map((gradient, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
              className={`w-10 h-10 rounded-full ${gradient} border-2 border-background`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground self-center">
          Join 10k+ creators
        </span>
      </motion.div>
    </header>
  );
}

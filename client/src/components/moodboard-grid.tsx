import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import { type MoodboardImage } from "@shared/schema";

interface MoodboardGridProps {
  images: MoodboardImage[];
  isLoading: boolean;
  prompt: string | null;
}

function SkeletonCard({ index }: { index: number }) {
  const heights = ["h-64", "h-80", "h-72", "h-96", "h-64", "h-80"];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`${heights[index % heights.length]} glass rounded-xl overflow-hidden relative`}
    >
      <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    </motion.div>
  );
}

function ImageCard({ image, index }: { image: MoodboardImage; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative rounded-xl overflow-hidden glass"
      data-testid={`card-image-${image.id}`}
    >
      <div className="aspect-[4/5] w-full overflow-hidden">
        <img
          src={image.url}
          alt={image.alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {image.photographer && (
            <p className="text-white/80 text-sm mb-3 truncate">
              Photo by {image.photographer}
            </p>
          )}
          <div className="flex gap-2">
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-view-${image.id}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View
            </a>
            <a
              href={`${image.url}&dl`}
              download
              data-testid={`link-download-${image.id}`}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white hover:from-purple-500 hover:to-cyan-500 transition-all"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
      </div>
    </motion.div>
  );
}

export function MoodboardGrid({ images, isLoading, prompt }: MoodboardGridProps) {
  return (
    <div>
      {prompt && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="text-muted-foreground">Results for </span>
            <span className="text-gradient">"{prompt}"</span>
          </h2>
          <p className="text-muted-foreground text-sm">
            {isLoading ? "Generating your moodboard..." : `${images.length} images curated for you`}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} index={index} />
            ))
          : images.map((image, index) => (
              <ImageCard key={image.id} image={image} index={index} />
            ))}
      </div>
    </div>
  );
}

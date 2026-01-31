import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
// PERBAIKAN DI SINI: Tambahkan 'AnimatePresence'
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, RefreshCw, Wand2, Tv, Zap, Grip, Layers, Monitor, Mountain, Camera, Sparkles, Triangle, User, Info, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Editor() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageStats, setImageStats] = useState({ width: 0, height: 0 });

  const [settings, setSettings] = useState({
    pixelate: 0, noise: 0, rgbShift: 0, scanlines: 0, vignette: 0,
    brightness: 100, contrast: 100, saturation: 100, sharpen: 0 
  });

  const clamp = (num: number) => Math.min(Math.max(num, 0), 255);

  const renderImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = image.width;
    const h = image.height;
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Image
    if (settings.pixelate > 0) {
        ctx.imageSmoothingEnabled = false;
        const smallW = w / (settings.pixelate / 2);
        const smallH = h / (settings.pixelate / 2);
        ctx.drawImage(image, 0, 0, smallW, smallH);
        ctx.drawImage(canvas, 0, 0, smallW, smallH, 0, 0, w, h);
    } else {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(image, 0, 0, w, h);
    }

    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    // --- FUNGSI NATURAL ENHANCE ---
    const applyNaturalSharpen = (pixels: Uint8ClampedArray, width: number, height: number, amount: number) => {
        const multiplier = (amount / 100) * 1.5; 
        const w = width;
        const output = new Uint8ClampedArray(pixels.length);
        const threshold = 25; 

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
               const i = (y * w + x) * 4;
               
               let edgeR = pixels[i] * 4 - pixels[i-4] - pixels[i+4] - pixels[i-w*4] - pixels[i+w*4];
               let edgeG = pixels[i+1] * 4 - pixels[i-3] - pixels[i+5] - pixels[i-w*4+1] - pixels[i+w*4+1];
               let edgeB = pixels[i+2] * 4 - pixels[i-2] - pixels[i+6] - pixels[i-w*4+2] - pixels[i+w*4+2];

               const edgeStrength = (Math.abs(edgeR) + Math.abs(edgeG) + Math.abs(edgeB)) / 3;

               if (edgeStrength > threshold) {
                   output[i]   = clamp(pixels[i]   + edgeR * multiplier);
                   output[i+1] = clamp(pixels[i+1] + edgeG * multiplier);
                   output[i+2] = clamp(pixels[i+2] + edgeB * multiplier);
               } else {
                   output[i]   = pixels[i];
                   output[i+1] = pixels[i+1];
                   output[i+2] = pixels[i+2];
               }
               output[i+3] = pixels[i+3];
            }
        }
        return output;
    };

    let processedData = new Uint8ClampedArray(data);

    if (settings.sharpen > 0) {
        processedData = applyNaturalSharpen(data, w, h, settings.sharpen);
    }

    const offset = Math.floor(settings.rgbShift * 2);
    const tempCopy = new Uint8ClampedArray(processedData);

    for (let i = 0; i < processedData.length; i += 4) {
        if (settings.rgbShift > 0) {
            if (i + offset * 4 < processedData.length) processedData[i] = tempCopy[i + offset * 4]; 
            if (i - offset * 4 >= 0) processedData[i + 2] = tempCopy[i - offset * 4 + 2];
        }
        if (settings.noise > 0) {
            const random = (0.5 - Math.random()) * (settings.noise * 2);
            processedData[i] = clamp(processedData[i] + random);
            processedData[i+1] = clamp(processedData[i+1] + random);
            processedData[i+2] = clamp(processedData[i+2] + random);
        }

        let r = processedData[i];
        let g = processedData[i+1];
        let b = processedData[i+2];

        if (settings.contrast !== 100) {
            const c = (settings.contrast - 100) / 100 + 1;
            const intercept = 128 * (1 - c);
            r = r * c + intercept;
            g = g * c + intercept;
            b = b * c + intercept;
        }

        if (settings.brightness !== 100) {
            const bAdjust = settings.brightness - 100;
            r += bAdjust;
            g += bAdjust;
            b += bAdjust;
        }

        if (settings.saturation !== 100) {
            const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            const sat = settings.saturation / 100;
            r = gray + (r - gray) * sat;
            g = gray + (g - gray) * sat;
            b = gray + (b - gray) * sat;
        }

        processedData[i]   = clamp(r);
        processedData[i+1] = clamp(g);
        processedData[i+2] = clamp(b);
    }

    ctx.putImageData(new ImageData(processedData, w, h), 0, 0);

    if (settings.scanlines > 0) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1 + (settings.scanlines / 10));
    }
    if (settings.vignette > 0) {
        const gradient = ctx.createRadialGradient(w/2, h/2, w/4, w/2, h/2, w/1.2);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(1, `rgba(0,0,0,${settings.vignette / 100})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    }
    
    setIsProcessing(false);
  };

  useEffect(() => {
    if (!image) return;
    setIsProcessing(true);
    const timeoutId = setTimeout(() => {
        requestAnimationFrame(renderImage);
    }, 100); 
    return () => clearTimeout(timeoutId);
  }, [settings, image]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
          setImage(img);
          setImageStats({ width: img.width, height: img.height });
      }
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "edited-dreamscape.png";
    link.href = canvasRef.current.toDataURL("image/png", 1.0); 
    link.click();
    toast({ title: "Saved!", description: "High Quality Image downloaded." });
  };

  const applyAutoEnhance = () => {
      setSettings({ ...settings, brightness: 100, contrast: 110, saturation: 110, sharpen: 50 });
      toast({ title: "✨ Auto Enhance Applied", description: "Clarity, contrast, and color boosted naturally." });
  };

  const applyFaceClarity = () => {
      setSettings({ ...settings, brightness: 95, contrast: 105, saturation: 105, sharpen: 35 });
      toast({ title: "🤖 Natural Face Clarity", description: "Sharpened gently & balanced exposure." });
  };

  const applyCyberpunk = () => { setSettings({ ...settings, pixelate: 0, noise: 30, rgbShift: 15, scanlines: 2, vignette: 50, brightness: 110, contrast: 120 }); toast({ title: "🤖 Cyberpunk", description: "Applied Glitch & Neon vibes." }); };
  const applyCCTV = () => { setSettings({ ...settings, pixelate: 4, noise: 80, rgbShift: 5, scanlines: 8, vignette: 30, brightness: 120, contrast: 80 }); toast({ title: "📹 CCTV Mode", description: "Security camera effect applied." }); };
  const applyRetro = () => { setSettings({ ...settings, pixelate: 0, noise: 50, rgbShift: 8, scanlines: 0, vignette: 70, brightness: 90, contrast: 110 }); toast({ title: "📼 VHS Tape", description: "90s Retro style applied." }); };
  const resetAll = () => { setSettings({ pixelate: 0, noise: 0, rgbShift: 0, scanlines: 0, vignette: 0, brightness: 100, contrast: 100, saturation: 100, sharpen: 0 }); };

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row relative pt-20 lg:pt-24 h-full overflow-hidden">
        
        {/* AREA KIRI (CANVAS) */}
        <div className="flex-1 bg-[#050505] relative flex items-center justify-center p-4 lg:p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {!image ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center z-10 p-8 border-2 border-dashed border-white/10 rounded-3xl bg-black/40 backdrop-blur-sm"
                >
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <Upload className="w-8 h-8 text-white/50" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Start Editing</h2>
                    <p className="text-gray-400 mb-6 text-sm">Drag & drop or upload an image to begin magic.</p>
                    
                    <Button onClick={() => fileInputRef.current?.click()} className="bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-xl font-bold text-md">
                        Upload Photo
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                </motion.div>
            ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                    <canvas ref={canvasRef} className="max-w-full max-h-full object-contain shadow-2xl shadow-black/50 rounded-lg"/>
                    
                    {/* INDIKATOR LOADING */}
                    <AnimatePresence>
                        {isProcessing && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium text-white border border-white/10"
                            >
                                <RefreshCw className="w-3 h-3 animate-spin" /> Rendering...
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute top-4 left-4">
                        <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="bg-black/50 border-white/10 backdrop-blur-md hover:bg-white/10 text-xs h-8">
                            Change Image
                        </Button>
                    </div>
                </div>
            )}
        </div>

        {/* AREA KANAN (SIDEBAR TOOLS) */}
        <div className="w-full lg:w-[360px] xl:w-[400px] bg-[#0F0F0F] border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col h-[40vh] lg:h-full z-20 shadow-2xl">
            
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#0F0F0F]">
                <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-sm tracking-wide">ADJUSTMENTS</span>
                </div>
                <button onClick={resetAll} className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-wider transition-colors">
                    Reset All
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8">
                
                {/* 1. MAGIC FIXES */}
                <div>
                    <p className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider">Instant Magic</p>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={applyAutoEnhance} className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 hover:border-blue-400 hover:bg-blue-600/30 transition-all group">
                            <Sparkles className="w-5 h-5 text-blue-300 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-medium text-blue-100">Auto Enhance</span>
                        </button>
                        <button onClick={applyFaceClarity} className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-600/30 transition-all group">
                            <User className="w-5 h-5 text-emerald-300 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-medium text-emerald-100">Face Clarity</span>
                        </button>
                    </div>
                </div>

                {/* 2. QUALITY SLIDERS */}
                <div>
                    <p className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider">Quality & Color</p>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-blue-200 font-medium">
                                <span className="flex gap-2 items-center"><Triangle className="w-3 h-3"/> Smart Sharpen</span>
                                <span className="opacity-50">{settings.sharpen}%</span>
                            </div>
                            <input type="range" min="0" max="100" value={settings.sharpen} onChange={(e) => setSettings({...settings, sharpen: Number(e.target.value)})} className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-300"><span>Brightness</span></div>
                            <input type="range" min="0" max="200" value={settings.brightness} onChange={(e) => setSettings({...settings, brightness: Number(e.target.value)})} className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-white"/>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-300"><span>Contrast</span></div>
                            <input type="range" min="0" max="200" value={settings.contrast} onChange={(e) => setSettings({...settings, contrast: Number(e.target.value)})} className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-white"/>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-300"><span>Color Boost</span></div>
                            <input type="range" min="0" max="200" value={settings.saturation} onChange={(e) => setSettings({...settings, saturation: Number(e.target.value)})} className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-white"/>
                        </div>
                    </div>
                </div>

                {/* 3. CREATIVE FILTERS */}
                <div>
                    <p className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider">Vibe Filters</p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <button onClick={applyCyberpunk} className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 hover:text-purple-300 border border-white/5 text-[10px] transition-colors">Cyberpunk</button>
                        <button onClick={applyCCTV} className="p-2 rounded-lg bg-white/5 hover:bg-green-500/20 hover:text-green-300 border border-white/5 text-[10px] transition-colors">CCTV</button>
                        <button onClick={applyRetro} className="p-2 rounded-lg bg-white/5 hover:bg-orange-500/20 hover:text-orange-300 border border-white/5 text-[10px] transition-colors">VHS</button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-purple-300"><span className="flex gap-2 items-center"><Zap className="w-3 h-3"/> Glitch RGB</span></div>
                            <input type="range" min="0" max="30" value={settings.rgbShift} onChange={(e) => setSettings({...settings, rgbShift: Number(e.target.value)})} className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-yellow-300"><span className="flex gap-2 items-center"><Grip className="w-3 h-3"/> Pixelate</span></div>
                            <input type="range" min="0" max="50" value={settings.pixelate} onChange={(e) => setSettings({...settings, pixelate: Number(e.target.value)})} className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"/>
                        </div>
                    </div>
                </div>

            </div>

            <div className="p-5 border-t border-white/5 bg-[#0F0F0F]">
                {image && (
                    <div className="mb-3 flex justify-between text-[10px] text-gray-500 font-mono">
                        <span>{imageStats.width} x {imageStats.height}px</span>
                        <span>{(imageStats.width * imageStats.height / 1000000).toFixed(1)} MP</span>
                    </div>
                )}
                <Button onClick={handleDownload} disabled={!image} className="w-full bg-white text-black hover:bg-gray-200 font-bold py-6 rounded-xl text-md shadow-lg shadow-white/10 transition-all active:scale-95">
                    <Download className="w-5 h-5 mr-2" /> Save Image
                </Button>
            </div>

        </div>
      </div>
    </div>
  );
}

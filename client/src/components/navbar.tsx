import { Link, useLocation } from "wouter";
// PERBAIKAN DI SINI: Menambahkan 'Sliders' ke dalam import
import { Sparkles, Image, Info, Github, Sliders } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  // Style untuk link menu (Aktif vs Tidak Aktif)
  const navLinkClass = (path: string) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
      location === path
        ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" 
        : "text-white/60 hover:text-white hover:bg-white/10"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-24 flex items-center justify-center px-4 pointer-events-none">
      
      {/* Background Gradient Halus */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent h-32 -z-10" />

      <div className="w-full max-w-7xl flex items-center justify-between pointer-events-auto">
        
        {/* 1. LOGO */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 shadow-lg group-hover:shadow-purple-500/40 transition-all duration-500 group-hover:rotate-12 border border-white/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white leading-none group-hover:text-purple-300 transition-colors">
                Digital Dreamscape
              </span>
              <span className="text-[10px] font-medium text-white/40 tracking-[0.2em] uppercase mt-1 group-hover:text-white/70 transition-colors">
                AI Powered Design
              </span>
            </div>
          </div>
        </Link>

        {/* 2. MENU CAPSULE (Updated dengan Editor) */}
        <div className="hidden md:flex items-center gap-1 bg-black/40 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl">
          <Link href="/">
            <a className={navLinkClass("/")}>
              <Sparkles className="w-4 h-4" /> Generator
            </a>
          </Link>
          <Link href="/editor">
            <a className={navLinkClass("/editor")}>
              <Sliders className="w-4 h-4" /> Editor
            </a>
          </Link>
          <Link href="/gallery">
            <a className={navLinkClass("/gallery")}>
              <Image className="w-4 h-4" /> Gallery
            </a>
          </Link>
          <Link href="/about">
            <a className={navLinkClass("/about")}>
              <Info className="w-4 h-4" /> About
            </a>
          </Link>
        </div>

        {/* 3. PROFILE / SOCIAL */}
        <div className="flex items-center gap-4">
           <a href="https://github.com" target="_blank" className="hidden md:block text-white/40 hover:text-white transition-colors">
             <Github className="w-5 h-5" />
           </a>
           <div className="hidden md:block h-6 w-px bg-white/10"></div>
           <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 border-2 border-black ring-2 ring-white/10 shadow-lg" />
        </div>

      </div>
    </nav>
  );
}

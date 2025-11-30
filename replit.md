# Digital Dreamscape - AI Moodboard Generator

## Overview
A futuristic AI-powered moodboard generator web application with dark mode aesthetics, neon gradients, and glassmorphism effects. Users can type prompts or select presets to generate curated image moodboards.

## Current State
- MVP complete with full frontend and backend implementation
- Mock AI generation using Unsplash API with fallback images
- Fully responsive design with Framer Motion animations

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with custom CSS variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Express.js
- **State Management**: TanStack Query

## Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── hero-section.tsx      # Hero with animated gradient headline
│   │   │   ├── prompt-input.tsx      # Input field with generate button
│   │   │   ├── preset-buttons.tsx    # Quick preset selection
│   │   │   └── moodboard-grid.tsx    # Image grid with skeleton loading
│   │   ├── pages/
│   │   │   └── home.tsx              # Main page component
│   │   ├── App.tsx                   # Root app with routing
│   │   └── index.css                 # Theme variables and utilities
├── server/
│   ├── routes.ts                     # API endpoints
│   └── services/
│       └── unsplash.ts               # Image fetching service
└── shared/
    └── schema.ts                     # Shared TypeScript types
```

## API Endpoints
- `POST /api/generate` - Generate moodboard images from prompt
  - Request: `{ prompt: string }`
  - Response: `{ images: MoodboardImage[], prompt: string }`

## Key Features
1. **Hero Section**: Animated gradient headline with floating animation
2. **Prompt Input**: Glassmorphic input with glowing generate button
3. **Quick Presets**: 6 preset buttons (Minimalist, Retro, Nature, Industrial, Cyberpunk, Vaporwave)
4. **Moodboard Grid**: Responsive grid with hover effects and download options
5. **Loading States**: Skeleton cards with shimmer animation

## Design System
- **Background**: Dark slate (222 47% 4%)
- **Accent Colors**: Purple (#a855f7) and Cyan (#22d3ee)
- **Glassmorphism**: backdrop-blur with white/5 opacity
- **Animations**: Float, pulse-glow, gradient-x, fade-in

## Running the Project
The application runs with `npm run dev` which starts both the Express backend and Vite frontend dev server on port 5000.

## Environment Variables
- `UNSPLASH_ACCESS_KEY` (optional): For real Unsplash API access. Falls back to curated images if not set.

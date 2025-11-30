# Digital Dreamscape - Design Guidelines

## Design Approach
**Reference-Based: Futuristic/Cyberpunk Aesthetic**
Drawing inspiration from modern AI/tech platforms with heavy emphasis on dark mode, neon accents, and glassmorphism. Think Vercel's dark mode meets cyberpunk aesthetics with fluid animations.

## Core Design Principles
- **Futuristic Dark Mode**: Primary foundation using deep slate-900 (#0f172a) to pure black backgrounds
- **Neon Accent System**: Purple-to-cyan gradients (from-purple-500 via-fuchsia-500 to-cyan-400) for emphasis
- **Glassmorphism**: Frosted glass effects on cards and input containers (backdrop-blur-xl, bg-white/5)
- **Glowing Interactions**: Subtle glow effects on interactive elements using box-shadows and gradients

## Typography
**Font Stack**: System font with fallback to sans-serif for performance
- **Headline (Hero)**: text-5xl to text-7xl, font-bold, gradient text effect using bg-clip-text
- **Sub-headline**: text-xl to text-2xl, font-light, text-slate-300
- **Body/Labels**: text-base, text-slate-400
- **Buttons**: text-lg, font-semibold, uppercase tracking-wide for emphasis

## Layout System
**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 24
- Container: max-w-7xl mx-auto with px-4 md:px-8 for consistent edge spacing
- Section spacing: py-12 md:py-24 for generous vertical rhythm
- Component gaps: gap-6 to gap-8 for grid layouts

## Component Library

### Hero Section
- Full-width dark gradient background (bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900)
- Centered content with pt-24 pb-16
- Headline with animated gradient text effect
- Sub-headline with max-w-3xl for optimal reading width
- Subtle animated background particles or grid pattern (using Framer Motion)

### Input Area
- Large glassmorphic container (backdrop-blur-xl bg-white/5 border border-white/10)
- Rounded corners (rounded-2xl) with p-8
- Text input: Full-width, h-16, dark background (bg-slate-800/50), rounded-xl, text-white, placeholder-slate-500, focus ring with neon glow
- Generate button: Gradient background (bg-gradient-to-r from-purple-600 to-cyan-600), rounded-xl, px-12 py-4, with outer glow effect (shadow-lg shadow-purple-500/50)
- Loading state: Spinning gradient border animation on button
- Quick Presets: Grid of 6 pill-shaped buttons (rounded-full, border border-white/20, hover:bg-white/10) arranged in 2-3 rows, gap-3

### Moodboard Grid
- Masonry layout using CSS Grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6)
- Each image card: Glassmorphic container with overflow-hidden, rounded-xl
- Image hover effect: Scale transform (scale-105) with transition, overlay gradient appears
- Cards animate in with stagger effect using Framer Motion
- Each card has subtle glow on hover (shadow-xl shadow-purple-500/20)

### Preset Buttons
6 quick presets with distinctive styling:
- Minimalist, Retro, Nature, Industrial, Cyberpunk, Vaporwave
- Each button auto-fills the input with a descriptive prompt
- Active state: filled gradient background matching the Generate button
- Inactive state: transparent with border, hover shows soft glow

## Animations
**Framer Motion Implementation** (use sparingly but impactfully):
- Hero headline: Fade in + slide up on mount (duration: 0.6s)
- Input container: Subtle floating animation (translateY oscillation)
- Generate button: Pulse glow effect when enabled, spinner rotation when loading
- Moodboard cards: Staggered fade-in cascade (each card delays by 0.1s)
- Hover interactions: Smooth scale transforms (scale-105, duration: 0.2s)

## Images

### Moodboard Grid Images
- Source: Unsplash API fetching 4-6 high-quality images per prompt
- Dimensions: Vary naturally for masonry effect, but optimize for 400-600px width
- Display: Object-fit cover to maintain aspect ratios within cards
- Loading state: Skeleton gradient shimmer effect while fetching

**No hero background image needed** - the dark gradient with animated elements provides sufficient visual impact.

## Responsive Behavior
- **Mobile (< 768px)**: Single column grid, reduced font sizes (text-4xl for headline), full-width input, stacked preset buttons (2 per row)
- **Tablet (768px - 1024px)**: 2-column moodboard grid, balanced spacing
- **Desktop (> 1024px)**: 3-column grid, maximum visual impact with larger text and generous spacing

## Accessibility
- High contrast maintained with white/cyan text on dark backgrounds
- Focus states: visible cyan glow ring (ring-2 ring-cyan-400) on all interactive elements
- ARIA labels on all buttons and inputs
- Keyboard navigation fully supported through preset buttons and generate action
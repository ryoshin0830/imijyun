# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

意味順（Imijun）英語学習アプリケーション - An educational web application implementing Professor Tajino's innovative "Meaning Order" method for teaching English without traditional grammar terminology.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Imijun color palette
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Monorepo**: Turborepo with pnpm workspaces
- **Package Manager**: pnpm 8.15.1

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server (all apps)
pnpm dev

# Development server (web app only)
pnpm --filter @imijun/web dev

# Build
pnpm build

# Production server
pnpm start

# Linting
pnpm lint

# Format code
pnpm format

# Clean build caches
pnpm clean
```

## Architecture

### Monorepo Structure
- `apps/web/` - Main Next.js application
  - `app/` - App Router pages and layouts
  - `app/components/` - React components (ImijunBox, WordBank, etc.)
  - `app/data/` - Lesson data and types
- `packages/ui/` - Shared UI components library
- `packages/lib/` - Shared utilities
- `packages/config/` - Shared configuration (TypeScript configs)

### Core Components

**ImijunBoxEnhanced** - Droppable meaning-order boxes (だれが, する, だれ・なに, どこ, いつ)
**WordBankEnhanced** - Draggable word bank for sentence construction
**Feedback** - Visual feedback with confetti animations
**Tutorial** - Interactive onboarding flow
**LessonSelector** - Lesson navigation with progress tracking

### Key Features

1. **Drag & Drop System**: Uses @dnd-kit for smooth word placement into meaning-order boxes
2. **Visual Learning**: Color-coded boxes with immediate feedback
3. **Gamification**: Score tracking, streaks, and progress bars
4. **Responsive Design**: Mobile-first approach with breakpoints for tablets and desktop

### Imijun Method Colors

```css
--imijun-primary: #60A5FA (だれが/Who)
--imijun-action: #F472B6 (する/Do)
--imijun-object: #FBBF24 (だれ・なに/What)
--imijun-place: #34D399 (どこ/Where)  
--imijun-time: #A78BFA (いつ/When)
```

## Important Conventions

1. **Client Components**: Most interactive components use `"use client"` directive
2. **Type Safety**: All lesson data and word types are strongly typed
3. **Animation**: Use Framer Motion for smooth transitions
4. **State Management**: Component-level state with useState, global state with Zustand
5. **Styling**: Tailwind utility classes, avoid inline styles

## Testing Approach

Currently no test suite implemented. When adding tests:
- Use Next.js built-in testing setup
- Focus on drag & drop interactions and lesson flow
- Test responsive layouts across breakpoints

## Deployment

- Platform: Vercel (configured for Next.js)
- Environment Variables: None currently required
- Build Command: `pnpm build`
- Install Command: `pnpm install`

## Key Dependencies

- Next.js 14.2.5
- React 18.3.1
- @dnd-kit/core 6.1.0
- framer-motion 11.18.2
- zustand 4.5.0
- compromise 14.14.4 (NLP for text analysis)
- react-confetti 6.4.0 (celebration effects)

## Development Notes

- The app implements the "意味順" (Meaning Order) teaching method
- Focus on visual, intuitive learning without grammar terminology
- Maintain educational integrity per Professor Tajino's methodology
- B2B features (teacher dashboard, analytics) planned for Phase 3
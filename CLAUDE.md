# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BJCP Viewer is a React application for browsing the BJCP (Beer Judge Certification Program) Beer Style Guidelines 2021. It provides an interactive interface to explore 110 beer styles with search, filtering, and comparison features.

## Commands

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run serve` - Preview production build
- `npm start` - Start Vite (alias for dev without port specification)

## Architecture

- **Build Tool**: Vite 7 with React plugin
- **UI Framework**: Tailwind CSS v4 with shadcn/ui-style components (Radix UI primitives)
- **State Management**: React Context with useReducer pattern
- **Data Source**: Static JSON file (`src/bjcp_styleguide-2021.json`) from beerjson/bjcp-json

### Directory Structure

```
src/
├── components/
│   ├── ui/           # Base UI components (Button, Card, Dialog, etc.)
│   ├── Sidebar.tsx   # Category navigation
│   ├── SearchBar.tsx # Search + tag filters + view toggle
│   ├── StyleViews.tsx # Card and List view components
│   ├── StyleDetail.tsx # Detail modal
│   └── CompareDialog.tsx # Style comparison
├── lib/
│   ├── utils.ts      # cn() helper for class merging
│   └── data.ts       # Data processing utilities
├── store/
│   └── AppContext.tsx # Global state management
├── types/
│   └── index.ts      # TypeScript interfaces
├── App.tsx           # Main application component
└── main.tsx          # Entry point
```

### Key Features

- **Sidebar Navigation**: Categories grouped by BJCP category ID, plus favorites filter
- **Search**: Full-text search across all style fields
- **Tag Filtering**: Click tags to filter styles; supports multiple tag selection
- **View Modes**: Card (grid) and List views
- **Favorites**: Persisted to localStorage
- **Compare**: Select up to 4 styles for side-by-side comparison

### Data Format

Beer styles include: name, category, style_id, overall_impression, aroma, appearance, flavor, mouthfeel, comments, history, ingredients, examples, plus vital statistics (OG, FG, ABV, IBU, SRM color).

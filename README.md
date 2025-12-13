**Code written by LLM, directed by humans**

# BJCP Style Viewer

A web application for browsing BJCP (Beer Judge Certification Program) style guidelines.

## Features

- Browse beer, mead, and cider styles from multiple BJCP guideline versions
- Full-text search across all style fields
- Filter by tags and categories
- Card and list view modes
- Side-by-side style comparison (up to 4 styles)
- Responsive design for desktop and mobile
- Data source switching between different BJCP versions

## Supported Data Sources

- BJCP 2021 Beer Style Guidelines
- BJCP 2015 Beer Style Guidelines
- BJCP 2015 Mead Style Guidelines
- BJCP 2015 Cider Style Guidelines
- BJCP 2025 Cider Style Guidelines

## Usage

```bash
npm install
npm run dev      # start development server on port 3001
npm run build    # build for production
npm run deploy   # deploy to GitHub Pages
```

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- Radix UI primitives

## Data Sources

- BJCP official guidelines converted to JSON format
- https://github.com/beerjson/bjcp-json

## License

GPL-3.0

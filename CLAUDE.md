# Mogee Blog Template

## Project Overview
Personal blog + portfolio site template with MCP (Model Context Protocol) integration.
AI (Claude Code) can manage blog posts and portfolio items via MCP tools.

## Tech Stack
- **Frontend:** React 19 + TypeScript + Tailwind CSS + Framer Motion
- **Backend:** Firebase (Firestore, Auth, Storage, Hosting, Functions)
- **MCP:** Blog management MCP server (Node.js + firebase-admin)

## Key Files
- `src/firebase/config.ts` — Firebase config (uses env vars)
- `src/pages/Home.tsx` — Blog list page with tag filter
- `src/pages/PostDetail.tsx` — Post detail with views/likes/comments
- `src/pages/Portfolio.tsx` — Portfolio showcase
- `src/components/SEOHead.tsx` — Dynamic SEO meta tags
- `src/contexts/LanguageContext.tsx` — i18n (ko/en/ja)
- `functions/src/index.ts` — Cloud Functions (sitemap)
- `blog-mcp/src/index.ts` — MCP server with 9 tools

## Commands
- `npm start` — Development server
- `npm run build` — Production build
- `firebase deploy --only hosting` — Deploy to Firebase
- `firebase deploy --only hosting,firestore:rules` — Deploy with rules
- `firebase deploy --only functions` — Deploy Cloud Functions
- `cd blog-mcp && npm run build` — Build MCP server

## Rules
- Firebase config uses environment variables (REACT_APP_*)
- Firestore queries should use `getDocsFromServer()` to avoid cache
- Blog content supports 3 languages: ko, en, ja
- Admin UID in firestore.rules and storage.rules must be set by the user
- Keep files under 500 lines

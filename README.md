# Mogee Blog Template

> A personal blog + portfolio template managed by AI (Claude Code)

A personal blog and portfolio site built with React + Firebase + MCP.
**Claude Code** and the MCP server handle writing posts, editing content, and managing your portfolio — all through AI.

## Features

- **Blog** - Markdown support, tag filtering, views / likes / comments
- **Portfolio** - Project showcase
- **MCP Server** - Write, edit, and delete blog posts via Claude Code
- **Multilingual** - Korean / English / Japanese (ko/en/ja)
- **SEO** - Open Graph, Twitter Card, JSON-LD, Sitemap
- **Glassmorphism UI** - Tailwind CSS + Framer Motion

## Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS
- **Backend:** Firebase (Firestore, Auth, Storage, Hosting, Functions)
- **AI Integration:** MCP Server (Model Context Protocol)

---

## Quick Start (with Claude Code)

> Just show this repo to Claude Code and say "Set up this blog with my Firebase project"!

### Step 1: Clone & Install

```bash
git clone https://github.com/smy383/mogee-blog-template.git
cd mogee-blog-template
npm install
cd blog-mcp && npm install && cd ..
```

### Step 2: Firebase Setup

1. Create a new project in [Firebase Console](https://console.firebase.google.com/)
2. **Authentication** → Enable Email/Password sign-in
3. Create a **Firestore Database** (asia-northeast3 recommended)
4. Enable **Storage**
5. Enable **Hosting**
6. Go to Project Settings → General → Add Web App → Copy Firebase config

### Step 3: Environment Variables

Copy `.env.example` to create `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Firebase config values in `.env.local`:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

REACT_APP_SITE_NAME=My Blog
REACT_APP_SITE_URL=https://your-project.web.app
REACT_APP_GITHUB_URL=https://github.com/your-username
REACT_APP_CONTACT_EMAIL=your-email@example.com
```

### Step 4: Firebase Security Rules

In `firestore.rules` and `storage.rules`, replace `YOUR_ADMIN_UID` with your Firebase Auth UID:

> Find your UID in Firebase Console → Authentication → Users

```
allow write: if request.auth.uid == 'YOUR_ADMIN_UID';
```

### Step 5: Deploy

```bash
# Install Firebase CLI (first time only)
npm install -g firebase-tools
firebase login

# Link your project
firebase use --add your-project-id

# Build & deploy
npm run build
firebase deploy --only hosting,firestore:rules,storage
```

### Step 6: Cloud Functions (Sitemap)

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## MCP Server Setup (Blog Management via Claude Code)

### 1. Create a Service Account

Firebase Console → Project Settings → Service Accounts → Generate New Private Key → Download JSON

```bash
# Move the downloaded file into the blog-mcp/ folder
mv ~/Downloads/your-project-firebase-adminsdk-xxxxx.json blog-mcp/serviceAccount.json
```

### 2. Build the MCP Server

```bash
cd blog-mcp
npm run build
```

### 3. Register with Claude Code

Add the following to `~/.claude/claude_desktop_config.json` (or your Claude Code settings):

```json
{
  "mcpServers": {
    "blog-manager": {
      "command": "node",
      "args": ["/absolute/path/to/mogee-blog-template/blog-mcp/dist/index.js"],
      "env": {
        "BLOG_URL": "https://your-project.web.app"
      }
    }
  }
}
```

### 4. Usage Examples

Just tell Claude Code:

```
"Write a new blog post titled 'My First Post' with the content ..."
"Add a new project to my portfolio"
"Show me the list of blog posts"
```

---

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `blog_write` | Write a new blog post |
| `blog_edit` | Edit an existing post |
| `blog_delete` | Delete a post |
| `blog_list` | List all posts |
| `blog_get` | Get a post by ID |
| `portfolio_add` | Add a portfolio item |
| `portfolio_edit` | Edit a portfolio item |
| `portfolio_delete` | Delete a portfolio item |
| `portfolio_list` | List all portfolio items |

---

## Customization

### Hero & Apps Section
- `src/components/Hero.tsx` — Main hero section
- `src/components/Apps.tsx` — Project showcase (edit the `appsData` array)

### Multilingual Strings
- `src/contexts/LanguageContext.tsx` — UI strings (ko/en/ja)

### Styles
- `tailwind.config.js` — Customize theme colors

---

## Project Structure

```
mogee-blog-template/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Pages (Home, Portfolio, PostDetail, Admin)
│   ├── contexts/       # Auth, Language context
│   └── firebase/       # Firebase config
├── public/             # Static files
├── functions/          # Cloud Functions (sitemap)
├── blog-mcp/           # MCP server
│   └── src/index.ts    # MCP tool definitions
├── firestore.rules     # Firestore security rules
├── storage.rules       # Storage security rules
└── .env.example        # Environment variable template
```

---

## License

MIT License

---

Made with ❤️ by [Mogee](https://mogee.org) | Powered by Claude Code

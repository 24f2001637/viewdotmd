# view.md

> Free online Markdown editor with real-time preview, GFM, KaTeX math, syntax highlighting, and one-click PDF export.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/viewdotmd)

---

## Features

- ✅ Real-time split-view preview
- ✅ GitHub-Flavored Markdown (GFM)
- ✅ KaTeX math / LaTeX equations
- ✅ Syntax highlighting (20 languages)
- ✅ Raw HTML rendering
- ✅ One-click PDF export
- ✅ Import `.md` / `.txt` files
- ✅ Auto-save to localStorage
- ✅ No sign-up required

## Run Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env
# (Optional) Add your GEMINI_API_KEY if using AI features

# 3. Start dev server
npm run dev
```

App runs at **http://localhost:3000**

## Deploy to Vercel

### Option 1 — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2 — Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo — Vercel auto-detects Vite
4. Click **Deploy** — no configuration needed

> **After deploying:** Update the canonical URL and OG image URLs in `index.html` with your actual Vercel domain.

## Build

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

## Tech Stack

- [React 19](https://react.dev/) + TypeScript
- [Vite 6](https://vitejs.dev/) + Tailwind CSS v4
- [react-markdown](https://github.com/remarkjs/react-markdown) + remark-gfm + remark-math
- [rehype-katex](https://github.com/rehypejs/rehype-katex) for LaTeX math
- [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) (PrismLight)
- [lucide-react](https://lucide.dev/) for icons

## Feedback

Found a bug or have a suggestion? Use the **Feedback** button in the app footer, or email [the.sahilbind@gmail.com](mailto:the.sahilbind@gmail.com).

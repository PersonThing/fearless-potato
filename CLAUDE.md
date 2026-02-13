# Fearless Potato

A presentation app with a static 12-slide deck and an interactive AI phase. Static slides load instantly on startup. After the deck, `Ctrl+K` opens a command bar where the audience can ask the AI to generate new slides using RAG tools.

## Architecture

- `frontend/` — Svelte 5 SPA (Vite). No SvelteKit, no SSR, no routing.
- `backend/` — Node.js + Express API on port 3001. Calls LLM API (Anthropic/OpenAI/Gemini) with tool use.
- Root uses npm workspaces.

## Development

- Start everything: `npm run dev` (runs both frontend and backend concurrently)
- Frontend only: `cd frontend && npm run dev` (Vite on port 5173)
- Backend only: `cd backend && npm run dev` (Express on port 3001)
- Frontend proxies `/api/*` to backend via Vite config

## Frontend Guidelines

- **Svelte 5 with runes** — use `$state`, `$derived`, `$effect`, `$props`. Never use Svelte 4 syntax (`export let`, `$:`, `on:click`, slots).
- See `.claude/skills/svelte5.md` for the full Svelte 5 reference.
- State files use `.svelte.js` extension for rune support outside components.
- Component props use `let { prop } = $props()` pattern.
- Events use `onclick={handler}` not `on:click={handler}`.
- Snippets replace slots: use `{#snippet}` / `{@render}` not `<slot>`.
- Mount with `import { mount } from 'svelte'`, not `new Component()`.

## Slide Format

Slides use structured JSON blocks — not raw HTML/CSS. Each slide has `layout`, `background`, and `blocks[]`.

- **Layouts:** `default`, `center`, `two-column`, `section`
- **Backgrounds:** `default`, `subtle`, `accent`, `dark`
- **Block types:** heading, text, list, code, image, quote, spacer
- **Inline markup:** `**bold**`, `*italic*`, `` `code` ``, `{{color:text}}` (accent, electric, potato, success, primary, secondary, muted)

Block components live in `frontend/src/components/blocks/`.

## Static Deck

- 12 static slides defined in `frontend/src/lib/data/static-deck.js`
- `getStaticDeck()` returns the slide array, loaded on app mount in `App.svelte`
- Presenter name hardcoded to "Tim"
- No welcome screen — slides load immediately

## Backend Guidelines

- Express routes in `src/routes/`. Services in `src/services/`.
- Multi-provider LLM support: set ONE key in `backend/.env` (ANTHROPIC_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY). Auto-detected at startup.
- Provider implementations in `src/services/providers/` — each exports `runToolLoop()` with a unified interface.
- `src/services/llm.js` is the main entry point.
- 4 RAG tools defined in `src/services/tools.js`: read_presentation_notes, read_readme, search_code, read_source_file
- RAG implementations in `src/rag/`: `readme-reader.js` and `code-searcher.js`
- API returns JSON: `{ blocks, layout, background, toolCalls }`

## Design System

- Fonts: Clash Display (display), Satoshi (body), JetBrains Mono (code)
- Dark palette "Electric Dusk": navy bg, orange accent (#f97316), electric blue (#38bdf8), gold (#fbbf24)
- All design tokens in `frontend/src/styles/variables.css`

## Key Files

- `frontend/src/lib/data/static-deck.js` — 12 static slides
- `frontend/src/lib/state/slides.svelte.js` — slide deck reactive state
- `frontend/src/components/CommandBar.svelte` — AI command bar (Ctrl+K)
- `frontend/src/components/SlideRenderer.svelte` — renders JSON blocks into slides
- `backend/src/services/llm.js` — LLM orchestration + tool-use loop
- `backend/src/services/providers/` — Anthropic, OpenAI, Gemini provider implementations
- `backend/src/services/prompts.js` — system prompt + templates
- `backend/src/services/tools.js` — RAG tool definitions + executor

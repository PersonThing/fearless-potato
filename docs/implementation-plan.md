# Fearless Potato — Implementation Plan

## Context

Tim is giving a 30-minute demo to ~20 devs/engineers/product/UX colleagues about his AI journey. The demo itself is a homemade slideshow app ("Fearless Potato") where slides are generated via natural language through a command bar that calls an LLM with RAG tool use. The app IS the demo: he'll show how it works, build slides live, and link the public repo.

---

## Architecture

**Two-process monorepo:**
- `frontend/` — Svelte 5 SPA (Vite, no SvelteKit — no SSR/routing needed)
- `backend/` — Node.js + Express API with multi-provider LLM support (Anthropic, OpenAI, Gemini)

```
fearless-potato/
├── package.json              # npm workspaces: ["frontend", "backend"]
├── .gitignore
├── README.md                 # RAG source
├── CLAUDE.md                 # Project instructions
├── setup.sh                  # Interactive setup — picks provider + API key
├── .claude/skills/
│   ├── frontend-design.md
│   └── svelte5.md            # Svelte 5 runes reference
│
├── docs/
│   ├── presentation-notes.md # Primary RAG source — the talk content
│   ├── how-it-works.md       # Technical deep-dive
│   ├── implementation-plan.md
│   └── slide-prompts.md      # Suggested prompts for the demo
│
├── frontend/
│   ├── package.json          # svelte, vite, @sveltejs/vite-plugin-svelte
│   ├── vite.config.js        # Svelte plugin + proxy /api → localhost:3001
│   ├── index.html            # Vite entry + highlight.js CDN + potato favicon
│   ├── public/fonts/         # Clash Display, Satoshi (WOFF2 from Fontshare)
│   └── src/
│       ├── main.js           # mount(App, { target })
│       ├── App.svelte        # Root: welcome screen, SlideViewer, CommandBar, keyboard nav
│       ├── app.css           # Global styles, @font-face, CSS vars
│       ├── lib/
│       │   ├── state/
│       │   │   ├── slides.svelte.js       # Deck state ($state, $derived)
│       │   │   ├── presenter.svelte.js    # Presenter name state
│       │   │   └── command-bar.svelte.js  # Command bar open/close/mode
│       │   ├── api/
│       │   │   └── slides.js              # generateSlide(), updateSlide()
│       │   └── utils/
│       │       └── inline-markup.js       # **bold**, *italic*, `code`, {{color:text}} → HTML
│       ├── components/
│       │   ├── SlideViewer.svelte         # 16:9 viewport + transitions
│       │   ├── SlideRenderer.svelte       # Layout engine — dispatches blocks to components
│       │   ├── SlideNav.svelte            # Bottom dots + slide count
│       │   ├── CommandBar.svelte          # Ctrl+K overlay (hero component)
│       │   ├── ToolActivityFeed.svelte    # Shows RAG tool calls (demo feature)
│       │   └── blocks/
│       │       ├── HeadingBlock.svelte    # h1/h2/h3 with color + gradient
│       │       ├── TextBlock.svelte       # Body text with inline markup
│       │       ├── ListBlock.svelte       # Bullet, numbered, icon lists
│       │       ├── CodeBlock.svelte       # Syntax-highlighted code + filename bar
│       │       ├── ImageBlock.svelte      # Images with fit/sizing
│       │       ├── QuoteBlock.svelte      # Blockquote with accent bar
│       │       └── SpacerBlock.svelte     # Vertical breathing room
│       └── styles/
│           ├── variables.css              # Design tokens
│           ├── slide-templates.css        # Theme color classes, inline markup styles
│           └── animations.css             # Keyframes
│
└── backend/
    ├── package.json          # express, @anthropic-ai/sdk, openai, @google/generative-ai, cors, dotenv
    ├── .env.example          # ANTHROPIC_API_KEY= / OPENAI_API_KEY= / GEMINI_API_KEY=
    └── src/
        ├── server.js         # Express setup, port 3001
        ├── routes/slides.js  # POST /generate, POST /update
        ├── services/
        │   ├── llm.js        # Provider auto-detection, parseSlideResponse, generate/update exports
        │   ├── tools.js      # Tool definitions (4 tools) + executeTool()
        │   ├── prompts.js    # System prompt (JSON block format) + generation/update templates
        │   └── providers/
        │       ├── anthropic.js  # Claude Sonnet 4.5 — tool-use loop
        │       ├── openai.js     # GPT-4o — tool-use loop
        │       └── gemini.js     # Gemini 2.0 Flash — tool-use loop
        └── rag/
            ├── readme-reader.js  # Reads README.md + docs/presentation-notes.md
            └── code-searcher.js  # Searches repo for code snippets + reads full source files
```

---

## What's Built

### 1. Project scaffolding
- Root `package.json` with npm workspaces
- Vite + Svelte 5 frontend, Express backend
- Vite proxy: `/api` → `localhost:3001`
- `setup.sh` interactive setup for provider + API key
- Concurrent dev server via `npm run dev`

### 2. Design system
- Clash Display + Satoshi fonts (Fontshare WOFF2), JetBrains Mono (Google Fonts CDN)
- "Electric Dusk" dark palette: deep navy backgrounds, vivid orange accent, electric blue secondary, warm gold tertiary
- `variables.css` design tokens, `animations.css` keyframes
- Potato favicon (inline SVG with orange-to-gold gradient)

### 3. Welcome screen + presenter name
- Landing page with gradient "Fearless Potato" title + animated potato icon
- Name prompt on first load — stores presenter name in reactive state
- After name entry: greeting + "Ctrl+K to create your first slide" CTA
- Presenter name passed through to LLM so slides can reference the speaker

### 4. Structured JSON slide format
The LLM returns structured JSON instead of raw HTML/CSS. The frontend renders blocks via dedicated Svelte 5 components, enforcing design consistency.

**Slide object:**
```json
{
  "layout": "default | center | two-column | section",
  "background": "default | subtle | accent | dark",
  "blocks": [ ...block objects ]
}
```

**7 block types:** heading, text, list, code, image, quote, spacer — each with its own Svelte component.

**Inline markup:** `**bold**`, `*italic*`, `` `code` ``, `{{accent:colored text}}` parsed into HTML by `inline-markup.js`.

**Layouts:** default (left-aligned flow), center (title slides), two-column (CSS grid), section (dramatic divider).

### 5. Slide rendering engine
- `SlideRenderer.svelte` — layout engine dispatching blocks to components via type lookup map
- Background variants applied as CSS classes (default, subtle, accent, dark)
- Two-column layout splits blocks by `column` field into CSS grid
- Scrollable slide container for overflow content (`overflow-y: auto`)
- Legacy fallback: still renders `{@html slide.html}` if old-format slides exist
- Syntax highlighting via highlight.js (CDN) with language detection

### 6. Command bar
- `CommandBar.svelte` — Ctrl+K overlay with frosted glass backdrop
- Defaults to "New Slide" mode; shows Replace/Update pills on existing slides
- Auto-focuses input on mode pill clicks
- Passes presenter name in all API calls
- `ToolActivityFeed.svelte` — shows tool calls with staggered fade-in animations

### 7. Core slide state
- `slides.svelte.js` — reactive deck state using `$state` rune
- Slide model: `{ id, order, blocks, layout, background, prompt, createdAt }`
- Navigation: `next()`, `prev()`, `goTo(index)` with directional transitions
- CRUD: `addSlide()`, `updateSlide()`, `removeSlide()`
- `getDeckSummary()` for context in multi-slide generation

### 8. Multi-provider LLM backend
- `llm.js` auto-detects provider from `.env` API keys (Anthropic → OpenAI → Gemini)
- Each provider implements the same tool-use loop interface
- `parseSlideResponse()` validates JSON blocks, layout, background with fallback
- Providers: Claude Sonnet 4.5, GPT-4o, Gemini 2.0 Flash

### 9. RAG tools (4 total)
| Tool | Source | Use case |
|------|--------|----------|
| `read_presentation_notes` | `docs/presentation-notes.md` | Primary content — presenter's AI journey, scaffolding, kids' projects, goals |
| `read_readme` | `README.md` | Technical details about the app itself |
| `search_code` | Entire repo | Find code snippets by filename/content search |
| `read_source_file` | Any project file | Read full source of a specific file (a terrible idea, but fearless) |

### 10. System prompt
- Teaches the LLM the JSON block format: all 7 block types, 4 layouts, 4 backgrounds
- Inline markup syntax, design principles, tool usage instructions
- Compact JSON examples (title slide + code slide)
- Presenter name injection when available
- Separate prompts for generate vs. update modes

---

## API Contract

### `POST /api/slides/generate`
```
Request:  { prompt, context: { deckSummary?, slideIndex?, totalSlides?, presenterName? } }
Response: { blocks, layout, background, toolCalls: [{ tool, input, result }] }
```

### `POST /api/slides/update`
```
Request:  { prompt, existingSlide: { blocks, layout, background }, presenterName? }
Response: { blocks, layout, background, toolCalls: [{ tool, input, result }] }
```

---

## Key Decisions

1. **Svelte 5 SPA, not SvelteKit** — no SSR/routing needed, simpler for a single-page slideshow
2. **Structured JSON blocks, not raw HTML/CSS** — enforces design consistency, enables typed rendering via Svelte components, and makes update mode reliable (JSON round-trips cleanly)
3. **Manual tool-use loop** — more educational to show in the demo than SDK abstractions, and we capture tool calls for the activity feed
4. **Multi-provider support** — auto-detects from API key, tool definitions written in Anthropic format and converted on the fly for OpenAI/Gemini
5. **Synchronous generation** (not streaming) — simpler; generation time acceptable for live demo. Tool activity animated sequentially after response
6. **In-memory state, no persistence** — no database. Page refresh clears deck. Acceptable for 30-min demo
7. **Inline markup parser** — lightweight text formatting (`**bold**`, `{{color:text}}`) avoids needing full markdown while keeping slides expressive

---

## Verification

1. `npm run dev` — both servers start
2. Welcome screen loads with potato icon, name prompt auto-focuses
3. Enter name → greeting appears, Ctrl+K hint shows
4. Generate a title slide → renders centered with gradient heading via block components
5. Generate a code slide → syntax highlighting works, filename bar shows
6. Generate a two-column slide → grid layout renders correctly
7. Generate a long-content slide → scrolls within the 16:9 frame
8. Update an existing slide → structured JSON round-trips correctly
9. Tool activity feed shows what the LLM looked up
10. Arrow keys navigate between slides with directional transitions

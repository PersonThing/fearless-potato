# Fearless Potato

A presentation app with 12 pre-built static slides and interactive AI slide generation. The static deck covers an AI journey talk; press **Ctrl+K** at any point to generate new slides from natural language — the LLM pulls from project docs and code via RAG (Retrieval-Augmented Generation) tool calls and returns structured JSON that the frontend renders.

Built with Svelte 5 + Express + Claude/OpenAI/Gemini.

## Quick Start

```bash
./setup.sh # pick your AI provider and enter an API key
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Usage

- The app loads 12 static slides immediately — navigate with **Arrow keys**
- **Ctrl+K** — Open the command bar to generate AI slides
- Type a prompt like *"Show me the tool-use loop"* or *"How does the RAG system work?"* and hit Enter
- The LLM reads project docs and code, then returns structured slide content rendered by the app's component system
- On an existing slide, Ctrl+K gives you **New Slide**, **Replace**, or **Update** modes
- Slides persist to localStorage — hit **Reset** in the bottom nav bar to restore the original static deck

## How It Works

### The Big Picture

Press Ctrl+K, type something like "Title slide: The Fearless Potato", and a few seconds later a fully designed slide appears — rendered from structured JSON blocks, not raw HTML.

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER (Svelte 5 SPA)                                        │
│                                                                 │
│  ┌──────────┐    Ctrl+K    ┌──────────────┐                    │
│  │  Static   │ ──────────► │  Command Bar │                    │
│  │  Deck     │             │  (overlay)   │                    │
│  └──────────┘              └──────┬───────┘                    │
│                                   │ user types prompt,         │
│                                   │ hits Enter                 │
│                                   ▼                            │
│                           POST /api/slides/generate            │
│                           { prompt, context }                  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  EXPRESS SERVER (port 3001)                                     │
│                                                                 │
│  routes/slides.js                                               │
│       │                                                         │
│       ▼                                                         │
│  services/llm.js                                                │
│       │  detect provider (Anthropic / OpenAI / Gemini)          │
│       │  build system prompt + user message                     │
│       ▼                                                         │
│  providers/{anthropic,openai,gemini}.js                         │
│       │                                                         │
│       │  ┌─────────────────────────────────────────────┐        │
│       │  │         LLM TOOL-USE LOOP                   │        │
│       │  │                                             │        │
│       │  │  1. Send prompt + tool definitions ──► LLM  │        │
│       │  │                                             │        │
│       │  │  2. LLM responds: "I want to call           │        │
│       │  │     search_code(query: 'CommandBar')"       │        │
│       │  │                                             │        │
│       │  │  3. Execute tool locally, return result      │        │
│       │  │                                             │        │
│       │  │  4. Send tool result back ──► LLM           │        │
│       │  │                                             │        │
│       │  │  5. LLM may call another tool               │        │
│       │  │     (read_readme, read_source_file)         │        │
│       │  │     ...repeat 2-4...                        │        │
│       │  │                                             │        │
│       │  │  6. LLM has enough context, returns         │        │
│       │  │     final JSON: { layout, blocks }          │        │
│       │  └─────────────────────────────────────────────┘        │
│       │                                                         │
│       ▼                                                         │
│  Parse & validate JSON blocks                                   │
│  Return: { blocks, layout, background, toolCalls }              │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER                                                        │
│                                                                 │
│  CommandBar receives response                                   │
│       │                                                         │
│       ├── toolCalls ──► ToolActivityFeed (animated list         │
│       │                 showing what the LLM looked up)         │
│       │                                                         │
│       ├── blocks + layout ──► deck.addSlide()                   │
│       │   SlideRenderer dispatches each block to a              │
│       │   Svelte component (HeadingBlock, TextBlock,            │
│       │   CodeBlock, etc.) inside a 16:9 viewport               │
│       │                                                         │
│       └── Command bar closes, slide transitions in              │
└─────────────────────────────────────────────────────────────────┘
```

### Structured JSON Format

Instead of raw HTML/CSS, the LLM returns structured JSON that the frontend renders via dedicated Svelte components. This enforces design consistency.

**Slide object:**
```json
{
  "layout": "default | center | two-column | section",
  "background": "default | subtle | accent | dark",
  "blocks": [ ...block objects ]
}
```

**Block types:**

| Type | Purpose |
|------|---------|
| `heading` | h1/h2/h3 with optional color or gradient |
| `text` | Body text with inline markup (`**bold**`, `*italic*`, `` `code` ``, `{{color:text}}`, `[links](url)`) |
| `list` | Bullet, numbered, or icon-style lists |
| `code` | Syntax-highlighted code with optional filename bar |
| `image` | URL-based images with fit/sizing |
| `quote` | Blockquotes with accent bar and attribution |
| `spacer` | Vertical breathing room between blocks |

The static deck and AI-generated slides use the exact same format — they're indistinguishable once rendered.

### The RAG Tools

The LLM has three tools it can call during generation:

| Tool | Source | Use case |
|------|--------|----------|
| `read_readme` | `README.md` | Technical details about the app — setup, usage, architecture |
| `search_code` | Entire repo | Find code snippets by searching filenames and content |
| `read_source_file` | Any project file | Read the full source of a specific file by path |

Each tool accepts optional arguments. The LLM decides which tools to call and with what arguments. A typical slide generation involves 1-2 tool calls.

### The Tool-Use Loop

This is the core mechanism — a simple loop:

```
SEND:    system prompt + user message + tool definitions
         ↓
RECEIVE: LLM says "I want to call search_code(query: 'CommandBar')"
         ↓
EXECUTE: Search the repo, return matching file contents
         ↓
SEND:    Tool result back to the LLM
         ↓
RECEIVE: LLM may call another tool (read_readme, read_source_file)
         ↓
         ...repeat...
         ↓
RECEIVE: LLM now has enough context, returns final JSON with blocks
         ↓
DONE:    Parse & validate JSON, return to frontend
```

The loop runs until the LLM stops requesting tools and returns its final answer. Each provider (Anthropic, OpenAI, Gemini) implements this loop with their own API format, but the interface is identical.

### Multi-Provider Support

The backend auto-detects which provider to use based on which API key is set in `backend/.env`:

```
ANTHROPIC_API_KEY → providers/anthropic.js → Claude Sonnet 4.5
OPENAI_API_KEY    → providers/openai.js    → GPT-4o
GEMINI_API_KEY    → providers/gemini.js    → Gemini 2.0 Flash
```

All three support tool/function calling. The tool definitions are written in Anthropic's format and converted on the fly for OpenAI and Gemini.

### Slide Modes

When you open the command bar on an existing slide, you get three options:

- **New Slide** — generates a fresh slide and appends it to the deck (default)
- **Replace** — generates a completely new slide at the current position
- **Update** — sends the existing slide JSON to the LLM along with your instruction, so it can make targeted edits

### What the Frontend Does

The frontend is a Svelte 5 SPA with no routing:

- **Slide state** (`slides.svelte.js`) — reactive `$state` array with localStorage persistence; reset button restores the original static deck
- **Static deck** (`static-deck.js`) — 12 pre-built slides loaded on app mount
- **SlideRenderer** — layout engine that dispatches blocks to Svelte components based on layout mode
- **Block components** (`blocks/`) — HeadingBlock, TextBlock, ListBlock, CodeBlock, ImageBlock, QuoteBlock, SpacerBlock
- **Inline markup parser** (`utils/inline-markup.js`) — converts `**bold**`, `*italic*`, `` `code` ``, `{{color:text}}`, `[links](url)` into HTML
- **SlideViewer** — enforces 16:9 aspect ratio, handles transitions between slides, scrollable for overflow content
- **CommandBar** — the Ctrl+K overlay that orchestrates everything
- **ToolActivityFeed** — displays what tools the LLM called, animated in with staggered delays

The tool activity feed shows what the LLM looked up in real time.

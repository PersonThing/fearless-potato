# How Fearless Potato Works

## The Big Picture

You enter your name, press Ctrl+K, type something like "Title slide: The Fearless Potato", and a few seconds later a fully designed slide appears — rendered from structured JSON blocks, not raw HTML.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER (Svelte 5 SPA)                                        │
│                                                                 │
│  ┌──────────┐    Ctrl+K    ┌──────────────┐                    │
│  │  Welcome  │ ──────────► │  Command Bar │                    │
│  │  Screen   │             │  (overlay)   │                    │
│  │  (name)   │             └──────┬───────┘                    │
│  └──────────┘                     │ user types prompt,         │
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
│       │  │  2. LLM responds: "I need to call           │        │
│       │  │     read_presentation_notes(kids)"          │        │
│       │  │                                             │        │
│       │  │  3. Execute tool locally:                   │        │
│       │  │     rag/readme-reader.js reads              │        │
│       │  │     docs/presentation-notes.md, finds       │        │
│       │  │     the "kids" section                      │        │
│       │  │                                             │        │
│       │  │  4. Send tool result back ──► LLM           │        │
│       │  │                                             │        │
│       │  │  5. LLM may call another tool               │        │
│       │  │     (search_code, read_readme,              │        │
│       │  │      read_source_file)                      │        │
│       │  │     ...repeat 2-4...                        │        │
│       │  │                                             │        │
│       │  │  6. LLM has enough context, returns         │        │
│       │  │     final JSON:                             │        │
│       │  │     { layout, blocks }                      │        │
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

## The Structured JSON Format

Instead of raw HTML/CSS, the LLM returns structured JSON that the frontend renders via dedicated Svelte components. This enforces design consistency.

### Slide Object
```json
{
  "layout": "default | center | two-column | section",
  "background": "default | subtle | accent | dark",
  "blocks": [ ...block objects ]
}
```

### Block Types

| Type | Purpose |
|------|---------|
| `heading` | h1/h2/h3 with optional color or gradient |
| `text` | Body text with inline markup (**bold**, *italic*, `code`, {{color:text}}) |
| `list` | Bullet, numbered, or icon-style lists |
| `code` | Syntax-highlighted code with optional filename bar |
| `image` | URL-based images with fit/sizing |
| `quote` | Blockquotes with accent bar and attribution |
| `spacer` | Vertical breathing room between blocks |

The frontend parses a lightweight inline markup syntax in text fields, renders each block type with its own Svelte component, and applies layouts (single-column, centered, two-column grid, section divider) and background variants automatically.

## The System Prompt

Before any user prompt reaches the LLM, the backend wraps it with a system prompt (`services/prompts.js`) that teaches the LLM:

- **The block format** — every block type, its fields, and when to use each
- **Layouts and backgrounds** — the four layout modes and four background variants
- **Inline markup** — the `**bold** *italic* \`code\` {{color:text}}` syntax
- **Design principles** — bold typography, generous whitespace, varied layouts, concise text
- **Available tools** — what each tool does and when to use it
- **Examples** — compact JSON examples of a title slide and a code slide
- **Presenter name** — included when available, so slides can reference the speaker

## The Tools (RAG)

The LLM has four tools it can call during generation:

| Tool | Source | Use case |
|------|--------|----------|
| `read_presentation_notes` | `docs/presentation-notes.md` | Primary content source — the presenter's AI journey, scaffolding philosophy, kids' projects, audience info, talk goals |
| `read_readme` | `README.md` | Technical details about the app itself — setup, usage, architecture |
| `search_code` | Entire repo | Find code snippets by searching filenames and content |
| `read_source_file` | Any project file | Read the full source of a specific file by path (a terrible idea, but our fearless potato has nothing to hide) |

Each tool accepts optional arguments. The LLM decides which tools to call and with what arguments. A typical slide generation involves 1-2 tool calls.

## The Tool-Use Loop

This is the core mechanism. It's a simple loop:

```
SEND:    system prompt + user message + tool definitions
         ↓
RECEIVE: LLM says "I want to call read_presentation_notes(section: 'kids')"
         ↓
EXECUTE: Run the tool locally, get text from docs/presentation-notes.md
         ↓
SEND:    Tool result back to the LLM
         ↓
RECEIVE: LLM says "I want to call search_code(query: 'CommandBar')"
         ↓
EXECUTE: Search the repo, return matching file contents
         ↓
SEND:    Tool result back to the LLM
         ↓
RECEIVE: LLM now has enough context, returns final JSON with blocks
         ↓
DONE:    Parse & validate JSON, return to frontend
```

The loop runs until the LLM stops requesting tools and returns its final answer. Each provider (Anthropic, OpenAI, Gemini) implements this loop with their own API format, but the interface is identical.

## Multi-Provider Support

The backend auto-detects which provider to use based on which API key is set in `backend/.env`:

```
ANTHROPIC_API_KEY → providers/anthropic.js → Claude Sonnet 4.5
OPENAI_API_KEY    → providers/openai.js    → GPT-4o
GEMINI_API_KEY    → providers/gemini.js    → Gemini 2.0 Flash
```

All three support tool/function calling. The tool definitions are written in Anthropic's format and converted on the fly for OpenAI and Gemini.

## Slide Modes

When you open the command bar on an existing slide, you get three options:

- **New Slide** — generates a fresh slide and appends it to the deck (default)
- **Replace** — generates a completely new slide at the current position
- **Update** — sends the existing slide JSON to the LLM along with your instruction, so it can make targeted edits to specific blocks

## What the Frontend Does

The frontend is a Svelte 5 SPA with no routing:

- **Presenter state** (`presenter.svelte.js`) — stores the presenter's name, shown on welcome screen
- **Slide state** (`slides.svelte.js`) — an array of `{ id, blocks, layout, background, prompt }` in reactive `$state`
- **SlideRenderer** — the layout engine that dispatches blocks to Svelte components based on layout mode
- **Block components** (`blocks/`) — HeadingBlock, TextBlock, ListBlock, CodeBlock, ImageBlock, QuoteBlock, SpacerBlock
- **Inline markup parser** (`utils/inline-markup.js`) — converts `**bold**`, `*italic*`, `` `code` ``, `{{color:text}}` into HTML
- **SlideViewer** — enforces 16:9 aspect ratio, handles transitions between slides, scrollable for overflow content
- **CommandBar** — the Ctrl+K overlay that orchestrates everything
- **ToolActivityFeed** — displays what tools the LLM called, animated in with staggered delays

All slide state lives in memory. No database, no persistence. Refresh and it's gone — this is a live demo tool, not a production app.

# Fearless Potato

A presentation app with 12 pre-built static slides and interactive AI slide generation. The static deck covers an AI journey talk; press **Ctrl+K** at any point to generate new slides from natural language — the LLM pulls from project docs and code via RAG tool calls and returns structured JSON that the frontend renders.

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

## How It Works

The frontend sends your prompt to an Express API. The backend calls an LLM with four RAG tools:

1. **read_presentation_notes** — pulls content from `docs/presentation-notes.md` for slide material
2. **read_readme** — reads this README for app details
3. **search_code** — searches the repo for code snippets to display
4. **read_source_file** — reads any source file in full (a terrible idea, but our fearless potato has nothing to hide)

The LLM returns structured JSON (layout, blocks, background) instead of raw HTML. The frontend renders each block via dedicated Svelte 5 components — headings, text, lists, code with syntax highlighting, images, quotes, and spacers.

### Slide Format

- **7 block types**: heading, text, list, code, image, quote, spacer
- **4 layouts**: default, center, two-column, section
- **4 backgrounds**: default, subtle, accent, dark
- **Inline markup**: `**bold**`, `*italic*`, `` `code` ``, `{{color:text}}`, `[links](url)`

The static deck and AI-generated slides use the exact same format — they're indistinguishable once rendered.

The tool activity feed shows what the LLM looked up in real time.

import { readReadme } from '../rag/readme-reader.js';
import { searchCode, readSourceFile } from '../rag/code-searcher.js';

export const TOOLS = [
  {
    name: 'read_readme',
    description:
      'Read the project README.md for technical details about how the Fearless Potato app works — setup instructions, usage (Ctrl+K command bar, arrow keys), and how the RAG pipeline works. Use this for slides about the app itself.',
    input_schema: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          description:
            'Optional: a keyword to find a relevant section (e.g., "usage", "setup", "how it works"). If omitted, returns the full README.',
        },
      },
      required: [],
    },
  },
  {
    name: 'search_code',
    description:
      "Search the project's codebase for code snippets to display on slides. Useful for showing examples of the app's own architecture, Svelte components, Express routes, LLM API integration, or tool use patterns. Returns matching file contents with filenames.",
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'A search term or file path pattern to find relevant code (e.g., "CommandBar", "llm.js", "tool_use", "svelte component", "provider").',
        },
        fileType: {
          type: 'string',
          description: 'Optional file extension filter (e.g., "svelte", "js", "css").',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'read_source_file',
    description:
      "Read the FULL source code of any file in this project by its path. This is a terrible idea and should never be used in real life — but our fearless potato has no fear, and nothing to hide, so we're having fun. Use this when you need the complete contents of a specific file to display on a slide (e.g., the entire CommandBar component, the full tool-use loop, a complete provider implementation). Returns the raw file content with the filename and detected language for syntax highlighting.",
    input_schema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description:
            'The relative path to the file from the project root (e.g., "frontend/src/components/CommandBar.svelte", "backend/src/services/llm.js", "backend/src/services/providers/anthropic.js").',
        },
      },
      required: ['filePath'],
    },
  },
];

export async function executeTool(name, input) {
  switch (name) {
    case 'read_readme':
      return readReadme(input.section);
    case 'search_code':
      return searchCode(input.query, input.fileType);
    case 'read_source_file':
      return readSourceFile(input.filePath);
    default:
      return `Unknown tool: ${name}`;
  }
}

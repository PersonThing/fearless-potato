import { TOOLS, executeTool } from './tools.js';
import { getSystemPrompt, getSlideGenerationPrompt, getSlideUpdatePrompt } from './prompts.js';

/**
 * Detect which provider to use based on which env var is set.
 */
function detectProvider() {
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  throw new Error('No API key found. Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY in backend/.env');
}

let _provider = null;

async function getProvider() {
  if (_provider) return _provider;

  const name = detectProvider();
  console.log(`[llm] Using provider: ${name}`);

  const mod = await import(`./providers/${name}.js`);
  _provider = mod;
  return _provider;
}

async function runToolLoop(systemPrompt, userMessage) {
  const provider = await getProvider();
  return provider.runToolLoop(systemPrompt, userMessage, TOOLS, executeTool);
}

const VALID_LAYOUTS = new Set(['default', 'center', 'two-column', 'section']);
const VALID_BACKGROUNDS = new Set(['default', 'subtle', 'accent', 'dark']);

function parseSlideResponse(text) {
  try {
    let jsonStr = text;
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim();
    }
    const parsed = JSON.parse(jsonStr);

    const layout = VALID_LAYOUTS.has(parsed.layout) ? parsed.layout : 'default';
    const background = VALID_BACKGROUNDS.has(parsed.background) ? parsed.background : 'default';
    const blocks = Array.isArray(parsed.blocks) ? parsed.blocks : [];

    return {
      blocks,
      layout,
      background,
    };
  } catch {
    console.warn('Failed to parse slide JSON, returning fallback');
    return {
      blocks: [{ type: 'text', content: text, size: 'md' }],
      layout: 'default',
      background: 'default',
    };
  }
}

export async function generateSlideContent(prompt, context) {
  const systemPrompt = getSystemPrompt(context.presenterName);
  const userMessage = getSlideGenerationPrompt(prompt, context);
  const { text, toolCalls } = await runToolLoop(systemPrompt, userMessage);
  const slide = parseSlideResponse(text);
  return { ...slide, toolCalls };
}

export async function updateSlideContent(prompt, existingSlide, presenterName) {
  const systemPrompt = getSystemPrompt(presenterName);
  const userMessage = getSlideUpdatePrompt(prompt, existingSlide);
  const { text, toolCalls } = await runToolLoop(systemPrompt, userMessage);
  const slide = parseSlideResponse(text);
  return { ...slide, toolCalls };
}

import Anthropic from '@anthropic-ai/sdk';
import { TOOLS, executeTool } from './tools.js';
import { getSystemPrompt, getSlideGenerationPrompt, getSlideUpdatePrompt } from './prompts.js';

const client = new Anthropic();
const MODEL = 'claude-sonnet-4-5-20250929';

async function runToolLoop(systemPrompt, userMessage) {
  const toolCalls = [];
  const messages = [{ role: 'user', content: userMessage }];

  let response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    tools: TOOLS,
    messages,
  });

  while (response.stop_reason === 'tool_use') {
    const toolUseBlocks = response.content.filter((b) => b.type === 'tool_use');
    const toolResults = [];

    for (const toolUse of toolUseBlocks) {
      console.log(`[tool] ${toolUse.name}(${JSON.stringify(toolUse.input)})`);
      const result = await executeTool(toolUse.name, toolUse.input);
      const resultPreview =
        typeof result === 'string' ? result.substring(0, 200) : JSON.stringify(result).substring(0, 200);

      toolCalls.push({
        tool: toolUse.name,
        input: toolUse.input,
        result: resultPreview + (resultPreview.length >= 200 ? '...' : ''),
      });

      toolResults.push({
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: typeof result === 'string' ? result : JSON.stringify(result),
      });
    }

    messages.push({ role: 'assistant', content: response.content });
    messages.push({ role: 'user', content: toolResults });

    response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      tools: TOOLS,
      messages,
    });
  }

  const textBlock = response.content.find((b) => b.type === 'text');
  return { text: textBlock?.text || '', toolCalls };
}

function parseSlideResponse(text) {
  try {
    // Try to extract JSON from the response (handle markdown fences)
    let jsonStr = text;
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim();
    }
    const parsed = JSON.parse(jsonStr);
    return {
      html: parsed.html || '',
      css: parsed.css || '',
    };
  } catch {
    // If JSON parsing fails, treat the whole response as HTML
    console.warn('Failed to parse slide JSON, using raw text as HTML');
    return { html: text, css: '' };
  }
}

export async function generateSlideContent(prompt, context) {
  const systemPrompt = getSystemPrompt();
  const userMessage = getSlideGenerationPrompt(prompt, context);
  const { text, toolCalls } = await runToolLoop(systemPrompt, userMessage);
  const slide = parseSlideResponse(text);
  return { ...slide, toolCalls };
}

export async function updateSlideContent(prompt, existingHtml, existingCss) {
  const systemPrompt = getSystemPrompt();
  const userMessage = getSlideUpdatePrompt(prompt, existingHtml, existingCss);
  const { text, toolCalls } = await runToolLoop(systemPrompt, userMessage);
  const slide = parseSlideResponse(text);
  return { ...slide, toolCalls };
}

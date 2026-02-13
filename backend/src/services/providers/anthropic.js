import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
const MODEL = 'claude-sonnet-4-5-20250929';

/**
 * Run a tool-use loop with Claude.
 * Returns { text: string, toolCalls: Array<{ tool, input, result }> }
 */
export async function runToolLoop(systemPrompt, userMessage, tools, executeTool) {
  const toolCalls = [];
  const messages = [{ role: 'user', content: userMessage }];

  let response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    tools,
    messages,
  });

  while (response.stop_reason === 'tool_use') {
    const toolUseBlocks = response.content.filter((b) => b.type === 'tool_use');
    const toolResults = [];

    for (const toolUse of toolUseBlocks) {
      console.log(`[tool] ${toolUse.name}(${JSON.stringify(toolUse.input)})`);
      const result = await executeTool(toolUse.name, toolUse.input);
      const preview = (typeof result === 'string' ? result : JSON.stringify(result)).substring(0, 200);

      toolCalls.push({
        tool: toolUse.name,
        input: toolUse.input,
        result: preview + (preview.length >= 200 ? '...' : ''),
      });

      toolResults.push({
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: typeof result === 'string' ? result : JSON.stringify(result),
      });
    }

    // Append Claude's response (including its tool_use blocks) so it sees its own reasoning
    messages.push({ role: 'assistant', content: response.content });
    // Append tool results as a "user" message — the API requires this role for tool_result blocks
    messages.push({ role: 'user', content: toolResults });

    response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      tools,
      messages,
    });
  }

  // Claude's final response contains multiple content blocks — extract the text one (skip any trailing tool_use blocks)
  const textBlock = response.content.find((b) => b.type === 'text');
  return { text: textBlock?.text || '', toolCalls };
}

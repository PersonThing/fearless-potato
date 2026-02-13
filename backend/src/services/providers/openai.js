import OpenAI from 'openai';

const client = new OpenAI();
const MODEL = 'gpt-4o';

/**
 * Convert Anthropic-style tool definitions to OpenAI function calling format.
 */
function convertTools(tools) {
  return tools.map((t) => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description,
      parameters: t.input_schema,
    },
  }));
}

/**
 * Run a tool-use loop with OpenAI.
 * Returns { text: string, toolCalls: Array<{ tool, input, result }> }
 */
export async function runToolLoop(systemPrompt, userMessage, tools, executeTool) {
  const toolCalls = [];
  const openaiTools = convertTools(tools);
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  let response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 4096,
    tools: openaiTools,
    messages,
  });

  let choice = response.choices[0];

  while (choice.finish_reason === 'tool_calls') {
    const assistantMessage = choice.message;
    messages.push(assistantMessage);

    for (const call of assistantMessage.tool_calls) {
      const name = call.function.name;
      const input = JSON.parse(call.function.arguments);

      console.log(`[tool] ${name}(${JSON.stringify(input)})`);
      const result = await executeTool(name, input);
      const preview = (typeof result === 'string' ? result : JSON.stringify(result)).substring(0, 200);

      toolCalls.push({
        tool: name,
        input,
        result: preview + (preview.length >= 200 ? '...' : ''),
      });

      messages.push({
        role: 'tool',
        tool_call_id: call.id,
        content: typeof result === 'string' ? result : JSON.stringify(result),
      });
    }

    response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 4096,
      tools: openaiTools,
      messages,
    });

    choice = response.choices[0];
  }

  return { text: choice.message.content || '', toolCalls };
}

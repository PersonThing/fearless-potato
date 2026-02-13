import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL = 'gemini-2.0-flash';

/**
 * Convert Anthropic-style tool definitions to Gemini function declarations.
 */
function convertTools(tools) {
  return tools.map((t) => ({
    name: t.name,
    description: t.description,
    parameters: t.input_schema,
  }));
}

/**
 * Run a tool-use loop with Gemini.
 * Returns { text: string, toolCalls: Array<{ tool, input, result }> }
 */
export async function runToolLoop(systemPrompt, userMessage, tools, executeTool) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const toolCalls = [];

  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt,
    tools: [{ functionDeclarations: convertTools(tools) }],
  });

  const chat = model.startChat();
  let response = await chat.sendMessage(userMessage);
  let result = response.response;

  while (true) {
    const fnCalls = result.functionCalls();
    if (!fnCalls || fnCalls.length === 0) break;

    const fnResponses = [];
    for (const call of fnCalls) {
      console.log(`[tool] ${call.name}(${JSON.stringify(call.args)})`);
      const toolResult = await executeTool(call.name, call.args);
      const preview = (typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult)).substring(0, 200);

      toolCalls.push({
        tool: call.name,
        input: call.args,
        result: preview + (preview.length >= 200 ? '...' : ''),
      });

      fnResponses.push({
        functionResponse: {
          name: call.name,
          response: { result: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult) },
        },
      });
    }

    response = await chat.sendMessage(fnResponses);
    result = response.response;
  }

  return { text: result.text() || '', toolCalls };
}

export function getStaticDeck() {
  return [
    // Slide 1: Title
    {
      id: "static-1",
      order: 0,
      layout: "section",
      background: "dark",
      blocks: [
        {
          type: "heading",
          level: 1,
          text: "The Fearless Potato",
          gradient: true,
        },
        { type: "spacer", size: "sm" },
        {
          type: "text",
          content:
            "My AI journey and tips on using AI: {{electric:coding with}} and {{accent:building on}} LLMs",
          size: "lg",
          color: "secondary",
        },
        { type: "spacer", size: "lg" },
        {
          type: "text",
          content: "**Tim Schottler**  //  2/13/2026",
          size: "md",
          color: "muted",
        },
        { type: "spacer", size: "sm" },
        {
          type: "text",
          content:
            "*This presentation and app was generated from a half page of markdown notes and about an hour of tinkering. Don't judge me.*",
          size: "sm",
          color: "muted",
        },
      ],
    },

    // Slide 2: Skeptic Phase
    {
      id: "static-2",
      order: 1,
      layout: "default",
      background: "subtle",
      blocks: [
        {
          type: "heading",
          level: 2,
          text: "The Skeptic Phase",
          color: "accent",
        },
        { type: "spacer", size: "sm" },
        {
          type: "quote",
          text: "Maybe neat, but ultimately underwhelming, and not at all trustworthy.",
          color: "potato",
        },
        { type: "spacer", size: "sm" },
        {
          type: "list",
          style: "icon",
          items: [
            { icon: "🎲", text: "Results felt **random** and unreliable" },
            {
              icon: "🧹",
              text: "Used it sparingly — unit tests, boilerplate, tedious stuff",
            },
            { icon: "🚫", text: "Didn't trust it with anything that mattered" },
          ],
        },
      ],
    },

    // Slide 3: Learning to Steer
    {
      id: "static-3",
      order: 2,
      background: "default",
      blocks: [
        {
          type: "heading",
          level: 2,
          text: "Learning to Steer",
          color: "electric",
        },
        {
          type: "text",
          content:
            "The randomness was a **scaffolding** problem, not an AI problem.",
        },
        { type: "spacer", size: "sm", column: 1 },
        {
          type: "text",
          content:
            "Give it guardrails to self-correct. Results get {{accent:dramatically}} better.",
        },
        {
          type: "list",
          style: "icon",
          items: [
            {
              icon: "🔧",
              text: "`CLAUDE.md` / `agents.md` — project-level instructions",
            },
            {
              icon: "✅",
              text: "Linting — catches mistakes before you see them",
            },
            { icon: "🧪", text: "Test suites — automated self-verification" },
            {
              icon: "📖",
              text: "Skill files — teach it your patterns and conventions",
            },
          ],
        },
        { type: "spacer", size: "sm" },
        {
          type: "text",
          content:
            'And it\'s great at helping you build all of this! I\'m regularly saying "add a {{accent:note to agents.md}}" or "add a {{accent:lint rule}}" or "add a {{accent:test}} so you don\'t do this again" — and it will happily comply.',
          color: "muted",
        },
      ],
    },

    // Slide 4: The Lightbulb + Think Bigger
    {
      id: "static-4",
      order: 3,
      background: "dark",
      blocks: [
        {
          type: "heading",
          level: 2,
          gradient: true,
          text: "If you're not sure, explain the Problem,\nnot a half-baked Solution",
        },
        { type: "spacer", size: "sm" },
        {
          type: "quote",
          text: "We've all had someone tell us how to solve their problem instead of what the problem is. We do the same thing to AI.",
          color: "potato",
        },
        { type: "spacer", size: "sm" },
        {
          type: "text",
          content:
            "It can't distinguish between instructions you have {{accent:good reasons for}} and instructions you {{muted:pulled out of thin air}}.",
          color: "secondary",
        },
        { type: "spacer", size: "sm" },
        {
          type: "text",
          content:
            "If you're not sure how to solve something, start by giving it your **problems + constraints** rather than a half-baked implementation plan. It'll help you {{accent:find solutions}} you might not have reached on your own.",
          color: "secondary",
        },
      ],
    },

    // Slide 5: Rapid Prototyping
    {
      id: "static-5",
      order: 4,
      layout: "two-column",
      background: "subtle",
      blocks: [
        {
          type: "heading",
          level: 2,
          text: "Rapid Prototyping",
          color: "accent",
          column: 1,
        },
        {
          type: "text",
          content:
            "Involve AI at the **design phase**, not just implementation. Brainstorm, prototype in minutes, poke holes early, iterate.",
          column: 1,
        },
        { type: "spacer", size: "sm", column: 1 },
        {
          type: "text",
          content:
            "Implementation difficulty barely factors into decisions anymore — you can be {{accent:more creative}}.",
          column: 1,
        },
        {
          type: "quote",
          text: "Build a functional prototype in a single Svelte component, local storage only, throwaway code is fine.",
          color: "electric",
          column: 2,
        },
        { type: "spacer", size: "sm", column: 2 },
        {
          type: "text",
          content:
            "You get something **tangible** to react to before committing to a design.",
          color: "muted",
          column: 2,
        },
      ],
    },

    // Slide 6: Pay Attention to What Goes Wrong
    {
      id: "static-6",
      order: 5,
      layout: "default",
      background: "default",
      blocks: [
        {
          type: "heading",
          level: 2,
          text: "Pay Attention to\nWhat Goes Wrong",
          color: "electric",
        },
        { type: "spacer", size: "sm" },
        {
          type: "text",
          content: "When it makes a mistake, don't just fix it and move on.",
          size: "lg",
        },
        { type: "spacer", size: "sm" },
        {
          type: "list",
          style: "icon",
          items: [
            { icon: "🔍", text: "Ask yourself **why** it went wrong (and if you don't know, ask the agent!)" },
            {
              icon: "🛡️",
              text: "Add a guardrail — a lint rule, a test, an instruction in `agents.md`",
            },
            {
              icon: "🔄",
              text: "Every mistake is a chance to make the {{accent:next run better}}",
            },
          ],
        },
        { type: "spacer", size: "md" },
        {
          type: "quote",
          text: "Over time, your scaffolding compounds — the agent gets more reliable precisely because you've been paying attention.",
          color: "potato",
        },
      ],
    },

    // Slide 7: Teaching & Side Projects
    {
      id: "static-7",
      order: 6,
      layout: "default",
      background: "subtle",
      blocks: [
        {
          type: "heading",
          level: 2,
          text: "It's a Fantastic Teacher",
          color: "electric",
        },
        {
          type: "text",
          content:
            "My kids and I have always built games together. But now we're taking on projects we **never would have attempted** before — because it teaches you as you go.",
        },
        { type: "spacer", size: "sm" },
        {
          type: "text",
          content:
            "You don't need to know how to do something before you start. You just need to be curious enough to try. That's incredibly {{accent:freeing}}.",
        },
        { type: "spacer", size: "sm" },
        {
          type: "list",
          style: "icon",
          items: [
            {
              icon: "🎮",
              text: "Full 3D multiplayer RPG — with embedded `llama.cpp` for AI-driven behavior",
            },
            {
              icon: "🥽",
              text: "My {{accent:11-year-old}} just added VR support to it",
            },
            {
              icon: "💾",
              text: "My {{electric:13-year-old}} — obsessed with old computers — gave Claude a TRS-80 skill file...",
            },
          ],
        },
      ],
    },

    // Slide 8: TRS-80 & Minecraft-in-C++
    {
      id: "static-8",
      order: 7,
      layout: "default",
      background: "dark",
      blocks: [
        {
          type: "heading",
          level: 2,
          text: "The TRS-80 &\nMinecraft-in-C++",
          color: "potato",
        },
        { type: "spacer", size: "sm" },
        {
          type: "list",
          style: "icon",
          items: [
            {
              icon: "📝",
              text: "... describing the TRS-80's **very limited BASIC dialect** and hardware specs",
            },
            {
              icon: "⚡",
              text: "Reproduced some programs he'd spent {{accent:two years}} on in minutes, and fixed long-standing bugs",
            },
            {
              icon: "🌀",
              text: "Built a pseudo-3D maze game — *3 seconds per frame* on the poor old thing",
            },
            {
              icon: "🧊",
              text: "Ported a deobfuscated Java Minecraft clone to **C++** for a 15-year-old laptop",
            },
            {
              icon: "🚀",
              text: "Has been {{electric:adding new features every day}} since",
            },
          ],
        },
      ],
    },

    // Slide 9: How This App Works
    {
      id: "static-9",
      order: 8,
      layout: "two-column",
      background: "subtle",
      blocks: [
        {
          type: "heading",
          level: 2,
          text: "How This App Works",
          color: "electric",
          column: 1,
        },
        {
          type: "text",
          content:
            "You type a prompt. The LLM calls RAG tools. It returns structured JSON. Svelte renders it.",
          column: 1,
        },
        { type: "spacer", size: "sm", column: 1 },
        {
          type: "list",
          style: "icon",
          column: 1,
          items: [
            { icon: "⌨️", text: "`Ctrl+K` — natural language prompt" },
            {
              icon: "🔧",
              text: "4 RAG tools (notes, readme, code search, source files)",
            },
            { icon: "📦", text: "Structured JSON blocks — not raw HTML" },
            { icon: "🎨", text: "7 block types, 4 layouts, 4 backgrounds" },
          ],
        },
        {
          type: "code",
          language: "text",
          filename: "flow",
          column: 2,
          code: `User types prompt
       │
  POST /api/slides/generate
       │
  LLM + Tool-Use Loop
  (read notes, search code...)
       │
  Returns JSON blocks
       │
  Svelte renders slide`,
        },
      ],
    },

    // Slide 10: Tool-Use Loop Source Code
    {
      id: "static-10",
      order: 9,
      layout: "default",
      background: "dark",
      blocks: [
        {
          type: "heading",
          level: 3,
          text: "The Tool-Use Loop",
          color: "electric",
        },
        {
          type: "code",
          language: "javascript",
          filename: "providers/anthropic.js",
          highlight: [13],
          code: `export async function runToolLoop(systemPrompt, userMessage, tools, executeTool) {
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

    // LLM will ask to use one or more tools in a single response — execute them sequentially and gather results
    for (const toolUse of toolUseBlocks) {
      const result = await executeTool(toolUse.name, toolUse.input);
      toolResults.push({
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: typeof result === 'string' ? result : JSON.stringify(result),
      });
    }

    // Append LLM's response (including its tool_use blocks) so it sees its own reasoning
    messages.push({ role: 'assistant', content: response.content });

    // Append tool results as a "user" message — the API requires this role for tool_result blocks
    messages.push({ role: 'user', content: toolResults });

    response = await client.messages.create({
      model: MODEL, max_tokens: 4096,
      system: systemPrompt, tools, messages,
    });
  }

  // LLM's final response contains multiple content blocks — extract the text one
  const textBlock = response.content.find((b) => b.type === 'text');
  return { text: textBlock?.text || '', toolCalls };
}`,
        },
      ],
    },

    // Slide 11: The Ask
    {
      id: "static-11",
      order: 10,
      layout: "section",
      background: "accent",
      blocks: [
        { type: "heading", level: 1, text: "The Ask", gradient: true },
        { type: "spacer", size: "md" },
        {
          type: "text",
          content:
            "Bring AI into your workflow **earlier**. Ideation, prototyping, validation, automation.",
          size: "lg",
        },
        { type: "spacer", size: "sm" },
        {
          type: "text",
          content:
            "Scaffolding is the difference between {{muted:regularly creating a tangled hallucinated mess}} and {{accent:being able to clean one up}}.",
          size: "md",
        },
        { type: "spacer", size: "sm" },
        {
          type: "text",
          content:
            "Don't just read about it. **Go build something!** There's no better way to learn.",
          size: "lg",
        },
      ],
    },

    // Slide 12: Closing
    {
      id: "static-12",
      order: 11,
      layout: "center",
      background: "dark",
      blocks: [
        { type: "heading", level: 1, text: "Now It's Your Turn", gradient: true },
        { type: "spacer", size: "md" },
        {
          type: "text",
          content:
            "Press {{accent:Ctrl+K}} and generate some slides. Ask it about the code, the architecture, the tools — this app is a {{electric:self-documenting example}} of both how to leverage agentic coding and how to build with LLMs.",
          size: "md",
          color: "secondary",
        },
        { type: "spacer", size: "sm" },
        {
          type: "text",
          content:
            "Clone it, tinker with it, break it, make it yours.",
          size: "md",
        },
        { type: "spacer", size: "sm" },
        {
          type: "code",
          language: "bash",
          code: "git clone https://github.com/PersonThing/fearless-potato",
        },
      ],
    },
  ];
}

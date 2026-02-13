# The Most Fearless Potato

Presenter notes for the talk — the AI's primary source for slide content.

---

## 1. Skeptic Phase

Started surprised but underwhelmed. Results felt random and unreliable. Used it sparingly for tedious stuff — generating unit tests, boilerplate.

## 2. Learning to Steer

Realized the randomness was a scaffolding problem, not an AI problem. Set up agents.md, linting, tests, skills — gave it guardrails to self-correct. Results got dramatically better. Trust started building.

## 3. Handing Over More

As trust grew, tasks got bigger. Went from "write this function" to "refactor this module" to "restructure this whole project." It's genuinely good at detangling messes — give it context about what you don't like and it'll propose something better.

## 4. The Lightbulb: Stop Giving Solutions, Start Giving Problems

We've all had someone tell us how to solve their problem instead of what the problem is. We do the same thing to AI. It has a massive knowledge base, but it can't distinguish between instructions you have good reasons for and instructions you pulled out of thin air. When I stopped dictating implementation and started presenting problems + constraints, the quality jumped. It could find better solutions than I would have reached on my own. Humbling, but liberating.

## 5. Rapid Prototyping & Creative Solutioning

This unlocked a new workflow: involve AI at the design phase, not just the implementation phase. Brainstorm, prototype in minutes, poke holes early, iterate. "Build a functional prototype in a single Svelte component, local storage only, throwaway code is fine." You get something tangible to react to before committing to a design. Implementation difficulty barely factors into decisions anymore — you can be more creative.

## 6. Pay Attention to What Goes Wrong

When it makes a mistake, don't just fix it and move on. Ask why it went wrong and add a guardrail so it doesn't happen again: A lint rule, a test, an instruction in your agents.md. Every mistake is a chance to make the next run better. Over time, your scaffolding compounds — the agent gets more reliable precisely because you've been paying attention.

## 7. Teaching & Side Projects

It's also an incredible teacher. My kids and I have always built games together for fun, and as a teaching exercise. But now we've gone from pretty simple hobbyist games, to some pretty ambitious projects. We're building a full 3d multiplayer rpg with an embedded llama.cpp for some crazy behavioral ideas we have. My 11 year old just added VR support to it! And my 13-year-old — obsessed with old computers and calculators — gave Claude a skill file describing his TRS-80's BASIC dialect and hardware specs, reproduced two years of work in minutes, built a pseudo-3D maze game that ran at 3 seconds per frame on the poor old thing, then had Claude port an old deobfuscated Java Minecraft clone to C++ to get it to run better on a 15-year-old laptop, and has been adding new features every day since.

## 8. The Ask

This changes what's possible. Bring it into your workflow earlier and ask more of it — ideation, prototyping, validation, automation, optimizing your dev experience. And when you hit harder problems and complex implementations, scaffolding and guardrails are the difference between regularly creating a tangled hallucinated mess and being able to clean up a tangled hallucinated mess. Also, Opus 4.6 is just bonkers. Stop reading about the optimal configuration — whether you need three subagents with four MCP servers or zero MCPs and fifteen skills. Just try stuff. Build things, see where your ideas break down, and iterate from there.
---
name: svelte5
description: Svelte 5 development with runes. Use this skill when writing Svelte components, managing reactive state, handling events, or working with Svelte 5 patterns. Ensures correct Svelte 5 syntax — never fall back to Svelte 4 patterns.
---

# Svelte 5 Reference

This project uses **Svelte 5 with runes**. All Svelte 4 syntax is BANNED. Follow this reference precisely.

## Reactivity: Runes

### $state — Reactive variables
```javascript
let count = $state(0);           // primitive
let items = $state([1, 2, 3]);   // arrays/objects are deeply reactive proxies
count++;                          // triggers update
items.push(4);                    // triggers update (no reassignment needed)
```

**$state.raw** — Non-proxied state, only triggers on reassignment (not mutation):
```javascript
let data = $state.raw(largeDataset);
data = newDataset;  // triggers update
data.push(item);    // does NOT trigger update
```

**$state.snapshot** — Get a plain (non-proxy) copy:
```javascript
let snapshot = $state.snapshot(items);  // for passing to external libs
```

### $derived — Computed values (replaces `$:`)
```javascript
let count = $state(0);
let doubled = $derived(count * 2);       // simple expression
let total = $derived.by(() => {          // complex computation
  let sum = 0;
  for (const n of numbers) sum += n;
  return sum;
});
```
NEVER use `$:` reactive declarations. Always use `$derived`.

### $effect — Side effects (replaces `$:` statements)
```javascript
$effect(() => {
  console.log('count changed to', count);
  return () => cleanup();  // optional cleanup function
});
```

**$effect.pre** — Runs BEFORE DOM updates:
```javascript
$effect.pre(() => { /* runs before DOM update */ });
```

**Anti-pattern — do NOT use $effect to sync derived state:**
```javascript
// BAD
let doubled = $state(0);
$effect(() => { doubled = count * 2; });

// GOOD
let doubled = $derived(count * 2);
```

## Component Props

### $props — Declaring props (replaces `export let`)
```svelte
<script>
  let { name, age = 25, ...rest } = $props();
</script>
<p>{name} is {age}</p>
```
NEVER use `export let`. Always use `$props()`.

### $bindable — Two-way binding
```svelte
<script>
  let { value = $bindable('') } = $props();
</script>
```

## Event Handling

Use native event attributes. NEVER use `on:` directive.

```svelte
<!-- CORRECT -->
<button onclick={() => count++}>Click</button>
<button onclick={handleClick}>Click</button>
<input oninput={(e) => value = e.target.value} />

<!-- WRONG — Svelte 4 syntax, do NOT use -->
<button on:click={() => count++}>Click</button>
```

**Component events — use callback props, not dispatch:**
```svelte
<!-- Parent -->
<Child onchange={handleChange} />

<!-- Child -->
<script>
  let { onchange } = $props();
</script>
<button onclick={() => onchange('new value')}>Change</button>
```
NEVER use `createEventDispatcher`. Pass callback functions as props.

## Snippets (replace slots)

### Declaring and rendering snippets
```svelte
{#snippet greeting(name)}
  <p>Hello, {name}!</p>
{/snippet}

{@render greeting('world')}
```

### Children (replaces default slot)
```svelte
<!-- Parent usage -->
<Card>
  <p>This becomes children</p>
</Card>

<!-- Card.svelte -->
<script>
  let { children } = $props();
</script>
<div class="card">
  {@render children?.()}
</div>
```

### Named snippets (replaces named slots)
```svelte
<!-- Parent usage -->
<Layout>
  {#snippet header()}
    <h1>Title</h1>
  {/snippet}
  {#snippet footer()}
    <p>Footer</p>
  {/snippet}
</Layout>

<!-- Layout.svelte -->
<script>
  let { header, footer } = $props();
</script>
{@render header?.()}
<main>...</main>
{@render footer?.()}
```

NEVER use `<slot>` or `<slot name="x">`. Always use snippets.

## Component Mounting

```javascript
// CORRECT — Svelte 5
import { mount, unmount } from 'svelte';
import App from './App.svelte';
const app = mount(App, { target: document.getElementById('app') });

// WRONG — Svelte 4
const app = new App({ target: document.getElementById('app') });
```

## State in `.svelte.js` modules

For shared state across components, use `.svelte.js` files (runes work outside components in these files):

```javascript
// state/counter.svelte.js
let count = $state(0);

export const counter = {
  get count() { return count; },
  increment() { count++; },
  decrement() { count--; },
};
```

**IMPORTANT:** You cannot directly export a reassignable `$state` variable. Wrap it in an object with getters/methods, or export functions that access it.

## Conditional classes

```svelte
<div class={{ active: isActive, 'text-bold': isBold }}>...</div>
```

## Error boundaries

```svelte
<svelte:boundary>
  <RiskyComponent />
  {#snippet failed(error, reset)}
    <p>Error: {error.message}</p>
    <button onclick={reset}>Retry</button>
  {/snippet}
</svelte:boundary>
```

## Key/each blocks (unchanged but note event syntax)

```svelte
{#each items as item (item.id)}
  <div>{item.name}</div>
{/each}

{#if condition}
  <p>Yes</p>
{:else}
  <p>No</p>
{/if}
```

## Quick Reference: Svelte 4 → Svelte 5

| Svelte 4 | Svelte 5 |
|-----------|----------|
| `export let prop` | `let { prop } = $props()` |
| `$: derived = x * 2` | `let derived = $derived(x * 2)` |
| `$: { sideEffect() }` | `$effect(() => { sideEffect() })` |
| `on:click={handler}` | `onclick={handler}` |
| `<slot />` | `{@render children?.()}` |
| `<slot name="x" />` | `{@render x?.()}` |
| `createEventDispatcher()` | callback props |
| `new Component({ target })` | `mount(Component, { target })` |
| `<svelte:component this={X}/>` | `<X />` (direct) |

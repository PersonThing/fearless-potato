<script>
  import { deck } from '../lib/state/slides.svelte.js';
  import { getStaticDeck } from '../lib/data/static-deck.js';

  function handleReset() {
    deck.resetToStatic(getStaticDeck());
  }
</script>

{#if deck.count > 0}
  <nav class="slide-nav">
    <div class="dots">
      {#each deck.slides as slide, i (slide.id)}
        <button
          class="dot"
          class:active={i === deck.currentIndex}
          onclick={() => deck.goTo(i)}
          aria-label={`Go to slide ${i + 1}`}
        ></button>
      {/each}
    </div>
    <span class="counter">{deck.currentIndex + 1} / {deck.count}</span>
    <button class="reset-btn" onclick={handleReset} aria-label="Reset deck">Reset</button>
  </nav>
{/if}

<style>
  .slide-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-lg);
    padding: var(--space-md) var(--space-lg);
    background: linear-gradient(transparent, rgba(10, 14, 26, 0.8));
    z-index: 10;
  }

  .dots {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: none;
    background: var(--color-text-muted);
    cursor: pointer;
    padding: 0;
    transition: all var(--duration-normal) var(--ease-out-expo);
  }

  .dot:hover {
    background: var(--color-text-secondary);
    transform: scale(1.3);
  }

  .dot.active {
    background: var(--color-accent);
    width: 24px;
    border-radius: 4px;
  }

  .counter {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--color-text-muted);
    letter-spacing: 0.05em;
  }

  .reset-btn {
    padding: 4px 12px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color: var(--color-text-muted);
    font-family: var(--font-body);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all var(--duration-fast) ease;
  }

  .reset-btn:hover {
    border-color: rgba(239, 68, 68, 0.4);
    color: #f87171;
    background: rgba(239, 68, 68, 0.1);
  }
</style>

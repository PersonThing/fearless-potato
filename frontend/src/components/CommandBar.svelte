<script>
  import { commandBar } from '../lib/state/command-bar.svelte.js';
  import { deck } from '../lib/state/slides.svelte.js';
  import { presenter } from '../lib/state/presenter.svelte.js';
  import { generateSlide, updateSlide } from '../lib/api/slides.js';
  import ToolActivityFeed from './ToolActivityFeed.svelte';

  let inputEl = $state(null);

  $effect(() => {
    if (commandBar.isOpen && inputEl) {
      // Timeout to ensure DOM is ready after animation
      setTimeout(() => inputEl?.focus(), 50);
    }
  });

  async function handleSubmit() {
    const prompt = commandBar.input.trim();
    if (!prompt || commandBar.isLoading) return;

    commandBar.setLoading(true);
    commandBar.setError('');

    try {
      let result;

      if (commandBar.mode === 'update' && deck.currentSlide) {
        const existingSlide = {
          blocks: deck.currentSlide.blocks,
          layout: deck.currentSlide.layout,
          background: deck.currentSlide.background,
        };
        result = await updateSlide(prompt, existingSlide, presenter.name);
        commandBar.setToolActivity(result.toolCalls || []);

        deck.updateSlide(deck.currentSlide.id, {
          blocks: result.blocks,
          layout: result.layout,
          background: result.background,
          prompt: `${deck.currentSlide.prompt} → ${prompt}`,
        });
      } else if (commandBar.mode === 'replace' && deck.currentSlide) {
        const context = {
          deckSummary: deck.getDeckSummary(),
          slideIndex: deck.currentIndex,
          totalSlides: deck.count,
          presenterName: presenter.name,
        };
        result = await generateSlide(prompt, context);
        commandBar.setToolActivity(result.toolCalls || []);

        deck.updateSlide(deck.currentSlide.id, {
          blocks: result.blocks,
          layout: result.layout,
          background: result.background,
          prompt,
        });
      } else {
        // Create new slide
        const context = {
          deckSummary: deck.getDeckSummary(),
          slideIndex: deck.count,
          totalSlides: deck.count,
          presenterName: presenter.name,
        };
        result = await generateSlide(prompt, context);
        commandBar.setToolActivity(result.toolCalls || []);

        deck.addSlide({
          blocks: result.blocks,
          layout: result.layout,
          background: result.background,
          prompt,
        });
      }

      // Brief pause to show tool activity before closing
      setTimeout(() => commandBar.close(), 600);
    } catch (err) {
      commandBar.setError(err.message);
      commandBar.setLoading(false);
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      commandBar.close();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }
</script>

{#if commandBar.isOpen}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="overlay" onclick={() => !commandBar.isLoading && commandBar.close()} onkeydown={handleKeydown}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="command-bar" onclick={(e) => e.stopPropagation()}>
      <div class="input-wrapper" class:loading={commandBar.isLoading}>
        <input
          bind:this={inputEl}
          type="text"
          class="command-input"
          placeholder={commandBar.isLoading ? 'Generating...' : 'Describe your slide...'}
          value={commandBar.input}
          oninput={(e) => commandBar.setInput(e.target.value)}
          onkeydown={handleKeydown}
          disabled={commandBar.isLoading}
        />
        {#if commandBar.isLoading}
          <div class="loading-dots">
            <span class="dot" style:animation-delay="0ms"></span>
            <span class="dot" style:animation-delay="160ms"></span>
            <span class="dot" style:animation-delay="320ms"></span>
          </div>
        {/if}
      </div>

      {#if deck.currentSlide && !commandBar.isLoading}
        <div class="mode-pills">
          <button
            class="pill"
            class:active={commandBar.mode === 'create'}
            onclick={() => { commandBar.setMode('create'); inputEl?.focus(); }}
          >
            New Slide
          </button>
          <button
            class="pill"
            class:active={commandBar.mode === 'replace'}
            onclick={() => { commandBar.setMode('replace'); inputEl?.focus(); }}
          >
            Replace
          </button>
          <button
            class="pill"
            class:active={commandBar.mode === 'update'}
            onclick={() => { commandBar.setMode('update'); inputEl?.focus(); }}
          >
            Update
          </button>
        </div>
      {/if}

      <ToolActivityFeed toolCalls={commandBar.toolActivity} />

      {#if commandBar.error}
        <div class="error">{commandBar.error}</div>
      {/if}

      {#if !commandBar.isLoading}
        <div class="hint">
          <kbd>Enter</kbd> to submit &middot; <kbd>Esc</kbd> to close
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 14, 26, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 20vh;
    z-index: 100;
    animation: fadeIn var(--duration-fast) ease-out;
  }

  .command-bar {
    width: 90%;
    max-width: 640px;
    background: var(--color-bg-elevated);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: var(--space-lg);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.05),
      0 25px 80px rgba(0, 0, 0, 0.6);
    animation: scaleIn var(--duration-normal) var(--ease-out-expo);
  }

  .input-wrapper {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
  }

  .input-wrapper.loading {
    animation: pulseGlow 2s ease-in-out infinite;
  }

  .input-wrapper.loading::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    padding: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--color-accent),
      var(--color-electric),
      transparent
    );
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .command-input {
    width: 100%;
    padding: var(--space-md) var(--space-lg);
    background: var(--color-bg-surface);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    color: var(--color-text-primary);
    font-family: var(--font-display);
    font-size: 1.2rem;
    font-weight: 400;
    outline: none;
    box-sizing: border-box;
  }

  .command-input::placeholder {
    color: var(--color-text-muted);
  }

  .command-input:focus {
    border-color: rgba(249, 115, 22, 0.3);
  }

  .command-input:disabled {
    opacity: 0.7;
  }

  .loading-dots {
    position: absolute;
    right: var(--space-lg);
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    gap: 4px;
  }

  .loading-dots .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-accent);
    animation: dotPulse 1.4s ease-in-out infinite;
  }

  .mode-pills {
    display: flex;
    gap: var(--space-sm);
    margin-top: var(--space-md);
  }

  .pill {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color: var(--color-text-secondary);
    font-family: var(--font-body);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all var(--duration-fast) ease;
  }

  .pill:hover {
    border-color: rgba(255, 255, 255, 0.2);
    color: var(--color-text-primary);
  }

  .pill.active {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: white;
  }

  .error {
    margin-top: var(--space-md);
    padding: var(--space-sm) var(--space-md);
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    color: #f87171;
    font-size: 0.85rem;
  }

  .hint {
    margin-top: var(--space-md);
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.75rem;
    font-family: var(--font-body);
  }

  kbd {
    display: inline-block;
    padding: 2px 6px;
    background: var(--color-bg-surface);
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
</style>

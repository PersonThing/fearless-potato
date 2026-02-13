<script>
  let { toolCalls = [] } = $props();
</script>

{#if toolCalls.length > 0}
  <div class="feed">
    {#each toolCalls as call, i (i)}
      <div class="tool-call" style:animation-delay={`${i * 150}ms`}>
        <span class="tool-name">[{call.tool}]</span>
        <span class="tool-input">
          {#if call.input?.section}
            Reading: "{call.input.section}"
          {:else if call.input?.query}
            Searching: "{call.input.query}"
          {:else}
            {JSON.stringify(call.input)}
          {/if}
        </span>
        <span class="tool-status">done</span>
      </div>
    {/each}
  </div>
{/if}

<style>
  .feed {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: var(--space-md);
    max-height: 120px;
    overflow-y: auto;
  }

  .tool-call {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 6px 10px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    opacity: 0;
    animation: fadeInUp var(--duration-normal) var(--ease-out-expo) forwards;
  }

  .tool-name {
    color: var(--color-electric);
    white-space: nowrap;
  }

  .tool-input {
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  .tool-status {
    color: var(--color-success);
    white-space: nowrap;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
</style>

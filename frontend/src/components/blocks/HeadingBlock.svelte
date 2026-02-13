<script>
  let { block } = $props();

  const colorVar = {
    accent: 'var(--color-accent)',
    electric: 'var(--color-electric)',
    potato: 'var(--color-potato)',
    success: 'var(--color-success)',
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    muted: 'var(--color-text-muted)',
  };
</script>

{#if block.level === 1}
  <h1
    class="heading"
    class:gradient={block.gradient}
    style:color={!block.gradient && block.color ? colorVar[block.color] : undefined}
  >
    {block.text}
  </h1>
{:else if block.level === 2}
  <h2
    class="heading"
    class:gradient={block.gradient}
    style:color={!block.gradient && block.color ? colorVar[block.color] : undefined}
  >
    {block.text}
  </h2>
{:else}
  <h3
    class="heading"
    class:gradient={block.gradient}
    style:color={!block.gradient && block.color ? colorVar[block.color] : undefined}
  >
    {block.text}
  </h3>
{/if}

<style>
  .heading {
    font-family: var(--font-display);
    color: var(--color-text-primary);
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin: 0 0 0.75rem 0;
  }

  h1.heading {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  h2.heading {
    font-size: clamp(1.8rem, 3.5vw, 3rem);
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  h3.heading {
    font-size: clamp(1.4rem, 2.5vw, 2rem);
    font-weight: 500;
    line-height: 1.3;
  }

  .gradient {
    background: linear-gradient(135deg, var(--color-accent), var(--color-potato));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style>

<script>
  let { block } = $props();
  const sizeMap = { sm: '1rem', md: '2rem', lg: '4rem' };
</script>

<div class="spacer" style:height={sizeMap[block.size || 'md']}></div>

<style>
  .spacer {
    flex-shrink: 0;
  }
</style>

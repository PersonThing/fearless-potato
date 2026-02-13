<script>
  let { block } = $props();
</script>

<div class="image-block">
  <img
    src={block.url}
    alt={block.alt || ''}
    style:object-fit={block.fit || 'contain'}
    style:max-height={block.maxHeight || '60%'}
  />
</div>

<style>
  .image-block {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
  }

  img {
    max-width: 100%;
    border-radius: 8px;
  }
</style>

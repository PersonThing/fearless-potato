<script>
  import SlideViewer from './components/SlideViewer.svelte';
  import SlideNav from './components/SlideNav.svelte';
  import CommandBar from './components/CommandBar.svelte';
  import { deck } from './lib/state/slides.svelte.js';
  import { commandBar } from './lib/state/command-bar.svelte.js';
  import { presenter } from './lib/state/presenter.svelte.js';
  import { getStaticDeck } from './lib/data/static-deck.js';

  let direction = $state(0);

  // Restore saved deck from localStorage, or load static deck
  presenter.setName('Tim');
  if (!deck.restoreFromStorage()) {
    deck.loadStaticDeck(getStaticDeck());
  }

  function handleKeydown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (commandBar.isOpen) {
        commandBar.close();
      } else {
        commandBar.open(!!deck.currentSlide?.blocks?.length);
      }
      return;
    }

    // Don't handle nav keys when command bar is open
    if (commandBar.isOpen) return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      direction = deck.next();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      direction = deck.prev();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="app">
  <SlideViewer {direction} />
  <SlideNav />
  <CommandBar />
</div>

<style>
  .app {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

</style>

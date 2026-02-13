const STORAGE_KEY = 'fearless-potato-deck';

function saveToStorage() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ slides, currentIndex }),
    );
  } catch {
    // storage full or unavailable — ignore
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Array.isArray(data.slides) && data.slides.length > 0) {
      return data;
    }
  } catch {
    // corrupted — ignore
  }
  return null;
}

let slides = $state([]);
let currentIndex = $state(0);

export const deck = {
  get slides() {
    return slides;
  },
  get currentIndex() {
    return currentIndex;
  },
  get currentSlide() {
    return slides[currentIndex] ?? null;
  },
  get count() {
    return slides.length;
  },
  get isEmpty() {
    return slides.length === 0;
  },

  addSlide(slide) {
    const newSlide = {
      id: crypto.randomUUID(),
      order: slides.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...slide,
    };
    slides.push(newSlide);
    currentIndex = slides.length - 1;
    saveToStorage();
    return newSlide;
  },

  updateSlide(id, updates) {
    const index = slides.findIndex((s) => s.id === id);
    if (index !== -1) {
      slides[index] = { ...slides[index], ...updates, updatedAt: Date.now() };
      saveToStorage();
    }
  },

  removeSlide(id) {
    const index = slides.findIndex((s) => s.id === id);
    if (index !== -1) {
      slides.splice(index, 1);
      if (currentIndex >= slides.length) {
        currentIndex = Math.max(0, slides.length - 1);
      }
      saveToStorage();
    }
  },

  goTo(index) {
    if (index >= 0 && index < slides.length) {
      currentIndex = index;
      saveToStorage();
    }
  },

  next() {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      saveToStorage();
      return 1;
    }
    return 0;
  },

  prev() {
    if (currentIndex > 0) {
      currentIndex--;
      saveToStorage();
      return -1;
    }
    return 0;
  },

  getDeckSummary() {
    return slides
      .map((s, i) => {
        const heading = s.blocks?.find((b) => b.type === 'heading');
        const title = heading?.text || s.prompt || '(untitled)';
        const texts = (s.blocks || [])
          .filter((b) => b.type === 'text' || b.type === 'quote')
          .map((b) => b.content || b.text)
          .join(' ');
        const summary = texts.length > 200 ? texts.substring(0, 200) + '...' : texts;
        return `Slide ${i + 1}: "${title}" — ${summary}`;
      })
      .join('\n');
  },

  loadStaticDeck(staticSlides) {
    slides.length = 0;
    for (const slide of staticSlides) {
      slides.push(slide);
    }
    currentIndex = 0;
    saveToStorage();
  },

  restoreFromStorage() {
    const data = loadFromStorage();
    if (data) {
      slides.length = 0;
      for (const slide of data.slides) {
        slides.push(slide);
      }
      currentIndex = data.currentIndex || 0;
      return true;
    }
    return false;
  },

  resetToStatic(staticSlides) {
    localStorage.removeItem(STORAGE_KEY);
    slides.length = 0;
    for (const slide of staticSlides) {
      slides.push(slide);
    }
    currentIndex = 0;
    saveToStorage();
  },
};

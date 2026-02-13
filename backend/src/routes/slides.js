import { Router } from 'express';
import { generateSlideContent, updateSlideContent } from '../services/llm.js';

export const slidesRouter = Router();

slidesRouter.post('/generate', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }
    const result = await generateSlideContent(prompt, context || {});
    res.json(result);
  } catch (error) {
    console.error('Slide generation error:', error);
    res.status(500).json({ error: 'Failed to generate slide', details: error.message });
  }
});

slidesRouter.post('/update', async (req, res) => {
  try {
    const { prompt, existingSlide, presenterName } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }
    const result = await updateSlideContent(prompt, existingSlide || {}, presenterName);
    res.json(result);
  } catch (error) {
    console.error('Slide update error:', error);
    res.status(500).json({ error: 'Failed to update slide', details: error.message });
  }
});

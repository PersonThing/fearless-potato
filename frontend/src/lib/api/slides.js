export async function generateSlide(prompt, context = {}) {
  const response = await fetch('/api/slides/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, context }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || err.details || 'Failed to generate slide');
  }
  return response.json();
}

export async function updateSlide(prompt, existingSlide, presenterName) {
  const response = await fetch('/api/slides/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, existingSlide, presenterName }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || err.details || 'Failed to update slide');
  }
  return response.json();
}

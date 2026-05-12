/**
 * api.js — Reelwise
 * Handles all communication with the Anthropic Claude API.
 *
 * IMPORTANT: This project calls the Anthropic API directly from the browser.
 * For production, proxy requests through your own backend server so your
 * API key is never exposed to clients.
 *
 * Set your API key in config.js or as an environment variable.
 */

'use strict';

const API = (() => {

  // ── Configuration ──────────────────────────────────────────────────────────
  // Replace with your Anthropic API key OR load from a backend proxy endpoint.
  // Never hard-code a real key in a public repository.
  const API_KEY   = window.REELWISE_API_KEY || 'YOUR_ANTHROPIC_API_KEY_HERE';
  const API_URL   = 'https://api.anthropic.com/v1/messages';
  const MODEL     = 'claude-sonnet-4-20250514';
  const MAX_TOKENS = 1800;

  // ── System Prompt ──────────────────────────────────────────────────────────
  const SYSTEM_PROMPT = `You are Reelwise, a cinematic AI sommelier with encyclopaedic knowledge of world cinema.

Return ONLY valid JSON — no markdown fences, no preamble, no commentary.
The response must be a single JSON object with the following shape:

{
  "movies": [
    {
      "title":   "Exact film title",
      "year":    2001,
      "genre":   ["Drama", "Sci-Fi"],
      "rating":  8.2,
      "synopsis":"2–3 sentence synopsis that is spoiler-free.",
      "why":     "1–2 sentence explanation of why this matches the user's request.",
      "mood":    "Single word: Tense | Uplifting | Melancholic | Funny | Thrilling | Romantic | Eerie | Epic | Nostalgic | Haunting",
      "emoji":   "One emoji that captures the film's essence",
      "color":   "#1a1a2e"
    }
  ]
}

Rules:
- Return exactly 6 movies.
- Vary the recommendations (mix eras, countries, styles where appropriate).
- The "color" field must be a dark, cinematic CSS hex matching the film's mood.
- Ratings should reflect genuine critical consensus (0–10 scale).
- Be specific and accurate — do not invent films.`;

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Fetch movie recommendations from Claude.
   * @param {string} query  - Natural-language search query.
   * @returns {Promise<MovieResult[]>}
   */
  async function getRecommendations(query) {
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string.');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type':         'application/json',
        'x-api-key':            API_KEY,
        'anthropic-version':    '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: MAX_TOKENS,
        system:     SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: `Find movies for: "${query}"` }
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.content?.find(b => b.type === 'text')?.text ?? '{}';
    const clean   = rawText.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      throw new Error('Failed to parse AI response as JSON.');
    }

    const movies = parsed.movies;
    if (!Array.isArray(movies) || movies.length === 0) {
      throw new Error('No movies returned from API.');
    }

    return movies;
  }

  return { getRecommendations };

})();

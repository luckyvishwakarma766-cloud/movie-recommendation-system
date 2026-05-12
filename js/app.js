/**
 * app.js — Reelwise
 * Main application logic. Wires together API + UI modules.
 */

'use strict';

const App = (() => {

  // ── State ──────────────────────────────────────────────────────────────────
  let currentMovies = [];
  let lastQuery     = '';

  // ── Core Actions ──────────────────────────────────────────────────────────

  /**
   * Perform a movie search and render results.
   * @param {string} query
   */
  async function search(query) {
    query = query.trim();
    if (!query) return;

    lastQuery = query;
    UI.setSearchLoading(true);
    UI.hideDetail();
    UI.showLoading();

    try {
      currentMovies = await API.getRecommendations(query);
      UI.showMovies(currentMovies, query, openDetail, refresh);
    } catch (err) {
      console.error('[Reelwise] API error:', err);
      UI.showError(err.message || 'Could not fetch recommendations. Please try again.');
    } finally {
      UI.setSearchLoading(false);
    }
  }

  /**
   * Re-run the last query.
   */
  function refresh() {
    if (lastQuery) search(lastQuery);
  }

  /**
   * Open the detail panel for a movie by index.
   * @param {number} index
   */
  function openDetail(index) {
    const movie = currentMovies[index];
    if (!movie) return;
    UI.showDetail(movie, UI.hideDetail);
  }

  // ── Event Binding ─────────────────────────────────────────────────────────

  function bindSearch() {
    const input = UI.els.searchInput();
    const btn   = UI.els.searchBtn();

    btn.addEventListener('click', () => search(input.value));

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') search(input.value);
    });
  }

  function bindMoodPills() {
    document.querySelectorAll('.mood-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.mood-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const mood = pill.dataset.mood;
        if (mood) {
          UI.els.searchInput().value = mood + ' movies';
          search(mood + ' movies');
        } else {
          UI.els.searchInput().value = '';
          UI.hideDetail();
          UI.showEmptyState();
        }
      });
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  function init() {
    bindSearch();
    bindMoodPills();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { search, refresh };

})();

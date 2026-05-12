/**
 * ui.js — Reelwise
 * Handles all DOM rendering and UI state management.
 */

'use strict';

const UI = (() => {

  // ── Cached Elements ────────────────────────────────────────────────────────
  const els = {
    searchInput: () => document.getElementById('searchInput'),
    searchBtn:   () => document.getElementById('searchBtn'),
    mainContent: () => document.getElementById('mainContent'),
    detailPanel: () => document.getElementById('detailPanel'),
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Convert a 0–10 rating to a 5-star string. */
  function toStars(rating) {
    const filled = Math.round((rating ?? 0) / 2);
    return '★'.repeat(filled) + '☆'.repeat(5 - filled);
  }

  /** Escape HTML to prevent XSS. */
  function esc(str) {
    const d = document.createElement('div');
    d.textContent = String(str ?? '');
    return d.innerHTML;
  }

  // ── Rendering ──────────────────────────────────────────────────────────────

  /**
   * Render the loading skeleton.
   */
  function showLoading() {
    els.mainContent().innerHTML = `
      <div class="loading-state" role="status" aria-live="polite">
        <i class="ti ti-loader loading-spinner" aria-hidden="true"></i>
        Finding films for you<span class="loading-dots" aria-hidden="true"></span>
      </div>`;
  }

  /**
   * Render an error message.
   * @param {string} message
   */
  function showError(message) {
    els.mainContent().innerHTML = `
      <div class="error-state" role="alert">
        <i class="ti ti-alert-circle" aria-hidden="true"></i>
        ${esc(message)}
      </div>`;
  }

  /**
   * Render the initial empty state.
   */
  function showEmptyState() {
    els.mainContent().innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="ti ti-movie" aria-hidden="true"></i></div>
        <h2 class="empty-title">What do you want to watch tonight?</h2>
        <p class="empty-sub">Search for films, describe your mood, or pick a vibe above.</p>
      </div>`;
  }

  /**
   * Render the movie grid.
   * @param {object[]} movies
   * @param {string}   query
   * @param {Function} onCardClick - callback(index)
   * @param {Function} onRefresh   - callback()
   */
  function showMovies(movies, query, onCardClick, onRefresh) {
    const cards = movies.map((m, i) => `
      <article
        class="movie-card"
        role="button"
        tabindex="0"
        aria-label="${esc(m.title)} (${esc(m.year)})"
        data-index="${i}"
      >
        <div class="movie-poster" style="background:${esc(m.color || '#1c1c28')}">
          <span class="poster-emoji" aria-hidden="true">${esc(m.emoji || '🎬')}</span>
          <span class="poster-mood">${esc(m.mood || '')}</span>
          <div class="movie-score" aria-label="Rating ${m.rating}">${(m.rating ?? 0).toFixed(1)}</div>
        </div>
        <div class="movie-info">
          <h3 class="movie-title">${esc(m.title)}</h3>
          <div class="movie-meta">
            <span>${esc(m.year)}</span>
            <span class="movie-stars" aria-label="${Math.round((m.rating ?? 0) / 2)} out of 5 stars">${toStars(m.rating)}</span>
          </div>
          <div class="tags-row">
            ${(m.genre || []).slice(0, 2).map(g => `<span class="tag">${esc(g)}</span>`).join('')}
          </div>
        </div>
      </article>`).join('');

    els.mainContent().innerHTML = `
      <div class="results-header">
        <span class="section-label">Recommended for "${esc(query)}"</span>
        <button class="btn-refresh" id="refreshBtn" aria-label="Refresh recommendations">
          <i class="ti ti-refresh" aria-hidden="true"></i> Refresh
        </button>
      </div>
      <div class="movies-grid" role="list">${cards}</div>`;

    // Bind card clicks & keyboard
    els.mainContent().querySelectorAll('.movie-card').forEach(card => {
      const handler = () => onCardClick(parseInt(card.dataset.index, 10));
      card.addEventListener('click', handler);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
    });

    document.getElementById('refreshBtn')?.addEventListener('click', onRefresh);
  }

  /**
   * Render the detail panel for a single movie.
   * @param {object} movie
   * @param {Function} onClose
   */
  function showDetail(movie, onClose) {
    const panel = els.detailPanel();
    panel.innerHTML = `
      <button class="detail-close" aria-label="Close details">
        <i class="ti ti-x" aria-hidden="true"></i>
      </button>
      <div class="detail-header">
        <div class="detail-poster" style="background:${esc(movie.color || '#1c1c28')}" aria-hidden="true">
          <span style="font-size:38px">${esc(movie.emoji || '🎬')}</span>
        </div>
        <div>
          <h2 class="detail-title">${esc(movie.title)}</h2>
          <p class="detail-sub">
            ${esc(movie.year)} · <span class="star">${(movie.rating ?? 0).toFixed(1)} ★</span> · ${esc((movie.genre || []).join(', '))}
          </p>
          <div class="detail-tags">
            ${(movie.genre || []).map(g => `<span class="detail-tag">${esc(g)}</span>`).join('')}
            ${movie.mood ? `<span class="detail-tag">${esc(movie.mood)}</span>` : ''}
          </div>
        </div>
      </div>
      <p class="detail-synopsis">${esc(movie.synopsis || '')}</p>
      <div class="why-box">
        <div class="why-label">Why you'll love it</div>
        <p class="why-text">${esc(movie.why || '')}</p>
      </div>`;

    panel.classList.add('visible');
    panel.setAttribute('aria-hidden', 'false');
    panel.querySelector('.detail-close').addEventListener('click', onClose);
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Hide and clear the detail panel.
   */
  function hideDetail() {
    const panel = els.detailPanel();
    panel.classList.remove('visible');
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML = '';
  }

  // ── Search Button State ────────────────────────────────────────────────────

  function setSearchLoading(loading) {
    const btn = els.searchBtn();
    btn.disabled = loading;
    btn.innerHTML = loading
      ? '<i class="ti ti-loader" style="animation:spin 1s linear infinite" aria-hidden="true"></i> Finding...'
      : '<i class="ti ti-sparkles" aria-hidden="true"></i> Discover';
  }

  // ── Public Interface ───────────────────────────────────────────────────────
  return {
    els,
    showLoading,
    showError,
    showEmptyState,
    showMovies,
    showDetail,
    hideDetail,
    setSearchLoading,
  };

})();

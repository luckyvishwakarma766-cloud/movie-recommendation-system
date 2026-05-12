# 🎬 Reelwise — AI Movie Recommendation System

A cinematic, AI-powered movie discovery website built with vanilla HTML, CSS, and JavaScript. Uses the **Anthropic Claude API** to deliver personalised film recommendations based on your mood, genre preferences, or natural-language descriptions.

![Reelwise Preview](https://img.shields.io/badge/status-ready-brightgreen) ![HTML](https://img.shields.io/badge/HTML5-orange) ![CSS3](https://img.shields.io/badge/CSS3-blue) ![JavaScript](https://img.shields.io/badge/JS-ES6+-yellow)

---

## ✨ Features

- **Natural language search** — describe anything: *"films like Parasite"*, *"90s sci-fi with strong female leads"*
- **Mood bar** — 8 preset vibes for one-tap discovery (Feel-good, Dark & Intense, Mind-bending, etc.)
- **AI recommendations** — Claude returns 6 curated films with ratings, genres, synopsis, and a personalised "why you'll love it" explanation
- **Detail panel** — click any card to expand the full breakdown
- **Refresh** — re-run the same query for a fresh set of picks
- **Responsive** — works on mobile, tablet, and desktop
- **Accessible** — ARIA labels, keyboard navigation, semantic HTML

---

## 🗂 Project Structure

```
reelwise/
├── index.html          # Entry point
├── css/
│   └── style.css       # All styles (dark cinematic theme)
├── js/
│   ├── api.js          # Anthropic API communication
│   ├── ui.js           # DOM rendering & UI state
│   └── app.js          # Application logic & event wiring
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/reelwise.git
cd reelwise
```

### 2. Add your Anthropic API key

Open `js/api.js` and replace the placeholder:

```js
const API_KEY = 'YOUR_ANTHROPIC_API_KEY_HERE';
```

Get your key at [console.anthropic.com](https://console.anthropic.com).

> ⚠️ **Security note:** This project calls the API directly from the browser for simplicity. For a production deployment, proxy requests through your own backend server so the API key is never exposed in client-side code.

### 3. Serve locally

Since the project is pure HTML/CSS/JS, you can use any static server:

```bash
# Python
python3 -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code
# Install the "Live Server" extension and click "Go Live"
```

Then open `http://localhost:8080` in your browser.

---

## 🌐 Deployment

The project is a static site — deploy anywhere:

| Platform | Steps |
|---|---|
| **GitHub Pages** | Push to `main`, enable Pages in repo Settings → Pages |
| **Netlify** | Drag-and-drop the `reelwise/` folder at [netlify.com/drop](https://app.netlify.com/drop) |
| **Vercel** | `npx vercel` in the project root |

> Remember to set your API key as an environment variable or use a backend proxy before deploying publicly.

---

## 🔧 Customisation

| What | Where |
|---|---|
| Change colour theme | Edit CSS variables in `css/style.css` `:root` block |
| Add/remove mood pills | Edit `.mood-pill` buttons in `index.html` |
| Change AI model | Edit `MODEL` constant in `js/api.js` |
| Adjust number of results | Edit the system prompt in `js/api.js` |
| Backend proxy | Replace `fetch(API_URL, ...)` in `api.js` with your own endpoint |

---

## 📦 Dependencies

All loaded via CDN — no build step required:

- [DM Serif Display + DM Sans](https://fonts.google.com/) — typography
- [Tabler Icons](https://tabler.io/icons) — icon set

---

## 📄 License

MIT — free to use, modify, and distribute.

---

## 🙏 Credits

Built with [Anthropic Claude](https://anthropic.com) · Designed with a cinematic dark aesthetic

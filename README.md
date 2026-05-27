# Deepfake Proactive Defense Benchmark

Leaderboard website for the ICML 2026 paper
*"Proactive Defense Benchmark against Deepfake Generation"*
by Baek, Seo, Kim, Park, and Kim — built and maintained by the **Safe AI Lab**.

📄 **Paper**: <https://icml.cc/virtual/2026/poster/62016>

All numbers on the leaderboards are sourced directly from **Table 2** of the
paper. Static site, no build step.

---

## 📁 Project structure

```
deepfake-bench/
├── index.html                # Main page (all copy lives here)
├── assets/
│   ├── styles.css            # All styles. Edit CSS variables at the top to re-theme.
│   ├── app.js                # Leaderboard logic: tabs, sorting, search, filter
│   ├── refs.js               # Paper references for methods / generators / datasets
│   └── img/                  # Logos and images
│       ├── ICML-logo.svg     # ICML 2026 logo (top of hero)
│       ├── safeailog.jpeg    # (unused, kept for reference)
│       └── safeaichar.jpeg   # Favicon
├── data/                     # One JSON file per generator
│   ├── stargan.json          # Attribute Manipulation: StarGAN
│   ├── styleclip.json        #                         StyleCLIP
│   ├── diffae.json           #                         DiffAE
│   ├── simswap.json          # Face Swap:              SimSwap
│   ├── psp.json              #                         pSp-mix
│   ├── blendface.json        #                         BlendFace
│   ├── diffswap.json         #                         DiffSwap
│   └── diffface.json         #                         DiffFace
├── .github/workflows/
│   └── deploy.yml            # GitHub Actions: auto-deploys on push to main
├── .nojekyll                 # Tells GitHub Pages to skip Jekyll
└── README.md
```

---

## 🚀 Running locally

You can't just open `index.html` directly — the JS uses `fetch()` to load
JSON data, which browsers block on `file://` URLs. Run a tiny server from
the project folder:

```bash
# Python 3
python3 -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

---

## 🌐 Deployment

The site auto-deploys to GitHub Pages whenever `main` is updated. The
workflow lives in `.github/workflows/deploy.yml`.

**Live URL:** `https://<owner>.github.io/<repo-name>/`

To enable Pages from a fresh repo:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

---

## 🎨 Re-theming

Open `assets/styles.css` and edit the variables at the very top:

```css
:root {
  --ink:       #0a1f5c;   /* deep navy — main text / dark elements */
  --accent:    #3080f0;   /* logo blue — links, highlights, sort indicator */
  --paper:     #ffffff;   /* page background */
  --paper-2:   #f4f6fb;   /* alt section background (slight blue tint) */
  ...
}
```

Every accent on the page (sort indicator, hover states, the italic phrase
in the hero, etc.) re-themes from `--accent`. The current palette comes
from the Safe AI Lab logo.

---

## 📊 The data files

Each generator has its own JSON file in `data/`. Format:

```json
[
  {
    "method":    "Method Name",
    "setting":   "whitebox",
    "paper_url": "https://arxiv.org/abs/...",
    "code_url":  "https://github.com/...",
    "mse":       1.3715,
    "lpips":     0.6878,
    "cidr":      0.3764,
    "brisque":  36.4792,
    "avgrank":   2.00,
    "rob":       0.7008,
    "te":        0.4440
  }
]
```

Field notes:
- `setting`: must be `"whitebox"` or `"blackbox"` for the badge to render correctly.
- `paper_url`, `code_url`: optional. Empty string or omit → no link.
- Any numeric field can be `null` if not reported — renders as `—`.
- The leaderboard auto-ranks rows by **AvgRank ascending** (lower = better).
- Decimal precision is auto-formatted: MSE/LPIPS/CIDR/ROB/TE to 4 places, BRISQUE/AvgRank to 2.

Updating numbers: just edit the JSON. The page picks up changes on reload — no rebuild needed.

---

## 📚 Method & generator references (`assets/refs.js`)

Paper URLs and full names for **methods**, **generators**, and **datasets**
are kept in one central place (`refs.js`), separated from the data so we
don't repeat them in every JSON file. The leaderboard, tabs, task title,
and Protocol section all read from this file to render hover tooltips and
clickable links.

To update a paper URL, edit `refs.js` once — it applies everywhere
automatically.

---

## ✏️ Adding / removing leaderboards

### Adding a new generator (new tab)

1. Create `data/<gen_key>.json` with the same format as existing files.
2. In `index.html`, add a tab button inside the right tab group:
   ```html
   <button class="tab" data-task="<gen_key>" role="tab">NewGen</button>
   ```
3. In `assets/app.js`, add a corresponding entry to the `TASKS` object:
   ```js
   <gen_key>: {
     title: 'Leaderboard: NewGen · CelebA-HQ',
     sub:   'Description of the task...',
     file:  'data/<gen_key>.json'
   }
   ```
4. (Optional) Add the generator's paper to `assets/refs.js` so its name
   becomes a clickable link wherever it appears on the page.

### Removing a generator

Delete the tab button in `index.html`, the entry in `TASKS` in `app.js`,
and the JSON file.

---

## 🛠 Tech notes

- **No build step.** Pure HTML/CSS/JS.
- **Google Fonts:** Inter Tight (body/display) + JetBrains Mono (code).
  Self-host if you need offline / privacy.
- **MathJax** loads from CDN — used for LaTeX inside task subtitles (currently
  unused but available if you want to add math expressions).
- **Browser support:** modern evergreen browsers (uses `fetch`,
  `IntersectionObserver`, CSS `color-mix()`, `backdrop-filter`).

---

## 📌 Placeholders to update before going fully public

Currently the site is private; when going public, swap these in `index.html`:

| What | Where | Currently |
|------|-------|-----------|
| GitHub repo URL | `index.html` → "GitHub →" button in hero, footer "GitHub" link | `href="#"` |
| Citation BibTeX | Citation section | "Coming soon" placeholder until camera-ready |

---

## ✉️ Contact

Maintained by the **Safe AI Lab**.

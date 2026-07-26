# Henri Davies

Static website for the artist Henri Davies (paintings, photography & fashion),
served from GitHub Pages. Migrated from the old WordPress.com site at henridavies.com.
Dark, image-first design with a coral accent and a swipe/pinch-zoom lightbox.

## Structure

```
index.html                  Home — landing (hero + section cards)
paintings.html              Paintings gallery
photography.html            Photography gallery
fashion.html                Fashion gallery (article-led)
for-sale.html               Works available to purchase
about.html                  Biography
paintings-for-sale.html     Redirect → for-sale.html (old URL)
css/style.css               Styles (single dark theme)
js/site.js                  Mobile nav + swipe/pinch-zoom lightbox

scripts/site-data.mjs       Content (single source of truth: galleries, bio, prices)
scripts/build-pages.mjs     Generates the HTML pages from site-data
scripts/optimize-images.mjs Generates public/ derivatives from source/
scripts/dev-serve.py        No-cache static dev server

public/images/              Web-optimized images served to visitors
source/images/              Full-resolution originals (archive)
source/reference/           Original page HTML captured from the old site
CONTENT.md                  Content manifest (bios, prices, gallery order)
```

The site itself is plain HTML/CSS/JS with no runtime dependencies. The scripts are
build-time authoring tools (they use `sharp`); their output is committed, so the
site works without running anything.

## Editing

- **Change page copy / gallery order / titles:** edit `scripts/site-data.mjs`, then
  run `npm run build`.
- **Add or replace an image:** drop the original into the relevant
  `source/images/<section>/` folder, run `npm run optimize`, add it to the matching
  array in `scripts/site-data.mjs`, then `npm run build`.

## Commands

```bash
npm install        # once, installs sharp (build-time only)
npm run optimize   # source/images -> public/images (webp + jpg + thumbnails)
npm run build      # regenerate the HTML pages
npm run dev        # preview at http://localhost:8000 (no-cache, so refreshes show changes)
```

## Deploying to GitHub Pages

Serve from the repository root of the default branch (Settings → Pages →
Source: Deploy from a branch → `main` / `/root`). `.nojekyll` is present so files
are served as-is.

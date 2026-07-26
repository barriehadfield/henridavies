# Henri Davies

Static website for the artist Henri Davies (paintings & photography), served from
GitHub Pages. Migrated from the old WordPress.com site at henridavies.com.

## Structure

```
index.html                  Home — paintings gallery
paintings-for-sale.html     Works available to purchase
photography.html            Photography gallery
about.html                  Biography
css/style.css               Styles
js/site.js                  Nav toggle + lightbox

public/images/              Web-optimized images served to visitors
source/images/              Full-resolution originals (archive)
source/reference/           Original page HTML captured from the old site
CONTENT.md                  Content manifest (bios, prices, gallery order)

scripts/optimize-images.mjs Generates public/ derivatives from source/
scripts/build-pages.mjs     Generates the four HTML pages
```

The site itself is plain HTML/CSS/JS with no runtime dependencies. The two scripts
are build-time authoring tools (they use `sharp`); their output is committed, so the
site works without running anything.

## Editing

- **Change page copy / gallery order / titles:** edit the data at the top of
  `scripts/build-pages.mjs`, then run `npm run build`.
- **Add or replace an image:** drop the original into the relevant
  `source/images/<section>/` folder, run `npm run optimize`, add it to the gallery
  list in `scripts/build-pages.mjs`, then `npm run build`.

## Commands

```bash
npm install        # once, installs sharp (build-time only)
npm run optimize   # source/images -> public/images (webp + jpg + thumbnails)
npm run build      # regenerate the four HTML pages
```

Preview locally with any static server, e.g. `python3 -m http.server`.

## Deploying to GitHub Pages

Serve from the repository root of the default branch (Settings → Pages →
Source: Deploy from a branch → `main` / `/root`). `.nojekyll` is present so files
are served as-is.

#!/usr/bin/env node
/**
 * Page generator for the Henri Davies static site.
 *
 * Writes the four HTML pages (index, paintings-for-sale, photography, about)
 * at the repo root from a shared layout + the gallery data below.
 * The output is plain static HTML — this script is an authoring convenience,
 * not a runtime dependency. Regenerate with: node scripts/build-pages.mjs
 */
import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { SOCIAL, PAINTINGS, PHOTOGRAPHY, FASHION, ABOUT_PARAS, FOR_SALE } from "./site-data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const NAV = [
  { href: "index.html", label: "Home" },
  { href: "paintings-for-sale.html", label: "Paintings For Sale" },
  { href: "photography.html", label: "Photography" },
  { href: "fashion.html", label: "Fashion" },
  { href: "about.html", label: "About" },
];

/* ---------- helpers ---------- */
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function dims(kind, file) {
  const p = join(ROOT, "public", "images", kind, `${file}-thumb.jpg`);
  const m = await sharp(p).metadata();
  return { w: m.width, h: m.height };
}

async function tile(kind, item, altKind) {
  const { w, h } = await dims(kind, item.file);
  const base = `public/images/${kind}/${item.file}`;
  const title = item.title || "";
  const alt = title ? `${title} — ${altKind} by Henri Davies` : `${altKind} by Henri Davies`;
  const dataTitle = title ? ` data-title="${esc(title)}"` : "";
  return `        <a class="tile" href="${base}.jpg" data-full="${base}.webp"${dataTitle}>
          <picture>
            <source srcset="${base}-thumb.webp" type="image/webp">
            <img src="${base}-thumb.jpg" alt="${esc(alt)}" loading="lazy" width="${w}" height="${h}">
          </picture>
        </a>`;
}

async function gallery(kind, items, altKind) {
  const tiles = await Promise.all(items.map((it) => tile(kind, it, altKind)));
  return `      <div class="gallery">\n${tiles.join("\n")}\n      </div>`;
}

function layout({ title, active, body }) {
  const links = NAV.map((n) => {
    const cur = n.href === active ? ' aria-current="page"' : "";
    return `          <li><a href="${n.href}"${cur}>${n.label}</a></li>`;
  }).join("\n");

  const year = 2026;
  const pageTitle = active === "index.html" ? "Henri Davies" : `${title} — Henri Davies`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="Henri Davies — paintings and photography.">
  <link rel="icon" href="public/images/site/logo.jpg">
  <link rel="apple-touch-icon" href="public/images/site/logo.jpg">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <nav class="nav" aria-label="Primary">
      <a class="brand" href="index.html">Henri Davies</a>
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg></button>
      <ul class="nav-links">
${links}
      </ul>
    </nav>
  </header>

  <main>
${body}
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <a class="brand" href="index.html">Henri Davies</a>
      <ul class="social">
        <li><a href="${SOCIAL.instagram}" target="_blank" rel="noopener">Instagram</a></li>
        <li><a href="${SOCIAL.bluesky}" target="_blank" rel="noopener">Bluesky</a></li>
      </ul>
      <p class="copyright">© ${year} Henri Davies. All rights reserved.</p>
    </div>
  </footer>

  <script src="js/site.js"></script>
</body>
</html>
`;
}

/* ---------- pages ---------- */
async function buildHome() {
  const g = await gallery("paintings", PAINTINGS, "painting");
  const body = `    <div class="page-head">
      <h1>Paintings &amp; Photography</h1>
      <p>Self-taught painter working in oils — portraits, still life and abstracts — alongside a body of travel and landscape photography.</p>
    </div>
${g}`;
  return layout({ title: "Home", active: "index.html", body });
}

async function buildPhotography() {
  const g = await gallery("photography", PHOTOGRAPHY, "photograph");
  const body = `    <div class="page-head">
      <h1>Photography</h1>
      <p>Travel and landscape photography from India, the Mediterranean and closer to home.</p>
    </div>
${g}`;
  return layout({ title: "Photography", active: "photography.html", body });
}

async function buildFashion() {
  // The first image in the curated order is the press-feature article — lead
  // with it full-width as an editorial hero, then grid the rest of the works.
  const lead = FASHION[0];
  const { w: lw, h: lh } = await dims("fashion", lead.file);
  const leadBase = `public/images/fashion/${lead.file}`;
  const leadTitle = "Henri Davies — press feature";
  const hero = `    <figure class="fashion-lead">
      <a class="tile" href="${leadBase}.jpg" data-full="${leadBase}.webp" data-title="${esc(leadTitle)}">
        <picture>
          <source srcset="${leadBase}.webp" type="image/webp">
          <img src="${leadBase}.jpg" alt="${esc(leadTitle)}" width="${lw}" height="${lh}">
        </picture>
      </a>
    </figure>`;

  const g = await gallery("fashion", FASHION.slice(1), "fashion image");
  const body = `    <div class="page-head">
      <p class="eyebrow">Feature</p>
      <h1>Fashion</h1>
      <p>Henri Davies Fashion — a body of fashion and styling work, led by the press feature below.</p>
    </div>
${hero}
${g}`;
  return layout({ title: "Fashion", active: "fashion.html", body });
}

async function buildForSale() {
  const works = [];
  for (const w of FOR_SALE) {
    const { w: iw, h: ih } = await dims("paintings", w.file);
    const base = `public/images/paintings/${w.file}`;
    const badge = w.sold ? '<span class="badge">Sold</span>' : "";
    const price = w.sold
      ? `<p class="price"><s>${w.price}</s></p>`
      : `<p class="price">${w.price}</p>`;
    works.push(`      <article class="work">
        <a class="tile" href="${base}.jpg" data-full="${base}.webp" data-title="${esc(w.title)}">
          <picture>
            <source srcset="${base}-thumb.webp" type="image/webp">
            <img src="${base}-thumb.jpg" alt="${esc(w.title)} — painting by Henri Davies" loading="lazy" width="${iw}" height="${ih}">
          </picture>
        </a>
        <div>
          <h2>${esc(w.title)}${badge}</h2>
          <p class="meta">${esc(w.meta)}</p>
          ${price}
        </div>
      </article>`);
  }
  const body = `    <div class="page-head">
      <h1>Paintings For Sale</h1>
      <p>Original oil paintings available to purchase. Please get in touch via <a href="${SOCIAL.instagram}" target="_blank" rel="noopener">Instagram</a> to enquire.</p>
    </div>
    <div class="works">
${works.join("\n")}
    </div>`;
  return layout({ title: "Paintings For Sale", active: "paintings-for-sale.html", body });
}

async function buildAbout() {
  const paras = ABOUT_PARAS.map((p) => `          <p>${esc(p)}</p>`).join("\n");
  const body = `    <div class="page-head">
      <h1>About</h1>
    </div>
    <div class="about">
      <img src="public/images/site/henri-portrait.jpg" alt="Portrait of Henri Davies" width="600" loading="lazy">
      <div class="prose">
${paras}
      </div>
    </div>`;
  return layout({ title: "About", active: "about.html", body });
}

async function run() {
  const pages = [
    ["index.html", await buildHome()],
    ["paintings-for-sale.html", await buildForSale()],
    ["photography.html", await buildPhotography()],
    ["fashion.html", await buildFashion()],
    ["about.html", await buildAbout()],
  ];
  for (const [name, html] of pages) {
    await writeFile(join(ROOT, name), html, "utf-8");
    console.log(`  wrote ${name}`);
  }
  console.log(`\nDone. Built ${pages.length} pages.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

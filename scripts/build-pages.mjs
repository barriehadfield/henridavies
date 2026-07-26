#!/usr/bin/env node
/**
 * Page generator for the Henri Davies site (image-first dark design).
 *
 * Writes the pages at the repo root (index, paintings, photography, fashion,
 * for-sale, about) from the shared content in site-data.mjs. Output is plain
 * static HTML served directly by GitHub Pages.
 *
 * Regenerate with: npm run build
 */
import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { SOCIAL, PAINTINGS, PHOTOGRAPHY, FASHION, ABOUT_PARAS, FOR_SALE } from "./site-data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = ROOT;

const NAV = [
  { href: "paintings.html", label: "Paintings" },
  { href: "photography.html", label: "Photography" },
  { href: "fashion.html", label: "Fashion" },
  { href: "for-sale.html", label: "For Sale" },
  { href: "about.html", label: "About" },
];

/* ---------- helpers ---------- */
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function dims(kind, file) {
  const m = await sharp(join(ROOT, "public", "images", kind, `${file}-thumb.jpg`)).metadata();
  return { w: m.width, h: m.height };
}

async function tile(kind, item, altKind, eager) {
  const { w, h } = await dims(kind, item.file);
  const base = `public/images/${kind}/${item.file}`;
  const title = item.title || "";
  const alt = title ? `${title}, ${altKind} by Henri Davies` : `${altKind} by Henri Davies`;
  const dataTitle = title ? ` data-title="${esc(title)}"` : "";
  const cap = title ? `\n      <span class="cap">${esc(title)}</span>` : "";
  const load = eager ? "eager" : "lazy";
  return `    <a class="tile" href="${base}.jpg" data-full="${base}.webp"${dataTitle}>
      <picture>
        <source srcset="${base}-thumb.webp" type="image/webp">
        <img src="${base}-thumb.jpg" alt="${esc(alt)}" loading="${load}" width="${w}" height="${h}">
      </picture>${cap}
    </a>`;
}

async function gallery(kind, items, altKind) {
  const tiles = await Promise.all(items.map((it, i) => tile(kind, it, altKind, i < 4)));
  return `  <div class="grid">\n${tiles.join("\n")}\n  </div>`;
}

async function roomCard(kind, file, label, count, href) {
  const { w, h } = await dims(kind, file);
  const base = `public/images/${kind}/${file}`;
  return `      <a class="room" href="${href}">
        <picture>
          <source srcset="${base}-thumb.webp" type="image/webp">
          <img src="${base}-thumb.jpg" alt="${esc(label)}" loading="lazy" width="${w}" height="${h}">
        </picture>
        <span class="cap"><span class="t">${esc(label)}</span><span class="n">${count}</span></span>
      </a>`;
}

function layout({ title, active, main, home }) {
  const links = NAV.map((n) => {
    const cur = n.href === active ? ' aria-current="page"' : "";
    const cls = n.cls ? ` class="${n.cls}"` : "";
    return `<a href="${n.href}"${cls}${cur}>${n.label}</a>`;
  }).join("\n        ");
  const pageTitle = home ? "Henri Davies · Painter & Photographer" : `${title} · Henri Davies`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#191a1d">
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="Henri Davies. Paintings, photography and fashion.">
  <link rel="icon" href="public/images/site/logo.jpg">
  <link rel="apple-touch-icon" href="public/images/site/logo.jpg">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="hdr">
    <div class="hdr-inner">
      <a class="mark" href="index.html">Henri Davies<b>.</b></a>
      <nav class="nav" aria-label="Primary">
        ${links}
      </nav>
      <div class="hdr-tools">
        <button class="menu-btn" aria-label="Menu" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/></svg>
        </button>
      </div>
    </div>
  </header>

  <main class="wrap">
${main}
  </main>

  <footer class="ftr">
    <div class="ftr-inner">
      <a class="mark" href="index.html">Henri Davies<b>.</b></a>
      <div class="social">
        <a href="${SOCIAL.instagram}" target="_blank" rel="noopener">Instagram</a>
        <a href="${SOCIAL.bluesky}" target="_blank" rel="noopener">Bluesky</a>
      </div>
      <div class="cr">© 2026 Henri Davies · Painter, photographer &amp; designer</div>
    </div>
  </footer>

  <script src="js/site.js"></script>
</body>
</html>
`;
}

/* ---------- pages ---------- */
async function buildHome() {
  const heroDims = await dims("paintings", "suri-woman-with-calabashes");
  const rooms = await Promise.all([
    roomCard("paintings", "orange-painting", "Paintings", "16 works", "paintings.html"),
    roomCard("photography", "20111212-horses-temple-corr-2", "Photography", "29 works", "photography.html"),
    roomCard("fashion", "fashion-02", "Fashion", "The archive", "fashion.html"),
  ]);
  const main = `    <section class="hero reveal">
      <div class="hero-copy">
        <p class="eyebrow">Painter · Photographer · Designer</p>
        <h1>Henri<br>Davies<span class="last">.</span></h1>
        <p class="tag">Portraits in oil, travel photography, and a fashion archive. One body of work, made over a lifetime of looking.</p>
        <div class="hero-cta">
          <a class="btn primary" href="paintings.html">View the paintings</a>
          <a class="btn ghost" href="about.html">About Henri</a>
        </div>
      </div>
      <figure class="hero-fig">
        <picture>
          <source srcset="public/images/paintings/suri-woman-with-calabashes.webp" type="image/webp">
          <img src="public/images/paintings/suri-woman-with-calabashes.jpg" alt="Suri Woman with Calabashes, painting by Henri Davies" width="${heroDims.w}" height="${heroDims.h}" fetchpriority="high">
        </picture>
        <figcaption>Suri Woman with Calabashes, oil on canvas</figcaption>
      </figure>
    </section>

    <section class="rooms reveal">
      <h2 class="label">Explore the work</h2>
      <div class="room-grid">
${rooms.join("\n")}
      </div>
    </section>`;
  return layout({ title: "Home", active: "index.html", main, home: true });
}

async function buildPaintings() {
  const g = await gallery("paintings", PAINTINGS, "painting");
  const main = `    <div class="page-intro reveal">
      <div>
        <p class="eyebrow">Oil on canvas</p>
        <h1>Paintings</h1>
        <p class="sub">Portraits, still life and abstracts, self-taught over the last seven years.</p>
      </div>
      <span class="count">${PAINTINGS.length} works</span>
    </div>
${g}`;
  return layout({ title: "Paintings", active: "paintings.html", main });
}

async function buildPhotography() {
  const g = await gallery("photography", PHOTOGRAPHY, "photograph");
  const main = `    <div class="page-intro reveal">
      <div>
        <p class="eyebrow">Photography</p>
        <h1>Photography</h1>
        <p class="sub">Travel and landscape work from India, the Mediterranean and closer to home.</p>
      </div>
      <span class="count">${PHOTOGRAPHY.length} works</span>
    </div>
${g}`;
  return layout({ title: "Photography", active: "photography.html", main });
}

async function buildFashion() {
  const lead = FASHION[0];
  const { w, h } = await dims("fashion", lead.file);
  const leadBase = `public/images/fashion/${lead.file}`;
  const leadTitle = "Henri Davies, press feature";
  const hero = `    <figure class="fashion-lead reveal">
      <p class="tag">Feature</p>
      <a class="tile" href="${leadBase}.jpg" data-full="${leadBase}.webp" data-title="${esc(leadTitle)}">
        <picture>
          <source srcset="${leadBase}.webp" type="image/webp">
          <img src="${leadBase}.jpg" alt="${esc(leadTitle)}" width="${w}" height="${h}">
        </picture>
      </a>
    </figure>`;
  const g = await gallery("fashion", FASHION.slice(1), "fashion image");
  const main = `    <div class="page-intro reveal">
      <div>
        <p class="eyebrow">Feature</p>
        <h1>Fashion</h1>
        <p class="sub">A fashion and styling archive, led by the original press feature.</p>
      </div>
      <span class="count">${FASHION.length} images</span>
    </div>
${hero}
${g}`;
  return layout({ title: "Fashion", active: "fashion.html", main });
}

async function buildForSale() {
  const works = [];
  for (const w of FOR_SALE) {
    const { w: iw, h: ih } = await dims("paintings", w.file);
    const base = `public/images/paintings/${w.file}`;
    const badge = w.sold ? '<span class="badge">Sold</span>' : "";
    const price = w.sold ? `<p class="price"><s>${w.price}</s></p>` : `<p class="price">${w.price}</p>`;
    works.push(`      <article class="work">
        <a class="tile" href="${base}.jpg" data-full="${base}.webp" data-title="${esc(w.title)}">
          <picture>
            <source srcset="${base}-thumb.webp" type="image/webp">
            <img src="${base}-thumb.jpg" alt="${esc(w.title)}, painting by Henri Davies" loading="lazy" width="${iw}" height="${ih}">
          </picture>
        </a>
        <div>
          <h2>${esc(w.title)}${badge}</h2>
          <p class="meta">${esc(w.meta)}</p>
          ${price}
          ${w.sold ? "" : `<p class="enquire">To purchase, <a href="${SOCIAL.instagram}" target="_blank" rel="noopener">enquire on Instagram</a>.</p>`}
        </div>
      </article>`);
  }
  const main = `    <div class="page-intro reveal">
      <div>
        <p class="eyebrow">Original works</p>
        <h1>For Sale</h1>
        <p class="sub">Original oil paintings available to purchase.</p>
      </div>
      <span class="count">${FOR_SALE.length} works</span>
    </div>
    <div class="works">
${works.join("\n")}
    </div>`;
  return layout({ title: "For Sale", active: "for-sale.html", main });
}

async function buildAbout() {
  const paras = ABOUT_PARAS.map((p) => `        <p>${esc(p)}</p>`).join("\n");
  const main = `    <div class="page-intro reveal">
      <div>
        <p class="eyebrow">About</p>
        <h1>About Henri</h1>
      </div>
    </div>
    <div class="about reveal">
      <img src="public/images/site/henri-portrait.jpg" alt="Portrait of Henri Davies" width="600" loading="lazy">
      <div class="prose">
${paras}
      </div>
    </div>`;
  return layout({ title: "About", active: "about.html", main });
}

async function run() {
  const pages = [
    ["index.html", await buildHome()],
    ["paintings.html", await buildPaintings()],
    ["photography.html", await buildPhotography()],
    ["fashion.html", await buildFashion()],
    ["for-sale.html", await buildForSale()],
    ["about.html", await buildAbout()],
  ];
  for (const [name, html] of pages) {
    await writeFile(join(OUT, name), html, "utf-8");
    console.log(`  wrote ${name}`);
  }
  console.log(`\nDone. Built ${pages.length} pages.`);
}

run().catch((err) => { console.error(err); process.exit(1); });

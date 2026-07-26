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

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const NAV = [
  { href: "index.html", label: "Home" },
  { href: "paintings-for-sale.html", label: "Paintings For Sale" },
  { href: "photography.html", label: "Photography" },
  { href: "fashion.html", label: "Fashion" },
  { href: "about.html", label: "About" },
];

const SOCIAL = {
  instagram: "https://www.instagram.com/henridaviesdesign",
  bluesky: "https://bsky.app/profile/henridavies.bsky.social",
};

/* Gallery data — order matches the original site. `title` is optional;
   when omitted the image is treated as an untitled work. */
const PAINTINGS = [
  { file: "suri-woman-with-calabashes", title: "Suri Woman with Calabashes" },
  { file: "20170329_095634" },
  { file: "screenshot-2025-01-05-at-14.17.49", title: "Suri Woman with Flowers and Leaves" },
  { file: "chloes-painting", title: "Chloe" },
  { file: "lauren-2", title: "Lauren" },
  { file: "screenshot-2025-01-05-at-14.18.17" },
  { file: "screenshot-2025-01-05-at-14.16.41", title: "Suri Woman with Orange Background" },
  { file: "screenshot-2025-01-05-at-14.19.38" },
  { file: "still-life-with-pear", title: "Still Life with Pear" },
  { file: "orange-painting", title: "Orange" },
  { file: "playground-abstract", title: "Playground Abstract" },
  { file: "screenshot-2025-01-05-at-14.17.17" },
  { file: "hayden", title: "Hayden" },
  { file: "mg_7267-3" },
  { file: "blue-boy", title: "Blue Boy" },
  { file: "barrie-portrait", title: "Barrie" },
];

const PHOTOGRAPHY = [
  { file: "mg_3678" },
  { file: "mg_4028" },
  { file: "mg_4103" },
  { file: "mg_4104_21400" },
  { file: "mg_4035" },
  { file: "mg_3986_21401" },
  { file: "mg_3983_21399" },
  { file: "20111212-horses-temple-corr-2", title: "Horses at the Temple" },
  { file: "mg_3640" },
  { file: "20120221-pondicherry-house-corr-3", title: "Pondicherry House" },
  { file: "20081120-tribal-women-corr", title: "Tribal Women" },
  { file: "20080206-nandi-shrine-corr-blurb", title: "Nandi Shrine" },
  { file: "20080124-kovalam-beach-women-corr-blurb", title: "Kovalam Beach" },
  { file: "mg_4122_1_21409" },
  { file: "20120206-lakshadweep-fishing-boat-corr", title: "Lakshadweep Fishing Boat" },
  { file: "mg_4570_21414" },
  { file: "mg_4560-1" },
  { file: "img_3286-2" },
  { file: "lauren-sitting-3-", title: "Lauren" },
  { file: "img_1462-1-1" },
  { file: "img_3029_10193" },
  { file: "rusty-boats-greenwich", title: "Rusty Boats, Greenwich" },
  { file: "old-boats-on-the-creeks", title: "Old Boats on the Creeks" },
  { file: "little-yacht", title: "Little Yacht" },
  { file: "mg_1456" },
  { file: "200800302-luca-corr", title: "Luca" },
  { file: "mg_1213_13931" },
  { file: "20120131-es-trenc-beach-corr", title: "Es Trenc Beach" },
  { file: "cafe-greco", title: "Café Greco" },
];

/* Fashion — the images are named fashion-01..fashion-51 in the curated
   order taken from the "Henri Davies Fashion" article. */
const FASHION = Array.from({ length: 51 }, (_, i) => ({
  file: `fashion-${String(i + 1).padStart(2, "0")}`,
}));

const ABOUT_PARAS = [
  "All my life I have been interested in art and crafts. From a very young age I was painting and creating. Almost burning down the kitchen melting wax for my batik work or hobbling around in handmade leather sandals because I hadn’t stitched the soles on properly.",
  "Eventually I did a Fashion degree that was part of an incredibly dynamic art college and I was immersed with artists, photographers, textile designers and jewellery designers. All these influences have informed who I am today.",
  "I have always been a voracious reader from a very young age and used to spend endless hours poring over encyclopaedias and learning about indigenous cultures around the world. Their art and their crafts have been a huge inspiration to me. Animals and nature are also very important to me. This is why I am driven to reuse and re-purpose objects so that we have zero waste and help to save the planet. These objects can be beautiful and add to the tapestry of our lives.",
  "I have taught myself to paint in oils and have been trying different types of painting to find my style. Portraits captivate me. Especially when they have something unique to offer. Insights into individual character and creativity that shine out through the style of painting or the person will forever capture your attention and never grow boring with age. I am also intrigued by abstracts whether they are landscapes or feelings of depth and focus that draw you into the painting. These are some of the works that I have done over the last 7 years. There will be more to come in different styles as I attempt to grow as an artist.",
];

const FOR_SALE = [
  {
    file: "screenshot-2025-01-05-at-14.17.49",
    title: "Suri Woman with Flowers and Leaves",
    meta: "Oil on linen canvas · 50 × 60 cm",
    price: "£2,000",
    sold: true,
  },
  {
    file: "screenshot-2025-01-05-at-14.16.41",
    title: "Suri Woman with Orange Background",
    meta: "Oil on linen canvas · 91 × 122 cm",
    price: "£6,000",
    sold: false,
  },
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
  const g = await gallery("fashion", FASHION, "fashion image");
  const body = `    <div class="page-head">
      <h1>Fashion</h1>
      <p>Henri Davies Fashion — a curated collection of fashion and styling work.</p>
    </div>
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

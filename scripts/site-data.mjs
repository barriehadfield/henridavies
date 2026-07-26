/**
 * Shared content data for the Henri Davies site.
 * Consumed by both scripts/build-pages.mjs (current site) and
 * scripts/build-redesign.mjs (redesign prototype), so content lives in one place.
 *
 * Each gallery item is { file, title? }. `title` is optional — an item without
 * one is an untitled work (no caption / generic alt). Array order = display order.
 */

export const SOCIAL = {
  instagram: "https://www.instagram.com/henridaviesdesign",
  bluesky: "https://bsky.app/profile/henridavies.bsky.social",
};

export const PAINTINGS = [
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
  { file: "man-green-eyes" },
  { file: "woman-red-flowers" },
];

export const PHOTOGRAPHY = [
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

/* Fashion — images fashion-01..fashion-51 in the curated order from the
   "Henri Davies Fashion" article. fashion-01 is the press-feature scan. */
export const FASHION = Array.from({ length: 51 }, (_, i) => ({
  file: `fashion-${String(i + 1).padStart(2, "0")}`,
}));

export const ABOUT_PARAS = [
  "Art has run through my whole life. As a child I was forever painting and making, nearly burning down the kitchen melting wax for my batik, or hobbling about in handmade leather sandals whose soles I’d never quite stitched on properly.",
  "That restlessness took me to a top fashion school, part of an electric art college buzzing with artists, photographers, textile and jewellery designers. Straight out of training I struck out on my own with my own label, and it took off fast. Those early successes taught me to trust my eye and back my instincts, and every one of those influences still shapes the work I make today.",
  "I’ve always been a voracious reader, losing whole afternoons to encyclopaedias and the art and craft of indigenous cultures around the world. They remain among my greatest inspirations. Animals and nature matter deeply to me, which is why I’m driven to reuse and repurpose: zero waste, and beautiful objects given a second life in the tapestry of our own.",
  "I taught myself to paint in oils, experimenting until I found my voice. Portraits captivate me: a flash of character or creativity that shines through the person or the brushwork, and never grows dull with age. Abstracts pull me in too, landscapes and moods with a depth that draws you inward. The works here span the last seven years, with plenty more to come as I keep growing as an artist.",
];

export const FOR_SALE = [
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

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
  "All my life I have been interested in art and crafts. From a very young age I was painting and creating. Almost burning down the kitchen melting wax for my batik work or hobbling around in handmade leather sandals because I hadn’t stitched the soles on properly.",
  "Eventually I did a Fashion degree that was part of an incredibly dynamic art college and I was immersed with artists, photographers, textile designers and jewellery designers. All these influences have informed who I am today.",
  "I have always been a voracious reader from a very young age and used to spend endless hours poring over encyclopaedias and learning about indigenous cultures around the world. Their art and their crafts have been a huge inspiration to me. Animals and nature are also very important to me. This is why I am driven to reuse and re-purpose objects so that we have zero waste and help to save the planet. These objects can be beautiful and add to the tapestry of our lives.",
  "I have taught myself to paint in oils and have been trying different types of painting to find my style. Portraits captivate me. Especially when they have something unique to offer. Insights into individual character and creativity that shine out through the style of painting or the person will forever capture your attention and never grow boring with age. I am also intrigued by abstracts whether they are landscapes or feelings of depth and focus that draw you into the painting. These are some of the works that I have done over the last 7 years. There will be more to come in different styles as I attempt to grow as an artist.",
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

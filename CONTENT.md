# Henri Davies — Site Content (migrated from henridavies.com)

Source: WordPress.com-hosted site at henridavies.com, captured 2026-07-26.
All original-resolution assets are in `source/images/`.

## Site meta
- **Title:** Henri Davies
- **Logo / favicon:** `source/images/site/logo.jpg` (original `cropped-hd2.jpg`)
- **Navigation:** Home · Paintings For Sale · Photography · About

## Social links
- Instagram: https://www.instagram.com/henridaviesdesign
- Bluesky: https://bsky.app/profile/henridavies.bsky.social

## Pages

### Home
Gallery of paintings (16 works). Images in `source/images/paintings/` — see order below.

### Paintings For Sale
Two works listed:
1. **Suri Woman with flowers and leaves.** Oil on linen canvas. 50 × 60 cm. £2,000 — **SOLD**
   - Image: `paintings/screenshot-2025-01-05-at-14.17.49.png`
2. **Suri woman with orange background.** Oil on linen canvas. 91 × 122 cm. £6,000
   - Image: `paintings/screenshot-2025-01-05-at-14.16.41.png`

### Photography
Gallery of 29 photographs. Images in `source/images/photography/`.

### Fashion
Gallery of 51 fashion / styling works (imported from the "Henri Davies Fashion"
article). Images in `source/images/fashion/`, named `fashion-01`…`fashion-51`
in the article's curated order — the first image (`fashion-01`) is the press
article scan, which leads the section. Original article source archived at
`source/reference/fashion-article.html`.

### About
Portrait: `source/images/site/henri-portrait.jpg` (original `new-haircut-2.jpg`)

Body text (canonical copy lives in `scripts/site-data.mjs` → `ABOUT_PARAS`):

> Art has run through my whole life. As a child I was forever painting and making, nearly burning down the kitchen melting wax for my batik, or hobbling about in handmade leather sandals whose soles I'd never quite stitched on properly.
>
> That restlessness took me to a top fashion school, part of an electric art college buzzing with artists, photographers, textile and jewellery designers. Straight out of training I struck out on my own with my own label, and it took off fast. Those early successes taught me to trust my eye and back my instincts, and every one of those influences still shapes the work I make today.
>
> I've always been a voracious reader, losing whole afternoons to encyclopaedias and the art and craft of indigenous cultures around the world. They remain among my greatest inspirations. Animals and nature matter deeply to me, which is why I'm driven to reuse and repurpose: zero waste, and beautiful objects given a second life in the tapestry of our own.
>
> I taught myself to paint in oils, experimenting until I found my voice. Portraits captivate me: a flash of character or creativity that shines through the person or the brushwork, and never grows dull with age. Abstracts pull me in too, landscapes and moods with a depth that draws you inward. The works here span the last seven years, with plenty more to come as I keep growing as an artist.

## Gallery order

### Paintings (home page)
1. suri-woman-with-calabashes.jpg
2. 20170329_095634.jpg
3. screenshot-2025-01-05-at-14.17.49.png  (Suri Woman with flowers and leaves — SOLD)
4. chloes-painting.jpg
5. lauren-2.jpg
6. screenshot-2025-01-05-at-14.18.17.png
7. screenshot-2025-01-05-at-14.16.41.png  (Suri woman with orange background — £6,000)
8. screenshot-2025-01-05-at-14.19.38.png
9. still-life-with-pear.jpg
10. orange-painting.jpg
11. playground-abstract.jpg
12. screenshot-2025-01-05-at-14.17.17.png
13. hayden.jpg
14. mg_7267-3.jpg
15. blue-boy.jpg
16. barrie-portrait.jpg

### Photography
1. mg_3678.jpg
2. mg_4028.jpg
3. mg_4103.jpg
4. mg_4104_21400.jpg
5. mg_4035.jpg
6. mg_3986_21401.jpg
7. mg_3983_21399.jpg
8. 20111212-horses-temple-corr-2.jpg
9. mg_3640.jpg
10. 20120221-pondicherry-house-corr-3.jpg
11. 20081120-tribal-women-corr.jpg
12. 20080206-nandi-shrine-corr-blurb.jpg
13. 20080124-kovalam-beach-women-corr-blurb.jpg
14. mg_4122_1_21409.jpg
15. 20120206-lakshadweep-fishing-boat-corr.jpg
16. mg_4570_21414.jpg
17. mg_4560-1.jpg
18. img_3286-2.jpg
19. lauren-sitting-3-.jpg
20. img_1462-1-1.jpg
21. img_3029_10193.jpg
22. rusty-boats-greenwich.jpg
23. old-boats-on-the-creeks.jpg
24. little-yacht.jpg
25. mg_1456.jpg
26. 200800302-luca-corr.jpg
27. mg_1213_13931.jpg
28. 20120131-es-trenc-beach-corr.jpg
29. cafe-greco.jpg

## Notes for the rebuild
- Original site was WordPress.com. New site is a static GitHub Pages site from this repo.
- Old "Photography" URL slug was misspelled `/photogrophy/`. Use `/photography/` on the new site (consider a redirect if preserving inbound links matters).
- Source images are full-resolution (many 5–27 MB). They should be resized/optimised into web-served derivatives during the build; originals are retained here as the archive.
- The two "Paintings For Sale" images duplicate entries in the paintings gallery (same source files).

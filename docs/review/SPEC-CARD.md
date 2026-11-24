# Product spec card

Our own graphic per product, replacing photos. `ProductSpecCard` (src/components/site/ProductSpecCard.tsx): tinted panel (sand, sage or terracotta by primary category), decorative lucide line icon (aria-hidden), brand in small caps, product name via `productTitle`, and up to three `cardSpecs` pill chips. Real text only; no price, rating, stock or links inside the card. `productSpecCardHtml` renders the same component to a string for the markdown pick block.
Used in: pick cards (replaces the plain name heading), RelatedProducts, GearPicks, gear category cards. Styles: `.speccard*` in src/styles.css. Products without `cardSpecs` show brand, name and icon only. Not changed: PackingBuilder popovers, all links and rel attributes.
Evidence: docs/flip/evidence/spec-card-*.jpg.

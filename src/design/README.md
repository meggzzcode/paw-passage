# Adventure Passport design system

Palette: **midnight ink** (#14283A) for text and dark panels, **cream paper** (#F7F0E1) for pages, **postcard red** (#A82F23) for the one primary action, **ochre** (#E0A53A) for stamps and highlights on dark, **pine** (#2F5D4E) as a quiet secondary. It reads as a travel postcard and a printed passport, not a pale-beige SaaS page or a bright pet-store brand.
Contrast (AA): ink on paper about 13:1, red on paper about 6.3:1, white on red about 7:1, ochre on ink about 8:1, muted ink (#4A5A68) on paper about 6:1. Dark ochre text (#7A5200) is the only ochre allowed on paper.
Paper texture is CSS only (two faint radial dot layers); stamps, perforations and the postcard border are CSS or inline SVG. No photos, no icon fonts.
Type: Fraunces (display, already self-hosted) for headings and stamp lettering; DM Sans (body, already self-hosted). Nothing new is downloaded and no Google Fonts link exists.
Tokens: `src/design/passport.css`, all as `--pp-*` variables. A `.dark` class redefines them. The file also remaps the legacy shadcn tokens (`--background`, `--primary`, ...) so existing guide and gear pages sit inside the new shell without edits.
Shape: 6px radius cards with a 1.5px ink border and a hard offset shadow, like a printed card. Buttons are at least 44px tall. Focus is a 3px red (light) or ochre (dark) outline.
Motion: the mystery-card flip and stamp press only run when `prefers-reduced-motion: no-preference`; otherwise both faces stay readable.
Components: `src/components/shell/` (SiteHeader, MobileNav, SiteFooter, Button, Card, Container, SectionHeading). Classes are prefixed `pp-`.
Routes not built yet (`/discover`, `/collections`, `/passport`, `/unlock`, `/restore-access`, `/free-challenges`) are linked through `AppLink`, which can be swapped for typed links when those routes exist.

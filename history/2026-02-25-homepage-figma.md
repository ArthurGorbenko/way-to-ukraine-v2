# 2026-02-25: Homepage Figma Implementation

- Implemented custom Figma-style homepage, header, and footer in Payload/Next.
- Added CMS-managed `homepage` global and extended `header` global for nav/CTA/logo controls.
- Added admin-editable hero/footer media (including footer logo), seeded defaults, and applied `e-Ukraine` font globally.
- Iterated UI via Playwright: refined hero accents, card block styling, smoother footer transition, larger/bottom-aligned footer logo+links.

## Follow-up Updates

- Deployed to DigitalOcean droplet (PM2 + Nginx reverse proxy), with swap enabled to stabilize production builds.
- Fixed production image loading by updating `next.config.js` to honor `NEXT_PUBLIC_SERVER_URL` for `images.remotePatterns`.
- Raised Nginx upload body limit to resolve `413` errors for media uploads.
- Refined footer composition against reference screenshot (smoother top fade, increased height, improved bottom alignment).
- Removed unused `homepage.hero.logoImage` field; header logo now managed only via `Globals -> Header`.

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
- Added GitHub Actions auto-deploy workflow for `main` pushes (`.github/workflows/deploy.yml`).
- Configured workflow to use `prod` environment secrets for droplet SSH deploy.
- Hardened SSH deploy script to bootstrap `pnpm` in non-interactive shell and removed forced `nvm use 20` (server runs Node 24).

## 2026-02-27 Session Update

- Added new static `/projects` page from Figma reference (`src/app/(frontend)/projects/page.tsx`, `projects.css`), with responsive two-card hero composition.
- Updated default and seeded navigation/card links from `#projects` to `/projects` (`src/Header/config.ts`, `src/endpoints/seed/index.ts`).
- Switched both header and footer brand logos to inline SVG to avoid black/matte backgrounds from uploaded media assets.
- Investigated page/footer seam artifacts and stabilized boundary styling around `main` and projects page spacing.
- Ran local seed from CLI and patched seed operations to pass `context.disableRevalidate: true` on hook-triggering writes so CLI seeding works without Next revalidation context.
- Re-ran seed successfully to apply updated globals/pages/media relationships.

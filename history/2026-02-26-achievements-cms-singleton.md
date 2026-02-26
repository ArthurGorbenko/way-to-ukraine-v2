# 2026-02-26: Achievements CMS Singleton

- Implemented `/achievements` as CMS-driven content using a new singleton global: `achievements`.
- Added structured admin fields for page title, top stats, 11-card grid (including `photoWide` layout), and CTA.
- Added conditional validation/admin conditions for card fields (`stat` vs `photoWide`) to prevent incomplete entries.
- Replaced hardcoded page content with `getCachedGlobal('achievements')` rendering while preserving the existing visual layout.
- Added global revalidation hook for `/achievements` and `global_achievements` cache tag.
- Registered `Achievements` global in Payload config and regenerated `payload-types.ts`.
- Updated seed flow to populate the new global with default content and wired header/home links to `/achievements`.
- Iterated visual styling against reference: refined title area treatment and ensured wide photo card has a fallback image if CMS image is empty.

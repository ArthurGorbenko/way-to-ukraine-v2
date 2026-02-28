# 2026-02-27: Finished Projects CMS Page

- Implemented new frontend route `/projects/finished` based on Figma node `318:209`.
- Added responsive 3x3 closed-project card grid with overlay treatment, decorative corner accents, and unit/vehicle labels.
- Created new editable Payload singleton global `finished-projects` with fields:
  - `pageTitle`
  - `cards` (exactly 9 items) containing `image`, `unit`, `vehicle`, `cornerStyle`.
- Added global `afterChange` revalidation hook for `/projects/finished` and `global_finished-projects` tag.
- Registered `FinishedProjects` in `src/payload.config.ts` globals.
- Updated `/projects` page so the “Закриті проєкти” card links to `/projects/finished`.
- Extended seed flow to populate `finished-projects` default content and updated achievements CTA to `/projects/finished`.
- Regenerated Payload types and verified TypeScript correctness with `pnpm exec tsc --noEmit`.
- Committed as `8a0d3d4` with message: `Add editable finished projects global and /projects/finished page`.

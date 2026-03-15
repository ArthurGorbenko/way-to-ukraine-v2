# Monobank Public Jar Snapshots

Status: Implemented with `clientId -> extJarId -> bank/jar` snapshot sync

## Summary

Use Monobank's public jar endpoint only in a protected server-side sync route, then store the normalized jar data in Payload. Active-project pages render from stored snapshot documents instead of hitting Monobank during page requests.

Each active project stores the public `send.monobank.ua/jar/{clientId}` link in Payload. A secure sync route resolves that `clientId` to `extJarId` via `POST https://send.monobank.ua/api/handler`, persists both identifiers, then fetches `https://api.monobank.ua/bank/jar/{extJarId}` to upsert snapshot records in the `monobank-jars` collection. The route is intended to be called every 30 minutes with `CRON_SECRET`.

## Implemented Changes

- Added `monoJarUrl` to each item in `active-projects.projects[]`.
- Added a new `monobank-jars` collection that stores:
  - `jarUrl`
  - `clientId`
  - `extJarId`
  - `title`
  - `description`
  - `amountMinor`
  - `goalMinor`
  - `displayAmount`
  - `displayGoal`
  - `progressPercent`
  - `lastFetchedAt`
  - `lastFetchStatus`
  - `lastError`
- Added snapshot utilities that:
  - parse `clientId` from public jar URLs
  - resolve `clientId -> extJarId`
  - normalize Monobank jar responses
  - read stored snapshots for rendering
- Added a protected sync route at `/api/monobank/sync` that:
  - requires `Authorization: Bearer $CRON_SECRET`
  - reads unique jar URLs from active projects
  - resolves and persists `extJarId` when needed
  - fetches and upserts snapshot documents using `bank/jar/{extJarId}`
  - retries resolution once when a stored `extJarId` becomes stale
  - preserves prior values on fetch errors by updating only error metadata
  - revalidates active-project pages and snapshot cache tags
- Switched the following pages to read stored snapshot data instead of calling Monobank directly:
  - active projects list
  - active project donate page
  - active project details page
- Hid the goal and progress block when no usable snapshot is available.

## Notes

- This version does not include live updates.
- This version does not require personal or corporate Monobank tokens for jar reads.
- Scheduling the 30-minute sync is deployment-level configuration; the repo now provides the protected route to call.
- Existing CMS fields like `goalValue` and `progressPercent` remain in the schema for now, but these pages prefer stored Monobank snapshot data when available.

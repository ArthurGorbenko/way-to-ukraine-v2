# Way to Ukraine Website

Payload CMS + Next.js website for the **Way to Ukraine** foundation.

## What It Includes

- Figma-based custom homepage
- CMS-managed content via Payload globals (`Header`, `Homepage`, `Footer`)
- Media uploads through Payload `media` collection
- Ukrainian font setup (`e-Ukraine`)

## Run Locally

1. Install dependencies:
```bash
pnpm install
```

2. Configure env:
```bash
cp .env.example .env
```
Set at least:
- `DATABASE_URL`
- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_SERVER_URL`

3. Start dev server:
```bash
pnpm dev
```

4. Open:
- Website: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

5. (Optional) Seed demo data from Admin dashboard using **Seed your database**.

## Useful Commands

```bash
pnpm generate:types
pnpm generate:importmap
pnpm tsc --noEmit
pnpm lint
```

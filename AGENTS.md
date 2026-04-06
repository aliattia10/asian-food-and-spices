# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
This is a French-language e-commerce storefront for Asian Food and Spices SÀRL (Geneva, Switzerland). It consists of a **Vite + React** frontend and a lightweight **Express API** backend, both in one repo. No external database or API keys are needed—carts live in-memory and orders go to a local JSONL file.

### Running services locally
Two terminals are needed for full local development:

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Express API | `npm run server` | 3001 | Must run `npm run export:products` first (generates `public/products.json`) |
| Vite Frontend | `npm run dev` | 8080 | Proxies `/api/*` to `:3001` via `vite.config.ts` |

### Non-obvious caveats
- **`npm run export:products` must run before `npm run server`** — the Express API reads `public/products.json` at startup. If missing, the API returns empty results. Only needs to re-run when product source data changes.
- **ESLint exits with code 1** due to 3 pre-existing errors in generated shadcn/ui component files (`command.tsx`, `textarea.tsx`, `tailwind.config.ts`). These are not introduced by your changes — treat warnings/errors in those files as known baseline.
- **In-memory cart** — the Express server stores carts in a JS `Map`; restarting the server clears all carts. The frontend gracefully falls back to `localStorage` if the API is unreachable.
- **Package manager: npm** — use `npm install` (lockfile is `package-lock.json`). A `bun.lockb` also exists but npm is canonical.

### Lint / Test / Build commands
See `package.json` scripts. Quick reference:
- `npm run lint` — ESLint
- `npm run test` — Vitest (single run)
- `npm run test:watch` — Vitest in watch mode
- `npm run build` — full production build (exports products, copies to netlify, then vite build)

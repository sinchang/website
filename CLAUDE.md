# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server at localhost:3000
pnpm build        # production build
pnpm lint         # ESLint
pnpm lint:fix     # ESLint with auto-fix
npx tsc --noEmit  # type-check without building
```

There are no tests. Type-checking with `npx tsc --noEmit` is the primary correctness gate.

## Architecture

**Next.js 14 Pages Router** — no App Router. All data fetching is in `getServerSideProps` in `pages/index.tsx`. There is one page (`/`) and one stub API route (`/api/hello.ts`).

### Data flow

`getServerSideProps` in `pages/index.tsx` fans out four parallel fetches:

| Source | What |
|---|---|
| `https://sinchang-checkin.web.val.run` | Latest Foursquare/Swarm check-in (venue, lat, lng, cc, location) |
| `https://my-swarm.fly.dev/checkins.db` | Full SQLite database of all check-ins — parsed server-side with `sql.js` |
| GitHub (raw JSON) | Strava workouts; filtered to run/ride/walk/hike, most recent taken |
| `https://now-playing-profile-rho.vercel.app/now-playing?json` | Spotify now-playing |

Letterboxd diary is fetched via the `letterboxd-api` npm package (not `fetch`).

All props are serialised as JSON and passed to `<BentoGrid>`.

### sql.js on Vercel

`sql.js` is used server-side only (inside `getServerSideProps`). The WASM binary lives at `public/sql-wasm.wasm` and is loaded via:

```ts
initSqlJs({ locateFile: file => path.resolve(process.cwd(), 'public', file) })
```

The schema of `checkins.db` is discovered dynamically at runtime via `PRAGMA table_info` — column names for lat/lng/country are found by regex rather than hardcoded.

### Component tree

```
pages/index.tsx
  └── BentoGrid        — 2-col CSS Grid, all bento cards
        ├── Film card  — static <a> with poster image
        ├── CheckIn → MapCard → components/ui/map.tsx (MapLibre)
        ├── ActivityMap → components/ui/map.tsx (MapLibre + polyline decode)
        ├── CheckinsGlobe (dynamic, ssr:false) — cobe WebGL globe
        └── Spotify card
```

### MapLibre map tile theming

`components/ui/map.tsx` uses a `MutationObserver` on `<html>` to watch for `class` / `data-theme` attribute changes and swaps between Carto Voyager (light) and Carto Dark Matter (dark) tile styles automatically. No manual intervention needed when toggling theme.

### Dark / light mode

- Powered by `next-themes` (`ThemeProvider` in `_app.tsx`, default `"dark"`).
- Tailwind `darkMode: ['class', '[data-theme="dark"]']`.
- The `ToggleTheme` component is rendered inside the hero section of `pages/index.tsx`.
- `CheckinsGlobe` uses `useTheme` to read `resolvedTheme` and calls `globe.update()` when the theme changes — no globe recreation needed. `DARK_THEME` / `LIGHT_THEME` constants at the top of the file hold the cobe color sets.
- All other cards use `dark:` variants; light-mode defaults use `gray-*` colors and `black/[0.08]` borders.

### Styling conventions

- Tailwind v3 with `@egoist/tailwindcss-icons` (Remix Icon `ri` collection) — icons are utility classes e.g. `i-ri-github-fill`.
- Use `text-white/[0.35]` (arbitrary fraction) not `text-white/35` (invalid in this Tailwind version).
- Card shell pattern: `rounded-3xl border border-black/[0.08] dark:border-white/[0.08]` with appropriate bg.
- Font: Space Grotesk via `--font-space-grotesk` CSS variable, applied as `font-sans` on `<main>`.

### Webpack / bundler notes

`next.config.js` adds browser polyfills (`browserify-fs`, `crypto-browserify`, `stream-browserify`) so that `sql.js` can be imported on the client side if needed. WASM files are handled with `type: 'javascript/auto'`.

### State management

Minimal: a single Jotai atom (`globalAtom`) holds `{ language: 'en-US' }`. TanStack Query v5-alpha is set up but not actively used for data fetching (everything is SSR via `getServerSideProps`).

### Database

`db/schema.ts` defines a Drizzle ORM `love` table on Neon (Postgres). Not used on the homepage currently.

## Git workflow

**Do not push without explicit user confirmation.** Commit locally and stop; wait for the user to say "push."

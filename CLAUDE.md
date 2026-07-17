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

**Next.js 16 Pages Router** — no App Router. Turbopack is the builder (default in Next 16; there is no webpack config). Pages: `/` (ISR via `getStaticProps` with `revalidate: 60`) and `/photos` (static, mock data).

### Data flow

`getStaticProps` in `pages/index.tsx` fans out five parallel fetches (film, check-in, activities, Spotify, check-in DB). Every fetch is wrapped in `safeJson()`/`fetchFilm()` helpers that return `null` on failure — a down external API must degrade to an empty card, never fail the ISR build.

| Source | What |
|---|---|
| `https://sinchang-checkin.web.val.run` | Latest Foursquare/Swarm check-in (venue, lat, lng, cc, location) |
| `https://my-swarm.fly.dev/checkins.db` | Full SQLite database of all check-ins — parsed server-side with `sql.js` |
| GitHub (raw JSON) | Strava workouts; filtered to run/ride/walk/hike, most recent taken |
| `https://now-playing-profile-rho.vercel.app/now-playing?json` | Spotify now-playing |

Letterboxd diary is fetched via the `letterboxd-api` npm package (not `fetch`).

All props are serialised as JSON and passed to `<BentoGrid>`.

### sql.js on Vercel

`sql.js` is used server-side only (inside `getStaticProps`). The WASM binary lives at `public/sql-wasm.wasm` and is loaded via:

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

`components/ui/map.tsx` uses a `MutationObserver` on `<html>` to watch for `class` / `data-theme` attribute changes and swaps between Carto Voyager (light) and Carto Dark Matter (dark) tile styles.

`map.setStyle()` wipes **all** custom sources and layers. To preserve them across theme switches, the observer toggles `isLoaded` around the style swap:

```ts
setCtx({ map, isLoaded: false }) // unmounts children → cleanup removes their layers
map.setStyle(next)
map.once('idle', () => setCtx({ map, isLoaded: true })) // remounts children → effects re-add layers
```

`idle` fires 100–500 ms after `setStyle` (after the style is fully settled), which is well after React's passive cleanup effects have run (~5 ms). This guarantees children remount into a ready map.

**Do not use these alternatives** — both were tried and fail:
- `style.load` event — fires before sprites are loaded in MapLibre v4.7.1; event propagation from the replaced Style object is unreliable
- `flushSync` to force `isLoaded: false` — React 18 schedules `useEffect` cleanups asynchronously; `setStyle` runs before cleanups complete, so layers are already wiped when cleanup tries to remove them

### Dark / light mode

- Powered by `next-themes` (`ThemeProvider` in `_app.tsx`, default `"dark"`).
- Tailwind `darkMode: ['class', '[data-theme="dark"]']`.
- The `ToggleTheme` component is rendered inside the hero section of `pages/index.tsx`.
- `CheckinsGlobe` uses `useTheme` to read `resolvedTheme` and calls `globe.update()` when the theme changes — no globe recreation needed. `DARK_THEME` / `LIGHT_THEME` constants at the top of the file hold the cobe color sets.
- All other cards use `dark:` variants; light-mode defaults use `gray-*` colors and `black/[0.08]` borders.

### Styling conventions

- **Tailwind v4** (CSS-first): `styles/globals.css` starts with `@import 'tailwindcss'` and loads the legacy JS config via `@config '../tailwind.config.js'`. The JS config is kept because the `@egoist/tailwindcss-icons` plugin (Remix Icon `ri` collection — utility classes like `i-ri-github-fill`), the `sys-bg-base` custom color, and the dual dark-mode selector can't be expressed in CSS-only config.
- PostCSS uses `@tailwindcss/postcss` (no `autoprefixer` — v4 handles prefixing).
- `globals.css` contains a v3→v4 border-color compat layer (`border-color: var(--color-gray-200, currentcolor)`); v4's default is `currentcolor`. Don't remove it without adding explicit border colors everywhere.
- v4 renamed blur scales: the old `blur-sm` (4px) is now `blur-xs`; `blur-sm` now means 8px. Same for `backdrop-blur-*`.
- Card shell pattern: `rounded-3xl border border-black/[0.08] dark:border-white/[0.08]` with appropriate bg.
- Prefer `size-*` over `h-* w-*` pairs and bare spacing over unnecessary arbitrary values (`max-w-168` not `max-w-[672px]`) — `eslint-plugin-tailwindcss` enforces these.
- Font: Space Grotesk via `--font-space-grotesk` CSS variable, applied as `font-sans` on `<main>`.

### Linting

Flat config in `eslint.config.mjs`: `@antfu/eslint-config` (v9, with `react: true`) + `@next/eslint-plugin-next` (antfu renames the plugin namespace `@next/next` → `next`, so disable comments use `next/no-img-element`) + `eslint-plugin-tailwindcss` v4 (reads the real Tailwind config via `settings.tailwindcss.cssConfigPath: 'styles/globals.css'`). `next lint` no longer exists; `next build` does not lint. `react-refresh/only-export-components` is off — Pages Router files must export `getStaticProps` alongside components.

## Git workflow

**Do not push without explicit user confirmation.** Commit locally and stop; wait for the user to say "push."

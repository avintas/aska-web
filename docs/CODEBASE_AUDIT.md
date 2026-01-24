# Codebase Health Audit

This document inventories routes, pages, API handlers, shared resources, and TypeScript types. It identifies dead code, missing endpoints, placeholders, and actionable improvements.

---

## 1. Next.js Routes and Pages

### Root layout

- **[`src/app/layout.tsx`](src/app/layout.tsx)** — Root layout: Navbar, Footer, ThemeProvider, PWARegister, Analytics. Loads `../global.css`, Inter font, metadata, viewport.

### Pages (20 total)

| Route | File | Status |
|-------|------|--------|
| `/` | [`src/app/page.tsx`](src/app/page.tsx) | Landing: LandingCarousel, newsletter signup, Game Boy–style UI |
| `/about` | `src/app/about/page.tsx` | Content page |
| `/bench-boss` | `src/app/bench-boss/page.tsx` | Fetches `/api/bench-boss`, `/api/bench-boss/sets` (see Missing APIs) |
| `/captain-heart` | `src/app/captain-heart/page.tsx` | Fetches `/api/captain-heart/sets` (see Missing APIs) |
| `/did-you-know` | `src/app/did-you-know/page.tsx` | Uses `/api/collections/factoids`, `mapSetsToCarouselCards` |
| `/ethos` | `src/app/ethos/page.tsx` | Content page |
| `/faq` | `src/app/faq/page.tsx` | Content page |
| `/game-plan` | `src/app/game-plan/page.tsx` | Fetches `/api/game-plan` (missing) |
| `/hockey-culture` | `src/app/hockey-culture/page.tsx` | Content page |
| `/motivators` | `src/app/motivators/page.tsx` | Uses 5 collection APIs (motivational, supportive, advisory, slogans, shareables) |
| `/my-records` | `src/app/my-records/page.tsx` | **Placeholder** — “My Records content coming soon...” |
| `/pbp` | `src/app/pbp/page.tsx` | **Placeholder** — “Content coming soon...” (Wisdom Table) |
| `/pre-game` | `src/app/pre-game/page.tsx` | **Hardcoded data** — `goodLuckMessages` array; comment: “will eventually come from an API” |
| `/privacy` | `src/app/privacy/page.tsx` | Content page |
| `/rink-philosopher` | `src/app/rink-philosopher/page.tsx` | Fetches `/api/rink-philosopher`, `/api/rink-philosopher/sets` (see Missing APIs) |
| `/shop` | `src/app/shop/page.tsx` | **Placeholder** — “Coming Soon” storefront |
| `/support` | `src/app/support/page.tsx` | Content page |
| `/terms` | `src/app/terms/page.tsx` | Content page |
| `/the-code` | `src/app/the-code/page.tsx` | Fetches `/api/the-code` (missing) |
| `/trivia-arena` | `src/app/trivia-arena/page.tsx` | Uses `/api/collections/trivia-*`, `mapSetsToCarouselCards`; `ShootoutGame` fetches `/api/trivia-arena/questions` (missing) |

### Error page

- **`/404`** — [`src/app/not-found.tsx`](src/app/not-found.tsx)

### Nested structure

- **`/trivia-arena`**: `page.tsx` plus `components/` (DebugPanel, QuestionCard, ResultCard, ScoreBoard, ShootoutGame) and `utils/keeper.ts`. No dynamic segments (`[param]`, `[...slug]`).

### API routes

**Collection APIs (all GET):**

- `src/app/api/collections/advisory/route.ts`
- `src/app/api/collections/factoids/route.ts`
- `src/app/api/collections/motivational/route.ts`
- `src/app/api/collections/shareables/route.ts`
- `src/app/api/collections/slogans/route.ts`
- `src/app/api/collections/supportive/route.ts`
- `src/app/api/collections/trivia-multiple-choice/route.ts`
- `src/app/api/collections/trivia-true-false/route.ts`

**Auth:**

- `src/app/auth/callback/route.ts` — OAuth callback (GET)

### References to missing routes

| Referenced | Used in | Exists? |
|------------|---------|---------|
| `/legends` | `page.tsx` `_unusedCells` (dead code) | No page |
| `POST /api/newsletter` | `page.tsx` newsletter form | No route |
| `GET /api/game-plan`, `?mode=archive`, `?id=` | `game-plan/page.tsx` | No route |
| `GET /api/the-code`, `?mode=archive`, `?id=` | `the-code/page.tsx` | No route |
| `GET /api/rink-philosopher`, `?theme=`, `GET /api/rink-philosopher/sets` | `rink-philosopher/page.tsx` | No routes |
| `GET /api/captain-heart/sets` | `captain-heart/page.tsx` | No route |
| `GET /api/bench-boss`, `?category=`, `GET /api/bench-boss/sets` | `bench-boss/page.tsx` | No routes |
| `GET /api/trivia-arena/questions` | `ShootoutGame.tsx` | No route |

### Collection API consumers

- **factoids**: `did-you-know/page.tsx`
- **motivational, supportive, advisory, slogans, shareables**: `motivators/page.tsx`
- **trivia-multiple-choice, trivia-true-false**: `trivia-arena/page.tsx`

All collection routes are used.

### Dead code in `page.tsx`

- **`_unusedCells`** (lines 42–278): Old 25-cell grid config; carousel uses `carousel-cards` from config. Includes `/legends` link. Unused.
- **`_unusedHandleCellClick`** (lines 280–313): Cell click handler; never wired. Only code that would set `showPreview` / `previewCell`.
- **Preview modal** (lines 417–534): Shown when `showPreview && previewCell`. Those are only set in `_unusedHandleCellClick`, so the modal is never shown. Dead UI.
- **`handleClosePreview`**, **`handleNavigate`**: Only used by the dead modal.
- **`previewCell`**, **`showPreview`**: Only ever set by the unused handler.

**Done.** Removed all of the above.

### Unused variables (eslint-disable)

- **`rink-philosopher/page.tsx`**: `currentLabel` is set via `setCurrentLabel` but never read.
- **`bench-boss/page.tsx`**: Same for `currentLabel`.

**Done.** Removed in both pages.

---

## 2. Shared Resources (components, utils, config)

### Components

| Component | Imported by | Notes |
|-----------|-------------|--------|
| `DidYouKnowCarousel` | — | **Removed** (unused) |
| `FactGrid` | — | **Removed** (only used by DidYouKnowCarousel) |
| `HubSelectorGrid` | — | **Removed** (unused) |
| `MotivatorPersonaPage` | — | **Removed** (unused; placeholder) |
| `MotivatorsCarousel` | — | **Removed** (unused) |
| `MotivatorsGrid` | — | **Removed** (unused) |
| `LandingCarousel` | `page.tsx` | Used |
| `HubGrid` | LandingCarousel, mapSetsToCarouselCards, etc. | Used |
| `ContentCarousel` | did-you-know, motivators | Used |
| `ContentGrid` | ContentCarousel | Used |

### Utilities

| File | Exports | Usage |
|------|---------|--------|
| `factEmojis.ts` | `getEmojiForFact`, `formatCategoryLabel` | Not imported; only in docs |
| `visualAnchor.ts` | `isVisualAnchorIndex` | Used (ContentGrid, mapSetsToCarouselCards). `getVisualAnchorIndex` removed as unused. |
| `mapSetsToCarouselCards` | `mapSetsToCarouselCards` | Used by trivia-arena, did-you-know, motivators |

### Config

| File | Notes |
|------|--------|
| `image-mappings.ts` | Deprecated `getImage` removed. `getSequentialImage` used. |
| `carousel-cards.ts` | Cards 2–8 are placeholder inactive cells; populated dynamically via `mapSetsToCarouselCards` where applicable. Card 1 (Explore) is static. |

**Done:** Removed unused components `DidYouKnowCarousel`, `FactGrid`, `HubSelectorGrid`, `MotivatorPersonaPage`, `MotivatorsCarousel`, `MotivatorsGrid`. Removed deprecated `getImage` and unused `getVisualAnchorIndex`. `factEmojis` left in place (documented as unused).

---

## 3. TypeScript Types and Shared Code

### `src/shared/types/collections.ts`

- Interfaces: `Wisdom`, `Greeting`, `Stat`, `Fact`, `Motivational`, etc.
- `*CreateInput`, `*UpdateInput`, `*FetchParams` types.
- **Usage:** Not imported in app/API code; APIs use raw Supabase. Only referenced in docs.

**Action:** Either use these types in API routes and handlers or remove/deprecate them.

### `src/shared/types/trivia.ts`

- `WhoAmITrivia`, `WhoAmITriviaCreateInput`, `WhoAmITriviaUpdateInput`, `WhoAmITriviaFetchParams` — **removed** (unused; no who-am-i implementation). `ContentType` in `content.ts` still includes `"who-am-i"` for possible future use.

### `src/shared/utils/index.ts`

- `isValidUUID`, `formatDate`, `createApiResponse` were exported but never imported — **removed.** File kept as placeholder for future shared utils.

### `src/shared/index.ts`

- `Database` type was exported but unused — **removed.**

### Page-level types

- `game-plan/page.tsx`: Local `MotivationalItem`, `MotivationalRecord`, `ArchiveItem`, `ApiResponse`.
- `the-code/page.tsx`: Local `CodeItem`, `CodeRecord`, `ArchiveItem`, `ApiResponse`.

Consider sharing or moving to `shared` if used elsewhere.

---

## 4. General Health Checklist

### High priority

1. **Remove dead code in `page.tsx`:** **Done.** Removed `_unusedCells`, `_unusedHandleCellClick`, preview modal, related state/handlers, `CellConfig`/`CellDisplayType`, and `useRouter`.
2. **Fix unused state in rink-philosopher and bench-boss:** **Done.** Removed `currentLabel` and all `setCurrentLabel` usage.
3. **Missing APIs:** Add or stub:
   - `POST /api/newsletter`
   - `GET /api/game-plan` (and archive/single-set variants)
   - `GET /api/the-code` (and archive/single-set variants)
   - `GET /api/rink-philosopher`, `GET /api/rink-philosopher/sets`
   - `GET /api/captain-heart/sets`
   - `GET /api/bench-boss`, `GET /api/bench-boss/sets`
   - `GET /api/trivia-arena/questions`
4. **`/legends`:** Either add `src/app/legends/page.tsx` or remove the reference (currently only in dead `_unusedCells`; carousel config has no legends link).

### Medium priority

5. **Unused components:** **Done.** Removed `DidYouKnowCarousel`, `FactGrid`, `HubSelectorGrid`, `MotivatorPersonaPage`, `MotivatorsCarousel`, `MotivatorsGrid`.
6. **Utils:** **Done.** Removed deprecated `getImage` and unused `getVisualAnchorIndex`. Removed unused shared utils (`isValidUUID`, `formatDate`, `createApiResponse`). `factEmojis` left in place.
7. **Types:** **Done.** Removed `Database` and `WhoAmITrivia`-related types. Use shared collection types in APIs or remove in a later pass.

### Lower priority

8. **Placeholder pages:** Document or mark “under construction” for `my-records`, `pbp`, `shop`; consider routing or UX clarity.
9. **Pre-game:** Replace hardcoded `goodLuckMessages` with an API when ready.
10. **Lint and automation:** Stricter ESLint for unused exports/vars; optional script or CI check for unused files.
11. **Carousel config:** Confirm whether cards 2–8 static placeholders are still needed once dynamic data is wired.

---

## Summary

- **Routes/pages:** 20 pages, 8 collection APIs + auth callback. Multiple pages call missing APIs (`game-plan`, `the-code`, `rink-philosopher`, `captain-heart`, `bench-boss`, `trivia-arena/questions`, `newsletter`).
- **Dead code:** Homepage grid/preview logic and modal; unused `currentLabel` in rink-philosopher and bench-boss.
- **Unused resources:** Several components, `factEmojis`, deprecated `getImage`, and unused shared types/utils.
- **Next steps:** Apply high-priority cleanups, add or stub missing APIs, then tackle component/util/type cleanups and placeholder documentation.

This repo is a small Next.js 14 PWA (TypeScript + React) called GymWeight. The app is a single-page client-heavy UI that stores exercise definitions, sets and daily completion checks in IndexedDB using the `idb` library.

Key places to read before changing code
- `app/page.tsx` — client entry for the Home screen; calls `ensureDb()` before rendering `ExerciseList`.
- `components/ExerciseForm.tsx` — how exercises are created (calls `addExercise`).
- `components/ExerciseList.tsx` — main UI for listing, saving sets and toggling today's completion. Shows patterns for optimistic UI and refresh flows.
- `lib/storage.ts` — single source of truth for all persistent logic. Uses `idb` (openDB) and exposes: `ensureDb`, `addExercise`, `getExercises`, `upsertSet`, `getLastSetForExercise`, `toggleTodayDone`, `getTodayCompletionMap`.
- `lib/types.ts` — canonical types (`Exercise`, `SetEntry`, `MuscleTag`) and `MUSCLE_TAGS` constant used across components.

Big-picture architecture notes
- Client-first Next.js app using 'use client' components. There is no server API layer; persistence is local IndexedDB. Any change that requires shared/cloud sync needs a new server API and careful migration.
- `lib/storage.ts` encapsulates DB schema and indexes. Altering object stores or indexes requires bumping the DB version in `openDB('gymweight-db', 1, ...)` and writing a proper `upgrade` handler.
- App is intentionally offline-first (PWA dependency `next-pwa` is present). Be conservative when changing storage behavior since users expect offline persistence.

Developer workflows & common commands
- Dev server: `npm run dev` (starts Next.js dev server).
- Build: `npm run build` then `npm run start` for production preview.
- Lint: `npm run lint` (uses Next.js ESLint config).

Project-specific conventions & patterns
- All client components use the `use client` directive at top of the file. Keep state and effects client-only — server components are not used.
- Import aliases: components and lib are imported as `@/components/...` and `@/lib/...` — keep relative/alias imports consistent.
- Storage API: prefer calling wrapper functions in `lib/storage.ts` from components rather than using `idb` directly. This centralises schema and migration logic.
- IDs: `crypto.randomUUID()` is used for primary keys. Keep this when creating new records for consistency.
- Date handling: `startOfTodayLocal()` computes local-day boundary. Any change to daily checks must respect local-time behavior.

Examples (copyable snippets)
- Ensure DB before usage (used in `app/page.tsx`):
  await ensureDb()

- Add exercise (used in `ExerciseForm.tsx`):
  await addExercise({ name: 'Kniebeugen', muscleTag: 'Bein' })

- Upsert a set and mark today done (used in `ExerciseList.tsx`):
  await upsertSet(exId, weightText, repsText)
  await toggleTodayDone(exId, true)

Testing and safety
- There are no unit tests in the repo. When changing `lib/storage.ts`, test locally in the browser (dev server) and clear IndexedDB between trials (Application → Storage in browser devtools) to validate migrations.
- When bumping the DB version, implement a safe `upgrade` that migrates existing stores and preserves data where possible.

When in doubt, look at these files first: `lib/storage.ts`, `components/ExerciseList.tsx`, `components/ExerciseForm.tsx`, `app/page.tsx`, `lib/types.ts`.

If you need further clarification on design intent, ask which behavior we must preserve (offline-first, local-only persistence, local-day boundary semantics) before proposing server sync or schema changes.

Please review — tell me any missing examples or additional developer notes you want included.

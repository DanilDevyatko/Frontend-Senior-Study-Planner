# Frontend Senior Study Planner

A production-focused study planner for frontend engineers working through a 12-week roadmap toward Senior Frontend depth.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- CSS Modules
- Supabase Auth + Database
- Vitest + Testing Library

## Architecture decisions

- The study roadmap is immutable seed data and lives in [`src/data/seed/studyPlan.ts`](./src/data/seed/studyPlan.ts).
- User state is stored separately as a persisted snapshot: task progress, task notes, reflections, manual weak-topic flags, and the study start date.
- Supabase is the source of truth for authenticated users, while the browser keeps a mirrored local cache for faster recovery.
- The pre-cloud `localStorage` snapshot is treated as a one-time migration source for the first Supabase-backed sign-in.
- Derived analytics such as current week, streak, completion percentages, weak topics, and review recommendations are calculated by selectors in [`src/features/planner/plannerSelectors.ts`](./src/features/planner/plannerSelectors.ts).
- App-wide state still uses React Context + `useReducer` so the planner domain logic stays dependency-light and easy to evolve.

## Data model

Core domain types live in [`src/types/planner.ts`](./src/types/planner.ts) and include:

- `StudyPlan`
- `StudyWeek`
- `StudyDay`
- `StudyTask`
- `Topic`
- `Reflection`
- `TaskNote`
- `Deliverable`
- `ProgressStats`
- `PlannerSnapshot`
- `TopicHealth`
- `ReviewRecommendation`

## Main features

- Email/password sign-up, sign-in, forgot-password, and reset-password flows via Supabase Auth
- Dashboard with current week, today's session, completion stats, streak, weak areas, milestones, and upcoming deliverable
- Roadmap view with all 12 weeks visible, expandable summaries, and a focused week workspace route
- Task tracking with `not_started`, `in_progress`, `done`, and `blocked` states
- Task-level notes that persist per study task
- Weekly reflections with learning notes and confidence scoring
- Topic health view with subtle mastery and at-risk indicators
- Review page that auto-surfaces overdue tasks, blocked topics, and low-confidence revision targets
- Cross-device cloud sync with local cache fallback, reset controls, and start-date controls

## Important files

- `src/app/App.tsx`: routing and top-level app composition
- `src/app/AppShell.tsx`: desktop and mobile navigation shell
- `src/features/auth/AuthProvider.tsx`: Supabase auth session lifecycle and auth actions
- `src/features/planner/PlannerProvider.tsx`: cloud boot sequence, realtime sync, and planner persistence wiring
- `src/features/planner/plannerReducer.ts`: planner state transitions
- `src/features/planner/plannerSelectors.ts`: analytics and derived planner logic
- `src/storage/plannerRepository.ts`: Supabase snapshot reads, writes, and realtime subscription
- `supabase/planner_snapshots.sql`: table, trigger, RLS policies, and realtime setup

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:run`

## Local development

1. Install dependencies:
   - `npm install`
2. Copy [`.env.example`](./.env.example) to `.env`.
3. Fill in your Supabase project values:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Start the app:
   - `npm run dev`

The dev server uses `vite --host`, so the app is available on your local network while developing.

## Supabase setup

1. Create a Supabase project.
2. Run [`supabase/planner_snapshots.sql`](./supabase/planner_snapshots.sql) in the Supabase SQL Editor.
3. In `Authentication -> Sign In / Providers`, enable the `Email` provider.
4. In `Authentication -> URL Configuration`, set:
   - `Site URL`: `http://localhost:5173`
   - `Redirect URL`: `http://localhost:5173/auth`
5. Keep the real `.env` file out of Git. Only commit [`.env.example`](./.env.example).

The frontend only needs the public-safe Supabase anon key. Never put the `service_role` key in the app.

## Manual verification

1. Start the app with `npm run dev`.
2. Open `http://localhost:5173/auth`.
3. Sign up or sign in with email and password.
4. Change planner data, for example:
   - mark a task done
   - save a task note
   - save a reflection
5. In Supabase Table Editor, confirm a row appears in `public.planner_snapshots`.
6. Open the app in another browser or device, sign in with the same account, and confirm the planner state matches.

## Important notes

- The planner snapshot is stored as JSONB in a single per-user row for simpler migrations and sync.
- Supabase is the source of truth, while the browser keeps a local cache for faster recovery and first-login migration.
- Sync uses snapshot-level last-write-wins based on the latest server `updated_at`.

## Where to modify the study plan later

Update the seeded roadmap in [`src/data/seed/studyPlan.ts`](./src/data/seed/studyPlan.ts). That file contains the topic list, milestones, weekly goals, expected outcomes, tasks, deliverables, and checkpoint prompts.

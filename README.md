# Frontend Senior Study Planner

A production-focused study planner for frontend engineers working through a 12-week roadmap toward Senior Frontend depth.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- CSS Modules
- Vitest + Testing Library
- Local persistence via `localStorage`

## Architecture decisions

- The study roadmap is immutable seed data and lives in [`src/data/seed/studyPlan.ts`](./src/data/seed/studyPlan.ts).
- User state is stored separately as a persisted snapshot: task progress, reflections, manual weak-topic flags, and start date.
- Derived analytics such as current week, streak, completion percentages, weak topics, and review recommendations are calculated by selectors in [`src/features/planner/plannerSelectors.ts`](./src/features/planner/plannerSelectors.ts).
- App-wide state uses React Context + `useReducer` to keep the architecture dependency-light and easy to evolve.
- The roadmap uses a real calendar schedule driven by `planStartDate`, which is editable in Settings.

## Data model

Core domain types live in [`src/types/planner.ts`](./src/types/planner.ts) and include:

- `StudyPlan`
- `StudyWeek`
- `StudyDay`
- `StudyTask`
- `Topic`
- `Reflection`
- `Deliverable`
- `ProgressStats`
- `PlannerSnapshot`
- `TopicHealth`
- `ReviewRecommendation`

## Main features

- Dashboard with current week, today’s session, completion stats, streak, weak areas, milestones, and upcoming deliverable
- Roadmap view with all 12 weeks visible, expandable summaries, and a focused week workspace route
- Task tracking with `not_started`, `in_progress`, `done`, and `blocked` states
- Weekly reflections with learning notes and confidence scoring
- Topic health view with subtle mastery and at-risk indicators
- Review page that auto-surfaces overdue tasks, blocked topics, and low-confidence revision targets
- Local persistence with reset and start-date controls

## Important files

- `src/app/App.tsx`: routing and top-level app composition
- `src/app/AppShell.tsx`: desktop and mobile navigation shell
- `src/data/seed/studyPlan.ts`: editable 12-week study content
- `src/features/planner/PlannerProvider.tsx`: provider and persistence wiring
- `src/features/planner/plannerReducer.ts`: state transitions
- `src/features/planner/plannerSelectors.ts`: analytics and derived planner logic
- `src/storage/plannerStorage.ts`: versioned local storage adapter

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:run`

## Where to modify the study plan later

Update the seeded roadmap in [`src/data/seed/studyPlan.ts`](./src/data/seed/studyPlan.ts). That file contains the topic list, milestones, weekly goals, expected outcomes, tasks, deliverables, and checkpoint prompts.

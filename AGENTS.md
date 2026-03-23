You are a senior product engineer and frontend architect.

Build a production-quality web application called "Frontend Senior Study Planner".

Goal:
Create a planner app that helps a frontend engineer follow a 3-month study plan, track progress clearly, stay consistent, and see growth over time.

Primary user:
A frontend engineer who wants to grow toward Senior Frontend level through a structured 12-week roadmap focused on fundamentals, React, architecture, performance, TypeScript, browser internals, testing, and a final project.

Core product objective:
The app must make study progress visible, motivating, and easy to manage. It should feel like a serious productivity tool, not a toy.

Product requirements:

1. The app must support a 12-week study roadmap.
2. Each week must contain:
   - title
   - focus area
   - goals
   - daily tasks
   - deliverables
   - weekly checkpoint
3. Each task must support statuses:
   - not started
   - in progress
   - done
   - blocked
4. The app must allow the user to:
   - mark tasks complete
   - track daily progress
   - track weekly completion percentage
   - see total plan completion percentage
   - add notes/reflections
   - mark weak topics for revision
   - review missed tasks
5. The app must include a dashboard with:
   - current week
   - today’s tasks
   - completion stats
   - consistency/streak
   - weak areas
   - upcoming deliverable
6. The app must include a roadmap view:
   - all 12 weeks visible
   - each week expandable
   - progress shown visually
7. The app must include a topic health view:
   - JavaScript
   - Async/Event Loop
   - Browser Internals
   - TypeScript
   - React Internals
   - State Management
   - Performance
   - Forms & Accessibility
   - Architecture
   - Data Layer
   - Testing
   - Final Project
     Each topic should show confidence/progress level.
8. The app must include a reflection system:
   - “What did I learn?”
   - “What was difficult?”
   - “Can I explain it clearly?”
   - “Can I build it from scratch?”
   - “Can I debug it?”
9. The app must help with revision:
   - auto-surface unfinished tasks
   - auto-group blocked topics
   - show review recommendations
10. The app must persist data locally.
11. The app must be responsive and work well on desktop first, then mobile.
12. The app must have clean UX and professional visual design.

Add a light progression system:

- study streak
- weekly completion badge
- topic mastery indicator
- “at risk” topics
- milestone markers at weeks 4, 8, and 12

Keep it professional and subtle. Do not gamify it in a childish way.

Technical requirements:

1. Use a modern frontend stack:
   - React
   - TypeScript
   - Vite
2. Use a clean scalable project structure.
3. Use component-driven architecture.
4. Use accessible semantic HTML.
5. Use strong TypeScript types for all domain models.
6. Use local persistence with a clean abstraction layer.
7. Add tests for core business logic.
8. Avoid overengineering, but keep architecture extensible.

Suggested architecture:

- pages
- components
- features
- entities/models
- hooks
- utils
- storage
- data/seed
- types

Data model requirements:
Design proper TypeScript models for:

- StudyPlan
- StudyWeek
- StudyDay
- StudyTask
- Topic
- Reflection
- Deliverable
- ProgressStats

UX requirements:
The UI should include:

- Dashboard
- 12-week planner page
- Week details page or panel
- Task tracker
- Reflection notes
- Progress analytics
- Weak topics / review section
- Settings or reset option

Important UX rules:

- The app must be easy to scan.
- The user should understand progress in under 5 seconds.
- Visual hierarchy must be strong.
- Avoid clutter.
- Use cards, sections, progress bars, and concise labels.
- Make the experience feel motivating but not childish.
- Prefer calm, professional design.

Seed content requirements:
Populate the app with a realistic 12-week frontend senior study plan using this structure:

Month 1:
Week 1: JavaScript Execution and Closures
Week 2: Async and Event Loop
Week 3: Browser Internals
Week 4: Advanced TypeScript

Month 2:
Week 5: React Internals
Week 6: State Management
Week 7: Performance Optimization
Week 8: Forms, Validation, Accessibility

Month 3:
Week 9: Frontend Architecture
Week 10: Data Layer and Networking
Week 11: Testing and Reliability
Week 12: Final Production-Grade Project

For each week, generate:

- focus
- expected outcomes
- 5 to 7 tasks
- 1 deliverable
- 1 weekly self-check section

Implementation instructions:

1. First, design the app structure and data model.
2. Then implement the UI skeleton.
3. Then add seeded roadmap data.
4. Then implement progress tracking and local persistence.
5. Then implement dashboard analytics.
6. Then refine UX and styling.
7. Then add tests for critical logic.
8. Then review and improve code quality.

Output expectations:

- Produce complete working code, not pseudo-code.
- Keep code readable and maintainable.
- Comment only where useful.
- Use consistent naming.
- Avoid unnecessary dependencies.
- Ensure the app runs successfully.

Definition of done:
The project is done when I can:

- open the app
- see the full 12-week plan
- mark daily/weekly tasks
- track my overall progress
- see weak topics
- write reflections
- identify what to review next
- use it as my real study planner

When making product decisions:
Prefer clarity, maintainability, and progress visibility over flashy effects.

After implementation:
Provide a short summary of:

- architecture decisions
- data model
- main features
- where to modify study plan content later

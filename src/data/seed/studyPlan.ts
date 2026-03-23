import type { Deliverable, Milestone, StudyPlan, StudyTask, StudyWeek, TaskKind, Topic } from '../../types/planner'

interface TaskBlueprint {
  title: string
  summary: string
  type: TaskKind
}

interface WeekBlueprint {
  title: string
  focusArea: string
  goals: string[]
  expectedOutcomes: string[]
  tasks: TaskBlueprint[]
  deliverable: Omit<Deliverable, 'id' | 'weekId' | 'dueDayIndex'>
  checkpoint: string
  topicId: string
  milestone?: string
}

const topics: Topic[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Execution contexts, scope, closures, and mental models for reasoning about runtime behavior.',
    weekIds: ['week-1'],
  },
  {
    id: 'async-event-loop',
    name: 'Async/Event Loop',
    description: 'Promises, task queues, async rendering, and the mechanics behind browser scheduling.',
    weekIds: ['week-2'],
  },
  {
    id: 'browser-internals',
    name: 'Browser Internals',
    description: 'Rendering pipeline, critical request chain, DOM/CSSOM, and performance-sensitive browser behavior.',
    weekIds: ['week-3'],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'Advanced types, inference, generics, and designing resilient component APIs.',
    weekIds: ['week-4'],
  },
  {
    id: 'react-internals',
    name: 'React Internals',
    description: 'Rendering, reconciliation, hooks behavior, and how React schedules and commits updates.',
    weekIds: ['week-5'],
  },
  {
    id: 'state-management',
    name: 'State Management',
    description: 'State boundaries, reducer patterns, server state vs client state, and scalable update flows.',
    weekIds: ['week-6'],
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Runtime bottlenecks, render cost, bundle discipline, and measurement-driven frontend optimization.',
    weekIds: ['week-7'],
  },
  {
    id: 'forms-accessibility',
    name: 'Forms & Accessibility',
    description: 'Accessible forms, validation flows, interaction states, and robust inclusive UX.',
    weekIds: ['week-8'],
  },
  {
    id: 'architecture',
    name: 'Architecture',
    description: 'Feature boundaries, dependency flow, shared abstractions, and maintainable frontend systems.',
    weekIds: ['week-9'],
  },
  {
    id: 'data-layer',
    name: 'Data Layer',
    description: 'Networking, caching, request lifecycles, error handling, and resilient API interaction.',
    weekIds: ['week-10'],
  },
  {
    id: 'testing',
    name: 'Testing',
    description: 'Confidence-building tests, reliability practices, and debugging regressions before shipping.',
    weekIds: ['week-11'],
  },
  {
    id: 'final-project',
    name: 'Final Project',
    description: 'Bringing senior-level planning, execution, QA, and product thinking into one shipped artifact.',
    weekIds: ['week-12'],
  },
]

const milestones: Milestone[] = [
  {
    weekNumber: 4,
    title: 'Foundations Locked',
    summary: 'Core language and browser understanding is strong enough to support deeper framework and system work.',
  },
  {
    weekNumber: 8,
    title: 'Systems Thinking',
    summary: 'You are connecting UI craft with architecture, state, performance, and accessible product delivery.',
  },
  {
    weekNumber: 12,
    title: 'Production Project',
    summary: 'The roadmap culminates in a production-grade project that demonstrates senior-level execution.',
  },
]

const weekBlueprints: WeekBlueprint[] = [
  {
    title: 'JavaScript Execution and Closures',
    focusArea: 'Execution contexts, lexical scope, hoisting, and closures.',
    goals: [
      'Build an intuition for how JavaScript evaluates code line by line.',
      'Explain closure behavior in interviews and code reviews without hand-waving.',
      'Spot scope-related bugs faster when debugging application logic.',
    ],
    expectedOutcomes: [
      'You can draw the call stack and scope chain for non-trivial examples.',
      'You can explain why closures are powerful and where they create bugs.',
    ],
    tasks: [
      { title: 'Map the execution context lifecycle', summary: 'Write notes on creation vs execution phases and hoisting rules.', type: 'learn' },
      { title: 'Trace lexical scope by hand', summary: 'Walk through nested functions and annotate visible variables at each level.', type: 'practice' },
      { title: 'Build a closure exercise set', summary: 'Implement three small functions that rely on private state and closures.', type: 'build' },
      { title: 'Debug hoisting edge cases', summary: 'Compare `var`, `let`, `const`, and function declarations with runnable snippets.', type: 'practice' },
      { title: 'Refactor event handlers with closures', summary: 'Create a mini DOM example that uses closures for encapsulated behavior.', type: 'build' },
      { title: 'Summarize common closure mistakes', summary: 'List stale variable capture patterns and how to avoid them.', type: 'review' },
      { title: 'Teach the topic back', summary: 'Record a short explanation of execution context, scope, and closures in your own words.', type: 'reflect' },
    ],
    deliverable: {
      title: 'Execution model notebook',
      description: 'A concise note set with code examples showing execution phases, scope chains, and closure patterns.',
    },
    checkpoint: 'Can I explain why a closure keeps data alive after the parent function returns, and can I debug a closure bug confidently?',
    topicId: 'javascript',
  },
  {
    title: 'Async and Event Loop',
    focusArea: 'Promises, microtasks, macrotasks, timers, and async rendering implications.',
    goals: [
      'Understand task ordering well enough to predict async output before running code.',
      'Connect event loop mechanics to user-facing responsiveness and race conditions.',
      'Clarify how promise chains differ from timers and I/O callbacks.',
    ],
    expectedOutcomes: [
      'You can explain microtask vs macrotask ordering with confidence.',
      'You can reason about async bugs without relying on trial and error.',
    ],
    tasks: [
      { title: 'Diagram the browser event loop', summary: 'Capture queues, call stack, rendering, and task scheduling in one diagram.', type: 'learn' },
      { title: 'Predict async output order', summary: 'Solve five promise and timer sequencing exercises before executing them.', type: 'practice' },
      { title: 'Build a race-condition sandbox', summary: 'Create a small async demo showing stale responses and ordering hazards.', type: 'build' },
      { title: 'Review promise composition patterns', summary: 'Compare `all`, `allSettled`, `race`, and `any` with concrete use cases.', type: 'learn' },
      { title: 'Investigate abortable fetches', summary: 'Implement cancellation with `AbortController` and observe state updates.', type: 'build' },
      { title: 'Write async debugging notes', summary: 'Document the signs of race conditions, swallowed errors, and stale updates.', type: 'review' },
      { title: 'Explain event loop behavior aloud', summary: 'Practice explaining a tricky promise example from the queue perspective.', type: 'reflect' },
    ],
    deliverable: {
      title: 'Async sequencing cheatsheet',
      description: 'A reference that covers queue ordering, promise orchestration, and practical async debugging heuristics.',
    },
    checkpoint: 'Can I predict the order of mixed promises and timers, and can I explain why a race condition occurred in a real UI?',
    topicId: 'async-event-loop',
  },
  {
    title: 'Browser Internals',
    focusArea: 'Rendering pipeline, layout, paint, composition, and network-to-pixel behavior.',
    goals: [
      'Tie browser internals directly to frontend debugging and performance work.',
      'Understand what forces layout, paint, or composition changes.',
      'Explain how the critical rendering path affects the first user experience.',
    ],
    expectedOutcomes: [
      'You can connect CSS and DOM changes to concrete browser work.',
      'You can identify likely rendering bottlenecks before profiling.',
    ],
    tasks: [
      { title: 'Map the critical rendering path', summary: 'Write down the sequence from HTML request to first meaningful paint.', type: 'learn' },
      { title: 'Audit a layout thrash example', summary: 'Create a sample that reads and writes layout repeatedly, then explain the cost.', type: 'practice' },
      { title: 'Compare paint vs composite changes', summary: 'Test transform, opacity, width, and position changes in DevTools.', type: 'build' },
      { title: 'Review caching and network layers', summary: 'Summarize cache headers, preload hints, and asset prioritization basics.', type: 'learn' },
      { title: 'Inspect browser memory behavior', summary: 'Use DevTools to watch DOM growth and long-lived listeners.', type: 'practice' },
      { title: 'Write browser internals notes', summary: 'Capture what forces style, layout, paint, and composite steps.', type: 'review' },
      { title: 'Teach the rendering pipeline', summary: 'Explain how a frame reaches the screen and where frontend code can hurt it.', type: 'reflect' },
    ],
    deliverable: {
      title: 'Rendering pipeline teardown',
      description: 'A short analysis of one UI interaction, listing the browser steps it triggers and where optimization matters.',
    },
    checkpoint: 'Can I look at a UI performance issue and describe which browser stages are being stressed?',
    topicId: 'browser-internals',
  },
  {
    title: 'Advanced TypeScript',
    focusArea: 'Generics, discriminated unions, utility types, inference, and API design.',
    goals: [
      'Use TypeScript to model product state rather than just satisfy the compiler.',
      'Design resilient component and hook APIs with strong inference.',
      'Reduce unsafe casts and turn edge cases into explicit types.',
    ],
    expectedOutcomes: [
      'You can model complex UI state with unions and derived helper types.',
      'You can write reusable generic helpers without fighting inference.',
    ],
    tasks: [
      { title: 'Review discriminated union patterns', summary: 'Convert a few boolean-heavy state examples into tagged unions.', type: 'learn' },
      { title: 'Practice with indexed access and mapped types', summary: 'Build helper types for form state and API responses.', type: 'practice' },
      { title: 'Create a generic table or list helper', summary: 'Use generics and constrained keys to keep rendering APIs type-safe.', type: 'build' },
      { title: 'Refactor unsafe casts away', summary: 'Take a sample module and replace `as` usage with proper guards or types.', type: 'practice' },
      { title: 'Model component variants with unions', summary: 'Design a prop contract that encodes valid combinations at compile time.', type: 'build' },
      { title: 'Write TypeScript design notes', summary: 'Capture when to prefer unions, generics, utility types, and explicit helpers.', type: 'review' },
      { title: 'Explain your type decisions', summary: 'Describe why your types are preventing bugs rather than just adding ceremony.', type: 'reflect' },
    ],
    deliverable: {
      title: 'Typed UI primitives pack',
      description: 'A small set of typed examples that show generics, unions, and safe API design in practice.',
    },
    checkpoint: 'Can I model UI states and component constraints without relying on broad optional props or unsafe casts?',
    topicId: 'typescript',
    milestone: 'Foundations Locked',
  },
  {
    title: 'React Internals',
    focusArea: 'Rendering, reconciliation, hooks timing, and what actually triggers rerenders.',
    goals: [
      'Understand React behavior deeply enough to debug render problems on first principles.',
      'Connect hooks rules to how React tracks component state and effects.',
      'Explain reconciliation and identity in practical product terms.',
    ],
    expectedOutcomes: [
      'You can explain why a component rerendered and whether that matters.',
      'You can reason about state preservation, keys, and effect timing correctly.',
    ],
    tasks: [
      { title: 'Map render and commit phases', summary: 'Summarize what happens during render, commit, and passive effect flushing.', type: 'learn' },
      { title: 'Practice state preservation rules', summary: 'Build examples showing how keys and tree position affect component state.', type: 'practice' },
      { title: 'Inspect hook timing examples', summary: 'Compare `useEffect` and `useLayoutEffect` in a small measurement demo.', type: 'build' },
      { title: 'Review reconciliation heuristics', summary: 'Document how list updates and element identity shape diffing behavior.', type: 'learn' },
      { title: 'Build a rerender debugging sandbox', summary: 'Use logs and DevTools to inspect why components rerender.', type: 'build' },
      { title: 'Capture internal mental models', summary: 'Write down the few rules that help you reason about React behavior quickly.', type: 'review' },
      { title: 'Teach React rendering clearly', summary: 'Explain render, commit, and reconciliation without framework buzzwords.', type: 'reflect' },
    ],
    deliverable: {
      title: 'React rendering field guide',
      description: 'A practical guide to rerenders, keys, state identity, and effect timing with code examples.',
    },
    checkpoint: 'Can I explain why a React tree rerendered, where state lives, and how keys change identity?',
    topicId: 'react-internals',
  },
  {
    title: 'State Management',
    focusArea: 'Client state, server state, reducers, state boundaries, and data flow discipline.',
    goals: [
      'Choose state ownership intentionally instead of letting state scatter by accident.',
      'Use reducers and composition to keep multi-step interactions predictable.',
      'Differentiate ephemeral UI state from durable product state.',
    ],
    expectedOutcomes: [
      'You can defend why a piece of state belongs in a component, feature, or data layer.',
      'You can model complex interaction flows with reducers and selectors.',
    ],
    tasks: [
      { title: 'Audit a messy state tree', summary: 'Take a sample feature and map state by owner, lifetime, and update source.', type: 'learn' },
      { title: 'Build a reducer-based flow', summary: 'Model a multi-step interaction with explicit events and derived selectors.', type: 'build' },
      { title: 'Separate server and client state concerns', summary: 'Document which data should be cached, derived, or stored locally.', type: 'practice' },
      { title: 'Review lifting vs colocating state', summary: 'Write heuristics for where shared state should actually live.', type: 'learn' },
      { title: 'Refactor a prop-drilled example', summary: 'Improve a small tree by choosing better boundaries and shared context.', type: 'build' },
      { title: 'Write state-management notes', summary: 'Summarize anti-patterns like duplicated derived state and effect-driven syncing.', type: 'review' },
      { title: 'Explain your state choices', summary: 'Practice defending state boundaries like you would in a system design review.', type: 'reflect' },
    ],
    deliverable: {
      title: 'State boundary decision memo',
      description: 'A short write-up showing how you decide ownership, derivation, and reducers in a realistic feature.',
    },
    checkpoint: 'Can I justify where state belongs and when a reducer or shared context is actually the right tool?',
    topicId: 'state-management',
  },
  {
    title: 'Performance Optimization',
    focusArea: 'Profiling, render cost, bundle strategy, and eliminating avoidable work.',
    goals: [
      'Measure before optimizing and explain improvements with evidence.',
      'Connect runtime and bundle performance to user-perceived responsiveness.',
      'Use performance patterns intentionally instead of sprinkling memoization everywhere.',
    ],
    expectedOutcomes: [
      'You can identify whether a bottleneck is network, bundle, main-thread, or render related.',
      'You can pick the right optimization technique for the actual problem.',
    ],
    tasks: [
      { title: 'Profile a React interaction', summary: 'Use the profiler to identify one expensive render path and explain why it happens.', type: 'learn' },
      { title: 'Audit bundle size risks', summary: 'List lazy-loading opportunities and dependency costs in a sample app.', type: 'practice' },
      { title: 'Implement a measured optimization', summary: 'Reduce work in a demo feature and compare before-and-after observations.', type: 'build' },
      { title: 'Review browser scheduling tools', summary: 'Capture when to use debouncing, throttling, transitions, and idle work.', type: 'learn' },
      { title: 'Create a performance checklist', summary: 'Write a calm, repeatable checklist for debugging sluggish UIs.', type: 'build' },
      { title: 'Summarize performance trade-offs', summary: 'Document when memoization or virtualization is worth the complexity.', type: 'review' },
      { title: 'Explain performance decisions', summary: 'Practice defending an optimization with metrics and user impact.', type: 'reflect' },
    ],
    deliverable: {
      title: 'Performance audit report',
      description: 'A measured write-up with one bottleneck, the chosen fix, and the trade-offs behind it.',
    },
    checkpoint: 'Can I choose an optimization because the data points to it, not because it feels advanced?',
    topicId: 'performance',
  },
  {
    title: 'Forms, Validation, Accessibility',
    focusArea: 'Accessible form flows, validation UX, focus management, and inclusive interactions.',
    goals: [
      'Make form experiences robust for keyboard, screen reader, and low-friction usage.',
      'Treat validation as UX design rather than error dumping.',
      'Bake accessibility into daily implementation choices.',
    ],
    expectedOutcomes: [
      'You can ship a form that is accessible, understandable, and resilient.',
      'You can spot common a11y failures in interactive UI before QA does.',
    ],
    tasks: [
      { title: 'Review semantic form structure', summary: 'Audit labels, fieldsets, descriptions, and error associations.', type: 'learn' },
      { title: 'Prototype accessible validation states', summary: 'Build success, error, and helper text flows with proper announcements.', type: 'build' },
      { title: 'Test keyboard-only interactions', summary: 'Navigate a form without a mouse and record friction points.', type: 'practice' },
      { title: 'Explore focus management patterns', summary: 'Document when to move focus intentionally and when not to.', type: 'learn' },
      { title: 'Improve a complex form layout', summary: 'Refactor spacing, hierarchy, and error display for scanability.', type: 'build' },
      { title: 'Write an accessibility review checklist', summary: 'Capture the checks you want before shipping interactive forms.', type: 'review' },
      { title: 'Teach a11y decisions clearly', summary: 'Explain why the accessible version is also the more usable product version.', type: 'reflect' },
    ],
    deliverable: {
      title: 'Accessible form case study',
      description: 'A realistic form build that includes validation UX, keyboard support, and accessibility notes.',
    },
    checkpoint: 'Can I build a form that works well without a mouse and still feels calm and clear for all users?',
    topicId: 'forms-accessibility',
    milestone: 'Systems Thinking',
  },
  {
    title: 'Frontend Architecture',
    focusArea: 'Feature boundaries, dependency management, folder design, and maintainable product systems.',
    goals: [
      'Turn architecture into practical delivery speed rather than abstract diagrams.',
      'Define boundaries that help a team move without colliding constantly.',
      'Learn to trade off purity against pragmatism in a real codebase.',
    ],
    expectedOutcomes: [
      'You can explain why a folder or dependency boundary exists and how it helps the product.',
      'You can recognize when an abstraction is helping versus hiding accidental complexity.',
    ],
    tasks: [
      { title: 'Review modular frontend patterns', summary: 'Compare page, feature, entity, and shared layers with concrete examples.', type: 'learn' },
      { title: 'Map dependencies in a sample app', summary: 'Trace which modules should and should not know about each other.', type: 'practice' },
      { title: 'Design a feature slice plan', summary: 'Outline a scalable structure for a mid-sized product area.', type: 'build' },
      { title: 'Refactor a tangled module', summary: 'Simplify one example by clarifying ownership and extracting smaller seams.', type: 'build' },
      { title: 'Write architecture heuristics', summary: 'Document when to introduce a shared utility, hook, or entity model.', type: 'learn' },
      { title: 'Capture trade-off notes', summary: 'List the costs of over-abstraction and the costs of under-structure.', type: 'review' },
      { title: 'Explain architecture choices', summary: 'Practice explaining a folder and dependency plan to another engineer.', type: 'reflect' },
    ],
    deliverable: {
      title: 'Architecture decision brief',
      description: 'A short system design document describing feature boundaries, data flow, and shared abstractions.',
    },
    checkpoint: 'Can I shape a frontend codebase so multiple engineers can move quickly without tripping over each other?',
    topicId: 'architecture',
  },
  {
    title: 'Data Layer and Networking',
    focusArea: 'Requests, caching, retries, optimistic updates, and resilient API interaction.',
    goals: [
      'Treat networking as product architecture, not just fetch calls inside components.',
      'Design happy-path and failure-path behavior deliberately.',
      'Understand how data dependencies affect UI states and user trust.',
    ],
    expectedOutcomes: [
      'You can design loading, empty, success, and error states as one coherent flow.',
      'You can explain cacheability, retries, and invalidation in practical terms.',
    ],
    tasks: [
      { title: 'Review request lifecycle states', summary: 'Capture loading, stale, success, empty, and failure states for a feature.', type: 'learn' },
      { title: 'Design an API error strategy', summary: 'Write how retries, fallback copy, and escalation should work.', type: 'practice' },
      { title: 'Build a typed data fetch module', summary: 'Create a small wrapper that separates transport, parsing, and UI consumption.', type: 'build' },
      { title: 'Explore optimistic update trade-offs', summary: 'Document when optimistic UI helps and when it adds risk.', type: 'learn' },
      { title: 'Refine loading and retry UX', summary: 'Sketch a resilient UI flow around slow or partial network responses.', type: 'build' },
      { title: 'Write data-layer notes', summary: 'Summarize caching, invalidation, deduping, and failure visibility.', type: 'review' },
      { title: 'Explain the data flow', summary: 'Practice describing how UI state should react to request lifecycle changes.', type: 'reflect' },
    ],
    deliverable: {
      title: 'Networking strategy worksheet',
      description: 'A typed mini data layer plus a written strategy for failures, retries, and cache behavior.',
    },
    checkpoint: 'Can I design a data flow that feels resilient to users and remains maintainable for engineers?',
    topicId: 'data-layer',
  },
  {
    title: 'Testing and Reliability',
    focusArea: 'Business-logic tests, UI confidence, debugging, and preventing regressions intentionally.',
    goals: [
      'Use tests to protect behavior that matters rather than to satisfy a quota.',
      'Choose the right test level for selectors, components, and integration flows.',
      'Build a stronger debugging and reliability mindset around release quality.',
    ],
    expectedOutcomes: [
      'You can decide what deserves unit, integration, or render smoke coverage.',
      'You can write tests that stay readable as the product evolves.',
    ],
    tasks: [
      { title: 'Review the testing pyramid pragmatically', summary: 'Write where unit, integration, and smoke tests each add value.', type: 'learn' },
      { title: 'Test a reducer and selectors', summary: 'Write focused tests around state transitions and derived values.', type: 'build' },
      { title: 'Create a smoke render test', summary: 'Render a page and assert the core UI contract that users rely on.', type: 'build' },
      { title: 'Catalog failure-prone flows', summary: 'List the product behaviors that should never regress silently.', type: 'practice' },
      { title: 'Practice debugging a broken test', summary: 'Intentionally break logic and work back to the root cause.', type: 'practice' },
      { title: 'Write reliability notes', summary: 'Capture release checks, bug triage habits, and confidence rituals.', type: 'review' },
      { title: 'Explain your test strategy', summary: 'Practice defending why some logic gets tests and some does not.', type: 'reflect' },
    ],
    deliverable: {
      title: 'Reliability playbook',
      description: 'A focused test suite plus written guidance on what to protect and how to debug regressions.',
    },
    checkpoint: 'Can I build a lean test strategy that protects meaningful behavior without creating busywork?',
    topicId: 'testing',
  },
  {
    title: 'Final Production-Grade Project',
    focusArea: 'Scope, architecture, reliability, polish, and shipping a portfolio-ready product.',
    goals: [
      'Synthesize the previous 11 weeks into one serious frontend delivery.',
      'Practice senior-level execution across planning, implementation, QA, and iteration.',
      'Finish with something that reflects product thinking, not just code output.',
    ],
    expectedOutcomes: [
      'You can drive a feature from architecture through polish with deliberate trade-offs.',
      'You have a shipped artifact that demonstrates both craft and engineering judgment.',
    ],
    tasks: [
      { title: 'Define the project scope and success criteria', summary: 'Write a tight product brief with goals, constraints, and acceptance criteria.', type: 'learn' },
      { title: 'Design the architecture and delivery plan', summary: 'Outline routes, state, modules, data flow, and testing scope before coding.', type: 'build' },
      { title: 'Implement the highest-risk feature first', summary: 'Ship the most uncertain workflow early and adjust the plan based on it.', type: 'build' },
      { title: 'Run a performance and accessibility pass', summary: 'Audit the product for responsiveness, clarity, and inclusive interactions.', type: 'practice' },
      { title: 'Harden reliability and edge cases', summary: 'Close gaps around empty states, failures, and state recovery.', type: 'build' },
      { title: 'Prepare a retrospective and walkthrough', summary: 'Document what improved, what remained risky, and how you would iterate next.', type: 'review' },
      { title: 'Present the project like a senior engineer', summary: 'Practice explaining trade-offs, system design, and user impact clearly.', type: 'reflect' },
    ],
    deliverable: {
      title: 'Production-grade project ship',
      description: 'A polished, tested frontend project with architecture notes, thoughtful UX, and a clear retrospective.',
    },
    checkpoint: 'Can I ship a real product that shows depth across architecture, implementation, quality, and user experience?',
    topicId: 'final-project',
    milestone: 'Production Project',
  },
]

function buildTaskDetails(task: TaskBlueprint, focusArea: string): string {
  const typeGuidance: Record<TaskKind, string> = {
    learn: `Study it until you can restate the core idea, key edge cases, and why it matters for ${focusArea.toLowerCase()}.`,
    practice: 'Work through examples step by step and note where your reasoning breaks or slows down.',
    build: 'Create a runnable artifact, then capture the trade-offs, bugs, or implementation decisions you hit.',
    review: 'Turn the lesson into a checklist, comparison, or notes page that you can reuse later.',
    reflect: 'Explain the topic from memory, identify what still feels shaky, and decide what to revisit next.',
  }

  return `${task.summary} ${typeGuidance[task.type]}`
}

function createWeek(blueprint: WeekBlueprint, weekNumber: number): StudyWeek {
  const weekId = `week-${weekNumber}`
  const tasks: StudyTask[] = blueprint.tasks.map((task, taskIndex) => {
    const dayId = `${weekId}-day-${taskIndex + 1}`

    return {
      id: `${weekId}-task-${taskIndex + 1}`,
      weekId,
      dayId,
      title: task.title,
      summary: task.summary,
      details: buildTaskDetails(task, blueprint.focusArea),
      type: task.type,
      topicIds: [blueprint.topicId],
      status: 'not_started',
    }
  })

  return {
    id: weekId,
    weekNumber,
    title: blueprint.title,
    focusArea: blueprint.focusArea,
    goals: blueprint.goals,
    expectedOutcomes: blueprint.expectedOutcomes,
    days: tasks.map((task, index) => ({
      id: `${weekId}-day-${index + 1}`,
      weekId,
      dayIndex: index + 1,
      label: `Day ${index + 1}`,
      taskId: task.id,
    })),
    tasks,
    deliverable: {
      ...blueprint.deliverable,
      id: `${weekId}-deliverable`,
      weekId,
      dueDayIndex: 6,
    },
    checkpoint: blueprint.checkpoint,
    topicIds: [blueprint.topicId],
    milestone: blueprint.milestone,
  }
}

export const studyPlanSeed: StudyPlan = {
  id: 'frontend-senior-study-planner',
  title: 'Frontend Senior Study Planner',
  durationWeeks: weekBlueprints.length,
  weeks: weekBlueprints.map((week, index) => createWeek(week, index + 1)),
  topics,
  milestones,
}

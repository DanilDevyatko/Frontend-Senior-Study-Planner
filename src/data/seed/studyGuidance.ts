interface RoutineStep {
  title: string
  duration: string
  description: string
}

interface StudyGuidance {
  dailyRoutine: RoutineStep[]
  seniorSignals: string[]
  highImpactHabits: string[]
}

export const studyGuidance: StudyGuidance = {
  dailyRoutine: [
    {
      title: 'Learn the concept',
      duration: '1-2h',
      description: 'Study the core idea until you can explain the mental model, not just repeat definitions.',
    },
    {
      title: 'Implement it',
      duration: '2-3h',
      description: 'Build a small feature, exercise, or sandbox so the idea turns into working behavior.',
    },
    {
      title: 'Explain it',
      duration: '15-30m',
      description: 'Write or speak the concept back in plain language so gaps become obvious.',
    },
  ],
  seniorSignals: [
    'You can explain a topic clearly instead of only recognizing it.',
    'You can build the idea from scratch without depending on copy-paste.',
    'You can debug the behavior when the happy path breaks.',
    'You stay consistent enough that depth compounds week after week.',
  ],
  highImpactHabits: [
    "Read other engineers' code on GitHub.",
    'Do 2-3 frontend or system design mocks.',
    'Explain topics out loud. This is one of the highest-leverage habits in the plan.',
  ],
}

export type TaskStatus = 'not_started' | 'in_progress' | 'done' | 'blocked'

export type TaskKind = 'learn' | 'practice' | 'build' | 'review' | 'reflect'

export type TopicStatus = 'steady' | 'mastering' | 'at_risk'

export interface Milestone {
  weekNumber: number
  title: string
  summary: string
}

export interface StudyPlan {
  id: string
  title: string
  durationWeeks: number
  weeks: StudyWeek[]
  topics: Topic[]
  milestones: Milestone[]
}

export interface StudyWeek {
  id: string
  weekNumber: number
  title: string
  focusArea: string
  goals: string[]
  expectedOutcomes: string[]
  days: StudyDay[]
  tasks: StudyTask[]
  deliverable: Deliverable
  checkpoint: string
  topicIds: string[]
  milestone?: string
}

export interface StudyDay {
  id: string
  weekId: string
  dayIndex: number
  label: string
  taskId: string
}

export interface StudyTask {
  id: string
  weekId: string
  dayId: string
  title: string
  summary: string
  details: string
  type: TaskKind
  topicIds: string[]
  status: TaskStatus
}

export interface Deliverable {
  id: string
  weekId: string
  title: string
  description: string
  dueDayIndex: number
}

export interface Topic {
  id: string
  name: string
  description: string
  weekIds: string[]
}

export interface Reflection {
  weekId: string
  learned: string
  difficult: string
  explainScore: number
  buildScore: number
  debugScore: number
  notes: string
  updatedAt: string
}

export interface TaskProgress {
  status: TaskStatus
  updatedAt: string
  completedAt?: string
}

export interface PlannerSnapshot {
  storageVersion: number
  planStartDate: string
  taskProgressById: Record<string, TaskProgress>
  reflectionsByWeekId: Record<string, Reflection>
  manualWeakTopicIds: string[]
  lastActiveDate?: string
}

export interface ProgressStats {
  currentWeekNumber: number
  currentWeekCompletionRate: number
  overallCompletionRate: number
  completedTasks: number
  totalTasks: number
  blockedTasks: number
  overdueTasks: number
  streak: number
}

export interface TopicHealth {
  topicId: string
  name: string
  completionRate: number
  confidenceScore: number | null
  blockedCount: number
  overdueCount: number
  isWeak: boolean
  isManualWeak: boolean
  status: TopicStatus
  relatedWeeks: number[]
}

export interface ReviewRecommendation {
  id: string
  kind: 'overdue_task' | 'blocked_topic' | 'low_confidence'
  title: string
  description: string
  score: number
  topicId?: string
  taskId?: string
  weekId?: string
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  done: 'Done',
  blocked: 'Blocked',
}

export const TASK_STATUS_OPTIONS: TaskStatus[] = [
  'not_started',
  'in_progress',
  'done',
  'blocked',
]

export function createEmptyReflection(weekId: string, updatedAt: string): Reflection {
  return {
    weekId,
    learned: '',
    difficult: '',
    explainScore: 3,
    buildScore: 3,
    debugScore: 3,
    notes: '',
    updatedAt,
  }
}

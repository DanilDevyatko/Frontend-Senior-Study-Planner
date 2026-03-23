import { createEmptyReflection, type PlannerSnapshot, type Reflection, type TaskProgress, type TaskStatus } from '../types/planner'
import { getTodayDate } from '../utils/date'

export const STORAGE_KEY = 'frontend-senior-study-planner/v1'
export const STORAGE_VERSION = 1

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === 'not_started' || value === 'in_progress' || value === 'done' || value === 'blocked'
}

function sanitizeTaskProgressMap(input: unknown): Record<string, TaskProgress> {
  if (!input || typeof input !== 'object') {
    return {}
  }

  return Object.entries(input).reduce<Record<string, TaskProgress>>((accumulator, [taskId, value]) => {
    if (!value || typeof value !== 'object') {
      return accumulator
    }

    const status = 'status' in value ? value.status : undefined
    const updatedAt = 'updatedAt' in value && typeof value.updatedAt === 'string' ? value.updatedAt : getTodayDate()
    const completedAt = 'completedAt' in value && typeof value.completedAt === 'string' ? value.completedAt : undefined

    if (!isTaskStatus(status)) {
      return accumulator
    }

    accumulator[taskId] = {
      status,
      updatedAt,
      completedAt: status === 'done' ? completedAt ?? updatedAt : undefined,
    }

    return accumulator
  }, {})
}

function sanitizeReflection(input: unknown, weekId: string): Reflection {
  if (!input || typeof input !== 'object') {
    return createEmptyReflection(weekId, getTodayDate())
  }

  const reflection = input as Partial<Reflection>
  return {
    weekId,
    learned: typeof reflection.learned === 'string' ? reflection.learned : '',
    difficult: typeof reflection.difficult === 'string' ? reflection.difficult : '',
    explainScore: typeof reflection.explainScore === 'number' ? Math.min(5, Math.max(1, reflection.explainScore)) : 3,
    buildScore: typeof reflection.buildScore === 'number' ? Math.min(5, Math.max(1, reflection.buildScore)) : 3,
    debugScore: typeof reflection.debugScore === 'number' ? Math.min(5, Math.max(1, reflection.debugScore)) : 3,
    notes: typeof reflection.notes === 'string' ? reflection.notes : '',
    updatedAt: typeof reflection.updatedAt === 'string' ? reflection.updatedAt : getTodayDate(),
  }
}

function sanitizeReflectionMap(input: unknown): Record<string, Reflection> {
  if (!input || typeof input !== 'object') {
    return {}
  }

  return Object.entries(input).reduce<Record<string, Reflection>>((accumulator, [weekId, value]) => {
    accumulator[weekId] = sanitizeReflection(value, weekId)
    return accumulator
  }, {})
}

export function createEmptySnapshot(planStartDate = getTodayDate()): PlannerSnapshot {
  return {
    storageVersion: STORAGE_VERSION,
    planStartDate,
    taskProgressById: {},
    reflectionsByWeekId: {},
    manualWeakTopicIds: [],
    lastActiveDate: undefined,
  }
}

export function migratePlannerSnapshot(input: unknown): PlannerSnapshot | null {
  if (!input || typeof input !== 'object') {
    return null
  }

  const candidate = input as Partial<PlannerSnapshot>
  const planStartDate =
    typeof candidate.planStartDate === 'string' ? candidate.planStartDate : getTodayDate()

  return {
    storageVersion: STORAGE_VERSION,
    planStartDate,
    taskProgressById: sanitizeTaskProgressMap(candidate.taskProgressById),
    reflectionsByWeekId: sanitizeReflectionMap(candidate.reflectionsByWeekId),
    manualWeakTopicIds: Array.isArray(candidate.manualWeakTopicIds)
      ? candidate.manualWeakTopicIds.filter((topicId): topicId is string => typeof topicId === 'string')
      : [],
    lastActiveDate: typeof candidate.lastActiveDate === 'string' ? candidate.lastActiveDate : undefined,
  }
}

export function loadPlannerSnapshot(): PlannerSnapshot {
  if (typeof window === 'undefined') {
    return createEmptySnapshot()
  }

  try {
    const rawSnapshot = window.localStorage.getItem(STORAGE_KEY)
    if (!rawSnapshot) {
      return createEmptySnapshot()
    }

    const parsedSnapshot: unknown = JSON.parse(rawSnapshot)
    return migratePlannerSnapshot(parsedSnapshot) ?? createEmptySnapshot()
  } catch {
    return createEmptySnapshot()
  }
}

export function savePlannerSnapshot(snapshot: PlannerSnapshot): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...snapshot,
      storageVersion: STORAGE_VERSION,
    }),
  )
}

export function resetStoredPlannerSnapshot(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

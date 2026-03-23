import { createEmptyReflection, type PlannerSnapshot, type Reflection, type TaskStatus } from '../../types/planner'
import { createEmptySnapshot } from '../../storage/plannerStorage'
import { getTodayDate } from '../../utils/date'

export type PlannerAction =
  | { type: 'hydrateSnapshot'; payload: PlannerSnapshot }
  | { type: 'setPlanStartDate'; payload: string }
  | { type: 'setTaskStatus'; payload: { taskId: string; status: TaskStatus } }
  | { type: 'saveReflection'; payload: Omit<Reflection, 'updatedAt'> }
  | { type: 'toggleWeakTopic'; payload: string }
  | { type: 'resetPlanner'; payload?: string }

function withTouchedDate(snapshot: PlannerSnapshot): PlannerSnapshot {
  return {
    ...snapshot,
    lastActiveDate: getTodayDate(),
  }
}

export function plannerReducer(state: PlannerSnapshot, action: PlannerAction): PlannerSnapshot {
  switch (action.type) {
    case 'hydrateSnapshot':
      return action.payload

    case 'setPlanStartDate':
      return withTouchedDate({
        ...state,
        planStartDate: action.payload,
      })

    case 'setTaskStatus': {
      const today = getTodayDate()
      const existingTaskProgress = state.taskProgressById[action.payload.taskId]

      return withTouchedDate({
        ...state,
        taskProgressById: {
          ...state.taskProgressById,
          [action.payload.taskId]: {
            status: action.payload.status,
            updatedAt: today,
            completedAt:
              action.payload.status === 'done'
                ? existingTaskProgress?.completedAt ?? today
                : undefined,
          },
        },
      })
    }

    case 'saveReflection': {
      const today = getTodayDate()
      const existingReflection =
        state.reflectionsByWeekId[action.payload.weekId] ??
        createEmptyReflection(action.payload.weekId, today)

      return withTouchedDate({
        ...state,
        reflectionsByWeekId: {
          ...state.reflectionsByWeekId,
          [action.payload.weekId]: {
            ...existingReflection,
            ...action.payload,
            updatedAt: today,
          },
        },
      })
    }

    case 'toggleWeakTopic': {
      const alreadyWeak = state.manualWeakTopicIds.includes(action.payload)
      return withTouchedDate({
        ...state,
        manualWeakTopicIds: alreadyWeak
          ? state.manualWeakTopicIds.filter((topicId) => topicId !== action.payload)
          : [...state.manualWeakTopicIds, action.payload],
      })
    }

    case 'resetPlanner':
      return createEmptySnapshot(action.payload ?? getTodayDate())

    default:
      return state
  }
}

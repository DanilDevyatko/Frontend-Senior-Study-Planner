import { createContext, type Dispatch } from 'react'
import type { PlannerSnapshot, Reflection, StudyPlan, TaskStatus } from '../../types/planner'
import type { PlannerAction } from './plannerReducer'
import type { PlannerViewModel } from './plannerSelectors'
import type { SyncStatus } from '../../storage/plannerRepository'

export interface PlannerContextValue {
  plan: StudyPlan
  snapshot: PlannerSnapshot
  viewModel: PlannerViewModel
  syncStatus: SyncStatus
  syncError?: string
  lastSyncedAt?: string
  dispatch: Dispatch<PlannerAction>
  actions: {
    setPlanStartDate: (date: string) => void
    setTaskStatus: (taskId: string, status: TaskStatus) => void
    saveTaskNote: (taskId: string, content: string) => void
    saveReflection: (reflection: Omit<Reflection, 'updatedAt'>) => void
    toggleWeakTopic: (topicId: string) => void
    resetPlanner: () => void
  }
}

export const PlannerContext = createContext<PlannerContextValue | null>(null)

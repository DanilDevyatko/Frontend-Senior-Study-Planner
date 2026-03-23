import { type PropsWithChildren, useEffect, useReducer } from 'react'
import { studyPlanSeed } from '../../data/seed/studyPlan'
import { plannerReducer } from './plannerReducer'
import { buildPlannerViewModel } from './plannerSelectors'
import { loadPlannerSnapshot, savePlannerSnapshot } from '../../storage/plannerStorage'
import { getTodayDate } from '../../utils/date'
import { PlannerContext } from './PlannerContext'

export function PlannerProvider({ children }: PropsWithChildren) {
  const [snapshot, dispatch] = useReducer(plannerReducer, undefined, loadPlannerSnapshot)
  const today = getTodayDate()
  const viewModel = buildPlannerViewModel(studyPlanSeed, snapshot, today)

  useEffect(() => {
    savePlannerSnapshot(snapshot)
  }, [snapshot])

  return (
    <PlannerContext.Provider
      value={{
        plan: studyPlanSeed,
        snapshot,
        viewModel,
        dispatch,
        actions: {
          setPlanStartDate: (date) => dispatch({ type: 'setPlanStartDate', payload: date }),
          setTaskStatus: (taskId, status) =>
            dispatch({ type: 'setTaskStatus', payload: { taskId, status } }),
          saveReflection: (reflection) => dispatch({ type: 'saveReflection', payload: reflection }),
          toggleWeakTopic: (topicId) => dispatch({ type: 'toggleWeakTopic', payload: topicId }),
          resetPlanner: () => dispatch({ type: 'resetPlanner', payload: today }),
        },
      }}
    >
      {children}
    </PlannerContext.Provider>
  )
}

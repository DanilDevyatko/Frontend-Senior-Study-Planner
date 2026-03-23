import { describe, expect, it } from 'vitest'
import { createEmptySnapshot } from '../../storage/plannerStorage'
import { plannerReducer } from './plannerReducer'

describe('plannerReducer', () => {
  it('stores completedAt when a task is marked done and clears it when status changes away from done', () => {
    const initialState = createEmptySnapshot('2026-01-05')
    const doneState = plannerReducer(initialState, {
      type: 'setTaskStatus',
      payload: { taskId: 'week-1-task-1', status: 'done' },
    })

    expect(doneState.taskProgressById['week-1-task-1']?.status).toBe('done')
    expect(doneState.taskProgressById['week-1-task-1']?.completedAt).toBeDefined()

    const blockedState = plannerReducer(doneState, {
      type: 'setTaskStatus',
      payload: { taskId: 'week-1-task-1', status: 'blocked' },
    })

    expect(blockedState.taskProgressById['week-1-task-1']?.status).toBe('blocked')
    expect(blockedState.taskProgressById['week-1-task-1']?.completedAt).toBeUndefined()
  })

  it('saves and clears task notes per task', () => {
    const initialState = createEmptySnapshot('2026-01-05')
    const withNote = plannerReducer(initialState, {
      type: 'saveTaskNote',
      payload: { taskId: 'week-1-task-3', content: 'Need one more pass on stale closure examples.' },
    })

    expect(withNote.taskNotesById['week-1-task-3']?.content).toContain('stale closure examples')

    const clearedNote = plannerReducer(withNote, {
      type: 'saveTaskNote',
      payload: { taskId: 'week-1-task-3', content: '   ' },
    })

    expect(clearedNote.taskNotesById['week-1-task-3']).toBeUndefined()
  })

  it('saves reflections, toggles weak topics, and resets cleanly', () => {
    const initialState = createEmptySnapshot('2026-01-05')
    const withReflection = plannerReducer(initialState, {
      type: 'saveReflection',
      payload: {
        weekId: 'week-4',
        learned: 'Mapped unions for UI states',
        difficult: 'Type inference around generic helpers',
        explainScore: 4,
        buildScore: 3,
        debugScore: 4,
        notes: 'Need one more pass on distributive conditional types.',
      },
    })

    expect(withReflection.reflectionsByWeekId['week-4']?.learned).toContain('Mapped unions')

    const withWeakTopic = plannerReducer(withReflection, {
      type: 'toggleWeakTopic',
      payload: 'typescript',
    })

    expect(withWeakTopic.manualWeakTopicIds).toContain('typescript')

    const resetState = plannerReducer(withWeakTopic, {
      type: 'resetPlanner',
      payload: '2026-03-23',
    })

    expect(resetState.planStartDate).toBe('2026-03-23')
    expect(resetState.taskProgressById).toEqual({})
    expect(resetState.taskNotesById).toEqual({})
    expect(resetState.reflectionsByWeekId).toEqual({})
    expect(resetState.manualWeakTopicIds).toEqual([])
  })
})

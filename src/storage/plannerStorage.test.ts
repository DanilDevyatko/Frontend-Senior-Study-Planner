import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  STORAGE_KEY,
  createEmptySnapshot,
  loadPlannerSnapshot,
  migratePlannerSnapshot,
  resetStoredPlannerSnapshot,
  savePlannerSnapshot,
} from './plannerStorage'

describe('plannerStorage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-23T10:00:00'))
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns an empty snapshot when storage is empty', () => {
    const snapshot = loadPlannerSnapshot()
    expect(snapshot.planStartDate).toBe('2026-03-23')
    expect(snapshot.taskProgressById).toEqual({})
  })

  it('saves and reloads a valid snapshot', () => {
    const snapshot = createEmptySnapshot('2026-01-05')
    snapshot.manualWeakTopicIds = ['typescript']
    snapshot.taskProgressById['week-1-task-1'] = {
      status: 'done',
      updatedAt: '2026-01-05',
      completedAt: '2026-01-05',
    }

    savePlannerSnapshot(snapshot)

    const loaded = loadPlannerSnapshot()
    expect(loaded.planStartDate).toBe('2026-01-05')
    expect(loaded.manualWeakTopicIds).toEqual(['typescript'])
    expect(loaded.taskProgressById['week-1-task-1']?.status).toBe('done')
  })

  it('falls back safely when the stored payload is corrupted', () => {
    window.localStorage.setItem(STORAGE_KEY, '{bad json')
    const snapshot = loadPlannerSnapshot()

    expect(snapshot.planStartDate).toBe('2026-03-23')
    expect(snapshot.manualWeakTopicIds).toEqual([])
  })

  it('migrates loose data and clears storage on reset', () => {
    const migrated = migratePlannerSnapshot({
      storageVersion: 0,
      planStartDate: '2026-02-01',
      taskProgressById: {
        'week-1-task-2': { status: 'done', updatedAt: '2026-02-03' },
      },
      reflectionsByWeekId: {
        'week-2': { learned: 'Promises', difficult: 'Queues', explainScore: 4, buildScore: 4, debugScore: 3 },
      },
      manualWeakTopicIds: ['async-event-loop'],
    })

    expect(migrated?.taskProgressById['week-1-task-2']?.completedAt).toBe('2026-02-03')
    expect(migrated?.reflectionsByWeekId['week-2']?.learned).toBe('Promises')

    savePlannerSnapshot(createEmptySnapshot('2026-02-01'))
    resetStoredPlannerSnapshot()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})

import { describe, expect, it } from 'vitest'
import { studyPlanSeed } from '../../data/seed/studyPlan'
import { createEmptySnapshot } from '../../storage/plannerStorage'
import { buildPlannerViewModel } from './plannerSelectors'

describe('buildPlannerViewModel', () => {
  it('calculates current week, today task, and streak from the real plan start date', () => {
    const snapshot = createEmptySnapshot('2026-01-05')
    snapshot.taskProgressById['week-1-task-1'] = {
      status: 'done',
      updatedAt: '2026-01-05',
      completedAt: '2026-01-05',
    }
    snapshot.taskProgressById['week-1-task-2'] = {
      status: 'done',
      updatedAt: '2026-01-06',
      completedAt: '2026-01-06',
    }
    snapshot.taskProgressById['week-1-task-3'] = {
      status: 'done',
      updatedAt: '2026-01-07',
      completedAt: '2026-01-07',
    }

    const viewModel = buildPlannerViewModel(studyPlanSeed, snapshot, '2026-01-08')

    expect(viewModel.progress.currentWeekNumber).toBe(1)
    expect(viewModel.currentDayIndex).toBe(4)
    expect(viewModel.todayTask?.id).toBe('week-1-task-4')
    expect(viewModel.progress.streak).toBe(3)
  })

  it('calculates weekly and total completion percentages', () => {
    const snapshot = createEmptySnapshot('2026-01-05')
    snapshot.taskProgressById['week-1-task-1'] = {
      status: 'done',
      updatedAt: '2026-01-05',
      completedAt: '2026-01-05',
    }
    snapshot.taskProgressById['week-1-task-2'] = {
      status: 'done',
      updatedAt: '2026-01-06',
      completedAt: '2026-01-06',
    }
    snapshot.taskProgressById['week-2-task-1'] = {
      status: 'done',
      updatedAt: '2026-01-12',
      completedAt: '2026-01-12',
    }

    const viewModel = buildPlannerViewModel(studyPlanSeed, snapshot, '2026-01-13')

    expect(viewModel.progress.currentWeekNumber).toBe(2)
    expect(viewModel.progress.currentWeekCompletionRate).toBe(14)
    expect(viewModel.progress.overallCompletionRate).toBe(4)
    expect(viewModel.upcomingDeliverable?.weekId).toBe('week-2')
  })

  it('detects weak topics and produces review recommendations from blocked, overdue, and low-confidence work', () => {
    const snapshot = createEmptySnapshot('2026-01-05')
    snapshot.taskProgressById['week-2-task-1'] = {
      status: 'blocked',
      updatedAt: '2026-01-12',
    }
    snapshot.reflectionsByWeekId['week-4'] = {
      weekId: 'week-4',
      learned: 'Advanced mapped types',
      difficult: 'Conditional type distribution',
      explainScore: 2,
      buildScore: 2,
      debugScore: 2,
      notes: 'Need revision on inference-heavy APIs.',
      updatedAt: '2026-01-26',
    }

    const viewModel = buildPlannerViewModel(studyPlanSeed, snapshot, '2026-01-26')

    expect(viewModel.weakTopics.map((topic) => topic.topicId)).toEqual(
      expect.arrayContaining(['async-event-loop', 'typescript']),
    )
    expect(viewModel.overdueTasks.length).toBeGreaterThan(0)
    expect(viewModel.reviewRecommendations.some((item) => item.kind === 'blocked_topic')).toBe(true)
    expect(viewModel.reviewRecommendations.some((item) => item.kind === 'low_confidence')).toBe(true)
  })
})

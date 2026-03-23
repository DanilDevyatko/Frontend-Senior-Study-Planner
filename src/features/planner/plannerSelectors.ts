import type {
  PlannerSnapshot,
  ProgressStats,
  ReviewRecommendation,
  StudyPlan,
  StudyTask,
  StudyWeek,
  TaskProgress,
  TopicHealth,
} from '../../types/planner'
import { addDays, clamp, compareDateStrings, differenceInDays } from '../../utils/date'

export interface ResolvedTask extends StudyTask {
  scheduledDate: string
  isOverdue: boolean
  progress: TaskProgress
}

export interface ResolvedDay {
  id: string
  label: string
  dayIndex: number
  scheduledDate: string
  task: ResolvedTask
}

export interface ResolvedWeek extends Omit<StudyWeek, 'days' | 'tasks'> {
  days: ResolvedDay[]
  tasks: ResolvedTask[]
  startDate: string
  endDate: string
  deliverableDueDate: string
  completedTasks: number
  totalTasks: number
  completionRate: number
  isCurrent: boolean
  isComplete: boolean
}

export interface UpcomingDeliverable {
  weekId: string
  weekTitle: string
  title: string
  dueDate: string
  completionRate: number
}

export interface PlannerViewModel {
  weeks: ResolvedWeek[]
  currentWeek: ResolvedWeek
  currentDayIndex: number
  todayTask?: ResolvedTask
  planStarted: boolean
  progress: ProgressStats
  topicHealth: TopicHealth[]
  weakTopics: TopicHealth[]
  blockedTasks: ResolvedTask[]
  overdueTasks: ResolvedTask[]
  reviewRecommendations: ReviewRecommendation[]
  upcomingDeliverable?: UpcomingDeliverable
  nextMilestone?: ResolvedWeek
}

function toTaskProgress(task: StudyTask, snapshot: PlannerSnapshot): TaskProgress {
  return (
    snapshot.taskProgressById[task.id] ?? {
      status: task.status,
      updatedAt: snapshot.planStartDate,
      completedAt: task.status === 'done' ? snapshot.planStartDate : undefined,
    }
  )
}

function buildResolvedWeeks(plan: StudyPlan, snapshot: PlannerSnapshot, today: string): ResolvedWeek[] {
  const dayOffset = differenceInDays(snapshot.planStartDate, today)
  const currentWeekNumber =
    dayOffset < 0 ? 1 : clamp(Math.floor(dayOffset / 7) + 1, 1, plan.durationWeeks)

  return plan.weeks.map((week) => {
    const startDate = addDays(snapshot.planStartDate, (week.weekNumber - 1) * 7)
    const endDate = addDays(startDate, 6)

    const tasksByDayId = new Map(
      week.tasks.map((task) => {
        const progress = toTaskProgress(task, snapshot)
        const scheduledDate = addDays(startDate, week.days.findIndex((day) => day.id === task.dayId))

        return [
          task.dayId,
          {
            ...task,
            status: progress.status,
            scheduledDate,
            isOverdue: compareDateStrings(scheduledDate, today) < 0 && progress.status !== 'done',
            progress,
          } satisfies ResolvedTask,
        ]
      }),
    )

    const days = week.days.map((day) => {
      const task = tasksByDayId.get(day.id)
      if (!task) {
        throw new Error(`Missing task for ${day.id}`)
      }

      return {
        id: day.id,
        label: day.label,
        dayIndex: day.dayIndex,
        scheduledDate: task.scheduledDate,
        task,
      }
    })

    const tasks = days.map((day) => day.task)
    const completedTasks = tasks.filter((task) => task.status === 'done').length
    const totalTasks = tasks.length
    const completionRate = Math.round((completedTasks / totalTasks) * 100)

    return {
      ...week,
      days,
      tasks,
      startDate,
      endDate,
      deliverableDueDate: addDays(startDate, week.deliverable.dueDayIndex - 1),
      completedTasks,
      totalTasks,
      completionRate,
      isCurrent: week.weekNumber === currentWeekNumber,
      isComplete: completedTasks === totalTasks,
    }
  })
}

function calculateStreak(weeks: ResolvedWeek[], today: string): number {
  const resolvedDays = weeks.flatMap((week) => week.days)
  if (resolvedDays.length === 0) {
    return 0
  }

  const anchorDate = resolvedDays.some((day) => day.scheduledDate === today && day.task.status === 'done')
    ? today
    : addDays(today, -1)

  const anchorIndex = resolvedDays.findIndex((day) => day.scheduledDate === anchorDate)
  if (anchorIndex === -1) {
    return 0
  }

  let streak = 0
  for (let dayIndex = anchorIndex; dayIndex >= 0; dayIndex -= 1) {
    if (resolvedDays[dayIndex]?.task.status !== 'done') {
      break
    }

    streak += 1
  }

  return streak
}

function buildTopicHealth(plan: StudyPlan, weeks: ResolvedWeek[], snapshot: PlannerSnapshot): TopicHealth[] {
  return plan.topics.map((topic) => {
    const relatedWeeks = weeks.filter((week) => week.topicIds.includes(topic.id))
    const relatedTasks = relatedWeeks.flatMap((week) => week.tasks)
    const completedTasks = relatedTasks.filter((task) => task.status === 'done').length
    const blockedCount = relatedTasks.filter((task) => task.status === 'blocked').length
    const overdueCount = relatedTasks.filter((task) => task.isOverdue).length
    const completionRate =
      relatedTasks.length > 0 ? Math.round((completedTasks / relatedTasks.length) * 100) : 0
    const reflections = relatedWeeks
      .map((week) => snapshot.reflectionsByWeekId[week.id])
      .filter((reflection): reflection is NonNullable<typeof reflection> => Boolean(reflection))

    const confidenceScore =
      reflections.length > 0
        ? Math.round(
            reflections.reduce((total, reflection) => {
              return total + ((reflection.explainScore + reflection.buildScore + reflection.debugScore) / 3) * 20
            }, 0) / reflections.length,
          )
        : null

    const isManualWeak = snapshot.manualWeakTopicIds.includes(topic.id)
    const isWeak =
      isManualWeak ||
      blockedCount >= 1 ||
      overdueCount >= 2 ||
      (confidenceScore !== null && confidenceScore < 60)

    let status: TopicHealth['status'] = 'steady'

    if (isWeak) {
      status = 'at_risk'
    } else if (completionRate >= 85 && (confidenceScore === null || confidenceScore >= 75)) {
      status = 'mastering'
    }

    return {
      topicId: topic.id,
      name: topic.name,
      completionRate,
      confidenceScore,
      blockedCount,
      overdueCount,
      isWeak,
      isManualWeak,
      status,
      relatedWeeks: relatedWeeks.map((week) => week.weekNumber),
    }
  })
}

function buildReviewRecommendations(
  weeks: ResolvedWeek[],
  topicHealth: TopicHealth[],
  today: string,
): ReviewRecommendation[] {
  const overdueTaskRecommendations = weeks.flatMap((week) =>
    week.tasks
      .filter((task) => task.isOverdue)
      .map<ReviewRecommendation>((task) => ({
        id: `overdue-${task.id}`,
        kind: 'overdue_task',
        title: `Catch up on ${task.title}`,
        description: `Week ${week.weekNumber}: ${week.title}. This task is overdue and needs a clean pass.`,
        score: 60 + Math.min(20, Math.max(1, differenceInDays(task.scheduledDate, today))),
        taskId: task.id,
        weekId: week.id,
      })),
  )

  const blockedTopicRecommendations = topicHealth
    .filter((topic) => topic.blockedCount > 0)
    .map<ReviewRecommendation>((topic) => ({
      id: `blocked-${topic.topicId}`,
      kind: 'blocked_topic',
      title: `Unblock ${topic.name}`,
      description: `${topic.blockedCount} blocked task${topic.blockedCount > 1 ? 's are' : ' is'} slowing this topic down.`,
      score: 95 + topic.blockedCount * 5,
      topicId: topic.topicId,
    }))

  const lowConfidenceRecommendations = topicHealth
    .filter((topic) => topic.confidenceScore !== null && topic.confidenceScore < 65)
    .map<ReviewRecommendation>((topic) => ({
      id: `confidence-${topic.topicId}`,
      kind: 'low_confidence',
      title: `Reinforce ${topic.name}`,
      description: `Reflection confidence is ${topic.confidenceScore}%. Schedule a revision pass before moving too far ahead.`,
      score: 85 + Math.round((65 - (topic.confidenceScore ?? 65)) / 2),
      topicId: topic.topicId,
    }))

  return [...blockedTopicRecommendations, ...overdueTaskRecommendations, ...lowConfidenceRecommendations]
    .sort((left, right) => right.score - left.score)
    .slice(0, 12)
}

function getUpcomingDeliverable(weeks: ResolvedWeek[], today: string): UpcomingDeliverable | undefined {
  const nextWeek =
    weeks.find(
      (week) => compareDateStrings(today, week.deliverableDueDate) <= 0 && !week.isComplete,
    ) ?? weeks.find((week) => !week.isComplete)

  if (!nextWeek) {
    return undefined
  }

  return {
    weekId: nextWeek.id,
    weekTitle: nextWeek.title,
    title: nextWeek.deliverable.title,
    dueDate: nextWeek.deliverableDueDate,
    completionRate: nextWeek.completionRate,
  }
}

export function buildPlannerViewModel(
  plan: StudyPlan,
  snapshot: PlannerSnapshot,
  today: string,
): PlannerViewModel {
  const weeks = buildResolvedWeeks(plan, snapshot, today)
  const dayOffset = differenceInDays(snapshot.planStartDate, today)
  const currentWeekNumber =
    dayOffset < 0 ? 1 : clamp(Math.floor(dayOffset / 7) + 1, 1, plan.durationWeeks)
  const currentDayIndex = dayOffset < 0 ? 1 : clamp((dayOffset % 7) + 1, 1, 7)

  const currentWeek = weeks.find((week) => week.weekNumber === currentWeekNumber) ?? weeks[0]
  const todayTask = currentWeek?.tasks[currentDayIndex - 1]
  const blockedTasks = weeks.flatMap((week) => week.tasks.filter((task) => task.status === 'blocked'))
  const overdueTasks = weeks.flatMap((week) => week.tasks.filter((task) => task.isOverdue))
  const completedTasks = weeks.reduce((total, week) => total + week.completedTasks, 0)
  const totalTasks = weeks.reduce((total, week) => total + week.totalTasks, 0)
  const topicHealth = buildTopicHealth(plan, weeks, snapshot)
  const weakTopics = topicHealth.filter((topic) => topic.isWeak)

  const progress: ProgressStats = {
    currentWeekNumber,
    currentWeekCompletionRate: currentWeek.completionRate,
    overallCompletionRate: Math.round((completedTasks / totalTasks) * 100),
    completedTasks,
    totalTasks,
    blockedTasks: blockedTasks.length,
    overdueTasks: overdueTasks.length,
    streak: calculateStreak(weeks, today),
  }

  return {
    weeks,
    currentWeek,
    currentDayIndex,
    todayTask,
    planStarted: compareDateStrings(snapshot.planStartDate, today) <= 0,
    progress,
    topicHealth,
    weakTopics,
    blockedTasks,
    overdueTasks,
    reviewRecommendations: buildReviewRecommendations(weeks, topicHealth, today),
    upcomingDeliverable: getUpcomingDeliverable(weeks, today),
    nextMilestone: weeks.find((week) => Boolean(week.milestone) && !week.isComplete),
  }
}

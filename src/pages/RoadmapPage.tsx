import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState, PageCard, ProgressBar, TaskStatusSelect, TonePill } from '../components/ui'
import { StudyGuidanceCard } from '../components/StudyGuidanceCard'
import { usePlanner } from '../features/planner/usePlanner'
import { createEmptyReflection, type Reflection, type TaskStatus } from '../types/planner'
import { formatLongDate, formatWeekRange } from '../utils/date'
import styles from './pages.module.css'

interface ReflectionDraft {
  learned: string
  difficult: string
  explainScore: number
  buildScore: number
  debugScore: number
  notes: string
}

function WeekReflectionForm({
  weekId,
  reflection,
  onSave,
}: {
  weekId: string
  reflection: Reflection
  onSave: (payload: Omit<Reflection, 'updatedAt'>) => void
}) {
  const [draft, setDraft] = useState<ReflectionDraft>({
    learned: reflection.learned,
    difficult: reflection.difficult,
    explainScore: reflection.explainScore,
    buildScore: reflection.buildScore,
    debugScore: reflection.debugScore,
    notes: reflection.notes,
  })

  useEffect(() => {
    setDraft({
      learned: reflection.learned,
      difficult: reflection.difficult,
      explainScore: reflection.explainScore,
      buildScore: reflection.buildScore,
      debugScore: reflection.debugScore,
      notes: reflection.notes,
    })
  }, [reflection])

  return (
    <form
      className={styles.formGrid}
      onSubmit={(event) => {
        event.preventDefault()
        onSave({
          weekId,
          ...draft,
        })
      }}
    >
      <div className={styles.field}>
        <label htmlFor={`${weekId}-learned`}>What did I learn?</label>
        <textarea
          id={`${weekId}-learned`}
          className={styles.textarea}
          value={draft.learned}
          onChange={(event) => setDraft((current) => ({ ...current, learned: event.target.value }))}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={`${weekId}-difficult`}>What was difficult?</label>
        <textarea
          id={`${weekId}-difficult`}
          className={styles.textarea}
          value={draft.difficult}
          onChange={(event) => setDraft((current) => ({ ...current, difficult: event.target.value }))}
        />
      </div>
      <div className={styles.scoreGrid}>
        {[
          { key: 'explainScore', label: 'Explain clearly' },
          { key: 'buildScore', label: 'Build from scratch' },
          { key: 'debugScore', label: 'Debug confidently' },
        ].map((item) => (
          <div key={item.key} className={styles.scoreField}>
            <label htmlFor={`${weekId}-${item.key}`}>{item.label}</label>
            <input
              id={`${weekId}-${item.key}`}
              className={styles.input}
              type="range"
              min="1"
              max="5"
              step="1"
              value={draft[item.key as keyof ReflectionDraft] as number}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  [item.key]: Number(event.target.value),
                }))
              }
            />
            <p className={styles.helperText}>{draft[item.key as keyof ReflectionDraft]} / 5</p>
          </div>
        ))}
      </div>
      <div className={styles.field}>
        <label htmlFor={`${weekId}-notes`}>Notes</label>
        <textarea
          id={`${weekId}-notes`}
          className={styles.textarea}
          value={draft.notes}
          onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
        />
      </div>
      <div className={styles.buttonRow}>
        <button className={styles.primaryButton} type="submit">
          Save reflection
        </button>
      </div>
    </form>
  )
}

export function RoadmapPage() {
  const { weekId } = useParams()
  const { snapshot, viewModel, actions } = usePlanner()
  const selectedWeek = weekId ? viewModel.weeks.find((week) => week.id === weekId) : undefined
  const selectedTopic = selectedWeek
    ? viewModel.topicHealth.find((topic) => topic.topicId === selectedWeek.topicIds[0])
    : undefined

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.heroEyebrow}>Roadmap</p>
        <h1 className={styles.heroTitle}>A clean 12-week view of the full journey.</h1>
        <p className={styles.heroBody}>
          Expand any week to inspect tasks inline. Open a week only when you need the detailed
          workspace for status changes and reflection.
        </p>
      </header>

      <section className={styles.roadmapLayout}>
        <div className={styles.roadmapList}>
          {viewModel.weeks.map((week) => (
            <details
              key={week.id}
              className={styles.roadmapDetails}
              open={week.isCurrent || week.id === selectedWeek?.id || undefined}
            >
              <summary className={styles.roadmapSummary}>
                <div className={styles.weekSummary}>
                  <div>
                    <p className={styles.heroEyebrow}>Week {week.weekNumber}</p>
                    <h2 className={styles.roadmapSummaryTitle}>{week.title}</h2>
                    <p className={styles.roadmapSummaryMeta}>{week.focusArea}</p>
                  </div>
                  <div className={styles.weekSummarySide}>
                    <span className={styles.weekPercent}>{week.completionRate}%</span>
                    <TonePill tone={week.isComplete ? 'success' : week.isCurrent ? 'accent' : 'warning'}>
                      {week.isComplete ? 'Done' : week.isCurrent ? 'In progress' : 'Not started'}
                    </TonePill>
                  </div>
                </div>
              </summary>

              <div className={styles.weekContent}>
                <ProgressBar
                  label={formatWeekRange(week.startDate, week.endDate)}
                  value={week.completionRate}
                  subtitle={`${week.completedTasks} of ${week.totalTasks} tasks complete`}
                  tone={week.isComplete ? 'success' : week.isCurrent ? 'accent' : 'warning'}
                />
                <div className={styles.taskList}>
                  {week.tasks.map((task) => (
                    <div key={task.id} className={styles.taskItem}>
                      <div className={styles.taskHeader}>
                        <div>
                          <strong>{task.title}</strong>
                          <p className={styles.detailText}>{task.details}</p>
                        </div>
                        <TonePill
                          tone={
                            task.status === 'done'
                              ? 'success'
                              : task.status === 'blocked'
                                ? 'danger'
                                : task.status === 'in_progress'
                                  ? 'accent'
                                  : 'warning'
                          }
                        >
                          {task.status === 'done'
                            ? 'Done'
                            : task.status === 'blocked'
                              ? 'Blocked'
                              : task.status === 'in_progress'
                                ? 'In progress'
                                : 'Not started'}
                        </TonePill>
                      </div>
                      <p className={styles.metaText}>{formatLongDate(task.scheduledDate)}</p>
                    </div>
                  ))}
                </div>
                <div className={styles.weekFooter}>
                  <span className={styles.metaText}>Deliverable: {week.deliverable.title}</span>
                  <Link className={styles.linkButton} to={`/roadmap/${week.id}`}>
                    Open details
                  </Link>
                </div>
              </div>
            </details>
          ))}
        </div>

        {selectedWeek ? (
          <aside className={styles.detailPanel} aria-labelledby={`${selectedWeek.id}-title`}>
            <div className={styles.detailHeader}>
              <div>
                <p className={styles.heroEyebrow}>Week {selectedWeek.weekNumber}</p>
                <h2 id={`${selectedWeek.id}-title`} className={styles.roadmapSummaryTitle}>
                  {selectedWeek.title}
                </h2>
                <p className={styles.metaText}>
                  {formatWeekRange(selectedWeek.startDate, selectedWeek.endDate)}
                </p>
              </div>
              <Link className={styles.closeButton} to="/roadmap">
                Close
              </Link>
            </div>

            <div className={styles.detailScroll}>
              <PageCard
                title="Week summary"
                compact
                actions={
                  selectedTopic ? (
                    <button
                      className={styles.ghostButton}
                      type="button"
                      onClick={() => actions.toggleWeakTopic(selectedTopic.topicId)}
                    >
                      {selectedTopic.isManualWeak ? 'Remove weak flag' : 'Mark weak'}
                    </button>
                  ) : undefined
                }
              >
                <ProgressBar label="Week progress" value={selectedWeek.completionRate} />
                <div className={styles.notice}>
                  <strong>{selectedWeek.deliverable.title}</strong>
                  <p className={styles.detailText}>{selectedWeek.checkpoint}</p>
                </div>
                <div className={styles.goalList}>
                  {selectedWeek.goals.slice(0, 3).map((goal) => (
                    <p key={goal} className={styles.goalItem}>
                      {goal}
                    </p>
                  ))}
                </div>
              </PageCard>

              <StudyGuidanceCard compact title="How to use this week" eyebrow="Daily routine" />

              <PageCard title="Tasks" compact>
                <div className={styles.taskList}>
                  {selectedWeek.tasks.map((task) => (
                    <div key={task.id} className={styles.taskItem}>
                      <div className={styles.taskHeader}>
                        <div>
                          <strong>{task.title}</strong>
                          <p className={styles.detailText}>{task.details}</p>
                        </div>
                        <TonePill
                          tone={
                            task.status === 'done'
                              ? 'success'
                              : task.status === 'blocked'
                                ? 'danger'
                                : task.status === 'in_progress'
                                  ? 'accent'
                                  : 'warning'
                          }
                        >
                          {task.status === 'done'
                            ? 'Done'
                            : task.status === 'blocked'
                              ? 'Blocked'
                              : task.status === 'in_progress'
                                ? 'In progress'
                                : 'Not started'}
                        </TonePill>
                      </div>
                      <p className={styles.metaText}>{formatLongDate(task.scheduledDate)}</p>
                      <TaskStatusSelect
                        id={`${task.id}-status`}
                        value={task.status}
                        onChange={(event) => actions.setTaskStatus(task.id, event.target.value as TaskStatus)}
                      />
                    </div>
                  ))}
                </div>
              </PageCard>

              <PageCard title="Reflection" compact>
                <WeekReflectionForm
                  key={selectedWeek.id}
                  weekId={selectedWeek.id}
                  reflection={
                    snapshot.reflectionsByWeekId[selectedWeek.id] ??
                    createEmptyReflection(selectedWeek.id, snapshot.planStartDate)
                  }
                  onSave={actions.saveReflection}
                />
              </PageCard>
            </div>
          </aside>
        ) : (
          <PageCard title="Week details">
            <EmptyState title="Select a week" description="Open any week to edit tasks and save a reflection." />
          </PageCard>
        )}
      </section>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { EmptyState, PageCard, ProgressBar, TaskStatusSelect, TonePill } from '../components/ui'
import { StudyGuidanceCard } from '../components/StudyGuidanceCard'
import { usePlanner } from '../features/planner/usePlanner'
import type { TaskStatus } from '../types/planner'
import { formatLongDate, formatWeekRange } from '../utils/date'
import styles from './pages.module.css'

export function DashboardPage() {
  const { viewModel, actions } = usePlanner()
  const todayTask = viewModel.todayTask
  const masteringTopics = viewModel.topicHealth.filter((topic) => topic.status === 'mastering').length
  const weakTopicPreview = viewModel.weakTopics.slice(0, 3)

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.heroEyebrow}>Dashboard</p>
        <h1 className={styles.heroTitle}>See where you are, what to do next, and how well you are progressing.</h1>
        <p className={styles.heroBody}>
          The dashboard keeps the next action and the most important signals visible without forcing
          you to scan a dense wall of cards.
        </p>
      </header>

      <PageCard title="Overall progress">
        <div className={styles.progressHeroTop}>
          <div>
            <p className={styles.progressNumber}>{viewModel.progress.overallCompletionRate}%</p>
            <p className={styles.metaText}>
              {viewModel.progress.completedTasks} of {viewModel.progress.totalTasks} tasks complete
            </p>
          </div>
          <div className={styles.inlineStats}>
            <span>Week {viewModel.progress.currentWeekNumber}</span>
            <span>{viewModel.progress.streak}-day streak</span>
            <span>{viewModel.weakTopics.length} at risk</span>
          </div>
        </div>
        <ProgressBar label="12-week plan" value={viewModel.progress.overallCompletionRate} />
      </PageCard>

      <PageCard
        title={`Current week - ${viewModel.currentWeek.title}`}
        actions={
          <Link className={styles.linkButton} to={`/roadmap/${viewModel.currentWeek.id}`}>
            Open week
          </Link>
        }
      >
        <ProgressBar
          label="Week progress"
          value={viewModel.currentWeek.completionRate}
          subtitle={formatWeekRange(viewModel.currentWeek.startDate, viewModel.currentWeek.endDate)}
        />
        <div className={styles.notice}>
          <strong>{viewModel.currentWeek.focusArea}</strong>
          <p className={styles.detailText}>{viewModel.currentWeek.deliverable.title}</p>
        </div>
      </PageCard>

      <section className={styles.dashboardLayout}>
        <PageCard title="Today's task">
          {todayTask ? (
            <div className={styles.taskList}>
              {!viewModel.planStarted ? (
                <div className={styles.notice}>
                  <strong>Plan starts on {formatLongDate(todayTask.scheduledDate)}</strong>
                  <p className={styles.detailText}>Your first scheduled study task is ready.</p>
                </div>
              ) : null}
                <div className={styles.taskItem}>
                  <div className={styles.taskHeader}>
                    <div>
                      <strong>{todayTask.title}</strong>
                      <p className={styles.detailText}>{todayTask.details}</p>
                    </div>
                    <TonePill
                      tone={
                      todayTask.status === 'done'
                        ? 'success'
                        : todayTask.status === 'blocked'
                          ? 'danger'
                          : todayTask.status === 'in_progress'
                            ? 'accent'
                            : 'warning'
                    }
                  >
                    {todayTask.status === 'done'
                      ? 'Done'
                      : todayTask.status === 'blocked'
                        ? 'Blocked'
                        : todayTask.status === 'in_progress'
                          ? 'In progress'
                          : 'Not started'}
                  </TonePill>
                </div>
                <p className={styles.metaText}>{formatLongDate(todayTask.scheduledDate)}</p>
                <TaskStatusSelect
                  id="dashboard-today-status"
                  value={todayTask.status}
                  onChange={(event) => actions.setTaskStatus(todayTask.id, event.target.value as TaskStatus)}
                />
              </div>
            </div>
          ) : (
            <EmptyState title="No active task" description="There is no scheduled task for today." />
          )}
        </PageCard>

        <div className={styles.dashboardAside}>
          <PageCard title="Progress signals">
            <div className={styles.overviewList}>
              <div className={styles.overviewItem}>
                <strong>Streak</strong>
                <p className={styles.detailText}>{viewModel.progress.streak} consecutive study days</p>
              </div>
              <div className={styles.overviewItem}>
                <strong>Topic mastery</strong>
                <p className={styles.detailText}>{masteringTopics} topics in a strong place</p>
              </div>
              <div className={styles.overviewItem}>
                <strong>Weak topics</strong>
                {weakTopicPreview.length === 0 ? (
                  <p className={styles.detailText}>No topics are currently flagged.</p>
                ) : (
                  <div className={styles.goalList}>
                    {weakTopicPreview.map((topic) => (
                      <p key={topic.topicId} className={styles.goalItem}>
                        {topic.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </PageCard>

          <PageCard title="Next milestone">
            {viewModel.nextMilestone ? (
              <div className={styles.notice}>
                <strong>
                  Week {viewModel.nextMilestone.weekNumber} - {viewModel.nextMilestone.milestone}
                </strong>
                <p className={styles.detailText}>{viewModel.nextMilestone.deliverable.title}</p>
              </div>
            ) : (
              <EmptyState title="Milestones complete" description="All milestone weeks are complete." />
            )}
          </PageCard>

          <StudyGuidanceCard title="Daily routine and senior habits" eyebrow="Study method" />
        </div>
      </section>
    </div>
  )
}

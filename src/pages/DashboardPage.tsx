import { Link } from 'react-router-dom'
import { ExpandableText } from '../components/ExpandableText'
import { TaskNoteEditor } from '../components/TaskNoteEditor'
import { EmptyState, PageCard, ProgressBar, TaskStatusSelect, TonePill } from '../components/ui'
import { usePlanner } from '../features/planner/usePlanner'
import type { TaskStatus } from '../types/planner'
import { formatLongDate, formatWeekRange } from '../utils/date'
import styles from './pages.module.css'

export function DashboardPage() {
  const { viewModel, actions } = usePlanner()
  const todayTask = viewModel.todayTask

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.heroEyebrow}>Dashboard</p>
        <h1 className={styles.heroTitle}>See where you are, what to do next, and how well you are progressing.</h1>
        <p className={styles.heroBody}>
          The dashboard keeps the next action and your essential progress visible without extra
          noise.
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
                <div className={styles.taskTextGroup}>
                  <strong>{todayTask.title}</strong>
                  <ExpandableText
                    className={styles.detailText}
                    text={todayTask.details}
                    collapsedLines={3}
                    expandLabel="Show full task"
                    collapseLabel="Show less"
                  />
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
              <TaskNoteEditor
                taskId={todayTask.id}
                initialValue={todayTask.note?.content ?? ''}
                updatedAt={todayTask.note?.updatedAt}
                onSave={actions.saveTaskNote}
              />
            </div>
          </div>
        ) : (
          <EmptyState title="No active task" description="There is no scheduled task for today." />
        )}
      </PageCard>
    </div>
  )
}

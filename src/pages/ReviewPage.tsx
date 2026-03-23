import { Link } from 'react-router-dom'
import { ExpandableText } from '../components/ExpandableText'
import { EmptyState, PageCard, ProgressBar, StatCard, TonePill } from '../components/ui'
import { usePlanner } from '../features/planner/usePlanner'
import { formatShortDate } from '../utils/date'
import styles from './pages.module.css'

export function ReviewPage() {
  const { viewModel } = usePlanner()
  const blockedTopics = viewModel.topicHealth.filter((topic) => topic.blockedCount > 0)

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.heroEyebrow}>Revision system</p>
        <h1 className={styles.heroTitle}>Turn unfinished and blocked work into a deliberate review queue.</h1>
        <p className={styles.heroBody}>
          The review view automatically surfaces overdue tasks, groups blocked topics, and keeps the
          highest-value recommendations visible so nothing quietly slips behind.
        </p>
      </header>

      <section className={styles.statGrid} aria-label="Review overview">
        <StatCard
          label="Recommendations"
          value={`${viewModel.reviewRecommendations.length}`}
          detail="Ranked review prompts generated from progress and reflections"
        />
        <StatCard
          label="Overdue tasks"
          value={`${viewModel.overdueTasks.length}`}
          detail="Past sessions that are not done yet"
          tone={viewModel.overdueTasks.length > 0 ? 'warning' : 'success'}
        />
        <StatCard
          label="Blocked tasks"
          value={`${viewModel.blockedTasks.length}`}
          detail="Tasks currently marked blocked"
          tone={viewModel.blockedTasks.length > 0 ? 'danger' : 'success'}
        />
        <StatCard
          label="Weak topics"
          value={`${viewModel.weakTopics.length}`}
          detail="Topics needing reinforcement or manual review"
          tone={viewModel.weakTopics.length > 0 ? 'danger' : 'accent'}
        />
      </section>

      <section className={styles.reviewGrid}>
        <PageCard title="Recommended next reviews" eyebrow="Auto-ranked queue">
          {viewModel.reviewRecommendations.length === 0 ? (
            <EmptyState title="Queue is clear" description="There are no urgent review recommendations right now." />
          ) : (
            <div className={styles.recommendationGrid}>
              {viewModel.reviewRecommendations.map((recommendation) => (
                <div key={recommendation.id} className={styles.recommendationItem}>
                  <div className={styles.itemHeader}>
                    <strong>{recommendation.title}</strong>
                    <TonePill
                      tone={
                        recommendation.kind === 'blocked_topic'
                          ? 'danger'
                          : recommendation.kind === 'low_confidence'
                            ? 'warning'
                            : 'accent'
                      }
                    >
                      {recommendation.kind === 'blocked_topic'
                        ? 'Blocked'
                        : recommendation.kind === 'low_confidence'
                          ? 'Confidence'
                          : 'Overdue'}
                    </TonePill>
                  </div>
                  <p className={styles.detailText}>{recommendation.description}</p>
                  {recommendation.weekId ? (
                    <Link className={styles.linkButton} to={`/roadmap/${recommendation.weekId}`}>
                      Open related week
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </PageCard>

        <div className={styles.overviewList}>
          <PageCard title="Missed tasks" eyebrow="Overdue sessions">
            {viewModel.overdueTasks.length === 0 ? (
              <EmptyState title="No missed tasks" description="You are current on the schedule." />
            ) : (
              <div className={styles.taskList}>
                {viewModel.overdueTasks.slice(0, 8).map((task) => (
                  <div key={task.id} className={styles.taskItem}>
                    <div className={styles.taskHeader}>
                      <div className={styles.taskTextGroup}>
                        <strong>{task.title}</strong>
                      </div>
                      <TonePill tone="warning">{formatShortDate(task.scheduledDate)}</TonePill>
                    </div>
                    <ExpandableText className={styles.detailText} text={task.details} />
                  </div>
                ))}
              </div>
            )}
          </PageCard>

          <PageCard title="Blocked topics" eyebrow="Grouped by risk">
            {blockedTopics.length === 0 ? (
              <EmptyState title="Nothing blocked" description="Blocked topics will surface here automatically." />
            ) : (
              <div className={styles.overviewList}>
                {blockedTopics.map((topic) => (
                  <div key={topic.topicId} className={styles.overviewItem}>
                    <div className={styles.itemHeader}>
                      <strong>{topic.name}</strong>
                      <TonePill tone="danger">{topic.blockedCount} blocked</TonePill>
                    </div>
                    <ProgressBar
                      label="Topic completion"
                      value={topic.completionRate}
                      subtitle={`${topic.overdueCount} overdue tasks still linked to this topic`}
                      tone="danger"
                    />
                  </div>
                ))}
              </div>
            )}
          </PageCard>
        </div>
      </section>
    </div>
  )
}

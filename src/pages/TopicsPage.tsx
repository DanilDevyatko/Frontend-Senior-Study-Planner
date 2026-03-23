import { ConfidenceScale, EmptyState, PageCard, ProgressBar, TonePill } from '../components/ui'
import { usePlanner } from '../features/planner/usePlanner'
import styles from './pages.module.css'

function averageConfidence(values: Array<number | null>): number | null {
  const numericValues = values.filter((value): value is number => value !== null)
  if (numericValues.length === 0) {
    return null
  }

  return Math.round(numericValues.reduce((total, value) => total + value, 0) / numericValues.length)
}

export function TopicsPage() {
  const { viewModel, actions } = usePlanner()
  const masteringTopics = viewModel.topicHealth.filter((topic) => topic.status === 'mastering').length
  const averageTopicConfidence = averageConfidence(
    viewModel.topicHealth.map((topic) => topic.confidenceScore),
  )

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.heroEyebrow}>Topic health</p>
        <h1 className={styles.heroTitle}>A simple view of mastery gaps and risk areas.</h1>
        <p className={styles.heroBody}>
          Topics are shown as compact rows with progress, confidence, and a soft warning state when
          the planner detects risk.
        </p>
      </header>

      <PageCard title="Overview">
        <div className={styles.inlineStats}>
          <span>{masteringTopics} mastering</span>
          <span>{viewModel.weakTopics.length} at risk</span>
          <span>
            {averageTopicConfidence === null ? 'No confidence data yet' : `${averageTopicConfidence}% avg confidence`}
          </span>
        </div>
      </PageCard>

      <PageCard title="Topic list">
        {viewModel.topicHealth.length === 0 ? (
          <EmptyState title="No topics yet" description="The seeded roadmap should populate this view automatically." />
        ) : (
          <div className={styles.topicList}>
            {viewModel.topicHealth.map((topic) => (
              <div key={topic.topicId} className={styles.topicRow}>
                <div className={styles.topicMain}>
                  <strong>{topic.name}</strong>
                  <p className={styles.topicWeekList}>Weeks {topic.relatedWeeks.join(', ')}</p>
                </div>
                <div>
                  <ProgressBar
                    label="Mastery"
                    value={topic.completionRate}
                    subtitle={`${topic.overdueCount} overdue · ${topic.blockedCount} blocked`}
                    tone={topic.status === 'at_risk' ? 'danger' : topic.status === 'mastering' ? 'success' : 'accent'}
                  />
                  <ConfidenceScale label="Confidence" value={topic.confidenceScore} />
                </div>
                <div className={styles.topicActions}>
                  <TonePill
                    tone={
                      topic.status === 'mastering'
                        ? 'success'
                        : topic.status === 'at_risk'
                          ? 'warning'
                          : 'accent'
                    }
                  >
                    {topic.status === 'mastering'
                      ? 'Mastering'
                      : topic.status === 'at_risk'
                        ? 'At risk'
                        : 'Steady'}
                  </TonePill>
                  <button
                    className={styles.ghostButton}
                    type="button"
                    onClick={() => actions.toggleWeakTopic(topic.topicId)}
                  >
                    {topic.isManualWeak ? 'Remove weak flag' : 'Mark weak'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageCard>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { EmptyState, PageCard } from '../components/ui'
import { usePlanner } from '../features/planner/usePlanner'
import { formatLongDate } from '../utils/date'
import styles from './pages.module.css'

export function SettingsPage() {
  const { snapshot, viewModel, actions } = usePlanner()
  const [startDate, setStartDate] = useState(snapshot.planStartDate)

  useEffect(() => {
    setStartDate(snapshot.planStartDate)
  }, [snapshot.planStartDate])

  function handleReset() {
    if (!window.confirm('Reset all local progress, reflections, and weak-topic flags?')) {
      return
    }

    actions.resetPlanner()
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.heroEyebrow}>Local planner settings</p>
        <h1 className={styles.heroTitle}>Control the real calendar schedule without rewriting the study plan.</h1>
        <p className={styles.heroBody}>
          Progress is stored locally in your browser. Changing the start date shifts the calendar
          schedule, while reset clears task state, reflections, and weak-topic markers.
        </p>
      </header>

      <section className={styles.settingsGrid}>
        <PageCard title="Study schedule" eyebrow="Start date and timing">
          <form
            className={styles.formGrid}
            onSubmit={(event) => {
              event.preventDefault()
              actions.setPlanStartDate(startDate)
            }}
          >
            <div className={styles.field}>
              <label htmlFor="planStartDate">Plan start date</label>
              <input
                id="planStartDate"
                className={styles.input}
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
              <p className={styles.helperText}>
                Current schedule starts on {formatLongDate(snapshot.planStartDate)}.
              </p>
            </div>
            <div className={styles.buttonRow}>
              <button className={styles.primaryButton} type="submit">
                Save start date
              </button>
            </div>
          </form>
        </PageCard>

        <div className={styles.overviewList}>
          <PageCard title="Local storage" eyebrow="Persistence summary">
            <div className={styles.notice}>
              <strong>Saved automatically</strong>
              <p>
                Task status, reflections, weak-topic flags, and the study start date are stored
                locally in this browser.
              </p>
            </div>
            <div className={styles.overviewList}>
              <div className={styles.overviewItem}>
                <strong>Current week</strong>
                <p className={styles.detailText}>
                  Week {viewModel.currentWeek.weekNumber}: {viewModel.currentWeek.title}
                </p>
              </div>
              <div className={styles.overviewItem}>
                <strong>Overall progress</strong>
                <p className={styles.detailText}>{viewModel.progress.overallCompletionRate}% complete</p>
              </div>
            </div>
          </PageCard>

          <PageCard title="Reset planner" eyebrow="Fresh local restart">
            <div className={styles.formGrid}>
              <div className={styles.notice}>
                <strong>Reset is permanent for this browser</strong>
                <p>
                  Use reset if you want to restart the 12-week journey from a clean local state.
                </p>
              </div>
              <div className={styles.buttonRow}>
                <button className={styles.ghostButton} type="button" onClick={handleReset}>
                  Reset local planner
                </button>
              </div>
            </div>
          </PageCard>
        </div>
      </section>

      {!snapshot.lastActiveDate ? (
        <PageCard title="Activity note" eyebrow="Planner usage">
          <EmptyState title="No activity yet" description="Once you update tasks or reflections, the planner will persist your progress automatically." />
        </PageCard>
      ) : null}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { EmptyState, PageCard } from '../components/ui'
import { useAuth } from '../features/auth/useAuth'
import { usePlanner } from '../features/planner/usePlanner'
import { formatLongDate } from '../utils/date'
import styles from './pages.module.css'

export function SettingsPage() {
  const auth = useAuth()
  const { snapshot, viewModel, actions, syncStatus, syncError, lastSyncedAt } = usePlanner()
  const [startDate, setStartDate] = useState(snapshot.planStartDate)

  useEffect(() => {
    setStartDate(snapshot.planStartDate)
  }, [snapshot.planStartDate])

  function handleReset() {
    if (!window.confirm('Reset all synced progress, reflections, notes, and weak-topic flags for this account?')) {
      return
    }

    actions.resetPlanner()
  }

  async function handleSignOut() {
    await auth.actions.signOut()
  }

  const syncLabel =
    syncStatus === 'saving'
      ? 'Saving latest changes to Supabase.'
      : syncStatus === 'error'
        ? 'Sync issue. The local cache may be ahead of the cloud snapshot.'
        : syncStatus === 'booting'
          ? 'Connecting to Supabase.'
          : 'Synced with Supabase.'

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.heroEyebrow}>Planner settings</p>
        <h1 className={styles.heroTitle}>Control the real calendar schedule and account sync without rewriting the study plan.</h1>
        <p className={styles.heroBody}>
          Changing the start date shifts the calendar schedule. Planner changes sync to Supabase
          automatically, while this browser keeps a small local cache for faster recovery.
        </p>
      </header>

      <section className={styles.settingsGrid}>
        <PageCard title="Account" eyebrow="Supabase access">
          <div className={styles.notice}>
            <strong>{auth.user?.email ?? 'Signed-in account'}</strong>
            <p className={styles.detailText}>
              This planner is private to your Supabase account and syncs across devices.
            </p>
          </div>
          <div className={styles.overviewList}>
            <div className={styles.overviewItem}>
              <strong>Sync status</strong>
              <p className={styles.detailText}>{syncLabel}</p>
            </div>
            {lastSyncedAt ? (
              <div className={styles.overviewItem}>
                <strong>Last cloud sync</strong>
                <p className={styles.detailText}>{new Date(lastSyncedAt).toLocaleString()}</p>
              </div>
            ) : null}
            {syncError ? (
              <div className={styles.overviewItem}>
                <strong>Last sync issue</strong>
                <p className={styles.detailText}>{syncError}</p>
              </div>
            ) : null}
          </div>
          <div className={styles.buttonRow}>
            <button className={styles.ghostButton} type="button" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </PageCard>

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
          <PageCard title="Cloud sync" eyebrow="Persistence summary">
            <div className={styles.notice}>
              <strong>Saved to Supabase automatically</strong>
              <p>
                Task status, reflections, notes, weak-topic flags, and the study start date sync to
                your account. This browser also keeps a local cache for faster recovery.
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
                <strong>Reset clears the synced planner snapshot</strong>
                <p>
                  Use reset if you want to restart the 12-week journey from a clean state across
                  your signed-in devices.
                </p>
              </div>
              <div className={styles.buttonRow}>
                <button className={styles.ghostButton} type="button" onClick={handleReset}>
                  Reset synced planner
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

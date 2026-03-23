import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AmbientAudioPlayer } from '../components/AmbientAudioPlayer'
import { BackgroundAnimation } from '../components/BackgroundAnimation'
import { usePlanner } from '../features/planner/usePlanner'
import styles from './AppShell.module.css'

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/topics', label: 'Topics' },
  { to: '/review', label: 'Review' },
  { to: '/settings', label: 'Settings' },
]

export function AppShell() {
  const { pathname } = useLocation()
  const { viewModel, syncStatus } = usePlanner()
  const activeLabel =
    navigationItems.find((item) => pathname.startsWith(item.to))?.label ?? 'Dashboard'

  const syncLabel =
    syncStatus === 'saving'
      ? 'Saving...'
      : syncStatus === 'error'
        ? 'Sync issue'
        : syncStatus === 'booting'
          ? 'Syncing...'
          : 'Synced'

  return (
    <div className={styles.shellFrame}>
      <BackgroundAnimation />

      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.headerRow}>
            <div className={styles.brand}>
              <p className={styles.eyebrow}>Frontend Senior Study Planner</p>
              <h1 className={styles.brandTitle}>{activeLabel}</h1>
            </div>

            <div className={styles.summary}>
              <span>{viewModel.progress.overallCompletionRate}% complete</span>
              <span>Week {viewModel.progress.currentWeekNumber}</span>
              <span>{viewModel.progress.streak}-day streak</span>
              <span>{syncLabel}</span>
            </div>
          </div>

          <nav aria-label="Primary" className={styles.navigation}>
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <p className={styles.currentWeek}>
            Current focus: Week {viewModel.currentWeek.weekNumber} - {viewModel.currentWeek.title}
          </p>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>

        <footer className={styles.footer}>
          <span>Created by Danylo Deviatko</span>
        </footer>

        <nav aria-label="Mobile primary" className={styles.mobileNav}>
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`.trim()
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <AmbientAudioPlayer />
      </div>
    </div>
  )
}

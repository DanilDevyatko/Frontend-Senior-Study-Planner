import type { ChangeEventHandler, PropsWithChildren, ReactNode } from 'react'
import { TASK_STATUS_LABELS, TASK_STATUS_OPTIONS, type TaskStatus } from '../types/planner'
import styles from './ui.module.css'

function joinClasses(...classNames: Array<string | false | null | undefined>): string {
  return classNames.filter(Boolean).join(' ')
}

interface PageCardProps extends PropsWithChildren {
  title: string
  eyebrow?: string
  actions?: ReactNode
  className?: string
  compact?: boolean
}

export function PageCard({ title, eyebrow, actions, className, compact, children }: PageCardProps) {
  return (
    <section className={joinClasses(styles.card, compact && styles.cardCompact, className)}>
      <header className={styles.cardHeader}>
        <div>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h2 className={styles.cardTitle}>{title}</h2>
        </div>
        {actions ? <div className={styles.cardActions}>{actions}</div> : null}
      </header>
      <div className={styles.cardBody}>{children}</div>
    </section>
  )
}

interface ProgressBarProps {
  label: string
  value: number
  subtitle?: string
  tone?: 'accent' | 'success' | 'warning' | 'danger'
}

export function ProgressBar({ label, value, subtitle, tone = 'accent' }: ProgressBarProps) {
  return (
    <div
      className={styles.progressStack}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <div className={styles.progressMeta}>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      {subtitle ? <p className={styles.progressSubtitle}>{subtitle}</p> : null}
      <div className={styles.progressTrack}>
        <span className={styles.progressFill} data-tone={tone} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  detail: string
  tone?: 'accent' | 'success' | 'warning' | 'danger'
}

export function StatCard({ label, value, detail, tone = 'accent' }: StatCardProps) {
  return (
    <article className={styles.statCard} data-tone={tone}>
      <p className={styles.statLabel}>{label}</p>
      <strong className={styles.statValue}>{value}</strong>
      <p className={styles.statDetail}>{detail}</p>
    </article>
  )
}

export function StatusPill({ status }: { status: TaskStatus }) {
  return (
    <span className={styles.statusPill} data-status={status}>
      {TASK_STATUS_LABELS[status]}
    </span>
  )
}

export function TonePill({
  children,
  tone = 'accent',
}: PropsWithChildren<{ tone?: 'accent' | 'success' | 'warning' | 'danger' }>) {
  return (
    <span className={styles.tonePill} data-tone={tone}>
      {children}
    </span>
  )
}

interface TaskStatusSelectProps {
  id?: string
  value: TaskStatus
  onChange: ChangeEventHandler<HTMLSelectElement>
}

export function TaskStatusSelect({ id, value, onChange }: TaskStatusSelectProps) {
  return (
    <select id={id} className={styles.select} value={value} onChange={onChange}>
      {TASK_STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {TASK_STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  )
}

export function ConfidenceScale({ label, value }: { label: string; value: number | null }) {
  const activeDots = value ? Math.max(1, Math.round(value / 20)) : 0

  return (
    <div className={styles.confidenceRow}>
      <span>{label}</span>
      {value === null ? (
        <span className={styles.confidenceText}>Not rated yet</span>
      ) : (
        <div className={styles.confidenceGroup}>
          <div className={styles.confidenceDots}>
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={`${label}-${index + 1}`}
                className={styles.confidenceDot}
                data-active={index < activeDots}
              />
            ))}
          </div>
          <strong className={styles.confidenceText}>{value}%</strong>
        </div>
      )}
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className={styles.emptyState}>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}

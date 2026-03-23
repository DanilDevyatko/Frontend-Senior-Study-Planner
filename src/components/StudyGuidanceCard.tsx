import { PageCard } from './ui'
import { studyGuidance } from '../data/seed/studyGuidance'
import styles from './StudyGuidanceCard.module.css'

interface StudyGuidanceCardProps {
  compact?: boolean
  title?: string
  eyebrow?: string
}

export function StudyGuidanceCard({
  compact = false,
  title = 'Study routine',
  eyebrow,
}: StudyGuidanceCardProps) {
  const routineSteps = compact ? studyGuidance.dailyRoutine : studyGuidance.dailyRoutine
  const seniorSignals = compact ? studyGuidance.seniorSignals.slice(0, 3) : studyGuidance.seniorSignals
  const highImpactHabits = compact
    ? studyGuidance.highImpactHabits.slice(0, 2)
    : studyGuidance.highImpactHabits

  return (
    <PageCard title={title} eyebrow={eyebrow} compact={compact}>
      <div className={styles.section}>
        <h3 className={styles.heading}>Daily routine</h3>
        <div className={styles.stepList}>
          {routineSteps.map((step) => (
            <div key={step.title} className={styles.stepItem}>
              <div className={styles.stepHeader}>
                <strong>{step.title}</strong>
                <span>{step.duration}</span>
              </div>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.heading}>What makes you senior</h3>
        <ul className={styles.pointList}>
          {seniorSignals.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.heading}>Optional, high impact</h3>
        <ul className={styles.pointList}>
          {highImpactHabits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </PageCard>
  )
}

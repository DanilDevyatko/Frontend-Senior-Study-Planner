import { PageCard } from './ui'
import styles from './AppStatePanel.module.css'

interface AppStatePanelProps {
  title: string
  body: string
  eyebrow?: string
}

export function AppStatePanel({ title, body, eyebrow }: AppStatePanelProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.inner}>
        <PageCard title={title} eyebrow={eyebrow}>
          <p className={styles.body}>{body}</p>
        </PageCard>
      </div>
    </div>
  )
}

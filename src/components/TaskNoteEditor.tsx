import { useEffect, useMemo, useState } from 'react'
import { formatLongDate } from '../utils/date'
import styles from './TaskNoteEditor.module.css'

interface TaskNoteEditorProps {
  taskId: string
  initialValue: string
  updatedAt?: string
  onSave: (taskId: string, content: string) => void
}

export function TaskNoteEditor({ taskId, initialValue, updatedAt, onSave }: TaskNoteEditorProps) {
  const [draft, setDraft] = useState(initialValue)
  const [isOpen, setIsOpen] = useState(Boolean(initialValue))
  const normalizedInitialValue = useMemo(() => initialValue.trim(), [initialValue])
  const normalizedDraft = useMemo(() => draft.trim(), [draft])
  const hasChanges = normalizedDraft !== normalizedInitialValue
  const hasSavedNote = normalizedInitialValue.length > 0

  useEffect(() => {
    setDraft(initialValue)
    setIsOpen(Boolean(initialValue))
  }, [initialValue])

  function handleSave() {
    onSave(taskId, draft)

    if (!normalizedDraft) {
      setIsOpen(false)
    }
  }

  return (
    <div className={styles.noteBlock}>
      {hasSavedNote && !isOpen ? (
        <div className={styles.notePreview}>
          <p className={styles.noteLabel}>Saved note</p>
          <p className={styles.noteText}>{initialValue}</p>
          <div className={styles.noteActions}>
            {updatedAt ? <span className={styles.noteMeta}>Updated {formatLongDate(updatedAt)}</span> : null}
            <button className={styles.toggleButton} type="button" onClick={() => setIsOpen(true)}>
              Edit note
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.editorHeader}>
            <label className={styles.noteLabel} htmlFor={`${taskId}-note`}>
              Task note
            </label>
            {!isOpen ? (
              <button className={styles.toggleButton} type="button" onClick={() => setIsOpen(true)}>
                Add note
              </button>
            ) : null}
          </div>

          {isOpen ? (
            <div className={styles.editorBody}>
              <textarea
                id={`${taskId}-note`}
                className={styles.textarea}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Capture examples, blockers, or what to revisit next."
                rows={3}
              />
              <div className={styles.noteActions}>
                {updatedAt && hasSavedNote ? (
                  <span className={styles.noteMeta}>Updated {formatLongDate(updatedAt)}</span>
                ) : (
                  <span className={styles.noteMeta}>Notes save locally for this task.</span>
                )}
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => {
                      setDraft(initialValue)
                      setIsOpen(hasSavedNote)
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.primaryButton}
                    type="button"
                    onClick={handleSave}
                    disabled={!hasChanges}
                  >
                    {normalizedDraft ? 'Save note' : 'Clear note'}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import styles from './ExpandableText.module.css'

function joinClasses(...classNames: Array<string | false | null | undefined>): string {
  return classNames.filter(Boolean).join(' ')
}

interface ExpandableTextProps {
  text: string
  className?: string
  collapsedLines?: number
  expandLabel?: string
  collapseLabel?: string
}

export function ExpandableText({
  text,
  className,
  collapsedLines = 3,
  expandLabel = 'Show more',
  collapseLabel = 'Show less',
}: ExpandableTextProps) {
  const textRef = useRef<HTMLParagraphElement | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [canExpand, setCanExpand] = useState(false)
  const normalizedText = useMemo(() => text.trim(), [text])

  useEffect(() => {
    setExpanded(false)
  }, [normalizedText, collapsedLines])

  useEffect(() => {
    const node = textRef.current
    if (!node) {
      return undefined
    }

    let frameId = 0
    const measureOverflow = () => {
      const computedStyle = window.getComputedStyle(node)
      const fontSize = Number.parseFloat(computedStyle.fontSize) || 16
      const lineHeight =
        computedStyle.lineHeight === 'normal'
          ? fontSize * 1.5
          : Number.parseFloat(computedStyle.lineHeight) || fontSize * 1.5
      const collapsedHeight = lineHeight * collapsedLines
      const fullHeight = node.scrollHeight

      setCanExpand(fullHeight - collapsedHeight > 1)
    }

    const scheduleMeasure = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(measureOverflow)
    }

    scheduleMeasure()

    const resizeObserver = new ResizeObserver(() => {
      scheduleMeasure()
    })

    resizeObserver.observe(node)

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
    }
  }, [normalizedText, collapsedLines, expanded])

  return (
    <div className={styles.wrapper}>
      <p
        ref={textRef}
        className={joinClasses(className, canExpand && !expanded && styles.collapsed)}
        style={
          canExpand && !expanded
            ? ({ '--line-clamp': String(collapsedLines) } as CSSProperties)
            : undefined
        }
      >
        {normalizedText}
      </p>
      {canExpand ? (
        <button className={styles.toggle} type="button" onClick={() => setExpanded((current) => !current)}>
          {expanded ? collapseLabel : expandLabel}
        </button>
      ) : null}
    </div>
  )
}

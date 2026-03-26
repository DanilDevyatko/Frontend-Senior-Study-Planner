interface WeakTopicToggleButtonProps {
  className: string
  isWeak: boolean
  topicName: string
  onClick: () => void
}

function getWeakTopicCopy(isWeak: boolean, topicName: string) {
  if (isWeak) {
    return {
      label: 'Remove weak flag',
      title: `Remove the weak topic flag for ${topicName}`,
      ariaLabel: `Remove weak flag for ${topicName}`,
    }
  }

  return {
    label: 'Mark weak',
    title: `Mark ${topicName} as a weak topic for review`,
    ariaLabel: `Mark ${topicName} as weak for review`,
  }
}

export function WeakTopicToggleButton({
  className,
  isWeak,
  topicName,
  onClick,
}: WeakTopicToggleButtonProps) {
  const copy = getWeakTopicCopy(isWeak, topicName)

  return (
    <button
      aria-label={copy.ariaLabel}
      className={className}
      title={copy.title}
      type="button"
      onClick={onClick}
    >
      {copy.label}
    </button>
  )
}

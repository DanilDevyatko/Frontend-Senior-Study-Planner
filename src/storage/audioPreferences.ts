export interface AmbientAudioPreferences {
  volume: number
}

export const AUDIO_STORAGE_KEY = 'frontend-senior-study-planner/audio/v1'

function clampVolume(value: unknown): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0.1
  }

  return Math.min(1, Math.max(0, value))
}

export function createDefaultAmbientAudioPreferences(): AmbientAudioPreferences {
  return {
    volume: 0.1,
  }
}

export function migrateAmbientAudioPreferences(input: unknown): AmbientAudioPreferences | null {
  if (!input || typeof input !== 'object') {
    return null
  }

  const candidate = input as Partial<AmbientAudioPreferences>

  return {
    volume: clampVolume(candidate.volume),
  }
}

export function loadAmbientAudioPreferences(): AmbientAudioPreferences {
  if (typeof window === 'undefined') {
    return createDefaultAmbientAudioPreferences()
  }

  try {
    const rawPreferences = window.localStorage.getItem(AUDIO_STORAGE_KEY)
    if (!rawPreferences) {
      return createDefaultAmbientAudioPreferences()
    }

    const parsedPreferences: unknown = JSON.parse(rawPreferences)
    return migrateAmbientAudioPreferences(parsedPreferences) ?? createDefaultAmbientAudioPreferences()
  } catch {
    return createDefaultAmbientAudioPreferences()
  }
}

export function saveAmbientAudioPreferences(preferences: AmbientAudioPreferences): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    AUDIO_STORAGE_KEY,
    JSON.stringify({
      volume: clampVolume(preferences.volume),
    }),
  )
}

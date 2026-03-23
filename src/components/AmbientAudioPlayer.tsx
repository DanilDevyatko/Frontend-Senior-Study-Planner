import { useEffect, useRef, useState } from 'react'
import {
  loadAmbientAudioPreferences,
  saveAmbientAudioPreferences,
  type AmbientAudioPreferences,
} from '../storage/audioPreferences'
import styles from './AmbientAudioPlayer.module.css'

function formatVolume(volume: number): string {
  return `${Math.round(volume * 100)}%`
}

export function AmbientAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [preferences, setPreferences] = useState<AmbientAudioPreferences>(loadAmbientAudioPreferences)
  const [isPlaying, setIsPlaying] = useState(false)
  const [statusMessage, setStatusMessage] = useState(
    'Ambient audio will try to start automatically. Volume is saved locally.',
  )
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    saveAmbientAudioPreferences(preferences)
  }, [preferences])

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    audioRef.current.volume = preferences.volume
  }, [preferences.volume])

  useEffect(() => {
    if (!audioRef.current || hasError) {
      return
    }

    let cancelled = false

    async function attemptAutoplay() {
      try {
        await audioRef.current?.play()
        if (cancelled) {
          return
        }

        setHasError(false)
        setIsPlaying(true)
        setStatusMessage('Ambient audio is playing in the background.')
      } catch {
        if (cancelled) {
          return
        }

        setIsPlaying(false)
        setStatusMessage('Autoplay was blocked. Press play to start ambient audio.')
      }
    }

    void attemptAutoplay()

    return () => {
      cancelled = true
    }
  }, [hasError])

  async function handleTogglePlayback() {
    if (!audioRef.current || hasError) {
      return
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      setStatusMessage('Ambient audio paused.')
      return
    }

    try {
      await audioRef.current.play()
      setHasError(false)
      setIsPlaying(true)
      setStatusMessage('Ambient audio is playing in the background.')
    } catch {
      setIsPlaying(false)
      setStatusMessage('Playback was blocked. Press play again after interacting with the page.')
    }
  }

  return (
    <section className={styles.player} aria-label="Ambient audio player">
      <audio
        ref={audioRef}
        src="/audio/ambient-study.m4a"
        loop
        preload="metadata"
        onError={() => {
          setHasError(true)
          setIsPlaying(false)
          setStatusMessage('The ambient audio file could not be loaded.')
        }}
        onPause={() => setIsPlaying(false)}
        onPlay={() => {
          setHasError(false)
          setIsPlaying(true)
        }}
      />

      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <p className={styles.eyebrow}>Ambient audio</p>
          <h2 className={styles.title}>Study background</h2>
        </div>

        <button
          className={styles.toggleButton}
          type="button"
          onClick={handleTogglePlayback}
          aria-pressed={isPlaying}
          disabled={hasError}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      <div className={styles.controlRow}>
        <label className={styles.volumeLabel} htmlFor="ambient-audio-volume">
          Volume
        </label>
        <input
          id="ambient-audio-volume"
          className={styles.slider}
          type="range"
          min="0"
          max="100"
          step="1"
          value={Math.round(preferences.volume * 100)}
          onChange={(event) => {
            const nextVolume = Number(event.target.value) / 100
            setPreferences({ volume: nextVolume })
          }}
        />
        <output className={styles.volumeValue} htmlFor="ambient-audio-volume">
          {formatVolume(preferences.volume)}
        </output>
      </div>

      <p className={`${styles.status} ${hasError ? styles.statusError : ''}`} role="status" aria-live="polite">
        {statusMessage}
      </p>
    </section>
  )
}

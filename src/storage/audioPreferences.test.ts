import { describe, expect, it } from 'vitest'
import {
  AUDIO_STORAGE_KEY,
  createDefaultAmbientAudioPreferences,
  loadAmbientAudioPreferences,
  migrateAmbientAudioPreferences,
  saveAmbientAudioPreferences,
} from './audioPreferences'

describe('audioPreferences', () => {
  it('returns defaults when storage is empty', () => {
    window.localStorage.clear()

    expect(loadAmbientAudioPreferences()).toEqual(createDefaultAmbientAudioPreferences())
  })

  it('saves and reloads a valid volume', () => {
    saveAmbientAudioPreferences({ volume: 0.6 })

    expect(loadAmbientAudioPreferences()).toEqual({ volume: 0.6 })
  })

  it('falls back safely when the stored payload is corrupted', () => {
    window.localStorage.setItem(AUDIO_STORAGE_KEY, '{bad json')

    expect(loadAmbientAudioPreferences()).toEqual(createDefaultAmbientAudioPreferences())
  })

  it('clamps migrated values into the valid range', () => {
    expect(migrateAmbientAudioPreferences({ volume: 3 })).toEqual({ volume: 1 })
    expect(migrateAmbientAudioPreferences({ volume: -2 })).toEqual({ volume: 0 })
  })
})

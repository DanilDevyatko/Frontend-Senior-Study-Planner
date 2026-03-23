import type { PlannerSnapshot } from '../types/planner'
import { migratePlannerSnapshot } from './plannerStorage'

export const CLOUD_CACHE_STORAGE_KEY = 'frontend-senior-study-planner/cloud-cache/v1'

interface PlannerCacheEnvelope {
  ownerUserId: string
  cachedAt: string
  snapshot: PlannerSnapshot
}

function sanitizePlannerCacheEnvelope(input: unknown): PlannerCacheEnvelope | null {
  if (!input || typeof input !== 'object') {
    return null
  }

  const candidate = input as Partial<PlannerCacheEnvelope>
  const ownerUserId = typeof candidate.ownerUserId === 'string' ? candidate.ownerUserId : undefined
  const cachedAt = typeof candidate.cachedAt === 'string' ? candidate.cachedAt : undefined
  const snapshot = migratePlannerSnapshot(candidate.snapshot)

  if (!ownerUserId || !cachedAt || !snapshot) {
    return null
  }

  return {
    ownerUserId,
    cachedAt,
    snapshot,
  }
}

export function loadPlannerCache(userId: string): PlannerSnapshot | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawCache = window.localStorage.getItem(CLOUD_CACHE_STORAGE_KEY)
    if (!rawCache) {
      return null
    }

    const parsedCache: unknown = JSON.parse(rawCache)
    const envelope = sanitizePlannerCacheEnvelope(parsedCache)

    if (!envelope || envelope.ownerUserId !== userId) {
      return null
    }

    return envelope.snapshot
  } catch {
    return null
  }
}

export function savePlannerCache(userId: string, snapshot: PlannerSnapshot): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(
    CLOUD_CACHE_STORAGE_KEY,
    JSON.stringify({
      ownerUserId: userId,
      cachedAt: new Date().toISOString(),
      snapshot,
    } satisfies PlannerCacheEnvelope),
  )
}

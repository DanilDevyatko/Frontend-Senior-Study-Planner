import { type PropsWithChildren, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { AppStatePanel } from '../../components/AppStatePanel'
import { studyPlanSeed } from '../../data/seed/studyPlan'
import { plannerReducer } from './plannerReducer'
import { buildPlannerViewModel } from './plannerSelectors'
import { createEmptySnapshot, loadPlannerSnapshot, resetStoredPlannerSnapshot } from '../../storage/plannerStorage'
import { getTodayDate } from '../../utils/date'
import { PlannerContext } from './PlannerContext'
import { loadPlannerCache, savePlannerCache } from '../../storage/plannerCacheStorage'
import {
  getRemotePlannerSnapshot,
  hasPlannerData,
  saveRemotePlannerSnapshot,
  subscribeToRemotePlannerSnapshot,
  type SyncStatus,
} from '../../storage/plannerRepository'

const SAVE_DEBOUNCE_MS = 700

interface PlannerProviderProps extends PropsWithChildren {
  userId: string
}

export function PlannerProvider({ children, userId }: PlannerProviderProps) {
  const [snapshot, dispatch] = useReducer(plannerReducer, createEmptySnapshot())
  const [isInitialized, setIsInitialized] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('booting')
  const [syncError, setSyncError] = useState<string>()
  const [lastSyncedAt, setLastSyncedAt] = useState<string>()
  const currentSnapshotRef = useRef(snapshot)
  const lastPersistedSnapshotRef = useRef(JSON.stringify(snapshot))
  const lastRemoteUpdatedAtRef = useRef<string | undefined>(undefined)
  const today = getTodayDate()
  const viewModel = buildPlannerViewModel(studyPlanSeed, snapshot, today)

  useEffect(() => {
    currentSnapshotRef.current = snapshot
  }, [snapshot])

  useEffect(() => {
    let isActive = true

    async function bootstrapPlanner() {
      setIsInitialized(false)
      setSyncStatus('booting')
      setSyncError(undefined)

      try {
        const remoteSnapshotRecord = await getRemotePlannerSnapshot(userId)

        if (!isActive) {
          return
        }

        if (remoteSnapshotRecord) {
          dispatch({ type: 'hydrateSnapshot', payload: remoteSnapshotRecord.snapshot })
          savePlannerCache(userId, remoteSnapshotRecord.snapshot)
          resetStoredPlannerSnapshot()
          lastPersistedSnapshotRef.current = JSON.stringify(remoteSnapshotRecord.snapshot)
          lastRemoteUpdatedAtRef.current = remoteSnapshotRecord.updatedAt
          setLastSyncedAt(remoteSnapshotRecord.updatedAt)
          setSyncStatus('ready')
          setIsInitialized(true)
          return
        }

        const legacySnapshot = loadPlannerSnapshot()
        const snapshotToSeed = hasPlannerData(legacySnapshot) ? legacySnapshot : createEmptySnapshot()
        const createdSnapshotRecord = await saveRemotePlannerSnapshot(userId, snapshotToSeed)

        if (!isActive) {
          return
        }

        dispatch({ type: 'hydrateSnapshot', payload: createdSnapshotRecord.snapshot })
        savePlannerCache(userId, createdSnapshotRecord.snapshot)
        resetStoredPlannerSnapshot()
        lastPersistedSnapshotRef.current = JSON.stringify(createdSnapshotRecord.snapshot)
        lastRemoteUpdatedAtRef.current = createdSnapshotRecord.updatedAt
        setLastSyncedAt(createdSnapshotRecord.updatedAt)
        setSyncStatus('ready')
        setIsInitialized(true)
      } catch (error) {
        if (!isActive) {
          return
        }

        const cachedSnapshot = loadPlannerCache(userId)
        if (cachedSnapshot) {
          dispatch({ type: 'hydrateSnapshot', payload: cachedSnapshot })
          lastPersistedSnapshotRef.current = JSON.stringify(cachedSnapshot)
          setSyncStatus('error')
          setSyncError('Could not reach Supabase. Showing the last synced cache for this account.')
          setIsInitialized(true)
          return
        }

        setSyncStatus('error')
        setSyncError(error instanceof Error ? error.message : 'Could not load planner data from Supabase.')
        setIsInitialized(true)
      }
    }

    void bootstrapPlanner()

    return () => {
      isActive = false
    }
  }, [userId])

  useEffect(() => {
    if (!isInitialized) {
      return undefined
    }

    return subscribeToRemotePlannerSnapshot(userId, (record) => {
      const nextSerializedSnapshot = JSON.stringify(record.snapshot)
      if (record.updatedAt === lastRemoteUpdatedAtRef.current) {
        return
      }

      lastRemoteUpdatedAtRef.current = record.updatedAt
      lastPersistedSnapshotRef.current = nextSerializedSnapshot
      savePlannerCache(userId, record.snapshot)
      setLastSyncedAt(record.updatedAt)
      setSyncStatus('ready')
      setSyncError(undefined)

      if (nextSerializedSnapshot !== JSON.stringify(currentSnapshotRef.current)) {
        dispatch({ type: 'hydrateSnapshot', payload: record.snapshot })
      }
    })
  }, [isInitialized, userId])

  const serializedSnapshot = useMemo(() => JSON.stringify(snapshot), [snapshot])

  useEffect(() => {
    if (!isInitialized) {
      return undefined
    }

    if (serializedSnapshot === lastPersistedSnapshotRef.current) {
      return undefined
    }

    setSyncStatus('saving')
    setSyncError(undefined)

    const timeoutId = window.setTimeout(() => {
      void saveRemotePlannerSnapshot(userId, snapshot)
        .then((record) => {
          savePlannerCache(userId, record.snapshot)
          lastPersistedSnapshotRef.current = JSON.stringify(record.snapshot)
          lastRemoteUpdatedAtRef.current = record.updatedAt
          setLastSyncedAt(record.updatedAt)
          setSyncStatus('ready')
          setSyncError(undefined)
        })
        .catch((error) => {
          setSyncStatus('error')
          setSyncError(error instanceof Error ? error.message : 'Could not sync planner changes to Supabase.')
        })
    }, SAVE_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isInitialized, snapshot, serializedSnapshot, userId])

  if (!isInitialized && syncStatus === 'booting') {
    return (
      <AppStatePanel
        title="Loading your planner"
        body="Fetching your Supabase-backed study snapshot and restoring the latest synced state."
        eyebrow="Planner sync"
      />
    )
  }

  if (!isInitialized && syncStatus === 'error') {
    return (
      <AppStatePanel
        title="Planner sync failed"
        body={syncError ?? 'Could not load planner data from Supabase.'}
        eyebrow="Planner sync"
      />
    )
  }

  return (
    <PlannerContext.Provider
      value={{
        plan: studyPlanSeed,
        snapshot,
        viewModel,
        syncStatus,
        syncError,
        lastSyncedAt,
        dispatch,
        actions: {
          setPlanStartDate: (date) => dispatch({ type: 'setPlanStartDate', payload: date }),
          setTaskStatus: (taskId, status) =>
            dispatch({ type: 'setTaskStatus', payload: { taskId, status } }),
          saveTaskNote: (taskId, content) =>
            dispatch({ type: 'saveTaskNote', payload: { taskId, content } }),
          saveReflection: (reflection) => dispatch({ type: 'saveReflection', payload: reflection }),
          toggleWeakTopic: (topicId) => dispatch({ type: 'toggleWeakTopic', payload: topicId }),
          resetPlanner: () => dispatch({ type: 'resetPlanner', payload: today }),
        },
      }}
    >
      {children}
    </PlannerContext.Provider>
  )
}

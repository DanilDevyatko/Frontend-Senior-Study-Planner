import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { PlannerSnapshot } from '../types/planner'
import { getTodayDate } from '../utils/date'

export type SyncStatus = 'booting' | 'ready' | 'saving' | 'error'

export interface RemotePlannerSnapshotRecord {
  userId: string
  snapshot: PlannerSnapshot
  updatedAt: string
}

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  return supabase
}

export function hasPlannerData(snapshot: PlannerSnapshot): boolean {
  return (
    Object.keys(snapshot.taskProgressById).length > 0 ||
    Object.keys(snapshot.taskNotesById).length > 0 ||
    Object.keys(snapshot.reflectionsByWeekId).length > 0 ||
    snapshot.manualWeakTopicIds.length > 0 ||
    Boolean(snapshot.lastActiveDate) ||
    snapshot.planStartDate !== getTodayDate()
  )
}

export async function getRemotePlannerSnapshot(
  userId: string,
): Promise<RemotePlannerSnapshotRecord | null> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('planner_snapshots')
    .select('user_id, snapshot, updated_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  return {
    userId: data.user_id,
    snapshot: data.snapshot,
    updatedAt: data.updated_at,
  }
}

export async function saveRemotePlannerSnapshot(
  userId: string,
  snapshot: PlannerSnapshot,
): Promise<RemotePlannerSnapshotRecord> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('planner_snapshots')
    .upsert(
      {
        user_id: userId,
        snapshot,
      },
      {
        onConflict: 'user_id',
      },
    )
    .select('user_id, snapshot, updated_at')
    .single()

  if (error) {
    throw error
  }

  return {
    userId: data.user_id,
    snapshot: data.snapshot,
    updatedAt: data.updated_at,
  }
}

export function subscribeToRemotePlannerSnapshot(
  userId: string,
  onChange: (record: RemotePlannerSnapshotRecord) => void,
): () => void {
  const client = requireSupabase()
  const channel: RealtimeChannel = client
    .channel(`planner-snapshot:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'planner_snapshots',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const nextRecord = payload.new as {
          user_id?: string
          snapshot?: PlannerSnapshot
          updated_at?: string
        }

        if (!nextRecord.user_id || !nextRecord.snapshot || !nextRecord.updated_at) {
          return
        }

        onChange({
          userId: nextRecord.user_id,
          snapshot: nextRecord.snapshot,
          updatedAt: nextRecord.updated_at,
        })
      },
    )
    .subscribe()

  return () => {
    void client.removeChannel(channel)
  }
}

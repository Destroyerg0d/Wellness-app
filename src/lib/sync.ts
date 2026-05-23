import type { UserState } from '../types'
import { supabase } from './supabase'

// Single-user app: one fixed row holds the whole state.
const ROW_ID = 'shreya'

export async function fetchRemoteState(): Promise<UserState | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.from('app_state').select('state').eq('id', ROW_ID).maybeSingle()
    if (error || !data) return null
    return data.state as UserState
  } catch {
    return null
  }
}

export async function pushRemoteState(state: UserState): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('app_state').upsert({ id: ROW_ID, state, updated_at: state.updatedAt })
  } catch {
    /* offline / not configured — local copy is the source of truth */
  }
}

export async function savePushSubscription(sub: PushSubscriptionJSON): Promise<void> {
  if (!supabase || !sub.endpoint) return
  try {
    await supabase
      .from('push_subscriptions')
      .upsert({ endpoint: sub.endpoint, subscription: sub }, { onConflict: 'endpoint' })
  } catch {
    /* ignore */
  }
}

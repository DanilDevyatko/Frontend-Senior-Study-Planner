import type { Session, User } from '@supabase/supabase-js'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'misconfigured'

export interface AuthActionResult {
  error?: string
  message?: string
  needsEmailConfirmation?: boolean
}

export interface AuthState {
  status: AuthStatus
  session: Session | null
  user: User | null
  isRecoveryMode: boolean
  configError?: string
}

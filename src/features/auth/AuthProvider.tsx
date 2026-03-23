import type { PropsWithChildren } from 'react'
import { useEffect, useMemo, useState } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase, supabaseConfigError } from '../../lib/supabase'
import { AuthContext } from './AuthContext'
import type { AuthActionResult, AuthState } from './authTypes'

function toAuthResult(error: { message?: string } | null, fallbackMessage?: string): AuthActionResult {
  if (!error) {
    return fallbackMessage ? { message: fallbackMessage } : {}
  }

  return {
    error: error.message ?? 'Something went wrong.',
  }
}

function getInitialAuthState(): AuthState {
  if (!supabase) {
    return {
      status: 'misconfigured',
      session: null,
      user: null,
      isRecoveryMode: false,
      configError: supabaseConfigError ?? undefined,
    }
  }

  return {
    status: 'loading',
    session: null,
    user: null,
    isRecoveryMode: false,
  }
}

function deriveAuthState(session: Session | null, isRecoveryMode: boolean): Pick<AuthState, 'status' | 'session' | 'user' | 'isRecoveryMode'> {
  return {
    status: session ? 'authenticated' : 'unauthenticated',
    session,
    user: session?.user ?? null,
    isRecoveryMode,
  }
}

function isPasswordRecoveryEvent(event: AuthChangeEvent): boolean {
  return event === 'PASSWORD_RECOVERY'
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>(getInitialAuthState)

  useEffect(() => {
    if (!supabase) {
      return undefined
    }

    let isActive = true

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isActive) {
        return
      }

      if (error) {
        setState({
          status: 'unauthenticated',
          session: null,
          user: null,
          isRecoveryMode: false,
        })
        return
      }

      setState((current) => ({
        ...current,
        ...deriveAuthState(data.session, current.isRecoveryMode),
      }))
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isActive) {
        return
      }

      setState((current) => ({
        ...current,
        ...deriveAuthState(session, isPasswordRecoveryEvent(event) || (current.isRecoveryMode && event !== 'SIGNED_OUT')),
      }))
    })

    return () => {
      isActive = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      actions: {
        clearRecoveryMode: () => {
          setState((current) => ({
            ...current,
            isRecoveryMode: false,
          }))
        },
        sendPasswordReset: async (email: string) => {
          if (!supabase) {
            return { error: supabaseConfigError ?? 'Supabase is not configured.' }
          }

          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth`,
          })

          return toAuthResult(error, 'Password reset email sent. Check your inbox.')
        },
        signIn: async (email: string, password: string) => {
          if (!supabase) {
            return { error: supabaseConfigError ?? 'Supabase is not configured.' }
          }

          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          return toAuthResult(error)
        },
        signOut: async () => {
          if (!supabase) {
            return { error: supabaseConfigError ?? 'Supabase is not configured.' }
          }

          const { error } = await supabase.auth.signOut()

          return toAuthResult(error)
        },
        signUp: async (email: string, password: string) => {
          if (!supabase) {
            return { error: supabaseConfigError ?? 'Supabase is not configured.' }
          }

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          })

          if (error) {
            return toAuthResult(error)
          }

          const needsEmailConfirmation = !data.session
          return {
            message: needsEmailConfirmation
              ? 'Account created. Check your email to confirm the account, then sign in.'
              : 'Account created and signed in.',
            needsEmailConfirmation,
          }
        },
        updatePassword: async (password: string) => {
          if (!supabase) {
            return { error: supabaseConfigError ?? 'Supabase is not configured.' }
          }

          const { error } = await supabase.auth.updateUser({
            password,
          })

          if (!error) {
            setState((current) => ({
              ...current,
              isRecoveryMode: false,
            }))
          }

          return toAuthResult(error, 'Password updated. You can continue into the planner.')
        },
      },
    }),
    [state],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

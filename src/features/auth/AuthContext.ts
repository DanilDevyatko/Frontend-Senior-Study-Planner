import { createContext } from 'react'
import type { AuthActionResult, AuthState } from './authTypes'

export interface AuthContextValue extends AuthState {
  actions: {
    signIn: (email: string, password: string) => Promise<AuthActionResult>
    signUp: (email: string, password: string) => Promise<AuthActionResult>
    sendPasswordReset: (email: string) => Promise<AuthActionResult>
    updatePassword: (password: string) => Promise<AuthActionResult>
    signOut: () => Promise<AuthActionResult>
    clearRecoveryMode: () => void
  }
}

export const AuthContext = createContext<AuthContextValue | null>(null)

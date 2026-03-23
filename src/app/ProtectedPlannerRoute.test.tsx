import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { ProtectedPlannerRoute } from './ProtectedPlannerRoute'
import type { AuthStatus } from '../features/auth/authTypes'

interface MockAuthState {
  status: AuthStatus
  session: null
  user: {
    id: string
    email: string
  } | null
  isRecoveryMode: boolean
  configError: string | undefined
  actions: {
    clearRecoveryMode: ReturnType<typeof vi.fn>
    sendPasswordReset: ReturnType<typeof vi.fn>
    signIn: ReturnType<typeof vi.fn>
    signOut: ReturnType<typeof vi.fn>
    signUp: ReturnType<typeof vi.fn>
    updatePassword: ReturnType<typeof vi.fn>
  }
}

const mockAuthState = vi.hoisted<MockAuthState>(() => ({
  status: 'authenticated',
  session: null,
  user: {
    id: 'test-user',
    email: 'planner@example.com',
  },
  isRecoveryMode: false,
  configError: undefined as string | undefined,
  actions: {
    clearRecoveryMode: vi.fn(),
    sendPasswordReset: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    signUp: vi.fn(),
    updatePassword: vi.fn(),
  },
}))

vi.mock('../features/auth/useAuth', () => ({
  useAuth: () => mockAuthState,
}))

vi.mock('../features/planner/PlannerProvider', () => ({
  PlannerProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

describe('ProtectedPlannerRoute', () => {
  beforeEach(() => {
    mockAuthState.status = 'authenticated'
    mockAuthState.user = {
      id: 'test-user',
      email: 'planner@example.com',
    }
    mockAuthState.isRecoveryMode = false
    mockAuthState.configError = undefined
  })

  it('redirects unauthenticated users to the auth route', async () => {
    mockAuthState.status = 'unauthenticated'
    mockAuthState.user = null

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/auth" element={<p>Auth route</p>} />
          <Route element={<ProtectedPlannerRoute />}>
            <Route path="/dashboard" element={<p>Dashboard route</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Auth route')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard route')).not.toBeInTheDocument()
  })

  it('renders protected content for authenticated users', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/auth" element={<p>Auth route</p>} />
          <Route element={<ProtectedPlannerRoute />}>
            <Route path="/dashboard" element={<p>Dashboard route</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Dashboard route')).toBeInTheDocument()
    expect(screen.queryByText('Auth route')).not.toBeInTheDocument()
  })
})

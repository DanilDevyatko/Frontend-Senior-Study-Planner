import type { PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import type { AuthStatus } from '../features/auth/authTypes'

interface MockAuthState {
  status: AuthStatus
  session: null
  user: {
    id: string
    email: string
  } | null
  isRecoveryMode: boolean
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
  actions: {
    clearRecoveryMode: vi.fn(),
    sendPasswordReset: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    signUp: vi.fn(),
    updatePassword: vi.fn(),
  },
}))

const mockPlannerRepository = vi.hoisted(() => ({
  getRemotePlannerSnapshot: vi.fn(),
  hasPlannerData: vi.fn(() => false),
  saveRemotePlannerSnapshot: vi.fn(),
  subscribeToRemotePlannerSnapshot: vi.fn(() => () => {}),
}))

vi.mock('../features/auth/AuthProvider', () => ({
  AuthProvider: ({ children }: PropsWithChildren) => <>{children}</>,
}))

vi.mock('../features/auth/useAuth', () => ({
  useAuth: () => mockAuthState,
}))

vi.mock('../storage/plannerRepository', () => mockPlannerRepository)

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
    mockAuthState.status = 'authenticated'
    mockAuthState.user = {
      id: 'test-user',
      email: 'planner@example.com',
    }
    mockAuthState.isRecoveryMode = false
    mockPlannerRepository.getRemotePlannerSnapshot.mockResolvedValue({
      userId: 'test-user',
      snapshot: {
        storageVersion: 1,
        planStartDate: '2026-03-23',
        taskProgressById: {},
        taskNotesById: {},
        reflectionsByWeekId: {},
        manualWeakTopicIds: [],
      },
      updatedAt: '2026-03-23T09:00:00.000Z',
    })
    mockPlannerRepository.saveRemotePlannerSnapshot.mockResolvedValue({
      userId: 'test-user',
      snapshot: {
        storageVersion: 1,
        planStartDate: '2026-03-23',
        taskProgressById: {},
        taskNotesById: {},
        reflectionsByWeekId: {},
        manualWeakTopicIds: [],
      },
      updatedAt: '2026-03-23T09:00:00.000Z',
    })
  })

  it('renders the roadmap shell with seeded weeks after auth', async () => {
    window.history.pushState({}, '', '/roadmap')

    render(<App />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'A clean 12-week view of the full journey.' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'JavaScript Execution and Closures' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Final Production-Grade Project' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Select a week')).toBeInTheDocument()
  })

  it('opens a week detail route inside the roadmap workspace', async () => {
    window.history.pushState({}, '', '/roadmap/week-1')

    render(<App />)

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Week summary' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save reflection' })).toBeInTheDocument()
  })
})

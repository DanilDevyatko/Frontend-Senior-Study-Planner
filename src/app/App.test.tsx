import type { PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    expect(screen.queryByRole('link', { name: 'Open details' })).not.toBeInTheDocument()
  })

  it('keeps the dashboard focused on the core study surfaces', async () => {
    window.history.pushState({}, '', '/dashboard')

    render(<App />)

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'See where you are, what to do next, and how well you are progressing.',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Overall progress' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: "Today's task" })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'Progress signals' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'Next milestone' })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Daily routine and senior habits' }),
    ).not.toBeInTheDocument()
  })

  it('opens a week detail route when a roadmap row is clicked', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/roadmap')

    render(<App />)

    await screen.findByRole('heading', { level: 1, name: 'A clean 12-week view of the full journey.' })

    const weekLink = screen.getByText('JavaScript Execution and Closures').closest('a')

    expect(weekLink).not.toBeNull()

    await user.click(weekLink!)

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Week summary' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save reflection' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/roadmap/week-1')
    expect(weekLink).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: 'Open details' })).not.toBeInTheDocument()
  })

  it('adds clear weak-topic tooltips on topics and roadmap detail actions', async () => {
    window.history.pushState({}, '', '/topics')

    const { unmount } = render(<App />)

    const topicsWeakButton = await screen.findByTitle('Mark JavaScript as a weak topic for review')

    expect(topicsWeakButton).toHaveTextContent('Mark weak')
    expect(topicsWeakButton).toHaveAttribute('aria-label', 'Mark JavaScript as weak for review')

    unmount()
    window.history.pushState({}, '', '/roadmap/week-1')

    render(<App />)

    const roadmapWeakButton = await screen.findByTitle('Mark JavaScript as a weak topic for review')

    expect(roadmapWeakButton).toHaveTextContent('Mark weak')
    expect(roadmapWeakButton).toHaveAttribute('aria-label', 'Mark JavaScript as weak for review')
  })
})

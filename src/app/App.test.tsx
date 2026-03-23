import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('renders the roadmap shell with all seeded weeks available', async () => {
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
})

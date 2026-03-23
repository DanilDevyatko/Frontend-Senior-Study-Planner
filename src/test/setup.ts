import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

class ResizeObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

class IntersectionObserverMock {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = []

  disconnect() {}

  observe() {}

  takeRecords() {
    return []
  }

  unobserve() {}
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = IntersectionObserverMock as typeof IntersectionObserver
}

if (typeof HTMLMediaElement !== 'undefined') {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    writable: true,
    value: vi.fn().mockResolvedValue(undefined),
  })

  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    writable: true,
    value: vi.fn(),
  })
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
})

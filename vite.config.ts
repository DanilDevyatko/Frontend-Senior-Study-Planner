import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Supabase's current package chain expects `tslib`, but the install in this
      // environment does not materialize that package reliably for Rolldown.
      tslib: fileURLToPath(new URL('./src/vendor/tslib.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})

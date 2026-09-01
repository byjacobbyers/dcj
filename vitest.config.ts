import { defineConfig } from 'vitest/config'
import path from 'node:path'

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= 'test'
process.env.NEXT_PUBLIC_SANITY_DATASET ??= 'production'
process.env.NEXT_PUBLIC_SITE_URL ??= 'https://example.com'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})

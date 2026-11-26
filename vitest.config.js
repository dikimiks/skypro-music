import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '/img': fileURLToPath(new URL('./public/img/', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      include: ['utils/music.js'],
      reporter: ['text', 'json'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
})

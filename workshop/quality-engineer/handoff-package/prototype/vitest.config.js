/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    exclude: ['tests/**/*.spec.js', 'test-results/**', './node_modules/**']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './frontend/src')
    }
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // Base path: use VITE_BASE env var when set (for GitHub Pages), otherwise '/'
  base: process.env.VITE_BASE || '/',
  server: {
    host: true,
    port: 3000
  }
})

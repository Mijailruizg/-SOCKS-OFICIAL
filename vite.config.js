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
  base: process.env.VITE_BASE || '/',
  server: {
    host: '0.0.0.0',
    port: 3002
  },
  build: {
    chunkSizeWarningLimit: 2000
  }
})

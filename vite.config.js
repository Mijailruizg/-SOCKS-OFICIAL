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
  // Ensure correct asset paths when publishing to GitHub Pages under a repo path
  base: '/-SOCKS-OFICIAL/',
  server: {
    host: true,
    port: 3000
  }
})

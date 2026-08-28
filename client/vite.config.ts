import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/auth': 'http://localhost:8888',
      '/api': 'http://localhost:8888',
      '/contributors': 'http://localhost:8888',
      '/transactions': 'http://localhost:8888',
    },
  },
  base: '/dabba-fund/'
})

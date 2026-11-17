import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5122',
      '/thumbnail': 'http://localhost:5122',
      '/process': 'http://localhost:5122',
      '/videos': 'http://localhost:5122',
      '/results': 'http://localhost:5122',
    },
  },
})

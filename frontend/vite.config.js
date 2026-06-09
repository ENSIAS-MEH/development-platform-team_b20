import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user-service': 'http://localhost:8080',
      '/event-service': 'http://localhost:8080',
      '/interaction-service': 'http://localhost:8080',
      '/admin-service': 'http://localhost:8080',
      '/recommendation-service': 'http://localhost:8080',
    }
  }
})
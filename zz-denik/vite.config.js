import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true, // Toto umožní prístup z mobilu cez sieť
    proxy: {
      '/api': 'http://localhost:8787'
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    proxy: {
      '/ws': {
        target: 'ws://beefbox.local:8080',
        ws: true,
      },
      '/stream': {
        target: 'http://beefbox.local:8080'
      }
    }
  },
})

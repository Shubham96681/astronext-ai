import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /* Keep images as separate files — avoids base64 inside JS (slow parse + delayed paint) */
  build: {
    assetsInlineLimit: 0,
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // Skip host validation — works with Cloudflare tunnels, ngrok, LAN, etc.
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts: true,
  },
})

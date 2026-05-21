import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({ jsxImportSource: '@emotion/react' }),
    tailwindcss(),
  ],
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

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Jonli-dars API manzili (src/live/liveClient.js). Bo'sh → prod (api.azizbek.site).
  // Lokal: DARS_API_URL=http://127.0.0.1:3001 npx vite --port 5300
  define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// MENTOR KURSI (F-1029-02) — ovozli JSX darslar, lokal dev.
// Dars fayllari platformaning '@lesson/runtime' SDK'sidan import qiladi (useAudio/useSfx/…);
// lokalda bu import src/mentor-kurs/dev/lesson-runtime.jsx shim'iga yo'naltiriladi, ovoz esa
// dev TTS-serverdan keladi (feedback/F-1029-02-mentor-kurs/dev/tts-server.py, :5332).
// Ishga tushirish: python3 feedback/F-1029-02-mentor-kurs/dev/tts-server.py 5332 &
//                  npx vite --config vite.mentor-kurs.config.js --port 5333 --strictPort → /mentor-kurs.html
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@lesson/runtime': resolve(__dirname, 'src/mentor-kurs/dev/lesson-runtime.jsx') } },
  server: { port: 5333, strictPort: true, open: '/mentor-kurs.html', proxy: { '/tts': { target: 'http://127.0.0.1:5332', changeOrigin: true } } },
  build: { outDir: 'dist-mentor-kurs', rollupOptions: { input: resolve(__dirname, 'mentor-kurs.html') } },
})

/* eslint-env node */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const cwd = new URL('.', import.meta.url).pathname
  const env = loadEnv(mode, cwd, '')

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_GOOGLE_MAPS_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_KEY || ''),
    },
  }
})

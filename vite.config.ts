import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      verboseFileRoutes: false,
    }),
    react(),
  ],
  server: {
    host: true, // もしくは "0.0.0.0"
    port: 5173, // 必要に応じて変更
  },
})
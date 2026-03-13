import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Habit-Seed/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // 生产环境也生成 source map
  }
})
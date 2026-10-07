import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativa: funciona igual en GitHub Pages (subcarpeta del repo) y en Vercel (raíz).
export default defineConfig({
  base: './',
  plugins: [react()],
})

import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // Temporarily disable @vitejs/plugin-react (Babel) to avoid dev parse errors
  plugins: [
    // react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'tailwindcss/version.js': 'tailwindcss/package.json',
    },
  },
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.cjs'),
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  server: {
    host: true,
    port: 3000
  }
})

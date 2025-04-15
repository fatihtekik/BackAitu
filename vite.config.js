// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      // чтобы import Foo from '@/components/Foo' резолвилось в src/components/Foo
      '@': path.resolve(__dirname, 'src'),

      // ваш старый алиас для tailwindcss/version.js
      'tailwindcss/version.js': 'tailwindcss/package.json',
    },
  },
  css: {
    // опционально: явно указываем PostCSS‑конфиг
    postcss: path.resolve(__dirname, 'postcss.config.cjs'),
  },
  server: {
    host: true, // сервер будет доступен по IP-адресу
    port: 3000  // (опционально) указание порта
  }
})

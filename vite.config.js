import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'GoCelebrate',
        short_name: 'GoCelebrate',
        description: 'Plan your perfect celebration',
        theme_color: '#e91e8c',
        background_color: '#fff0f6',
        display: 'standalone',
        start_url: '/',
        icons: [
  {
    src: '/icon-512.png',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: '/icon-512.png',
    sizes: '512x512',
    type: 'image/png',
  },
],

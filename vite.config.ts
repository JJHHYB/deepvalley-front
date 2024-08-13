import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DeepValley PWA App',
        short_name: 'DeepValley',
        description: 'My awesome Progressive Web App!',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: './src/assets/icons/AppIcon/maskable_icon_x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: './src/assets/icons/AppIcon/maskable_icon_x48.png',
            sizes: '48x48',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: './src/assets/icons/AppIcon/maskable_icon_x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: './src/assets/icons/AppIcon/maskable_icon_x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});

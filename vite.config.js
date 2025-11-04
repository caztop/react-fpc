import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ViteSitemapPlugin from 'vite-plugin-sitemap'; // ✅ default import로 수정

export default defineConfig({
  plugins: [
    react(),
    ViteSitemapPlugin({
      hostname: 'https://www.fpc-wp.com',
      routes: [
        '/',
        '/about',
        '/consulting',
        '/education',
        '/contact'
      ]
    })
  ]
});
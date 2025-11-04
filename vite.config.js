import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ViteSitemapPlugin from 'vite-plugin-sitemap';
import { copyFileSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    ViteSitemapPlugin({
      hostname: 'https://www.fpc-wp.com',
      routes: ['/', '/about', '/consulting', '/education', '/contact']
    }),
    {
      name: 'copy-robots',
      closeBundle() {
        copyFileSync('public/robots.txt', 'dist/robots.txt');
      }
    }
  ]
});
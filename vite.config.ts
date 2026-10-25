import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Automatically detect if building for Cloudflare Pages (or custom domain) vs GitHub Pages
const isCloudflare = process.env.CF_PAGES === '1' || process.env.DEPLOY_TARGET === 'cloudflare';

export default defineConfig({
  plugins: [react()],
  base: isCloudflare ? '/' : '/sakura-nihongo/',
});

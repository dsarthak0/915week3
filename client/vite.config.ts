import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Make sure this is here if you use @ aliases

export default defineConfig({
  // Add this line - MUST match your repository name exactly
  base: "/Week-3-GrowwApp/", 
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api-proxy': {
        target: 'https://preprodapisix.omnenest.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, ''),
        secure: false,
      },
    },
  },
});
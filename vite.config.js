// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import path from 'path'; // For path aliasing

export default defineConfig({
  plugins: [react(), eslint()],
  resolve: { // For path aliasing like @/
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173, // Default Vite port
  }, 
  

});



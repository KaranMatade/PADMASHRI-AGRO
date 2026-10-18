import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Use '/' for custom domain deployments (not './' which breaks absolute paths)
  base: '/',

  server: {
    port: 3000,
    host: true
  },

  build: {
    // Disable source maps in production — prevents exposing source code
    sourcemap: false,

    // Increase chunk size warning threshold to 600kB (was 500kB)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Manual chunk splitting to reduce the main JS bundle
        manualChunks: {
          // Core React runtime — rarely changes, long-lived cache
          'react-vendor': ['react', 'react-dom'],
          // Router — separate chunk
          'router': ['react-router-dom'],
          // UI icons — lucide-react is large, isolate it
          'icons': ['lucide-react'],
          // Toast notifications
          'toast': ['sonner'],
          // Drawer component
          'drawer': ['vaul'],
        }
      }
    }
  }
})

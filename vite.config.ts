import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ExCADvate/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          vendor: ['react', 'react-dom', 'zustand', 'lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['opencascade.js']
  },
  server: {
    port: 3000,
    open: true
  }
})

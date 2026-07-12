import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':            path.resolve(__dirname, './src'),
      '@api':         path.resolve(__dirname, './src/api'),
      '@components':  path.resolve(__dirname, './src/components'),
      '@context':     path.resolve(__dirname, './src/context'),
      '@hooks':       path.resolve(__dirname, './src/hooks'),
      '@pages':       path.resolve(__dirname, './src/pages'),
      '@utils':       path.resolve(__dirname, './src/utils'),
      // bare aliases used by vehicle/driver form pages
      'components':   path.resolve(__dirname, './src/components'),
      'api':          path.resolve(__dirname, './src/api'),
      'utils':        path.resolve(__dirname, './src/utils'),
      'hooks':        path.resolve(__dirname, './src/hooks'),
    },
  },
})

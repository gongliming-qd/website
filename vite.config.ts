import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {  
    rollupOptions: {
        output: {
            entryFileNames: 'assets/jmx-[hash].js',
            chunkFileNames: 'assets/jmx-[name]-[hash].js',
            assetFileNames: 'assets/jmx-[name]-[hash].[ext]'
        }
    },
    sourcemap: 'inline',
  },
  resolve: {
    alias: {
        '@': resolve(__dirname, './src'),
        comps: resolve(__dirname, './src/components')
    }
},
})

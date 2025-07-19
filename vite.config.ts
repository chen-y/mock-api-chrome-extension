import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'

import manifest from './src/manifest'
import { manifestPlugin } from './plugins/manifest-plugin'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {
        // input: {
        //   setup: 'src/setup.ts',
        // },
        output: {
          chunkFileNames: 'assets/chunk-[hash].js',
        },
      },
    },
    plugins: [crx({ manifest }), manifestPlugin(manifest), react()],
    legacy: {
      skipWebSocketTokenCheck: true,
    },
  }
})

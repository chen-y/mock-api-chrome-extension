// import { defineConfig, build } from 'vite'
// import { crx } from '@crxjs/vite-plugin'
// import react from '@vitejs/plugin-react'

// import manifest from './src/manifest'
// import { manifestPlugin } from './plugins/manifest-plugin'
// import {} from 'rollup';
import typescript from 'rollup-plugin-typescript2'

// https://vitejs.dev/config/
// export default defineConfig(({ mode }) => {
//   return {
//     build: {
//       emptyOutDir: true,
//       // outDir: 'build',
//       rollupOptions: {
//         input: {
//           setup: 'src/setup.ts',
//         },
//         output: {
//           file: 'src/setup.js',
//           format: 'iife', // 立即执行函数格式
//           // name: 'MyBundle',
//         },
//       },
//     },
//     // plugins: [crx({ manifest }), manifestPlugin(manifest), react()],
//     legacy: {
//       skipWebSocketTokenCheck: true,
//     },
//   }
// })

export default {
  input: 'src/setup.ts',
  output: {
    file: 'build/src/setup.js',
    format: 'iife',
    name: 'apiProxySetup',
    globals: {
      mockjs: 'mockjs',
    },
  },
  plugins: [typescript()],
}

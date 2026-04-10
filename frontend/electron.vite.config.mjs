import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        'react-native': 'react-native-web',
        'react-native/Libraries/Utilities/codegenNativeComponent': resolve('src/renderer/src/mock.js'),
        'react-native/Libraries/Image/AssetRegistry': resolve('src/renderer/src/mock.js'),
      },
      extensions: ['.web.js', '.web.jsx', '.web.tsx', '.web.ts', '.js', '.jsx', '.ts', '.tsx']
    },
    plugins: [react()],
    optimizeDeps: {
      esbuildOptions: {
        resolveExtensions: ['.web.js', '.web.jsx', '.web.tsx', '.web.ts', '.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
})

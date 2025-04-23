import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  // server: {
  //   port: 3000,
  //   cors: true,
  // }
})

// export default defineConfig({
//   base: '/',
//   plugins: [react()],
//   build: {
//     sourcemap: true,
//   },
//   preview: {
//     port: 5173,
//     host: true,
//     strictPort: true,
//   },
//   server: {
//     port: 5173,
//     host: true,
//     strictPort: true,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3080',
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   }
// })

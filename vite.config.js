import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue2'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'

const config = defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not ie < 9'],
    })
  ],
  build: {
    minify: true,
  },
  resolve: {
	extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
      '~boxicons': 'boxicons',
      '~sweetalert2': 'sweetalert2'
    },
  },
})
export default config
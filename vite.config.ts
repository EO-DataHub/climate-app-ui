import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      svgr(),
      react(),
      {
        name: 'markdown-loader',
        transform(code, id) {
          if (id.endsWith('.md')) {
            // For .md files, get the raw content
            return `export default ${JSON.stringify(code)};`
          }
        },
      },
    ],
    base: `${env.VITE_BASE_PATH}`,
  }
})

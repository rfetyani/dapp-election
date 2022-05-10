import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'
import { createHtmlPlugin } from 'vite-plugin-html'
import inject from '@rollup/plugin-inject'
import viteCompression from 'vite-plugin-compression'

export default defineConfig(async () => {
  const { default: stdLibBrowser } = await import('node-stdlib-browser')
  return {
    resolve: {
      alias: stdLibBrowser,
    },
    optimizeDeps: {
      include: ['buffer', 'process'],
    },
    plugins: [
      {
        ...inject({
          global: [
            require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
            'global',
          ],
          process: [
            require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
            'process',
          ],
          Buffer: [
            require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
            'Buffer',
          ],
        }),
        enforce: 'post',
      },
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: [
            '@emotion/babel-plugin',
            [
              'babel-plugin-import',
              {
                libraryName: '@mui/material',
                libraryDirectory: '',
                camel2DashComponentName: false,
              },
              'core',
            ],
            [
              'babel-plugin-import',
              {
                libraryName: '@mui/icons-material',
                libraryDirectory: '',
                camel2DashComponentName: false,
              },
              'icons',
            ],
          ],
        },
      }),
      tsconfigPaths(),
      VitePWA({}),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: 'Epics dApp boilerplate',
            domain: 'dapp-boilerplate.epics.dev',
            themeColor: '#ffffff',
            safariColor: '#39a845',
            twitterAccount: '@EpicsDAO',
          },
        },
      }),
      viteCompression(),
    ],
  }
})

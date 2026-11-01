import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from "rollup-plugin-visualizer";
import importToCDN from 'vite-plugin-cdn-import'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import legacyPlugin from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    vue(),
    importToCDN({
      // 资源已全部本地化到 public/assets/cdn 目录，不再依赖外部 CDN，防止链接失效
      prodUrl: './assets/cdn/{name}/{version}/{path}',
      modules: [
        {
          name: "echarts",
          var: "echarts",
          version: "5.4.3",
          path: "echarts.min.js",
        },
        {
          name: 'vue',
          var: 'Vue',
          version: '3.3.4',
          path: `vue.runtime.global.prod.min.js`,
        },
        {
          name: 'element-plus',
          var: 'ElementPlus',
          version: '2.3.14',
          path: `index.full.min.js`,
          css: 'index.min.css'
        },
      ],
    }),
    // cssInjectedByJsPlugin(), // css注入插件 会导致字体路径异常
    legacyPlugin({
      targets:['chrome 52'],  // 需要兼容的目标列表，可以设置多个
      additionalLegacyPolyfills:['regenerator-runtime/runtime'] // 面向IE11时需要此插件
    }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: "visualizer.html",
      template :"sunburst",
      open:false
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build:{
    assetsDir: 'assets',
    assetsInlineLimit: 8 * 1024,
    // rollupOptions:{
    //   manualChunks(id){
    //     if(id.includes('node_modules')){
    //       return "vendor"
    //     }
    //   }
    // }
  },
  server: {
    open: true,
    port: 3005,
    host: '0.0.0.0'
  },
  base: './'
})

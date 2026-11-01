import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from "rollup-plugin-visualizer";
import legacyPlugin from '@vitejs/plugin-legacy'

// 注意：vue / element-plus / echarts 均由 vite 直接打包进产物（不使用 CDN 外挂文件），
// 避免构建环境依赖版本变化导致引用不存在的文件而白屏（Cloudflare Pages 上出现过）。

export default defineConfig({
  plugins: [
    vue(),
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
    rollupOptions:{
      manualChunks(id){
        if(id.includes('node_modules')){
          return "vendor"
        }
      }
    }
  },
  server: {
    open: true,
    port: 3005,
    host: '0.0.0.0'
  },
  base: './'
})

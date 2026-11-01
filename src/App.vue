<template>
  <el-container>
    <el-header class="glass-header">
      <div class="header-inner">
        <div class="brand">
          <div class="icon">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M568.96 459.242667l144-189.205334A382.208 382.208 0 0 0 512 213.333333c-212.074667 0-384 171.925333-384 384a382.293333 382.293333 0 0 0 93.397333 251.008l-64.554666 55.808A467.584 467.584 0 0 1 42.666667 597.333333C42.666667 338.133333 252.8 128 512 128c93.098667 0 179.861333 27.093333 252.842667 73.856l75.882666-99.690667 67.541334 51.413334-273.28 359.04a149.333333 149.333333 0 1 1-66.048-53.376z m266.453333-69.056l54.357334-71.424A467.242667 467.242667 0 0 1 981.333333 597.333333c0 113.706667-40.64 221.226667-113.237333 305.728l-64.725333-55.616A382.272 382.272 0 0 0 896 597.333333c0-76.288-22.250667-147.370667-60.586667-207.146666zM512 661.333333a64 64 0 1 0 0-128 64 64 0 0 0 0 128z"
                fill="#ffffff" />
            </svg>
          </div>
          <span class="title">哈基测速面板</span>
        </div>
        <div class="theme-switch" role="group" aria-label="主题切换">
          <button v-for="opt in themeOptions" :key="opt.value" type="button" class="theme-btn"
            :class="{ active: themeMode === opt.value }" :title="opt.tip" @click="setThemeMode(opt.value)">
            <el-icon :size="16">
              <component :is="opt.icon" />
            </el-icon>
            <span>{{ opt.label }}</span>
          </button>
        </div>
      </div>
    </el-header>
    <el-main>
      <MainUI :isVisible="isVisible" />
      <br>
      <IPinfoUI :isVisible="isVisible" />
    </el-main>
    <div style="height: fit-content;padding-bottom: 10px;"></div>
  </el-container>
</template>
<script lang="ts" setup>
import MainUI from "./components/Main.vue"
import IPinfoUI from "./components/IPinfo.vue"
import { ref, type Component } from 'vue'
import { Monitor, Sunny, Moon } from '@element-plus/icons-vue'
import { themeMode, setThemeMode, type ThemeMode } from './theme'

const themeOptions: { value: ThemeMode; label: string; tip: string; icon: Component }[] = [
  { value: 'auto', label: '跟随系统', tip: '主题跟随系统深浅色自动切换', icon: Monitor },
  { value: 'light', label: '浅色', tip: '始终使用浅色主题', icon: Sunny },
  { value: 'dark', label: '深色', tip: '始终使用深色主题', icon: Moon },
]

const isVisible = ref(true)
document.addEventListener("visibilitychange", function () {
  var string = document.visibilityState
  if (string === 'hidden') isVisible.value = false
  else isVisible.value = true
})
</script>
<style scoped>
a {
  color: #007aff;
}
.glass-header {
  height: fit-content;
  padding-bottom: 12px;
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
.header-inner {
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.brand {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 10px;
}
.title {
  color: #1d1d1f;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.3px;
}
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
.icon svg {
  width: 24px;
  height: 24px;
}
/* 主题切换按钮 */
.theme-switch {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.theme-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  cursor: pointer;
  padding: 7px 14px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 9px;
  background: transparent;
  color: #6e6e73;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.theme-btn:hover {
  color: #1d1d1f;
  background: rgba(0, 0, 0, 0.05);
}
.theme-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.35);
}
html.dark .glass-header {
  background: rgba(28, 28, 30, 0.6) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
html.dark .title {
  color: #f5f5f7;
}
html.dark a {
  color: #0a84ff;
}
html.dark .theme-switch {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
}
html.dark .theme-btn {
  color: #98989d;
}
html.dark .theme-btn:hover {
  color: #f5f5f7;
  background: rgba(255, 255, 255, 0.08);
}
html.dark .theme-btn.active {
  color: #ffffff;
}
</style>

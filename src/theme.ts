import { ref } from 'vue'

export type ThemeMode = 'auto' | 'light' | 'dark'

const media = window.matchMedia('(prefers-color-scheme: dark)')

function readStored(): ThemeMode {
  const v = localStorage.getItem('theme')
  return v === 'light' || v === 'dark' ? v : 'auto'
}

// 当前用户选择的主题模式，默认 auto = 跟随系统
export const themeMode = ref<ThemeMode>(readStored())
// 实际生效的深浅色状态（给 ECharts 等需要 JS 判断的组件使用）
export const isDark = ref(false)

export function applyTheme() {
  const dark = themeMode.value === 'dark' || (themeMode.value === 'auto' && media.matches)
  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)
  // 让浏览器原生控件（滚动条/表单）配色跟随当前主题
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  // 同步移动端浏览器地址栏配色
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', dark ? '#0a0e27' : '#e8f0fe')
}

export function setThemeMode(mode: ThemeMode) {
  themeMode.value = mode
  localStorage.setItem('theme', mode)
  applyTheme()
}

// 跟随系统时，随系统主题实时切换
media.addEventListener('change', () => {
  if (themeMode.value === 'auto') applyTheme()
})

applyTheme()

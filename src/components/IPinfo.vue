<template>
    <div class="radius card"
          :style="{borderRadius:`var(--el-border-radius-round)`}">
        <div style="text-align: center;">
          <transition name="el-fade-in">
            <div v-loading="loadingLocal" v-if="localInfo">
                <el-tooltip class="item" effect="dark" :content="localInfo.ip" placement="top">
                    <div @click="copy(localInfo.ip)">
                        <el-tag style="width: 50px;" class="ml-2" type="success">{{ localLay?localLay+"ms":"-ms" }}</el-tag>
                        <el-text style="cursor: pointer;margin-left: 5px;white-space:nowrap;vertical-align: -1px;" class="font-background">{{ localInfo.address }}</el-text>
                    </div>
                </el-tooltip>
            </div>
          </transition>
          <transition name="el-fade-in">
              <div v-loading="loadingGlobal" v-if="globalInfo">
                  <el-tooltip class="item" effect="dark" :content="globalInfo.ip" placement="top">
                      <div @click="copy(globalInfo.ip)">
                          <el-tag style="width: 50px;" class="ml-2" type="success">{{ globalLay?globalLay+"ms":"-ms" }}</el-tag>
                          <el-text style="cursor: pointer;margin-left: 5px;white-space:nowrap;vertical-align: -3px;" class="font-background">{{ globalInfo.country }}</el-text>
                          <el-text style="cursor: pointer;margin-left: 5px;white-space:nowrap;vertical-align: -3px;" class="font-background">{{ globalInfo.isp }}</el-text>
                      </div>
                  </el-tooltip>
              </div>
          </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    isVisible: Boolean
})
import CountryCode from "../assets/CountryCode.json"
import { ref, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { toClipboard } from '@soerenmartius/vue3-clipboard'

const localInfo = ref<{ip: string, address: string} | null>(null)
const globalInfo = ref<{ip: string, country: string, isp: string} | null>(null)
const localLay = ref(0)
const globalLay = ref(0)
const loadingLocal = ref(true)
const loadingGlobal = ref(true)

let timers: number[] = []

const copy = (ip: string) => {
    toClipboard(ip)
    ElMessage.success({
        dangerouslyUseHTMLString: true,
        message: `已经复制IP地址：<br><strong>${ip}</strong>`,
    })
}

async function fetchLocalIp() {
    if (!props.isVisible) return
    try {
        const response = await fetch('https://forge.speedtest.cn/api/location/info', { referrerPolicy: 'no-referrer' })
        const resp = await response.json()
        const parts = [resp['province'], resp['city']?.replace(/市$/, ''), resp['districts'], resp['isp']].filter(Boolean)
        localInfo.value = { ip: resp['ip'], address: parts.join(' ') }
    } catch {
        localInfo.value = null
    }
    loadingLocal.value = false
    timers.push(setTimeout(fetchLocalIp, 5000))
}

async function fetchGlobalIp() {
    if (!props.isVisible) return
    try {
        const response = await fetch('https://api-ipv4.ip.sb/geoip', { referrerPolicy: 'no-referrer' })
        const resp = await response.json()
        const country = CountryCode[resp['country_code'] as keyof typeof CountryCode] || resp['country']
        globalInfo.value = { ip: resp['ip'], country, isp: resp['isp'] }
    } catch {
        globalInfo.value = null
    }
    loadingGlobal.value = false
    timers.push(setTimeout(fetchGlobalIp, 5000))
}

async function measureLay(url: string, target: typeof localLay) {
    if (!props.isVisible) return
    try {
        const start = Date.now()
        await fetch(url, { method: "HEAD", cache: "no-store", mode: 'no-cors', referrerPolicy: 'no-referrer' })
        target.value = Date.now() - start
    } catch {
        target.value = 0
    }
    timers.push(setTimeout(() => measureLay(url, target), 1000))
}

fetchLocalIp()
fetchGlobalIp()
measureLay('https://connectivitycheck.platform.hicloud.com/generate_204', localLay)
measureLay('https://cp.cloudflare.com/', globalLay)

onUnmounted(() => {
    timers.forEach(t => clearTimeout(t))
})
</script>

<style scoped>
.font-background{
  color: var(--text-secondary, #6e6e73);
  font-size: 14px;
  font-weight: 500;
}
.card{
    max-width: 800px;
    height: fit-content;
    display: block;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.6) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    border-radius: 24px !important;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255,255,255,0.6) !important;
    padding: 20px !important;
}
html.dark .card {
    background: rgba(44, 44, 46, 0.65) !important;
    border-color: rgba(255, 255, 255, 0.06) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05) !important;
}
html.dark .font-background{
    color: #e5e5ea;
}
</style>

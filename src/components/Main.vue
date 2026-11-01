<template>
  <div class="radius card" :style="{ borderRadius: 'var(--el-border-radius-round)' }">
    <div style="margin-top: 10px;margin-left: 10px;margin-right: 10px;">
      <div class="slider-demo-block">
        <span class="font-background">测速地址：</span>
        <el-button type="primary" :icon="CopyDocument" link @click="copyUrl" />
        <el-button type="primary" :icon="Edit" link @click="EditTableVisible = true" />
        <br>
        <el-select style="width: 100%;" v-model="runUrl">
          <el-option-group v-for="group in nodes" :key="group.label" :label="group.label">
            <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
          </el-option-group>
          <template #prefix>
            <el-icon>
              <Link />
            </el-icon>
          </template>
        </el-select>
      </div>
      <div style="margin-top:20px;">
        <span class="font-background">线程数：{{ threadNum }}</span>
        <el-slider :show-tooltip="false" :min="1" :max='64' v-model="threadNum" />
      </div>
      <div style="width: 100%;height:32px;">
        <div style="float: left;">
          <el-switch v-model="runBackground" active-text="保持后台运行" />
        </div>
        <div style="float: right;">
          <el-switch v-model="autoStart" active-text="自动运行" />
        </div>
      </div>
      <div class="ItemContainer">
        <div class="showItem">
          <span class="font-background" style="font-size: larger;">总流量</span>
          <el-text size="small" class="mx-1">{{ state.maxUse ? '/' + formatter(state.maxUse, 0, [0, 0, 0, 0, 0, 0]) : ""
          }}</el-text>
          <el-button type="primary" style="height: 15px;" :icon="Edit" link @click="EditMaxVisible = true" />
          <div class="state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <el-text class="font-data">{{ state.show.allUsed }}</el-text>
        </div>
        <div class="showItem">
          <span class="font-background" style="font-size: larger;">{{ isRunning ? '实时速度' : '平均速度' }}</span>
          <el-popover placement="top-start" title="用量预测" :width="150" trigger="click">
            <template #reference>
              <el-button type="primary" style="height: 15px;vertical-align: -2px;" :icon="Calendar" link />
            </template>
            每分钟&nbsp;&nbsp;{{ state.predict.min }}
            <br>
            每小时&nbsp;&nbsp;{{ state.predict.hour }}
            <br>
            每天&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ state.predict.day }}
            <br>
            每月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ state.predict.mon }}
          </el-popover>
          <div class="state-icon state-icon-main">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <el-text class="font-data state-icon-main">{{ state.show.speed }}</el-text>
        </div>
        <div class="showItem">
          <span class="font-background" style="font-size: larger;">带宽</span>
          <el-text size="small" class="mx-1">{{ state.maxSpeed ? '/' + formatter(state.maxSpeed, 2, [0, 0, 0, 0, 0, 0]) : ""
          }}</el-text>
          <el-button type="primary" style="height: 15px;" :icon="Edit" link @click="EditSpeedVisible = true" />
          <div class="state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <el-text class="font-data">{{ state.show.speedBit }}</el-text>
        </div>
      </div>

      <div style="width: fit-content;display: block;margin-top:2ch;margin-left: auto;margin-right: auto;">
        <a class="button" v-if="!isRunning && !state.isChecking" @click="tryStart">
          <svg t="1694957757562" class="svg-icon"
            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4036" width="200" height="200">
            <path
              d="M823.8 603.5l-501.2 336c-50.7 34-119.3 20.4-153.2-30.2-12.2-18.2-18.7-39.6-18.7-61.5v-672c0-61 49.5-110.4 110.4-110.4 21.9 0 43.3 6.5 61.5 18.7l501.1 336c50.7 34 64.2 102.6 30.2 153.2-7.8 11.9-18.1 22.2-30.1 30.2z m0 0"
              p-id="4037"></path>
          </svg>
        </a>
        <a class="button" v-if="state.isChecking">
          <el-icon :size="60" class="is-loading el-icon-loading">
            <Loading />
          </el-icon>
        </a>
        <a class="button" v-if="isRunning && !state.isChecking" @click="isRunning = false">
          <svg t="1694958268344" fill="white" style="width: 80px;margin-top: -30px;" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="7667" width="200" height="200">
            <path
              d="M352 768c-17.664 0-32-14.304-32-32V288c0-17.664 14.336-32 32-32s32 14.336 32 32v448c0 17.696-14.336 32-32 32zM672 768c-17.696 0-32-14.304-32-32V288c0-17.664 14.304-32 32-32s32 14.336 32 32v448c0 17.696-14.304 32-32 32z"
              p-id="7668"></path>
          </svg>
        </a>
      </div>
      <el-button style="float: left;margin-top: -20px;margin-left: 3px" type="primary" :icon="FullScreen" link
        @click="isFullScreen = true" />
      <el-button style="float: right;margin-top: -20px;margin-right: 3px" type="primary" :icon="TrendCharts" link
        v-if="!chartShow" @click="chartShow = true" />
      <el-button style="float: right;margin-top: -20px;margin-right: 3px" type="primary" :icon="Hide" link
        v-if="chartShow" @click="chartShow = false" />
      <div v-show="chartShow" ref="chartContainer" style="width: 100%; height: 400px;"></div>
    </div>
  </div>

  <el-dialog style="width: 90%;max-width: 700px;" v-model="EditTableVisible" title="自定义地址">
    <el-table v-if="customNodes.length" :data="customNodes" style="width: 100%" max-height="300">
      <el-table-column prop="label" label="名称" width="100" />
      <el-table-column prop="value" label="URL" />
      <el-table-column fixed="right" label="" width="50">
        <template #default="scope">
          <el-button type="danger" link :icon="Delete" @click.prevent="customNodes.splice(scope.$index, 1)" />
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else description="没有自定义地址" />
    <el-button class="mt-4" style="width: 100%" @click="addTableVisible = true;">添加地址</el-button>
  </el-dialog>

  <el-dialog style="width: 90%;max-width: 700px;" v-model="addTableVisible" title="添加链接">
    <el-form :model="addForm">
      <el-form-item label="名称:" label-width='50px'>
        <el-input v-model="addForm.label" autocomplete="off" />
      </el-form-item>
      <el-form-item label="url:" label-width='50px'>
        <el-input v-model="addForm.value" autocomplete="off">
          <template #suffix>
            <el-icon v-if="urlParser(addForm.value)">
              <CircleCheck />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-alert title="注意：" type="warning">
      在浏览器工作的程序受到浏览器安全策略的限制
      <br>
      以下情况你将无法正常使用链接
      <br>
      1.你使用https协议打开的本站，但是url是http协议
      <br>
      2.目标服务器返回的Access-Control-Allow-Origin响应头没有允许本站
      <br>
      具体细节请在报错后查看控制台
    </el-alert>
    <el-alert title="免责声明：" type="error">
      请勿用于非法用途，使用本功能造成的一切后果由用户承担
    </el-alert>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addTableVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!urlParser(addForm.value) || !addForm.label || addForm.checking"
          @click="addNode()">确认
          <el-icon v-if="addForm.checking" class="is-loading">
            <Loading />
          </el-icon>
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog style="width: 90%;max-width: 300px;" v-model="EditMaxVisible" title="设置上限自动停止">
    <el-form>
      <div class="mt-4">
        <el-input type="number" min='1' v-model="maxUseInput.num" autocomplete="off" placeholder="留空则无上限"
          class="input-with-select">
          <template #append>
            <el-select v-model="maxUseInput.type" placeholder="Select" style="width: 65px">
              <el-option label="MB" value="MB" />
              <el-option label="GB" value="GB" />
              <el-option label="TB" value="TB" />
            </el-select>
          </template>
        </el-input>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="EditMaxVisible = false">取消</el-button>
        <el-button type="primary" @click="editMaxUse()">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog style="width: 90%;max-width: 350px;" v-model="EditSpeedVisible" title="设置带宽上限">
    <el-form>
      <div class="mt-4">
        <el-input type="number" min='1' v-model="maxSpeedInput.num" autocomplete="off" placeholder="留空则无上限"
          class="input-with-select">
          <template #append>
            <el-select v-model="maxSpeedInput.type" placeholder="Select" style="width: 80px">
              <el-option label="Mbps" value="Mbps" />
              <el-option label="Gbps" value="Gbps" />
            </el-select>
          </template>
        </el-input>
        <br><br>
        <el-alert title="注意：" type="warning">
          浏览器会使用缓存策略<br>只能限制平均速度，无法限制峰值速度!<br>部分链接无法限速，请使用其它限速方法
        </el-alert>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="EditSpeedVisible = false">取消</el-button>
        <el-button type="primary" @click="editSpeedUse()">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <audio v-if="isMobile && !isIOS && !isMiuiBrowser && runBackground" @canplay="() => { if (isRunning) audioDom.play() }"
    @pause="() => { if (runBackground) isRunning = false }" @play="isRunning = true" controls loop ref="audioDom"
    style="display:none">
    <source :src="andoridSound" type="audio/mpeg">
  </audio>
  <audio v-if="isIOS && runBackground" @canplay="() => { if (isRunning) audioDom.play() }"
    @pause="() => { if (runBackground) isRunning = false }" @play="isRunning = true" controls loop ref="audioDom"
    style="display:none">
    <source :src="iosSound" type="audio/mpeg">
  </audio>
  <FullScreenUI v-model="isFullScreen" :isRunning="isRunning" :state="state" />
</template>

<script lang="ts" setup>
import type { EChartsType } from "echarts";
import iosSound from "../assets/ios.mp3";
import andoridSound from "../assets/android.mp3";
const props = defineProps({
  isVisible: Boolean
})
import { ElMessage } from 'element-plus'
import nodesJson from "../assets/nodes.json"
import { Link, Edit, Delete, CircleCheck, Loading, CopyDocument, TrendCharts, Hide, Calendar,FullScreen } from '@element-plus/icons-vue'
import { ref, watch, watchEffect, type Ref, reactive } from 'vue'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import FullScreenUI from './FullScreen.vue'

const customNodes = reactive(localStorage.customNodes ? JSON.parse(localStorage.customNodes) : [])
const OnlineNodes: {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
}[] = []
for(let groupName in nodesJson) {
  const group=nodesJson[groupName as keyof typeof nodesJson]
  const temp: {
    label: string;
    options: {
      value: string;
      label: string;
    }[];
  }={"label":groupName,options:[]}
  for(let node in group) {
    temp.options.push({"value":group[node as keyof typeof group],"label":node})
  }
  OnlineNodes.push(temp)
}
const nodes: Ref<{
  label: string;
  options: {
    value: string;
    label: string;
  }[];
}[]> = ref(OnlineNodes)
if (customNodes.length) {
  nodes.value = [{ "label": "自定义", "options": customNodes}].concat(OnlineNodes)
}
watch(customNodes, async (newState, oldState) => {
  if (customNodes.length) {
    nodes.value = [{ "label": "自定义", "options": customNodes }].concat(OnlineNodes)
  } else nodes.value = OnlineNodes
  localStorage.customNodes = JSON.stringify(newState)
}, { deep: true })

const state = reactive({
  show: {
    allUsed: '-',
    speed: '-',
    speedBit: '-'
  },
  predict: {
    min: '-',
    hour: '-',
    day: '-',
    mon: '-',
  },
  isChecking: false,
  bytesUsed: 0,
  recordUse: 0,
  recordTime: 0,
  startUse: 0,
  startTime: 0,
  maxUse: localStorage.maxUse ? Number(localStorage.maxUse) : 0,
  maxSpeed: localStorage.maxSpeed ? Number(localStorage.maxSpeed) : 0,
})
const isRunning = ref(false)
const isFullScreen = ref(false)
const chartShow = ref(localStorage.chartShow ? localStorage.chartShow === 'true' : false)
const threadNum = ref(localStorage.threadNum ? Number(localStorage.threadNum) : 8)
const runBackground = ref(localStorage.runBackground ? localStorage.runBackground === 'true' : false)
const autoStart = ref(localStorage.autoStart ? localStorage.autoStart === 'true' : false)
// 默认选中 VIVO 节点
const defaultNode = (() => {
  for (const group of OnlineNodes) {
    for (const opt of group.options) {
      if (opt.label === "VIVO") return opt.value
    }
  }
  return OnlineNodes[0]?.options[0]?.value ?? ""
})()
const runUrl = ref(localStorage.url ? localStorage.url : defaultNode)

var tasks: Array<number> = []

onMounted(() => {
  autoStart.value&&tryStart();
})

const tryStart = async () => {
  if(runUrl.value.startsWith("NetworkPanelApi://")) {
    isRunning.value = true
    return
  }
  state.isChecking = true
  const urlStatus = await checkUrl(runUrl.value)
  state.isChecking = false
  if (!urlStatus.status) {
    ElMessage.error({
      dangerouslyUseHTMLString: true,
      message: urlStatus.info
    })
  } else {
    isRunning.value = true
  }
}
const block_list=["ljxnet.cn","netart.cn",".gov.cn"]
const checkUrl = async (url: string) => {
  var status = true
  let info = ''
  try {
    let structUrl = new URL(url)
    if (block_list.some((i)=>structUrl.host.endsWith(i))) {
      throw '你不对劲，我要拿小本本把你记下来然后交给警察蜀黍！'
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, { cache: "no-store", mode: 'cors', referrerPolicy: 'no-referrer' ,signal: controller.signal})
    if (response.status == 404) throw "资源响应异常" + response.status
    if (!response.body) throw "资源响应异常 Nobody"
    const reader = response.body.getReader();
    const { value, done } = await reader.read();
    if (!value || value.length <= 0) throw "资源响应异常 Nobody";
    reader.cancel()
  } catch (err) {
    status = false
    if (err instanceof Error) info = err.message
    else info = String(err)
  }
  return {
    status: status,
    info: info,
  }
}

let solvedRunUrl = ''
async function apiSolver(){
  if(!runUrl.value.startsWith("NetworkPanelApi://")){
    solvedRunUrl = runUrl.value
    return
  }
  let host=runUrl.value.split("NetworkPanelApi://")[1]
  let resp:any = await fetch(import.meta.env.VITE_API_URL+"url.ajax?"+new URLSearchParams({host:host,cache:window.location.host}), {
      mode: "cors",
      redirect: "follow",
      referrerPolicy: "no-referrer"
    });
  resp = await resp.json()
  if(resp['status']!=0){
    isRunning.value=false;
    return
  }
  solvedRunUrl = resp['url']
}
watch(isRunning, async (newState, oldState) => {
  clearChart()
  if (newState) {
    state.isChecking = true
    await apiSolver()
    state.isChecking = false
    if(!isRunning.value) return
    if (state.maxUse && state.bytesUsed >= state.maxUse) {
      state.bytesUsed = 0;
    }
    state.lastLogTime = new Date().getTime() / 1000;
    state.startUse = state.bytesUsed
    state.startTime = new Date().getTime() / 1000;
    state.recordUse = state.bytesUsed
    state.recordTime = new Date().getTime() / 1000;
    for (let i = 0; i < threadNum.value; i++)startThread(i)
    tasks.push(setInterval(frameEvent, 16))
    tasks.push(setInterval(apiSolver, 60000))
    secEvent()
    tasks.push(setInterval(secEvent, 1000))
    runBackground.value ? audioDom.value?.play() : ''
  } else {
    tasks.map((i) => clearInterval(i))
    tasks = []
    audioDom.value?.pause()
    var speed = (state.bytesUsed - state.startUse) / (new Date().getTime() / 1000 - state.startTime)
    setSpeed(speed)
    setUsed()
    if (!props.isVisible) {
      setTitle()
    }
  }
})

watch(props, async (newState, oldState) => {
  if (!newState.isVisible && runBackground.value && isRunning.value) secEvent()
  if (!newState.isVisible && !runBackground.value && isRunning.value) isRunning.value = false
  if (newState.isVisible) setTitle()
})

watch(threadNum, async (newState, oldState) => {
  localStorage.threadNum = newState
  if (isRunning.value && newState > oldState) {
    for (let i = oldState; i < newState; i++)startThread(i)
  }
})

watch(runBackground, async (newState, oldState) => {
  localStorage.runBackground = newState
})

watch(chartShow, async (newState, oldState) => {
  localStorage.chartShow = newState
  if (newState) {
    setTimeout(() => myChart.resize(), 100)
  }
})

watch(runUrl, async (newState, oldState) => {
  localStorage.url = newState
  if (isRunning.value) {
    apiSolver()
  }
})

watchEffect(() => {
  localStorage.autoStart = autoStart.value;
})
const copyUrl = () => {
  toClipboard(runUrl.value).then(() => {
    ElMessage.success({
      dangerouslyUseHTMLString: true,
      message: '已复制当前链接',
    })
  })
}

window.addEventListener("paste", function (e) {
  if (!(e.clipboardData && e.clipboardData.items && document.activeElement?.nodeName != 'INPUT'))return;
  for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
    var itemz = e.clipboardData.items[i];
    if (itemz.type === "text/plain") {
      e.clipboardData.items[i].getAsString(async function (str){
        let clipText = urlParser(str)
        if (clipText) {
          ElMessage.info('读取剪切板链接成功,正在检测链接可用性')
          let ret=await checkUrl(clipText)
          if(ret.status){
            runUrl.value = clipText
            ElMessage.success('读取剪切板链接成功')
          }else{
            ElMessage.error(ret.info)
          }
        } else {
          ElMessage.error('没有检测到剪切板中的链接')
        }
      })
      break
    }
  }
})
var setTitle = (speed: number = 0) => {
  if (props.isVisible) {
    document.title = '网络面板'
  } else {
    if (isRunning.value) {
      document.title = formatter(state.bytesUsed, 0, [0, 0, 0, 0, 0, 0]) + ' ' + formatter(speed, 1, [0, 0, 0, 0, 0, 0])
    } else if (state.maxUse && state.bytesUsed >= state.maxUse) {
      document.title = '已完成'
    } else {
      document.title = '已暂停'
    }
  }
}
var setUsed = () => {
  if (!state.bytesUsed) state.show.allUsed = '-'
  state.show.allUsed = formatter(state.bytesUsed, 0, [0, 0, 1, 2, 2, 2])
}
var setSpeed = (speed: number) => {
  state.show.speed = formatter(speed, 1, [0, 0, 1, 2, 2, 2])
  state.show.speedBit = formatter(speed * 8, 2, [0, 0, 0, 2, 2, 2])
  state.predict.min = formatter(speed * 60, 0, [0, 0, 0, 1, 1, 1])
  state.predict.hour = formatter(speed * 60 * 60, 0, [0, 0, 0, 1, 1, 1])
  state.predict.day = formatter(speed * 60 * 60 * 24, 0, [0, 0, 0, 1, 1, 1])
  state.predict.mon = formatter(speed * 60 * 60 * 24 * 30, 0, [0, 0, 0, 1, 1, 1])
}

var frameEvent = () => {
  if (props.isVisible) setUsed()
  if (state.maxUse && state.bytesUsed >= state.maxUse) {
    isRunning.value = false
  }
}
var secEvent = () => {
  var speed = (state.bytesUsed - state.recordUse) / (new Date().getTime() / 1000 - state.recordTime)
  if (!isNaN(speed)) updateChart(speed)
  else updateChart(0)
  if (speed <= 0 || isNaN(speed)) {
    state.show.speed = '-'
    state.show.speedBit = '-'
  } else if (props.isVisible) {
    setSpeed(speed)
  } else if (runBackground.value) {
    setTitle(speed)
  }
  state.recordUse = state.bytesUsed
  state.recordTime = new Date().getTime() / 1000;
}


function formatter(num: number, desIndex: number, flo: Array<number>) {
  const describeString = [['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
  ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'],
  ['Bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps']
  ]
  const describe = describeString[desIndex]
  var cnum = num;
  var total_index = 0;
  while (cnum >= 1024) {
    if (total_index == describe.length - 1) break;
    cnum = cnum / 1024;
    total_index++;
  }
  return cnum.toFixed(flo[total_index]) + describe[total_index];
}

const speedCtr=()=>{
  if(state.bytesUsed-state.recordUse>state.maxSpeed/8){
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve(0)
      },1000-(new Date().getTime()%1000))
    })
  }
}

async function startThread(index: number) {
  try {
    if(solvedRunUrl==""){
      isRunning.value=false
      return
    }
    let _url=solvedRunUrl
    const response = await fetch(_url, { cache: "no-store", mode: 'cors', referrerPolicy: 'no-referrer' })
    if (!response.body) throw "Nobody"
    let contentLength = response.headers.get('content-length')
    let realLength = Infinity
    if (contentLength) realLength = parseInt(contentLength)
    const reader = response.body.getReader();
    let decodeLength = 0
    while (true) {
      if(state.maxSpeed)await speedCtr()
      const { value } = await reader.read();
      let chunkLength = value?.length
      if (!chunkLength || solvedRunUrl != _url) {
        startThread(index);
        break;
      }
      let usefulChunkLength = chunkLength
      if (decodeLength >= realLength) {
        usefulChunkLength = 0
      } else if (decodeLength + chunkLength > realLength) {
        usefulChunkLength = realLength - decodeLength
      }
      state.bytesUsed += usefulChunkLength
      if (index >= threadNum.value || !isRunning.value) break
      decodeLength += chunkLength
    }
    reader.cancel()
  } catch (err) {
    console.log(err)
    if (isRunning.value) startThread(index);
  }
}

const EditTableVisible = ref(false)
const addTableVisible = ref(false)
const EditMaxVisible = ref(false)
const EditSpeedVisible = ref(false)
const addForm = ref({
  label: '',
  value: '',
  checking: false
})
const urlParser = (ipt: string) => {
  var a = ipt.match(/https?:\/\/([\w-]+\.)+[\w-]+(:[0-9]+)?(\/\S*)?/);
  return a ? a[0] : '';
}
const addNode = async () => {
  addForm.value.value = urlParser(addForm.value.value)
  addForm.value.checking = true
  const urlStatus = await checkUrl(addForm.value.value)
  if (!urlStatus.status) {
    addForm.value.checking = false
    ElMessage.error({
      dangerouslyUseHTMLString: true,
      message: urlStatus.info,
    })
    return
  }
  addForm.value.checking = false
  customNodes.push({
    label: addForm.value.label,
    value: addForm.value.value,
  })
  addForm.value.label = ''
  addForm.value.value = ''
  addTableVisible.value = false
}

const maxUseInput: Ref<{
  num: number | null;
  type: "GB" | "MB" | "TB";
}> = ref({
  num: null,
  type: 'GB',
})
const editMaxUse = () => {
  var map = {
    "MB": 1024 * 1024,
    "GB": 1024 * 1024 * 1024,
    "TB": 1024 * 1024 * 1024 * 1024
  }
  var tmp = 0
  if (maxUseInput.value.num) {
    tmp = Math.floor(maxUseInput.value.num * map[maxUseInput.value.type])
  }
  state.maxUse = tmp
  localStorage.maxUse = tmp
  maxUseInput.value.num = null
  EditMaxVisible.value = false
}

const maxSpeedInput: Ref<{
  num: number | null;
  type: "Gbps" | "Mbps" | "Kbps";
}> = ref({
  num: null,
  type: 'Mbps',
})

const editSpeedUse = () => {
  var map = {
    "Kbps": 1024 ,
    "Mbps": 1024 * 1024,
    "Gbps": 1024 * 1024 * 1024
  }
  var tmp = 0
  if (maxSpeedInput.value.num) {
    tmp = Math.floor(maxSpeedInput.value.num * map[maxSpeedInput.value.type])
  }
  state.maxSpeed = tmp
  localStorage.maxSpeed = tmp
  maxSpeedInput.value.num = null
  EditSpeedVisible.value = false
}
var isMobile = /Mobi|Android|iPhone|Macintosh/i.test(navigator.userAgent)
var isMiuiBrowser = /MiuiBrowser/i.test(navigator.userAgent)
var isIOS = /iPhone|Macintosh/i.test(navigator.userAgent)

const audioDom: Ref<any> = ref(null);


import { onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';

const chartContainer = ref(null);

let myChart: EChartsType;
let updateChart = (n:number) => {};
let clearChart=()=>{};
// 图表数据保存在外层，深色模式切换重建图表时不丢失数据
let showArray:Array<any>=[]
let speedTemp:Array<number>=[]
let stepLength=1
import { isDark } from '../theme'

const initChart = () => {
  if (myChart) myChart.dispose()
  myChart = echarts.init(chartContainer.value, isDark.value ? 'dark' : undefined);
  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        let speed = formatter(params[0].data[1], 1, [0, 0, 1, 2, 2, 2]);
        return `${new Date(params[0].data[0] * 1000).toLocaleString()}<br />
              ${speed}`;
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    title: {
      left: 'left',
      text: '速度图表'
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        show: false
      },
      axisTick:{
        show:false
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (val: number) => {
          let a = formatter(val, 1, [0, 0, 0, 0, 0, 0]);
          return a == '-' ? 0 : a
        }
      }
    },
    series: [
      {
        name: '速度',
        type: 'line',
        smooth: false,
        symbol: 'none',
        areaStyle: {},
        data: [[new Date().getTime() / 1000,0]]
      }
    ],
    grid: {
      x: 0,
      y: 40,
      x2: 8,
      y2: 10,
      containLabel: true
    },
  }

  myChart.setOption(chartOption);
  clearChart=()=>{
    // showArray=[]
    speedTemp=[]
    showArray.push([new Date().getTime() / 1000,0])
    // stepLength=1
  }
  updateChart = (speed:number) => {
    let refresh=false
    speedTemp.push(speed)
    while(speedTemp.length>=stepLength){
      refresh=true
      var tmp = speedTemp.splice(0, stepLength);
      let avg;
      if(tmp.includes(0))avg=0
      else avg = tmp.reduce((a, b) => a + b,0)/stepLength;
      showArray.push([new Date().getTime() / 1000,avg])
    }
    while(showArray.length>=200){
      refresh=true
      const result = [];
      const lengthToProcess = showArray.length % 2 === 0 ? showArray.length : showArray.length - 1;
      for (let i = 0; i < lengthToProcess; i += 2) {
        result.push([showArray[i][0],(showArray[i][1] + showArray[i + 1][1]) / 2]);
      }
      showArray=result
      stepLength*=2
    }
    chartOption.series[0].data = showArray
    if(chartShow.value && refresh)myChart.setOption(chartOption);
  }
}
onMounted(() => {
  initChart();
  window.addEventListener('resize', () => { myChart.resize() });
  // 深浅色切换（手动切换或系统切换）时重建图表主题，保留图表数据
  watch(isDark, () => {
    initChart();
    if (chartShow.value) setTimeout(() => myChart.resize(), 100)
  });
});

onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
  }
});
</script>
<style scoped>
.ItemContainer {
  column-count: 3;
  margin-top: 10px;
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
  padding: 24px !important;
}

html.dark .card {
  background: rgba(44, 44, 46, 0.65) !important;
  border-color: rgba(255, 255, 255, 0.06) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05) !important;
}

@media screen and (max-width: 800px) {
  .ItemContainer {
    column-count: 1;
  }
}

.showItem {
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  padding: 20px 15px 15px 30px;
  border-radius: 16px !important;
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  transition: all 0.2s ease;
}

.showItem:hover {
  background: rgba(255, 255, 255, 0.55) !important;
  transform: translateY(-1px);
}

.font-data {
  white-space: nowrap;
  grid-column-start: 1;
  font-weight: 700;
  line-height: 2.5rem;
  font-size: 30px;
  letter-spacing: -0.5px;
}

.font-background{
  color: var(--text-secondary, #6e6e73);
  font-size: 14px;
  font-weight: 500;
}

.state-icon {
  display: block;
  margin-right: 10px;
  margin-left: auto;
  margin-top: -10px;
  width: 28px;
  height: 28px;
  color: #8e8e93;
  opacity: 0.5;
}

.state-icon svg {
  width: 100%;
  height: 100%;
}

.state-icon-main{
  color: #007aff;
  opacity: 0.6;
}

.svg-icon{
  fill: rgb(255,255,255);
  width: 50px;
  margin-left: 10px;
  margin-top: -30px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.el-select-dropdown__wrap{
  max-height: 60vh;
}

.el-icon-loading{
  margin-top: 40px;
  color: #007aff;
}

html.dark .showItem {
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  background: rgba(58, 58, 60, 0.4) !important;
}
html.dark .showItem:hover {
  background: rgba(58, 58, 60, 0.55) !important;
}
html.dark .state-icon{
  color: #98989d;
  opacity: 0.4;
}
html.dark .state-icon-main{
  color: #0a84ff;
  opacity: 0.5;
}
html.dark .font-background{
  color: #e5e5ea;
}
html.dark .svg-icon{
  fill: #e5e5ea;
}

.button {
  display: block;
  text-decoration: none;
  background: linear-gradient(145deg, #667eea 0%, #764ba2 100%);
  font-size: 30px;
  font-weight: 700 !important;
  margin: 36px;
  width: 144px;
  height: 144px;
  position: relative;
  text-align: center;
  line-height: 144px;
  border-radius: 50%;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35), inset 0 2px 4px rgba(255,255,255,0.2);
  transition: all 0.3s ease;
}

.button:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.45), inset 0 2px 4px rgba(255,255,255,0.2);
}

.button:active {
  transform: scale(0.95);
}
</style>

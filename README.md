# NetworkPanel-Lite

基于 [NetworkPanel](https://github.com/ljxi/NetworkPanel) 的轻量前端版本，仅保留网络测速和 IP 查询功能。

修复了自定义地址失败问题，美化前端页面，CDNJS镜像更换为自建。

## 技术栈

- Vue 3 + TypeScript
- Element Plus
- ECharts（速度图表）
- Vite（构建工具）

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器（端口 3005）
pnpm dev

# 仅构建（不检查类型）
pnpm build-only

# 构建 + 类型检查
pnpm build

# 预览构建产物
pnpm preview
```

构建产物输出到 `dist/` 目录。

## 功能说明

### 网络测速
- 支持多线程并发下载测速（1-64 线程）
- 内置多个测速节点（中国大陆 + 全球）
- 支持自定义测速地址（HTTP/HTTPS）
- 实时速度图表
- 全屏屏保模式
- 定量停止、带宽限速
- 自动运行、后台运行（移动端）

### IP 地址查询
- 本地 IP 信息（通过 `forge.speedtest.cn` 获取）
- 全球 IP 信息（通过 `ip.sb` 获取）
- 网络延迟实时检测（华为/Cloudflare）

## 项目结构

```
src/
├── App.vue                    # 根组件
├── main.ts                    # 入口文件
├── assets/
│   ├── CountryCode.json       # 国家代码映射
│   ├── DingTalk-simple.ttf    # 屏保字体
│   ├── elm-theme.css          # Element Plus 主题
│   ├── android.mp3            # Android 后台音频
│   └── ios.mp3                # iOS 后台音频
└── components/
    ├── Main.vue               # 主界面（测速、自定义地址、图表）
    └── IPinfo.vue             # IP 查询组件
```

## 功能添加/移除

### 移除 IP 查询功能
1. 删除 `src/components/IPinfo.vue` 和 `src/assets/CountryCode.json`
2. 在 `App.vue` 中移除 `IPinfoUI` 的 import 和模板引用
3. 重新运行 `pnpm build-only`

### 添加新的测速节点
编辑 `src/assets/nodes.json`，按现有格式添加分组和节点 URL。

### 自定义地址说明
用户可在界面中添加自定义 HTTP/HTTPS 链接作为测速目标。浏览器安全策略限制：
- HTTPS 页面无法访问 HTTP 链接（混合内容）
- 目标服务器需返回正确的 `Access-Control-Allow-Origin` 响应头

## 与原版的差异

移除了依赖于后端的功能：
- QQ 登录与排行榜
- 用户管理、测速日志上传
- 百度统计、51la 统计

CDN 静态资源端点替换为 `cdnjs.xingchencloud.top`。

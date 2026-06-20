# 已读乱回 · Anti-Format

> 把流水账膨胀成周报，把冗长会议压缩成结论，把情绪化表达翻译成高情商职场回复。

<p align="center">
  <strong>TRAE AI 创造力大赛 · 学习工作 / 造个新解法</strong>
</p>

---

## 项目简介

《已读乱回》是一个纯前端驱动的职场沟通效率工具，旨在解决打工人/学生在职场沟通中的**"无效信息膨胀"**与**"周报文字形式主义"**两大痛点。

通过对接大模型 API，提供三个核心模块，一键完成职场文字的"反向格式化"处理。

---

## 核心功能

### 1. 黑话膨胀（周报/日报生成器）

输入大白话流水账，一键转化为充满大厂高级感的结构化 Markdown 周报。

```
输入：这周修了登录页两个 bug，整理了用户反馈，跟产品开了三次会
输出：# 本周工作复盘
      ## 关键成果
      - 围绕登录链路稳定性完成问题闭环...
```

### 2. 高管发言脱水机（信息蒸馏）

粘贴大段混乱的会议纪要/通知，严格过滤废话，只输出：

- 🎯 核心结论
- 📋 待办事项清单
- ⚠️ 潜在风险点

### 3. 职场情商翻译官（嘴替工具）

输入直白、带情绪的吐槽，一键转换为高情商职场回复：

- **温和职业版** — 理性、专业、不卑不亢
- **委婉拒绝版** — 暗藏锋芒、表面配合

---

## 技术亮点

| 特性 | 说明 |
|------|------|
| **SSE 流式输出** | 对接 OpenAI 兼容 API（DeepSeek/智谱/OpenAI），逐 token 实时打字机效果 |
| **rAF 批处理渲染** | `requestAnimationFrame` 合并高频更新，避免 React 频繁 reconcile 导致卡顿 |
| **localStorage 持久化** | API Key / Base URL / Model 自动保存，刷新不丢失 |
| **AbortController 中止** | 生成中可随时终止，安全清理 rAF 和网络请求 |
| **Markdown 暗黑渲染** | `react-markdown` + `remark-gfm`，自定义全套暗黑风样式 |
| **一键复制 + Toast** | `clipboard API` 主方案 + `execCommand` 降级，动画反馈 |
| **纯前端无后端** | 零服务端依赖，部署即用 |

---

## 技术栈

- **Vite 7** — 极速构建与开发服务器
- **React 19** — UI 框架
- **TailwindCSS 3** — 暗黑科技风样式系统
- **react-markdown** — Markdown 渲染
- **lucide-react** — 图标库

---

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/lall5891260-art/trae-.git
cd trae-

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器访问
# http://localhost:5173
```

### 生产打包

```bash
npm run build      # 构建到 dist/
npm run preview    # 本地预览打包产物
```

---

## 使用指南

1. 打开应用后，在左侧**设置卡片**中填写你的大模型 API 信息：
   - **API Key** — 你的密钥（如 `sk-...`）
   - **Base URL** — API 地址（默认 OpenAI，可改为 DeepSeek/智谱等）
   - **Model** — 模型名称（如 `gpt-4o-mini`、`deepseek-chat`）

2. 设置会自动保存到浏览器本地，刷新不丢失

3. 在左侧选择需要的模块，输入内容，点击转换按钮

4. 右侧实时流式输出结果，支持一键复制

### 常见 API 配置

| 平台 | Base URL | Model 示例 |
|------|----------|-----------|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` |
| 智谱 AI | `https://open.bigmodel.cn/api/paas/v4` | `glm-4-flash` |

---

## 部署

### Vercel

1. 导入 GitHub 仓库
2. 框架选择 Vite
3. 输出目录默认 `dist`
4. 一键部署

### GitHub Pages

```bash
npm run build
# 将 dist/ 内容推送到 gh-pages 分支
```

### Netlify

拖拽 `dist/` 文件夹到 [Netlify Drop](https://app.netlify.com/drop) 即可。

---

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + Enter` | 触发转换 |

---

## 项目结构

```
trae-/
├── src/
│   ├── App.jsx          # 主界面 + 三个模块 + API 逻辑
│   ├── main.jsx         # React 入口
│   └── styles.css       # TailwindCSS 基础样式
├── index.html           # HTML 模板
├── package.json         # 依赖与脚本
├── vite.config.js       # Vite 配置
├── tailwind.config.js   # TailwindCSS 暗黑风主题
├── postcss.config.js    # PostCSS 配置
└── .gitignore
```

---

## License

MIT

---

<p align="center">
  Made with ❤️ for TRAE AI 创造力大赛
</p>

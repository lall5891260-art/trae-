# Anti-Format Loop｜已读乱回表达重构系统

> This project is not about generating more text — it is about removing noise from workplace language.

<p align="center">
  <strong>TRAE AI 创造力大赛 · 学习工作 / 造个新解法</strong>
</p>

---

## 项目简介

《已读乱回 Anti-Format Loop》是一个面向学习与职场场景的表达重构系统，旨在解决打工人和学生在沟通中遇到的三类高频文字内耗：周报需要包装、会议需要脱水、情绪回复需要体面。

它不是一个单纯的“AI 改写器”。项目把职场表达拆成三种状态：**膨胀、脱水、翻译**。用户可以把普通流水账重构为周报，把冗长讲话压缩成任务结论，也可以把一句快要发出去的气话翻译成理性、克制但有边界感的回复。

一句话概括：

> 这个项目不是为了生成更多文字，而是为了把职场语言里的噪音拧干。

---

## 方法论

| 表达状态 | 输入 | 输出 | 解决的问题 |
|------|------|------|------|
| 表达膨胀 | 大白话流水账 | 结构化周报 | 普通工作成果“不像成果” |
| 信息脱水 | 会议纪要、通知、高管讲话 | 核心结论、待办、风险 | 字很多但重点很少 |
| 语气翻译 | 情绪化吐槽、拒绝、抱怨 | 职业回复、委婉拒绝 | 想说人话但不能太直 |

这三个模块共同组成一个职场表达闭环：该正式时正式，该压缩时压缩，该体面时体面。

---

## 核心功能

### 黑话膨胀（周报/日报生成器）

输入大白话流水账，一键转化为充满大厂高级感的结构化 Markdown 周报。

```
输入：这周修了登录页两个 bug，整理了用户反馈，跟产品开了三次会
输出：# 本周工作复盘
      ## 关键成果
      - 围绕登录链路稳定性完成问题闭环...
```

### 高管发言脱水机（信息蒸馏）

粘贴大段混乱的会议纪要/通知，严格过滤废话，只输出：

- 🎯 核心结论
- 📋 待办事项清单
- ⚠️ 潜在风险点

### 职场情商翻译官（嘴替工具）

输入直白、带情绪的吐槽，一键转换为高情商职场回复：

- **温和职业版** — 理性、专业、不卑不亢
- **委婉拒绝版** — 暗藏锋芒、表面配合

---

## 技术亮点

| 特性 | 说明 |
|------|------|
| **Prompt 路由系统** | 根据模块选择不同 System Prompt，让同一模型在“膨胀、脱水、翻译”三种表达分布中稳定输出 |
| **SSE 流式输出** | 对接 OpenAI 兼容 API（DeepSeek/智谱/OpenAI），逐 token 实时打字机效果 |
| **rAF 批处理渲染** | `requestAnimationFrame` 合并高频更新，避免 React 频繁 reconcile 导致卡顿 |
| **localStorage 持久化** | API Key / Base URL / Model 自动保存，刷新不丢失 |
| **AbortController 中止** | 生成中可随时终止，安全清理 rAF 和网络请求 |
| **Markdown 暗黑渲染** | `react-markdown` + `remark-gfm`，自定义全套暗黑风样式 |
| **一键复制 + Toast** | `clipboard API` 主方案 + `execCommand` 降级，动画反馈 |
| **纯前端无后端** | 零服务端依赖，部署即用 |

---

## 评委视角说明

大模型让文字生成变得容易，但也带来了新的问题：表达越来越结构化、越来越像模板，很多内容看似“正确”，却不一定有信息密度，也不一定像人在沟通。

《已读乱回》把这个问题放回学习和工作场景里处理。它没有追求“大而全”的 AI 助手，而是聚焦表达重构：让周报、会议纪要和职场回复这些每天都会出现的小问题更快被处理。

项目的创新点不在于“让 AI 再写一段话”，而在于让用户在不同沟通目标之间切换：把内容包装得更像成果，把废话压缩成重点，把情绪转译成可发送的回复。

---

## 答辩要点

### 这个项目解决什么问题

它解决的是学习和职场场景里的低效文字沟通问题。周报、会议纪要、群公告和跨部门回复经常消耗大量时间，却不一定产生真实信息价值。

### 技术核心是什么

核心是前端驱动的表达重构链路：用户选择模块后，输入会被路由到对应 System Prompt，通过 OpenAI 兼容接口流式返回，再由 Markdown 渲染层呈现为可复制的结果。

### 创新点在哪里

项目把职场表达拆成三种状态：语言膨胀、信息脱水和语气翻译。三个模块看似不同，底层都围绕同一个问题：如何控制语言在不同沟通目标之间切换。

### 为什么适合学习工作赛道

学生要写总结，实习生要写周报，职场人要整理会议纪要，团队成员要回复不合理需求。它解决的不是遥远的大问题，而是每天都会发生、反复消耗人的小问题。

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

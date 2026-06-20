import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  ClipboardCheck,
  Copy,
  Eraser,
  KeyRound,
  Loader2,
  MessageSquareQuote,
  Sparkles,
  Square,
  Wand2,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Settings persistence key                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'anti_format_settings';

/* ------------------------------------------------------------------ */
/*  System Prompts                                                     */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPTS = {
  jargon: `你是一个顶级大厂的高级周报撰写助手。用户会提供一段大白话流水账，你需要将其转化为一份充满大厂高级感、结构化的 Markdown 周报。

要求：
1. 使用 Markdown 格式，包含 # 本周工作复盘、## 关键成果、## 过程推进、## 下周计划 等章节。
2. 将日常琐事包装为"闭环"、"赋能"、"对齐"、"沉淀"、"拉通"、"颗粒度"、"抓手"、"组合拳"等大厂黑话。
3. 语气专业、自信、有节奏感，但不要过度夸张。
4. 直接输出最终周报，不要有任何前缀说明。`,

  distill: `你是一个顶级战略咨询顾问，擅长从混乱信息中提取核心要点。用户会粘贴大段会议纪要、通知或高管讲话，你需要严格过滤废话，只输出以下三个部分：

输出格式（严格遵循）：

🎯 核心结论
- 用 1-3 条要点概括最关键的决策、方向或结论。
- 每条不超过两行。

📋 待办事项清单
- 列出所有可执行的行动项，每条包含：做什么、谁负责（如未提及则标注"待确认"）、建议截止时间（如未提及则标注"待确认"）。
- 按优先级排序。

⚠️ 潜在风险点
- 识别信息中隐含的风险、模糊点或可能导致执行偏差的问题。
- 每条给出简要说明。

注意：
- 只输出以上三个部分，不要任何额外说明。
- 使用 Markdown 格式。
- 如果没有找到某部分的内容，直接写"暂无明确信息"。`,

  translator: `你是一个顶级职场沟通教练和情商顾问。用户会输入一段带情绪、直白甚至可能包含吐槽或脏话的职场表达，你需要将其转换为两个版本的高情商职场回复。

输出格式（严格遵循）：

**温和职业版：**
将用户的核心诉求或不满，用绝对理性、不卑不亢、专业得体的语言重新表达。保留原意和立场，但去掉情绪化词汇，使表达显得成熟、专业。

**委婉拒绝版：**
在温和职业版的基础上，巧妙地表达拒绝或推迟的意图。使用"优先级冲突"、"资源协调"、"充分评估"等职场话术，暗藏锋芒但表面上给人配合、理性的印象。

注意：
- 两个版本之间用空行分隔。
- 每个版本控制在 3-5 句话以内。
- 直接输出翻译结果，不要任何前缀说明。
- 使用 Markdown 格式。`,
};

/* ------------------------------------------------------------------ */
/*  Module Definitions                                                 */
/* ------------------------------------------------------------------ */

const modules = [
  {
    id: 'jargon',
    icon: BriefcaseBusiness,
    title: '黑话膨胀',
    subtitle: '周报 / 日报生成器',
    placeholder:
      '例：这周修了登录页两个 bug，整理了用户反馈，跟产品开了三次会，准备下周优化表单体验。',
    action: '生成高级周报',
    sample: `# 本周工作复盘

## 关键成果
- 围绕登录链路稳定性完成问题闭环，推动核心入口体验可用性提升。
- 基于用户反馈沉淀需求线索，为后续体验优化提供输入。

## 过程推进
- 与产品侧高频对齐目标口径，持续校准问题优先级。
- 聚焦表单交互细节，规划下一阶段体验升级方向。

## 下周计划
- 推进表单体验优化落地，提升用户转化链路顺滑度。`,
  },
  {
    id: 'distill',
    icon: ClipboardCheck,
    title: '高管发言脱水机',
    subtitle: '信息蒸馏',
    placeholder:
      '粘贴会议纪要、长通知、群公告或一段含糊但很长的"重要讲话"。',
    action: '开始脱水',
    sample: `🎯 核心结论
- 当前优先级应集中在交付风险收敛与关键资源协调。

📋 待办事项清单
- 明确负责人和截止时间。
- 补齐依赖资源与验收标准。
- 在下次同步前更新进展。

⚠️ 潜在风险点
- 目标表述仍偏抽象，可能导致执行口径不一致。
- 跨团队依赖未完全锁定，存在延期风险。`,
  },
  {
    id: 'translator',
    icon: MessageSquareQuote,
    title: '职场情商翻译官',
    subtitle: '嘴替工具',
    placeholder:
      '例：这个需求昨天才说今天就要，谁来都做不完，别再催了。',
    action: '转换表达',
    sample: `**温和职业版：**
这个需求当前时间较紧，为确保交付质量，建议先确认优先级与验收范围，我会在资源允许的情况下尽快推进。

**委婉拒绝版：**
目前现有排期已经较满，如果该需求需要今天交付，可能需要同步调整其他任务优先级，否则不建议在未充分评估的情况下承诺上线时间。`,
  },
];

const methodCards = [
  {
    title: '表达膨胀',
    label: '流水账 → 周报',
    desc: '把普通工作痕迹包装成结构化成果，让“我做了点事”至少看起来像“我推进了闭环”。',
  },
  {
    title: '信息脱水',
    label: '长通知 → 结论',
    desc: '把会议纪要、群公告和高管讲话压缩为结论、任务与风险，减少“读完但没收到货”的痛苦。',
  },
  {
    title: '语气翻译',
    label: '情绪话 → 职场话',
    desc: '把想直接发出去的那句气话，翻译成能发、能留痕、还能保住边界感的回复。',
  },
];

/* ------------------------------------------------------------------ */
/*  Toast 组件                                                         */
/* ------------------------------------------------------------------ */

function Toast({ message, visible }) {
  return (
    <div
      className={`pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-center gap-2.5 rounded-2xl border border-acid/40 bg-panel/95 px-5 py-3 text-sm font-semibold text-acid shadow-[0_0_30px_rgba(135,247,212,0.2)] backdrop-blur">
        <Check size={17} />
        {message}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Markdown 渲染组件（暗黑风优化）                                       */
/* ------------------------------------------------------------------ */

function MarkdownOutput({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-5 mt-1 text-[1.65rem] font-black tracking-tight text-acid">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-4 mt-7 border-b border-white/10 pb-2 text-lg font-bold text-white">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2.5 mt-5 text-base font-semibold text-slate-200">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-3 leading-[1.85] text-slate-300">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-4 ml-2 space-y-2 text-slate-300">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 ml-2 list-inside list-decimal space-y-2 text-slate-300">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-[1.85] marker:text-acid/70">{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-acid">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-slate-400">{children}</em>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-4 rounded-r-xl border-l-4 border-acid/40 bg-white/[0.03] py-3 pl-5 pr-4 italic text-slate-400">
            {children}
          </blockquote>
        ),
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="rounded-md bg-white/10 px-1.5 py-0.5 text-sm text-acid">
                {children}
              </code>
            );
          }
          return (
            <pre className="my-4 overflow-x-auto rounded-xl bg-night/80 p-5 text-sm leading-relaxed text-slate-200">
              <code>{children}</code>
            </pre>
          );
        },
        hr: () => <hr className="my-6 border-white/10" />,
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b-2 border-white/20 text-left text-slate-200">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2.5 font-semibold text-acid">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border-b border-white/10 px-4 py-2.5 text-slate-300">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.apiKey === 'string' &&
      typeof parsed.baseUrl === 'string' &&
      typeof parsed.model === 'string'
    ) {
      return {
        apiKey: parsed.apiKey,
        baseUrl: parsed.baseUrl,
        model: parsed.model,
      };
    }
  } catch {
    /* ignore corrupt data */
  }
  return null;
}

function App() {
  const [activeModule, setActiveModule] = useState(modules[0].id);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(modules[0].sample);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState(() => {
    const saved = loadSettings();
    return (
      saved || {
        apiKey: '',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o-mini',
      }
    );
  });
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const abortRef = useRef(null);
  const toastTimer = useRef(null);
  const contentAccRef = useRef(''); // 流式输出累积
  const rafRef = useRef(null); // requestAnimationFrame ID

  const currentModule = useMemo(
    () => modules.find((item) => item.id === activeModule),
    [activeModule],
  );

  /* ---------- 设置持久化 ---------- */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore quota errors */
    }
  }, [settings]);

  /* ---------- Toast 控制 ---------- */
  const showToast = useCallback((msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg(msg);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => {
      setToastVisible(false);
    }, 1800);
  }, []);

  /* ---------- 切换模块 ---------- */
  const handleModuleChange = useCallback(
    (module) => {
      if (loading) return;
      setActiveModule(module.id);
      setInput('');
      setOutput(module.sample);
      setError('');
    },
    [loading],
  );

  /* ---------- 清空输入 ---------- */
  const handleClearInput = useCallback(() => {
    setInput('');
    setError('');
  }, []);

  /* ---------- 清空输出 ---------- */
  const handleClearOutput = useCallback(() => {
    setOutput(currentModule.sample);
    showToast('输出已重置');
  }, [currentModule, showToast]);

  /* ---------- 复制输出 ---------- */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      showToast('复制成功！已写入剪贴板');
    } catch {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = output;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('复制成功！已写入剪贴板');
    }
  }, [output, showToast]);

  /* ---------- 中止生成 ---------- */
  const handleAbort = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setLoading(false);
    contentAccRef.current = '';
  }, []);

  /* ---------- 流式 API 调用（requestAnimationFrame 批处理） ---------- */
  const handleGenerate = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('请先输入内容再点击转换。');
      return;
    }
    if (!settings.apiKey) {
      setError('请先在左侧设置卡片中填写 API Key。');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');
    contentAccRef.current = '';

    const controller = new AbortController();
    abortRef.current = controller;

    const url = settings.baseUrl.replace(/\/+$/, '') + '/chat/completions';

    // 使用 rAF 批量更新 state，避免高频 setState 引起卡顿
    let pending = false;
    const flush = () => {
      setOutput(contentAccRef.current);
      pending = false;
      rafRef.current = null;
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPTS[activeModule] },
            { role: 'user', content: trimmed },
          ],
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errText = '';
        try {
          errText = await response.text();
        } catch {
          /* ignore */
        }
        throw new Error(
          `API 请求失败 (${response.status})${errText ? '：' + errText.slice(0, 200) : ''}`,
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;
          const data = trimmedLine.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              contentAccRef.current += content;
              if (!pending) {
                pending = true;
                rafRef.current = requestAnimationFrame(flush);
              }
            }
          } catch {
            /* 忽略解析失败的 SSE 行 */
          }
        }
      }

      // 确保最终刷新
      if (pending && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      setOutput(contentAccRef.current);
      contentAccRef.current = '';
    } catch (err) {
      if (err.name === 'AbortError') {
        setOutput((prev) => prev + '\n\n---\n\n> 生成已被手动中止。');
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
      abortRef.current = null;
      rafRef.current = null;
    }
  }, [input, settings, activeModule]);

  /* ---------- 键盘快捷键 ---------- */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (!loading) handleGenerate();
      }
    },
    [loading, handleGenerate],
  );

  /* ---------- 是否正在流式输出（用于判断是否显示复制按钮） ---------- */
  const hasOutput = output && output !== currentModule.sample;

  return (
    <main className="min-h-screen overflow-hidden px-5 py-6 text-slate-100 sm:px-8 lg:px-10">
      {/* Toast */}
      <Toast message={toastMsg} visible={toastVisible} />

      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* ========== Header ========== */}
        <header className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-glow backdrop-blur md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-acid/30 bg-acid/10 px-3 py-1 text-sm text-acid">
              <Sparkles size={16} />
              TRAE AI 创造力大赛 · 学习工作 / 表达重构系统
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              Anti-Format Loop
              <span className="ml-3 bg-gradient-to-r from-acid to-violet bg-clip-text text-transparent">
                已读乱回
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              一个把职场语言里的噪音重新整理的表达重构工具：该膨胀时把流水账变周报，该脱水时把长通知压成结论，该克制时把气话翻译成体面但有边界感的回复。
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              This project is not about generating more text — it is about removing noise from workplace language.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-night/70 p-4 text-sm text-slate-300">
            <p className="text-slate-500">当前模式</p>
            <p className="mt-1 text-lg font-semibold text-white">{currentModule.title}</p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {methodCards.map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-white/10 bg-panel/70 p-5 backdrop-blur transition hover:border-acid/30 hover:bg-white/[0.06]"
            >
              <div className="mb-3 inline-flex rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-xs font-semibold text-violet">
                {card.label}
              </div>
              <h2 className="text-lg font-bold text-white">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{card.desc}</p>
            </article>
          ))}
        </section>

        {/* ========== Main Grid ========== */}
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* ---------- 左侧面板 ---------- */}
          <aside className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-panel/80 p-5 backdrop-blur">
            {/* 模块切换 */}
            <div className="grid gap-3">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = activeModule === module.id;

                return (
                  <button
                    key={module.id}
                    type="button"
                    disabled={loading}
                    onClick={() => handleModuleChange(module)}
                    className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      isActive
                        ? 'border-acid/50 bg-acid/10 shadow-[0_0_30px_rgba(135,247,212,0.12)]'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-2xl ${
                        isActive ? 'bg-acid text-night' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      <Icon size={22} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold text-white">{module.title}</span>
                      <span className="mt-1 block text-sm text-slate-400">{module.subtitle}</span>
                    </span>
                    <ArrowRight
                      className={`transition ${isActive ? 'text-acid' : 'text-slate-600 group-hover:text-slate-300'}`}
                      size={18}
                    />
                  </button>
                );
              })}
            </div>

            {/* 设置卡片 */}
            <div className="rounded-3xl border border-white/10 bg-night/60 p-4">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                <KeyRound size={17} className="text-acid" />
                大模型连接设置
                <span className="ml-auto rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.65rem] text-slate-500">
                  自动保存
                </span>
              </div>
              <label className="mb-3 block">
                <span className="mb-1 block text-xs text-slate-500">API Key</span>
                <input
                  value={settings.apiKey}
                  onChange={(event) =>
                    setSettings({ ...settings, apiKey: event.target.value })
                  }
                  type="password"
                  placeholder="sk-..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-acid/50"
                />
              </label>
              <label className="mb-3 block">
                <span className="mb-1 block text-xs text-slate-500">Base URL</span>
                <input
                  value={settings.baseUrl}
                  onChange={(event) =>
                    setSettings({ ...settings, baseUrl: event.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-acid/50"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-slate-500">Model</span>
                <input
                  value={settings.model}
                  onChange={(event) =>
                    setSettings({ ...settings, model: event.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-acid/50"
                />
              </label>
            </div>
          </aside>

          {/* ---------- 右侧面板 ---------- */}
          <section className="grid min-h-[680px] gap-6 xl:grid-cols-2">
            {/* 输入区 */}
            <div className="flex flex-col rounded-[2rem] border border-white/10 bg-panel/80 p-5 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">输入区</p>
                  <h2 className="mt-1 text-xl font-bold text-white">{currentModule.subtitle}</h2>
                </div>
                <div className="flex items-center gap-1.5">
                  {input && (
                    <button
                      type="button"
                      onClick={handleClearInput}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:border-white/20 hover:text-slate-200 disabled:opacity-40"
                    >
                      <Eraser size={14} />
                      清空
                    </button>
                  )}
                  <BrainCircuit className="text-violet" size={20} />
                </div>
              </div>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentModule.placeholder}
                disabled={loading}
                className="min-h-[390px] flex-1 resize-none rounded-3xl border border-white/10 bg-night/70 p-5 text-base leading-7 text-slate-100 placeholder:text-slate-600 focus:border-acid/50 disabled:opacity-60"
              />

              {/* 错误提示 */}
              {error && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-acid to-violet px-5 py-4 font-bold text-night transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Wand2 size={19} />
                      {currentModule.action}
                    </>
                  )}
                </button>

                {loading && (
                  <button
                    type="button"
                    onClick={handleAbort}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 font-semibold text-red-300 transition hover:bg-red-500/20"
                  >
                    <Square size={17} />
                    中止
                  </button>
                )}
              </div>
            </div>

            {/* 输出区 */}
            <div className="flex flex-col rounded-[2rem] border border-white/10 bg-panel/80 p-5 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">输出区</p>
                  <h2 className="mt-1 text-xl font-bold text-white">结构化结果预览</h2>
                </div>
                <div className="flex items-center gap-2">
                  {hasOutput && !loading && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-acid/30 bg-acid/10 px-3 py-1.5 text-xs text-acid transition hover:bg-acid/20"
                    >
                      <Copy size={14} />
                      复制
                    </button>
                  )}
                  <div
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      loading
                        ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
                        : 'border-acid/30 bg-acid/10 text-acid'
                    }`}
                  >
                    {loading ? 'Streaming...' : 'Markdown Ready'}
                  </div>
                </div>
              </div>

              <article className="min-h-[500px] flex-1 overflow-y-auto rounded-3xl border border-white/10 bg-night/70 p-5 text-sm leading-7 text-slate-200">
                {loading && !output ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <Loader2 size={32} className="animate-spin text-acid" />
                      <span>正在生成...</span>
                    </div>
                  </div>
                ) : (
                  <MarkdownOutput content={output} />
                )}
              </article>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export default App;

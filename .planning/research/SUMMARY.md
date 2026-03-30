# Project Research Summary

**Project:** PigLet CLI
**Domain:** 本地终端 Agent REPL / CLI 交互界面
**Researched:** 2026-03-30
**Confidence:** HIGH

## Executive Summary

这是一个以终端交互体验为核心的本地 Agent REPL 项目。研究结果表明，最稳妥的路线不是堆重型 TUI 控件，而是采用组件化终端渲染、显式状态机和流式事件桥接，让“命令发现、working 反馈、流式输出、过程时间线”在同一交互闭环里协同工作。

推荐路线是 `Node.js + TypeScript + Ink`。官方资料显示 Ink 天然适合 React 风格的终端组件化 UI，Node.js 本身提供了稳定的 TTY 键盘输入与取消信号能力，而官方流式 API 文档也说明异步迭代消费非常适合实现进行中的消息更新。关键风险不在底层能力缺失，而在状态边界混乱、无反馈等待和流式重绘抖动。

## Key Findings

### Recommended Stack

本项目最适合使用 Node.js 作为本地 CLI 运行时，TypeScript 负责状态和事件建模，Ink 负责终端 UI 组件渲染。这样可以在较低复杂度下实现欢迎区、输入区、命令面板、working 状态和时间线式输出。

**Core technologies:**
- Node.js：CLI 运行时与流式 I/O —— 官方支持 TTY 键盘事件和 `AbortController`
- TypeScript：状态机与命令 schema —— 降低多状态 REPL 的复杂度
- Ink：终端 UI 组件层 —— 支持组件化渲染和键盘输入

### Expected Features

从同类产品心智和截图样本看，用户对本地 Agent REPL 的最低预期已经不再只是“能提问”。他们至少期待有持久输入区、命令模式、Working 提示、流式输出和中断能力。

**Must have (table stakes):**
- 持久底部输入区 —— 否则不具备会话式工具的稳定入口
- 斜杠命令模式 —— 否则高级能力不可发现
- Working 状态与耗时 —— 否则长等待缺乏信任感
- 流式输出 —— 否则交互感明显落后
- 中断能力 —— 否则长任务不可控

**Should have (competitive):**
- 过程事件时间线 —— 增强 Agent 透明度
- 品牌化欢迎卡 —— 强化首屏秩序感

**Defer (v2+):**
- 多会话标签页 —— 不是验证核心体验的必要条件
- 插件系统 —— 应在核心运行时稳定后再考虑

### Architecture Approach

推荐架构是“组件层 + 状态层 + 运行时层”三段式。UI 只负责渲染当前状态和时间线，状态机负责模式切换，运行时适配层负责把外部流式事件统一转成内部 chunk / event / complete / error。

**Major components:**
1. Composer / CommandPalette —— 输入与命令发现
2. WorkingStatus / Timeline —— 状态反馈与会话呈现
3. agent-client / stream-parser —— 流式响应与中断控制

### Critical Pitfalls

1. **提交后长时间静默** —— 提交后立即显示 working 和耗时
2. **命令模式不可发现** —— 建立命令注册表与可操作候选面板
3. **流式输出抖动** —— 用“进行中消息节点”而不是碎片追加
4. **中断只改 UI 不停请求** —— 全链路使用取消信号

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: 终端壳层与命令模式基础
**Rationale:** 先建立可见的 REPL 框架和命令发现能力，才能支撑后续交互  
**Delivers:** 欢迎区、底部输入区、斜杠命令模式、基础状态机  
**Addresses:** 命令模式不可发现  
**Avoids:** 过早接入复杂运行时导致 UI 框架返工

### Phase 2: 工作中反馈与流式交互闭环
**Rationale:** 这是“像不像 Agent”的核心体验，应尽早成型  
**Delivers:** working 状态、耗时、脉冲动画、流式回复、中断能力  
**Uses:** Node.js TTY / AbortController / 流式 SDK  
**Implements:** 请求生命周期与进行中消息模型

### Phase 3: 过程时间线与可解释性
**Rationale:** 在主闭环稳定后增加透明度和过程感最划算  
**Delivers:** 结构化事件、事件与回答共用时间线、错误状态块  
**Uses:** 统一事件模型  
**Implements:** runtime event bridge

### Phase 4: 打包、验证与发布准备
**Rationale:** 在核心交互定型后再做工程化收口  
**Delivers:** CLI 入口、测试、验证脚本、发布前体验检查

### Phase Ordering Rationale

- 命令模式和布局必须先于复杂运行时，否则用户无法稳定感知交互入口
- working / 流式 / 中断必须在同一阶段打通，否则生命周期会反复返工
- 过程事件应建立在稳定时间线模型之上，否则只会变成散乱日志

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** 需要确认具体模型 SDK 的流式事件结构与取消行为
- **Phase 4:** 需要确认跨平台打包和 Windows 终端兼容细节

Phases with standard patterns (skip research-phase):
- **Phase 1:** Ink 组件布局与命令列表交互属于成熟模式
- **Phase 3:** 事件时间线主要是内部 UI 建模问题

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | 关键能力都有官方资料支撑 |
| Features | HIGH | 用户预期与截图目标高度明确 |
| Architecture | HIGH | 组件层 / 状态层 / 运行时层边界清晰 |
| Pitfalls | HIGH | 多为同类终端工具的常见失误模式 |

**Overall confidence:** HIGH

### Gaps to Address

- 具体接入哪个模型提供方仍需在 Phase 2 规划时定版
- Windows 下不同终端对按键事件的细微差异需要在实现中实际验证

## Sources

### Primary (HIGH confidence)
- Ink 官方 README — 终端组件、布局、`useInput`  
  https://github.com/vadimdemedes/ink
- Node.js 官方 `readline` 文档 — 键盘事件与 TTY 输入  
  https://nodejs.org/api/readline.html
- Node.js 官方 `AbortController` 文档 — 取消控制  
  https://nodejs.org/api/globals.html#class-abortcontroller
- OpenAI 官方流式响应文档 — 流式 chunk 消费  
  https://developers.openai.com/api/docs/guides/streaming-responses

### Secondary (MEDIUM confidence)
- 你提供的 Claude Code / Codex 截图 —— 用于交互目标对齐

---
*Research completed: 2026-03-30*
*Ready for roadmap: yes*

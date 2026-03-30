<!-- GSD:project-start source:PROJECT.md -->
## Project

**PigLet CLI**

### Constraints

- **平台**: 本地终端优先，Windows 优先 —— 需要尽早验证 PowerShell / Windows Terminal 的交互行为
- **交互**: 键盘优先 —— 所有核心流程都必须可通过键盘完成
- **兼容性**: ANSI 兼容 —— 颜色、状态和动画需要能在常见终端中优雅降级
- **体验**: 首屏可理解、等待时可感知 —— 不能出现提交后长时间“无声等待”
- **架构**: 绿地项目但要避免过度设计 —— 先做清晰边界和最小闭环，再扩展能力
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Node.js | 20 LTS 或更高 | CLI 运行时、流式 I/O、取消控制 | 官方内置 TTY、`readline`、`AbortController` 等能力，适合本地交互式工具 |
| TypeScript | 5.x | 类型安全、状态建模、组件边界约束 | 适合定义 UI 状态机、命令注册表和事件负载，降低 REPL 交互复杂度 |
| Ink | 5.x 稳定版 | React 风格终端 UI 渲染 | 官方 README 明确支持组件化 CLI、Flexbox 布局和键盘输入能力，且已有 Claude Code 等同类产品采用 |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react | 18.x 或与 Ink 兼容版本 | Ink 运行依赖 | 所有终端组件都依赖 React 组件模型 |
| zod | 3.x 或更高 | 命令 schema 与参数校验 | 命令模式从展示走向执行时需要可靠的参数校验 |
| chalk 或 Ink 自带样式能力 | 最新稳定版 | ANSI 文本着色与状态强调 | 用于命令高亮、错误块、working 脉冲的视觉表达 |
| openai | 最新稳定版 | 若接入 OpenAI 流式输出 | 官方支持 `stream: true` 与异步迭代流式消费 |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| vitest | 单元测试与轻量运行时测试 | 适合验证状态机、命令过滤、流式拼接 |
| ink-testing-library | 终端组件测试 | 用于断言欢迎卡、命令列表、working 状态渲染 |
| tsx | 本地开发启动 | 适合在绿地项目中快速跑 TypeScript CLI |
## Installation
# Core
# Dev dependencies
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Ink | `readline` 原生手写渲染 | 如果项目最终只需要非常轻量的单行输入与少量重绘 |
| Ink | blessed / neo-blessed | 如果需要更重的窗口、面板、表格式 TUI，而不是偏 Agent 会话流 |
| OpenAI 官方 SDK 流式消费 | 手写 SSE 解析 | 如果需要接多个服务商并统一底层流协议 |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| 一开始就堆大量终端控件库 | 会把问题从“Agent 交互体验”转成“复杂 TUI 搭积木” | 先用 Ink 做清晰的会话式布局 |
| 无类型的命令注册与事件总线 | 后续命令模式和流式事件很容易失控 | 用 TypeScript + schema 建模 |
| 先做同步整块输出 | 无法满足实时交互目标 | 一开始就按流式输出架构设计 |
## Stack Patterns by Variant
- 使用单一 `agent-client` 适配层
- 因为可以先把流式生命周期和取消机制做稳定
- 把请求生命周期抽象为统一事件接口
- 因为 UI 关心的是 chunk、event、complete、error，而不是厂商细节
## Version Compatibility
| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `ink@5.x` | `react@18.x` | 需按 Ink 官方兼容版本安装 |
| `openai` 最新稳定版 | `Node.js 18+` | 流式接口和现代 fetch/Abort 能力更稳 |
## Sources
- Ink 官方 README（GitHub）—— 组件化 CLI、Flexbox 布局、`useInput` 键盘事件能力  
- Node.js 官方 `readline` 文档 —— `emitKeypressEvents()` 与 TTY 键盘输入  
- Node.js 官方 `AbortController` 文档 —— Promise API 取消与中断信号  
- OpenAI 官方流式响应文档 —— `stream: true` 与异步迭代消费  
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

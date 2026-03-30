# Phase 1: 终端壳层与命令模式基础 - Research

**Date:** 2026-03-30
**Status:** complete
**Phase:** 01-terminal-shell-command-foundation

## Objective

回答这个阶段真正需要的规划问题：在绿地仓库里，如何用最小但可靠的结构搭起一个“像 Agent CLI”的终端壳层，并为后续 working、流式输出和中断能力预留稳定边界。

## Key Findings

### 1. Ink 适合做 Phase 1 的终端壳层

- Ink 官方 README 明确支持 React 风格终端 UI、Flexbox 布局和键盘输入处理，适合 WelcomeCard、Composer、CommandPalette 这类组件化场景。
- 对本阶段最关键的是：先把布局、输入和命令模式的结构搭起来，而不是过早做复杂终端窗口系统。
- 因此推荐直接采用 `Node.js + TypeScript + Ink`，不要先用 `readline` 手搓整套渲染。

### 2. 命令模式必须从第一阶段就做成“注册表 + 过滤器”

- 如果命令能力只是解析输入字符串，后续增加说明、别名、排序和参数提示时会非常容易失控。
- 更稳妥的做法是在 Phase 1 就建立：
  - 命令元数据注册表
  - 过滤 / 排序逻辑
  - 与 Composer 解耦的候选面板组件

### 3. 显式 UI 状态机值得尽早建立

- 这个产品后续一定会有 `working`、`streaming`、`interrupted`、`failed` 等状态。
- 如果 Phase 1 不先建立最基础的 `idle / command_suggesting / submitting / completed` 状态边界，Phase 2 接 waiting 和 streaming 时会返工。

### 4. 本阶段应优先交付“可读、可用、可发现”

- 首屏欢迎卡不需要复杂视觉，但必须清楚呈现产品名、模型和目录。
- 输入区必须固定在底部，不能随着历史输出漂移。
- 输入 `/` 后必须立刻看到命令候选和说明文案，让功能不依赖记忆。

## Recommended Build Order

1. 先搭起 CLI 入口、根应用和欢迎卡片
2. 再接底部输入区与基础状态机
3. 最后接命令注册表、过滤器和命令候选面板

这样可以最早形成一个完整可交互闭环，并避免把命令系统塞进未成型的输入逻辑里。

## Practical Constraints

- 当前仓库无现有源码，因此不需要为兼容旧结构付出代价
- Windows 终端键位行为应尽早用真实终端验证
- 命令模式空态、默认高亮和退出行为都需要在 Phase 1 就锁定

## Recommended File Boundaries

- `src/index.tsx`：CLI 启动入口
- `src/app.tsx`：根布局与状态分发
- `src/components/WelcomeCard.tsx`：欢迎区
- `src/components/Composer.tsx`：底部输入区
- `src/components/CommandPalette.tsx`：命令候选面板
- `src/commands/registry.ts`：命令定义
- `src/commands/filter.ts`：过滤与排序
- `src/state/ui-machine.ts`：UI 模式切换
- `src/state/session-store.ts`：会话与时间线基础数据

## Planning Implications

- Phase 1 适合拆成 3 个顺序计划：
  - 01-01：应用壳层与欢迎区
  - 01-02：输入区与基础状态机
  - 01-03：命令注册表与命令候选面板
- 之所以不并行拆更多，是因为在空仓库里，应用壳层和状态边界是后续输入与命令交互的前置条件。

## Validation Architecture

### 为什么 Phase 1 就要带测试

- 命令过滤排序和状态机切换都非常适合单元测试
- WelcomeCard、CommandPalette、WorkingStatus 这类终端组件适合用 `ink-testing-library` 做渲染断言
- 绿地项目最容易在早期忽视测试基础，一旦跳过，后面补会更贵

### 建议的验证策略

- 使用 `vitest` 作为统一测试框架
- 使用 `ink-testing-library` 对欢迎区和命令面板做组件断言
- 对 `filterCommands` 和 `transition` 等纯逻辑做快速单元测试

### 建议的快速命令

- 快速验证：`npm test -- --runInBand`
- 类型/构建验证：`npm run build`

## Sources

- Ink 官方 README  
  https://github.com/vadimdemedes/ink
- Node.js `readline` 文档  
  https://nodejs.org/api/readline.html
- `.planning/research/STACK.md`
- `.planning/research/ARCHITECTURE.md`
- `docs/superpowers/specs/2026-03-30-local-repl-agent-ui-design.md`

---
*Research completed: 2026-03-30*

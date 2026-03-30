# Phase 1: 终端壳层与命令模式基础 - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

本阶段只负责交付可运行的终端会话壳层与命令模式基础能力：欢迎卡片、固定底部输入区、基础 UI 状态机，以及输入 `/` 后出现的可操作命令候选面板。working 状态、流式回复、中断链路和结构化过程时间线属于后续阶段，不在本阶段直接实现。

</domain>

<decisions>
## Implementation Decisions

### 首屏布局
- **D-01:** 首屏采用紧凑的品牌欢迎卡片，而不是全屏 ASCII 场景图或占满首屏的装饰界面。
- **D-02:** 欢迎卡片必须展示产品名、版本、当前模型、当前目录，并保留一条简短提示文案。
- **D-03:** 欢迎区在 Phase 1 不做复杂折叠逻辑，先以稳定可读为优先。

### 输入区行为
- **D-04:** Phase 1 的 composer 采用单行优先的输入模型，`Enter` 直接提交。
- **D-05:** 输入区始终固定在底部，不因历史输出增长而移动。
- **D-06:** 多行输入、草稿恢复等增强能力不在本阶段锁定，由后续阶段视需要扩展。

### 命令面板
- **D-07:** 输入 `/` 后进入明确的命令模式，并在输入区附近展开候选面板。
- **D-08:** 命令候选项必须显示“命令名 + 一句话说明”，不能只显示命令名。
- **D-09:** 候选排序优先级固定为：精确前缀匹配 > 别名匹配 > 描述关键词匹配 > 字母序。

### 键盘交互
- **D-10:** 命令模式必须支持 `Up` / `Down` 切换高亮、`Enter` 选择、`Tab` 补全、`Esc` 退出。
- **D-11:** 高亮项始终有明确视觉区分，默认高亮当前最优匹配项。
- **D-12:** 若没有匹配命令，面板显示空状态提示，而不是静默消失。

### 架构边界
- **D-13:** 本阶段就建立显式 UI 状态机，至少覆盖 `idle`、`command_suggesting`、`submitting`、`completed` 等基础状态。
- **D-14:** 命令定义采用注册表方式集中管理，不使用散落的硬编码字符串判断。

### the agent's Discretion
- Welcome 卡片的具体边框符号、间距和颜色 token
- 命令列表高亮的具体配色方案
- 输入框的占位文案措辞
- 命令列表一次显示的最大行数与滚动细节

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 产品设计与交互目标
- `docs/superpowers/specs/2026-03-30-local-repl-agent-ui-design.md` - 定义整体产品目标、布局分区、状态机、命令模式、working 状态和验收标准
- `docs/superpowers/plans/2026-03-30-local-repl-agent-ui.md` - 定义建议的文件边界、阶段拆分与实现优先级

### 项目范围与阶段边界
- `.planning/PROJECT.md` - 项目定位、核心价值、约束与关键决策
- `.planning/REQUIREMENTS.md` - Phase 1 对应的 `SHEL-*` 与 `CMD-*` 需求定义
- `.planning/ROADMAP.md` - Phase 1 目标、成功标准与阶段边界
- `.planning/research/SUMMARY.md` - 研究总结、阶段排序理由与风险提醒

### 技术路线
- `.planning/research/STACK.md` - 推荐使用 `Node.js + TypeScript + Ink` 作为首选技术栈
- `.planning/research/ARCHITECTURE.md` - 组件层、状态层、运行时层的推荐边界

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 当前仓库暂无可复用业务代码资产；本阶段从绿地状态起步。
- 已有设计与计划文档可直接转化为代码结构和组件边界。

### Established Patterns
- 已锁定显式 UI 状态机，而不是用多个布尔值拼状态。
- 已锁定命令注册表 + 过滤器模式，而不是散落在输入逻辑中的字符串判断。
- 已锁定终端组件化路线，优先使用 `Node.js + TypeScript + Ink`。

### Integration Points
- 后续代码将以 `src/index.tsx` 作为 CLI 入口
- 根应用预计由 `src/app.tsx` 组合 WelcomeCard、Timeline、Composer、CommandPalette
- 命令模式将连接 `src/commands/registry.ts` 与 `src/commands/filter.ts`
- UI 模式切换将连接 `src/state/ui-machine.ts`

</code_context>

<specifics>
## Specific Ideas

- 目标首屏参考你提供的 Claude Code / Codex 截图，但不照搬其错误提示或品牌视觉，只保留“欢迎卡片 + 持久底部输入区 + 下方命令面板”的交互结构。
- 命令模式应优先追求“可发现性”，让用户在不查文档的情况下输入 `/` 就知道系统能做什么。
- 本阶段的输出重点是“看起来已经像一个专业 Agent CLI 的壳层”，而不是先把模型接入做深。

</specifics>

<deferred>
## Deferred Ideas

- working 状态、耗时与脉冲动画 —— Phase 2
- 流式输出与中断链路 —— Phase 2
- 结构化过程事件时间线 —— Phase 3
- 错误块与完成后焦点恢复 —— Phase 3
- 多会话标签页、插件系统 —— v2+

</deferred>

---

*Phase: 01-terminal-shell-command-foundation*
*Context gathered: 2026-03-30*

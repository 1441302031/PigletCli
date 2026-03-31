# Phase 3: 过程时间线与可靠性体验 - Research

**Date:** 2026-03-31
**Phase:** 03-timeline-and-reliability

## Research Question

如何在当前已经具备真实 DeepSeek 交互能力的 Ink REPL 基础上，把 Working、状态事件、错误与完成反馈统一进同一条时间线，同时不破坏现有输入区与命令模式体验？

## Findings

### 1. 当前时间线已经是正确入口，但数据模型过于扁平
- `src/state/session-store.ts` 目前的 `TimelineEntry` 只有 `role`、`content` 和 `pending`，足以支撑最小流式回复，但无法稳定表达“错误块”“完成态”“结构化事件”。
- 如果继续沿用字符串拼接的方式，Phase 3 会把状态渲染逻辑进一步推回 `App` 组件，后续维护成本会快速上升。

### 2. 当前 `App` 已经承担了过多“状态转文案”的职责
- `src/app.tsx` 里同时负责时间线更新、命令反馈、Working 展示和错误文本拼接。
- Phase 3 最适合把“请求生命周期 -> 时间线事件”的映射显式化，让 `App` 只负责组合与调度，而不是继续累加文案分支。

### 3. `runtime` 已经提供了结构化生命周期信号
- `src/runtime/chat-session.ts` 已统一提供 `onStreamStarted`、`onStreamDelta`、`onComplete`、`onInterrupted`、`onError`。
- 这意味着 Phase 3 不需要重新设计请求生命周期，只需要把这些信号稳定映射为 timeline item。

### 4. 错误反馈应该优先数据结构升级，再做视觉分层
- 目前失败路径大多被压缩成 `status` 文本，缺失“错误类型”和“恢复建议”。
- 推荐做法是先引入 `error_block` 类型，再在 `Timeline` 中用一致的边框/颜色/说明渲染；这样测试也更稳定。

### 5. 完成态是当前最缺失的收口环节
- 现在请求结束主要靠 `Working` 消失和状态切换完成，用户能继续输入，但缺少明显的“这一轮已结束”信号。
- 对 REPL 体验来说，完成态事件比额外动画更重要，因为它能帮助用户确认“上一轮已经稳定落盘”。

## Recommended Architecture

### Timeline Data Model
- 在 `src/state/session-store.ts` 中把 `TimelineEntry` 扩展为 discriminated union
- 最小建议类型：
  - `user_message`
  - `assistant_message`
  - `status_event`
  - `error_block`
  - `completion_event`

### Rendering Strategy
- `src/components/Timeline.tsx` 作为唯一渲染入口
- 内部按 item 类型分发渲染，不在 `App` 里硬编码每种视觉样式
- `WorkingIndicator` 继续保持独立组件，但其显示与隐藏由统一生命周期控制

### Event Mapping
- 命令反馈：映射为 `status_event`
- 缺失配置 / 请求失败：映射为 `error_block`
- 正常完成 / 用户中断：映射为 `completion_event` 或显式完成类事件
- 流式回复：保持 `assistant_message` 增量拼接，但结束时补齐完成态收口

## Risks

- 如果在 Phase 3 一次性引入过多事件类型，可能会让测试和渲染复杂度一起上升；建议先围绕当前真实存在的事件做最小闭环。
- 如果继续把错误和完成文案写死在 `App` 中，未来接入更多 provider 或工具事件时会重复返工。
- 结构化错误块如果过度追求视觉复杂度，可能反而导致终端输出拥挤；应优先可读性和恢复建议。

## Validation Architecture

### Automated
- 时间线 item 结构与状态映射单元测试
- `Timeline` 组件针对结构化事件、错误块、完成态的渲染测试
- `App` 组件针对完成/失败/中断后的输入恢复测试

### Manual
- 在 `Windows Terminal` 下验证正常请求、失败请求和用户中断都进入统一时间线
- 验证完成后输入区立即恢复可编辑
- 验证命令反馈（如 `/model`）与普通对话反馈呈现方式一致

---

*Research completed: 2026-03-31*

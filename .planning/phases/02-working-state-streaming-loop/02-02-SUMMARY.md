---
phase: 02-working-state-streaming-loop
plan: 02
subsystem: ui
tags: [working, streaming, deepseek, ink, timeline, repl]
requires:
  - phase: 02-working-state-streaming-loop
    provides: "DeepSeek provider 基础设施与执行态状态机"
provides:
  - "Working 指示器与等待时长显示"
  - "流式时间线渲染"
  - "App 级 DeepSeek 提交闭环"
  - "/model 切换后的实时模型显示"
affects: [interrupt, error-feedback, local-uat]
tech-stack:
  added: []
  patterns: ["运行时 ChatRuntime 注入", "时间线增量写入", "Working 与 Streaming 分态渲染"]
key-files:
  created:
    - src/components/WorkingIndicator.tsx
    - src/components/Timeline.tsx
    - src/runtime/chat-session.ts
    - tests/components/working-indicator.test.tsx
    - tests/components/app-working-streaming.test.tsx
  modified:
    - src/app.tsx
    - src/state/session-store.ts
    - tests/components/app-command-mode.test.tsx
    - tests/components/welcome-card.test.tsx
key-decisions:
  - "Working 状态在提交后立即显示，不等待首个 chunk"
  - "流式内容优先写入时间线，而不是整块替换历史输出"
  - "当前模型显示绑定会话状态，而不是固定启动参数"
patterns-established:
  - "ChatRuntime.submit 负责提交与流式回调，App 负责渲染状态"
  - "assistant 流式内容以 pending timeline entry 逐步累积"
requirements-completed: [EXEC-01, EXEC-02, EXEC-03, TIME-02]
duration: 35min
completed: 2026-03-31
---

# Phase 02 Plan 02 Summary

**CLI 已经从静态壳层升级为可见 Working、可流式返回、可切换 DeepSeek 模型的真实交互界面。**

## Accomplishments

- 提交后立即显示 `Working` 和已等待秒数，并有循环高亮脉冲效果。
- 把 DeepSeek 的 SSE 流解析接入时间线，支持流式追加 assistant 内容。
- `/model deepseek-chat` 与 `/model deepseek-reasoner` 已能直接在本地切换，并更新欢迎卡片中的当前模型。

## Task Commits

- 当前实现已在本地工作区完成并通过验证，尚未单独提交。

## Files Created/Modified

- `src/components/WorkingIndicator.tsx` - Working 提示、等待秒数和脉冲高亮
- `src/components/Timeline.tsx` - user / assistant / status 时间线
- `src/runtime/chat-session.ts` - DeepSeek 流式会话运行时
- `src/app.tsx` - 提交、流式回写、模型切换、时间线集成
- `tests/components/app-working-streaming.test.tsx` - 提交后 working 与流式追加测试

## Issues Encountered

- `ink-testing-library` 中“输入后立刻回车”会读到旧 render 的 draft，测试改为先输入、等一帧、再回车后稳定通过。

## Next Phase Readiness

- 中断控制和结构化错误反馈已经有运行时落点，可以继续补 `Esc`、缺失 Key 反馈和 README。

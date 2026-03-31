# Phase 3: 过程时间线与可靠性体验 - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

本阶段负责把当前已经具备真实模型交互能力的本地 REPL，升级成“过程透明、错误可恢复、完成态清晰”的统一时间线体验。范围只包含三类能力：

- 把用户输入、过程事件、Working、助手回复、错误和完成状态统一到同一条时间线
- 把当前零散的失败提示升级成结构化错误块，并附带恢复建议
- 在每轮请求结束后恢复稳定的输入态和焦点，确保用户能立刻进入下一轮交互

本阶段不新增 provider、不扩展多会话，也不把 `VS Code Terminal` 兼容性问题重新纳入 blocker。

</domain>

<decisions>
## Implementation Decisions

### 时间线模型
- **D-01:** 时间线继续作为唯一主输出区域，用户输入、助手输出、系统状态、结构化事件、错误块和完成态都进入同一个 `timeline` 数据源，而不是拆成多个平行区域。
- **D-02:** `timeline` item 需要从当前简单的 `role + content` 扩展为可区分类型的结构，例如 `user_message`、`assistant_message`、`status_event`、`error_block`、`completion_event`。
- **D-03:** `Working` 提示仍可在请求进行中保持高可见，但它的出现和结束必须与时间线生命周期对齐，避免“单独悬浮、结束后无收口”的割裂感。

### 结构化事件与错误反馈
- **D-04:** 过程事件要以结构化 item 进入时间线，优先覆盖 `model_changed`、`request_started`、`request_interrupted`、`request_failed`、`request_completed` 这几类当前已经真实存在的系统状态。
- **D-05:** 错误反馈不再只是一行文本，而是结构化错误块，至少包含错误标题、原因摘要和恢复建议；但仍保持终端友好，不引入复杂富文本。
- **D-06:** 缺失配置、网络失败、用户中断和模型返回异常都走同一套错误/状态映射规则，避免每种失败路径各自拼接文案。

### 完成态与焦点恢复
- **D-07:** 一轮请求正常完成后，界面应产生明确完成态收口，例如时间线中的完成事件或稳定的结束标记，而不是仅仅让 `Working` 消失。
- **D-08:** 请求完成、失败或中断后，输入区都必须恢复到可编辑态；如果没有特殊上下文残留需求，默认清空草稿并允许立即继续输入。
- **D-09:** `/model`、`/exit` 这类命令执行后的状态反馈也要与普通对话保持一致，优先通过时间线事件表达，而不是静默更新界面。

### 环境与验收口径
- **D-10:** `Windows Terminal` 继续作为本阶段正式支持环境，Phase 3 的体验收口和 UAT 以它为准。
- **D-11:** `VS Code Terminal` 的已知抖动/输入法问题仅记录为兼容性事项，不阻塞本阶段规划与执行。

### the agent's Discretion
- 时间线 item 的内部命名、TypeScript union 设计与渲染组件拆分
- 错误块的具体边框、前缀符号和配色 token
- 完成态事件的具体文案与是否附带耗时信息
- 时间线中过程事件的折叠粒度与渲染密度

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 产品目标与交互规范
- `docs/superpowers/specs/2026-03-30-local-repl-agent-ui-design.md` - 定义统一时间线、Working、流式输出、错误反馈与验收目标
- `docs/superpowers/plans/2026-03-30-local-repl-agent-ui.md` - 给出按阶段推进的实现路径与边界

### 项目范围与阶段边界
- `.planning/PROJECT.md` - 项目定位、核心价值与“让用户始终知道系统在做什么”的总原则
- `.planning/REQUIREMENTS.md` - Phase 3 对应的 `TIME-01`、`TIME-03`、`RELY-01`、`RELY-02`
- `.planning/ROADMAP.md` - Phase 3 的目标、成功标准与计划拆分
- `.planning/STATE.md` - 当前阶段位置与上一阶段已接受的环境口径

### 前序阶段决策
- `.planning/phases/01-terminal-shell-command-foundation/01-CONTEXT.md` - 输入区、命令模式、状态机与布局边界
- `.planning/phases/02-working-state-streaming-loop/02-CONTEXT.md` - DeepSeek 接入、Working、流式输出、中断与本地配置决策
- `.planning/phases/02-working-state-streaming-loop/02-UAT.md` - Phase 2 已接受的验收口径与正式支持环境

### 当前代码落点
- `src/app.tsx` - 当前时间线、Working、Composer 与命令模式的总装配点
- `src/components/Timeline.tsx` - 当前时间线渲染逻辑，后续结构化 item 的直接落点
- `src/state/session-store.ts` - 当前会话状态与 `timeline` item 结构定义
- `src/runtime/chat-session.ts` - 请求开始、流式、完成、中断、失败事件的实际来源
- `src/components/Composer.tsx` - 输入恢复与完成态后的可编辑性落点

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/Timeline.tsx`：已经是统一输出区的唯一渲染入口，适合继续扩展为多种 item 类型的渲染器。
- `src/runtime/chat-session.ts`：已经把 `onStreamStarted`、`onStreamDelta`、`onComplete`、`onInterrupted`、`onError` 统一成回调协议，适合映射为结构化时间线事件。
- `src/app.tsx`：已经有 `timelineSection`、`WorkingIndicator`、`Composer` 和命令反馈逻辑，适合作为 Phase 3 的组装层，而不是继续堆业务判断。

### Established Patterns
- 当前项目已经接受“显式状态机 + 会话状态容器”的模式，因此 Phase 3 应继续扩展类型和事件，而不是回退到散落布尔值。
- 当前命令执行和普通对话都写入 `session.timeline`，说明“所有反馈进同一时间线”的方向与现有结构一致。
- 当前错误和状态消息大多还是 `status` 文本，说明结构化升级应优先在数据模型上完成，而不是只改样式。

### Integration Points
- `src/state/session-store.ts` 需要先定义新的 timeline item 结构，`src/app.tsx` 和 `src/components/Timeline.tsx` 再同步消费。
- `src/runtime/chat-session.ts` 的回调结果需要映射为 `request_started` / `request_failed` / `request_completed` 等时间线事件。
- `/model`、`/exit` 等命令反馈也应通过统一时间线 item 进入渲染层，减少特殊分支。

</code_context>

<specifics>
## Specific Ideas

- 这一阶段的重点不是“再加更多功能”，而是把 Phase 2 已经能跑起来的真实交互，整理成更可信、更好读的时间线。
- 用户已经明确接受 `Windows Terminal` 为当前正式支持环境，因此本阶段可以优先把体验打磨在正式支持环境上，而不是被 `VS Code Terminal` 兼容性拖住。
- 当前最值得收口的不是模型能力，而是“请求开始了什么、失败了为什么、结束后下一步怎么继续”这些状态感。

</specifics>

<deferred>
## Deferred Ideas

- `VS Code Terminal` 下的抖动与输入法兼容性继续作为后续兼容性事项保留
- 更细粒度的过程事件（如 `Explored`、`Read`、`Ran` 自动分类）可以在后续阶段继续丰富
- 多 provider 统一错误码与跨模型状态规范不在本阶段处理

</deferred>

---

*Phase: 03-timeline-and-reliability*
*Context gathered: 2026-03-31*

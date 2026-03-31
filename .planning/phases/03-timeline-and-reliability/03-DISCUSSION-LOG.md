# Phase 3: 过程时间线与可靠性体验 - Discussion Log

> **仅用于审计与回看。** 下游规划与实现以 `03-CONTEXT.md` 为准。
> 本次为 `--auto` 模式，以下选择均为自动采用的推荐默认值。

**Date:** 2026-03-31
**Phase:** 03-timeline-and-reliability
**Areas discussed:** 时间线模型、错误反馈、完成态与焦点恢复

---

## 时间线模型

| Option | Description | Selected |
|--------|-------------|----------|
| 统一时间线 item 模型 | 用户、助手、系统状态、错误和完成态都进入同一 `timeline` 数据源 | ✓ |
| 维持当前消息列表 + 独立状态区 | 继续让 Working、错误、状态提示散落在时间线外部 | |
| 仅扩展样式不扩展模型 | 仍用 `role + content`，通过样式硬区分不同状态 | |

**User's choice:** `[auto] 统一时间线 item 模型`
**Notes:** 推荐项。当前 `src/components/Timeline.tsx` 与 `src/state/session-store.ts` 已经具备统一时间线雏形，扩展数据模型比继续堆叠特殊 UI 分支更稳。

---

## 错误反馈

| Option | Description | Selected |
|--------|-------------|----------|
| 结构化错误块 | 错误进入时间线，包含标题、原因摘要和恢复建议 | ✓ |
| 一行状态文本 | 继续沿用当前 `status` 文本提示，不区分错误层级 | |
| 单独错误面板 | 在时间线外再新增一个独立错误区域 | |

**User's choice:** `[auto] 结构化错误块`
**Notes:** 推荐项。Phase 2 已经验证真实网络、配置与中断场景，Phase 3 应统一失败反馈而不是继续散落字符串。

---

## 完成态与焦点恢复

| Option | Description | Selected |
|--------|-------------|----------|
| 明确完成收口并恢复输入 | 请求完成/失败/中断后都恢复可编辑输入，并给出完成态事件 | ✓ |
| 仅隐藏 Working | 任务结束后只让 Working 消失，不追加完成态 | |
| 保留上次草稿 | 结束后恢复输入，但默认保留旧草稿等待用户手动处理 | |

**User's choice:** `[auto] 明确完成收口并恢复输入`
**Notes:** 推荐项。该选择最符合“让用户始终知道系统在做什么”的项目核心价值，也与当前单轮 REPL 交互模型一致。

---

## the agent's Discretion

- timeline item 的 TypeScript 结构命名
- 错误块和完成态事件的具体终端样式
- 是否在完成态中附带耗时信息

## Deferred Ideas

- `VS Code Terminal` 兼容性问题继续留作后续事项，不纳入本阶段 blocker
- 更细粒度的 agent 过程分类事件延后到后续增强阶段

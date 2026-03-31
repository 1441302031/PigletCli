---
status: complete
phase: 03-timeline-and-reliability
source:
  - 03-01-SUMMARY.md
  - 03-02-SUMMARY.md
  - 03-03-SUMMARY.md
started: 2026-03-31T20:08:00+08:00
updated: 2026-03-31T20:18:00+08:00
---

## Current Test

[testing complete]

## Tests

### 1. 统一时间线闭环
expected: |
  在 Windows Terminal 中启动 `npm run dev` 后，发送一条普通消息。
  你应该能在同一条时间线里依次看到：
  1. 用户输入
  2. 请求开始状态
  3. 助手流式回复
  4. 完成收口提示
result: pass

### 2. 模型切换进入时间线
expected: |
  输入 `/model deepseek-chat` 或 `/model deepseek-reasoner` 后，
  模型切换结果应写入同一条时间线，而不只是静默更新顶部信息。
result: pass

### 3. 结构化错误块
expected: |
  当 `DEEPSEEK_API_KEY` 缺失或请求失败时，
  界面应显示结构化错误块，至少包含错误标题、错误详情和恢复建议。
result: pass

### 4. 完成态与输入恢复
expected: |
  正常完成、失败或按 `Esc` 中断后，
  输入区都会恢复可编辑状态，并可立即继续下一轮输入。
result: pass

## Summary

total: 4
passed: 4
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

None.

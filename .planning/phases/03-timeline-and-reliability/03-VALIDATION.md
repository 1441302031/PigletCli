---
phase: 03-timeline-and-reliability
created: 2026-03-31
status: active
---

# Phase 3 Validation Strategy

## Goal

确保 Phase 3 不只是“把时间线看起来做复杂一点”，而是真正完成统一输出、结构化错误反馈和完成态收口，让用户能稳定感知每一轮交互的开始、进行中和结束。

## Validation Layers

### Layer 1: Unit
- `timeline` item 类型与辅助构造函数
- 请求生命周期映射到 `status_event` / `error_block` / `completion_event`
- 完成、失败、中断后的输入恢复逻辑

### Layer 2: Component / App
- `Timeline` 能渲染多种 item 类型，而不是只渲染纯文本行
- 失败场景会显示结构化错误块，而不是裸字符串
- 正常完成和中断后，输入区都会恢复到可编辑态

### Layer 3: Manual
- `Windows Terminal` 下运行真实 DeepSeek 请求，确认时间线包含：
  - 用户输入
  - Working
  - 助手流式内容
  - 完成事件或失败事件
- 在缺失配置和用户中断场景下，确认时间线能给出恢复建议
- 验证 `/model` 命令执行后也能通过时间线给出清晰状态反馈

## Exit Criteria

- 自动化测试覆盖结构化时间线、错误块、完成态与输入恢复
- `npm run build` 成功
- `Windows Terminal` 下人工验证通过
- Phase 3 的输出逻辑不再依赖散落在 `App` 中的字符串拼接分支

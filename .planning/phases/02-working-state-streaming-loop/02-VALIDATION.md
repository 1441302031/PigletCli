---
phase: 02-working-state-streaming-loop
created: 2026-03-31
status: active
---

# Phase 2 Validation Strategy

## Goal

确保 Phase 2 不只是“看起来像接上了模型”，而是实际完成本地配置、真实请求、流式输出、working 反馈与中断恢复的闭环。

## Validation Layers

### Layer 1: Unit
- 环境变量读取逻辑
- DeepSeek client 请求参数与模型名映射
- UI 状态机中的 `working` / `streaming` / `interrupted` / `failed`
- 流式 chunk 累积与消息拼接

### Layer 2: Component / App
- working 指示器是否在提交后立即出现
- 等待时长是否递增
- 流式文本是否逐步写入时间线
- `/model` 是否能切换到 `deepseek-chat` / `deepseek-reasoner`

### Layer 3: Manual
- 在本地设置 `DEEPSEEK_API_KEY`
- 启动 CLI 并完成一次真实 DeepSeek 对话
- 观察 `Escape` 是否能中断真实请求
- 验证缺失 API Key 时是否给出结构化提示

## Exit Criteria

- 自动化测试覆盖配置读取、provider client、状态机与流式渲染关键路径
- `npm run build` 成功
- 至少一次本地真实 DeepSeek 对话成功
- 缺失密钥与中断场景都有明确可见反馈

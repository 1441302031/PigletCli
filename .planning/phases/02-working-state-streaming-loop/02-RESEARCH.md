# Phase 2: 工作中反馈与流式交互闭环 - Research

**Date:** 2026-03-31
**Phase:** 02-working-state-streaming-loop

## Research Question

如何在现有 `Node.js + TypeScript + Ink` REPL 壳层上，以最小风险接入 DeepSeek，完成本地 API Key 配置、真实流式输出、working 反馈与请求中断闭环？

## Findings

### 1. DeepSeek 适合先作为单 provider 验证链路
- DeepSeek 官方提供与 OpenAI 兼容的 API 格式，适合在当前项目里先以单 provider 验证真实执行链路，而不必提前引入多 provider 管理复杂度。
- 官方文档明确给出了 `deepseek-chat` 和 `deepseek-reasoner` 模型名，适合直接映射到现有 `/model` 命令能力中。

### 2. 流式输出可沿用 SSE / chunk 拼接思路
- DeepSeek 支持流式输出，这意味着本项目不需要为了 Phase 2 先做假流式。
- 对当前 Ink 应用而言，更稳的做法是把“流式 chunk 累积”放进 session / message 层，再把最终渲染交给 `App` 的时间线区域，而不是让网络请求直接驱动组件细粒度状态。

### 3. Provider 接入不能写死在 `App`
- 当前 `src/app.tsx` 已承担布局、输入和命令模式职责，如果再直接加入网络请求、流式解析、中断控制，Phase 2 很容易把 UI 与 provider 协议耦死。
- 推荐增加独立的 provider / runtime 层，至少拆出：
  - 环境变量读取
  - DeepSeek client
  - 请求生命周期控制
  - 流式 chunk -> timeline item 拼接

### 4. 本地配置应坚持环境变量优先
- 对 CLI 项目来说，本地环境变量是最自然的密钥承载方式。
- Phase 2 应优先支持 `DEEPSEEK_API_KEY`，并在缺失配置时给出明确错误提示。
- 仓库可以提供 `.env.example` 或 README 片段，但不能写入真实密钥。

### 5. 中断必须接入真实请求取消
- 既然 Phase 2 目标之一是“执行中可中断”，就不能只在 UI 层把状态重置掉。
- 推荐通过 `AbortController` 或等价取消机制把 `Escape` 绑定到真实请求取消，并在 UI 中落一条明确的 interrupted 状态消息。

### 6. Phase 2 的最小验收应该是真实一问一答
- 单元测试能验证状态机、渲染和 provider adapter 逻辑，但不能证明 DeepSeek 已接通。
- 因此阶段验收必须包含：
  - 本地配置 `DEEPSEEK_API_KEY`
  - 启动 CLI
  - 切换到某个 DeepSeek 模型
  - 发送至少一条消息
  - 收到真实流式回复

## Recommended Architecture

### Runtime Boundary
- `src/config/`：环境变量与本地配置读取
- `src/providers/deepseek/`：DeepSeek client 与请求构造
- `src/runtime/`：提交、流式累积、中断、状态变更
- `src/state/`：UI 模式与会话消息状态
- `src/components/`：working 指示器、时间线与 Composer

### UI State Evolution
- 现有 `idle` / `command_suggesting` / `submitting` / `completed`
- Phase 2 建议扩展为：
  - `working`
  - `streaming`
  - `interrupted`
  - `failed`

### Command Integration
- `/model` 不再只是占位命令，而是绑定到真实模型列表
- Phase 2 仅暴露：
  - `deepseek-chat`
  - `deepseek-reasoner`

## Risks

- Windows 终端下高频流式刷新可能导致视觉抖动，需要在渲染层控制更新颗粒度。
- 如果 provider adapter 与 UI 解耦不够，Phase 3 接时间线事件和错误块时会返工。
- 若把真实密钥写进测试、示例文件或提交历史，会造成安全问题；需要在实现阶段明确防止。

## Validation Architecture

### Automated
- 环境变量缺失 / 存在的配置读取测试
- DeepSeek client 请求构造测试
- working / streaming / interrupted / failed 状态机测试
- App 级流式渲染与 `/model` 选择测试

### Manual
- 本地配置 `DEEPSEEK_API_KEY`
- `npm run dev`
- 使用 `/model` 选择 DeepSeek 模型
- 发送一条消息并确认收到真实流式回复
- `Escape` 中断长请求并观察恢复行为

## Sources

- DeepSeek 官方 API 文档（模型名、OpenAI 兼容方式、流式能力）
- Node.js `AbortController` 官方文档
- 现有项目 Phase 1 上下文与代码结构

---

*Research completed: 2026-03-31*

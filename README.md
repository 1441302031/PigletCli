# PigLet CLI

PigLet CLI 是一个本地终端 REPL，目标是提供接近 Claude Code / Codex 的交互体验：欢迎卡片、命令模式、Working 提示、DeepSeek 模型切换、流式输出，以及可中断的请求链路。

## 本地启动

1. 安装依赖

```powershell
npm install
```

2. 配置 DeepSeek Key，推荐二选一

方式 A：在当前终端会话里直接设置

```powershell
$env:DEEPSEEK_API_KEY="你的 DeepSeek API Key"
```

方式 B：在项目根目录创建本地配置文件

```powershell
Copy-Item .env.example .env.local
```

然后把 `.env.local` 里的占位符改成真实 key。  
如果你希望把 DeepSeek 配置单独隔离，也可以使用 `.env.deepseek.local`。

3. 启动 CLI

```powershell
npm run dev
```

## 配置诊断

- 启动后欢迎区会显示当前配置来源。
- 如果没有读到 `DEEPSEEK_API_KEY`，界面会提示你把 key 放到：
  - 当前终端环境变量
  - `.env.local`
  - `.env.deepseek.local`

## 交互方式

- 直接输入普通问题并回车，CLI 会先进入 `Working` 状态，然后把 DeepSeek 回复流式写到时间线。
- 输入 `/` 可以进入命令模式。
- 输入 `/model deepseek-chat` 可以切回普通对话模型。
- 输入 `/model deepseek-reasoner` 可以切到推理模型。
- 输入 `/exit` 可以正常退出当前 REPL 会话。
- 在模型请求进行中按 `Esc` 可以中断当前请求。

## 终端兼容性

- `Windows Terminal`：当前正式支持环境。
- `VS Code Terminal`：会启用 `fallback input mode`，优先保证可用性；已知仍可能出现抖动或输入法兼容性问题。

## 本地验收

建议按下面顺序验收：

1. 启动后确认欢迎卡片显示产品名、当前模型、目录和配置来源。
2. 输入 `/`，确认命令候选里能看到 `/exit` 和 `/model`。
3. 输入 `/model deepseek-reasoner` 并回车，确认当前模型切换。
4. 输入一条普通消息并回车，确认先出现 `Working` 与等待时间。
5. 等待 DeepSeek 返回，确认消息是逐步进入时间线，而不是整块一次性出现。
6. 在另一条请求中按 `Esc`，确认界面显示已中断提示。
7. 输入 `/exit`，确认 REPL 正常退出。

## Phase 3 补充验收

在 `Windows Terminal` 下，再补看下面 4 点：

1. 普通提问后，时间线里会按顺序出现：
   - 用户输入
   - 请求开始状态
   - 助手流式回复
   - 完成收口提示
2. `/model deepseek-chat` 或 `/model deepseek-reasoner` 执行后，模型切换结果会进入同一条时间线，而不是只改顶部信息。
3. 缺失 `DEEPSEEK_API_KEY` 或请求失败时，界面会显示结构化错误块，至少能看到标题、错误详情和恢复建议。
4. 正常完成、失败或 `Esc` 中断后，输入区都会恢复可编辑，可立即开始下一轮输入。

## 自动化验证

```powershell
npm test -- tests/config/env.test.ts tests/components/app-startup-health.test.tsx tests/providers/deepseek-client.test.ts tests/state/ui-machine.test.ts tests/components/working-indicator.test.tsx tests/components/app-working-streaming.test.tsx tests/components/app-interrupt-errors.test.tsx tests/components/app-command-mode.test.tsx tests/components/app-exit-and-input.test.tsx tests/components/app-vscode-terminal-compat.test.tsx tests/components/composer.test.tsx tests/components/welcome-card.test.tsx tests/runtime/chat-session.test.ts tests/components/timeline.test.tsx tests/components/app-timeline-events.test.tsx tests/components/app-structured-errors.test.tsx tests/components/app-completion-focus.test.tsx
npm run build
```

## 安全说明

- `.env.example` 只保留占位符，不包含任何真实密钥。
- 不要把真实的 `DEEPSEEK_API_KEY` 提交到仓库。
- 如果真实 key 曾经出现在对话、示例文件或截图里，建议尽快轮换。

# Phase 2: 工作中反馈与流式交互闭环 - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

本阶段负责把 Phase 1 的本地 REPL 壳层升级为“可真实交互”的最小 Agent 闭环：提交请求后立即进入 `working` 状态、显示等待时长、接入真实流式响应、支持中断，并以 DeepSeek 作为首个实际模型提供方完成本地问答链路验证。

本阶段的目标不是一次性做完整多 provider 平台，也不是扩展多会话或插件系统，而是先把“本地配置 API Key 后可选择 DeepSeek 模型并完成真实交互”这条主链路打通。
</domain>

<decisions>
## Implementation Decisions

### Provider 范围
- **D-01:** Phase 2 的首个真实模型提供方锁定为 DeepSeek，用它验证 working、streaming、interrupt 和错误反馈整条执行链路。
- **D-02:** 虽然当前只接 DeepSeek，但代码边界要保留 provider adapter 思路，避免把请求协议和 UI 状态写死在 `App` 组件内部。
- **D-03:** 其他模型提供方属于后续扩展，不在本阶段一起接入。

### API Key 与本地配置
- **D-04:** DeepSeek 密钥只通过本地环境变量使用，环境变量名固定为 `DEEPSEEK_API_KEY`。
- **D-05:** 仓库中可以提供示例配置文件或文档说明，但绝不写入真实密钥，不把密钥明文提交到 git。
- **D-06:** 若本地未配置 `DEEPSEEK_API_KEY`，CLI 必须给出清晰的缺失配置提示，而不是直接失败或打印原始堆栈。

### 模型选择
- **D-07:** Phase 2 至少支持 `deepseek-chat` 与 `deepseek-reasoner` 两个 DeepSeek 模型选项。
- **D-08:** 默认模型使用 `deepseek-chat`，因为它更适合作为本地 REPL 的默认交互入口；`deepseek-reasoner` 作为可切换选项暴露给用户。
- **D-09:** 现有 `/model` 命令继续沿用，并扩展为可在 CLI 内选择当前可用模型，而不是额外引入新的模型切换命令。

### 请求生命周期
- **D-10:** 用户提交后，UI 必须立即从输入态切到 `working` / `submitting` 相关状态，不能等待首 token 后才反馈。
- **D-11:** `working` 提示、等待时长和模型实际流式回复必须在同一轮交互里自然衔接，避免“静态 loading”与真实响应脱节。
- **D-12:** Phase 2 优先做真实流式输出，不做伪流式或整块回填。

### 中断与异常
- **D-13:** `Escape` 在执行态下用于中断当前模型请求，而不是直接清空输入。
- **D-14:** 网络失败、认证失败、缺失 API Key、流式中断都要进入结构化错误/状态反馈，而不是裸错误输出。
- **D-15:** 中断后要恢复输入区可继续编辑，确保本地 REPL 不会卡死在不可恢复状态。

### 本地验收
- **D-16:** Phase 2 的验收必须包含“本地配置 `DEEPSEEK_API_KEY` 后，使用 `npm run dev` 启动并成功完成至少一次真实对话”。
- **D-17:** 本阶段要补充本地使用说明，明确用户如何配置密钥、如何启动 CLI、如何切换模型、如何验证 DeepSeek 已接通。

### the agent's Discretion
- `working` 文案的具体措辞与动画节奏
- provider adapter 的目录命名与模块拆分
- 本地环境变量加载方式的具体实现细节
- DeepSeek 流式 chunk 到时间线 item 的拼接策略
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 产品目标与交互规范
- `docs/superpowers/specs/2026-03-30-local-repl-agent-ui-design.md` - 定义 working、命令模式、流式输出与验收目标
- `docs/superpowers/plans/2026-03-30-local-repl-agent-ui.md` - 定义建议阶段划分与终端 REPL 架构走向

### 项目范围与阶段边界
- `.planning/PROJECT.md` - 项目定位、核心价值、当前活动需求
- `.planning/REQUIREMENTS.md` - Phase 2 对应的 `EXEC-*` 与 `TIME-02` 需求
- `.planning/ROADMAP.md` - Phase 2 的目标、成功标准与计划拆分
- `.planning/STATE.md` - 当前阶段位置与会话连续性

### 前一阶段上下文
- `.planning/phases/01-terminal-shell-command-foundation/01-CONTEXT.md` - Phase 1 已锁定的输入区、命令模式与状态机边界
- `.planning/phases/01-terminal-shell-command-foundation/01-VERIFICATION.md` - Phase 1 已验证通过的本地壳层能力

### 当前代码入口与扩展点
- `src/index.tsx` - CLI 启动入口与 boot 信息注入点
- `src/app.tsx` - REPL 主视图、命令模式与后续 working/streaming 集成点
- `src/state/ui-machine.ts` - 现有 UI 状态机，需要扩展 execution / streaming / interrupted / failed
- `src/commands/registry.ts` - `/model` 命令与后续模型选择能力的接入点

### 外部配置约束
- 无额外外部规范文档；DeepSeek 的接入约束以本阶段决策和实现计划为准
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app.tsx` 已经提供欢迎区、时间线占位区和底部 Composer 的总体布局，可直接承载 Phase 2 的 working 与 streaming UI。
- `src/state/ui-machine.ts` 已有 `idle`、`command_suggesting`、`submitting`、`completed` 基础状态，可扩展而不必重写状态切换模式。
- `src/commands/registry.ts` 已保留 `/model` 命令，是模型选择交互的现成入口。

### Established Patterns
- 当前项目已经采用显式状态机思路，而不是多个布尔值拼状态。
- 命令模式已经通过注册表 + 过滤器组织，适合继续挂接模型选择逻辑。
- 应用结构已明确区分 `timelineSection` 与 `composerSection`，有利于将执行态和流式回复整合进时间线。

### Integration Points
- DeepSeek 调用链不应直接写在 `src/app.tsx` 的输入回调中，而应通过独立的 provider / session 层接入。
- 启动阶段的 boot model 当前写死在 `src/index.tsx`，Phase 2 需要把它与真实当前模型配置联通。
- `Composer`、`App` 与 `ui-machine` 的边界已经足够清晰，适合追加 working / streaming / interrupt 事件。
</code_context>

<specifics>
## Specific Ideas

- 用户明确希望“配置 API Key 之后可以选择 DeepSeek 模型并在本地完成大模型交互”，因此本阶段必须优先打通真实 provider，而不是只做 UI 假动作。
- 用户已经直接提供了 DeepSeek 密钥，但该密钥只允许作为本地环境配置使用，不应被写入任何仓库文件、规划文档或提交历史。
- 本阶段完成后，本地验收应能覆盖：设置 `DEEPSEEK_API_KEY`、启动 CLI、切换 DeepSeek 模型、发送一条消息并收到真实流式回复。
</specifics>

<deferred>
## Deferred Ideas

- 多 provider 统一配置界面与 provider 切换器
- 非 DeepSeek 模型接入
- 多会话管理与工作区切换
- 插件式模型提供方扩展
</deferred>

---

*Phase: 02-working-state-streaming-loop*
*Context gathered: 2026-03-31*

# Architecture Research

**Domain:** 本地终端 Agent REPL / CLI 交互界面
**Researched:** 2026-03-30
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
+--------------------------------------------------------------+
|                        终端渲染层（Ink）                      |
|  WelcomeCard | Timeline | WorkingStatus | Composer | Palette |
+-------------------------+------------------------------------+
                          |
                          v
+--------------------------------------------------------------+
|                     UI 状态与会话状态层                       |
|   ui-machine   <->   session-store   <->   command registry  |
+-------------------------+------------------------------------+
                          |
                          v
+--------------------------------------------------------------+
|                     运行时适配与事件层                        |
|   agent-client   ->   stream-parser   ->   task-events       |
+-------------------------+------------------------------------+
                          |
                          v
+--------------------------------------------------------------+
|                    模型/外部服务接入层                        |
|           OpenAI / 其他模型提供方 / 本地执行适配              |
+--------------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| WelcomeCard | 首屏品牌、版本、模型、目录展示 | 纯展示组件 |
| Composer | 输入内容、模式切换、提交 | 受控输入组件 |
| CommandPalette | 命令候选展示与高亮选择 | 基于注册表的过滤结果渲染 |
| WorkingStatus | working 文案、耗时、脉冲状态 | 轻量状态展示组件 |
| Timeline | 会话历史与过程事件承载 | 列表容器 + 子项渲染 |
| agent-client | 发起模型请求、取消请求、派发事件 | 适配外部 SDK |
| stream-parser | 聚合 chunk 为进行中消息 | 纯函数或轻状态模块 |

## Recommended Project Structure

```text
src/
├─ components/        # 终端 UI 组件
│  ├─ WelcomeCard.tsx
│  ├─ Timeline.tsx
│  ├─ TimelineEvent.tsx
│  ├─ Composer.tsx
│  ├─ CommandPalette.tsx
│  ├─ WorkingStatus.tsx
│  └─ StreamingMessage.tsx
├─ state/             # UI 状态机与会话状态
│  ├─ ui-machine.ts
│  └─ session-store.ts
├─ commands/          # 命令注册与过滤
│  ├─ registry.ts
│  ├─ filter.ts
│  └─ types.ts
├─ runtime/           # 模型请求、流式解析、事件桥接
│  ├─ agent-client.ts
│  ├─ stream-parser.ts
│  └─ task-events.ts
├─ theme/             # 颜色、间距、样式 token
│  └─ tokens.ts
├─ app.tsx            # 根应用
└─ index.tsx          # CLI 入口
```

### Structure Rationale

- **components/**：将欢迎卡、输入区、状态区、时间线拆开，避免一个大组件包办一切
- **state/**：显式维护 mode 和 session 数据，便于测试提交、工作中、流式完成等切换
- **runtime/**：把模型调用与 UI 解耦，便于后续更换模型提供方

## Architectural Patterns

### Pattern 1: 显式 UI 状态机

**What:** 将 `idle / command_suggesting / working / streaming / completed / failed` 建模成离散状态  
**When to use:** 任何涉及命令模式、提交、流式输出、中断的交互  
**Trade-offs:** 初期多一些样板代码，但能显著降低边界混乱

### Pattern 2: 单一时间线 + 多种 item 类型

**What:** 用户消息、事件、助手流式消息、错误状态都进入同一时间线  
**When to use:** 想让工具表现得像持续工作的 Agent，而不是零散日志输出  
**Trade-offs:** 需要统一 item schema，但用户认知负担更低

### Pattern 3: 运行时事件桥接

**What:** 外部模型 SDK 产生 chunk、event、complete、error，统一映射为内部事件  
**When to use:** 需要流式输出、中断和过程日志并存  
**Trade-offs:** 多一层抽象，但能减少 UI 对外部 SDK 细节的耦合

## Data Flow

### Request Flow

```text
用户输入
  -> Composer
  -> ui-machine 进入 submitting / working
  -> agent-client 发起请求
  -> task-events / stream-parser 派发事件与 chunk
  -> session-store 更新当前时间线
  -> Timeline / WorkingStatus 重渲染
```

### State Management

```text
命令输入 / 普通输入
  -> 触发 Action
  -> ui-machine 决定当前模式
  -> session-store 更新历史与当前 turn
  -> 组件订阅并重渲染
```

### Key Data Flows

1. **命令模式流：** 输入 `/` -> 过滤命令 -> 键盘选择 -> 插入或执行命令
2. **流式回复流：** 提交 prompt -> working -> 收到 chunk -> 更新进行中消息 -> complete
3. **中断流：** 用户按 `Esc` -> `AbortController` 触发 -> 追加 interrupted 状态项

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 单机单用户 | 单进程 Ink 应用即可 |
| 多模型接入 | 增加 provider adapter 层，统一输出事件 |
| 更复杂命令系统 | 将命令注册表拆分模块并增加参数 schema |

### Scaling Priorities

1. **首先会乱的是状态边界：** 如果没有显式状态机，命令模式、流式输出和中断会互相打架
2. **其次会乱的是时间线模型：** 如果把事件、文本、错误分散打印，历史会不可读

## Anti-Patterns

### Anti-Pattern 1: 一个大组件包办全部逻辑

**What people do:** 把输入、事件、流式输出、working 状态都堆进根组件  
**Why it's wrong:** 很快变成难以测试和维护的渲染黑盒  
**Do this instead:** UI、状态、运行时分层

### Anti-Pattern 2: 以日志打印代替时间线建模

**What people do:** 哪里有结果就 `console.log` 到哪里  
**Why it's wrong:** 无法稳定重绘，也无法区分不同类型内容  
**Do this instead:** 建立统一的 timeline item schema

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| OpenAI 等模型 API | SDK 流式迭代 + 事件映射 | 统一为内部 chunk / complete / error 接口 |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `Composer -> ui-machine` | Action 事件 | 输入变化与提交不直接操作 UI 细节 |
| `agent-client -> session-store` | runtime 事件 | 统一追加时间线和更新进行中消息 |

## Sources

- Ink 官方 README  
  https://github.com/vadimdemedes/ink
- Node.js `readline` 官方文档  
  https://nodejs.org/api/readline.html
- Node.js `AbortController` 官方文档  
  https://nodejs.org/api/globals.html#class-abortcontroller
- OpenAI 流式响应官方文档  
  https://developers.openai.com/api/docs/guides/streaming-responses

---
*Architecture research for: 本地终端 Agent REPL / CLI 交互界面*
*Researched: 2026-03-30*

# Phase 2: 工作中反馈与流式交互闭环 - Discussion Log

> **仅用于审计留痕。** 下游规划、研究与执行请读取 `CONTEXT.md`，不要直接把本文档当作实现输入。

**Date:** 2026-03-31
**Phase:** 2-工作中反馈与流式交互闭环
**Areas discussed:** Provider 范围, API Key 与本地配置, 模型选择, 请求生命周期, 中断与异常, 本地验收

---

## Provider 范围

| Option | Description | Selected |
|--------|-------------|----------|
| DeepSeek 单 provider 起步 | 先打通真实链路，保留后续扩展边界 | ✓ |
| 同时接入多个 provider | 一次覆盖更多模型来源，但明显扩大 Phase 2 范围 | |
| 只做假 provider / mock | UI 可先联调，但无法验证真实流式与错误链路 | |

**User's choice:** `[auto]` 选择“DeepSeek 单 provider 起步”（推荐默认）  
**Notes:** 用户明确指定以 DeepSeek 为例完成首个真实模型接入。

---

## API Key 与本地配置

| Option | Description | Selected |
|--------|-------------|----------|
| 本地环境变量 `DEEPSEEK_API_KEY` | 适合 CLI，安全边界清晰，不把密钥写进仓库 | ✓ |
| 把真实密钥写入项目配置文件 | 使用方便，但安全风险不可接受 | |
| 运行时每次手动粘贴密钥 | 不污染仓库，但体验差且难以本地复用 | |

**User's choice:** `[auto]` 选择“本地环境变量 `DEEPSEEK_API_KEY`”（推荐默认）  
**Notes:** 用户已提供密钥，但不写入项目文件，只作为本地环境配置使用。

---

## 模型选择

| Option | Description | Selected |
|--------|-------------|----------|
| 复用 `/model` 命令切换 `deepseek-chat` / `deepseek-reasoner` | 延续 Phase 1 的命令发现路径，学习成本最低 | ✓ |
| 启动参数固定模型 | 实现简单，但交互里无法动态切换 | |
| 新增独立 `/provider` + `/model` 双层命令 | 更通用，但对单 provider 阶段过重 | |

**User's choice:** `[auto]` 选择“复用 `/model` 命令切换 DeepSeek 模型”（推荐默认）  
**Notes:** 默认模型选择 `deepseek-chat`，`deepseek-reasoner` 作为可切换项保留。

---

## 请求生命周期

| Option | Description | Selected |
|--------|-------------|----------|
| 提交即进入 working，首 token 后无缝切换到流式内容 | 最符合目标产品体验，也能验证真实链路 | ✓ |
| 等首 token 后再显示反馈 | 实现简单，但等待期会显得“卡住” | |
| 只做静态 loading，不接真实流式 | 无法满足本阶段目标 | |

**User's choice:** `[auto]` 选择“提交即进入 working，随后无缝流式输出”（推荐默认）  
**Notes:** 这与路线图 Phase 2 的成功标准保持一致。

---

## 中断与异常

| Option | Description | Selected |
|--------|-------------|----------|
| `Escape` 中断当前请求，错误与缺失配置进入结构化反馈 | 可恢复、符合 REPL 心智模型 | ✓ |
| 出错直接打印原始异常 | 实现快，但用户体验差 | |
| 不支持中断，等请求自然结束 | 不符合现有需求与阶段目标 | |

**User's choice:** `[auto]` 选择“中断 + 结构化异常反馈”（推荐默认）  
**Notes:** `Escape` 在执行态下优先用于取消模型请求。

---

## 本地验收

| Option | Description | Selected |
|--------|-------------|----------|
| 增加本地使用说明并要求真实 DeepSeek 对话通过 | 能直接证明 provider 已接通 | ✓ |
| 只跑单元测试，不做真实 provider 验收 | 无法验证 API Key 与流式链路 | |
| 只做截图验收 | 缺少可重复的本地验证步骤 | |

**User's choice:** `[auto]` 选择“本地说明 + 真实对话验收”（推荐默认）  
**Notes:** 阶段完成时要能指导用户在本地配置密钥并验证一次真实交互。

---

## the agent's Discretion

- `working` 动画的具体文案和节奏
- provider adapter 的目录结构
- 本地环境变量读取细节
- 流式 chunk 的时间线拼接方式

## Deferred Ideas

- 多 provider 支持
- 插件式 provider 扩展
- 多会话工作台

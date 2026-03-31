# PigLet CLI

## 这是什么
PigLet CLI 是一个本地运行的终端式 REPL 工具，目标是提供接近 Claude Code / Codex 的 Agent 交互体验。它面向希望在本地终端里获得“可见过程、可控状态、实时流式输出”的开发者，强调命令模式、工作中反馈和流式交互的一致性。

## 核心价值
无论底层模型或工具如何变化，用户都必须始终清楚地知道系统当前在做什么，并且感受到它在持续工作。

## Requirements

### Validated
- [x] 已交付终端欢迎壳层，能够显示产品名、版本、当前模型和工作目录。
- [x] 已交付固定可见的底部输入区，并为后续时间线和执行态预留稳定布局。
- [x] 已交付显式 UI 状态机与基础会话状态容器，支撑后续 working、streaming 和 interrupt。
- [x] 已交付斜杠命令模式，支持候选列表、过滤、上下选择、回车选择、Tab 补全和 Escape 退出。
- [x] 已建立 Phase 1 的自动化测试基线，覆盖欢迎壳层、Composer、状态机和命令模式入口。

### Active
- [ ] 增加 working 状态、等待时长和高亮循环动画。
- [ ] 接入真实流式输出，让结果逐步渲染到同一时间线。
- [ ] 增加结构化过程事件，例如 `Explored`、`Read`、`Ran`、`Waiting`。
- [ ] 完成中断、异常反馈和执行态恢复焦点。
- [ ] 在 Windows 终端里验证高频刷新、键盘输入和布局稳定性。

## Out of Scope
- 鼠标优先交互，v1 聚焦键盘驱动的终端体验。
- 多会话标签页，先把单会话 REPL 闭环做扎实。
- 富文本 Markdown 渲染器，v1 只做终端安全的文本渲染。
- 插件市场或外部扩展系统，先完成内建命令与核心工作流。
- 完整 shell 模拟器，本项目是 Agent REPL，不是通用终端替代品。

## Context
- 项目起点是基于 Claude Code / Codex 截图反推交互逻辑，而不是在既有产品上渐进重构。
- 当前仓库是绿地项目，适合先建立清晰的状态边界与终端交互骨架。
- 已有设计规格位于 `docs/superpowers/specs/2026-03-30-local-repl-agent-ui-design.md`。
- 推荐技术路线为 `Node.js + TypeScript + Ink`，便于组件化终端渲染、键盘事件处理和流式输出扩展。

## Constraints
- 平台优先级：本地终端优先，Windows Terminal / PowerShell 优先验证。
- 交互方式：键盘优先，所有核心流程必须可以通过键盘完成。
- 兼容性：颜色、状态提示和轻动画需要能在 ANSI 终端中优雅降级。
- 体验目标：不能出现“提交后长时间完全无反馈”的空白等待。
- 架构策略：先做清晰边界和最小闭环，再扩展真实模型执行链路。

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 使用 Node.js + TypeScript + Ink 作为首选技术栈 | 更适合组件化终端 UI、键盘事件处理和后续流式渲染 | Validated in Phase 1 |
| v1 先聚焦单会话 Agent REPL，而不是多会话工作台 | 先把核心交互闭环做完整，减少状态管理复杂度 | Validated in Phase 1 |
| 首屏采用紧凑欢迎卡片，而不是全屏装饰布局 | 更贴近截图里的专业 REPL 启动态，也更利于后续时间线扩展 | Validated in Phase 1 |
| 命令模式采用“命令名 + 一句话说明”的可发现式设计 | 降低隐藏能力的学习成本，强化 slash mode 的探索性 | Validated in Phase 1 |
| 把命令模式、working 状态、流式输出和事件时间线视为同一层核心能力 | 它们共同决定 REPL 是否像一个“正在工作的 Agent” | Active |

## language specifications
- 从现在开始，GSD 生成的所有项目文档一律使用简体中文输出。
- 包括但不限于：`PROJECT.md`、`REQUIREMENTS.md`、`ROADMAP.md`、`CONTEXT.md`、`PLAN.md`、验证报告与阶段摘要。
- 文件名保持 GSD 默认英文命名，不需要改名。
- Markdown 标题、正文、注释、说明、任务列表和验收标准全部使用简体中文。
- 代码、命令、路径、API 字段名和数据库字段名保持原文，不做翻译。
- 如需引用英文术语，采用“中文解释（English）”格式，并在首次出现时注明。

## Evolution
此文档会在阶段切换和里程碑完成时持续演进。

每次阶段切换后：
1. 若有需求被验证，移动到 `Validated` 并注明来自哪个 Phase。
2. 若实施中出现新需求，加入 `Active`。
3. 若出现影响后续工作的关键决策，加入 `Key Decisions`。
4. 若产品定位发生偏移，更新“这是什么”和 `Context`。

每个里程碑完成后：
1. 全量复查所有章节。
2. 重新确认核心价值是否仍然成立。
3. 审核 `Out of Scope` 的边界是否依然合理。
4. 用当前实现状态刷新 `Context`。

---
*Last updated: 2026-03-30 after Phase 1 completion*

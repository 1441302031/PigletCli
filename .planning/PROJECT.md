# PigLet CLI

## 这是什么

PigLet CLI 是一个本地运行的终端式 REPL 工具，目标是提供接近 Claude Code / Codex 的 Agent 交互体验。它面向希望在本地终端里获得“可见过程、可控状态、实时流式输出”的开发者，强调命令模式、工作中反馈和流式交互的整体一致性。

## 核心价值

无论底层模型或工具如何变化，用户都必须始终清楚地知道系统当前在做什么，并感受到它在持续工作。

## Requirements

### Validated

（暂无 —— 先交付验证）

### Active

- [ ] 构建一个本地终端优先的 REPL 壳层，具备清晰的欢迎区、输出区、状态区和底部输入区
- [ ] 提供可搜索、可键盘操作的斜杠命令模式，降低高级能力的发现成本
- [ ] 在模型执行期间展示真实的 working 状态、耗时和可中断反馈
- [ ] 让助手输出和过程事件以流式、连续的方式呈现在同一时间线中
- [ ] 让整体体验在 Windows 优先的本地终端中稳定可用，并保留 ANSI 兼容性

### Out of Scope

- 鼠标优先交互 —— v1 聚焦键盘驱动的终端体验
- 多会话标签页 —— 先把单会话 REPL 体验做扎实
- 富文本 Markdown 渲染器 —— v1 只做终端安全的文本渲染
- 插件市场或外部扩展系统 —— 先完成内建命令与核心工作流
- 完整 shell 模拟器 —— 本项目是 Agent REPL，不是通用终端替代品

## Context

- 项目来源于对 Claude Code 与 Codex 截图交互的逆向整理，而不是在现有代码库上迭代
- 当前仓库是绿地项目，没有既有架构约束，适合先把 UI 状态机与运行时边界设计清楚
- 目标体验重点不在“功能多”，而在“有过程感、不卡死、可发现、可中断、流式输出”
- 已有设计文档位于 `docs/superpowers/specs/2026-03-30-local-repl-agent-ui-design.md`
- 推荐技术路线是 `Node.js + TypeScript + Ink`，因为它适合终端组件化渲染和键盘事件处理

## Constraints

- **平台**: 本地终端优先，Windows 优先 —— 需要尽早验证 PowerShell / Windows Terminal 的交互行为
- **交互**: 键盘优先 —— 所有核心流程都必须可通过键盘完成
- **兼容性**: ANSI 兼容 —— 颜色、状态和动画需要能在常见终端中优雅降级
- **体验**: 首屏可理解、等待时可感知 —— 不能出现提交后长时间“无声等待”
- **架构**: 绿地项目但要避免过度设计 —— 先做清晰边界和最小闭环，再扩展能力

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 使用 Node.js + TypeScript + Ink 作为首选技术栈 | 组件化终端 UI、键盘事件处理、流式渲染整合成本较低 | — Pending |
| v1 聚焦单会话 Agent REPL，而不是多会话工作台 | 先把交互核心闭环打磨完整，减少范围扩散 | — Pending |
| 将命令模式、working 状态、流式输出和事件时间线视为同一级核心能力 | 这些能力共同决定“像不像一个活着的 Agent” | — Pending |

## language specifications:

- 从现在开始，GSD 生成的所有项目文档一律使用简体中文输出
- 包括但不限于：PROJECT.md、REQUIREMENTS.md、ROADMAP.md、CONTEXT.md、PLAN.md、UI-SPEC.md、UI-REVIEW.md、HANDOFF.md、验证报告、阶段说明
- 文件名保持 GSD 默认英文命名，不需要改名
- Markdown 标题、正文、注释、说明、任务列表、验收标准全部用简体中文
- 代码、命令、路径、API 字段名、数据库字段名保持原文，不做翻译
- 如需引用英文术语，采用“中文解释（English）”格式，首次出现时注明
- 后续所有 phase、plan、review、handoff 默认继承这个规则，除非我明确说明改为英文

## Evolution

此文档会在阶段切换和里程碑完成时持续演进。

**每次阶段切换后：**
1. 若有需求被证伪，移入 Out of Scope 并记录原因
2. 若有需求已交付并验证，移入 Validated 并注明阶段
3. 若实施中出现新需求，加入 Active
4. 若出现影响后续工作的关键决策，加入 Key Decisions
5. 若产品定位发生偏移，更新“这是什么”

**每个里程碑完成后：**
1. 全量复查所有章节
2. 重新确认核心价值是否仍然成立
3. 审核 Out of Scope 中的边界是否仍然合理
4. 用当前实现状态刷新 Context

---
*Last updated: 2026-03-30 after initialization*

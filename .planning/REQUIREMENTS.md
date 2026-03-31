# Requirements: PigLet CLI

**Defined:** 2026-03-30  
**Core Value:** 无论底层模型或工具如何变化，用户都必须始终清楚地知道系统当前在做什么，并且感受到它在持续工作。

## v1 Requirements

### Shell
- [x] **SHEL-01**: 用户启动 CLI 后可以看到欢迎卡片，显示产品名、版本、当前模型和当前工作目录
- [x] **SHEL-02**: 用户在整个会话期间始终拥有固定可见的底部输入区
- [x] **SHEL-03**: 用户可以在不破坏输入区的情况下查看滚动的历史输出时间线

### Commands
- [x] **CMD-01**: 用户输入 `/` 后 200ms 内可以看到命令候选列表
- [x] **CMD-02**: 用户可以使用方向键在命令候选之间移动，并用回车选择当前命令
- [x] **CMD-03**: 用户可以用 `Tab` 自动补全当前高亮命令，并用 `Escape` 退出命令模式

### Execution
- [ ] **EXEC-01**: 用户提交请求后 100ms 内可以看到 working 状态
- [ ] **EXEC-02**: 用户在任务执行期间可以看到递增的等待时长
- [ ] **EXEC-03**: 用户在任务执行期间可以看到 working 文案的循环高亮动画
- [ ] **EXEC-04**: 用户可以使用 `Esc` 中断当前长任务，并得到明确的中断结果反馈

### Timeline
- [ ] **TIME-01**: 用户可以在同一时间线中看到自己的输入、过程事件和助手回复
- [ ] **TIME-02**: 助手回复会以流式方式逐步出现，而不是整块一次性打印
- [ ] **TIME-03**: 工具可以显示结构化过程事件，例如 `Explored`、`Read`、`Ran`、`Waiting`

### Reliability
- [ ] **RELY-01**: 当请求失败时，用户可以看到结构化错误块，而不是裸堆栈
- [ ] **RELY-02**: 一轮对话完成或失败后，输入框会恢复可编辑并重新获得焦点
- [ ] **RELY-03**: 长输出或连续流式更新不会导致整屏严重闪烁或历史抖动

## v2 Requirements

### Commands
- [ ] **CMD-04**: 用户可以看到命令参数级别的上下文提示

### Workspace
- [ ] **WORK-01**: 用户可以在单个 CLI 中切换或管理多个会话

### Extensions
- [ ] **EXT-01**: 用户可以安装或启用外部命令 / 插件扩展

## Out of Scope

| Feature | Reason |
|---------|--------|
| 鼠标驱动操作 | v1 聚焦终端键盘体验 |
| 多标签多会话工作台 | 会显著扩大状态管理范围，延后验证核心 REPL 体验 |
| 富文本渲染系统 | 不是当前交互目标的关键路径 |
| 完整 shell 替代能力 | 本项目聚焦 Agent REPL，而不是通用终端模拟 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SHEL-01 | Phase 1 | Validated |
| SHEL-02 | Phase 1 | Validated |
| SHEL-03 | Phase 1 | Validated |
| CMD-01 | Phase 1 | Validated |
| CMD-02 | Phase 1 | Validated |
| CMD-03 | Phase 1 | Validated |
| EXEC-01 | Phase 2 | Pending |
| EXEC-02 | Phase 2 | Pending |
| EXEC-03 | Phase 2 | Pending |
| EXEC-04 | Phase 2 | Pending |
| TIME-01 | Phase 3 | Pending |
| TIME-02 | Phase 2 | Pending |
| TIME-03 | Phase 3 | Pending |
| RELY-01 | Phase 3 | Pending |
| RELY-02 | Phase 3 | Pending |
| RELY-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Validated: 6
- Pending: 10
- Unmapped: 0

---
*Requirements defined: 2026-03-30*  
*Last updated: 2026-03-30 after Phase 1 verification*

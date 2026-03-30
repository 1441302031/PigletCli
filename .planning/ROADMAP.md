# Roadmap: PigLet CLI

## Overview

这条路线图的目标不是先把“功能列表”堆满，而是先把本地 Agent REPL 的核心交互闭环做扎实：先建立清晰的终端壳层与命令入口，再打通 working、流式输出和中断，随后补上过程时间线与错误处理，最后做工程化验证和发布准备。

## Phases

**Phase Numbering:**
- 整数阶段（1, 2, 3）表示正常规划阶段
- 小数阶段（2.1, 2.2）用于插入紧急工作

- [ ] **Phase 1: 终端壳层与命令模式基础** - 建立可见的 REPL 骨架、欢迎区、输入区和斜杠命令模式
- [ ] **Phase 2: 工作中反馈与流式交互闭环** - 打通 working 状态、耗时、动画、流式输出和中断
- [ ] **Phase 3: 过程时间线与可靠性体验** - 加入结构化事件、错误块和完成后的焦点恢复
- [ ] **Phase 4: 工程化验证与发布准备** - 补齐测试、稳定性验证和 CLI 发布入口

## Phase Details

### Phase 1: 终端壳层与命令模式基础
**Goal**: 交付一个可运行的终端会话壳层，让用户可以看到欢迎卡片、固定输入区，并通过 `/` 进入可操作的命令模式  
**Depends on**: Nothing (first phase)  
**Requirements**: [SHEL-01, SHEL-02, SHEL-03, CMD-01, CMD-02, CMD-03]  
**UI hint**: yes  
**Success Criteria** (what must be TRUE):
  1. 用户启动工具后可以看到欢迎卡片，其中包含产品名、模型和目录信息
  2. 用户在历史输出变长后仍然拥有固定可见的底部输入区
  3. 用户输入 `/` 后可以看到带说明文字的命令候选，并可用方向键、回车、Tab、Esc 完成操作
**Plans**: TBD

Plans:
- [ ] 01-01: 搭建 Ink 应用壳层与欢迎区
- [ ] 01-02: 实现底部输入区与基础状态机
- [ ] 01-03: 实现命令注册、过滤与候选面板

### Phase 2: 工作中反馈与流式交互闭环
**Goal**: 交付“像一个活着的 Agent”那样的核心等待体验，让用户在提交后立即看到 working、耗时、动画、流式回复和可中断反馈  
**Depends on**: Phase 1  
**Requirements**: [EXEC-01, EXEC-02, EXEC-03, EXEC-04, TIME-02]  
**UI hint**: yes  
**Success Criteria** (what must be TRUE):
  1. 用户提交请求后 100ms 内看到 working 状态与递增计时
  2. working 文案在任务进行时持续循环高亮，而任务结束后立即停止
  3. 助手回复以流式方式逐步出现，且用户可以用 `Esc` 中断长任务
**Plans**: TBD

Plans:
- [ ] 02-01: 实现请求生命周期与 working 状态
- [ ] 02-02: 实现流式消息模型与渲染
- [ ] 02-03: 打通中断链路与取消控制

### Phase 3: 过程时间线与可靠性体验
**Goal**: 让工具的行为更透明、更可靠，把过程事件、错误状态和完成态体验整合进同一时间线  
**Depends on**: Phase 2  
**Requirements**: [TIME-01, TIME-03, RELY-01, RELY-02]  
**UI hint**: yes  
**Success Criteria** (what must be TRUE):
  1. 用户可以在同一时间线中看到输入、过程事件和助手内容，而不是散乱日志
  2. 请求失败时显示结构化错误块并附带恢复建议
  3. 一轮交互结束后输入区恢复焦点，用户可以立刻继续下一轮
**Plans**: TBD

Plans:
- [ ] 03-01: 设计统一时间线 item 模型
- [ ] 03-02: 实现结构化事件与错误块
- [ ] 03-03: 优化完成态、失败态和焦点恢复

### Phase 4: 工程化验证与发布准备
**Goal**: 把交互原型收束成稳定可验证的 CLI 项目，补齐测试、稳定性检查和发布准备  
**Depends on**: Phase 3  
**Requirements**: [RELY-03]  
**UI hint**: no  
**Success Criteria** (what must be TRUE):
  1. 状态机、命令过滤和流式拼接具备自动化测试覆盖
  2. 长输出和高频更新场景下不会出现严重闪烁或历史抖动
  3. 项目具备可运行的 CLI 入口和清晰的本地验证方式
**Plans**: TBD

Plans:
- [ ] 04-01: 补齐测试与验证脚本
- [ ] 04-02: 完成跨终端稳定性检查
- [ ] 04-03: 整理 CLI 入口与发布前文档

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. 终端壳层与命令模式基础 | 0/TBD | Not started | - |
| 2. 工作中反馈与流式交互闭环 | 0/TBD | Not started | - |
| 3. 过程时间线与可靠性体验 | 0/TBD | Not started | - |
| 4. 工程化验证与发布准备 | 0/TBD | Not started | - |

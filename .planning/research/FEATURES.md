# Feature Research

**Domain:** 本地终端 Agent REPL / CLI 交互界面
**Researched:** 2026-03-30
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 持久底部输入区 | 用户默认期望像聊天式 CLI 一样随时可输入 | LOW | 是整个 REPL 的主入口 |
| 斜杠命令模式与补全 | 同类 Agent CLI 已经形成心智预期 | MEDIUM | 需要命令注册、过滤和键盘导航 |
| Working 状态与耗时显示 | 长请求时用户需要确认程序未卡死 | LOW | 需要立即切换状态和每秒计时 |
| 流式输出 | 用户期望实时看到响应生成过程 | MEDIUM | 需要维护进行中的消息节点 |
| 中断能力 | 长任务必须可打断 | MEDIUM | 要与请求取消信号打通 |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| 过程事件时间线 | 让“读了什么、跑了什么、在等什么”对用户可见 | MEDIUM | 比单纯聊天更像 Agent |
| 与欢迎卡片统一的品牌化首屏 | 第一次打开就建立产品感知与秩序 | LOW | 体验加分，但要避免喧宾夺主 |
| Working 脉冲动画 | 增强“工具真的在工作”的感知 | LOW | 需节制，不能造成闪烁负担 |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| v1 就做多标签多会话 | 看起来更像完整 IDE | 会把核心会话体验复杂化，拖慢启动速度 | 先做好单会话时间线 |
| 过重的终端窗口系统 | 看起来更“专业” | 与会话流体验冲突，增加状态同步成本 | 先采用会话式单列布局 |
| 过度装饰动画 | 容易显得“高级” | 终端环境下容易闪烁、噪音大 | 保留 working 单点动画即可 |

## Feature Dependencies

```text
命令模式
    -> 需要 命令注册表
    -> 需要 键盘输入处理

Working 状态
    -> 需要 请求生命周期状态机

流式输出
    -> 需要 流式客户端适配层
    -> 需要 进行中消息节点

过程事件时间线
    -> 需要 统一事件模型
    -> 增强 流式输出 的“过程感”
```

### Dependency Notes

- **命令模式需要命令注册表：** 否则只能做字符串匹配，无法扩展说明、别名和参数
- **流式输出需要进行中消息节点：** 否则只能不断追加新行，历史会混乱
- **Working 状态依赖请求生命周期：** 提交、开始流式、完成、失败、中断都要可见

## MVP Definition

### Launch With (v1)

- [ ] 欢迎卡片与基础布局 —— 用户一启动就知道模型、目录和当前定位
- [ ] 斜杠命令模式 —— 用户输入 `/` 就能发现可用命令
- [ ] Working 状态、计时器和中断提示 —— 保证等待期可感知
- [ ] 流式助手输出 —— 让回复不是整块出现
- [ ] 过程事件时间线 —— 让工具行为可解释

### Add After Validation (v1.x)

- [ ] 命令参数智能提示 —— 当内建命令增多后再提升参数输入体验
- [ ] 可折叠欢迎区 —— 当历史变长时再优化首屏占用

### Future Consideration (v2+)

- [ ] 多会话标签页 —— 当单会话使用模式稳定后再评估
- [ ] 插件/扩展机制 —— 当命令面和运行时边界稳定后再开放

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| 底部输入区与基本布局 | HIGH | LOW | P1 |
| 斜杠命令模式 | HIGH | MEDIUM | P1 |
| Working 状态与耗时 | HIGH | LOW | P1 |
| 流式输出 | HIGH | MEDIUM | P1 |
| 过程事件时间线 | HIGH | MEDIUM | P1 |
| 品牌化欢迎区 | MEDIUM | LOW | P2 |
| 命令参数增强提示 | MEDIUM | MEDIUM | P2 |
| 多会话标签页 | LOW | HIGH | P3 |

## Competitor Feature Analysis

| Feature | Claude Code / Codex 类产品 | 常规 CLI | Our Approach |
|---------|-----------------------------|----------|--------------|
| 命令发现 | 通常支持 `/` 命令列表与说明 | 往往靠文档记忆 | 在输入上下文内提供命令候选 |
| 等待反馈 | 常见有 Working / thinking 提示 | 常常静默等待 | 显示 working、耗时、可中断提示 |
| 输出节奏 | 多为流式与过程化 | 往往整块打印 | 流式主回复 + 结构化过程事件 |

## Sources

- 你提供的 Claude Code / Codex 截图样本
- Ink 官方 README（键盘与终端组件能力）
- OpenAI 官方流式输出文档
- Node.js 官方 TTY / `readline` / `AbortController` 文档

---
*Feature research for: 本地终端 Agent REPL / CLI 交互界面*
*Researched: 2026-03-30*

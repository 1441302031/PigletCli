# Pitfalls Research

**Domain:** 本地终端 Agent REPL / CLI 交互界面
**Researched:** 2026-03-30
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: 提交后长时间静默

**What goes wrong:**  
用户提交 prompt 后，终端没有任何状态反馈，看起来像卡死或失败。

**Why it happens:**  
开发者先接模型 API，等首个 token 返回后才开始更新 UI。

**How to avoid:**  
提交后立即切到 `working`，同步启动计时器和脉冲状态，直到首个 chunk 或任务结束。

**Warning signs:**  
- 请求发出后 1 秒内界面无变化
- 首 token 前没有任何可见状态

**Phase to address:**  
Phase 2

---

### Pitfall 2: 命令模式只是“字符串约定”，不是可发现能力

**What goes wrong:**  
虽然支持 `/model`、`/new` 之类命令，但用户不记得就等于没有。

**Why it happens:**  
只做字符串解析，没有命令注册表、候选列表和键盘选择。

**How to avoid:**  
建立命令注册表和过滤逻辑，把 `/` 作为明确的交互模式，而不是隐藏彩蛋。

**Warning signs:**  
- 命令依赖 README 才能使用
- 输入 `/` 时没有列表反馈

**Phase to address:**  
Phase 1

---

### Pitfall 3: 流式输出导致整屏闪烁或历史抖动

**What goes wrong:**  
chunk 到达时整块重绘，导致阅读体验差，历史区域跳动。

**Why it happens:**  
没有把“进行中消息”建成单独节点，而是不断向时间线追加碎片。

**How to avoid:**  
维护一个进行中的 assistant item，只更新它的内容，完成后再标记为 finalized。

**Warning signs:**  
- 每个 chunk 都新增一行
- 输出越长闪烁越严重

**Phase to address:**  
Phase 2

---

### Pitfall 4: 中断键存在但不能真正取消请求

**What goes wrong:**  
界面显示 `Esc to interrupt`，但按下后只是改 UI，没有停止底层请求。

**Why it happens:**  
没有把键盘中断与 `AbortController` 或底层 SDK 的取消机制打通。

**How to avoid:**  
从 UI 到 runtime 全链路传递取消信号，并在时间线记录中断结果。

**Warning signs:**  
- 按 `Esc` 后网络请求仍继续
- UI 中断后仍继续刷 token

**Phase to address:**  
Phase 2

---

### Pitfall 5: 过程日志与最终回复割裂

**What goes wrong:**  
工具做了很多事，但用户只看到一堆散乱日志或完全看不到过程。

**Why it happens:**  
没有统一的 timeline item 结构，事件与文本各走各的。

**How to avoid:**  
把用户消息、事件、assistant 流式内容、错误都纳入同一时间线。

**Warning signs:**  
- 过程日志通过 `console.log` 随处打印
- 事件顺序与最终回答时间线对不上

**Phase to address:**  
Phase 3

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| 先不建状态机，直接用多个布尔值拼状态 | 起步快 | 很快出现互斥状态冲突 | 几乎不建议 |
| 先整块输出，不做流式 | 接入简单 | 体验目标直接失真 | 仅限最早期 smoke test |
| 事件直接 `console.log` | 实现快 | 无法统一布局和重绘 | 仅限原型调试 |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| 模型流式 SDK | 直接把 chunk 打到 stdout | 映射到内部事件，再交给 UI 渲染 |
| 键盘输入 | 同时多处监听按键 | 统一在输入/根组件层协调 |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| 每个 chunk 都触发大范围重绘 | 输出长时闪烁、CPU 占用上升 | 把流式消息与静态历史分离 | 中长回复就会明显 |
| 动画与计时器驱动整个根组件重渲染 | 输入卡顿 | 把 working 状态隔离为小组件 | 一有动画就开始出现 |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| 在时间线打印敏感 token / 请求头 | 凭证泄露 | 对运行时日志做脱敏 |
| 命令执行缺少显式权限边界 | 本地误操作风险 | 在命令注册层区分安全与危险动作 |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| 命令列表没有描述 | 用户不知道每个命令干什么 | 列出简短一句话说明 |
| working 只有静态文本 | 用户怀疑界面卡住 | 加耗时和脉冲强调 |
| 欢迎区占满首屏且不收敛 | 长会话时干扰阅读 | 初期突出，后续允许弱化 |

## "Looks Done But Isn't" Checklist

- [ ] **命令模式：** 常缺少键盘高亮与 `Esc` 退出 —— 验证方向键、回车、Tab、Esc
- [ ] **Working 状态：** 常缺少真实耗时 —— 验证计时器会递增且结束即停止
- [ ] **流式输出：** 常缺少进行中节点 —— 验证不会每个 chunk 新增一条消息
- [ ] **中断：** 常缺少底层取消 —— 验证按 `Esc` 后不再继续收到 token

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| 静默等待 | LOW | 先在提交链路最前面插入 working 状态 |
| 状态混乱 | MEDIUM | 回退到显式状态机重整 mode 切换 |
| 流式抖动 | MEDIUM | 合并进行中消息模型，减少整屏重绘 |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 命令模式不可发现 | Phase 1 | 输入 `/` 后 200ms 内出现候选列表 |
| 提交后静默 | Phase 2 | 提交后 100ms 内出现 working |
| 流式抖动 | Phase 2 | 长回复时历史不新增碎片消息 |
| 过程日志割裂 | Phase 3 | 事件与回答处于同一时间线 |

## Sources

- Ink 官方 README
- Node.js 官方 `readline` / `AbortController` 文档
- OpenAI 官方流式响应文档
- 你提供的同类产品截图样例

---
*Pitfalls research for: 本地终端 Agent REPL / CLI 交互界面*
*Researched: 2026-03-30*

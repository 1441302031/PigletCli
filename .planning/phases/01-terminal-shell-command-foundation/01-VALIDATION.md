---
phase: 01
slug: terminal-shell-command-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 01 - Validation Strategy

> Phase 1 的验证契约，确保终端壳层、命令过滤和基础状态机在实现过程中持续可验证。

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm test -- --runInBand` |
| **Full suite command** | `npm test -- --runInBand` |
| **Estimated runtime** | ~15-30 秒 |

---

## Sampling Rate

- **After every task commit:** 运行 `npm test -- --runInBand`
- **After every plan wave:** 运行 `npm test -- --runInBand`
- **Before `$gsd-verify-work`:** 测试必须为绿色
- **Max feedback latency:** 30 秒

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | SHEL-01 | component | `npm test -- --runInBand` | ❌ W0 | ⏳ pending |
| 01-01-02 | 01 | 1 | SHEL-02 | smoke | `npm test -- --runInBand` | ❌ W0 | ⏳ pending |
| 01-02-01 | 02 | 2 | SHEL-03 | state | `npm test -- --runInBand` | ❌ W0 | ⏳ pending |
| 01-02-02 | 02 | 2 | CMD-01 | state | `npm test -- --runInBand` | ❌ W0 | ⏳ pending |
| 01-03-01 | 03 | 3 | CMD-02 | unit/component | `npm test -- --runInBand` | ❌ W0 | ⏳ pending |
| 01-03-02 | 03 | 3 | CMD-03 | unit/component | `npm test -- --runInBand` | ❌ W0 | ⏳ pending |

---

## Wave 0 Requirements

- [ ] `package.json` - 定义 `build`、`dev`、`test` 脚本
- [ ] `vitest.config.ts` - 建立测试框架配置
- [ ] `tests/state/ui-machine.test.ts` - 基础状态机断言
- [ ] `tests/commands/filter.test.ts` - 命令过滤排序断言
- [ ] `tests/components/command-palette.test.tsx` - 命令面板渲染与交互断言

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 欢迎卡片在真实终端中的首屏观感 | SHEL-01 | 终端视觉密度与排版需要人工判断 | 运行 `npm run dev`，确认欢迎卡片信息层级清晰 |
| 底部输入区在长输出下仍固定可见 | SHEL-02 / SHEL-03 | 真实滚动行为难以完全用单元测试覆盖 | 模拟长输出后确认输入区不漂移 |

---

## Validation Sign-Off

- [ ] 所有计划任务都带有自动验证命令或 Wave 0 前置
- [ ] 不连续 3 个任务没有自动验证
- [ ] Wave 0 覆盖所有缺失的测试基础设施
- [ ] 不使用 watch 模式作为验证完成条件
- [ ] 反馈延迟低于 30 秒
- [ ] `nyquist_compliant: true` 在实际补齐后再更新

**Approval:** pending


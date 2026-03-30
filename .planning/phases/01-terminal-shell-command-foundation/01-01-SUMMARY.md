---
phase: 01-terminal-shell-command-foundation
plan: 01
subsystem: ui
tags: [ink, react, typescript, vitest, cli]
requires: []
provides:
  - "CLI 项目脚手架与依赖配置"
  - "欢迎卡片与根应用壳层"
  - "欢迎壳层 smoke 测试"
affects: [composer, commands, state]
tech-stack:
  added: [ink, react, typescript, vitest, ink-testing-library, tsx]
  patterns: ["Ink 组件化终端壳层", "ESM TypeScript CLI 配置"]
key-files:
  created:
    - package.json
    - tsconfig.json
    - vitest.config.ts
    - src/index.tsx
    - src/app.tsx
    - src/components/WelcomeCard.tsx
    - src/theme/tokens.ts
    - tests/components/welcome-card.test.tsx
  modified: []
key-decisions:
  - "欢迎区采用紧凑卡片式结构而不是大面积装饰界面"
  - "先补齐 TypeScript + Vitest 基础设施，再往后接 Composer 和命令模式"
patterns-established:
  - "根应用负责组合欢迎区、时间线占位和底部输入区占位"
  - "终端 UI 组件统一放在 src/components 下"
requirements-completed: [SHEL-01, SHEL-02]
duration: 25min
completed: 2026-03-30
---

# Phase 01: 终端壳层与命令模式基础 Summary

**Ink 驱动的 CLI 欢迎壳层已经落地，包含产品元信息卡片、基础布局和 smoke 测试入口。**

## Performance

- **Duration:** 25 min
- **Started:** 2026-03-30T16:31:00+08:00
- **Completed:** 2026-03-30T16:40:00+08:00
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments
- 初始化了 `Node.js + TypeScript + Ink` 的 CLI 项目脚手架
- 建立了欢迎卡片、根应用壳层和基础主题 token
- 增加了欢迎壳层 smoke 测试，并验证测试与构建都可通过

## Task Commits

Each task was committed atomically:

1. **Task 1: 初始化 CLI 项目脚手架与测试基础** - `a98ab03` (chore)
2. **Task 2: 实现根应用壳层与欢迎卡片** - `4dd7344` (feat)
3. **Task 3: 为欢迎壳层补充最小 smoke 测试** - `b15ea27` (test)

## Files Created/Modified

- `package.json` - CLI 脚手架依赖和脚本定义
- `tsconfig.json` - TypeScript ESM 编译配置
- `vitest.config.ts` - Vitest 测试配置
- `src/index.tsx` - Ink CLI 启动入口
- `src/app.tsx` - 根应用壳层
- `src/components/WelcomeCard.tsx` - 欢迎卡片
- `src/theme/tokens.ts` - 终端主题 token
- `tests/components/welcome-card.test.tsx` - 欢迎壳层 smoke 测试

## Decisions Made

- Welcome 卡片先走紧凑信息架构，不在本计划里扩展成复杂首屏场景图
- 根应用先保留时间线和输入区占位，优先确保后续结构稳定

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] 补充 `.gitignore` 避免工作树脏状态**
- **Found during:** Task 1（脚手架初始化）
- **Issue:** 安装依赖和构建后 `node_modules/` 与 `dist/` 会成为未跟踪内容，影响后续原子提交
- **Fix:** 新增 `.gitignore`，忽略 `node_modules/` 与 `dist/`
- **Files modified:** `.gitignore`
- **Verification:** `git status --short` 不再把这些目录作为待提交内容
- **Committed in:** `a98ab03`

**2. [Rule 3 - Blocking] 修正 Vitest globals 配置与 ESM 导入扩展**
- **Found during:** Task 3（smoke 测试验证）
- **Issue:** 测试先因 `describe is not defined` 失败，后因 ESM 相对导入缺少 `.js` 扩展导致 `tsc` 失败
- **Fix:** 在 `vitest.config.ts` 打开 `globals: true`，并把测试中的 `../../src/app` 改为 `../../src/app.js`
- **Files modified:** `vitest.config.ts`, `tests/components/welcome-card.test.tsx`
- **Verification:** `npm test -- tests/components/welcome-card.test.tsx` 和 `npm run build` 均通过
- **Committed in:** `b15ea27`

---

**Total deviations:** 2 auto-fixed
**Impact on plan:** 都是保证脚手架能稳定测试和提交的必要修正，没有扩大范围。

## Issues Encountered

- Vitest 默认未启用 globals，导致测试环境先失败而不是验证业务行为
- NodeNext 编译要求测试中的相对导入带 `.js` 扩展

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 欢迎壳层已具备可扩展容器，适合进入 Composer 与状态机实现
- 后续可以在不重写首屏结构的前提下接入底部输入区和命令模式

---
*Phase: 01-terminal-shell-command-foundation*
*Completed: 2026-03-30*

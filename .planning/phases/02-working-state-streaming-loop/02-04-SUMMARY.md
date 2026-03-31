---
phase: 02-working-state-streaming-loop
plan: 04
status: completed
completed_at: 2026-03-31T16:10:00+08:00
---

# 02-04 Summary

## 完成内容

- 新增 `/exit` 命令，并在 `App` 中增加可注入的 `onExit` 退出链路
- 将 `Composer` 从手写伪输入框改为基于 `ink-text-input` 的受控输入组件
- 将普通字符输入、回车提交和编辑行为从 `App` 的全局 `useInput` 中移除，只保留 `Esc` 中断和命令候选导航
- 更新 README，本地验收步骤新增 `/exit` 与 Windows / VS Code Terminal 中文输入法复测

## 关键文件

- `src/app.tsx`
- `src/components/Composer.tsx`
- `src/commands/registry.ts`
- `src/index.tsx`
- `tests/components/app-exit-and-input.test.tsx`
- `tests/components/composer.test.tsx`
- `README.md`

## 验证

- `npm test -- tests/components/composer.test.tsx tests/components/app-exit-and-input.test.tsx`
- 待执行更完整回归：
  - `npm test -- tests/components/app-working-streaming.test.tsx tests/components/app-interrupt-errors.test.tsx tests/components/app-command-mode.test.tsx tests/components/composer.test.tsx tests/components/app-exit-and-input.test.tsx`
  - `npm run build`

## 仍需人工复测

- 在真实 DeepSeek 请求中验证 `Esc` 中断
- 在 Windows Terminal / VS Code Terminal 中验证中文输入法候选框跟随输入框显示

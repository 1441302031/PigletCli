---
phase: 02-working-state-streaming-loop
plan: 05
status: completed
completed_at: 2026-03-31T16:55:00+08:00
---

# 02-05 Summary

## 完成内容

- 新增 `src/config/terminal-profile.ts`，识别 `VS Code Terminal`
- 为 `VS Code Terminal` 增加兼容模式，并在欢迎区显示兼容模式提示
- 将兼容模式下的输入区降级为更稳定的单行 prompt 布局
- 将兼容模式下的命令候选区域移动到输入区上方，降低输入锚点抖动
- 更新 README 与 UAT，补充 VS Code Terminal 专项复测说明

## 关键文件

- `src/config/terminal-profile.ts`
- `src/app.tsx`
- `src/components/Composer.tsx`
- `src/components/WelcomeCard.tsx`
- `src/index.tsx`
- `tests/components/app-vscode-terminal-compat.test.tsx`
- `README.md`

## 验证

- `npm test -- tests/components/composer.test.tsx tests/components/app-vscode-terminal-compat.test.tsx`
- 待执行更完整回归：
  - `npm test -- tests/components/app-command-mode.test.tsx tests/components/app-working-streaming.test.tsx tests/components/app-interrupt-errors.test.tsx tests/components/app-exit-and-input.test.tsx`
  - `npm run build`

## 仍需人工复测

- 在 VS Code Terminal 中复测中文输入法候选框与文本位置
- 在 VS Code Terminal 中确认 `/exit`、命令模式和 `Esc` 中断仍正常

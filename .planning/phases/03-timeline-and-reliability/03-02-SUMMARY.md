# 03-02 执行摘要

## 完成内容

- 在 `src/app.tsx` 中把请求开始、失败、中断、完成统一映射为时间线事件。
- 在 `src/state/session-store.ts` 中新增结构化错误块构造逻辑，覆盖缺失配置和 DeepSeek 请求失败场景。
- 在 `src/components/Timeline.tsx` 中加入错误块渲染，输出标题、详情和恢复建议。

## 验证

- `npm test -- tests/components/app-structured-errors.test.tsx tests/components/app-interrupt-errors.test.tsx`

## 结果

失败路径不再只依赖裸字符串，时间线现在可以稳定表达错误和中断。

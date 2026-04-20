# Skill 使用说明

## Skill 名称

```txt
design-handoff-next-shadcn
```

## 推荐提示词

```txt
请使用 design-handoff-next-shadcn。
先读取 ./handoff/handoff.json。
若存在 ./handoff/.handoff/build/handoff.bundle.json，优先使用它；否则先构建 bundle。
然后按 tokens、component-map 和 api-contract 生成 Next.js + shadcn/ui 页面。
不要发明未映射组件。必须覆盖 loading / empty / error / no-permission。
```

## 适合任务

- 把产品线框转成 DHP 页面协议。
- 把 DHP 协议转成 Next.js 页面。
- 检查现有页面是否符合 component-map。
- 检查是否硬编码了视觉值。
- 生成 Hono 或 FastAPI API 契约实现。

## 不适合任务

- 没有协议、只有一句“做个后台页面”的自由 UI 生成。
- 纯文案润色。
- 与设计交接无关的普通后端任务。

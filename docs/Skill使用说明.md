# Skill 使用说明

## Skill 名称

```txt
design-handoff-next-shadcn
```

## 推荐提示词

```txt
请使用 design-handoff-next-shadcn。
先判断当前是在产品边界、页面设计、交互规则还是实现细节层。
如果协议不足，先补产品边界、对象模型、页面职责、状态机、V1/V2 和验收标准。
默认产出 ASCII 线框、Mermaid 图、dhp-layout / dhp-state-matrix / dhp-binding / dhp-interaction。
若存在 ./handoff/.handoff/build/handoff.bundle.json，优先使用它；否则先构建 bundle。
然后按 tokens、component-map 和 api-contract 实现 Next.js + shadcn/ui 前端与 Hono/FastAPI 后端。
不要发明未映射组件，不要把失败态伪装成空态。
```

## 适合任务

- 从一句产品需求开始，补齐产品边界、对象模型和交互规则，再进入研发。
- 把产品线框转成 DHP 页面协议。
- 把 DHP 协议转成 Next.js 页面和 Hono/FastAPI 后端。
- 检查现有页面是否符合 component-map。
- 检查是否硬编码了视觉值。
- 检查是否缺少状态矩阵、API 契约、V1/V2 或验收标准。

## 不适合任务

- 纯竞品/市场分析。
- 纯文案润色。
- 与产品设计交接无关的普通后端任务。

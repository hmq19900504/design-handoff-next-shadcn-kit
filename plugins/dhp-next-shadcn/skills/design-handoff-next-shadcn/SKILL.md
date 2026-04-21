---
name: design-handoff-next-shadcn
description: Use this skill when the user wants to convert product prototypes, wireframes, UI design notes, Markdown specs, or Figma-derived handoff material into production-oriented TypeScript + React + Next.js + Tailwind + shadcn/ui code, optionally backed by Hono/Node.js or FastAPI APIs. Use it for Chinese design handoff protocol work, UI agent coding constraints, component mapping, state matrix implementation, and design-to-code validation. Do not use it for unrelated prose writing or generic frontend advice.
---

# design-handoff-next-shadcn

> 当前版本：v0.2.0
> 版本真源：仓库根目录 `package.json`，并要求与 `plugins/dhp-next-shadcn/.codex-plugin/plugin.json` 保持一致。

你是一个设计交接协议执行器，不是“看图猜界面”的自由发挥型前端生成器。

你的任务是把 **DHP：Design Handoff Protocol** 转换为生产可维护的代码：

```txt
Markdown 线框 / 产品说明 / UI 说明
+ dhp-* JSON 协议块
+ design-tokens.json
+ component-map.shadcn.json
+ api-contract.json
=> TypeScript + React + Next.js + Tailwind + shadcn/ui
=> 可选 Hono / FastAPI 后端
```

## 触发条件

当用户出现以下意图时，必须使用本 skill：

- “把原型/设计稿/线框图转成研发稿/代码”
- “给 agent 一个能理解设计的协议/语言”
- “用 markdown + 协议 + 组件映射生成前端”
- “shadcn/ui、Next.js、Tailwind、React 的设计交接规范”
- “根据 handoff.json / tokens / component-map 生成页面”
- “检查生成代码是否符合设计协议”

## 必须读取的文件优先级

从项目根目录开始：

1. `handoff/.handoff/build/handoff.bundle.json`，如果存在，优先使用。
2. `handoff/handoff.json`，协议总入口。
3. `handoff/tokens/design-tokens.json`，视觉真值。
4. `handoff/mapping/component-map.shadcn.json`，组件映射与禁用规则。
5. `handoff/api/api-contract.json`，前后端数据契约。
6. `handoff/pages/*.md`，页面协议。
7. `handoff/components/*.md`，组件契约。
8. `handoff/flows/*.md`，交互流程。
9. `AGENTS.md`，仓库级 agent 规则。

如果 bundle 不存在，先建议或执行：

```bash
npm run dhp:validate
npm run dhp:build
npm run dhp:sync
```

## DHP 协议块

Markdown 中可以有人类说明和 Mermaid 线框，但 agent 不能只依赖自然语言。必须解析并遵守这些代码块：

- `dhp-layout`：页面布局树、区域、栅格、容器和响应式规则。
- `dhp-component`：组件职责、props、events、states、variants。
- `dhp-binding`：数据字段到 UI 区块的绑定。
- `dhp-interaction`：交互触发、前置条件、后置结果、失败状态。
- `dhp-state-matrix`：loading / empty / error / no-permission / success 的表现。
- `dhp-copy`：文案。
- `dhp-a11y`：可访问性要求。

## 生成代码硬约束

1. **禁止臆造组件**：只能使用 `component-map.shadcn.json` 中声明的组件、组合或已存在项目组件。
2. **禁止硬编码视觉值**：颜色、字号、间距、圆角、阴影必须来自 tokens 或 shadcn/Tailwind 语义变量。
3. **必须覆盖状态**：每个页面必须实现 `loading`、`empty`、`error`、`no-permission`。
4. **必须保留类型**：所有数据结构写 TypeScript 类型，优先来自 `api-contract.json`。
5. **必须拆分组件**：页面容器、筛选区、指标卡、表格、详情抽屉、空态/错误态必须拆分。
6. **不能只做静态页面**：至少要体现数据绑定、交互状态和 API 契约。
7. **缺失信息要显式假设**：写入代码注释或 `handoff/assumptions.md`，不能默默补。
8. **中文业务文案优先保留中文**。

## 推荐 Next.js 代码结构

```txt
apps/web/
  app/
    page.tsx
    globals.css
  components/
    ui/                         # shadcn/ui 风格基础组件
    handoff/                    # DHP 生成/适配组件
  lib/
    utils.ts
    dhp.ts
  src/generated/
    handoff.bundle.json
    dhp-tokens.css
```

## 推荐后端结构

Hono：

```txt
apps/api-hono/src/
  index.ts
  data.ts
  schema.ts
```

FastAPI：

```txt
apps/api-fastapi/app/
  main.py
```

## 修改流程

执行设计到代码任务时按顺序做：

1. 读取协议总入口与 bundle。
2. 检查 tokens、component-map、api-contract 是否齐全。
3. 从页面 markdown 提取 `dhp-layout` 和状态矩阵。
4. 从组件 markdown 提取 props/events/states。
5. 生成或修改 Next.js 页面。
6. 生成或修改 Hono/FastAPI API。
7. 同步 mock 数据与接口字段。
8. 运行校验脚本。
9. 输出完成项、假设项、未完成项。

## 输出风格

- 先给结论和文件变更摘要。
- 再给运行命令。
- 如果发现协议缺口，列出“需要补充的 DHP 字段”。
- 不要长篇解释基础概念。

## 验证命令

最小验证：

```bash
npm run verify:offline
```

完整验证：

```bash
npm install
npm run typecheck
npm run web:build
npm run api:hono:build
```

## 参考文件

需要更多规则时读取：

- `references/protocol.md`
- `references/component-mapping.md`
- `references/codegen-checklist.md`

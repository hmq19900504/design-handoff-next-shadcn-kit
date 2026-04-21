---
name: design-handoff-next-shadcn
description: Use this skill when the user wants one integrated Chinese workflow from product definition and interaction design through DHP protocol handoff to production-oriented TypeScript + React + Next.js + Tailwind + shadcn/ui frontend plus Hono/Node.js or FastAPI backend delivery. Use it for product boundary definition, object modeling, page/interaction specs, Markdown wireframes, design handoff protocol work, component mapping, API contract alignment, and full-stack design-to-code validation. Do not use it for unrelated prose polishing or isolated backend tasks with no product/design context.
---

# design-handoff-next-shadcn

> 当前版本：v0.2.0
> 版本真源：仓库根目录 `package.json`；如启用 Codex plugin，再要求与 `plugins/dhp-next-shadcn/.codex-plugin/plugin.json` 保持一致。

你不是单纯的“协议到代码执行器”，而是一套从 `产品 -> 设计 -> 交互 -> 前端 -> 后端` 的一体化研发总控 skill。

你的任务不是直接“看图猜页面”，而是先把上游设计决策定干净，再把 **DHP：Design Handoff Protocol** 转换为生产可维护的代码：

```txt
产品边界 / 对象模型
=> 页面职责 / 信息架构 / 交互状态
=> ASCII 线框 / Mermaid / dhp-* JSON 协议块
=> design-tokens.json / component-map.shadcn.json / api-contract.json
=> TypeScript + React + Next.js + Tailwind + shadcn/ui 前端
=> Hono / FastAPI 后端
```

## 触发条件

当用户出现以下意图时，必须使用本 skill：

- “从产品到前后端一体做完”
- “先做产品方案，再落设计和代码”
- “补齐对象模型、交互规则、状态机，再实现页面”
- “把原型/设计稿/线框图转成研发稿/代码”
- “给 agent 一个能理解设计的协议/语言”
- “用 markdown + 协议 + 组件映射生成前端”
- “shadcn/ui、Next.js、Tailwind、React 的设计交接规范”
- “根据 handoff.json / tokens / component-map 生成页面和后端”
- “检查生成代码是否符合设计协议与产品边界”

## 先判断当前层级

先用一句话明确当前讨论的是哪一层：

- `产品边界`
- `页面设计`
- `交互规则`
- `实现细节`

不要把多个层级混在一段里混讲。

## 必须读取的文件优先级

从项目根目录开始：

1. `AGENTS.md`，仓库级规则真源。
2. `references/e2e-delivery-loop.md`，当前任务涉及产品、页面、交互或协议不完整时必须读取。
3. `handoff/.handoff/build/handoff.bundle.json`，如果存在，优先使用。
4. `handoff/handoff.json`，协议总入口。
5. `handoff/tokens/design-tokens.json`，视觉真值。
6. `handoff/mapping/component-map.shadcn.json`，组件映射与禁用规则。
7. `handoff/api/api-contract.json`，前后端数据契约。
8. `handoff/pages/*.md`，页面协议。
9. `handoff/components/*.md`，组件契约。
10. `handoff/flows/*.md`，交互流程。

如果是从 0 到 1 新功能、上游规格明显缺失，优先更新已有 `docs/project/` 或 `docs/plans/` 文档，再进入 DHP 协议与代码阶段。

如果 bundle 不存在，先建议或执行：

```bash
npm run dhp:validate
npm run dhp:build
npm run dhp:sync
```

## 前置补齐规则

如果用户给的是一句产品需求、页面想法、半成品线框、零散 Markdown 或不完整协议，先补齐前置研发材料，再进入代码：

1. 文档目标
2. 不讨论什么 / 不属于本模块的内容
3. 模块边界 / 一等对象 / 禁止混用的概念
4. 页面职责 / 主入口 / 主动作
5. 信息架构 / 布局分区 / 只读与可编辑边界
6. 交互流程 / 状态机 / 正常态反馈 / 异常态
7. 数据结构 / API 影响
8. V1 / V2 范围切分
9. 测试重点 / 验收标准

默认前置交付物：

- ASCII 页面线框
- Mermaid 结构图、流程图或状态机
- `dhp-layout`
- `dhp-state-matrix`
- `dhp-binding`
- `dhp-interaction`
- API contract 或字段草案
- 验收清单

## DHP 协议块

Markdown 中可以有人类说明和 Mermaid 线框，但 agent 不能只依赖自然语言。必须解析并遵守这些代码块：

- `dhp-layout`：页面布局树、区域、栅格、容器和响应式规则。
- `dhp-component`：组件职责、props、events、states、variants。
- `dhp-binding`：数据字段到 UI 区块的绑定。
- `dhp-interaction`：交互触发、前置条件、后置结果、失败状态。
- `dhp-state-matrix`：loading / empty / error / no-permission / success 的表现。
- `dhp-copy`：文案。
- `dhp-a11y`：可访问性要求。

## 一体化研发硬约束

1. **禁止臆造组件**：只能使用 `component-map.shadcn.json` 中声明的组件、组合或已存在项目组件。
2. **禁止硬编码视觉值**：颜色、字号、间距、圆角、阴影必须来自 tokens 或 shadcn/Tailwind 语义变量。
3. **禁止用 UI 命名反推产品概念**：先定产品边界和对象模型，再写页面和代码。
4. **禁止混层**：不要把 `状态 / 操作 / 监控 / 配置` 混成一个概念。
5. **一页只承担一个主目标**：不要让同一页同时承担定义、发布、运行和消费层配置。
6. **必须写清楚不属于本模块的内容**：不允许只写“要做什么”，不写“不做什么”。
7. **必须覆盖状态**：每个页面至少实现 `loading`、`empty`、`error`、`no-permission`、`success`。
8. **必须保留类型**：所有数据结构写 TypeScript 类型，优先来自 `api-contract.json`。
9. **必须拆分组件**：页面容器、筛选区、指标卡、表格、详情抽屉、空态/错误态必须拆分。
10. **不能只做静态页面**：至少要体现数据绑定、交互状态和 API 契约。
11. **缺失信息要显式假设或先补规格**：写入代码注释或 `handoff/assumptions.md`，不能 silent fallback。
12. **中文业务文案优先保留中文**。

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

## 全链路工作流

执行产品到代码任务时按顺序做：

1. 判断当前层级，并点明这是 `产品边界 / 页面设计 / 交互规则 / 实现细节` 哪一层。
2. 读取已有文档、协议与 bundle，确认是否已有稳定真相源。
3. 如果上游规格不足，先补齐产品边界、对象模型、页面职责、交互状态、V1 / V2、验收标准。
4. 输出或更新 ASCII 线框、Mermaid 图和最小 DHP 协议块。
5. 检查 tokens、component-map、api-contract 是否齐全；缺失则先补协议或显式报缺口。
6. 从页面 markdown 提取 `dhp-layout`、`dhp-state-matrix`、`dhp-binding`、`dhp-interaction`。
7. 生成或修改 Next.js 前端页面与组件。
8. 生成或修改 Hono/FastAPI 后端、schema、mock 数据与接口字段。
9. 运行校验脚本与构建验证。
10. 输出完成项、假设项、未完成项与需要补充的字段。

## 输出风格

- 先给结论和文件变更摘要。
- 再给“前置规格补齐了什么 / 协议补齐了什么 / 前后端改了什么”。
- 再给运行命令和验证结果。
- 如果发现协议缺口，列出“需要补充的 DHP 字段”。
- 如果发现产品边界缺口，列出“需要补充的产品 / 对象 / 状态定义”。
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

- `references/e2e-delivery-loop.md`
- `references/protocol.md`
- `references/component-mapping.md`
- `references/codegen-checklist.md`

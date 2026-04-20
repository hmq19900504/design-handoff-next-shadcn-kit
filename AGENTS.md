# AGENTS.md

## 项目目标

本仓库是一个设计交接协议与 AI Coding Agent 落地模板。任何 Agent 修改代码前必须先理解 `handoff/handoff.json` 和 `.handoff/build/handoff.bundle.json`。

## Agent 工作规则

1. 优先读取 `handoff/.handoff/build/handoff.bundle.json`；如果不存在，先执行：
   ```bash
   npm run dhp:validate && npm run dhp:build && npm run dhp:sync
   ```
2. 生成 UI 时只能使用 `handoff/mapping/component-map.shadcn.json` 中允许的组件与组合。
3. 不允许硬编码颜色、字号、圆角、阴影；必须使用 token 或 shadcn/Tailwind 语义变量。
4. 每个页面必须覆盖 loading、empty、error、no-permission 四类状态。
5. 后端字段必须来自 `handoff/api/api-contract.json` 或显式声明假设。
6. 不要因为截图、线框、Figma 信息缺失而自由发挥；缺失的内容写入 `handoff/assumptions.md`。
7. 修改完成后至少运行：
   ```bash
   npm run verify:offline
   ```
   如果依赖已安装，再运行：
   ```bash
   npm run typecheck
   npm run web:build
   ```

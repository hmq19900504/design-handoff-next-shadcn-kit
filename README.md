# Design Handoff Next Shadcn Kit

一套面向 **AI Coding Agent / Codex** 的设计交接协议与落地工程模板。

目标不是让 Agent “看图猜 UI”，而是把产品原型、线框图、UI 说明、组件映射、设计 token、接口契约和验收规则整理成一份可校验、可构建、可被 Agent 稳定消费的 **DHP：Design Handoff Protocol**。

## 技术栈

- Frontend：TypeScript + React + Next.js App Router + Tailwind CSS + shadcn/ui 风格组件
- Backend A：Hono + Node.js + TypeScript
- Backend B：FastAPI + Python，可选
- Agent：可安装通用 Skill，兼容 Codex / Claude；Codex Plugin 仅为可选增强
- Protocol：Markdown + Mermaid + `dhp-*` JSON 协议块 + Design Tokens + Component Map + API Contract

## 这个项目解决什么问题

传统产品/设计/研发之间有原型、UI 稿、标注、切图和口头沟通；Agent 没有稳定理解这些材料的能力。这个项目在“设计稿”和“生产代码”之间加一层中间语言：

```txt
原型 / UI / 线框图
  ↓
DHP 协议包：Markdown 线框 + 结构化协议块 + tokens + component-map + api-contract
  ↓
Codex skill/plugin 读取协议并按约束生成代码
  ↓
Next.js/shadcn 前端 + Hono/FastAPI 后端
```

## 快速开始

### 1. 校验并构建协议 bundle

```bash
npm run verify:offline
```

这条命令只依赖 Node.js 标准库，会检查协议、构建 `.handoff/build/handoff.bundle.json`，并同步到 Next.js 应用的 `src/generated/` 目录。

### 2. 安装依赖并运行 Next.js

```bash
npm install
npm run dhp:build
npm run dhp:sync
npm run web:dev
```

访问：

```txt
http://localhost:3000
```

### 3. 运行 Hono API

```bash
npm run api:hono:dev
```

访问：

```txt
http://localhost:8787/health
http://localhost:8787/api/handoff
http://localhost:8787/api/risk-items
```

### 4. 运行 FastAPI，可选

```bash
cd apps/api-fastapi
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

访问：

```txt
http://localhost:8000/docs
http://localhost:8000/api/handoff
```

## 默认安装：通用 Skill（Codex / Claude 共用）

如果你要的是两边都能用的统一入口，不要先走 plugin。先安装通用 skill：

```bash
npm run version:show
npm run skill:pack
npm run tool:install
```

这条主路径会做两件事：

- 打包独立 skill 到 `dist/skills/design-handoff-next-shadcn`
- 把同一个 skill 安装到
  `~/.codex/skills/design-handoff-next-shadcn`
  、`~/.claude/skills/design-handoff-next-shadcn`
  和 `~/.agents/skills/design-handoff-next-shadcn`

这样 `Codex` 和 `Claude` 新会话都会读取同一份 installable skill。

如果你只想处理 skill，不想碰任何 `Codex plugin/marketplace`，到这里就够了。

## 可选增强：Codex Plugin 安装

本仓库已经带了本地 marketplace：

```txt
.agents/plugins/marketplace.json
plugins/dhp-next-shadcn/.codex-plugin/plugin.json
plugins/dhp-next-shadcn/skills/design-handoff-next-shadcn/SKILL.md
```

安装方式：

```bash
cd design-handoff-next-shadcn-kit
codex
/plugins
```

在插件列表里选择 **DHP Next Shadcn** 安装。

注意：这一节只对 `Codex` 生效，`Claude` 不支持 `.codex-plugin/plugin.json` 和 marketplace。

安装后可以在 Codex 里直接说：

```txt
请使用 design-handoff-next-shadcn。
先补齐产品边界、对象模型、页面职责和交互状态。
默认输出 ASCII、Mermaid 和 DHP 协议块，再实现 Next.js/shadcn 前端与 Hono/FastAPI 后端。
不要发明未映射组件，不要把失败态伪装成空态。
```

## 让仓库更新自动同步到 Codex / Claude

如果你希望后续持续更新这个仓库时，`Codex` 和 `Claude` 都自动引用最新版本，推荐直接使用**统一安装入口**：

```bash
npm run version:show
npm run skill:pack
npm run tool:install
```

这条命令默认只做通用 skill 安装：

- 打包独立 skill 到 `dist/skills/design-handoff-next-shadcn`
- 把 `Codex` skill 链接到 `~/.codex/skills/design-handoff-next-shadcn`
- 把 `Claude Code` skill 链接到 `~/.claude/skills/design-handoff-next-shadcn`
- 把共享 `AGENTS` skill 镜像链接到 `~/.agents/skills/design-handoff-next-shadcn`

这样后续你只要继续更新当前仓库，新的 `Codex` / `Claude` 会话就会直接读取仓库最新版，不需要重复拷贝。

如果你还想给 `Codex` 额外挂上 plugin/marketplace，再单独运行：

```bash
npm run tool:install:codex
```

注意：

- 已经打开的旧会话不保证热刷新；建议新开会话验证最新版本。
- 当前版本标识可随时通过 `npm run version:show` 查看。
- 如果要升级版本号，直接运行 `npm run version:sync -- 0.2.1`；它会同步 `package.json`、`plugin.json` 和 `SKILL.md` 的版本标识。
- 当前统一接入状态可通过 `npm run tool:status` 查看。
- 当前仓库内的 `AGENTS.md` 和 `CLAUDE.md` 本来就是直连仓库文件，因此在这个 repo 里 `Claude` 一直都是最新版本。
- 如果你只想显式安装 skill，也可以使用 `npm run skill:install`。

## 目录结构

```txt
.
├── handoff/                       # DHP 示例协议包
│   ├── handoff.json               # 总入口
│   ├── pages/                     # 页面协议 Markdown
│   ├── components/                # 组件契约
│   ├── flows/                     # 交互流程
│   ├── tokens/                    # 设计 token
│   ├── mapping/                   # shadcn/ui 组件映射
│   ├── api/                       # API 契约
│   └── acceptance/                # 验收清单
├── apps/web/                      # Next.js + Tailwind + shadcn/ui 风格前端
├── apps/api-hono/                 # Hono + Node.js API
├── apps/api-fastapi/              # FastAPI API，可选
├── packages/dhp-kit/              # TypeScript SDK/类型定义
├── scripts/                       # 协议校验、构建、同步、发布脚本
├── plugins/dhp-next-shadcn/       # Codex plugin + skill
├── .agents/plugins/marketplace.json
└── docs/                          # 中文安装、适配、发布说明
```

## 推荐工作流

1. 先定义产品边界、对象模型、页面职责、交互状态和 V1 / V2。
2. 用 Markdown 产出 ASCII 原型、Mermaid 图和 `dhp-*` 协议块。
3. 设计 token 放到 `handoff/tokens/design-tokens.json`。
4. 组件映射放到 `handoff/mapping/component-map.shadcn.json`，后端契约放到 `handoff/api/api-contract.json`。
5. 执行 `npm run dhp:validate && npm run dhp:build && npm run dhp:sync`。
6. 使用 `design-handoff-next-shadcn` 统一实现前端和后端。
7. 执行 `npm run typecheck && npm run build` 验证。

## 重要原则

- Agent 不能直接从截图脑补生产 UI。
- Markdown 只负责人类可读；真正给 Agent 看的是真实 `dhp-*` 协议块。
- 视觉值必须来自 tokens。
- 组件只能从 component-map 映射中选择。
- 所有页面必须覆盖 loading / empty / error / no-permission。
- 对未知内容必须显式写假设，不允许静默补全。

## 文档

- [安装说明](./docs/安装说明.md)
- [协议规范](./docs/协议规范.md)
- [Skill 使用说明](./docs/Skill使用说明.md)
- [开源调研结论](./docs/开源调研结论.md)
- [Figma / Storybook MCP 接入](./docs/Figma-Storybook-MCP接入.md)
- [后端适配说明](./docs/后端适配说明.md)
- [发布到 GitHub](./docs/发布到GitHub.md)

---
description:
alwaysApply: true
---

@AGENTS.md

# CLAUDE.md

本文件是 Claude Code 兼容入口。仓库协作规范的唯一真源是 `AGENTS.md`，不要在这里维护第二份完整正文。

## Claude Code 使用约定

- 先读取 `AGENTS.md`（P0 铁律 + 级联路由表），再按”级联路由表”按需下钻到 `docs/architecture/agent-rules.md` 的对应章节。
- 规则带权重标记：🔴 MUST（违反即事故）> 🟡 SHOULD（高频踩坑）> 🟢 NICE（最佳实践）。
- 新增或修改规则时，只更新 `AGENTS.md` 或共享细则，不在 `CLAUDE.md` 复制一份。
- 如果 `CLAUDE.md` 与 `AGENTS.md` 出现冲突，以 `AGENTS.md` 为准。
- 涉及 Inspector / 面板 / 侧栏等信息展示型 UI 设计时，必须先读 `AGENTS.md` 的「产品设计审美原则」章节（信息标签化、流线型信息流、就地消费、术语零发明、苏格拉底式反问），再输出方案。

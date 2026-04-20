# Figma / Storybook MCP 接入

本项目没有强制绑定 Figma 或 Storybook，因为不是所有团队都有完整设计系统。推荐作为增强能力接入。

## Figma MCP 的角色

Figma MCP 用来获取：

- frame 层级
- auto-layout 信息
- 变量与 token
- 组件实例
- 文案

但 Figma MCP 的输出不能直接作为生产代码依据。必须转写到 DHP：

```txt
Figma MCP observation -> handoff/pages/*.md + dhp-layout/dhp-binding/dhp-state-matrix
```

## Storybook MCP 的角色

Storybook MCP 用来获取：

- 已有组件列表
- props / stories / docs
- 可用 variants
- 组件测试反馈

然后更新：

```txt
handoff/mapping/component-map.shadcn.json
```

## 推荐 Agent 提示词

```txt
先用 Figma/Storybook MCP 收集上下文，但不要直接生成代码。
请先把收集到的信息转成 DHP 协议块，更新 handoff 文件，运行 npm run dhp:validate。
校验通过后再生成 Next.js/shadcn 代码。
```

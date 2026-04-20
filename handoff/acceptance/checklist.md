# 验收清单

## 协议验收

- [ ] `handoff.json` 能被 `npm run dhp:validate` 校验通过。
- [ ] 所有页面 markdown 至少包含一个 `dhp-layout`。
- [ ] 所有组件 markdown 至少包含一个 `dhp-component`。
- [ ] tokens 不存在空值。
- [ ] component-map 声明了所有页面组件。

## UI 验收

- [ ] 页面可以展示 success 状态。
- [ ] 页面可以切换 loading / empty / error / no-permission。
- [ ] 详情抽屉能打开/关闭。
- [ ] 无权限时不显示可提交处置动作。
- [ ] 移动端不出现横向不可控溢出。

## 工程验收

- [ ] `npm run verify:offline` 通过。
- [ ] `npm run typecheck` 通过。
- [ ] `npm run web:build` 通过。
- [ ] Hono `/health` 返回 `{ ok: true }`。
- [ ] FastAPI `/docs` 能打开。

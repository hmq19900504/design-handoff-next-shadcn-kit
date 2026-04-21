# Codegen Checklist

- [ ] 是否先定义了产品边界、对象模型和“不属于本模块”的内容？
- [ ] 是否先明确页面职责、主入口和主动作？
- [ ] 是否给出了 ASCII 线框、Mermaid 结构/流程图或状态机？
- [ ] 是否补齐 `dhp-layout`、`dhp-state-matrix`、`dhp-binding`、`dhp-interaction`？
- [ ] 是否给出了 V1 / V2、测试重点和验收标准？
- [ ] 是否读取了 `handoff.bundle.json`？
- [ ] 是否严格使用 `component-map.shadcn.json`？
- [ ] 是否只使用 token 或语义变量？
- [ ] 是否覆盖 loading / empty / error / no-permission？
- [ ] 是否生成 TypeScript 类型？
- [ ] 是否连接 Hono/FastAPI 契约？
- [ ] 是否保留中文业务文案？
- [ ] 是否运行 `npm run verify:offline`？

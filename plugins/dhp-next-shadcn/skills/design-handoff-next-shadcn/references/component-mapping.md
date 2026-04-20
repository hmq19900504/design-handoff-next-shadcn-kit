# 组件映射规则

Agent 不应该从视觉描述直接发明组件。所有抽象组件必须映射到项目已有组件或 shadcn/ui 组合。

示例：

```json
{
  "RiskTable": {
    "implementedBy": ["Card", "Table", "Badge", "Button"],
    "forbidden": ["自造表格组件", "硬编码列宽"]
  }
}
```

组件映射缺失时，不要直接实现；应在结果中提示需要补充映射，或以最小安全组合实现并标注假设。

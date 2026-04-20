# RiskTable

```dhp-component
{
  "name": "RiskTable",
  "responsibility": "展示风险对象列表，并提供查看详情与处置入口。",
  "implementedBy": ["Card", "Table", "Badge", "Button", "StateBlock"],
  "props": {
    "items": "RiskItem[]",
    "loading": "boolean",
    "error": "string | null",
    "onOpenDetail": "(item: RiskItem) => void",
    "onRetry": "() => void"
  },
  "columns": [
    {"key": "merchantName", "title": "商户", "priority": 1},
    {"key": "riskLevel", "title": "风险等级", "priority": 1, "render": "Badge"},
    {"key": "riskTags", "title": "风险标签", "priority": 2, "render": "Badge[]"},
    {"key": "fulfillmentScore", "title": "履约分", "priority": 2},
    {"key": "source", "title": "来源", "priority": 3},
    {"key": "updatedAt", "title": "更新时间", "priority": 3},
    {"key": "status", "title": "状态", "priority": 1, "render": "Badge"},
    {"key": "actions", "title": "操作", "priority": 1, "render": "Button"}
  ],
  "states": ["loading", "empty", "error", "success"],
  "rules": ["操作列固定在最右侧语义位置", "移动端隐藏 priority=3 的列"]
}
```

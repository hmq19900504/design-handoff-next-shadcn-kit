# FilterPanel

```dhp-component
{
  "name": "FilterPanel",
  "responsibility": "承载风险列表筛选条件，并触发查询。",
  "implementedBy": ["Card", "Input", "Select", "Button"],
  "props": {
    "value": "RiskQuery",
    "loading": "boolean",
    "onChange": "(next: RiskQuery) => void",
    "onSubmit": "() => void",
    "onReset": "() => void"
  },
  "fields": [
    {"name": "keyword", "label": "商户/风险ID", "component": "Input", "placeholder": "输入商户名称或风险ID"},
    {"name": "riskLevel", "label": "风险等级", "component": "Select", "options": ["全部", "低", "中", "高", "严重"]},
    {"name": "source", "label": "风险来源", "component": "Select", "options": ["全部", "模型", "投诉", "人工", "稽核"]},
    {"name": "dateRange", "label": "时间范围", "component": "Select", "options": ["近7天", "近30天", "本季度"]}
  ],
  "states": ["idle", "loading", "error"],
  "a11y": ["所有输入项必须有 label", "查询按钮 loading 时 aria-busy=true"]
}
```

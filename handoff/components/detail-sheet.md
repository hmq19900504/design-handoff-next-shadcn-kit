# RiskDetailSheet

```dhp-component
{
  "name": "RiskDetailSheet",
  "responsibility": "展示单个风险对象详情，并允许有权限用户提交处置。",
  "implementedBy": ["Sheet", "Badge", "Button", "Textarea", "Alert"],
  "props": {
    "item": "RiskItem | null",
    "open": "boolean",
    "canWrite": "boolean",
    "onOpenChange": "(open: boolean) => void",
    "onDispose": "(request: DispositionRequest) => Promise<void>"
  },
  "states": ["closed", "open", "submitting", "no-permission"],
  "actions": ["mark-safe", "restrict", "escalate"]
}
```

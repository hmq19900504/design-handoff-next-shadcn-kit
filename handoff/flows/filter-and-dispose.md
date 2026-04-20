# 筛选与处置流程

```mermaid
sequenceDiagram
  participant User as 运营
  participant UI as Next.js 页面
  participant API as Hono/FastAPI API
  User->>UI: 修改筛选条件
  UI->>API: GET /api/risk-items
  API-->>UI: RiskItem[]
  User->>UI: 打开详情
  User->>UI: 提交处置
  UI->>API: POST /api/dispositions
  API-->>UI: ok
  UI-->>User: 更新状态
```

```dhp-interaction
{
  "flowId": "filter-and-dispose",
  "steps": [
    {"step": 1, "actor": "user", "action": "修改筛选条件"},
    {"step": 2, "actor": "ui", "action": "调用 GET /api/risk-items", "state": "loading"},
    {"step": 3, "actor": "ui", "action": "渲染 RiskTable", "state": "success | empty | error"},
    {"step": 4, "actor": "user", "action": "打开详情抽屉"},
    {"step": 5, "actor": "user", "action": "提交处置", "permission": "risk.write"},
    {"step": 6, "actor": "ui", "action": "刷新当前行状态"}
  ]
}
```

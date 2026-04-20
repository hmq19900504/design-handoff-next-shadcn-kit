# MetricCardGroup

```dhp-component
{
  "name": "MetricCardGroup",
  "responsibility": "展示当前筛选条件下的风险概览。",
  "implementedBy": ["Card", "Badge", "Skeleton"],
  "props": {"items": "Metric[]", "loading": "boolean"},
  "metrics": [
    {"label": "待处理风险", "source": "status=pending count", "tone": "danger"},
    {"label": "高危商户", "source": "riskLevel in high,critical count", "tone": "warning"},
    {"label": "平均履约分", "source": "avg fulfillmentScore", "tone": "info"},
    {"label": "本周已处置", "source": "status=resolved count", "tone": "success"}
  ],
  "states": ["loading", "success"]
}
```

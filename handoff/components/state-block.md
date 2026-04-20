# StateBlock

```dhp-component
{
  "name": "StateBlock",
  "responsibility": "统一表达 loading、empty、error、no-permission。",
  "implementedBy": ["Skeleton", "Alert", "Button"],
  "props": {
    "state": "loading | empty | error | no-permission",
    "message": "string",
    "onRetry": "() => void"
  },
  "copy": {
    "loading": "正在加载风险数据…",
    "empty": "暂无符合条件的风险对象",
    "error": "数据加载失败，请稍后重试",
    "no-permission": "当前账号暂无处置权限"
  }
}
```

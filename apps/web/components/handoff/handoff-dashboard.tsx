"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Eye, Lock, RefreshCw, ShieldAlert } from "lucide-react";
import type { DhpBundle, RiskItem } from "@/lib/dhp";
import { deriveMetrics, sampleRiskItems } from "@/lib/dhp";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

type ViewState = "success" | "loading" | "empty" | "error" | "no-permission";
type RiskQueryState = { keyword: string; riskLevel: string; source: string; dateRange: string };

const riskLevelText: Record<RiskItem["riskLevel"], string> = {
  low: "低",
  medium: "中",
  high: "高",
  critical: "严重"
};

const riskLevelVariant: Record<RiskItem["riskLevel"], BadgeVariant> = {
  low: "success",
  medium: "warning",
  high: "danger",
  critical: "danger"
};

const statusText: Record<RiskItem["status"], string> = {
  pending: "待处理",
  processing: "处理中",
  resolved: "已解决",
  rejected: "已驳回"
};

export function HandoffDashboard({ bundle }: { bundle: DhpBundle }) {
  const [viewState, setViewState] = useState<ViewState>("success");
  const [selected, setSelected] = useState<RiskItem | null>(null);
  const [query, setQuery] = useState({ keyword: "", riskLevel: "all", source: "all", dateRange: "7d" });

  const canWrite = viewState !== "no-permission";
  const items = useMemo(() => {
    if (viewState === "empty") return [];
    return sampleRiskItems.filter((item) => {
      const keywordMatched = !query.keyword || item.merchantName.includes(query.keyword) || item.id.includes(query.keyword);
      const levelMatched = query.riskLevel === "all" || item.riskLevel === query.riskLevel;
      const sourceMatched = query.source === "all" || item.source === query.source;
      return keywordMatched && levelMatched && sourceMatched;
    });
  }, [query, viewState]);

  const metrics = deriveMetrics(items.length ? items : sampleRiskItems);

  return (
    <main className="min-h-screen bg-[var(--dhp-color-background)] p-4 md:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <header className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-5 shadow-sm md:flex-row md:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
              <ShieldAlert className="h-3.5 w-3.5" /> DHP Bundle {bundle.bundleVersion} · {bundle.module}
            </div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">商户履约风险控制台</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              该页面由 Markdown 线框、dhp-* 协议块、tokens、component-map 和 API contract 驱动，Agent 不能脱离协议自由发挥。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["success", "loading", "empty", "error", "no-permission"] as ViewState[]).map((state) => (
              <Button key={state} size="sm" variant={viewState === state ? "default" : "outline"} onClick={() => setViewState(state)}>
                {state}
              </Button>
            ))}
          </div>
        </header>

        <FilterPanel query={query} setQuery={setQuery} loading={viewState === "loading"} />

        <MetricCards loading={viewState === "loading"} metrics={metrics} />

        {viewState === "error" ? (
          <StateBlock state="error" message="数据加载失败，请稍后重试。" onRetry={() => setViewState("success")} />
        ) : viewState === "loading" ? (
          <RiskTableSkeleton />
        ) : (
          <RiskTable items={items} onOpenDetail={setSelected} />
        )}

        <ProtocolSummary bundle={bundle} />
      </div>

      <RiskDetailSheet
        item={selected}
        open={Boolean(selected)}
        canWrite={canWrite}
        onClose={() => setSelected(null)}
      />
    </main>
  );
}

function FilterPanel({ query, setQuery, loading }: { query: RiskQueryState; setQuery: (query: RiskQueryState) => void; loading: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>筛选区</CardTitle>
        <CardDescription>来自 FilterPanel 组件契约：Input + Select + Button，所有字段都有 label。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="grid gap-1 text-sm">
            商户/风险ID
            <Input disabled={loading} value={query.keyword} placeholder="输入商户名称或风险ID" onChange={(e) => setQuery({ ...query, keyword: e.target.value })} />
          </label>
          <label className="grid gap-1 text-sm">
            风险等级
            <Select disabled={loading} value={query.riskLevel} onChange={(e) => setQuery({ ...query, riskLevel: e.target.value })}>
              <option value="all">全部</option>
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
              <option value="critical">严重</option>
            </Select>
          </label>
          <label className="grid gap-1 text-sm">
            风险来源
            <Select disabled={loading} value={query.source} onChange={(e) => setQuery({ ...query, source: e.target.value })}>
              <option value="all">全部</option>
              <option value="model">模型</option>
              <option value="complaint">投诉</option>
              <option value="manual">人工</option>
              <option value="audit">稽核</option>
            </Select>
          </label>
          <label className="grid gap-1 text-sm">
            时间范围
            <Select disabled={loading} value={query.dateRange} onChange={(e) => setQuery({ ...query, dateRange: e.target.value })}>
              <option value="7d">近7天</option>
              <option value="30d">近30天</option>
              <option value="quarter">本季度</option>
            </Select>
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <Button disabled={loading}>{loading ? "查询中…" : "查询"}</Button>
          <Button variant="outline" disabled={loading} onClick={() => setQuery({ keyword: "", riskLevel: "all", source: "all", dateRange: "7d" })}>清空筛选</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCards({ metrics, loading }: { metrics: ReturnType<typeof deriveMetrics>; loading: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader className="pb-2">
            <CardDescription>{metric.label}</CardDescription>
            {loading ? <Skeleton className="h-8 w-24" /> : <CardTitle className="text-3xl">{metric.value}</CardTitle>}
          </CardHeader>
          <CardContent>
            <Badge variant={metric.tone === "danger" ? "danger" : metric.tone === "warning" ? "warning" : metric.tone === "success" ? "success" : "default"}>{metric.delta}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RiskTable({ items, onOpenDetail }: { items: RiskItem[]; onOpenDetail: (item: RiskItem) => void }) {
  if (!items.length) {
    return <StateBlock state="empty" message="暂无符合条件的风险对象。" onRetry={() => undefined} />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>风险列表</CardTitle>
        <CardDescription>来自 RiskTable 契约：Table + Badge + Button；移动端隐藏低优先级列。</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>商户</TableHead>
              <TableHead>风险等级</TableHead>
              <TableHead className="hidden md:table-cell">风险标签</TableHead>
              <TableHead className="hidden lg:table-cell">履约分</TableHead>
              <TableHead className="hidden lg:table-cell">来源</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.merchantName}</div>
                  <div className="text-xs text-muted-foreground">{item.id} · {item.updatedAt}</div>
                </TableCell>
                <TableCell><Badge variant={riskLevelVariant[item.riskLevel]}>{riskLevelText[item.riskLevel]}</Badge></TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">{item.riskTags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{item.fulfillmentScore}</TableCell>
                <TableCell className="hidden lg:table-cell">{item.source}</TableCell>
                <TableCell><Badge>{statusText[item.status]}</Badge></TableCell>
                <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => onOpenDetail(item)}><Eye className="h-4 w-4" />查看</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RiskTableSkeleton() {
  return (
    <Card>
      <CardHeader><Skeleton className="h-5 w-32" /><Skeleton className="h-4 w-64" /></CardHeader>
      <CardContent className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</CardContent>
    </Card>
  );
}

function StateBlock({ state, message, onRetry }: { state: ViewState; message: string; onRetry: () => void }) {
  const icon = state === "error" ? <AlertCircle className="h-5 w-5" /> : state === "no-permission" ? <Lock className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />;
  return (
    <Alert>
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          <AlertTitle>{state}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
          {state === "error" ? <Button className="mt-3" size="sm" variant="outline" onClick={onRetry}><RefreshCw className="h-4 w-4" />重试</Button> : null}
        </div>
      </div>
    </Alert>
  );
}

function RiskDetailSheet({ item, open, canWrite, onClose }: { item: RiskItem | null; open: boolean; canWrite: boolean; onClose: () => void }) {
  return (
    <Sheet open={open}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{item?.merchantName ?? "风险详情"}</SheetTitle>
          <SheetDescription>来自 RiskDetailSheet 契约：Sheet + Badge + Textarea + Button。</SheetDescription>
        </SheetHeader>
        {item ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="风险ID" value={item.id} />
              <Info label="风险等级" value={riskLevelText[item.riskLevel]} />
              <Info label="履约分" value={item.fulfillmentScore} />
              <Info label="负责人" value={item.owner} />
            </div>
            <div>
              <div className="mb-2 text-sm font-medium">风险标签</div>
              <div className="flex flex-wrap gap-2">{item.riskTags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>
            </div>
            {!canWrite ? (
              <Alert className="border-amber-200 bg-amber-50"><AlertTitle>无处置权限</AlertTitle><AlertDescription>当前账号暂无 risk.write 权限，仅可查看风险详情。</AlertDescription></Alert>
            ) : (
              <div className="space-y-3">
                <label className="grid gap-2 text-sm font-medium">处置原因<Textarea placeholder="请输入处置依据，真实项目应提交到 POST /api/dispositions" /></label>
                <div className="flex flex-wrap gap-2">
                  <Button>限制商户</Button>
                  <Button variant="outline">标记安全</Button>
                  <Button variant="destructive">升级审核</Button>
                </div>
              </div>
            )}
            <Button variant="outline" onClick={onClose}>关闭</Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border bg-muted/40 p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 font-medium">{value}</div></div>;
}

function ProtocolSummary({ bundle }: { bundle: DhpBundle }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>协议摘要</CardTitle>
        <CardDescription>Agent 应优先读取这些结构化内容，而不是直接从截图或自然语言猜测。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 text-sm md:grid-cols-4">
          <Info label="页面协议" value={bundle.pages.length} />
          <Info label="组件契约" value={bundle.components.length} />
          <Info label="交互流程" value={bundle.flows.length} />
          <Info label="DHP 版本" value={bundle.dhpVersion} />
        </div>
      </CardContent>
    </Card>
  );
}

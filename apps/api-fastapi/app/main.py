from __future__ import annotations

import json
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="DHP FastAPI", version="0.2.0")

RiskLevel = Literal["low", "medium", "high", "critical"]
RiskSource = Literal["manual", "model", "complaint", "audit"]
RiskStatus = Literal["pending", "processing", "resolved", "rejected"]


class RiskItem(BaseModel):
    id: str
    merchantName: str
    riskLevel: RiskLevel
    riskTags: list[str]
    fulfillmentScore: int
    source: RiskSource
    owner: str
    updatedAt: str
    status: RiskStatus


class DispositionRequest(BaseModel):
    riskId: str
    action: Literal["mark-safe", "restrict", "escalate"]
    reason: str = Field(min_length=1)


RISK_ITEMS = [
    RiskItem(id="RISK-1001", merchantName="青禾生活馆", riskLevel="critical", riskTags=["超时履约", "投诉升高"], fulfillmentScore=62, source="model", owner="运营一组", updatedAt="2026-04-20 09:12", status="pending"),
    RiskItem(id="RISK-1002", merchantName="星桥数码专营店", riskLevel="high", riskTags=["虚假发货", "退款异常"], fulfillmentScore=71, source="complaint", owner="风控组", updatedAt="2026-04-19 17:40", status="processing"),
    RiskItem(id="RISK-1003", merchantName="南山鲜食供应链", riskLevel="medium", riskTags=["时效波动"], fulfillmentScore=84, source="audit", owner="运营二组", updatedAt="2026-04-18 14:22", status="resolved"),
]


def bundle_path() -> Path:
    return Path(__file__).resolve().parents[3] / "handoff" / ".handoff" / "build" / "handoff.bundle.json"


@app.get("/health")
def health() -> dict[str, bool | str]:
    return {"ok": True, "service": "dhp-api-fastapi"}


@app.get("/api/handoff")
def get_handoff() -> dict:
    path = bundle_path()
    if not path.exists():
        raise HTTPException(status_code=404, detail="bundle not found, run npm run dhp:build first")
    return json.loads(path.read_text(encoding="utf-8"))


@app.get("/api/risk-items", response_model=list[RiskItem])
def list_risk_items(keyword: str = "", riskLevel: str = "all", source: str = "all") -> list[RiskItem]:
    def match(item: RiskItem) -> bool:
        keyword_matched = not keyword or keyword in item.id or keyword in item.merchantName
        level_matched = riskLevel == "all" or item.riskLevel == riskLevel
        source_matched = source == "all" or item.source == source
        return keyword_matched and level_matched and source_matched

    return [item for item in RISK_ITEMS if match(item)]


@app.post("/api/dispositions")
def create_disposition(request: DispositionRequest) -> dict[str, bool | str]:
    return {"ok": True, "message": f"已提交处置：{request.action}"}

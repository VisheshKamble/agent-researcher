from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from graph.pipeline import research_app, ResearchState
import asyncio
import json
import time

app = FastAPI(title="Agent Researcher API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str
    depth: str = "standard"

AGENT_ORDER = ["planner", "searcher", "reader", "fact_checker", "writer"]

@app.get("/")
def root():
    return {"message": "Agent Researcher API is running"}

@app.post("/research")
def run_research(request: ResearchRequest):
    initial_state = ResearchState(
        topic=request.topic,
        subtasks=[],
        search_results=[],
        extracted_content=[],
        verified_facts=[],
        final_report="",
        status="starting"
    )

    final_state = research_app.invoke(initial_state)

    return {
        "topic": request.topic,
        "report": final_state["final_report"],
        "sources_count": len(final_state["extracted_content"]),
        "sources": [s["url"] for s in final_state["extracted_content"]],
        "status": "complete"
    }

@app.get("/research/stream")
async def stream_research(topic: str, depth: str = "standard"):
    async def event_generator():
        initial_state = ResearchState(
            topic=topic,
            subtasks=[],
            search_results=[],
            extracted_content=[],
            verified_facts=[],
            final_report="",
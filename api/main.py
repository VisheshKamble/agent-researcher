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
            status="starting"
        )

        completed = []

        for agent_name in AGENT_ORDER:
            yield {
                "event": "agent_start",
                "data": json.dumps({
                    "agent": agent_name,
                    "status": "running",
                    "completed": completed
                })
            }
            await asyncio.sleep(0.1)

            if agent_name == "planner":
                from agents.planner import planner_agent
                initial_state = planner_agent(initial_state)
            elif agent_name == "searcher":
                from agents.searcher import searcher_agent
                initial_state = searcher_agent(initial_state)
                yield {
                    "event": "agent_done",
                    "data": json.dumps({
                        "agent": "searcher",
                        "detail": f"{len(initial_state['search_results'])} results found"
                    })
                }
            elif agent_name == "reader":
                from agents.reader import reader_agent
                initial_state = reader_agent(initial_state)
                yield {
                    "event": "agent_done",
                    "data": json.dumps({
                        "agent": "reader",
                        "detail": f"{len(initial_state['extracted_content'])} sources read"
                    })
                }
            elif agent_name == "fact_checker":
                from agents.fact_checker import fact_checker_agent
                initial_state = fact_checker_agent(initial_state)
            elif agent_name == "writer":
                from agents.writer import writer_agent
                initial_state = writer_agent(initial_state)

            completed.append(agent_name)
            yield {
                "event": "agent_complete",
                "data": json.dumps({
                    "agent": agent_name,
                    "completed": completed
                })
            }
            await asyncio.sleep(0.1)

        yield {
            "event": "research_complete",
            "data": json.dumps({
                "report": initial_state["final_report"],
                "sources_count": len(initial_state["extracted_content"]),
                "sources": [s["url"] for s in initial_state["extracted_content"]],
                "status": "complete"
            })
        }

    return EventSourceResponse(event_generator())

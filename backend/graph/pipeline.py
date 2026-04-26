from langgraph.graph import StateGraph, END
from typing import TypedDict, List
from agents.planner import planner_agent
from agents.searcher import searcher_agent
from agents.reader import reader_agent
from agents.fact_checker import fact_checker_agent
from agents.writer import writer_agent

class ResearchState(TypedDict):
    topic: str
    subtasks: List[str]
    search_results: List[dict]
    extracted_content: List[dict]
    verified_facts: List[str]
    final_report: str
    status: str

def build_graph():
    graph = StateGraph(ResearchState)

    graph.add_node("planner", planner_agent)
    graph.add_node("searcher", searcher_agent)
    graph.add_node("reader", reader_agent)
    graph.add_node("fact_checker", fact_checker_agent)
    graph.add_node("writer", writer_agent)

    graph.set_entry_point("planner")
    graph.add_edge("planner", "searcher")
    graph.add_edge("searcher", "reader")
    graph.add_edge("reader", "fact_checker")
    graph.add_edge("fact_checker", "writer")
    graph.add_edge("writer", END)

    return graph.compile()

research_app = build_graph()

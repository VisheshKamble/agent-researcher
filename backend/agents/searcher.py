from tavily import TavilyClient
from config import TAVILY_API_KEY, MAX_SEARCH_RESULTS

def searcher_agent(state: dict) -> dict:
    client = TavilyClient(api_key=TAVILY_API_KEY)
    all_results = []

    for subtask in state['subtasks']:
        try:
            results = client.search(
                query=subtask,
                max_results=MAX_SEARCH_RESULTS,
                search_depth="basic"
            )
            for r in results.get('results', []):
                all_results.append({
                    "title": r.get("title", ""),
                    "url": r.get("url", ""),
                    "content": r.get("content", ""),
                    "subtask": subtask
                })
        except Exception as e:
            print(f"Search failed for '{subtask}': {e}")

    return {**state, "search_results": all_results, "status": "searched"}
from langchain_groq import ChatGroq
from config import GROQ_API_KEY, MODEL_NAME
import ast, re

llm = ChatGroq(
    model=MODEL_NAME,
    api_key=GROQ_API_KEY,
    temperature=0.3
)

def planner_agent(state: dict) -> dict:
    prompt = f"""
    You are a research planner. Break down this research topic into 4-5 specific subtasks.

    Topic: {state['topic']}

    Return ONLY a Python list of strings like:
    ["subtask 1", "subtask 2", "subtask 3", "subtask 4"]

    Make each subtask specific and searchable.
    """

    response = llm.invoke(prompt)
    content = response.content
    list_match = re.search(r'\[.*?\]', content, re.DOTALL)

    if list_match:
        subtasks = ast.literal_eval(list_match.group())
    else:
        subtasks = [
            f"latest developments in {state['topic']}",
            f"key players and companies in {state['topic']}",
            f"challenges and limitations of {state['topic']}",
            f"future outlook of {state['topic']}"
        ]

    return {**state, "subtasks": subtasks, "status": "planned"}

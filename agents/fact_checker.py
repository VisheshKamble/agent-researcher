from langchain_groq import ChatGroq
from config import GROQ_API_KEY, MODEL_NAME

llm = ChatGroq(
    model=MODEL_NAME,
    api_key=GROQ_API_KEY,
    temperature=0.3
)

def fact_checker_agent(state: dict) -> dict:
    all_content = ""
    for i, source in enumerate(state['extracted_content'], 1):
        all_content += f"\nSource {i} ({source['url']}):\n{source['key_points']}\n"

    prompt = f"""
    You are a fact checker reviewing research about: {state['topic']}

    Here are extracted points from multiple sources:
    {all_content}

    Your job:
    1. Identify facts confirmed by MULTIPLE sources (mark as Verified)
    2. Flag facts from only ONE source (mark as Unverified)
    3. Remove contradictions and outdated information

    Return a clean grouped list of facts organized by subtopic.
    """

    response = llm.invoke(prompt)
    verified = [
        f.strip() for f in response.content.split('\n')
        if f.strip() and len(f.strip()) > 20
    ]

    return {**state, "verified_facts": verified, "status": "verified"}

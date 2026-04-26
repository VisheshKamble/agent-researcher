from langchain_groq import ChatGroq
from config import GROQ_API_KEY, MODEL_NAME

llm = ChatGroq(
    model=MODEL_NAME,
    api_key=GROQ_API_KEY,
    temperature=0.3
)

def fact_checker_agent(state: dict) -> dict:
    # Limit the total prompt size to avoid LLM token overflow
    MAX_PROMPT_CHARS = 9000
    all_content = ""
    total_chars = 0
    for i, source in enumerate(state['extracted_content'], 1):
        key_points = source['key_points']
        # Truncate key_points if too long
        if len(key_points) > 1000:
            key_points = key_points[:1000] + '... [truncated]'
        entry = f"\nSource {i} ({source['url']}):\n{key_points}\n"
        if total_chars + len(entry) > MAX_PROMPT_CHARS:
            all_content += f"\n... [truncated: more sources omitted]"
            break
        all_content += entry
        total_chars += len(entry)

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
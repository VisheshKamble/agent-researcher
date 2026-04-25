import requests
from bs4 import BeautifulSoup
from langchain_groq import ChatGroq
from config import GROQ_API_KEY, MODEL_NAME, MAX_SOURCES_TO_READ

llm = ChatGroq(
    model=MODEL_NAME,
    api_key=GROQ_API_KEY,
    temperature=0.3
)

def reader_agent(state: dict) -> dict:
    extracted = []
    seen_urls = set()

    for result in state['search_results'][:MAX_SOURCES_TO_READ]:
        url = result['url']
        if url in seen_urls:
            continue
        seen_urls.add(url)

        try:
            headers = {"User-Agent": "Mozilla/5.0"}
            resp = requests.get(url, timeout=8, headers=headers)
            soup = BeautifulSoup(resp.text, 'html.parser')

            for tag in soup(["script", "style", "nav", "footer", "header"]):
                tag.decompose()

            raw_text = soup.get_text(separator=' ', strip=True)
            raw_text = ' '.join(raw_text.split())[:3000]

            prompt = f"""
            Extract the most relevant facts about: {state['topic']}

            From this text:
            {raw_text}

            Return 3-5 key factual points as a numbered list.
            Be specific and include data and numbers where available.
            """

            extract = llm.invoke(prompt)
            extracted.append({
                "url": url,
                "title": result['title'],
                "key_points": extract.content,
                "subtask": result['subtask']
            })

        except Exception as e:
            print(f"Could not read {url}: {e}")

    return {**state, "extracted_content": extracted, "status": "read"}

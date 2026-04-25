from config import GEMINI_API_KEY, TAVILY_API_KEY
from langchain_google_genai import ChatGoogleGenerativeAI

print("Testing Gemini connection...")
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=GEMINI_API_KEY
)
response = llm.invoke("Say hello in one sentence.")
print("Gemini works:", response.content)

print("Tavily key loaded:", TAVILY_API_KEY[:8] + "...")
print("\nAll good! Ready to build.")

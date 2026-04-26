import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
MODEL_NAME = "llama-3.3-70b-versatile"
MAX_SEARCH_RESULTS = 5
MAX_SOURCES_TO_READ = 8

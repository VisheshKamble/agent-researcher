# Agent Researcher

Agent Researcher is a modular, agentic AI research assistant platform designed to automate and streamline the process of information gathering, fact-checking, and report generation. It leverages a multi-agent pipeline, modern web technologies, and integrations with external data sources to provide a robust research workflow.

## Project Overview

Agent Researcher enables users to submit research queries, which are then processed through a pipeline of specialized agents. Each agent is responsible for a distinct task, such as planning, searching, reading, fact-checking, and writing. The system is extensible, allowing for the addition of new agents and tools as needed.

## Key Features

- Modular agent architecture (fact checker, planner, reader, searcher, writer)
- FastAPI backend for scalable API services
- React frontend with modern UI (Vite, Tailwind CSS)
- Docker and Docker Compose support for easy deployment
- Integration with external tools (arXiv, Tavily, ChromaDB)
- Vector store memory and graph-based pipeline
- Ready for cloud deployment (Vercel, Render, etc.)

## Pipeline Architecture

The core pipeline consists of the following agents:

1. **Planner**: Breaks down the research query into actionable steps.
2. **Searcher**: Finds relevant documents and data from external sources (e.g., arXiv, Tavily).
3. **Reader**: Extracts and summarizes information from the retrieved documents.
4. **Fact Checker**: Validates the extracted information for accuracy and reliability.
5. **Writer**: Compiles the validated information into a coherent report.

The pipeline is orchestrated using a graph-based approach, allowing for flexible agent interactions and state management.

## Project Structure

```
agentresearcher.ipynb
config.py
docker-compose.yml
Dockerfile
requirements.txt
test_setup.py
agents/
api/
graph/
memory/
tests/
tools/
ui/
agent-researcher-ui/
```

- **agents/**: Core agent modules (fact checker, planner, etc.)
- **api/**: FastAPI application
- **graph/**: Pipeline and graph logic
- **memory/**: Vector store and memory management
- **tools/**: Integrations with external APIs and tools
- **ui/**: (Optional) Python-based UI
- **agent-researcher-ui/**: React frontend

## Backend Setup

1. Install Python 3.11+.
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the API server:
   ```
   uvicorn api.main:app --reload --port 8000
   ```

Or use Docker:
   ```
   docker build -t agent-researcher-api .
   docker run -p 8000:8000 agent-researcher-api
   ```

Or with Docker Compose:
   ```
   docker-compose up --build
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd agent-researcher-ui
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

## Deployment

- **Frontend**: Deploy the `agent-researcher-ui` build output to Vercel, Netlify, or any static hosting.
- **Backend**: Deploy the FastAPI app to Render, AWS, Azure, or any cloud provider supporting Docker or Python web services.

## Environment Variables

- Configure environment variables in a `.env` file for backend settings (API keys, DB URIs, etc.).
- Set the API base URL in the frontend (e.g., `VITE_API_URL` for Vite).

## Requirements

- Python dependencies: See `requirements.txt`
- Node.js dependencies: See `agent-researcher-ui/package.json`

## Live Demo

- **Backend deployed on Render:** [https://agent-researcher-8sca.onrender.com](https://agent-researcher-8sca.onrender.com)
- **Frontend deployed on Netlify:** [https://agentresearcherai.netlify.app](https://agentresearcherai.netlify.app)

## License

This project is provided for research and educational purposes.

import { useState, useEffect } from "react";
import axios from "axios";
import AgentTracker from "./components/AgentTracker";
import ReportDisplay from "./components/ReportDisplay";

const API_URL = "https://your-ngrok-url-here.ngrok-free.app";
const AGENT_ORDER = ["planner", "searcher", "reader", "fact_checker", "writer"];
const AGENT_TIMES = {
  planner: 4000,
  searcher: 18000,
  reader: 35000,
  fact_checker: 22000,
  writer: 18000,
};

export default function App() {
  const [dark, setDark] = useState(true);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [report, setReport] = useState(null);
  const [sourcesCount, setSourcesCount] = useState(0);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    document.documentElement.className = dark ? "dark" : "";
  }, [dark]);

  useEffect(() => {
    let timer;
    if (loading && startTime) {
      timer = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loading, startTime]);

  const simulateAgentProgress = async () => {
    for (const agent of AGENT_ORDER) {
      setCurrentAgent(agent);
      await new Promise((res) => setTimeout(res, AGENT_TIMES[agent]));
      setCompletedAgents((prev) => [...prev, agent]);
    }
  };

  const handleResearch = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setReport(null);
    setError(null);
    setCompletedAgents([]);
    setCurrentAgent(null);
    setStartTime(Date.now());
    setElapsed(0);

    simulateAgentProgress();

    try {
      const response = await axios.post(`${API_URL}/research`, {
        topic: topic.trim(),
        depth,
      });
      setReport(response.data.report);
      setSourcesCount(response.data.sources_count);
      setCurrentAgent(null);
      setCompletedAgents(AGENT_ORDER);
    } catch (err) {
      setError("Make sure your Colab is running and try again.");
      setCurrentAgent(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setTopic("");
    setCompletedAgents([]);
    setCurrentAgent(null);
    setError(null);
    setElapsed(0);
    setStartTime(null);
  };

  const suggestions = [
    "Agentic AI in 2025",
    "Quantum computing breakthroughs",
    "Future of fintech in India",
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-zinc-950 text-white" : "bg-gray-50 text-zinc-900"}`}>
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4" style={{ height: "100vh" }}>

        {/* Topbar */}
        <div className={`flex items-center justify-between px-5 py-3 rounded-2xl border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: "#7F77DD" }}>
              A
            </div>
            <div>
              <p className={`text-sm font-medium ${dark ? "text-zinc-100" : "text-zinc-900"}`}>Agent Researcher</p>
              <p className={`text-xs ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Multi-agent AI research assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs ${dark ? "text-zinc-500" : "text-zinc-400"}`}>{dark ? "Dark" : "Light"}</span>
            <button
              onClick={() => setDark(!dark)}
              className="relative w-12 h-6 rounded-full border transition-colors duration-300"
              style={{
                backgroundColor: dark ? "#7F77DD" : "#e5e7eb",
                borderColor: dark ? "#7F77DD" : "#d1d5db",
              }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs transition-all duration-300"
                style={{ left: dark ? "24px" : "2px" }}
              >
                {dark ? "🌙" : "☀️"}
              </span>
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="flex gap-4 flex-1" style={{ minHeight: 0 }}>

          {/* Sidebar */}
          <div className={`flex flex-col gap-4 p-5 rounded-2xl border ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`} style={{ width: "280px", flexShrink: 0 }}>

            <div>
              <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Research topic</p>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. State of agentic AI in 2025..."
                disabled={loading}
                rows={4}
                style={{ width: "100%", resize: "none", outline: "none" }}
                className={`text-sm rounded-xl border px-3 py-2.5 transition-colors ${dark ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-600" : "bg-gray-50 border-gray-200 text-zinc-900"} ${loading ? "opacity-50" : ""}`}
              />
            </div>

            <div>
              <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Depth</p>
              <div className="flex gap-2">
                {["quick", "standard", "deep"].map((d) => (
                  <button
                    key={d}
                    onClick={() => !loading && setDepth(d)}
                    className="flex-1 py-1.5 text-xs rounded-lg border capitalize transition-all"
                    style={{
                      backgroundColor: depth === d ? "#7F77DD" : "transparent",
                      borderColor: depth === d ? "#7F77DD" : dark ? "#3f3f46" : "#e5e7eb",
                      color: depth === d ? "white" : dark ? "#71717a" : "#9ca3af",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={report ? handleReset : handleResearch}
              disabled={loading || (!topic.trim() && !report)}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all text-white"
              style={{
                backgroundColor: report ? (dark ? "#27272a" : "#f3f4f6") : "#7F77DD",
                color: report ? (dark ? "#d4d4d8" : "#52525b") : "white",
                opacity: loading || (!topic.trim() && !report) ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? `Researching... ${elapsed}s` : report ? "New research" : "Run research"}
            </button>

            <div style={{ height: "1px", backgroundColor: dark ? "#27272a" : "#f3f4f6" }} />

            <div>
              <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Agent activity</p>
              <AgentTracker currentAgent={currentAgent} completedAgents={completedAgents} dark={dark} />
            </div>

            {report && (
              <div className="grid grid-cols-2 gap-2 pt-2" style={{ borderTop: `1px solid ${dark ? "#27272a" : "#f3f4f6"}` }}>
                <div className={`rounded-xl p-3 ${dark ? "bg-zinc-800" : "bg-gray-50"}`}>
                  <p className={`text-lg font-medium ${dark ? "text-zinc-100" : "text-zinc-900"}`}>{sourcesCount}</p>
                  <p className={`text-xs ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Sources</p>
                </div>
                <div className={`rounded-xl p-3 ${dark ? "bg-zinc-800" : "bg-gray-50"}`}>
                  <p className={`text-lg font-medium ${dark ? "text-zinc-100" : "text-zinc-900"}`}>{elapsed}s</p>
                  <p className={`text-xs ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Time taken</p>
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className={`flex-1 rounded-2xl border p-5 ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`} style={{ minWidth: 0, overflow: "hidden" }}>

            {!loading && !report && !error && (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: "rgba(127,119,221,0.1)" }}>
                  🔍
                </div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${dark ? "text-zinc-300" : "text-zinc-700"}`}>Ready to research</p>
                  <p className={`text-xs mt-1 ${dark ? "text-zinc-600" : "text-zinc-400"}`}>Enter a topic and hit Run research</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTopic(s)}
                      className="text-xs px-3 py-1.5 rounded-lg border transition-all"
                      style={{
                        borderColor: dark ? "#3f3f46" : "#e5e7eb",
                        color: dark ? "#71717a" : "#9ca3af",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && !report && (
              <div className="h-full flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(139,92,246,0.1)" }}>
                  <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#7F77DD", borderTopColor: "transparent" }} />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${dark ? "text-zinc-300" : "text-zinc-700"}`}>Agents are working...</p>
                  <p className={`text-xs mt-1 ${dark ? "text-zinc-600" : "text-zinc-400"}`}>This takes 1-2 minutes. Watch agent activity on the left.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: "rgba(239,68,68,0.1)" }}>⚠️</div>
                <div className="text-center">
                  <p className="text-sm font-medium text-red-400">Something went wrong</p>
                  <p className={`text-xs mt-1 max-w-xs ${dark ? "text-zinc-500" : "text-zinc-400"}`}>{error}</p>
                </div>
                <button onClick={handleReset} className="text-xs px-4 py-2 rounded-lg text-white" style={{ backgroundColor: "#7F77DD" }}>Try again</button>
              </div>
            )}

            {report && <ReportDisplay report={report} sourcesCount={sourcesCount} dark={dark} />}
          </div>
        </div>
      </div>
    </div>
  );
}

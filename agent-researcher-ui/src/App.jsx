import { useState, useEffect } from "react";
import axios from "axios";
import AgentTracker from "./components/AgentTracker";
import ReportDisplay from "./components/ReportDisplay";

const API_URL = "http://localhost:8000";

const AGENT_ORDER = ["planner", "searcher", "reader", "fact_checker", "writer"];
const AGENT_TIMES = {
  planner: 5000,
  searcher: 20000,
  reader: 35000,
  fact_checker: 20000,
  writer: 15000,
};

const SUGGESTIONS = [
  "Agentic AI in 2025",
  "Quantum computing breakthroughs",
  "Future of fintech in India",
  "Large language model trends",
];

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
    document.documentElement.classList.toggle("dark", dark);
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
      const res = await axios.post(`${API_URL}/research`, {
        topic: topic.trim(),
        depth,
      });
      setReport(res.data.report);
      setSourcesCount(res.data.sources_count);
      setCurrentAgent(null);
      setCompletedAgents(AGENT_ORDER);
    } catch (err) {
      setError("Could not connect to backend. Make sure uvicorn is running on port 8000.");
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

  const bg = dark ? "#0a0a0a" : "#f5f5f7";
  const surface = dark ? "#111111" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const textPrimary = dark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.85)";
  const textSecondary = dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const inputBg = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: bg,
      transition: "background-color 0.3s, color 0.3s",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    }}>
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "20px 20px",
        height: "100vh", display: "flex", flexDirection: "column", gap: "14px",
      }}>

        {/* ── Topbar ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 18px", borderRadius: "16px",
          backgroundColor: surface, border: `1px solid ${border}`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "10px",
              background: "linear-gradient(135deg, #7C6FE0, #9B6FE0)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "white", fontSize: "14px", fontWeight: 600 }}>A</span>
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: textPrimary, letterSpacing: "-0.01em" }}>
                Agent Researcher
              </p>
              <p style={{ fontSize: "11px", color: textSecondary, marginTop: "1px" }}>
                Multi-agent AI · Powered by Groq + LangGraph
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", color: textSecondary }}>
              {dark ? "Dark" : "Light"}
            </span>
            <button
              onClick={() => setDark(!dark)}
              style={{
                position: "relative", width: "44px", height: "24px",
                borderRadius: "12px", border: `1px solid ${dark ? "#7C6FE0" : "#d1d5db"}`,
                backgroundColor: dark ? "#7C6FE0" : "#e5e7eb",
                cursor: "pointer", transition: "all 0.3s",
                flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", top: "2px",
                left: dark ? "21px" : "2px",
                width: "18px", height: "18px",
                borderRadius: "50%", backgroundColor: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", transition: "left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}>
                {dark ? "🌙" : "☀️"}
              </span>
            </button>

            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              backgroundColor: "#22c55e",
              boxShadow: "0 0 6px rgba(34,197,94,0.6)",
            }} title="Backend connected" />
          </div>
        </div>

        {/* ── Main layout ── */}
        <div style={{ display: "flex", gap: "14px", flex: 1, minHeight: 0 }}>

          {/* ── Sidebar ── */}
          <div style={{
            width: "268px", flexShrink: 0,
            display: "flex", flexDirection: "column", gap: "16px",
            padding: "18px", borderRadius: "16px",
            backgroundColor: surface, border: `1px solid ${border}`,
            overflow: "hidden",
          }}>

            {/* Topic */}
            <div>
              <p style={{ fontSize: "10px", fontWeight: 600, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>
                Research topic
              </p>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. State of agentic AI in 2025..."
                disabled={loading}
                rows={4}
                style={{
                  width: "100%", resize: "none", outline: "none",
                  fontSize: "13px", lineHeight: 1.6,
                  padding: "10px 12px", borderRadius: "10px",
                  border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                  backgroundColor: inputBg,
                  color: textPrimary,
                  transition: "border-color 0.2s",
                  fontFamily: "inherit",
                  opacity: loading ? 0.5 : 1,
                }}
                onFocus={e => e.target.style.borderColor = "#7C6FE0"}
                onBlur={e => e.target.style.borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}
              />
            </div>

            {/* Depth */}
            <div>
              <p style={{ fontSize: "10px", fontWeight: 600, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>
                Depth
              </p>
              <div style={{ display: "flex", gap: "6px" }}>
                {["quick", "standard", "deep"].map((d) => (
                  <button
                    key={d}
                    onClick={() => !loading && setDepth(d)}
                    style={{
                      flex: 1, padding: "6px 0", fontSize: "11px", fontWeight: 500,
                      borderRadius: "8px", border: `1px solid ${depth === d ? "#7C6FE0" : border}`,
                      backgroundColor: depth === d ? "#7C6FE0" : "transparent",
                      color: depth === d ? "white" : textSecondary,
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.2s", textTransform: "capitalize",
                      fontFamily: "inherit",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Run button */}
            <button
              onClick={report ? handleReset : handleResearch}
              disabled={loading || (!topic.trim() && !report)}
              style={{
                width: "100%", padding: "10px", fontSize: "13px", fontWeight: 600,
                borderRadius: "10px", border: "none", cursor: "pointer",
                fontFamily: "inherit", letterSpacing: "-0.01em",
                background: report
                  ? dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"
                  : loading
                  ? "rgba(124,111,224,0.6)"
                  : "linear-gradient(135deg, #7C6FE0, #9B6FE0)",
                color: report ? textSecondary : "white",
                opacity: (!topic.trim() && !report && !loading) ? 0.4 : 1,
                transition: "all 0.2s",
                boxShadow: (!report && !loading) ? "0 4px 14px rgba(124,111,224,0.3)" : "none",
              }}
            >
              {loading
                ? `Researching... ${elapsed}s`
                : report
                ? "↺ New research"
                : "Run research →"}
            </button>

            {/* Divider */}
            <div style={{ height: "1px", backgroundColor: border }} />

            {/* Agent tracker */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "10px", fontWeight: 600, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>
                Agent pipeline
              </p>
              <AgentTracker
                currentAgent={currentAgent}
                completedAgents={completedAgents}
                dark={dark}
              />
            </div>

            {/* Stats */}
            {report && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[
                  { value: sourcesCount, label: "Sources" },
                  { value: `${elapsed}s`, label: "Duration" },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    padding: "10px 12px", borderRadius: "10px",
                    backgroundColor: inputBg,
                    border: `1px solid ${border}`,
                  }}>
                    <p style={{ fontSize: "18px", fontWeight: 600, color: textPrimary, letterSpacing: "-0.02em" }}>
                      {stat.value}
                    </p>
                    <p style={{ fontSize: "10px", color: textSecondary, marginTop: "2px" }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right panel ── */}
          <div style={{
            flex: 1, minWidth: 0, borderRadius: "16px",
            backgroundColor: surface, border: `1px solid ${border}`,
            padding: "20px", overflow: "hidden", display: "flex",
            flexDirection: "column",
          }}>

            {/* Empty state */}
            {!loading && !report && !error && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "18px",
                  background: "linear-gradient(135deg, rgba(124,111,224,0.15), rgba(155,111,224,0.15))",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px",
                }}>
                  🔍
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: textPrimary, letterSpacing: "-0.01em" }}>
                    Ready to research
                  </p>
                  <p style={{ fontSize: "12px", color: textSecondary, marginTop: "4px" }}>
                    Enter any topic and your 5 AI agents will get to work
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", maxWidth: "400px" }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTopic(s)}
                      style={{
                        fontSize: "12px", padding: "6px 12px",
                        borderRadius: "20px", cursor: "pointer",
                        border: `1px solid ${border}`,
                        backgroundColor: "transparent", color: textSecondary,
                        fontFamily: "inherit", transition: "all 0.2s",
                      }}
                      onMouseEnter={e => {
                        e.target.style.borderColor = "#7C6FE0";
                        e.target.style.color = "#7C6FE0";
                      }}
                      onMouseLeave={e => {
                        e.target.style.borderColor = border;
                        e.target.style.color = textSecondary;
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && !report && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "18px",
                  backgroundColor: "rgba(124,111,224,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div
                    className="spin"
                    style={{
                      width: "26px", height: "26px", borderRadius: "50%",
                      border: "2.5px solid rgba(124,111,224,0.2)",
                      borderTopColor: "#7C6FE0",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: textPrimary, letterSpacing: "-0.01em" }}>
                    Agents are working
                  </p>
                  <p style={{ fontSize: "12px", color: textSecondary, marginTop: "4px" }}>
                    Searching, reading and verifying sources — this takes 1–2 min
                  </p>
                </div>
                <div style={{
                  padding: "10px 18px", borderRadius: "20px",
                  backgroundColor: "rgba(124,111,224,0.08)",
                  border: "1px solid rgba(124,111,224,0.15)",
                }}>
                  <p style={{ fontSize: "12px", color: "#a78bfa", fontWeight: 500 }}>
                    {elapsed}s elapsed
                  </p>
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "18px",
                  backgroundColor: "rgba(239,68,68,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px",
                }}>
                  ⚠️
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#f87171" }}>
                    Something went wrong
                  </p>
                  <p style={{ fontSize: "12px", color: textSecondary, marginTop: "4px", maxWidth: "320px" }}>
                    {error}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  style={{
                    fontSize: "12px", fontWeight: 600, padding: "8px 18px",
                    borderRadius: "8px", border: "none", cursor: "pointer",
                    backgroundColor: "#7C6FE0", color: "white", fontFamily: "inherit",
                  }}
                >
                  Try again
                </button>
              </div>
            )}

            {/* Report */}
            {report && (
              <ReportDisplay
                report={report}
                sourcesCount={sourcesCount}
                elapsed={elapsed}
                dark={dark}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
const AGENTS = [
  { key: "planner", label: "Planner", icon: "◆", desc: "Breaking topic into subtasks" },
  { key: "searcher", label: "Searcher", icon: "◎", desc: "Finding relevant sources" },
  { key: "reader", label: "Reader", icon: "▤", desc: "Extracting key content" },
  { key: "fact_checker", label: "Fact Checker", icon: "◉", desc: "Verifying claims" },
  { key: "writer", label: "Writer", icon: "✦", desc: "Writing final report" },
];

export default function AgentTracker({ currentAgent, completedAgents, dark }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {AGENTS.map((agent, index) => {
        const isDone = completedAgents.includes(agent.key);
        const isRunning = currentAgent === agent.key;
        const isWaiting = !isDone && !isRunning;

        return (
          <div
            key={agent.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "10px",
              border: `1px solid ${
                isDone
                  ? dark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.25)"
                  : isRunning
                  ? dark ? "rgba(124,111,224,0.4)" : "rgba(124,111,224,0.3)"
                  : dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
              }`,
              backgroundColor: isDone
                ? dark ? "rgba(34,197,94,0.06)" : "rgba(34,197,94,0.05)"
                : isRunning
                ? dark ? "rgba(124,111,224,0.1)" : "rgba(124,111,224,0.06)"
                : "transparent",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              className={isRunning ? "pulse-ring" : ""}
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                flexShrink: 0,
                backgroundColor: isDone
                  ? "#22c55e"
                  : isRunning
                  ? "#7C6FE0"
                  : dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                transition: "background-color 0.3s",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: "12px",
                fontWeight: 500,
                color: isDone
                  ? dark ? "#4ade80" : "#16a34a"
                  : isRunning
                  ? dark ? "#a78bfa" : "#6d28d9"
                  : dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)",
                transition: "color 0.3s",
              }}>
                {agent.label}
              </p>
            </div>
            <span style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.02em",
              color: isDone
                ? dark ? "#4ade80" : "#16a34a"
                : isRunning
                ? dark ? "#a78bfa" : "#7c3aed"
                : dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
            }}>
              {isDone ? "Done" : isRunning ? "Running" : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
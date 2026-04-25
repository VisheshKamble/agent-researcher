const AGENTS = [
  { key: "planner", label: "Planner" },
  { key: "searcher", label: "Searcher" },
  { key: "reader", label: "Reader" },
  { key: "fact_checker", label: "Fact Checker" },
  { key: "writer", label: "Writer" },
];

export default function AgentTracker({ currentAgent, completedAgents, dark }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {AGENTS.map((agent) => {
        const isDone = completedAgents.includes(agent.key);
        const isRunning = currentAgent === agent.key;

        const bg = isDone
          ? dark ? "rgba(20,83,45,0.3)" : "rgba(240,253,244,1)"
          : isRunning
          ? dark ? "rgba(76,29,149,0.3)" : "rgba(245,243,255,1)"
          : dark ? "#27272a" : "#f9fafb";

        const border = isDone
          ? dark ? "#166534" : "#bbf7d0"
          : isRunning
          ? dark ? "#6d28d9" : "#ddd6fe"
          : dark ? "#3f3f46" : "#e5e7eb";

        const dotColor = isDone ? "#22c55e" : isRunning ? "#7F77DD" : dark ? "#52525b" : "#d1d5db";
        const textColor = isDone
          ? dark ? "#4ade80" : "#16a34a"
          : isRunning
          ? dark ? "#a78bfa" : "#7c3aed"
          : dark ? "#52525b" : "#9ca3af";

        return (
          <div
            key={agent.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              borderRadius: "12px",
              border: `1px solid ${border}`,
              backgroundColor: bg,
              transition: "all 0.3s",
            }}
          >
            <div
              className={isRunning ? "pulse-dot" : ""}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: dotColor,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "12px", color: textColor, flex: 1 }}>{agent.label}</span>
            <span style={{ fontSize: "11px", color: textColor }}>
              {isDone ? "Done ✓" : isRunning ? "Running..." : "Waiting"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

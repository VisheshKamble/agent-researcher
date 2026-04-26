const AGENTS = [
  { key:"planner", label:"Planner", desc:"Planning subtasks" },
  { key:"searcher", label:"Searcher", desc:"Finding sources" },
  { key:"reader", label:"Reader", desc:"Reading content" },
  { key:"fact_checker", label:"Fact Checker", desc:"Verifying facts" },
  { key:"writer", label:"Writer", desc:"Writing report" },
];

export default function AgentTracker({ currentAgent, completedAgents, dark }) {
  const accentBg = dark ? "rgba(108,71,255,0.12)" : "#f3f0ff";
  const accentBorder = dark ? "rgba(108,71,255,0.3)" : "#c4b5fd";
  const greenBg = dark ? "rgba(34,197,94,0.08)" : "#f0fdf4";
  const greenBorder = dark ? "rgba(34,197,94,0.2)" : "#bbf7d0";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
      {AGENTS.map(agent => {
        const isDone = completedAgents.includes(agent.key);
        const isRunning = currentAgent === agent.key;
        return (
          <div key={agent.key} style={{
            display:"flex", alignItems:"center", gap:"9px",
            padding:"8px 10px", borderRadius:"9px",
            border:`1px solid ${isDone?greenBorder:isRunning?accentBorder:dark?"rgba(255,255,255,0.06)":"#e4e4e7"}`,
            background:isDone?greenBg:isRunning?accentBg:"transparent",
            transition:"all 0.3s",
          }}>
            <div className={isRunning?"pulse-ring":""} style={{
              width:"7px", height:"7px", borderRadius:"50%", flexShrink:0,
              background:isDone?"#22c55e":isRunning?"#6c47ff":dark?"rgba(255,255,255,0.15)":"#d4d4d8",
              transition:"background 0.3s",
            }} />
            <span style={{ fontSize:"12px", fontWeight:600, flex:1, color:isDone?(dark?"#4ade80":"#16a34a"):isRunning?(dark?"#a78bfa":"#6c47ff"):dark?"rgba(255,255,255,0.3)":"#a1a1aa" }}>
              {agent.label}
            </span>
            <span style={{ fontSize:"10px", fontWeight:600, color:isDone?(dark?"#4ade80":"#16a34a"):isRunning?(dark?"#a78bfa":"#6c47ff"):dark?"rgba(255,255,255,0.2)":"#d4d4d8" }}>
              {isDone?"Done ✓":isRunning?"Running...":"—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
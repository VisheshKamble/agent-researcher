import ReactMarkdown from "react-markdown";

export default function ReportDisplay({ report, sourcesCount, elapsed, dark }) {
  const handleDownload = () => {
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "research-report.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fade-up"
      style={{ height: "100%", display: "flex", flexDirection: "column", gap: "14px" }}
    >
      {/* Report header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e",
            boxShadow: "0 0 8px rgba(34,197,94,0.5)"
          }} />
          <span style={{
            fontSize: "13px", fontWeight: 500,
            color: dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)"
          }}>
            Report complete
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{
              fontSize: "11px", padding: "2px 8px", borderRadius: "20px", fontWeight: 500,
              backgroundColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
              border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
            }}>
              {sourcesCount} sources
            </span>
            <span style={{
              fontSize: "11px", padding: "2px 8px", borderRadius: "20px", fontWeight: 500,
              backgroundColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
              border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
            }}>
              {elapsed}s
            </span>
          </div>
        </div>
        <button
          onClick={handleDownload}
          style={{
            fontSize: "12px", fontWeight: 500,
            padding: "6px 14px", borderRadius: "8px", cursor: "pointer",
            border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            backgroundColor: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.target.style.backgroundColor = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)";
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
          }}
        >
          ↓ Export
        </button>
      </div>

      {/* Report content */}
      <div
        className="scrollbar-hide"
        style={{
          flex: 1, overflowY: "auto",
          borderRadius: "14px",
          border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
          backgroundColor: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
          padding: "24px 28px",
        }}
      >
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 style={{
                fontSize: "1.3rem", fontWeight: 600, letterSpacing: "-0.02em",
                color: dark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.88)",
                marginBottom: "16px", paddingBottom: "12px",
                borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
              }}>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 style={{
                fontSize: "0.95rem", fontWeight: 600, letterSpacing: "-0.01em",
                color: dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.8)",
                marginTop: "24px", marginBottom: "8px",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <span style={{
                  width: "3px", height: "14px", borderRadius: "2px",
                  backgroundColor: "#7C6FE0", display: "inline-block", flexShrink: 0,
                }} />
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p style={{
                fontSize: "13px", lineHeight: 1.8,
                color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
                marginBottom: "10px",
              }}>
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul style={{ paddingLeft: "18px", marginBottom: "10px" }}>{children}</ul>
            ),
            li: ({ children }) => (
              <li style={{
                fontSize: "13px", lineHeight: 1.75,
                color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
                marginBottom: "4px",
              }}>
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong style={{
                fontWeight: 600,
                color: dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.75)",
              }}>
                {children}
              </strong>
            ),
            hr: () => (
              <hr style={{
                border: "none",
                borderTop: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                margin: "20px 0",
              }} />
            ),
            code: ({ children }) => (
              <code style={{
                fontSize: "12px", fontFamily: "monospace",
                padding: "1px 6px", borderRadius: "4px",
                backgroundColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)",
              }}>
                {children}
              </code>
            ),
          }}
        >
          {report}
        </ReactMarkdown>
      </div>
    </div>
  );
}
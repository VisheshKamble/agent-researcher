import ReactMarkdown from "react-markdown";


// The duplicate export has been removed.

export default function ReportDisplay({ report, sourcesCount, dark }) {
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
    <div className="fade-in" style={{ height: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <span className={`text-sm font-medium ${dark ? "text-zinc-300" : "text-zinc-700"}`}>
            Report ready
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            dark ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-500"
          }`}>
            {sourcesCount} sources
          </span>
        </div>
        <button
          onClick={handleDownload}
          className={`
            flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all
            ${dark
              ? "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
              : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }
          `}
        >
          ↓ Download
        </button>
      </div>

      <div className={`
        flex-1 overflow-y-auto scrollbar-hide rounded-xl border p-5
        ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}
      `}>
        <div className={`prose max-w-none ${dark ? "dark" : "light"}`}>
          <ReactMarkdown>{report}</ReactMarkdown>
        </div>
      </div>
    </div>
  );

import ReactMarkdown from "react-markdown";

export default function ReportDisplay({ report, sourcesCount, dark }) {
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
    <div className="fade-in" style={{ height: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
          <span style={{ fontSize: "13px", fontWeight: 500, color: dark ? "#d4d4d8" : "#3f3f46" }}>
            Report ready
          </span>
          <span style={{
            fontSize: "11px",
            padding: "2px 8px",
            borderRadius: "20px",
            backgroundColor: dark ? "#27272a" : "#f3f4f6",
            color: dark ? "#71717a" : "#6b7280",
          }}>
            {sourcesCount} sources
          </span>
        </div>
        <button
          onClick={handleDownload}
          style={{
            fontSize: "12px",
            padding: "5px 14px",
            borderRadius: "10px",
            border: `1px solid ${dark ? "#3f3f46" : "#e5e7eb"}`,
            backgroundColor: "transparent",
            color: dark ? "#71717a" : "#6b7280",
            cursor: "pointer",
          }}
        >
          ↓ Download
        </button>
      </div>

      <div
        className="scrollbar-hide"
        style={{
          flex: 1,
          overflowY: "auto",
          borderRadius: "16px",
          border: `1px solid ${dark ? "#27272a" : "#e5e7eb"}`,
          backgroundColor: dark ? "#18181b" : "#ffffff",
          padding: "20px 24px",
        }}
      >
        <div style={{ maxWidth: "100%" }}>
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: dark ? "#f4f4f5" : "#09090b", marginBottom: "12px" }}>{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 style={{ fontSize: "1rem", fontWeight: 600, color: dark ? "#e4e4e7" : "#18181b", marginTop: "20px", marginBottom: "8px", paddingBottom: "4px", borderBottom: `1px solid ${dark ? "#27272a" : "#f3f4f6"}` }}>{children}</h2>
              ),
              p: ({ children }) => (
                <p style={{ fontSize: "13px", lineHeight: 1.75, color: dark ? "#a1a1aa" : "#52525b", marginBottom: "10px" }}>{children}</p>
              ),
              ul: ({ children }) => (
                <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>{children}</ul>
              ),
              li: ({ children }) => (
                <li style={{ fontSize: "13px", lineHeight: 1.7, color: dark ? "#a1a1aa" : "#52525b", marginBottom: "4px" }}>{children}</li>
              ),
              strong: ({ children }) => (
                <strong style={{ fontWeight: 600, color: dark ? "#d4d4d8" : "#27272a" }}>{children}</strong>
              ),
              hr: () => (
                <hr style={{ border: "none", borderTop: `1px solid ${dark ? "#27272a" : "#f3f4f6"}`, margin: "16px 0" }} />
              ),
            }}
          >
            {report}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
}
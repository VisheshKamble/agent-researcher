import ReactMarkdown from "react-markdown";

export default function ReportDisplay({ report, sourcesCount, elapsed, dark }) {
  const handleDownload = () => {
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "research-report.md"; a.click();
    URL.revokeObjectURL(url);
  };

  const D = {
    text: dark ? "rgba(255,255,255,0.88)" : "#0f0f10",
    text2: dark ? "rgba(255,255,255,0.45)" : "#52525b",
    border: dark ? "rgba(255,255,255,0.08)" : "#e4e4e7",
    codeBg: dark ? "rgba(255,255,255,0.06)" : "#f3f0ff",
    reportBg: dark ? "rgba(255,255,255,0.02)" : "#fafafa",
    headingBorder: dark ? "rgba(255,255,255,0.07)" : "#f4f4f5",
  };

  return (
    <div className="fade-up" style={{ height:"100%", display:"flex", flexDirection:"column", gap:"12px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px rgba(34,197,94,0.5)" }} />
          <span style={{ fontSize:"13px", fontWeight:700, color:D.text }}>Report complete</span>
          <span style={{ fontSize:"11px", fontWeight:600, padding:"2px 9px", borderRadius:"20px", background:dark?"rgba(108,71,255,0.12)":"#f3f0ff", color:"#6c47ff", border:`1px solid ${dark?"rgba(108,71,255,0.3)":"#c4b5fd"}` }}>{sourcesCount} sources</span>
          <span style={{ fontSize:"11px", fontWeight:600, padding:"2px 9px", borderRadius:"20px", background:dark?"rgba(108,71,255,0.12)":"#f3f0ff", color:"#6c47ff", border:`1px solid ${dark?"rgba(108,71,255,0.3)":"#c4b5fd"}` }}>{elapsed}s</span>
        </div>
        <button onClick={handleDownload}
          style={{ fontSize:"12px", fontWeight:600, padding:"6px 14px", borderRadius:"8px", border:`1px solid ${D.border}`, background:"transparent", color:D.text2, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s" }}
          onMouseEnter={e=>{e.target.style.borderColor="#6c47ff";e.target.style.color="#6c47ff";}}
          onMouseLeave={e=>{e.target.style.borderColor=D.border;e.target.style.color=D.text2;}}>
          ↓ Export
        </button>
      </div>

      <div className="scrollbar-hide" style={{ flex:1, overflowY:"auto", borderRadius:"12px", border:`1px solid ${D.border}`, background:D.reportBg, padding:"22px 26px" }}>
        <ReactMarkdown components={{
          h1: ({children}) => <h1 style={{ fontSize:"1.25rem", fontWeight:800, color:D.text, marginBottom:"14px", paddingBottom:"10px", borderBottom:`1px solid ${D.headingBorder}`, letterSpacing:"-0.02em" }}>{children}</h1>,
          h2: ({children}) => (
            <h2 style={{ fontSize:"0.95rem", fontWeight:700, color:D.text, marginTop:"22px", marginBottom:"8px", display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ width:"3px", height:"14px", borderRadius:"2px", background:"#6c47ff", display:"inline-block", flexShrink:0 }} />
              {children}
            </h2>
          ),
          p: ({children}) => <p style={{ fontSize:"13px", lineHeight:1.8, color:D.text2, marginBottom:"10px" }}>{children}</p>,
          ul: ({children}) => <ul style={{ paddingLeft:"18px", marginBottom:"10px" }}>{children}</ul>,
          li: ({children}) => <li style={{ fontSize:"13px", lineHeight:1.75, color:D.text2, marginBottom:"4px" }}>{children}</li>,
          strong: ({children}) => <strong style={{ fontWeight:700, color:D.text }}>{children}</strong>,
          hr: () => <hr style={{ border:"none", borderTop:`1px solid ${D.headingBorder}`, margin:"18px 0" }} />,
          code: ({children}) => <code style={{ fontSize:"12px", fontFamily:"monospace", padding:"1px 6px", borderRadius:"4px", background:D.codeBg, color:"#6c47ff" }}>{children}</code>,
        }}>
          {report}
        </ReactMarkdown>
      </div>
    </div>
  );
}
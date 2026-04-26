import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000";
const AGENT_ORDER = ["planner", "searcher", "reader", "fact_checker", "writer"];
const AGENT_TIMES = { planner: 5000, searcher: 20000, reader: 35000, fact_checker: 20000, writer: 15000 };

const SUGGESTIONS = [
  { label: "Agentic AI in 2025",            sub: "AI & Machine Learning" },
  { label: "Quantum computing breakthroughs", sub: "Physics & Technology" },
  { label: "Future of fintech in India",     sub: "Finance & Economy" },
  { label: "LLM trends & architectures",     sub: "Deep Learning" },
];

// ── All SVG Icons ──────────────────────────────────────────────────────────
const SVG = {
  brain: (c = "currentColor", s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.1-1.98Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.1-1.98Z"/>
    </svg>
  ),
  search: (c = "currentColor", s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  book: (c = "currentColor", s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
    </svg>
  ),
  shield: (c = "currentColor", s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  pen: (c = "currentColor", s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
    </svg>
  ),
  arrowLeft: (c = "currentColor", s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  ),
  check: (c = "currentColor", s = 11) => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 7l3 3 6-6"/>
    </svg>
  ),
  copy: (c = "currentColor", s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  doc: (c = "currentColor", s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  ),
  warning: (c = "#dc2626", s = 26) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4M12 17h.01"/>
    </svg>
  ),
  sparkle: (c = "currentColor", s = 30) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
  globe: (c = "currentColor", s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  zap: (c = "currentColor", s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  chevron: (c = "currentColor", s = 11) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  ),
  reset: (c = "currentColor", s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  ),
  // NEW: PDF download icon
  pdf: (c = "currentColor", s = 13) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M8 13h2.5a1.5 1.5 0 0 1 0 3H8v-3zM8 16v2"/>
      <path d="M13 13v5M13 13h2a1.5 1.5 0 0 1 0 3h-2"/>
      <path d="M17 13h1.5a1.5 1.5 0 0 1 1.5 1.5v0a1.5 1.5 0 0 1-1.5 1.5H17v-3zM17 18h2"/>
    </svg>
  ),
};

const AGENT_META = {
  planner:      { icon: SVG.brain,  label: "Planner",      color: "#7c3aed", bg: "rgba(124,58,237,.08)", desc: "Breaking topic into subtasks" },
  searcher:     { icon: SVG.search, label: "Searcher",     color: "#2563eb", bg: "rgba(37,99,235,.08)",  desc: "Querying Tavily + ArXiv" },
  reader:       { icon: SVG.book,   label: "Reader",       color: "#0891b2", bg: "rgba(8,145,178,.08)",  desc: "Scraping & extracting facts" },
  fact_checker: { icon: SVG.shield, label: "Fact Checker", color: "#059669", bg: "rgba(5,150,105,.08)",  desc: "Cross-verifying claims" },
  writer:       { icon: SVG.pen,    label: "Writer",       color: "#d97706", bg: "rgba(217,119,6,.08)",  desc: "Writing final report" },
};

const SUGGESTION_ICONS = [SVG.brain, SVG.sparkle, SVG.globe, SVG.zap];

// ── Markdown → clean HTML renderer ─────────────────────────────────────────
function renderMarkdown(raw) {
  if (!raw) return "";
  let html = raw
    // Escape existing html to avoid XSS (basic)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // Headings
    .replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>")
    // Bold / italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Blockquote
    .replace(/^&gt;\s+(.+)$/gm, "<blockquote>$1</blockquote>")
    // Unordered list items  (- or *)
    .replace(/^[\-\*]\s+(.+)$/gm, "<li>$1</li>")
    // Ordered list items
    .replace(/^\d+\.\s+(.+)$/gm, "<oli>$1</oli>")
    // Horizontal rule
    .replace(/^---+$/gm, "<hr/>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*?<\/li>\n?)+/gs, m => `<ul>${m}</ul>`);
  // Wrap consecutive <oli> in <ol>
  html = html.replace(/(<oli>.*?<\/oli>\n?)+/gs, m => `<ol>${m.replace(/<\/?oli>/g, m2 => m2.replace("oli","li"))}</ol>`);

  // Paragraphs: wrap non-block lines
  const blockTags = /^<(h[1-3]|ul|ol|li|blockquote|hr|pre|div)/;
  html = html
    .split("\n")
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (blockTags.test(trimmed)) return trimmed;
      return `<p>${trimmed}</p>`;
    })
    .join("\n");

  return html;
}

// ── PDF export via browser print ────────────────────────────────────────────
function exportToPDF(topic, reportHTML, sourcesCount, elapsed) {
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const printContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Research Report – ${topic}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

    @page{
      size: A4;
      margin: 18mm 20mm 20mm 20mm;
    }

    body{
      font-family: 'DM Sans', -apple-system, sans-serif;
      font-size: 10.5pt;
      line-height: 1.75;
      color: #1a1a1a;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Cover header ── */
    .cover-header{
      border-bottom: 2px solid #0a0a0a;
      padding-bottom: 16pt;
      margin-bottom: 22pt;
      page-break-after: avoid;
    }
    .brand-row{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18pt;
    }
    .brand-badge{
      display: inline-flex;
      align-items: center;
      gap: 7pt;
      font-size: 8pt;
      font-family: 'DM Mono', monospace;
      font-weight: 500;
      color: #52525b;
      letter-spacing: .04em;
      text-transform: uppercase;
    }
    .brand-dot{
      width: 28pt;
      height: 28pt;
      border-radius: 7pt;
      background: #0a0a0a;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 8pt;
      font-weight: 700;
      letter-spacing: .06em;
      flex-shrink: 0;
    }
    .meta-row{
      display: flex;
      align-items: center;
      gap: 12pt;
      flex-wrap: wrap;
    }
    .meta-chip{
      padding: 3pt 9pt;
      border-radius: 100pt;
      font-size: 7.5pt;
      font-weight: 600;
      font-family: 'DM Mono', monospace;
      letter-spacing: .03em;
      border: 1pt solid;
    }
    .chip-purple{ color:#6d28d9; background:#faf5ff; border-color:#ddd6fe; }
    .chip-green{  color:#15803d; background:#f0fdf4; border-color:#bbf7d0; }
    .chip-amber{  color:#b45309; background:#fffbeb; border-color:#fde68a; }

    .report-title{
      font-size: 21pt;
      font-weight: 900;
      letter-spacing: -.045em;
      line-height: 1.15;
      color: #0a0a0a;
      margin: 12pt 0 8pt;
    }
    .title-rule{
      height: 1pt;
      background: linear-gradient(90deg, rgba(124,58,237,.3), #e8e8e8 40%, transparent);
      margin-top: 14pt;
    }

    /* ── Report body ── */
    h1{
      font-size: 15pt;
      font-weight: 800;
      color: #0a0a0a;
      letter-spacing: -.03em;
      margin: 0 0 9pt;
      padding-bottom: 8pt;
      border-bottom: 1pt solid #e8e8e8;
      page-break-after: avoid;
    }
    h2{
      font-size: 12pt;
      font-weight: 700;
      color: #0a0a0a;
      letter-spacing: -.022em;
      margin: 22pt 0 7pt;
      padding-bottom: 5pt;
      border-bottom: 1pt solid #f0f0f0;
      page-break-after: avoid;
    }
    h3{
      font-size: 11pt;
      font-weight: 700;
      color: #111;
      letter-spacing: -.018em;
      margin: 14pt 0 5pt;
      page-break-after: avoid;
    }
    p{
      font-size: 10.5pt;
      line-height: 1.80;
      color: #2d2d2d;
      margin-bottom: 10pt;
    }
    ul, ol{
      padding-left: 16pt;
      margin-bottom: 10pt;
    }
    li{
      font-size: 10.5pt;
      line-height: 1.76;
      color: #2d2d2d;
      margin-bottom: 3pt;
    }
    strong{ color: #0a0a0a; font-weight: 700; }
    em{ font-style: italic; }
    a{
      color: #6d28d9;
      text-decoration: none;
      border-bottom: 0.5pt solid #c4b5fd;
    }
    blockquote{
      border-left: 2pt solid #ddd6fe;
      padding: 2pt 0 2pt 12pt;
      color: #52525b;
      font-style: italic;
      margin: 10pt 0;
    }
    code{
      font-family: 'DM Mono', monospace;
      font-size: 8.5pt;
      background: #f5f5f5;
      padding: 1.5pt 4pt;
      border-radius: 3pt;
      color: #7c3aed;
    }
    hr{
      border: none;
      border-top: 1pt solid #f0f0f0;
      margin: 18pt 0;
    }

    /* ── Footer ── */
    .pdf-footer{
      margin-top: 28pt;
      padding-top: 10pt;
      border-top: 1pt solid #e8e8e8;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .pdf-footer p{
      font-size: 7.5pt;
      color: #a1a1aa;
      font-family: 'DM Mono', monospace;
      margin: 0;
    }

    /* ── Print-specific ── */
    @media print{
      body{ background: #fff !important; }
      a{ color: #6d28d9 !important; }
      .no-print{ display: none !important; }
      h2, h3{ page-break-after: avoid; }
      p, li{ orphans: 3; widows: 3; }
      blockquote{ page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <!-- Cover Header -->
  <div class="cover-header">
    <div class="brand-row">
      <div class="brand-badge">
        <span class="brand-dot">AR</span>
        Agent Researcher &nbsp;·&nbsp; Groq · LangGraph · Tavily
      </div>
      <div style="font-family:'DM Mono',monospace;font-size:7.5pt;color:#a1a1aa;">${date}</div>
    </div>

    <div class="meta-row" style="margin-bottom:10pt;">
      <span class="meta-chip chip-purple">✦ Research complete</span>
      <span class="meta-chip chip-green">${sourcesCount} sources</span>
      <span class="meta-chip chip-amber">${elapsed}s · 5 agents</span>
    </div>

    <h1 class="report-title">${topic.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</h1>
    <div class="title-rule"></div>
  </div>

  <!-- Report Body -->
  <div class="report-body">
    ${reportHTML}
  </div>

  <!-- Footer -->
  <div class="pdf-footer">
    <p>Generated by Agent Researcher &nbsp;·&nbsp; Groq · LangGraph · Tavily</p>
    <p>${date} &nbsp;·&nbsp; ${sourcesCount} sources &nbsp;·&nbsp; ${elapsed}s</p>
  </div>

</body>
</html>`;

  // Open a new window, write the content, then trigger print
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) {
    alert("Please allow pop-ups for this site to export the PDF.");
    return;
  }
  win.document.open();
  win.document.write(printContent);
  win.document.close();

  // Wait for fonts/styles to load before printing
  win.onload = () => {
    setTimeout(() => {
      win.focus();
      win.print();
      // Close window after print dialog is dismissed
      win.onafterprint = () => win.close();
    }, 600);
  };
}

export default function AppPage() {
  const navigate = useNavigate();
  const [topic, setTopic]                     = useState("");
  const [depth, setDepth]                     = useState("standard");
  const [loading, setLoading]                 = useState(false);
  const [currentAgent, setCurrentAgent]       = useState(null);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [report, setReport]                   = useState(null);
  const [sourcesCount, setSourcesCount]       = useState(0);
  const [error, setError]                     = useState(null);
  const [elapsed, setElapsed]                 = useState(0);
  const [startTime, setStartTime]             = useState(null);
  const [copied, setCopied]                   = useState(false);
  const [pdfExporting, setPdfExporting]       = useState(false);
  const textareaRef = useRef(null);
  const reportRef   = useRef(null);

  useEffect(() => {
    let t;
    if (loading && startTime)
      t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [loading, startTime]);

  const simulateAgentProgress = async () => {
    for (const agent of AGENT_ORDER) {
      setCurrentAgent(agent);
      await new Promise(r => setTimeout(r, AGENT_TIMES[agent]));
      setCompletedAgents(p => [...p, agent]);
    }
  };

  const handleResearch = async () => {
    if (!topic.trim()) return;
    setLoading(true); setReport(null); setError(null);
    setCompletedAgents([]); setCurrentAgent(null);
    setStartTime(Date.now()); setElapsed(0);
    simulateAgentProgress();
    try {
      const res = await axios.post(`${API_URL}/research`, { topic: topic.trim(), depth });
      setReport(res.data.report); setSourcesCount(res.data.sources_count);
      setCurrentAgent(null); setCompletedAgents(AGENT_ORDER);
    } catch {
      setError("Could not connect to backend. Make sure uvicorn is running on port 8000.");
      setCurrentAgent(null);
    } finally { setLoading(false); }
  };

  const handleReset = () => {
    setReport(null); setTopic(""); setCompletedAgents([]);
    setCurrentAgent(null); setError(null); setElapsed(0); setStartTime(null);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !loading && topic.trim()) handleResearch();
  };

  const handleCopy = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── PDF Export handler ───────────────────────────────────────────────────
  const handleExportPDF = () => {
    if (!report) return;
    setPdfExporting(true);
    try {
      const renderedHTML = renderMarkdown(report);
      exportToPDF(topic, renderedHTML, sourcesCount, elapsed);
    } finally {
      // Brief delay so button feedback is visible
      setTimeout(() => setPdfExporting(false), 1200);
    }
  };

  const progress    = (completedAgents.length / AGENT_ORDER.length) * 100;
  const currentMeta = currentAgent ? AGENT_META[currentAgent] : null;

  // Pre-rendered HTML for the report body
  const reportHTML = report ? renderMarkdown(report) : "";

  return (
    <div style={{ background: "#f5f5f5", color: "#0a0a0a", minHeight: "100vh", fontFamily: "'DM Sans',-apple-system,sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

        @keyframes spin      {to{transform:rotate(360deg)}}
        @keyframes blink     {0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeUp    {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn   {from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
        @keyframes shimmer   {0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
        @keyframes orbBreath {0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0),0 8px 32px rgba(0,0,0,.08)}
                              50%{box-shadow:0 0 36px 6px rgba(124,58,237,.14),0 8px 32px rgba(0,0,0,.08)}}

        .spin      {animation:spin .72s linear infinite}
        .blink-dot {animation:blink 2s ease-in-out infinite}
        .fade-up   {animation:fadeUp .48s cubic-bezier(.16,1,.3,1) both}
        .slide-in  {animation:slideIn .3s cubic-bezier(.16,1,.3,1) both}
        .orb-breath{animation:orbBreath 2.8s ease-in-out infinite}

        textarea:focus{outline:none}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(0,0,0,.1);border-radius:3px}

        .depth-pill{
          flex:1;padding:7.5px 0;font-size:11.5px;font-weight:600;border-radius:8px;
          cursor:pointer;transition:all .17s;text-transform:capitalize;
          font-family:inherit;border:none;letter-spacing:.005em;
        }
        .agent-row{
          display:flex;align-items:center;gap:9px;padding:9px 11px;
          border-radius:11px;margin-bottom:3px;transition:background .25s,border .25s;
          border:1px solid transparent;cursor:default;
        }
        .run-btn{
          width:100%;padding:11px;font-size:13px;font-weight:700;border-radius:11px;
          border:none;cursor:pointer;font-family:inherit;letter-spacing:-.02em;
          transition:transform .18s,box-shadow .18s,background .18s;
        }
        .run-btn:disabled{cursor:not-allowed;opacity:.38}
        .run-btn:not(:disabled):hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(0,0,0,.2)}
        .action-btn{
          display:inline-flex;align-items:center;gap:6px;padding:6px 14px;
          border-radius:100px;font-size:11.5px;font-weight:600;cursor:pointer;
          font-family:inherit;border:1.5px solid #e5e5e5;background:#fff;color:#52525b;
          transition:border-color .17s,color .17s,transform .17s;letter-spacing:-.01em;
        }
        .action-btn:hover{border-color:#0a0a0a;color:#0a0a0a;transform:translateY(-1px)}
        .action-btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important}
        .suggestion-card{
          display:flex;align-items:flex-start;gap:11px;padding:14px 15px;
          border-radius:13px;background:#fff;border:1.5px solid #ebebeb;cursor:pointer;
          font-family:inherit;text-align:left;box-shadow:0 1px 3px rgba(0,0,0,.04);
          transition:border-color .18s,transform .18s,box-shadow .18s;
        }
        .suggestion-card:hover{border-color:#c4b5fd;transform:translateY(-2px);box-shadow:0 8px 26px rgba(124,58,237,.1)}
        .tag-chip{
          padding:4px 11px;border-radius:100px;font-size:11px;font-weight:500;
          background:#fff;color:#71717a;border:1.5px solid #e5e5e5;
          cursor:pointer;font-family:inherit;transition:all .17s;white-space:nowrap;
        }
        .tag-chip:hover{border-color:#7c3aed;color:#7c3aed;background:#faf5ff}

        /* ── Report typography (screen) ── */
        .rb h1{font-size:18px;font-weight:800;color:#0a0a0a;letter-spacing:-.03em;margin:0 0 10px;padding-bottom:10px;border-bottom:1px solid #f0f0f0}
        .rb h2{font-size:14.5px;font-weight:700;color:#0a0a0a;letter-spacing:-.022em;margin:28px 0 9px;padding-bottom:8px;border-bottom:1px solid #f4f4f4}
        .rb h3{font-size:13.5px;font-weight:700;color:#111;letter-spacing:-.018em;margin:18px 0 7px}
        .rb p{font-size:14px;line-height:1.82;color:#404040;margin-bottom:13px}
        .rb ul,.rb ol{padding-left:18px;margin-bottom:13px}
        .rb li{font-size:14px;line-height:1.78;color:#404040;margin-bottom:4px}
        .rb strong{color:#111;font-weight:700}
        .rb a{color:#7c3aed;text-decoration:none;border-bottom:1px solid #ede9fe}
        .rb a:hover{border-bottom-color:#7c3aed}
        .rb blockquote{border-left:2px solid #ddd6fe;padding:2px 0 2px 14px;color:#6b7280;font-style:italic;margin:14px 0}
        .rb code{font-family:'DM Mono',monospace;font-size:12px;background:#f4f4f4;padding:2px 5px;border-radius:4px;color:#7c3aed}
        .rb hr{border:none;border-top:1px solid #f0f0f0;margin:20px 0}
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:"54px", background:"rgba(245,245,245,.93)", backdropFilter:"blur(24px) saturate(200%)", borderBottom:"1px solid rgba(0,0,0,.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <button onClick={() => navigate("/")}
            style={{ display:"flex", alignItems:"center", gap:"6px", padding:"5px 13px", borderRadius:"100px", background:"transparent", border:"1.5px solid #e5e5e5", cursor:"pointer", fontSize:"12.5px", fontWeight:500, color:"#52525b", fontFamily:"inherit", transition:"all .17s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#0a0a0a"; e.currentTarget.style.color="#0a0a0a"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#e5e5e5"; e.currentTarget.style.color="#52525b"; }}>
            {SVG.arrowLeft()} Home
          </button>
          <div style={{ width:"1px", height:"16px", background:"#e5e5e5" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"white", fontSize:"9.5px", fontWeight:700, fontFamily:"DM Mono,monospace", letterSpacing:".03em" }}>AR</span>
            </div>
            <div>
              <p style={{ fontSize:"13px", fontWeight:700, color:"#0a0a0a", letterSpacing:"-.025em", lineHeight:1.2 }}>Agent Researcher</p>
              <p style={{ fontSize:"9.5px", color:"#a1a1aa", fontFamily:"DM Mono,monospace", letterSpacing:".025em" }}>Groq · LangGraph · Tavily</p>
            </div>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
          {loading && (
            <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"4px 12px", borderRadius:"100px", background:"#faf5ff", border:"1.5px solid #ddd6fe" }}>
              <div className="spin" style={{ width:"9px", height:"9px", borderRadius:"50%", border:"1.5px solid #ddd6fe", borderTopColor:"#7c3aed" }}/>
              <span style={{ fontSize:"10.5px", fontWeight:600, color:"#7c3aed", fontFamily:"DM Mono,monospace" }}>{elapsed}s</span>
            </div>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:"5px", padding:"4px 12px", borderRadius:"100px", background:"#f0fdf4", border:"1.5px solid #dcfce7" }}>
            <span className="blink-dot" style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#22c55e", display:"inline-block" }}/>
            <span style={{ fontSize:"10.5px", fontWeight:600, color:"#16a34a" }}>Live</span>
          </div>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div style={{ paddingTop:"54px", display:"flex", height:"100vh" }}>

        {/* ══ SIDEBAR ══ */}
        <div style={{ width:"284px", flexShrink:0, borderRight:"1px solid #e8e8e8", background:"#fff", display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* Input */}
          <div style={{ padding:"20px 18px 16px", borderBottom:"1px solid #f0f0f0" }}>
            <p style={{ fontSize:"9.5px", fontWeight:700, color:"#a1a1aa", letterSpacing:".12em", textTransform:"uppercase", marginBottom:"8px" }}>Research topic</p>
            <textarea ref={textareaRef} value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="e.g. State of agentic AI in 2025…" disabled={loading} rows={4}
              style={{ width:"100%", resize:"none", fontSize:"13px", lineHeight:1.66, padding:"10px 11px", borderRadius:"10px", border:"1.5px solid #ebebeb", background:"#fafafa", color:"#0a0a0a", fontFamily:"inherit", opacity:loading?.45:1, transition:"border-color .17s" }}
              onFocus={e => e.target.style.borderColor="#7c3aed"}
              onBlur={e  => e.target.style.borderColor="#ebebeb"}
            />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:"6px" }}>
              <span style={{ fontSize:"9.5px", color:"#c4c4c4", fontFamily:"DM Mono,monospace" }}>⌘↵ to run</span>
              <span style={{ fontSize:"9.5px", color:"#d4d4d4", fontFamily:"DM Mono,monospace" }}>{topic.length}c</span>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"5px", marginTop:"10px" }}>
              {SUGGESTIONS.map(s => (
                <button key={s.label} className="tag-chip" onClick={() => setTopic(s.label)}>
                  {s.label.split(" ").slice(0,2).join(" ")}…
                </button>
              ))}
            </div>
          </div>

          {/* Depth */}
          <div style={{ padding:"14px 18px", borderBottom:"1px solid #f0f0f0" }}>
            <p style={{ fontSize:"9.5px", fontWeight:700, color:"#a1a1aa", letterSpacing:".12em", textTransform:"uppercase", marginBottom:"8px" }}>Depth</p>
            <div style={{ display:"flex", gap:"3px", background:"#f5f5f5", padding:"3px", borderRadius:"9px", border:"1px solid #ebebeb" }}>
              {["quick","standard","deep"].map(d => (
                <button key={d} className="depth-pill" onClick={() => !loading && setDepth(d)}
                  style={{ background:depth===d?"#fff":"transparent", color:depth===d?"#0a0a0a":"#a1a1aa", boxShadow:depth===d?"0 1px 4px rgba(0,0,0,.09)":"none", border:depth===d?"1px solid #e8e8e8":"1px solid transparent" }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Run */}
          <div style={{ padding:"13px 18px", borderBottom:"1px solid #f0f0f0" }}>
            <button className="run-btn" onClick={report ? handleReset : handleResearch} disabled={loading || (!topic.trim() && !report)}
              style={{ background:report?"#f5f5f5":loading?"rgba(124,58,237,.48)":"#0a0a0a", color:report?"#6b7280":"#fff" }}>
              {loading
                ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"7px" }}>
                    <div className="spin" style={{ width:"11px", height:"11px", borderRadius:"50%", border:"1.5px solid rgba(255,255,255,.25)", borderTopColor:"#fff" }}/>
                    Running · {elapsed}s
                  </span>
                : report
                  ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"7px" }}>{SVG.reset()} New research</span>
                  : "Run research →"}
            </button>
          </div>

          {/* Pipeline */}
          <div style={{ padding:"15px 18px", flex:1, overflowY:"auto" }}>
            <p style={{ fontSize:"9.5px", fontWeight:700, color:"#a1a1aa", letterSpacing:".12em", textTransform:"uppercase", marginBottom:"10px" }}>Pipeline</p>
            {AGENT_ORDER.map((key, i) => {
              const meta = AGENT_META[key];
              const isDone    = completedAgents.includes(key);
              const isCurrent = currentAgent === key;
              return (
                <div key={key} className={`agent-row${isCurrent?" slide-in":""}`}
                  style={{ background:isCurrent?meta.bg:isDone?"rgba(34,197,94,.06)":"transparent", border:`1px solid ${isCurrent?meta.color+"32":isDone?"rgba(34,197,94,.16)":"transparent"}` }}>
                  <div style={{ width:"27px", height:"27px", borderRadius:"8px", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:isCurrent?meta.bg:isDone?"rgba(34,197,94,.09)":"#f5f5f5", border:`1px solid ${isCurrent?meta.color+"26":isDone?"rgba(34,197,94,.2)":"#ebebeb"}`, transition:"all .25s" }}>
                    {isCurrent
                      ? <div className="spin" style={{ width:"11px", height:"11px", borderRadius:"50%", border:`1.5px solid ${meta.color}28`, borderTopColor:meta.color }}/>
                      : isDone
                        ? SVG.check("#22c55e", 11)
                        : meta.icon("#c8c8c8", 13)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:"11.5px", fontWeight:600, color:isCurrent?meta.color:isDone?"#16a34a":"#c4c4c4", letterSpacing:"-.01em", lineHeight:1.25 }}>{meta.label}</p>
                    <p style={{ fontSize:"9.5px", color:isCurrent?meta.color+"90":isDone?"#86efac":"#d4d4d4", fontFamily:"DM Mono,monospace", marginTop:"1px" }}>
                      {isCurrent?meta.desc:isDone?"Complete":"Waiting"}
                    </p>
                  </div>
                  <div style={{ width:"16px", height:"16px", borderRadius:"50%", background:isDone?"#22c55e":isCurrent?meta.color:"#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .28s" }}>
                    {isDone
                      ? SVG.check("#fff", 9)
                      : <span style={{ fontSize:"8px", fontWeight:700, color:isCurrent?"#fff":"#c4c4c4", fontFamily:"DM Mono,monospace" }}>{i+1}</span>}
                  </div>
                </div>
              );
            })}

            {/* Progress bar */}
            {(loading || completedAgents.length > 0) && (
              <div style={{ marginTop:"12px", padding:"11px 12px", borderRadius:"10px", background:"#fafafa", border:"1px solid #f0f0f0" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"7px" }}>
                  <span style={{ fontSize:"9.5px", color:"#a1a1aa", fontFamily:"DM Mono,monospace" }}>{completedAgents.length}/{AGENT_ORDER.length} agents</span>
                  <span style={{ fontSize:"9.5px", color:"#7c3aed", fontWeight:600, fontFamily:"DM Mono,monospace" }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ height:"3px", borderRadius:"3px", background:"#ebebeb", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:"3px", background:"linear-gradient(90deg,#7c3aed,#a78bfa)", width:`${progress}%`, transition:"width .9s cubic-bezier(.16,1,.3,1)", boxShadow:loading?"0 0 10px rgba(124,58,237,.55)":"none" }}/>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          {report && (
            <div style={{ padding:"13px 18px", borderTop:"1px solid #f0f0f0" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"6px" }}>
                {[{v:sourcesCount,l:"Sources",c:"#7c3aed"},{v:`${elapsed}s`,l:"Time",c:"#059669"},{v:"5",l:"Agents",c:"#d97706"}].map(s => (
                  <div key={s.l} style={{ padding:"9px 7px", borderRadius:"9px", background:"#fafafa", border:"1.5px solid #ebebeb", textAlign:"center" }}>
                    <p style={{ fontSize:"16px", fontWeight:800, color:s.c, letterSpacing:"-.04em", lineHeight:1 }}>{s.v}</p>
                    <p style={{ fontSize:"8.5px", color:"#a1a1aa", marginTop:"3px", fontWeight:600, letterSpacing:".05em", textTransform:"uppercase" }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", overflowY:"auto", background:"#f5f5f5" }}>

          {/* ─── Empty ─── */}
          {!loading && !report && !error && (
            <div className="fade-up" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 56px", minHeight:"calc(100vh - 54px)" }}>
              <div style={{ position:"relative", marginBottom:"32px" }}>
                <div style={{ width:"72px", height:"72px", borderRadius:"20px", background:"#fff", border:"1.5px solid #e8e8e8", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 28px rgba(0,0,0,.07)" }}>
                  {SVG.sparkle("#7c3aed", 30)}
                </div>
                {[["#7c3aed","-9px","auto","auto","-9px"],["#2563eb","-9px","auto","-9px","auto"],["#059669","auto","-9px","auto","-9px"],["#d97706","auto","-9px","-9px","auto"]].map(([c,t,b,l,r],i) => (
                  <div key={i} style={{ position:"absolute", width:"8px", height:"8px", borderRadius:"50%", background:c, top:t, bottom:b, left:l, right:r, opacity:.55, border:"2px solid #f5f5f5" }}/>
                ))}
              </div>

              <h2 style={{ fontSize:"28px", fontWeight:900, color:"#0a0a0a", letterSpacing:"-.048em", marginBottom:"9px", textAlign:"center" }}>Ready to research</h2>
              <p style={{ fontSize:"14.5px", color:"#6b7280", textAlign:"center", maxWidth:"350px", lineHeight:1.74, marginBottom:"44px" }}>
                Enter any topic and your 5-agent pipeline will search, read, verify and write a full report in ~90 seconds.
              </p>

              <div style={{ display:"flex", alignItems:"center", gap:"0", marginBottom:"44px", background:"#fff", border:"1.5px solid #e8e8e8", padding:"11px 14px", borderRadius:"14px", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
                {AGENT_ORDER.map((key, i) => {
                  const meta = AGENT_META[key];
                  return (
                    <div key={key} style={{ display:"flex", alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"5px", padding:"5px 11px", borderRadius:"8px", background:meta.bg, border:`1px solid ${meta.color}1e` }}>
                        {meta.icon(meta.color, 12)}
                        <span style={{ fontSize:"11px", color:meta.color, fontWeight:600, letterSpacing:"-.01em" }}>{meta.label}</span>
                      </div>
                      {i < AGENT_ORDER.length-1 && (
                        <div style={{ width:"18px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {SVG.chevron("#d4d4d4", 10)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"9px", width:"100%", maxWidth:"520px" }}>
                {SUGGESTIONS.map((s, i) => {
                  const Icon = SUGGESTION_ICONS[i];
                  return (
                    <button key={s.label} className="suggestion-card" onClick={() => setTopic(s.label)}>
                      <div style={{ width:"32px", height:"32px", borderRadius:"9px", background:"#f5f5f5", border:"1px solid #ebebeb", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {Icon("#7c3aed", 15)}
                      </div>
                      <div>
                        <p style={{ fontSize:"12.5px", fontWeight:600, color:"#0a0a0a", letterSpacing:"-.015em", lineHeight:1.35, marginBottom:"2px" }}>{s.label}</p>
                        <p style={{ fontSize:"10px", color:"#a1a1aa" }}>{s.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Loading ─── */}
          {loading && !report && (
            <div className="fade-up" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"26px", padding:"60px 56px", minHeight:"calc(100vh - 54px)" }}>
              <div style={{ position:"relative" }}>
                <div className="orb-breath" style={{ width:"84px", height:"84px", borderRadius:"24px", background:"#fff", border:"1.5px solid #e8e8e8", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", zIndex:1 }}>
                  {currentMeta && currentMeta.icon(currentMeta.color, 32)}
                </div>
                <div className="spin" style={{ position:"absolute", inset:"-11px", borderRadius:"35px", border:"1.5px solid transparent", borderTopColor:currentMeta?.color||"#7c3aed", borderRightColor:(currentMeta?.color||"#7c3aed")+"2a", zIndex:0 }}/>
                {currentMeta && (
                  <div style={{ position:"absolute", bottom:"-4px", right:"-4px", width:"15px", height:"15px", borderRadius:"50%", background:currentMeta.color, border:"2px solid #f5f5f5", zIndex:2 }}/>
                )}
              </div>

              <div style={{ textAlign:"center", maxWidth:"340px" }}>
                <p style={{ fontSize:"19px", fontWeight:800, color:"#0a0a0a", letterSpacing:"-.04em", marginBottom:"6px" }}>
                  {currentMeta ? `${currentMeta.label} is working` : "Initializing pipeline"}
                </p>
                <p style={{ fontSize:"13px", color:"#6b7280", lineHeight:1.72, marginBottom:"4px" }}>
                  {currentMeta?.desc || "Setting up the research pipeline"}
                </p>
                <span style={{ fontFamily:"DM Mono,monospace", fontSize:"10.5px", color:"#a1a1aa" }}>~90s total · {elapsed}s elapsed</span>
              </div>

              <div style={{ width:"300px" }}>
                <div style={{ height:"3px", borderRadius:"3px", background:"#e8e8e8", overflow:"hidden", marginBottom:"8px" }}>
                  <div style={{ height:"100%", borderRadius:"3px", background:"linear-gradient(90deg,#6d28d9,#a78bfa)", width:`${progress}%`, transition:"width 1s cubic-bezier(.16,1,.3,1)", boxShadow:"0 0 10px rgba(124,58,237,.5)" }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"10px", color:"#a1a1aa", fontFamily:"DM Mono,monospace" }}>{completedAgents.length}/{AGENT_ORDER.length} complete</span>
                  <span style={{ fontSize:"10px", color:"#7c3aed", fontWeight:600, fontFamily:"DM Mono,monospace" }}>{Math.round(progress)}%</span>
                </div>
              </div>

              <div style={{ display:"flex", gap:"5px", flexWrap:"wrap", justifyContent:"center", maxWidth:"540px" }}>
                {AGENT_ORDER.map(key => {
                  const meta    = AGENT_META[key];
                  const isDone  = completedAgents.includes(key);
                  const isCurr  = currentAgent === key;
                  return (
                    <div key={key} style={{ display:"flex", alignItems:"center", gap:"5px", padding:"5px 10px", borderRadius:"100px", background:isCurr?meta.bg:isDone?"rgba(34,197,94,.08)":"#fff", border:`1.5px solid ${isCurr?meta.color+"40":isDone?"rgba(34,197,94,.22)":"#e8e8e8"}`, transition:"all .35s" }}>
                      {isDone ? SVG.check("#22c55e",10) : meta.icon(isCurr?meta.color:"#d4d4d4", 11)}
                      <span style={{ fontSize:"10.5px", fontWeight:600, color:isCurr?meta.color:isDone?"#16a34a":"#c4c4c4", letterSpacing:"-.01em" }}>{meta.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Skeleton shimmer */}
              <div style={{ width:"100%", maxWidth:"600px", background:"#fff", border:"1.5px solid #e8e8e8", borderRadius:"16px", padding:"22px 26px", boxShadow:"0 2px 14px rgba(0,0,0,.05)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"9px", marginBottom:"16px" }}>
                  <div style={{ width:"26px", height:"26px", borderRadius:"7px", background:"#f0f0f0", overflow:"hidden", position:"relative", flexShrink:0 }}>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent)", animation:"shimmer 1.4s infinite" }}/>
                  </div>
                  <div style={{ height:"12px", borderRadius:"6px", background:"#f0f0f0", width:"42%", overflow:"hidden", position:"relative" }}>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent)", animation:"shimmer 1.4s infinite" }}/>
                  </div>
                </div>
                {[100,87,93,0,72,84,55].map((w,i) => w===0
                  ? <div key={i} style={{ height:"12px" }}/>
                  : <div key={i} style={{ height:i===0?"11px":"8px", borderRadius:"4px", background:i===0?"#ebebeb":"#f5f5f5", marginBottom:"6px", width:`${w}%`, overflow:"hidden", position:"relative" }}>
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(255,255,255,.8),transparent)", animation:`shimmer ${1.3+i*.1}s infinite`, animationDelay:`${i*.07}s` }}/>
                    </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Error ─── */}
          {error && (
            <div className="fade-up" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"16px", padding:"60px 56px" }}>
              <div style={{ width:"64px", height:"64px", borderRadius:"18px", background:"#fef2f2", border:"1.5px solid #fecaca", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {SVG.warning("#dc2626", 26)}
              </div>
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:"16.5px", fontWeight:800, color:"#dc2626", letterSpacing:"-.03em", marginBottom:"7px" }}>Connection error</p>
                <p style={{ fontSize:"12.5px", color:"#6b7280", maxWidth:"310px", lineHeight:1.74, fontFamily:"DM Mono,monospace" }}>{error}</p>
              </div>
              <button onClick={handleReset}
                style={{ padding:"8px 22px", fontSize:"13px", fontWeight:700, borderRadius:"100px", border:"none", cursor:"pointer", background:"#0a0a0a", color:"white", fontFamily:"inherit", letterSpacing:"-.01em", transition:"transform .17s" }}
                onMouseEnter={e => e.currentTarget.style.transform="translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform=""}>
                Try again
              </button>
            </div>
          )}

          {/* ─── Report ─── */}
          {report && (
            <div className="fade-up" style={{ flex:1, display:"flex", flexDirection:"column" }}>

              {/* Sticky header */}
              <div style={{ padding:"13px 32px", background:"rgba(255,255,255,.95)", borderBottom:"1px solid #ebebeb", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10, backdropFilter:"blur(20px)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"11px" }}>
                  <div style={{ width:"32px", height:"32px", borderRadius:"9px", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {SVG.doc("#fff", 15)}
                  </div>
                  <div>
                    <p style={{ fontSize:"13px", fontWeight:700, color:"#0a0a0a", letterSpacing:"-.025em" }}>Research Report</p>
                    <p style={{ fontSize:"9.5px", color:"#a1a1aa", fontFamily:"DM Mono,monospace" }}>{sourcesCount} sources · {elapsed}s · 5 agents</p>
                  </div>
                </div>

                <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                  {/* Meta chips */}
                  {[{l:`${sourcesCount} sources`,c:"#7c3aed",bg:"#faf5ff",b:"#ddd6fe"},{l:`${elapsed}s`,c:"#059669",bg:"#f0fdf4",b:"#dcfce7"},{l:"5 agents",c:"#d97706",bg:"#fffbeb",b:"#fde68a"}].map(b => (
                    <span key={b.l} style={{ padding:"4px 10px", borderRadius:"100px", fontSize:"10.5px", fontWeight:600, color:b.c, background:b.bg, border:`1.5px solid ${b.b}` }}>{b.l}</span>
                  ))}
                  <div style={{ width:"1px", height:"22px", background:"#ebebeb", margin:"0 2px" }}/>

                  {/* Copy button */}
                  <button className="action-btn" onClick={handleCopy}
                    style={{ background:copied?"#f0fdf4":"#fff", borderColor:copied?"#dcfce7":"#e5e5e5", color:copied?"#16a34a":"#52525b" }}>
                    {copied ? SVG.check("#16a34a",12) : SVG.copy()}
                    {copied ? "Copied!" : "Copy"}
                  </button>

                  {/* ── PDF Export button ── */}
                  <button
                    className="action-btn"
                    onClick={handleExportPDF}
                    disabled={pdfExporting}
                    style={{
                      background: pdfExporting ? "#faf5ff" : "#fff",
                      borderColor: pdfExporting ? "#ddd6fe" : "#e5e5e5",
                      color: pdfExporting ? "#7c3aed" : "#52525b",
                    }}
                    title="Export as PDF (opens print dialog)"
                  >
                    {pdfExporting
                      ? <div className="spin" style={{ width:"11px", height:"11px", borderRadius:"50%", border:"1.5px solid #ddd6fe", borderTopColor:"#7c3aed" }}/>
                      : SVG.pdf()}
                    {pdfExporting ? "Preparing…" : "Export PDF"}
                  </button>

                  {/* New research */}
                  <button className="action-btn" onClick={handleReset}>
                    {SVG.reset()} New
                  </button>
                </div>
              </div>

              {/* Body */}
              <div ref={reportRef} style={{ flex:1, padding:"48px 60px 88px", maxWidth:"820px", width:"100%", margin:"0 auto" }}>
                {/* Header block */}
                <div style={{ marginBottom:"32px" }}>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"4px 12px 4px 8px", borderRadius:"100px", background:"#faf5ff", border:"1.5px solid #ddd6fe", fontSize:"10.5px", fontWeight:600, color:"#6d28d9", marginBottom:"16px" }}>
                    <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#22c55e", display:"inline-block" }}/>
                    Research complete · {new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                  </div>
                  <h1 style={{ fontSize:"24px", fontWeight:900, color:"#0a0a0a", letterSpacing:"-.046em", lineHeight:1.2 }}>{topic}</h1>
                </div>

                {/* Gradient rule */}
                <div style={{ height:"1px", background:"linear-gradient(90deg,rgba(124,58,237,.22),#e8e8e8 38%,transparent)", marginBottom:"34px" }}/>

                {/* Report content — properly rendered markdown */}
                <div className="rb" dangerouslySetInnerHTML={{ __html: reportHTML }}/>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
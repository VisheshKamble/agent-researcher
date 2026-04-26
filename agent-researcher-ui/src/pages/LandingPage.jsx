import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NAV = ["Features", "Pipeline", "Stack", "About"];

const STATS = [
  { value: "5", label: "AI Agents" },
  { value: "18+", label: "Sources / query" },
  { value: "~90s", label: "Report time" },
  { value: "100%", label: "Open source" },
];

const FEATURES = [
  { num: "01", title: "Intelligent Planning", tag: "Planner", desc: "Breaks any topic into 4–5 structured research subtasks — like a senior analyst designing a research brief.", accent: "#7c3aed" },
  { num: "02", title: "Live Web Search", tag: "Searcher", desc: "Queries Tavily and ArXiv in real-time, pulling the freshest sources from across the web and academia.", accent: "#2563eb" },
  { num: "03", title: "Deep Content Reading", tag: "Reader", desc: "Visits each source URL, scrapes full content, and extracts only the facts relevant to your topic.", accent: "#0891b2" },
  { num: "04", title: "Cross-source Verification", tag: "Fact Checker", desc: "Validates each claim across multiple sources — flagging unverified facts before they reach the report.", accent: "#059669" },
  { num: "05", title: "Structured Report Writing", tag: "Writer", desc: "Synthesises all verified facts into a professional, sectioned report with citations — ready to export.", accent: "#d97706" },
  { num: "06", title: "Dark & Light Mode", tag: "UI/UX", desc: "A clean, minimal interface inspired by Apple and Linear — built for long research sessions.", accent: "#7c3aed" },
];

const PIPELINE = [
  { name: "Planner", desc: "Breaks topic into subtasks", color: "#7c3aed" },
  { name: "Searcher", desc: "Queries Tavily + ArXiv", color: "#2563eb" },
  { name: "Reader", desc: "Scrapes & extracts facts", color: "#0891b2" },
  { name: "Fact Checker", desc: "Cross-verifies claims", color: "#059669" },
  { name: "Writer", desc: "Writes final report", color: "#d97706" },
];

const STACK = [
  { title: "Frontend", items: ["React.js + Vite", "Tailwind CSS", "React Router", "Axios"], color: "#7c3aed" },
  { title: "Backend", items: ["Python 3.11 + FastAPI", "LangGraph state machine", "LangChain tools", "Uvicorn ASGI"], color: "#2563eb" },
  { title: "AI / LLM", items: ["Groq — Llama 3.3 70B", "Tavily Search API", "ArXiv API", "BeautifulSoup4"], color: "#0891b2" },
  { title: "Deployment", items: ["Render (backend)", "Vercel (frontend)", "GitHub CI/CD", "Conda environment"], color: "#059669" },
];

const MARQUEE_ITEMS = ["LangGraph","FastAPI","Groq LPU","Tavily Search","React + Vite","Multi-Agent AI","LangChain","Llama 3.3 70B","ArXiv API","Python 3.11"];
const TOPICS = ["Agentic AI in 2025","Quantum computing","Fintech in India","LLM trends"];

// ── SVG icons ──────────────────────────────────────────────────────────────
const Ico = {
  brain: (c="currentColor",s=20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.1-1.98Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.1-1.98Z"/>
    </svg>
  ),
  search: (c="currentColor",s=20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  book: (c="currentColor",s=20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
    </svg>
  ),
  shield: (c="currentColor",s=20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  pen: (c="currentColor",s=20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    </svg>
  ),
  moon: (c="currentColor",s=20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  ),
  check: (c="currentColor",s=14) => (
    <svg width={s} height={s} viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 7l3 3 6-6"/>
    </svg>
  ),
};

const FEAT_ICONS = ["brain","search","book","shield","pen","moon"];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ background:"#f7f7f7", color:"#0a0a0a", minHeight:"100vh", fontFamily:"'DM Sans',-apple-system,system-ui,sans-serif", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}

        @keyframes fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

        .fi{animation:fadeUp .65s cubic-bezier(.16,1,.3,1) both}
        .d1{animation-delay:.04s}.d2{animation-delay:.1s}.d3{animation-delay:.17s}
        .d4{animation-delay:.24s}.d5{animation-delay:.32s}.d6{animation-delay:.4s}

        .float{animation:floatY 5s ease-in-out infinite}
        .pdot{animation:pulse 2.2s ease-in-out infinite}
        .mq{animation:marquee 32s linear infinite}

        .nb{font-size:13.5px;font-weight:500;color:#52525b;text-decoration:none;letter-spacing:-.01em;transition:color .2s}
        .nb:hover{color:#0a0a0a}

        .bd{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;border-radius:100px;font-size:13.5px;font-weight:700;cursor:pointer;border:none;font-family:inherit;letter-spacing:-.02em;background:#0a0a0a;color:#fff;transition:transform .18s,box-shadow .18s}
        .bd:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(0,0,0,.22)}
        .bo{display:inline-flex;align-items:center;gap:7px;padding:10px 22px;border-radius:100px;font-size:13.5px;font-weight:500;cursor:pointer;font-family:inherit;letter-spacing:-.01em;background:transparent;color:#0a0a0a;border:1.5px solid #d4d4d4;text-decoration:none;transition:border-color .2s,transform .18s}
        .bo:hover{border-color:#0a0a0a;transform:translateY(-1px)}

        .tc{padding:7px 16px;border-radius:100px;font-size:12.5px;font-weight:500;background:#fff;color:#52525b;border:1.5px solid #e5e5e5;cursor:pointer;font-family:inherit;transition:all .2s}
        .tc:hover{border-color:#7c3aed;color:#7c3aed;background:#faf5ff}

        .fc{background:#fff;border:1.5px solid #ebebeb;border-radius:20px;padding:26px;position:relative;overflow:hidden;transition:border-color .25s,transform .25s,box-shadow .25s}
        .fc:hover{border-color:#c4b5fd;transform:translateY(-4px);box-shadow:0 18px 50px rgba(124,58,237,.09)}
        .fc::after{content:'';position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse at top left,rgba(124,58,237,.05) 0%,transparent 70%);transition:opacity .3s}
        .fc:hover::after{opacity:1}

        .sc{background:#fff;border:1.5px solid #ebebeb;border-radius:20px;padding:26px;transition:border-color .25s,box-shadow .25s}
        .sc:hover{border-color:#c4b5fd;box-shadow:0 8px 28px rgba(124,58,237,.07)}

        .pc{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:26px 18px;text-align:center;flex:1;transition:background .25s,border-color .25s}
        .pc:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.18)}

        .ic{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:26px;transition:background .25s}
        .ic:hover{background:rgba(255,255,255,.08)}

        .sp{background:#fff;border:1.5px solid #ebebeb;border-radius:16px;padding:20px 20px;text-align:center;transition:border-color .2s}
        .sp:hover{border-color:#c4b5fd}

        .ey{display:block;font-size:11px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:#7c3aed;margin-bottom:14px}

        .li{display:flex;align-items:center;gap:13px;padding:13px 0;border-bottom:1px solid #f0f0f0}
        .li:last-child{border-bottom:none}

        .ms{box-shadow:0 4px 6px rgba(0,0,0,.04),0 20px 48px rgba(0,0,0,.09),0 60px 80px rgba(0,0,0,.05)}
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 52px", height:"60px", background:scrolled?"rgba(247,247,247,.9)":"transparent", backdropFilter:scrolled?"blur(20px) saturate(180%)":"none", borderBottom:scrolled?"1px solid rgba(0,0,0,.07)":"1px solid transparent", transition:"all .35s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"32px", height:"32px", borderRadius:"9px", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"white", fontSize:"11px", fontWeight:700, fontFamily:"DM Mono,monospace", letterSpacing:"0.02em" }}>AR</span>
          </div>
          <span style={{ fontSize:"14px", fontWeight:700, color:"#0a0a0a", letterSpacing:"-0.02em" }}>Agent Researcher</span>
        </div>
        <div style={{ display:"flex", gap:"34px" }}>
          {NAV.map(n=><a key={n} href={`#${n.toLowerCase()}`} className="nb">{n}</a>)}
        </div>
        <button className="bd" onClick={()=>navigate("/app")} style={{ padding:"8px 20px", fontSize:"13px" }}>Open App →</button>
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth:"1240px", margin:"0 auto", padding:"110px 52px 0", minHeight:"100vh", display:"flex", alignItems:"center" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"60px", alignItems:"center", width:"100%", paddingBottom:"80px" }}>

          {/* Left */}
          <div>
            <div className="fi d1" style={{ marginBottom:"24px" }}>
              <span style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"6px 14px 6px 10px", borderRadius:"100px", background:"#faf5ff", border:"1.5px solid #ddd6fe", fontSize:"12px", fontWeight:600, color:"#6d28d9" }}>
                <span className="pdot" style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#22c55e" }}/>
                Final Year Project · Computer Engineering · 2025
              </span>
            </div>

            <h1 className="fi d2" style={{ fontSize:"clamp(46px,5.5vw,72px)", fontWeight:900, letterSpacing:"-0.048em", lineHeight:1.02, color:"#0a0a0a", marginBottom:"24px" }}>
              Research any<br/>topic with{" "}
              <span style={{ background:"linear-gradient(135deg,#6d28d9 0%,#7c3aed 40%,#a78bfa 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                5 AI agents.
              </span>
            </h1>

            <p className="fi d3" style={{ fontSize:"17px", color:"#52525b", lineHeight:1.72, maxWidth:"430px", marginBottom:"36px" }}>
              Agent Researcher autonomously searches the web, reads sources, verifies facts, and writes a full structured report — in under 2 minutes.
            </p>

            <div className="fi d4" style={{ display:"flex", gap:"10px", marginBottom:"40px" }}>
              <button className="bd" onClick={()=>navigate("/app")}>Try it now →</button>
              <a href="#features" className="bo">Explore features</a>
            </div>

            <div className="fi d5" style={{ marginBottom:"52px" }}>
              <p style={{ fontSize:"11px", color:"#9ca3af", marginBottom:"10px", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase" }}>Try a topic</p>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                {TOPICS.map(t=><button key={t} className="tc" onClick={()=>navigate("/app")}>{t}</button>)}
              </div>
            </div>

            <div className="fi d6" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px" }}>
              {STATS.map(s=>(
                <div key={s.label} className="sp">
                  <p style={{ fontSize:"27px", fontWeight:800, color:"#0a0a0a", letterSpacing:"-0.04em", lineHeight:1 }}>{s.value}</p>
                  <p style={{ fontSize:"11px", color:"#9ca3af", marginTop:"4px", fontWeight:500 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – floating mockup */}
          <div className="fi d3 float">
            <div className="ms" style={{ background:"#fff", borderRadius:"20px", overflow:"hidden", border:"1px solid #e5e5e5" }}>
              {/* Browser chrome */}
              <div style={{ padding:"11px 16px", background:"#f3f3f3", borderBottom:"1px solid #ebebeb", display:"flex", alignItems:"center", gap:"7px" }}>
                {["#ff5f57","#ffbd2e","#28c840"].map(c=><div key={c} style={{ width:"11px", height:"11px", borderRadius:"50%", background:c }}/>)}
                <div style={{ flex:1, height:"21px", borderRadius:"6px", background:"#e8e8e8", marginLeft:"10px", display:"flex", alignItems:"center", paddingLeft:"10px" }}>
                  <span style={{ fontSize:"10.5px", color:"#9ca3af", fontFamily:"DM Mono,monospace" }}>Agentic AI - Agent Researcher</span>
                </div>
              </div>
              {/* Body */}
              <div style={{ display:"grid", gridTemplateColumns:"210px 1fr", minHeight:"380px" }}>
                {/* Sidebar */}
                <div style={{ background:"#fafafa", borderRight:"1px solid #f0f0f0", padding:"15px" }}>
                  <div style={{ marginBottom:"11px" }}>
                    <div style={{ fontSize:"9px", fontWeight:700, color:"#9ca3af", letterSpacing:".08em", textTransform:"uppercase", marginBottom:"6px" }}>Research topic</div>
                    <div style={{ borderRadius:"9px", border:"1.5px solid #ddd6fe", background:"#faf5ff", padding:"9px 10px", minHeight:"62px" }}>
                      <span style={{ fontSize:"10.5px", color:"#52525b" }}>Agentic AI systems in 2025…</span>
                    </div>
                  </div>
                  <div style={{ marginBottom:"11px" }}>
                    <div style={{ fontSize:"9px", fontWeight:700, color:"#9ca3af", letterSpacing:".08em", textTransform:"uppercase", marginBottom:"6px" }}>Depth</div>
                    <div style={{ display:"flex", gap:"3px", background:"#efefef", padding:"3px", borderRadius:"9px" }}>
                      {["Quick","Standard","Deep"].map((d,i)=>(
                        <div key={d} style={{ flex:1, height:"24px", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", background:i===1?"#7c3aed":"transparent" }}>
                          <span style={{ fontSize:"9px", color:i===1?"white":"#9ca3af", fontWeight:600 }}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height:"32px", borderRadius:"8px", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"15px" }}>
                    <span style={{ fontSize:"10.5px", color:"white", fontWeight:700 }}>Run research →</span>
                  </div>
                  <div style={{ height:"1px", background:"#ebebeb", marginBottom:"12px" }}/>
                  <div style={{ fontSize:"9px", fontWeight:700, color:"#9ca3af", letterSpacing:".08em", textTransform:"uppercase", marginBottom:"8px" }}>Agent pipeline</div>
                  {[
                    { label:"Planner",      color:"#7c3aed", done:true },
                    { label:"Searcher",     color:"#2563eb", done:true },
                    { label:"Reader",       color:"#0891b2", current:true },
                    { label:"Fact Checker", color:"#059669" },
                    { label:"Writer",       color:"#d97706" },
                  ].map(a=>(
                    <div key={a.label} style={{ display:"flex", alignItems:"center", gap:"7px", padding:"6px 8px", borderRadius:"8px", marginBottom:"3px", background:a.current?"rgba(8,145,178,.08)":a.done?"rgba(34,197,94,.06)":"transparent", border:`1px solid ${a.current?"rgba(8,145,178,.2)":a.done?"rgba(34,197,94,.15)":"transparent"}` }}>
                      <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:a.done?"#22c55e":a.current?a.color:"#d4d4d8", flexShrink:0 }}/>
                      <span style={{ fontSize:"10.5px", fontWeight:600, color:a.done?"#16a34a":a.current?a.color:"#9ca3af", flex:1 }}>{a.label}</span>
                      <span style={{ fontSize:"9.5px", color:a.done?"#22c55e":a.current?a.color:"#d4d4d8" }}>{a.done?"Done":a.current?"…":"—"}</span>
                    </div>
                  ))}
                </div>
                {/* Main */}
                <div style={{ padding:"15px" }}>
                  <div style={{ display:"flex", gap:"6px", marginBottom:"13px" }}>
                    {["18 sources","94s elapsed","6 sections"].map(s=>(
                      <div key={s} style={{ padding:"5px 11px", borderRadius:"100px", background:"#f5f3ff", border:"1px solid #ede9fe" }}>
                        <span style={{ fontSize:"10.5px", color:"#7c3aed", fontWeight:600 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:"#fafafa", border:"1px solid #f0f0f0", borderRadius:"13px", padding:"15px" }}>
                    {["Executive Summary","Key Findings","Detailed Analysis","Current Landscape","Conclusion"].map((s,i)=>(
                      <div key={s} style={{ marginBottom:i<4?"15px":"0" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"6px" }}>
                          <div style={{ width:"3px", height:"11px", borderRadius:"2px", background:"#7c3aed" }}/>
                          <span style={{ fontSize:"10px", fontWeight:700, color:"#3f3f46" }}>{s}</span>
                        </div>
                        <div style={{ height:"6px", borderRadius:"4px", background:"#e8e8e8", marginBottom:"3px" }}/>
                        <div style={{ height:"6px", borderRadius:"4px", background:"#e8e8e8", width:`${88-i*9}%` }}/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div style={{ borderTop:"1px solid #ebebeb", borderBottom:"1px solid #ebebeb", padding:"15px 0", overflow:"hidden", background:"#fff" }}>
        <div className="mq" style={{ display:"flex", width:"max-content" }}>
          {[...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((item,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"20px", paddingRight:"40px" }}>
              <span style={{ fontSize:"13px", fontWeight:600, color:"#a1a1aa", whiteSpace:"nowrap", letterSpacing:"-0.01em" }}>{item}</span>
              <span style={{ color:"#d4d4d4" }}>◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:"110px 52px", maxWidth:"1240px", margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"310px 1fr", gap:"80px", alignItems:"start" }}>
          <div style={{ position:"sticky", top:"88px" }}>
            <span className="ey">Core Capabilities</span>
            <h2 style={{ fontSize:"clamp(34px,3.8vw,50px)", fontWeight:800, letterSpacing:"-0.042em", lineHeight:1.08, color:"#0a0a0a", marginBottom:"18px" }}>
              Built for<br/>serious research
            </h2>
            <p style={{ fontSize:"15.5px", color:"#52525b", lineHeight:1.75, marginBottom:"34px" }}>
              Five specialised agents work in sequence — each one an expert at its job. No hallucinations, no guesswork.
            </p>
            <button className="bd" onClick={()=>navigate("/app")}>Start researching →</button>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
            {FEATURES.map((f,i)=>(
              <div key={f.title} className="fc" style={{ gridColumn:i===5?"1 / -1":"auto" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"18px" }}>
                  <div style={{ width:"44px", height:"44px", borderRadius:"13px", background:f.accent+"14", border:`1px solid ${f.accent}22`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {Ico[FEAT_ICONS[i]](f.accent, 20)}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                    <span style={{ fontSize:"10px", fontWeight:600, color:"#9ca3af", fontFamily:"DM Mono,monospace" }}>{f.num}</span>
                    <span style={{ fontSize:"10.5px", fontWeight:700, padding:"3px 9px", borderRadius:"100px", background:f.accent+"14", color:f.accent, border:`1px solid ${f.accent}28` }}>{f.tag}</span>
                  </div>
                </div>
                <p style={{ fontSize:"14.5px", fontWeight:700, color:"#0a0a0a", marginBottom:"9px", letterSpacing:"-0.022em" }}>{f.title}</p>
                <p style={{ fontSize:"13.5px", color:"#6b7280", lineHeight:1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PIPELINE ── */}
      <section id="pipeline" style={{ padding:"110px 52px", background:"#0a0a0a" }}>
        <div style={{ maxWidth:"1240px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"72px" }}>
            <span style={{ display:"block", fontSize:"11px", fontWeight:700, color:"#a78bfa", letterSpacing:".13em", textTransform:"uppercase", marginBottom:"14px" }}>Agent Architecture</span>
            <h2 style={{ fontSize:"clamp(34px,4vw,52px)", fontWeight:800, letterSpacing:"-0.04em", color:"#fff", marginBottom:"14px" }}>The LangGraph pipeline</h2>
            <p style={{ fontSize:"16px", color:"#52525b" }}>Every research request travels through a 5-node state machine.</p>
          </div>

          {/* Nodes */}
          <div style={{ display:"flex", gap:"10px", alignItems:"stretch", position:"relative", marginBottom:"48px" }}>
            <div style={{ position:"absolute", top:"44px", left:"10%", right:"10%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(167,139,250,.28) 20%,rgba(167,139,250,.28) 80%,transparent)" }}/>
            {PIPELINE.map((step,i)=>{
              const icons = ["brain","search","book","shield","pen"];
              return (
                <div key={step.name} className="pc" style={{ position:"relative", zIndex:1 }}>
                  <div style={{ width:"60px", height:"60px", borderRadius:"17px", background:step.color+"22", border:`1px solid ${step.color}38`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", position:"relative" }}>
                    {Ico[icons[i]](step.color, 26)}
                    <div style={{ position:"absolute", top:"-7px", right:"-7px", width:"19px", height:"19px", borderRadius:"50%", background:step.color, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:"9px", fontWeight:800, color:"#fff" }}>{i+1}</span>
                    </div>
                  </div>
                  <p style={{ fontSize:"13px", fontWeight:700, color:"#fff", marginBottom:"5px", letterSpacing:"-0.02em" }}>{step.name}</p>
                  <p style={{ fontSize:"11.5px", color:"#52525b", lineHeight:1.5 }}>{step.desc}</p>
                </div>
              );
            })}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px" }}>
            {[
              { label:"State-based", desc:"Each agent receives the full state and passes it enriched to the next node." },
              { label:"Parallel search", desc:"Searcher fans out to Tavily and ArXiv simultaneously for maximum coverage." },
              { label:"Verified output", desc:"No claim reaches the Writer unless the Fact Checker confirms it across 2+ sources." },
            ].map(item=>(
              <div key={item.label} className="ic">
                <p style={{ fontSize:"13.5px", fontWeight:700, color:"#fff", marginBottom:"8px", letterSpacing:"-0.01em" }}>{item.label}</p>
                <p style={{ fontSize:"13px", color:"#52525b", lineHeight:1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK ── */}
      <section id="stack" style={{ padding:"110px 52px", maxWidth:"1240px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"64px" }}>
          <span className="ey">Technology</span>
          <h2 style={{ fontSize:"clamp(34px,3.8vw,50px)", fontWeight:800, letterSpacing:"-0.042em", color:"#0a0a0a" }}>Full stack breakdown</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
          {STACK.map(s=>(
            <div key={s.title} className="sc">
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"22px" }}>
                <div style={{ width:"10px", height:"10px", borderRadius:"3px", background:s.color }}/>
                <p style={{ fontSize:"15px", fontWeight:700, color:"#0a0a0a", letterSpacing:"-0.022em" }}>{s.title}</p>
              </div>
              {s.items.map((item,i)=>(
                <div key={item} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"9px 0", borderBottom:i<s.items.length-1?"1px solid #f5f5f5":"none" }}>
                  <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:s.color, flexShrink:0 }}/>
                  <span style={{ fontSize:"13px", color:"#52525b" }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding:"110px 52px", background:"#f7f7f7", borderTop:"1px solid #ebebeb" }}>
        <div style={{ maxWidth:"1240px", margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"center" }}>
            <div>
              <span className="ey">About</span>
              <h2 style={{ fontSize:"clamp(34px,3.8vw,50px)", fontWeight:800, letterSpacing:"-0.042em", lineHeight:1.08, color:"#0a0a0a", marginBottom:"18px" }}>
                Built during<br/>semester vacation
              </h2>
              <p style={{ fontSize:"15.5px", color:"#52525b", lineHeight:1.75, marginBottom:"32px" }}>
                A solo project built to explore agentic AI, LangGraph, and modern full-stack development — and to stand out in MNC interviews.
              </p>
              <div>
                {["LangGraph multi-agent orchestration","FastAPI production API patterns","React + Tailwind UI development","Agentic AI system design","Full-stack deployment pipeline"].map(item=>(
                  <div key={item} className="li">
                    <div style={{ width:"20px", height:"20px", borderRadius:"6px", background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {Ico.check("#7c3aed",11)}
                    </div>
                    <span style={{ fontSize:"14px", color:"#3f3f46" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:"#0a0a0a", borderRadius:"26px", padding:"38px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(124,58,237,.12)", pointerEvents:"none" }}/>
              <div style={{ position:"absolute", bottom:"-30px", left:"-30px", width:"130px", height:"130px", borderRadius:"50%", background:"rgba(124,58,237,.07)", pointerEvents:"none" }}/>
              <div style={{ position:"relative" }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", padding:"5px 13px", borderRadius:"100px", background:"rgba(167,139,250,.13)", border:"1px solid rgba(167,139,250,.22)", marginBottom:"22px" }}>
                  <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#22c55e" }}/>
                  <span style={{ fontSize:"11px", color:"#a78bfa", fontWeight:600 }}>Open Source</span>
                </div>
                <p style={{ fontSize:"27px", fontWeight:800, color:"#fff", letterSpacing:"-0.04em", marginBottom:"11px" }}>agent-researcher</p>
                <p style={{ fontSize:"13.5px", color:"#6b7280", marginBottom:"28px", lineHeight:1.7 }}>Multi-agent AI system that autonomously searches, reads, fact-checks and synthesizes research reports using LangGraph + Groq</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"7px" }}>
                  {["langgraph","langchain","groq","fastapi","react","tavily"].map(tag=>(
                    <span key={tag} style={{ fontSize:"11.5px", padding:"4px 12px", borderRadius:"100px", background:"rgba(124,58,237,.18)", color:"#a78bfa", border:"1px solid rgba(167,139,250,.18)", fontWeight:600 }}>#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:"130px 52px", background:"#0a0a0a", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"700px", height:"500px", borderRadius:"50%", background:"radial-gradient(ellipse,rgba(109,40,217,.18) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px)", backgroundSize:"32px 32px", pointerEvents:"none" }}/>
        <div style={{ position:"relative", maxWidth:"580px", margin:"0 auto" }}>
          <h2 style={{ fontSize:"clamp(42px,5.5vw,68px)", fontWeight:900, letterSpacing:"-0.052em", color:"#fff", marginBottom:"18px", lineHeight:1.0 }}>
            Ready to<br/>research?
          </h2>
          <p style={{ fontSize:"16.5px", color:"#6b7280", marginBottom:"44px", lineHeight:1.75 }}>
            Type any topic and let 5 AI agents do the work for you.<br/>Free, open source, production-ready.
          </p>
          <div style={{ display:"flex", gap:"12px", justifyContent:"center" }}>
            <button onClick={()=>navigate("/app")} style={{ padding:"14px 34px", fontSize:"15px", fontWeight:700, borderRadius:"100px", border:"none", cursor:"pointer", background:"#fff", color:"#0a0a0a", fontFamily:"inherit", transition:"all .2s", letterSpacing:"-0.015em" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 14px 36px rgba(255,255,255,.18)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
              Open Agent Researcher →
            </button>
            <a href="#features" style={{ padding:"14px 26px", fontSize:"14px", fontWeight:500, borderRadius:"100px", border:"1.5px solid rgba(255,255,255,.13)", cursor:"pointer", color:"#71717a", fontFamily:"inherit", textDecoration:"none", transition:"all .2s", display:"inline-flex", alignItems:"center" }}>
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding:"30px 52px", borderTop:"1px solid #1a1a1a", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"26px", height:"26px", borderRadius:"7px", background:"rgba(255,255,255,.09)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"rgba(255,255,255,.6)", fontSize:"10px", fontWeight:700, fontFamily:"DM Mono,monospace" }}>AR</span>
          </div>
          <span style={{ fontSize:"13px", color:"#3a3a3a" }}>Agent Researcher · Final Year Project · Computer Engineering · 2025</span>
        </div>
        <div style={{ display:"flex", gap:"26px" }}>
          {NAV.map(n=>(
            <a key={n} href={`#${n.toLowerCase()}`} style={{ fontSize:"13px", color:"#3a3a3a", textDecoration:"none", transition:"color .2s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#9ca3af"}
              onMouseLeave={e=>e.currentTarget.style.color="#3a3a3a"}>
              {n}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
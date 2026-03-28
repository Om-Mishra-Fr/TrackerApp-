// ════════════════════════════════════════════════════════════════
//  STUDYBUDDY — SEGMENT 1 of 5
//  Paste ALL 5 segments into one file: src/App.jsx
//  This segment: Imports · Storage · Default Data · Global Styles
// ════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #07070f; font-family: 'Sora', sans-serif; color: #e2e2f0; overflow-x: hidden; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e1e30; border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: #2e2e45; }

  input, textarea, select, button { font-family: 'Sora', sans-serif; }
  input:focus, textarea:focus, select:focus { outline: none; }
  a { text-decoration: none; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn    { from { opacity:0; }  to { opacity:1; } }
  @keyframes slideRight{ from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
  @keyframes slideLeft { from { opacity:0; transform:translateX(16px); }  to { opacity:1; transform:translateX(0); } }
  @keyframes scaleIn   { from { opacity:0; transform:scale(.92); } to { opacity:1; transform:scale(1); } }
  @keyframes spin      { to   { transform:rotate(360deg); } }
  @keyframes pulse     { 0%,100%{ opacity:1; } 50%{ opacity:.3; } }
  @keyframes glowPulse { 0%,100%{ box-shadow:0 0 20px var(--glow,#818cf844); } 50%{ box-shadow:0 0 50px var(--glow,#818cf899); } }
  @keyframes ripple    { from { transform:scale(0); opacity:.6; } to { transform:scale(3); opacity:0; } }
  @keyframes float     { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-8px); } }
  @keyframes shimmer   { from { background-position:200% center; } to { background-position:-200% center; } }

  .anim-fadeUp    { animation: fadeUp    .45s cubic-bezier(.22,1,.36,1) both; }
  .anim-fadeIn    { animation: fadeIn    .35s ease both; }
  .anim-slideR    { animation: slideRight .35s cubic-bezier(.22,1,.36,1) both; }
  .anim-slideL    { animation: slideLeft  .35s cubic-bezier(.22,1,.36,1) both; }
  .anim-scaleIn   { animation: scaleIn   .3s cubic-bezier(.22,1,.36,1) both; }

  .hover-lift     { transition: transform .2s ease, box-shadow .2s ease; }
  .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,.5); }
  .hover-glow     { transition: box-shadow .2s ease; }
  .hover-glow:hover { box-shadow: 0 0 0 1px var(--accent, #818cf8), 0 0 20px var(--accent-glow, #818cf830); }

  .glass {
    background: rgba(255,255,255,.03);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,.06);
  }
  .glass-strong {
    background: rgba(14,14,28,.7);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,.08);
  }
  .shimmer-text {
    background: linear-gradient(90deg, #818cf8, #c084fc, #818cf8);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }
  .dot-online {
    display: inline-block; width:8px; height:8px;
    border-radius: 50%; background: #34d399;
    box-shadow: 0 0 8px #34d39966;
    animation: pulse 2s ease infinite;
  }
`;

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────
const STORAGE_KEY = "studybuddy_v3";

async function dbLoad() {
  try {
    const r = await window.storage.get(STORAGE_KEY, true);
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}

async function dbSave(data) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(data), true);
  } catch {}
}

// ─── TIMESTAMP HELPER ────────────────────────────────────────────────────────
function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5)  return "Up late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// ─── DEFAULT APP STATE ────────────────────────────────────────────────────────
const DEFAULT_STATE = {
  users: {
    A: { name: "You",    avatar: "🌙", color: "#818cf8", colorDim: "#818cf820", joined: Date.now() },
    B: { name: "Friend", avatar: "⭐", color: "#34d399", colorDim: "#34d39920", joined: Date.now() },
  },
  timetable: [],
  resources: [],
  doubts:    [],
  chat:      [],
  notes:     [],
  timer: {
    running:   false,
    seconds:   1500,
    total:     1500,
    label:     "Focus Session",
    startedBy: null,
    startedAt: null,
  },
  goals: { A: [], B: [] },
  lastSeen: { A: null, B: null },
};

// ─── SHARED INPUT STYLE (used across many components) ────────────────────────
const iStyle = (accentColor = "#818cf8") => ({
  background:   "rgba(255,255,255,.05)",
  border:       "1px solid rgba(255,255,255,.08)",
  borderRadius: 12,
  color:        "#e2e2f0",
  padding:      "11px 16px",
  fontSize:     14,
  width:        "100%",
  transition:   "border-color .2s",
});

// ─── CARD STYLE ───────────────────────────────────────────────────────────────
const cardStyle = (accentColor) => ({
  background:    "linear-gradient(145deg,#0c0c1e,#10101f)",
  border:        `1px solid ${accentColor ? accentColor + "25" : "rgba(255,255,255,.06)"}`,
  borderRadius:  20,
  padding:       "20px 22px",
});

// ─── BUTTON STYLES ────────────────────────────────────────────────────────────
const btnPrimary = (color) => ({
  background:    `linear-gradient(135deg, ${color}, ${color}cc)`,
  border:        "none",
  borderRadius:  12,
  color:         "#000",
  padding:       "11px 26px",
  fontWeight:    700,
  cursor:        "pointer",
  fontSize:      14,
  boxShadow:     `0 4px 20px ${color}44`,
  transition:    "all .2s",
  fontFamily:    "Sora, sans-serif",
});

const btnGhost = {
  background:    "rgba(255,255,255,.04)",
  border:        "1px solid rgba(255,255,255,.08)",
  borderRadius:  12,
  color:         "#888",
  padding:       "10px 20px",
  fontWeight:    500,
  cursor:        "pointer",
  fontSize:      14,
  transition:    "all .2s",
  fontFamily:    "Sora, sans-serif",
};

// ─── SPINNER ──────────────────────────────────────────────────────────────────
function Spinner({ size = 24, color = "#818cf8" }) {
  return (
    <div style={{
      width: size, height: size,
      border: `3px solid ${color}22`,
      borderTop: `3px solid ${color}`,
      borderRadius: "50%",
      animation: "spin .8s linear infinite",
      flexShrink: 0,
    }} />
  );
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
function Badge({ count, color = "#f87171" }) {
  if (!count) return null;
  return (
    <span style={{
      position: "absolute", top: 4, right: 4,
      minWidth: 16, height: 16,
      background: color, borderRadius: 99,
      fontSize: 9, fontWeight: 800,
      color: "#000",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 4px",
      boxShadow: `0 0 8px ${color}88`,
    }}>{count}</span>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function Empty({ icon, title, sub, actionLabel, onAction }) {
  return (
    <div className="anim-fadeIn" style={{ textAlign: "center", padding: "60px 20px", color: "#2a2a40" }}>
      <div style={{ fontSize: 52, marginBottom: 14, filter: "grayscale(1)" }}>{icon}</div>
      <div style={{ color: "#3a3a55", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{title}</div>
      {sub && <div style={{ color: "#2a2a40", fontSize: 13, marginBottom: 20 }}>{sub}</div>}
      {actionLabel && onAction && (
        <button onClick={onAction} style={{ ...btnGhost, fontSize: 13 }}>{actionLabel}</button>
      )}
    </div>
  );
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
function SectionHeader({ title, sub, action, actionLabel, color }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
      <div>
        <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 28, letterSpacing: "-1px", lineHeight: 1.1 }}>{title}</h2>
        {sub && <p style={{ color: "#3a3a55", fontSize: 13, marginTop: 5 }}>{sub}</p>}
      </div>
      {actionLabel && action && (
        <button onClick={action} style={btnPrimary(color || "#818cf8")}>{actionLabel}</button>
      )}
    </div>
  );
}

// END OF SEGMENT 1
// ════════════════════════════════════════════════════════════════
//  STUDYBUDDY — SEGMENT 2 of 5
//  This segment: Root App · Landing · Dashboard Shell · Home Tab
// ════════════════════════════════════════════════════════════════

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [data,     setData]     = useState(null);
  const [userId,   setUserId]   = useState(null);
  const [tab,      setTab]      = useState("home");
  const [syncing,  setSyncing]  = useState(false);
  const [toast,    setToast]    = useState(null);
  const pollRef = useRef(null);

  // inject global styles once
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // initial load
  useEffect(() => {
    (async () => {
      const saved = await dbLoad();
      setData(saved || DEFAULT_STATE);
    })();
  }, []);

  // poll for sync every 2.5s
  useEffect(() => {
    if (!data || !userId) return;
    pollRef.current = setInterval(async () => {
      setSyncing(true);
      const fresh = await dbLoad();
      if (fresh) setData(fresh);
      setTimeout(() => setSyncing(false), 400);
    }, 2500);
    return () => clearInterval(pollRef.current);
  }, [!!data, !!userId]);

  // mark last seen
  useEffect(() => {
    if (!userId || !data) return;
    update(d => { d.lastSeen[userId] = Date.now(); });
  }, [userId]);

  const update = useCallback((fn) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      fn(next);
      dbSave(next);
      return next;
    });
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  if (!data) return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#07070f", gap: 16 }}>
      <Spinner size={36} />
      <span style={{ color: "#3a3a55", fontSize: 14 }}>Loading StudyBuddy…</span>
    </div>
  );

  if (!userId) return <LandingPage data={data} update={update} onSelect={setUserId} />;

  return (
    <DashboardShell
      data={data} update={update}
      userId={userId} setUserId={setUserId}
      tab={tab} setTab={setTab}
      syncing={syncing} showToast={showToast} toast={toast}
    />
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ data, update, onSelect }) {
  const [editingId, setEditingId] = useState(null);
  const [tmpName,   setTmpName]   = useState("");
  const [hovered,   setHovered]   = useState(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse 80% 60% at 50% -10%, #1a1040 0%, #07070f 60%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 20px", position: "relative", overflow: "hidden",
    }}>
      {/* Background orbs */}
      {[
        { w:500, h:500, top:"-15%", left:"-10%",  c:"#818cf8" },
        { w:400, h:400, bottom:"-10%", right:"-8%", c:"#34d399" },
        { w:200, h:200, top:"40%", left:"60%",    c:"#c084fc" },
      ].map((o, i) => (
        <div key={i} style={{
          position:"absolute", width:o.w, height:o.h, borderRadius:"50%",
          background:`radial-gradient(circle, ${o.c}0d 0%, transparent 70%)`,
          top:o.top, left:o.left, bottom:o.bottom, right:o.right,
          pointerEvents:"none", animation:`float ${4+i}s ease-in-out infinite`,
          animationDelay: `${i * .8}s`,
        }}/>
      ))}

      {/* Logo */}
      <div className="anim-fadeUp" style={{ textAlign:"center", marginBottom:56 }}>
        <div style={{ fontSize:72, marginBottom:16, animation:"float 3s ease-in-out infinite", display:"inline-block", filter:"drop-shadow(0 0 40px #818cf866)" }}>📚</div>
        <h1 style={{ fontSize:48, fontWeight:800, letterSpacing:"-2px", lineHeight:1, marginBottom:8 }}>
          <span style={{ color:"#fff" }}>Study</span>
          <span className="shimmer-text">Buddy</span>
        </h1>
        <p style={{ color:"#3a3a55", fontSize:16, fontWeight:400, maxWidth:340, lineHeight:1.7 }}>
          Your private study space — two people, one goal, zero distractions.
        </p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:16 }}>
          <span className="dot-online" />
          <span style={{ color:"#34d399", fontSize:12, fontWeight:600 }}>Real-time sync · No account needed</span>
        </div>
      </div>

      {/* User cards */}
      <div style={{ display:"flex", gap:24, flexWrap:"wrap", justifyContent:"center", marginBottom:48 }}>
        {["A","B"].map((uid, idx) => {
          const u = data.users[uid];
          const isHov = hovered === uid;
          return (
            <div key={uid} className="anim-fadeUp" style={{ animationDelay:`${idx * .12}s` }}>
              <div
                onMouseEnter={() => setHovered(uid)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHov
                    ? `linear-gradient(145deg,#0f0f22,#141430)`
                    : "linear-gradient(145deg,#0c0c1e,#10101f)",
                  border: `1px solid ${isHov ? u.color + "55" : u.color + "22"}`,
                  borderRadius: 24, padding:"36px 44px",
                  textAlign:"center", minWidth:220,
                  boxShadow: isHov ? `0 20px 60px ${u.color}22` : "none",
                  transition:"all .25s ease", position:"relative", overflow:"hidden",
                }}
              >
                {/* Card glow */}
                <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 50% 0%, ${u.color}0a 0%, transparent 65%)`, pointerEvents:"none" }} />

                <div style={{ fontSize:56, marginBottom:14, display:"inline-block", filter:`drop-shadow(0 0 20px ${u.color}88)`, animation: isHov ? "float 1.5s ease-in-out infinite" : "none" }}>
                  {u.avatar}
                </div>

                {editingId === uid ? (
                  <div onClick={e => e.stopPropagation()}>
                    <input
                      value={tmpName}
                      onChange={e => setTmpName(e.target.value)}
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          update(d => { d.users[uid].name = tmpName.trim() || d.users[uid].name; });
                          setEditingId(null);
                        }
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      style={{ ...iStyle(u.color), textAlign:"center", marginBottom:10, fontSize:16 }}
                    />
                    <button
                      onClick={() => { update(d => { d.users[uid].name = tmpName.trim() || d.users[uid].name; }); setEditingId(null); }}
                      style={{ ...btnPrimary(u.color), width:"100%" }}
                    >Save name</button>
                  </div>
                ) : (
                  <>
                    <div style={{ color:"#fff", fontWeight:800, fontSize:22, marginBottom:4, letterSpacing:"-0.5px" }}>{u.name}</div>
                    <div
                      onClick={e => { e.stopPropagation(); setTmpName(u.name); setEditingId(uid); }}
                      style={{ color:u.color, fontSize:12, marginBottom:22, cursor:"pointer", opacity:.6 }}
                    >✏ rename</div>
                    <button
                      onClick={() => onSelect(uid)}
                      style={{ ...btnPrimary(u.color), width:"100%", fontSize:15, padding:"13px 0" }}
                    >Enter →</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Features strip */}
      <div className="anim-fadeUp" style={{ animationDelay:".3s", display:"flex", gap:32, flexWrap:"wrap", justifyContent:"center" }}>
        {["⏱ Synced timer","📅 Shared schedule","📁 Resource sharing","❓ Q&A doubts","💬 Study chat","📝 Shared notes"].map(f => (
          <div key={f} style={{ color:"#2a2a40", fontSize:13, fontWeight:500 }}>{f}</div>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD SHELL ──────────────────────────────────────────────────────────
function DashboardShell({ data, update, userId, setUserId, tab, setTab, syncing, showToast, toast }) {
  const u = data.users[userId];
  const other = userId === "A" ? "B" : "A";
  const otherU = data.users[other];

  const unreadDoubts = data.doubts.filter(d => d.from !== userId && !d.answer).length;
  const unreadChat   = data.chat.filter(m => m.from !== userId).length;

  const NAV_ITEMS = [
    { id:"home",      icon:"⌂",   label:"Home"      },
    { id:"timer",     icon:"◎",   label:"Timer"     },
    { id:"schedule",  icon:"▦",   label:"Schedule"  },
    { id:"resources", icon:"◈",   label:"Resources" },
    { id:"doubts",    icon:"?",   label:"Doubts",    badge: unreadDoubts },
    { id:"chat",      icon:"✉",   label:"Chat",      badge: unreadChat   },
    { id:"notes",     icon:"✎",   label:"Notes"     },
    { id:"goals",     icon:"◉",   label:"Goals"     },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#07070f", display:"flex", flexDirection:"column" }}>
      {/* ── TOP BAR ── */}
      <header style={{
        position:"sticky", top:0, zIndex:300,
        height:60, display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 24px",
        background:"rgba(7,7,15,.85)",
        backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
        borderBottom:"1px solid rgba(255,255,255,.05)",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:24 }}>📚</span>
          <span style={{ fontWeight:800, fontSize:19, letterSpacing:"-0.5px" }}>
            <span style={{ color:"#fff" }}>Study</span>
            <span style={{ color: u.color }}>Buddy</span>
          </span>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {/* Sync dot */}
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background: syncing ? "#f59e0b" : "#34d399", boxShadow:`0 0 6px ${syncing ? "#f59e0b" : "#34d399"}`, animation: syncing ? "pulse .8s infinite" : "none" }} />
            <span style={{ color:"#3a3a55", fontSize:11, fontFamily:"JetBrains Mono, monospace" }}>{syncing ? "syncing" : "live"}</span>
          </div>

          {/* Partner pill */}
          <div style={{ display:"flex", alignItems:"center", gap:8, background:otherU.colorDim, border:`1px solid ${otherU.color}30`, borderRadius:30, padding:"5px 14px" }}>
            <span style={{ fontSize:14 }}>{otherU.avatar}</span>
            <span style={{ color:otherU.color, fontSize:12, fontWeight:600 }}>{otherU.name}</span>
            <span className="dot-online" style={{ width:6, height:6, boxShadow:"none" }} />
          </div>

          {/* My pill */}
          <div style={{ display:"flex", alignItems:"center", gap:8, background:u.colorDim, border:`1px solid ${u.color}30`, borderRadius:30, padding:"5px 14px" }}>
            <span style={{ fontSize:14 }}>{u.avatar}</span>
            <span style={{ color:u.color, fontSize:12, fontWeight:600 }}>{u.name}</span>
          </div>

          <button onClick={() => setUserId(null)} style={{ ...btnGhost, padding:"6px 12px", fontSize:12 }}>⇄ Switch</button>
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{ display:"flex", flex:1 }}>
        {/* ── SIDEBAR ── */}
        <aside style={{
          width:72, flexShrink:0, position:"sticky", top:60,
          height:"calc(100vh - 60px)", overflowY:"auto",
          background:"rgba(255,255,255,.015)",
          borderRight:"1px solid rgba(255,255,255,.04)",
          display:"flex", flexDirection:"column", alignItems:"center",
          paddingTop:12, gap:4,
        }}>
          {NAV_ITEMS.map(item => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                title={item.label}
                style={{
                  position:"relative",
                  width:48, height:48, borderRadius:14,
                  border:"none",
                  background: active ? u.colorDim : "transparent",
                  color: active ? u.color : "#2e2e48",
                  cursor:"pointer", fontSize:18,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all .15s",
                  boxShadow: active ? `inset 0 0 0 1px ${u.color}40` : "none",
                  fontFamily:"Sora,sans-serif", fontWeight:600,
                }}
              >
                {item.icon}
                {item.badge > 0 && <Badge count={item.badge} />}
                {/* Active indicator bar */}
                {active && <div style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:3, height:24, background:u.color, borderRadius:"0 3px 3px 0" }} />}
              </button>
            );
          })}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex:1, overflowY:"auto", padding:"32px 28px", maxWidth:900, minWidth:0 }}>
          {tab === "home"      && <HomeView      data={data} update={update} userId={userId} u={u} otherU={otherU} other={other} setTab={setTab} showToast={showToast} />}
          {tab === "timer"     && <TimerView     data={data} update={update} userId={userId} u={u} otherU={otherU} showToast={showToast} />}
          {tab === "schedule"  && <ScheduleView  data={data} update={update} userId={userId} u={u} otherU={otherU} other={other} showToast={showToast} />}
          {tab === "resources" && <ResourcesView data={data} update={update} userId={userId} u={u} otherU={otherU} other={other} showToast={showToast} />}
          {tab === "doubts"    && <DoubtsView    data={data} update={update} userId={userId} u={u} otherU={otherU} other={other} showToast={showToast} />}
          {tab === "chat"      && <ChatView      data={data} update={update} userId={userId} u={u} otherU={otherU} other={other} showToast={showToast} />}
          {tab === "notes"     && <NotesView     data={data} update={update} userId={userId} u={u} otherU={otherU} other={other} showToast={showToast} />}
          {tab === "goals"     && <GoalsView     data={data} update={update} userId={userId} u={u} otherU={otherU} other={other} showToast={showToast} />}
        </main>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div className="anim-slideL" style={{
          position:"fixed", bottom:28, right:28, zIndex:999,
          background: toast.type === "error" ? "#f871711a" : "#34d3991a",
          border: `1px solid ${toast.type === "error" ? "#f87171" : "#34d399"}44`,
          borderRadius:14, padding:"12px 22px",
          color: toast.type === "error" ? "#f87171" : "#34d399",
          fontWeight:600, fontSize:14,
          backdropFilter:"blur(12px)",
          boxShadow:"0 8px 32px rgba(0,0,0,.4)",
        }}>
          {toast.type === "error" ? "✗ " : "✓ "}{toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── HOME VIEW ────────────────────────────────────────────────────────────────
function HomeView({ data, update, userId, u, otherU, other, setTab, showToast }) {
  const today       = new Date().toLocaleDateString("en-US", { weekday:"long" });
  const todaySlots  = data.timetable.filter(s => s.day === today).sort((a,b)=>a.time.localeCompare(b.time));
  const unanswered  = data.doubts.filter(d => d.from !== userId && !d.answer).length;
  const totalRes    = data.resources.length;
  const myGoals     = (data.goals[userId] || []);
  const doneGoals   = myGoals.filter(g => g.done).length;

  const STATS = [
    { icon:"📁", label:"Resources",      val: totalRes,                             color:"#818cf8", tab:"resources" },
    { icon:"❓", label: unanswered ? "Need answers" : "Doubts clear", val: unanswered || "✓",   color: unanswered ? "#f87171" : "#34d399", tab:"doubts" },
    { icon:"💬", label:"Messages",       val: data.chat.length,                     color:"#fb923c", tab:"chat" },
    { icon:"◉",  label:"Goals done",     val: `${doneGoals}/${myGoals.length||0}`,  color:"#c084fc", tab:"goals" },
  ];

  return (
    <div className="anim-fadeUp">
      {/* Hero greeting */}
      <div style={{ marginBottom:36 }}>
        <div style={{ fontFamily:"JetBrains Mono, monospace", color:"#2a2a40", fontSize:12, marginBottom:8, letterSpacing:2, textTransform:"uppercase" }}>
          {new Date().toDateString()}
        </div>
        <h1 style={{ fontSize:36, fontWeight:800, color:"#fff", letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:6 }}>
          {greeting()},&nbsp;
          <span style={{ color:u.color }}>{u.avatar} {u.name}</span>
        </h1>
        <p style={{ color:"#3a3a55", fontSize:14 }}>Let's make today productive.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14, marginBottom:32 }}>
        {STATS.map((s,i) => (
          <div
            key={s.label}
            className="anim-fadeUp hover-lift"
            onClick={() => setTab(s.tab)}
            style={{
              ...cardStyle(s.color),
              animationDelay:`${i*.08}s`,
              cursor:"pointer", position:"relative", overflow:"hidden",
            }}
          >
            <div style={{ position:"absolute", top:-16, right:-10, fontSize:60, opacity:.05 }}>{s.icon}</div>
            <div style={{ fontSize:26, marginBottom:10 }}>{s.icon}</div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:26, letterSpacing:"-1px" }}>{s.val}</div>
            <div style={{ color:s.color, fontSize:12, fontWeight:600, marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Timer status banner */}
      {data.timer.running && (
        <div className="anim-scaleIn" style={{ ...cardStyle("#f59e0b"), marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, cursor:"pointer" }} onClick={() => setTab("timer")}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ fontSize:32, animation:"pulse 1s ease infinite" }}>⏱</div>
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Study session in progress</div>
              <div style={{ color:"#f59e0b", fontSize:13 }}>{data.timer.label}</div>
            </div>
          </div>
          <div style={{ fontFamily:"JetBrains Mono, monospace", color:"#f59e0b", fontSize:24, fontWeight:700 }}>
            {String(Math.floor(data.timer.seconds/60)).padStart(2,"0")}:{String(data.timer.seconds%60).padStart(2,"0")}
          </div>
        </div>
      )}

      {/* Two column */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        {/* Today's schedule */}
        <div style={{ ...cardStyle(), gridColumn:"1 / -1" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>📅 Today — {today}</div>
            <button onClick={() => setTab("schedule")} style={{ background:"none", border:"none", color:u.color, fontSize:13, cursor:"pointer", fontWeight:600 }}>+ Add →</button>
          </div>
          {todaySlots.length === 0 ? (
            <div style={{ color:"#2a2a40", fontSize:14, textAlign:"center", padding:"16px 0" }}>
              Nothing scheduled — <span onClick={() => setTab("schedule")} style={{ color:u.color, cursor:"pointer" }}>add a session</span>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {todaySlots.map(s => {
                const owner = data.users[s.owner];
                const now = new Date();
                const [sh, sm] = s.time.split(":").map(Number);
                const slotMins = sh * 60 + sm;
                const nowMins  = now.getHours() * 60 + now.getMinutes();
                const active   = nowMins >= slotMins && nowMins <= slotMins + parseInt(s.duration);
                return (
                  <div key={s.id} style={{ display:"flex", alignItems:"center", gap:14, background: active ? `${owner.color}12` : "rgba(255,255,255,.025)", borderRadius:14, padding:"12px 16px", borderLeft:`3px solid ${active ? owner.color : owner.color + "55"}`, transition:"all .2s" }}>
                    <div style={{ fontFamily:"JetBrains Mono, monospace", color:owner.color, fontSize:13, minWidth:50, fontWeight:500 }}>{s.time}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{s.subject}</div>
                      <div style={{ color:"#3a3a55", fontSize:12, marginTop:2 }}>{s.duration} min</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      {active && <span style={{ background:owner.color, color:"#000", fontSize:10, fontWeight:800, borderRadius:6, padding:"2px 7px" }}>NOW</span>}
                      <span style={{ fontSize:18 }}>{owner.avatar}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent resources */}
        <div style={cardStyle()}>
          <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            📁 Recent resources
            <button onClick={() => setTab("resources")} style={{ background:"none", border:"none", color:u.color, fontSize:12, cursor:"pointer" }}>all →</button>
          </div>
          {data.resources.length === 0
            ? <div style={{ color:"#2a2a40", fontSize:13 }}>None shared yet</div>
            : data.resources.slice(-3).reverse().map(r => (
              <div key={r.id} style={{ color:"#888", fontSize:13, padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,.04)", display:"flex", gap:8, alignItems:"center" }}>
                <span>{r.type === "link" ? "🔗" : r.type === "video" ? "▶" : r.type === "pdf" ? "📄" : "📝"}</span>
                <span style={{ color:"#ccc", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.title}</span>
                <span style={{ fontSize:11, color:"#2a2a40" }}>{data.users[r.owner].avatar}</span>
              </div>
            ))
          }
        </div>

        {/* Partner card */}
        <div style={{ ...cardStyle(otherU.color), background:`linear-gradient(145deg,#0c0c1e, ${otherU.color}0a)` }}>
          <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:16 }}>🤝 Study partner</div>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
            <div style={{ fontSize:40, filter:`drop-shadow(0 0 16px ${otherU.color}88)` }}>{otherU.avatar}</div>
            <div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{otherU.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
                <span className="dot-online" />
                <span style={{ color:"#34d399", fontSize:12, fontWeight:600 }}>Connected</span>
              </div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {[
              { label:"Resources", val: data.resources.filter(r=>r.owner===other).length },
              { label:"Doubts",    val: data.doubts.filter(d=>d.from===other).length },
            ].map(s => (
              <div key={s.label} style={{ background:"rgba(255,255,255,.04)", borderRadius:10, padding:"10px 14px" }}>
                <div style={{ color:otherU.color, fontWeight:800, fontSize:18 }}>{s.val}</div>
                <div style={{ color:"#3a3a55", fontSize:11, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// END OF SEGMENT 2
// ════════════════════════════════════════════════════════════════
//  STUDYBUDDY — SEGMENT 3 of 5
//  This segment: Timer · Schedule · Resources
// ════════════════════════════════════════════════════════════════

// ─── TIMER VIEW ───────────────────────────────────────────────────────────────
function TimerView({ data, update, userId, u, otherU, showToast }) {
  const [localSecs, setLocalSecs] = useState(data.timer.seconds);
  const [preset,    setPreset]    = useState(1500);
  const [label,     setLabel]     = useState(data.timer.label);
  const [sessions,  setSessions]  = useState([]);
  const itvRef = useRef(null);

  // sync display seconds from shared state
  useEffect(() => { setLocalSecs(data.timer.seconds); }, [data.timer.seconds]);
  useEffect(() => { setLabel(data.timer.label); },       [data.timer.label]);

  // tick when running
  useEffect(() => {
    if (data.timer.running) {
      itvRef.current = setInterval(() => {
        setLocalSecs(s => {
          if (s <= 1) { clearInterval(itvRef.current); showToast("Session complete! 🎉"); return 0; }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(itvRef.current);
    }
    return () => clearInterval(itvRef.current);
  }, [data.timer.running]);

  const start = () => {
    update(d => { d.timer = { running:true, seconds:preset, total:preset, label, startedBy:userId, startedAt:Date.now() }; });
    setLocalSecs(preset);
    showToast("Session started!");
  };
  const pause = () => { update(d => { d.timer.running = false; d.timer.seconds = localSecs; }); };
  const resume= () => { update(d => { d.timer.running = true; }); };
  const reset = () => {
    update(d => { d.timer = { running:false, seconds:preset, total:preset, label, startedBy:null, startedAt:null }; });
    setLocalSecs(preset);
  };
  const finish= () => {
    setSessions(prev => [...prev, { label, duration: preset - localSecs, ts: Date.now() }]);
    reset();
    showToast("Session logged! Great work 🔥");
  };

  const mins   = String(Math.floor(localSecs/60)).padStart(2,"0");
  const secs   = String(localSecs % 60).padStart(2,"0");
  const pct    = data.timer.total > 0 ? localSecs / data.timer.total : 1;
  const R      = 115;
  const circ   = 2 * Math.PI * R;

  const PRESETS = [
    { l:"15 min", s:900  },
    { l:"25 min", s:1500 },
    { l:"45 min", s:2700 },
    { l:"1 hour", s:3600 },
    { l:"90 min", s:5400 },
  ];
  const QUICK_LABELS = ["Focus Session","Deep Work","Revision","Practice Problems","Reading","Assignment"];

  return (
    <div className="anim-fadeUp" style={{ maxWidth:600, margin:"0 auto" }}>
      <SectionHeader title="Focus Timer" sub="Synced live with your partner — start together, stay in sync" color={u.color} />

      {/* Preset pills */}
      <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:20, flexWrap:"wrap" }}>
        {PRESETS.map(p => (
          <button key={p.l} onClick={() => { setPreset(p.s); if (!data.timer.running) setLocalSecs(p.s); }}
            style={{ background: preset===p.s ? u.colorDim : "rgba(255,255,255,.04)", border:`1px solid ${preset===p.s ? u.color+"55" : "rgba(255,255,255,.07)"}`, borderRadius:10, color: preset===p.s ? u.color : "#555", padding:"7px 16px", cursor:"pointer", fontSize:13, fontWeight:600, transition:"all .15s" }}>
            {p.l}
          </button>
        ))}
      </div>

      {/* Label input */}
      <div style={{ marginBottom:36, display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Session label…"
          style={{ ...iStyle(u.color), maxWidth:340, textAlign:"center", borderRadius:14 }} />
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
          {QUICK_LABELS.map(ql => (
            <button key={ql} onClick={() => setLabel(ql)}
              style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:8, color:"#3a3a55", padding:"4px 10px", cursor:"pointer", fontSize:12 }}>
              {ql}
            </button>
          ))}
        </div>
      </div>

      {/* Ring */}
      <div style={{ display:"flex", justifyContent:"center", marginBottom:40 }}>
        <div style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center", "--glow": u.color + "66", animation: data.timer.running ? "glowPulse 2.5s ease infinite" : "none" }}>
          <svg width={270} height={270} style={{ transform:"rotate(-90deg)" }}>
            {/* track */}
            <circle cx={135} cy={135} r={R} fill="none" stroke="rgba(255,255,255,.04)" strokeWidth={14} />
            {/* progress */}
            <circle cx={135} cy={135} r={R} fill="none" stroke={u.color} strokeWidth={14}
              strokeDasharray={circ}
              strokeDashoffset={circ * pct}
              strokeLinecap="round"
              style={{ transition:"stroke-dashoffset .9s cubic-bezier(.4,0,.2,1)", filter:`drop-shadow(0 0 8px ${u.color}88)` }}
            />
          </svg>
          <div style={{ position:"absolute", textAlign:"center" }}>
            <div style={{ fontFamily:"JetBrains Mono, monospace", color:"#fff", fontSize:58, fontWeight:500, letterSpacing:3, lineHeight:1 }}>{mins}:{secs}</div>
            <div style={{ color: data.timer.running ? "#34d399" : "#3a3a45", fontSize:12, fontWeight:700, marginTop:8, letterSpacing:2, textTransform:"uppercase" }}>
              {data.timer.running ? "● Running" : localSecs === data.timer.total ? "● Ready" : "● Paused"}
            </div>
            <div style={{ color:u.color, fontSize:13, marginTop:6, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{label}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:32 }}>
        {!data.timer.running && localSecs === (data.timer.total || preset) && (
          <button onClick={start} style={{ ...btnPrimary(u.color), padding:"14px 44px", fontSize:16 }}>▶ Start</button>
        )}
        {!data.timer.running && localSecs < (data.timer.total || preset) && localSecs > 0 && (
          <>
            <button onClick={resume} style={{ ...btnPrimary("#34d399"), padding:"14px 32px", fontSize:15 }}>▶ Resume</button>
            <button onClick={finish} style={{ ...btnPrimary("#818cf8"), padding:"14px 24px", fontSize:15 }}>✓ Finish</button>
          </>
        )}
        {data.timer.running && (
          <button onClick={pause} style={{ ...btnPrimary("#f59e0b"), padding:"14px 40px", fontSize:16 }}>⏸ Pause</button>
        )}
        <button onClick={reset} style={{ ...btnGhost, padding:"14px 22px" }}>↺ Reset</button>
      </div>

      {/* Live session banner */}
      {data.timer.running && (
        <div className="anim-scaleIn" style={{ background:"#34d39910", border:"1px solid #34d39930", borderRadius:16, padding:"16px 22px", textAlign:"center", marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>{otherU.avatar}</span>
            <span style={{ color:"#34d399", fontWeight:700 }}>You and {otherU.name} are studying together</span>
          </div>
        </div>
      )}

      {/* Session log */}
      {sessions.length > 0 && (
        <div style={{ ...cardStyle(), marginTop:8 }}>
          <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:14 }}>📊 Today's sessions</div>
          {sessions.map((s,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.04)", color:"#888", fontSize:13 }}>
              <span style={{ color:"#ccc" }}>{s.label}</span>
              <span style={{ fontFamily:"JetBrains Mono, monospace", color:u.color }}>{Math.floor(s.duration/60)}m</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", paddingTop:10, color:"#888", fontSize:13, fontWeight:600 }}>
            <span>Total focused</span>
            <span style={{ fontFamily:"JetBrains Mono, monospace", color:"#34d399" }}>{Math.floor(sessions.reduce((a,s)=>a+s.duration,0)/60)}m</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCHEDULE VIEW ────────────────────────────────────────────────────────────
function ScheduleView({ data, update, userId, u, otherU, other, showToast }) {
  const [form,   setForm]   = useState({ day:"Monday", time:"09:00", subject:"", duration:"60", color: u.color });
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  const DURATIONS = ["15","30","45","60","90","120"];

  const add = () => {
    if (!form.subject.trim()) { showToast("Add a subject name", "error"); return; }
    if (editId) {
      update(d => { const i = d.timetable.findIndex(x=>x.id===editId); if(i>-1) d.timetable[i]={...d.timetable[i],...form}; });
      setEditId(null);
      showToast("Session updated!");
    } else {
      update(d => { d.timetable.push({ id:Date.now(), ...form, owner:userId }); });
      showToast("Session added!");
    }
    setForm({ day:"Monday", time:"09:00", subject:"", duration:"60", color:u.color });
    setAdding(false);
  };

  const remove = (id) => { update(d => { d.timetable = d.timetable.filter(x=>x.id!==id); }); showToast("Removed"); };

  const startEdit = (s) => {
    setForm({ day:s.day, time:s.time, subject:s.subject, duration:s.duration, color:s.color||u.color });
    setEditId(s.id);
    setAdding(true);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const shown = data.timetable.filter(s => filter === "all" || s.owner === filter);

  // group by day
  const byDay = {};
  DAYS.forEach(d => { byDay[d] = shown.filter(s=>s.day===d).sort((a,b)=>a.time.localeCompare(b.time)); });

  return (
    <div className="anim-fadeUp">
      <SectionHeader
        title="Schedule"
        sub="Shared timetable — see each other's study plan"
        action={() => { setAdding(!adding); setEditId(null); }}
        actionLabel={adding ? "Cancel" : "+ Add Session"}
        color={u.color}
      />

      {/* Add / Edit form */}
      {adding && (
        <div className="anim-scaleIn" style={{ ...cardStyle(u.color), marginBottom:28, borderColor: u.color + "30" }}>
          <div style={{ color:u.color, fontWeight:700, fontSize:13, marginBottom:18, letterSpacing:1, textTransform:"uppercase" }}>
            {editId ? "✏ Edit session" : "+ New session"}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <select value={form.day} onChange={e=>setForm({...form,day:e.target.value})} style={iStyle(u.color)}>
              {DAYS.map(d=><option key={d} style={{background:"#111"}}>{d}</option>)}
            </select>
            <input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} style={iStyle(u.color)} />
          </div>
          <input placeholder="Subject / topic *" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={{ ...iStyle(u.color), marginBottom:12 }} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            <select value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} style={iStyle(u.color)}>
              {DURATIONS.map(d=><option key={d} style={{background:"#111"}}>{d} minutes</option>)}
            </select>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ color:"#555", fontSize:13 }}>Color:</span>
              {["#818cf8","#34d399","#f59e0b","#f87171","#c084fc","#38bdf8"].map(c=>(
                <div key={c} onClick={()=>setForm({...form,color:c})} style={{ width:22, height:22, borderRadius:"50%", background:c, cursor:"pointer", border: form.color===c ? "3px solid #fff" : "2px solid transparent", transition:"border .15s" }} />
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={add} style={btnPrimary(u.color)}>{editId ? "Save Changes" : "Add Session"}</button>
            {editId && <button onClick={()=>{setEditId(null);setAdding(false);}} style={btnGhost}>Cancel edit</button>}
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display:"flex", gap:8, marginBottom:24 }}>
        {[["all","All"],["A", data.users.A.avatar+" "+data.users.A.name],["B", data.users.B.avatar+" "+data.users.B.name]].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{ background: filter===k ? u.colorDim : "rgba(255,255,255,.03)", border:`1px solid ${filter===k ? u.color+"44" : "rgba(255,255,255,.06)"}`, borderRadius:10, color: filter===k ? u.color : "#444", padding:"7px 16px", cursor:"pointer", fontSize:13, fontWeight:500, transition:"all .15s" }}>{l}</button>
        ))}
      </div>

      {/* Days */}
      {DAYS.map(day => {
        if (!byDay[day].length) return null;
        const isToday = day === new Date().toLocaleDateString("en-US",{weekday:"long"});
        return (
          <div key={day} style={{ marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ color: isToday ? u.color : "#2a2a40", fontSize:11, fontWeight:700, letterSpacing:3, textTransform:"uppercase", fontFamily:"JetBrains Mono, monospace" }}>{day}</div>
              {isToday && <span style={{ background:u.colorDim, color:u.color, fontSize:10, fontWeight:800, borderRadius:6, padding:"2px 8px" }}>TODAY</span>}
              <div style={{ flex:1, height:1, background:"rgba(255,255,255,.04)" }} />
            </div>
            {byDay[day].map(s => {
              const owner = data.users[s.owner];
              const ac = s.color || owner.color;
              return (
                <div key={s.id} className="hover-lift" style={{ display:"flex", alignItems:"center", gap:16, background:"linear-gradient(145deg,#0c0c1e,#10101f)", border:"1px solid rgba(255,255,255,.05)", borderRadius:16, padding:"14px 20px", marginBottom:10, borderLeft:`3px solid ${ac}`, transition:"all .2s", animation:"slideRight .3s ease" }}>
                  <div style={{ fontFamily:"JetBrains Mono, monospace", color:ac, fontWeight:600, fontSize:14, minWidth:54 }}>{s.time}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{s.subject}</div>
                    <div style={{ color:"#3a3a55", fontSize:12, marginTop:3 }}>{s.duration} min · {owner.avatar} {owner.name}</div>
                  </div>
                  {s.owner === userId && (
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={()=>startEdit(s)} style={{ background:"none", border:"none", color:"#444", cursor:"pointer", fontSize:16, padding:"4px" }}>✏</button>
                      <button onClick={()=>remove(s.id)}  style={{ background:"none", border:"none", color:"#3a3a55", cursor:"pointer", fontSize:20, padding:"4px" }}>×</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {shown.length === 0 && <Empty icon="📅" title="No sessions yet" sub="Add your first study session above" />}
    </div>
  );
}

// ─── RESOURCES VIEW ───────────────────────────────────────────────────────────
function ResourcesView({ data, update, userId, u, otherU, other, showToast }) {
  const [form,    setForm]    = useState({ title:"", url:"", note:"", type:"link" });
  const [open,    setOpen]    = useState(false);
  const [filter,  setFilter]  = useState("all");
  const [search,  setSearch]  = useState("");
  const [typeF,   setTypeF]   = useState("all");

  const TYPES = {
    link:     { icon:"🔗", label:"Link"     },
    note:     { icon:"📝", label:"Note"     },
    video:    { icon:"▶",  label:"Video"    },
    pdf:      { icon:"📄", label:"PDF"      },
    question: { icon:"❓", label:"Question" },
    formula:  { icon:"⚗",  label:"Formula"  },
    image:    { icon:"🖼",  label:"Image"    },
  };

  const add = () => {
    if (!form.title.trim()) { showToast("Title is required","error"); return; }
    update(d => { d.resources.push({ id:Date.now(), ...form, owner:userId, ts:Date.now(), pinned:false }); });
    setForm({ title:"", url:"", note:"", type:"link" });
    setOpen(false);
    showToast("Resource shared!");
  };

  const togglePin = (id) => { update(d => { const r=d.resources.find(x=>x.id===id); if(r) r.pinned=!r.pinned; }); };
  const remove    = (id) => { update(d => { d.resources = d.resources.filter(x=>x.id!==id); }); showToast("Removed"); };

  let items = [...data.resources];
  if (filter !== "all")  items = items.filter(r => r.owner === filter);
  if (typeF  !== "all")  items = items.filter(r => r.type  === typeF);
  if (search.trim())     items = items.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.note?.toLowerCase().includes(search.toLowerCase()));
  items.sort((a,b) => (b.pinned ? 1:0) - (a.pinned ? 1:0) || b.ts - a.ts);

  const pinned   = items.filter(r => r.pinned);
  const unpinned = items.filter(r => !r.pinned);

  return (
    <div className="anim-fadeUp">
      <SectionHeader title="Resources" sub="Share links, notes, videos, PDFs and more" action={()=>setOpen(!open)} actionLabel={open?"Cancel":"+ Share"} color={u.color} />

      {/* Search */}
      <div style={{ position:"relative", marginBottom:16 }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#3a3a55", fontSize:16 }}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search resources…"
          style={{ ...iStyle(u.color), paddingLeft:42 }} />
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {[["all","All"],["A", data.users.A.avatar],["B", data.users.B.avatar]].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{ background:filter===k?u.colorDim:"rgba(255,255,255,.03)", border:`1px solid ${filter===k?u.color+"44":"rgba(255,255,255,.06)"}`, borderRadius:10, color:filter===k?u.color:"#444", padding:"5px 14px", cursor:"pointer", fontSize:13, transition:"all .15s" }}>{l}</button>
        ))}
        <div style={{ width:1, background:"rgba(255,255,255,.06)", margin:"0 4px" }} />
        {[["all","All types"], ...Object.entries(TYPES).map(([k,v])=>[k,v.icon])].map(([k,l])=>(
          <button key={k} onClick={()=>setTypeF(k)} style={{ background:typeF===k?u.colorDim:"rgba(255,255,255,.03)", border:`1px solid ${typeF===k?u.color+"44":"rgba(255,255,255,.06)"}`, borderRadius:10, color:typeF===k?u.color:"#444", padding:"5px 14px", cursor:"pointer", fontSize:13, transition:"all .15s" }}>{l}</button>
        ))}
      </div>

      {/* Add form */}
      {open && (
        <div className="anim-scaleIn" style={{ ...cardStyle(u.color), marginBottom:24, borderColor:u.color+"30" }}>
          <div style={{ color:u.color, fontWeight:700, fontSize:13, marginBottom:14, letterSpacing:1, textTransform:"uppercase" }}>Share a resource</div>
          {/* Type selector */}
          <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
            {Object.entries(TYPES).map(([t,{icon,label}])=>(
              <button key={t} onClick={()=>setForm({...form,type:t})} style={{ background:form.type===t?u.colorDim:"rgba(255,255,255,.04)", border:`1px solid ${form.type===t?u.color:"rgba(255,255,255,.07)"}`, borderRadius:10, color:form.type===t?u.color:"#555", padding:"6px 14px", cursor:"pointer", fontSize:13, transition:"all .15s" }}>
                {icon} {label}
              </button>
            ))}
          </div>
          <input placeholder="Title *" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{ ...iStyle(u.color), marginBottom:10 }} />
          {["link","video","pdf","image"].includes(form.type) && (
            <input placeholder="Paste URL here" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} style={{ ...iStyle(u.color), marginBottom:10 }} />
          )}
          <textarea placeholder="Notes or description…" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} rows={2}
            style={{ ...iStyle(u.color), resize:"vertical", marginBottom:14 }} />
          <button onClick={add} style={btnPrimary(u.color)}>Share Resource</button>
        </div>
      )}

      {/* Pinned */}
      {pinned.length > 0 && (
        <div style={{ marginBottom:24 }}>
          <div style={{ color:"#f59e0b", fontSize:12, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:12, fontFamily:"JetBrains Mono, monospace" }}>📌 Pinned</div>
          {pinned.map(r => <ResourceCard key={r.id} r={r} userId={userId} data={data} TYPES={TYPES} u={u} onPin={()=>togglePin(r.id)} onDelete={()=>remove(r.id)} />)}
        </div>
      )}

      {unpinned.map(r => <ResourceCard key={r.id} r={r} userId={userId} data={data} TYPES={TYPES} u={u} onPin={()=>togglePin(r.id)} onDelete={()=>remove(r.id)} />)}

      {items.length === 0 && <Empty icon="📁" title="No resources found" sub="Share your first resource or adjust filters" />}
    </div>
  );
}

function ResourceCard({ r, userId, data, TYPES, u, onPin, onDelete }) {
  const owner = data.users[r.owner];
  const info  = TYPES[r.type] || { icon:"📌" };
  return (
    <div className="hover-lift" style={{ background:"linear-gradient(145deg,#0c0c1e,#10101f)", border:"1px solid rgba(255,255,255,.05)", borderRadius:18, padding:"18px 22px", marginBottom:12, borderLeft:`3px solid ${owner.color}`, animation:"slideRight .3s ease" }}>
      <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
        <div style={{ fontSize:28, marginTop:2, flexShrink:0 }}>{info.icon}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:4 }}>{r.title}</div>
          {r.url && (
            <a href={r.url} target="_blank" rel="noreferrer" style={{ color:owner.color, fontSize:13, display:"block", marginBottom:6, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {r.url}
            </a>
          )}
          {r.note && <div style={{ color:"#666", fontSize:13, lineHeight:1.6, marginBottom:8 }}>{r.note}</div>}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ color:"#2a2a40", fontSize:11, fontFamily:"JetBrains Mono, monospace" }}>{owner.avatar} {owner.name} · {timeAgo(r.ts)}</span>
            {r.pinned && <span style={{ color:"#f59e0b", fontSize:11, fontWeight:700 }}>📌 pinned</span>}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
          <button onClick={onPin}    style={{ background:"none", border:"none", color: r.pinned ? "#f59e0b" : "#2a2a40", cursor:"pointer", fontSize:16 }}>📌</button>
          {r.owner === userId && <button onClick={onDelete} style={{ background:"none", border:"none", color:"#2a2a40", cursor:"pointer", fontSize:20, lineHeight:1 }}>×</button>}
        </div>
      </div>
    </div>
  );
}

// END OF SEGMENT 3
// ════════════════════════════════════════════════════════════════
//  STUDYBUDDY — SEGMENT 4 of 5
//  This segment: Doubts · Chat
// ════════════════════════════════════════════════════════════════

// ─── DOUBTS VIEW ──────────────────────────────────────────────────────────────
function DoubtsView({ data, update, userId, u, otherU, other, showToast }) {
  const [question, setQuestion] = useState("");
  const [subject,  setSubject]  = useState("");
  const [urgency,  setUrgency]  = useState("normal");
  const [ansMap,   setAnsMap]   = useState({});
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const textRef = useRef(null);

  const post = () => {
    if (!question.trim()) { showToast("Type your question first","error"); return; }
    update(d => {
      d.doubts.push({
        id: Date.now(),
        question: question.trim(),
        subject:  subject.trim(),
        urgency,
        from:     userId,
        answer:   null,
        answeredBy: null,
        ts:       Date.now(),
        upvotes:  [],
      });
    });
    setQuestion(""); setSubject(""); setUrgency("normal");
    showToast("Doubt posted!");
  };

  const answer = (id) => {
    const text = ansMap[id]?.trim();
    if (!text) { showToast("Write an answer first","error"); return; }
    update(d => {
      const dbt = d.doubts.find(x => x.id === id);
      if (dbt) { dbt.answer = text; dbt.answeredBy = userId; dbt.answeredAt = Date.now(); }
    });
    setAnsMap(p => { const n={...p}; delete n[id]; return n; });
    showToast("Answer posted! ✓");
  };

  const upvote = (id) => {
    update(d => {
      const dbt = d.doubts.find(x=>x.id===id);
      if (!dbt) return;
      if (!dbt.upvotes) dbt.upvotes = [];
      if (dbt.upvotes.includes(userId)) dbt.upvotes = dbt.upvotes.filter(x=>x!==userId);
      else dbt.upvotes.push(userId);
    });
  };

  const remove = (id) => { update(d => { d.doubts = d.doubts.filter(x=>x.id!==id); }); showToast("Removed"); };

  const URGENCY = {
    low:    { label:"Low",    color:"#34d399" },
    normal: { label:"Normal", color:"#818cf8" },
    urgent: { label:"Urgent", color:"#f87171" },
  };

  let items = [...data.doubts];
  if (filter === "mine")       items = items.filter(d => d.from === userId);
  if (filter === "unanswered") items = items.filter(d => !d.answer);
  if (filter === "answered")   items = items.filter(d =>  d.answer);
  if (search.trim())           items = items.filter(d => d.question.toLowerCase().includes(search.toLowerCase()) || d.subject?.toLowerCase().includes(search.toLowerCase()));
  items.sort((a,b) => {
    const urgencyScore = (u) => u==="urgent"?2:u==="normal"?1:0;
    const uDiff = urgencyScore(b.urgency) - urgencyScore(a.urgency);
    return uDiff !== 0 ? uDiff : b.ts - a.ts;
  });

  const unansweredCount = data.doubts.filter(d => d.from !== userId && !d.answer).length;

  return (
    <div className="anim-fadeUp">
      <SectionHeader title="Doubts & Q&A" sub="Post questions, get answers from your study partner" color={u.color} />

      {unansweredCount > 0 && (
        <div className="anim-scaleIn" style={{ background:"#f8717115", border:"1px solid #f8717130", borderRadius:14, padding:"12px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:20 }}>❗</span>
          <span style={{ color:"#f87171", fontWeight:600, fontSize:14 }}>{unansweredCount} doubt{unansweredCount>1?"s":""} waiting for your answer</span>
          <button onClick={()=>setFilter("unanswered")} style={{ marginLeft:"auto", background:"#f8717120", border:"1px solid #f8717140", borderRadius:8, color:"#f87171", padding:"5px 12px", cursor:"pointer", fontSize:12, fontWeight:600 }}>View →</button>
        </div>
      )}

      {/* Post form */}
      <div style={{ ...cardStyle(u.color), borderColor:u.color+"25", marginBottom:28 }}>
        <div style={{ color:u.color, fontWeight:700, fontSize:13, marginBottom:16, letterSpacing:1, textTransform:"uppercase" }}>Post a doubt</div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:12, marginBottom:12 }}>
          <input placeholder="Subject (e.g. Maths, Chemistry, History…)" value={subject} onChange={e=>setSubject(e.target.value)} style={iStyle(u.color)} />
          <div style={{ display:"flex", gap:8 }}>
            {Object.entries(URGENCY).map(([k,{label,color}])=>(
              <button key={k} onClick={()=>setUrgency(k)} style={{ background: urgency===k?`${color}20`:"rgba(255,255,255,.04)", border:`1px solid ${urgency===k?color+"55":"rgba(255,255,255,.07)"}`, borderRadius:10, color: urgency===k?color:"#555", padding:"9px 14px", cursor:"pointer", fontSize:12, fontWeight:600, whiteSpace:"nowrap", transition:"all .15s" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          ref={textRef}
          placeholder="Write your doubt or question in detail… (Shift+Enter for new line, Enter to post)"
          value={question}
          onChange={e=>setQuestion(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); post(); } }}
          rows={4}
          style={{ ...iStyle(u.color), resize:"vertical", marginBottom:14 }}
        />
        <button onClick={post} style={btnPrimary(u.color)}>Post Doubt</button>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#3a3a55" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search doubts…"
            style={{ ...iStyle(), paddingLeft:38, width:"100%" }} />
        </div>
        {[["all","All"],["mine","Mine"],["unanswered","Unanswered"],["answered","Answered"]].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{ background:filter===k?u.colorDim:"rgba(255,255,255,.03)", border:`1px solid ${filter===k?u.color+"44":"rgba(255,255,255,.06)"}`, borderRadius:10, color:filter===k?u.color:"#444", padding:"7px 14px", cursor:"pointer", fontSize:13, transition:"all .15s", whiteSpace:"nowrap" }}>{l}</button>
        ))}
      </div>

      {/* Doubt cards */}
      {items.length === 0 && <Empty icon="💭" title="No doubts here" sub="Post your first question above" />}

      {items.map(dbt => {
        const asker    = data.users[dbt.from];
        const canAnswer= dbt.from !== userId && !dbt.answer;
        const urg      = URGENCY[dbt.urgency] || URGENCY.normal;
        const hasUpvoted = (dbt.upvotes||[]).includes(userId);

        return (
          <div key={dbt.id} className="hover-lift" style={{ background:"linear-gradient(145deg,#0c0c1e,#10101f)", border:"1px solid rgba(255,255,255,.05)", borderRadius:20, padding:"20px 22px", marginBottom:16, borderLeft:`3px solid ${urg.color}`, animation:"slideRight .35s ease" }}>
            <div style={{ display:"flex", gap:14 }}>
              <div style={{ fontSize:32, flexShrink:0, marginTop:2 }}>{asker.avatar}</div>
              <div style={{ flex:1, minWidth:0 }}>
                {/* Header */}
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                  {dbt.subject && (
                    <span style={{ background:asker.colorDim||asker.color+"20", color:asker.color, fontSize:11, fontWeight:700, borderRadius:8, padding:"3px 10px", letterSpacing:1, textTransform:"uppercase" }}>{dbt.subject}</span>
                  )}
                  <span style={{ background:urg.color+"20", color:urg.color, fontSize:11, fontWeight:700, borderRadius:8, padding:"3px 10px" }}>{urg.label}</span>
                  {dbt.answer && <span style={{ background:"#34d39920", color:"#34d399", fontSize:11, fontWeight:700, borderRadius:8, padding:"3px 10px" }}>✓ Answered</span>}
                </div>

                {/* Question */}
                <div style={{ color:"#e2e2f0", fontSize:15, lineHeight:1.7, marginBottom:8, whiteSpace:"pre-wrap" }}>{dbt.question}</div>

                {/* Meta */}
                <div style={{ color:"#2a2a40", fontSize:11, marginBottom:12, fontFamily:"JetBrains Mono, monospace" }}>
                  {asker.name} · {timeAgo(dbt.ts)}
                </div>

                {/* Answer block */}
                {dbt.answer && (
                  <div style={{ background:"#34d39910", border:"1px solid #34d39925", borderRadius:14, padding:"14px 18px", marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:18 }}>{data.users[dbt.answeredBy]?.avatar}</span>
                      <span style={{ color:"#34d399", fontWeight:700, fontSize:13 }}>{data.users[dbt.answeredBy]?.name} answered</span>
                      <span style={{ color:"#2a2a40", fontSize:11, marginLeft:"auto", fontFamily:"JetBrains Mono, monospace" }}>{timeAgo(dbt.answeredAt||dbt.ts)}</span>
                    </div>
                    <div style={{ color:"#ccc", fontSize:14, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{dbt.answer}</div>
                  </div>
                )}

                {/* Answer input */}
                {canAnswer && (
                  <div style={{ display:"flex", gap:8 }}>
                    <textarea
                      placeholder="Type your answer… (Enter to post)"
                      value={ansMap[dbt.id]||""}
                      onChange={e=>setAnsMap(p=>({...p,[dbt.id]:e.target.value}))}
                      onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();answer(dbt.id);} }}
                      rows={2}
                      style={{ ...iStyle(u.color), resize:"vertical", flex:1 }}
                    />
                    <button onClick={()=>answer(dbt.id)} style={{ ...btnPrimary("#34d399"), alignSelf:"flex-end", whiteSpace:"nowrap" }}>Answer</button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                <button onClick={()=>upvote(dbt.id)} style={{ background: hasUpvoted ? "#818cf820":"none", border: hasUpvoted ? "1px solid #818cf844":"none", borderRadius:8, color: hasUpvoted ? "#818cf8":"#3a3a55", cursor:"pointer", fontSize:14, padding:"4px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                  ▲
                  <span style={{ fontSize:10, fontFamily:"JetBrains Mono, monospace" }}>{(dbt.upvotes||[]).length}</span>
                </button>
                {dbt.from === userId && (
                  <button onClick={()=>remove(dbt.id)} style={{ background:"none", border:"none", color:"#2a2a40", cursor:"pointer", fontSize:18, padding:"4px" }}>×</button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── CHAT VIEW ────────────────────────────────────────────────────────────────
function ChatView({ data, update, userId, u, otherU, other, showToast }) {
  const [msg,       setMsg]       = useState("");
  const [replyTo,   setReplyTo]   = useState(null);
  const [reacting,  setReacting]  = useState(null);
  const endRef   = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [data.chat.length]);

  const EMOJI_REACTIONS = ["👍","🔥","💡","✅","❤️","😂","🤔","👏"];

  const send = () => {
    const text = msg.trim();
    if (!text) return;
    update(d => {
      d.chat.push({
        id:      Date.now(),
        text,
        from:    userId,
        ts:      Date.now(),
        replyTo: replyTo ? { id: replyTo.id, text: replyTo.text, from: replyTo.from } : null,
        reactions: {},
        edited:  false,
      });
    });
    setMsg(""); setReplyTo(null);
  };

  const addReaction = (msgId, emoji) => {
    update(d => {
      const m = d.chat.find(x=>x.id===msgId);
      if (!m) return;
      if (!m.reactions) m.reactions = {};
      if (!m.reactions[emoji]) m.reactions[emoji] = [];
      const idx = m.reactions[emoji].indexOf(userId);
      if (idx > -1) m.reactions[emoji].splice(idx, 1);
      else m.reactions[emoji].push(userId);
      if (m.reactions[emoji].length === 0) delete m.reactions[emoji];
    });
    setReacting(null);
  };

  const deleteMsg = (id) => { update(d => { d.chat = d.chat.filter(x=>x.id!==id); }); };

  const startReply = (m) => { setReplyTo(m); inputRef.current?.focus(); };

  // group consecutive messages from same sender
  const grouped = data.chat.map((m, i) => ({
    ...m,
    isFirst: i === 0 || data.chat[i-1].from !== m.from,
    isLast:  i === data.chat.length-1 || data.chat[i+1].from !== m.from,
  }));

  return (
    <div className="anim-fadeUp" style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 130px)", minHeight:500 }}>
      {/* Header */}
      <div style={{ marginBottom:20, paddingBottom:16, borderBottom:"1px solid rgba(255,255,255,.05)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <h2 style={{ color:"#fff", fontWeight:800, fontSize:28, letterSpacing:"-1px" }}>Chat</h2>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:5 }}>
              <span className="dot-online" />
              <span style={{ color:"#34d399", fontSize:12, fontWeight:600 }}>{otherU.avatar} {otherU.name} is online</span>
            </div>
          </div>
          {data.chat.length > 0 && (
            <button onClick={()=>{ if(window.confirm("Clear all messages?")) { update(d=>{d.chat=[];}); } }} style={{ ...btnGhost, fontSize:12, color:"#f87171", borderColor:"#f8717130" }}>Clear chat</button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:2, paddingRight:4, marginBottom:16 }}>
        {data.chat.length === 0 && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#2a2a40" }}>
            <div style={{ fontSize:56, marginBottom:14, filter:"grayscale(1)" }}>💬</div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:6, color:"#3a3a55" }}>No messages yet</div>
            <div style={{ fontSize:13 }}>Send the first message to {otherU.name}!</div>
          </div>
        )}

        {grouped.map(m => {
          const isMe   = m.from === userId;
          const sender = data.users[m.from];
          const isReacting = reacting === m.id;
          const replyMsg = m.replyTo ? data.chat.find(x=>x.id===m.replyTo.id) : null;

          return (
            <div key={m.id} style={{ display:"flex", flexDirection:"column", alignItems: isMe?"flex-end":"flex-start", marginBottom: m.isLast ? 10 : 2, animation:"slideRight .2s ease" }}>
              {/* Avatar + name (first in group) */}
              {m.isFirst && !isMe && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, marginLeft:44 }}>
                  <span style={{ fontSize:14, color:sender.color, fontWeight:700 }}>{sender.name}</span>
                </div>
              )}

              <div style={{ display:"flex", alignItems:"flex-end", gap:8, maxWidth:"75%", flexDirection: isMe?"row-reverse":"row" }}>
                {/* Avatar */}
                {m.isLast ? (
                  <div style={{ fontSize:22, flexShrink:0, marginBottom:4 }}>{sender.avatar}</div>
                ) : <div style={{ width:30 }} />}

                {/* Bubble + actions */}
                <div style={{ position:"relative" }}>
                  {/* Reply preview */}
                  {m.replyTo && (
                    <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"10px 10px 0 0", padding:"8px 14px", maxWidth:"100%", borderBottom:"none" }}>
                      <div style={{ color: data.users[m.replyTo.from]?.color || "#888", fontSize:11, fontWeight:700, marginBottom:2 }}>{data.users[m.replyTo.from]?.name}</div>
                      <div style={{ color:"#666", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:200 }}>{m.replyTo.text}</div>
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    onMouseEnter={e=>e.currentTarget.querySelector(".msg-actions")?.style&&(e.currentTarget.querySelector(".msg-actions").style.opacity="1")}
                    onMouseLeave={e=>e.currentTarget.querySelector(".msg-actions")?.style&&(e.currentTarget.querySelector(".msg-actions").style.opacity="0")}
                    style={{ position:"relative" }}
                  >
                    <div style={{
                      background: isMe ? `linear-gradient(135deg,${sender.color}35,${sender.color}20)` : "rgba(255,255,255,.06)",
                      border:     `1px solid ${isMe ? sender.color+"30" : "rgba(255,255,255,.07)"}`,
                      borderRadius: m.replyTo
                        ? (isMe ? "0 0 4px 16px" : "0 0 16px 4px")
                        : (isMe
                          ? (m.isFirst ? "16px 4px 16px 16px" : "16px 4px 16px 16px")
                          : (m.isFirst ? "4px 16px 16px 16px" : "4px 16px 16px 16px")),
                      padding: "10px 16px",
                    }}>
                      <div style={{ color:"#e2e2f0", fontSize:14, lineHeight:1.65, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{m.text}</div>
                      <div style={{ color:"#3a3a45", fontSize:10, marginTop:5, textAlign:isMe?"right":"left", fontFamily:"JetBrains Mono, monospace" }}>
                        {new Date(m.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                        {m.edited && " · edited"}
                      </div>
                    </div>

                    {/* Hover actions */}
                    <div className="msg-actions" style={{ position:"absolute", top:-28, [isMe?"left":"right"]:-4, display:"flex", gap:4, background:"#111120", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:"4px 8px", opacity:0, transition:"opacity .15s", zIndex:10, whiteSpace:"nowrap" }}>
                      <button onClick={()=>setReacting(isReacting?null:m.id)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, padding:"2px 4px" }}>😊</button>
                      <button onClick={()=>startReply(m)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:"#888", padding:"2px 6px" }}>↩</button>
                      {m.from===userId && <button onClick={()=>deleteMsg(m.id)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:"#f87171", padding:"2px 4px" }}>×</button>}
                    </div>

                    {/* Emoji picker */}
                    {isReacting && (
                      <div style={{ position:"absolute", top:-52, [isMe?"right":"left"]:0, display:"flex", gap:6, background:"#111120", border:"1px solid rgba(255,255,255,.1)", borderRadius:14, padding:"8px 12px", zIndex:20 }}>
                        {EMOJI_REACTIONS.map(emoji => (
                          <button key={emoji} onClick={()=>addReaction(m.id,emoji)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, transition:"transform .1s" }}
                            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.3)"}
                            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                          >{emoji}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reactions display */}
                  {m.reactions && Object.keys(m.reactions).length > 0 && (
                    <div style={{ display:"flex", gap:4, marginTop:4, flexWrap:"wrap", justifyContent:isMe?"flex-end":"flex-start" }}>
                      {Object.entries(m.reactions).filter(([,users])=>users.length>0).map(([emoji,users])=>(
                        <button key={emoji} onClick={()=>addReaction(m.id,emoji)} style={{ background: users.includes(userId)?"rgba(129,140,248,.2)":"rgba(255,255,255,.05)", border:`1px solid ${users.includes(userId)?"#818cf840":"rgba(255,255,255,.08)"}`, borderRadius:20, padding:"2px 8px", cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", gap:4 }}>
                          {emoji}<span style={{ fontSize:10, color:"#888" }}>{users.length}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Reply preview bar */}
      {replyTo && (
        <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:"8px 14px", marginBottom:8 }}>
          <span style={{ color:data.users[replyTo.from]?.color, fontSize:12, fontWeight:700 }}>↩ Replying to {data.users[replyTo.from]?.name}</span>
          <span style={{ color:"#555", fontSize:12, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{replyTo.text}</span>
          <button onClick={()=>setReplyTo(null)} style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:16 }}>×</button>
        </div>
      )}

      {/* Input bar */}
      <div style={{ display:"flex", gap:10, alignItems:"flex-end", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:20, padding:"10px 10px 10px 18px" }}>
        <textarea
          ref={inputRef}
          value={msg}
          onChange={e=>setMsg(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); } }}
          placeholder={`Message ${otherU.name}… (Enter to send, Shift+Enter for newline)`}
          rows={1}
          style={{ background:"none", border:"none", color:"#e2e2f0", fontSize:14, flex:1, resize:"none", lineHeight:1.5, maxHeight:120, overflow:"auto", fontFamily:"Sora, sans-serif" }}
        />
        <button onClick={send} disabled={!msg.trim()} style={{
          background: msg.trim() ? `linear-gradient(135deg,${u.color},${u.color}cc)` : "rgba(255,255,255,.05)",
          border:"none", borderRadius:14, color: msg.trim()?"#000":"#3a3a55",
          padding:"10px 22px", fontWeight:700, cursor: msg.trim()?"pointer":"default",
          fontSize:14, transition:"all .2s", flexShrink:0, fontFamily:"Sora, sans-serif",
          boxShadow: msg.trim() ? `0 4px 16px ${u.color}44` : "none",
        }}>Send</button>
      </div>
    </div>
  );
}

// END OF SEGMENT 4
// ════════════════════════════════════════════════════════════════
//  STUDYBUDDY — SEGMENT 5 of 5
//  This segment: Notes · Goals
//  ── After pasting all 5 segments into one file, delete all
//     "// END OF SEGMENT X" and "// SEGMENT X of 5" comments ──
// ════════════════════════════════════════════════════════════════

// ─── NOTES VIEW ───────────────────────────────────────────────────────────────
function NotesView({ data, update, userId, u, otherU, other, showToast }) {
  const [title,    setTitle]    = useState("");
  const [body,     setBody]     = useState("");
  const [tag,      setTag]      = useState("");
  const [editId,   setEditId]   = useState(null);
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");

  const COLORS = ["#818cf8","#34d399","#f59e0b","#f87171","#c084fc","#38bdf8","#fb923c"];

  const [noteColor, setNoteColor] = useState(COLORS[0]);

  const save = () => {
    if (!title.trim()) { showToast("Add a title","error"); return; }
    if (editId) {
      update(d => {
        const n = d.notes.find(x=>x.id===editId);
        if (n) { n.title=title; n.body=body; n.tag=tag; n.color=noteColor; n.updatedAt=Date.now(); }
      });
      showToast("Note updated!");
    } else {
      update(d => {
        d.notes.push({ id:Date.now(), title, body, tag, color:noteColor, owner:userId, ts:Date.now(), updatedAt:Date.now(), pinned:false });
      });
      showToast("Note saved!");
    }
    setTitle(""); setBody(""); setTag(""); setNoteColor(COLORS[0]); setEditId(null);
  };

  const startEdit = (n) => {
    setTitle(n.title); setBody(n.body||""); setTag(n.tag||""); setNoteColor(n.color||COLORS[0]); setEditId(n.id); setSelected(null);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const remove  = (id)  => { update(d => { d.notes = d.notes.filter(x=>x.id!==id); }); setSelected(null); showToast("Note deleted"); };
  const pinNote = (id)  => { update(d => { const n=d.notes.find(x=>x.id===id); if(n) n.pinned=!n.pinned; }); };

  let notes = [...(data.notes||[])];
  if (filter !== "all")  notes = notes.filter(n => n.owner === filter);
  if (search.trim())     notes = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.body?.toLowerCase().includes(search.toLowerCase()) || n.tag?.toLowerCase().includes(search.toLowerCase()));
  notes.sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||(b.updatedAt||b.ts)-(a.updatedAt||a.ts));

  const viewNote = selected ? data.notes?.find(x=>x.id===selected) : null;

  return (
    <div className="anim-fadeUp">
      <SectionHeader title="Shared Notes" sub="Write and share notes with your study partner" color={u.color} />

      {/* Write form */}
      <div style={{ ...cardStyle(u.color), borderColor:u.color+"25", marginBottom:28 }}>
        <div style={{ color:u.color, fontWeight:700, fontSize:13, marginBottom:16, letterSpacing:1, textTransform:"uppercase" }}>
          {editId ? "✏ Edit note" : "+ New note"}
        </div>
        <input placeholder="Note title *" value={title} onChange={e=>setTitle(e.target.value)} style={{ ...iStyle(u.color), marginBottom:10 }} />
        <textarea placeholder="Write your note here… formulas, summaries, key points, anything!" value={body} onChange={e=>setBody(e.target.value)} rows={5}
          style={{ ...iStyle(u.color), resize:"vertical", marginBottom:10 }} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:12, marginBottom:16 }}>
          <input placeholder="Tag (e.g. Maths, Important, Chapter 3)" value={tag} onChange={e=>setTag(e.target.value)} style={iStyle(u.color)} />
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            {COLORS.map(c=>(
              <div key={c} onClick={()=>setNoteColor(c)} style={{ width:20, height:20, borderRadius:"50%", background:c, cursor:"pointer", border: noteColor===c?"3px solid #fff":"2px solid transparent", transition:"border .12s" }} />
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={save} style={btnPrimary(u.color)}>{editId ? "Save changes" : "Save Note"}</button>
          {editId && <button onClick={()=>{setEditId(null);setTitle("");setBody("");setTag("");}} style={btnGhost}>Cancel</button>}
        </div>
      </div>

      {/* Search + filter */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#3a3a55" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search notes…"
            style={{ ...iStyle(), paddingLeft:38, width:"100%" }} />
        </div>
        {[["all","All"],["A",data.users.A.avatar+" "+data.users.A.name],["B",data.users.B.avatar+" "+data.users.B.name]].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{ background:filter===k?u.colorDim:"rgba(255,255,255,.03)", border:`1px solid ${filter===k?u.color+"44":"rgba(255,255,255,.06)"}`, borderRadius:10, color:filter===k?u.color:"#444", padding:"7px 14px", cursor:"pointer", fontSize:13, transition:"all .15s" }}>{l}</button>
        ))}
      </div>

      {/* Note detail view */}
      {viewNote && (
        <div className="anim-scaleIn" style={{ ...cardStyle(viewNote.color), borderColor:viewNote.color+"40", marginBottom:24, position:"relative" }}>
          <button onClick={()=>setSelected(null)} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:24 }}>×</button>
          {viewNote.tag && <span style={{ background:viewNote.color+"20", color:viewNote.color, fontSize:11, fontWeight:700, borderRadius:8, padding:"3px 10px", marginBottom:12, display:"inline-block" }}>{viewNote.tag}</span>}
          <div style={{ color:"#fff", fontWeight:800, fontSize:22, marginBottom:12 }}>{viewNote.title}</div>
          <div style={{ color:"#ccc", fontSize:14, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{viewNote.body || <span style={{color:"#3a3a55"}}>No content</span>}</div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:16, paddingTop:12, borderTop:"1px solid rgba(255,255,255,.06)" }}>
            <span style={{ color:"#2a2a40", fontSize:12, fontFamily:"JetBrains Mono, monospace", flex:1 }}>{data.users[viewNote.owner]?.avatar} {data.users[viewNote.owner]?.name} · {timeAgo(viewNote.updatedAt||viewNote.ts)}</span>
            {viewNote.owner === userId && (
              <>
                <button onClick={()=>startEdit(viewNote)} style={{ ...btnGhost, padding:"6px 14px", fontSize:12 }}>✏ Edit</button>
                <button onClick={()=>remove(viewNote.id)} style={{ ...btnGhost, padding:"6px 14px", fontSize:12, color:"#f87171", borderColor:"#f8717130" }}>Delete</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Notes grid */}
      {notes.length === 0 && <Empty icon="📝" title="No notes yet" sub="Write your first note above" />}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
        {notes.map(n => {
          const owner = data.users[n.owner];
          return (
            <div key={n.id} className="hover-lift" onClick={()=>setSelected(n.id)} style={{ background:`linear-gradient(145deg, ${n.color}0a, #0c0c1e)`, border:`1px solid ${n.color}25`, borderRadius:18, padding:"18px 20px", cursor:"pointer", position:"relative", overflow:"hidden", minHeight:140 }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:n.color, borderRadius:"18px 18px 0 0" }} />
              {n.pinned && <div style={{ position:"absolute", top:10, right:10, fontSize:14 }}>📌</div>}
              {n.tag && <div style={{ background:n.color+"20", color:n.color, fontSize:10, fontWeight:700, borderRadius:6, padding:"2px 8px", display:"inline-block", marginBottom:8 }}>{n.tag}</div>}
              <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:8, lineHeight:1.3 }}>{n.title}</div>
              {n.body && <div style={{ color:"#555", fontSize:13, lineHeight:1.6, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical" }}>{n.body}</div>}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:14, paddingTop:10, borderTop:"1px solid rgba(255,255,255,.04)" }}>
                <span style={{ color:"#2a2a40", fontSize:11 }}>{owner.avatar} {timeAgo(n.updatedAt||n.ts)}</span>
                {n.owner === userId && (
                  <div style={{ display:"flex", gap:4 }} onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>pinNote(n.id)} style={{ background:"none", border:"none", color: n.pinned?"#f59e0b":"#2a2a40", cursor:"pointer", fontSize:14, padding:"2px" }}>📌</button>
                    <button onClick={()=>startEdit(n)} style={{ background:"none", border:"none", color:"#2a2a40", cursor:"pointer", fontSize:14, padding:"2px" }}>✏</button>
                    <button onClick={()=>remove(n.id)} style={{ background:"none", border:"none", color:"#2a2a40", cursor:"pointer", fontSize:16, padding:"2px" }}>×</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── GOALS VIEW ───────────────────────────────────────────────────────────────
function GoalsView({ data, update, userId, u, otherU, other, showToast }) {
  const [text,     setText]     = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("study");
  const [viewUser, setViewUser] = useState(userId);

  const CATS = {
    study:    { icon:"📚", label:"Study",    color:"#818cf8" },
    exercise: { icon:"💪", label:"Exercise", color:"#34d399" },
    personal: { icon:"⭐", label:"Personal", color:"#f59e0b" },
    project:  { icon:"🚀", label:"Project",  color:"#c084fc" },
    revision: { icon:"📖", label:"Revision", color:"#38bdf8" },
  };

  const addGoal = () => {
    if (!text.trim()) { showToast("Write a goal","error"); return; }
    update(d => {
      if (!d.goals[userId]) d.goals[userId] = [];
      d.goals[userId].push({ id:Date.now(), text:text.trim(), done:false, deadline, category, ts:Date.now(), completedAt:null });
    });
    setText(""); setDeadline("");
    showToast("Goal added!");
  };

  const toggle = (id) => {
    update(d => {
      const g = d.goals[userId]?.find(x=>x.id===id);
      if (g) { g.done=!g.done; g.completedAt = g.done ? Date.now() : null; }
    });
  };

  const remove = (id) => { update(d => { d.goals[userId] = d.goals[userId]?.filter(x=>x.id!==id)||[]; }); showToast("Goal removed"); };

  const goals    = data.goals[viewUser] || [];
  const myGoals  = data.goals[userId]   || [];
  const done     = myGoals.filter(g=>g.done).length;
  const total    = myGoals.length;
  const pct      = total > 0 ? Math.round((done/total)*100) : 0;

  const sortedGoals = [...goals].sort((a,b)=>(a.done?1:-1)||(a.ts-b.ts));

  return (
    <div className="anim-fadeUp">
      <SectionHeader title="Goals" sub="Set study goals and track progress together" color={u.color} />

      {/* Progress card */}
      <div style={{ ...cardStyle(u.color), marginBottom:28, display:"flex", alignItems:"center", gap:24 }}>
        {/* Ring */}
        <div style={{ position:"relative", flexShrink:0 }}>
          <svg width={90} height={90} style={{ transform:"rotate(-90deg)" }}>
            <circle cx={45} cy={45} r={36} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={8} />
            <circle cx={45} cy={45} r={36} fill="none" stroke={u.color} strokeWidth={8}
              strokeDasharray={2*Math.PI*36}
              strokeDashoffset={2*Math.PI*36*(1-pct/100)}
              strokeLinecap="round"
              style={{ transition:"stroke-dashoffset 1s ease", filter:`drop-shadow(0 0 6px ${u.color})` }}
            />
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"JetBrains Mono, monospace", color:"#fff", fontWeight:700, fontSize:16 }}>{pct}%</div>
        </div>
        <div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>{done} / {total} goals completed</div>
          <div style={{ color:"#3a3a55", fontSize:13, marginTop:4 }}>
            {pct === 100 && total > 0 ? "🎉 All goals done! Amazing!" : pct >= 50 ? "🔥 More than halfway there!" : "Keep pushing!"}
          </div>
          {/* Both users quick compare */}
          <div style={{ display:"flex", gap:16, marginTop:14 }}>
            {["A","B"].map(uid=>{
              const ug = data.goals[uid]||[];
              const ud = ug.filter(g=>g.done).length;
              const uu = data.users[uid];
              return (
                <div key={uid} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:18 }}>{uu.avatar}</span>
                  <div>
                    <div style={{ color:uu.color, fontWeight:700, fontSize:14 }}>{ud}/{ug.length}</div>
                    <div style={{ color:"#3a3a55", fontSize:11 }}>{uu.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add goal (only for own) */}
      {viewUser === userId && (
        <div style={{ ...cardStyle(u.color), borderColor:u.color+"25", marginBottom:28 }}>
          <div style={{ color:u.color, fontWeight:700, fontSize:13, marginBottom:16, letterSpacing:1, textTransform:"uppercase" }}>+ Add a goal</div>

          {/* Category */}
          <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            {Object.entries(CATS).map(([k,{icon,label,color}])=>(
              <button key={k} onClick={()=>setCategory(k)} style={{ background:category===k?`${color}20`:"rgba(255,255,255,.04)", border:`1px solid ${category===k?color+"55":"rgba(255,255,255,.07)"}`, borderRadius:10, color:category===k?color:"#555", padding:"6px 14px", cursor:"pointer", fontSize:13, transition:"all .15s" }}>
                {icon} {label}
              </button>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:12, marginBottom:12 }}>
            <input placeholder="What's your goal? *" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addGoal()} style={iStyle(u.color)} />
            <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} style={{ ...iStyle(u.color), width:"auto" }} />
          </div>
          <button onClick={addGoal} style={btnPrimary(u.color)}>Add Goal</button>
        </div>
      )}

      {/* Toggle whose goals */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {["A","B"].map(uid=>(
          <button key={uid} onClick={()=>setViewUser(uid)} style={{ background:viewUser===uid?data.users[uid].colorDim:"rgba(255,255,255,.03)", border:`1px solid ${viewUser===uid?data.users[uid].color+"44":"rgba(255,255,255,.06)"}`, borderRadius:10, color:viewUser===uid?data.users[uid].color:"#444", padding:"7px 18px", cursor:"pointer", fontSize:14, transition:"all .15s", fontWeight:600 }}>
            {data.users[uid].avatar} {data.users[uid].name}
          </button>
        ))}
      </div>

      {/* Goal list */}
      {sortedGoals.length === 0 && <Empty icon="◉" title="No goals yet" sub="Add your first goal above" />}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {sortedGoals.map(g => {
          const cat = CATS[g.category] || CATS.study;
          const overdue = g.deadline && !g.done && new Date(g.deadline) < new Date();
          return (
            <div key={g.id} className="hover-lift" style={{ display:"flex", alignItems:"center", gap:14, background:"linear-gradient(145deg,#0c0c1e,#10101f)", border:`1px solid ${g.done?"rgba(52,211,153,.15)":overdue?"rgba(248,113,113,.15)":"rgba(255,255,255,.05)"}`, borderRadius:16, padding:"14px 20px", opacity: g.done ? .7:1, transition:"all .2s", animation:"slideRight .3s ease" }}>
              {/* Checkbox */}
              {viewUser === userId ? (
                <button onClick={()=>toggle(g.id)} style={{ width:26, height:26, borderRadius:8, border:`2px solid ${g.done?"#34d399":cat.color}`, background: g.done?"#34d39920":"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, transition:"all .2s" }}>
                  {g.done && <span style={{ color:"#34d399", fontSize:14, fontWeight:800 }}>✓</span>}
                </button>
              ) : (
                <div style={{ width:26, height:26, borderRadius:8, border:`2px solid ${g.done?"#34d399":cat.color}`, background:g.done?"#34d39920":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {g.done && <span style={{ color:"#34d399", fontSize:14, fontWeight:800 }}>✓</span>}
                </div>
              )}

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ fontSize:16 }}>{cat.icon}</span>
                  <span style={{ color: g.done?"#555":"#fff", fontWeight:600, fontSize:14, textDecoration: g.done?"line-through":"none" }}>{g.text}</span>
                  <span style={{ background:cat.color+"20", color:cat.color, fontSize:10, fontWeight:700, borderRadius:6, padding:"2px 8px" }}>{cat.label}</span>
                  {overdue && <span style={{ background:"#f8717120", color:"#f87171", fontSize:10, fontWeight:700, borderRadius:6, padding:"2px 8px" }}>overdue</span>}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:4 }}>
                  {g.deadline && <span style={{ color: overdue?"#f87171":"#3a3a55", fontSize:11, fontFamily:"JetBrains Mono, monospace" }}>📅 {new Date(g.deadline).toLocaleDateString()}</span>}
                  {g.done && g.completedAt && <span style={{ color:"#34d399", fontSize:11 }}>✓ Done {timeAgo(g.completedAt)}</span>}
                  <span style={{ color:"#2a2a40", fontSize:11 }}>Added {timeAgo(g.ts)}</span>
                </div>
              </div>

              {viewUser === userId && (
                <button onClick={()=>remove(g.id)} style={{ background:"none", border:"none", color:"#2a2a40", cursor:"pointer", fontSize:20, padding:"4px", flexShrink:0 }}>×</button>
              )}
            </div>
          );
        })}
      </div>

      {/* Motivational footer */}
      {total > 0 && pct === 100 && (
        <div className="anim-scaleIn" style={{ marginTop:24, background:"linear-gradient(135deg,#34d39915,#818cf815)", border:"1px solid #34d39930", borderRadius:16, padding:"20px 24px", textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:10 }}>🎉</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:20, marginBottom:6 }}>All goals completed!</div>
          <div style={{ color:"#34d399", fontSize:14 }}>You and {otherU.name} crushed it. Time to set new ones!</div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  END OF ALL SEGMENTS
//  Your complete App.jsx is all 5 segments combined in order:
//  Segment 1 → Segment 2 → Segment 3 → Segment 4 → Segment 5
// ════════════════════════════════════════════════════════════════

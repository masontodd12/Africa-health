"use client";
import { useState, useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import { Language, LANGUAGE_META, TRANSLATIONS } from "@/lib/translations";
import { validateAge, validateSymptoms, sanitizeCustomSymptoms } from "@/lib/validation";
import { COUNTRIES, COUNTRY_FLAGS, getEmergencyNumber } from "@/lib/prompt";

// ── helpers ────────────────────────────────────────────────────────────────
function parseUrgency(text: string) {
  if (text.includes("URGENCY: EMERGENCY")) return "EMERGENCY";
  if (text.includes("URGENCY: HIGH"))      return "HIGH";
  if (text.includes("URGENCY: MODERATE"))  return "MODERATE";
  return "LOW";
}
function parseConfidence(text: string): "HIGH" | "MEDIUM" | "LOW" | null {
  if (text.includes("CONFIDENCE: HIGH"))   return "HIGH";
  if (text.includes("CONFIDENCE: MEDIUM")) return "MEDIUM";
  if (text.includes("CONFIDENCE: LOW"))    return "LOW";
  return null;
}
function parseSection(text: string, section: string) {
  const r = new RegExp(`${section}:\\n([\\s\\S]*?)(?=\\n[A-Z ]+:|$)`);
  const m = text.match(r);
  return m ? m[1].trim() : "";
}
function formatAIContent(raw: string): string {
  return raw
    .split("\n")
    .map(l => l.replace(/^\s*[\*\-•]\s+/, "").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").trim())
    .filter(Boolean)
    .join("\n");
}

// ── constants ──────────────────────────────────────────────────────────────
const BASE = { fontFamily: "'Sora', sans-serif", color: "white" };
const WRAP = { maxWidth: 540, margin: "0 auto", padding: "0 1.5rem" };

const URGENCY_CONFIG = {
  EMERGENCY: { color:"#EF4444", bg:"rgba(239,68,68,0.08)",   border:"rgba(239,68,68,0.25)",  icon:"⚡" },
  HIGH:      { color:"#F97316", bg:"rgba(249,115,22,0.08)",  border:"rgba(249,115,22,0.2)",  icon:"▲" },
  MODERATE:  { color:"#EAB308", bg:"rgba(234,179,8,0.08)",   border:"rgba(234,179,8,0.2)",   icon:"◆" },
  LOW:       { color:"#22C55E", bg:"rgba(34,197,94,0.08)",   border:"rgba(34,197,94,0.2)",   icon:"✓" },
};

const SECTION_META = [
  { key:"POSSIBLE CONDITIONS", icon:"◈", color:"rgba(99,179,237,0.15)",  iconColor:"#63B3ED" },
  { key:"IMMEDIATE STEPS",     icon:"▶", color:"rgba(249,115,22,0.12)",  iconColor:"#FB923C" },
  { key:"HOME CARE",           icon:"⌂", color:"rgba(34,197,94,0.12)",   iconColor:"#4ADE80" },
  { key:"SEEK CARE IF",        icon:"⊕", color:"rgba(239,68,68,0.12)",   iconColor:"#F87171" },
  { key:"PREVENTION",          icon:"◉", color:"rgba(168,85,247,0.12)",  iconColor:"#C084FC" },
];

// ── styles ─────────────────────────────────────────────────────────────────
const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #050A14; }
  ::selection { background: rgba(99,179,237,0.3); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
  @keyframes blink   { 0%,100% { opacity:1; } 50% { opacity:0; } }
  .fade-up { animation: fadeUp 0.4s ease forwards; }
  .fade-in { animation: fadeIn 0.35s ease forwards; }
  .chip { transition: all 0.15s; }
  .chip:hover  { border-color: rgba(99,179,237,0.5) !important; background: rgba(99,179,237,0.08) !important; color: #63B3ED !important; }
  .chip.active { border-color: #63B3ED !important; background: rgba(99,179,237,0.15) !important; color: #63B3ED !important; }
  .btn-primary { transition: all 0.2s; }
  .btn-primary:hover  { background: #3B8FD4 !important; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(66,153,225,0.35) !important; }
  .btn-primary:active { transform: translateY(0); }
  .lang-card:hover  { border-color: rgba(99,179,237,0.4) !important; background: rgba(99,179,237,0.06) !important; }
  .lang-card.active { border-color: #63B3ED !important; background: rgba(99,179,237,0.1) !important; }
  .history-card:hover { border-color: rgba(99,179,237,0.3) !important; background: rgba(99,179,237,0.05) !important; }
  .form-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 1.25rem 1.5rem; transition: border-color 0.2s; }
  .form-card:focus-within { border-color: rgba(99,179,237,0.25); }
  .step-label { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.9rem; }
  .step-num { width: 20px; height: 20px; border-radius: 6px; background: rgba(99,179,237,0.12); border: 1px solid rgba(99,179,237,0.25); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: #63B3ED; flex-shrink: 0; }
  .step-title { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
  .result-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; margin-bottom: 0.75rem; }
  .result-card-header { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .result-card-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
  .result-card-body { padding: 1rem 1.25rem; }
  .ai-content { color: rgba(255,255,255,0.75); line-height: 1.85; font-size: 0.9rem; }
  .progress-bar { height: 2px; background: rgba(255,255,255,0.06); border-radius: 1px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg,#4299E1,#63B3ED); border-radius: 1px; transition: width 0.4s ease; }
  .toggle-wrap { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; user-select: none; }
  .toggle-track { width: 40px; height: 22px; border-radius: 11px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); position: relative; transition: all 0.2s; flex-shrink: 0; }
  .toggle-track.on { background: rgba(99,179,237,0.3); border-color: rgba(99,179,237,0.5); }
  .toggle-thumb { width: 16px; height: 16px; border-radius: 50%; background: rgba(255,255,255,0.4); position: absolute; top: 2px; left: 2px; transition: all 0.2s; }
  .toggle-track.on .toggle-thumb { left: 20px; background: #63B3ED; }
  .cursor { display: inline-block; width: 2px; height: 0.9em; background: #63B3ED; margin-left: 2px; vertical-align: text-bottom; animation: blink 0.8s ease infinite; }
  select option { background: #0D1825; color: white; }
`;

// ── component ──────────────────────────────────────────────────────────────
export default function Home() {
  const { lang, setLang, t } = useLang();

  const [screen,      setScreen]      = useState<"lang"|"home"|"symptom"|"result">("lang");
  const [selected,    setSelected]    = useState<string[]>([]);
  const [custom,      setCustom]      = useState("");
  const [age,         setAge]         = useState("");
  const [gender,      setGender]      = useState("");
  const [duration,    setDuration]    = useState("");
  const [severity,    setSeverity]    = useState("");
  const [country,     setCountry]     = useState("");
  const [isChild,     setIsChild]     = useState(false);
  const [streaming,   setStreaming]    = useState(false);  // stream in progress
  const [streamDone,  setStreamDone]  = useState(false);  // stream complete
  const [result,      setResult]      = useState("");
  const [symptoms,    setSymptoms]    = useState("");
  const [history,     setHistory]     = useState<{date:string;symptoms:string;result:string}[]>([]);
  const [pickedLang,  setPickedLang]  = useState<Language>(lang);
  const [formError,   setFormError]   = useState<string | null>(null);
  const [apiError,    setApiError]    = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle"|"copied">("idle");
  const resultRef = useRef("");

  // restore saved lang + history
  useEffect(() => {
    const savedLang = localStorage.getItem("afrihealth_lang") as Language | null;
    if (savedLang && LANGUAGE_META[savedLang]) { setLang(savedLang); setPickedLang(savedLang); setScreen("home"); }
    try {
      const h = localStorage.getItem("afrihealth_history");
      if (h) setHistory(JSON.parse(h));
    } catch {}
  }, []);

  useEffect(() => {
    if (history.length > 0) localStorage.setItem("afrihealth_history", JSON.stringify(history));
  }, [history]);

  const toggle = (s: string) => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const clearHistory = () => {
    if (confirm("Clear all assessment history from this device?")) {
      setHistory([]); localStorage.removeItem("afrihealth_history");
    }
  };

  const resetForm = () => {
    setScreen("home"); setSelected([]); setCustom(""); setAge(""); setGender("");
    setDuration(""); setSeverity(""); setCountry(""); setIsChild(false);
    setResult(""); setStreaming(false); setStreamDone(false); setShareStatus("idle");
    resultRef.current = "";
  };

  // ── stream submit ────────────────────────────────────────────────────────
  const submit = async () => {
    const ageErr = validateAge(age);
    if (ageErr) { setFormError(ageErr); return; }
    if (!gender) { setFormError("Please select a gender"); return; }
    const sympErr = validateSymptoms(selected, custom);
    if (sympErr) { setFormError(sympErr); return; }
    setFormError(null);

    const cleanCustom = sanitizeCustomSymptoms(custom);
    const allSymptoms = [...selected, ...(cleanCustom ? [cleanCustom] : [])].join(", ");
    setSymptoms(allSymptoms);
    setApiError(null);
    setResult("");
    setStreamDone(false);
    resultRef.current = "";

    // Navigate to result screen immediately — stream fills it in
    setStreaming(true);
    setScreen("result");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35_000);

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

    try {
      const res = await fetch(`${apiBase}/api/diagnose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: allSymptoms, age, gender, duration, severity, locale: t.aiPromptLocale, country, isChild }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string; retryAfter?: number };
        if (res.status === 429) setApiError(`Too many requests. Wait ${data.retryAfter ?? 60}s.`);
        else if (res.status === 504) setApiError("Taking too long — check your connection.");
        else setApiError(data.error || "Unable to complete assessment. Please try again.");
        setStreaming(false);
        return;
      }

      // Read the stream
      const reader = res.body!.getReader();
      const dec = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });

        // Check for error marker from server
        if (chunk.includes("\nERROR:")) {
          setApiError("Assessment failed — please try again.");
          setStreaming(false);
          return;
        }

        resultRef.current += chunk;
        setResult(resultRef.current);
      }

      // Stream complete
      const finalResult = resultRef.current;
      setStreamDone(true);
      setStreaming(false);
      setHistory(h => [{ date: new Date().toLocaleDateString(), symptoms: allSymptoms, result: finalResult }, ...h].slice(0, 20));

    } catch (err: unknown) {
      clearTimeout(timeout);
      setStreaming(false);
      if (err instanceof Error && err.name === "AbortError") setApiError("Request timed out — check your connection.");
      else setApiError("Connection error. Please check your network and try again.");
    }
  };

  const shareResult = async () => {
    const urg = parseUrgency(result);
    const conditions = formatAIContent(parseSection(result, "POSSIBLE CONDITIONS"));
    const steps = formatAIContent(parseSection(result, "IMMEDIATE STEPS"));
    const text = `Africa Health Assessment\n\nUrgency: ${urg}\n\nPossible Conditions:\n${conditions}\n\nImmediate Steps:\n${steps}\n\nHealth education only — not medical diagnosis.`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: "Africa Health Assessment", text }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2500);
    } catch {}
  };

  const urgency    = result ? parseUrgency(result)    : null;
  const confidence = result ? parseConfidence(result) : null;
  const cfg        = urgency ? URGENCY_CONFIG[urgency] : null;

  const resultSections = [
    { title: t.sectionConditions, key: "POSSIBLE CONDITIONS" },
    { title: t.sectionImmediate,  key: "IMMEDIATE STEPS" },
    { title: t.sectionHomeCare,   key: "HOME CARE" },
    { title: t.sectionSeekCare,   key: "SEEK CARE IF" },
    { title: t.sectionPrevention, key: "PREVENTION" },
  ];

  const progress = [!!country, !!(age && gender), selected.length > 0 || !!custom, !!duration, !!severity].filter(Boolean).length;

  // ── LANGUAGE PICKER ───────────────────────────────────────────────────────
  if (screen === "lang") return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight:"100vh", background:"#050A14", ...BASE, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ ...WRAP, width:"100%", paddingTop:"3rem", paddingBottom:"3rem" }}>
          <div className="fade-up" style={{ marginBottom:"2.5rem", textAlign:"center" }}>
            <div style={{ width:48, height:48, borderRadius:12, background:"linear-gradient(135deg,#4299E1,#63B3ED)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", margin:"0 auto 1rem" }}>+</div>
            <div style={{ fontSize:"0.7rem", fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"#63B3ED" }}>Africa Health</div>
          </div>
          <h1 className="fade-up" style={{ fontSize:"1.6rem", fontWeight:800, textAlign:"center", marginBottom:"2rem", letterSpacing:"-0.02em" }}>
            {TRANSLATIONS_CHOOSE[pickedLang]}
          </h1>
          <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:"0.625rem", marginBottom:"2rem" }}>
            {(Object.keys(LANGUAGE_META) as Language[]).map(l => (
              <button key={l} className={`lang-card${pickedLang===l?" active":""}`} onClick={() => setPickedLang(l)}
                style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"1rem 1.25rem", border:`1px solid ${pickedLang===l?"#63B3ED":"rgba(255,255,255,0.07)"}`, borderRadius:12, background:pickedLang===l?"rgba(99,179,237,0.1)":"rgba(255,255,255,0.02)", cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"all 0.15s", textAlign:"left" }}>
                <span style={{ fontSize:"1.5rem" }}>{LANGUAGE_META[l].flag}</span>
                <div>
                  <div style={{ fontSize:"1rem", fontWeight:600, color:"white" }}>{LANGUAGE_META[l].nativeLabel}</div>
                  <div style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.4)", marginTop:2 }}>{LANGUAGE_META[l].label}</div>
                </div>
                {pickedLang===l && <div style={{ marginLeft:"auto", color:"#63B3ED" }}>✓</div>}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => { setLang(pickedLang); setScreen("home"); }}
            style={{ width:"100%", background:"#4299E1", border:"none", borderRadius:12, padding:"1.1rem 2rem", fontSize:"1rem", fontWeight:700, color:"white", cursor:"pointer", boxShadow:"0 4px 24px rgba(66,153,225,0.2)", fontFamily:"'Sora',sans-serif" }}>
            {TRANSLATIONS_CONTINUE[pickedLang]}
          </button>
        </div>
      </div>
    </>
  );

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight:"100vh", background:"#050A14", ...BASE, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-20%", left:"-10%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(66,153,225,0.12) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"-20%", right:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,179,237,0.08) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }}/>
        <div style={{ ...WRAP, minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div className="fade-up" style={{ marginBottom:"3rem", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#4299E1,#63B3ED)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.25rem" }}>+</div>
              <span style={{ fontSize:"0.75rem", fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"#63B3ED" }}>{t.brand}</span>
            </div>
            <button onClick={() => setScreen("lang")}
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"0.45rem 0.75rem", color:"rgba(255,255,255,0.5)", fontSize:"0.82rem", cursor:"pointer", fontFamily:"'Sora',sans-serif", display:"flex", alignItems:"center", gap:"0.4rem" }}>
              {LANGUAGE_META[lang].flag} {LANGUAGE_META[lang].nativeLabel}
            </button>
          </div>
          <div className="fade-up" style={{ marginBottom:"3rem" }}>
            <h1 style={{ fontSize:"clamp(2.5rem,6vw,3.5rem)", fontWeight:800, lineHeight:1.1, marginBottom:"1rem", letterSpacing:"-0.03em" }}>
              {t.heroTitle}<br/>
              <span style={{ background:"linear-gradient(90deg,#4299E1,#63B3ED,#90CDF4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundSize:"200% auto", animation:"shimmer 3s linear infinite" }}>{t.heroHighlight}</span>
            </h1>
            <p style={{ fontSize:"1.05rem", color:"rgba(255,255,255,0.45)", lineHeight:1.7, fontWeight:300 }}>{t.heroSubtitle}</p>
          </div>
          <div className="fade-up" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", marginBottom:"2rem", background:"rgba(255,255,255,0.06)", borderRadius:16, overflow:"hidden" }}>
            {[{n:"12,400+",l:t.statAssessments},{n:"23",l:t.statCountries},{n:"100%",l:t.statFree}].map(s => (
              <div key={s.l} style={{ textAlign:"center", padding:"1.25rem 0.5rem", background:"#050A14" }}>
                <div style={{ fontSize:"1.4rem", fontWeight:800, letterSpacing:"-0.03em" }}>{s.n}</div>
                <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.35)", marginTop:4, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase" }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div className="fade-up">
            <button className="btn-primary" onClick={() => setScreen("symptom")}
              style={{ width:"100%", background:"#4299E1", border:"none", borderRadius:12, padding:"1.1rem 2rem", fontSize:"1rem", fontWeight:700, color:"white", cursor:"pointer", boxShadow:"0 4px 24px rgba(66,153,225,0.2)", marginBottom:"1rem", fontFamily:"'Sora',sans-serif" }}>
              {t.startAssessment}
            </button>
            {history.length > 0 && (
              <div style={{ marginTop:"2rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.75rem" }}>
                  <div style={{ fontSize:"0.7rem", fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.25)" }}>{t.recentLabel}</div>
                  <button onClick={clearHistory} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"0.72rem", color:"rgba(255,255,255,0.2)", fontFamily:"'Sora',sans-serif", padding:"0.2rem 0.4rem" }}>Clear history</button>
                </div>
                {history.slice(0,2).map((h,i) => (
                  <div key={i} className="history-card" onClick={() => { setResult(h.result); setSymptoms(h.symptoms); setStreamDone(true); setScreen("result"); }}
                    style={{ border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"0.85rem 1rem", marginBottom:"0.5rem", cursor:"pointer", transition:"all 0.2s" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.35)", fontFamily:"'JetBrains Mono',monospace" }}>{h.date}</span>
                      <span style={{ fontSize:"0.75rem", color:"#63B3ED" }}>{t.viewBtn}</span>
                    </div>
                    <div style={{ fontSize:"0.88rem", color:"rgba(255,255,255,0.6)", marginTop:4 }}>{h.symptoms.slice(0,50)}…</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.2)", marginTop:"2rem", lineHeight:1.6, textAlign:"center" }}>
            {t.disclaimer} <a href="/privacy" style={{ color:"rgba(99,179,237,0.5)", textDecoration:"none" }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </>
  );

  // ── SYMPTOM ───────────────────────────────────────────────────────────────
  if (screen === "symptom") return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight:"100vh", background:"#050A14", ...BASE }}>
        <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(5,10,20,0.95)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ padding:"0.9rem 1.5rem", display:"flex", alignItems:"center", gap:"1rem" }}>
            <button onClick={() => setScreen("home")}
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"0.45rem 0.85rem", color:"rgba(255,255,255,0.5)", fontSize:"0.82rem", cursor:"pointer", fontFamily:"'Sora',sans-serif", fontWeight:500, flexShrink:0 }}>
              ← Back
            </button>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"0.95rem", fontWeight:700 }}>{t.symptomTitle}</div>
              <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.3)", marginTop:1 }}>{progress} of 5 sections complete</div>
            </div>
          </div>
          <div className="progress-bar" style={{ margin:"0 1.5rem 0.75rem" }}>
            <div className="progress-fill" style={{ width:`${(progress/5)*100}%` }}/>
          </div>
        </div>
        <div style={{ maxWidth:600, margin:"0 auto", padding:"1.25rem 1.5rem 3rem" }}>

          {/* 1 Country */}
          <div style={{ marginBottom:"1rem" }}>
            <div className="step-label"><span className="step-num">1</span><span className="step-title">Country</span></div>
            <div className="form-card">
              <div style={{ position:"relative" }}>
                <select value={country} onChange={e => setCountry(e.target.value)}
                  style={{ width:"100%", padding:"0.8rem 2.5rem 0.8rem 1rem", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, fontSize:"0.92rem", color:country?"white":"rgba(255,255,255,0.3)", fontFamily:"'Sora',sans-serif", outline:"none", appearance:"none", cursor:"pointer" }}>
                  <option value="" disabled>Select your country…</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{COUNTRY_FLAGS[c]??""} {c}</option>)}
                </select>
                <span style={{ position:"absolute", right:"0.9rem", top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"rgba(255,255,255,0.3)", fontSize:"0.7rem" }}>▼</span>
              </div>
              {country && (
                <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginTop:"0.6rem", padding:"0.6rem 0.75rem", background:"rgba(99,179,237,0.06)", borderRadius:8, border:"1px solid rgba(99,179,237,0.12)" }}>
                  <span style={{ fontSize:"1.1rem" }}>{COUNTRY_FLAGS[country]}</span>
                  <span style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.6)" }}>{country}</span>
                  <span style={{ marginLeft:"auto", fontSize:"0.78rem", color:"rgba(255,255,255,0.35)" }}>Emergency:</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.82rem", fontWeight:600, color:"#63B3ED" }}>{getEmergencyNumber(country)}</span>
                </div>
              )}
            </div>
          </div>

          {/* 2 Patient */}
          <div style={{ marginBottom:"1rem" }}>
            <div className="step-label"><span className="step-num">2</span><span className="step-title">Patient Info</span></div>
            <div className="form-card">
              <div style={{ display:"flex", gap:"0.6rem", flexWrap:"wrap", marginBottom:"0.9rem" }}>
                <input value={age} onChange={e => setAge(e.target.value)} placeholder={t.agePlaceholder} type="number" min="0" max="120"
                  style={{ flex:"1 1 80px", padding:"0.75rem 1rem", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, fontSize:"0.92rem", outline:"none", color:"white", fontFamily:"'Sora',sans-serif" }}/>
                {[t.genderMale, t.genderFemale, t.genderOther].map((g,i) => {
                  const val = ["Male","Female","Other"][i];
                  return (
                    <button key={g} className={`chip${gender===val?" active":""}`} onClick={() => setGender(val)}
                      style={{ padding:"0.75rem 1.1rem", borderRadius:10, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)", color:"rgba(255,255,255,0.5)", fontWeight:500, cursor:"pointer", fontFamily:"'Sora',sans-serif", fontSize:"0.88rem" }}>
                      {g}
                    </button>
                  );
                })}
              </div>
              <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"0.85rem" }}>
                <label className="toggle-wrap" onClick={() => setIsChild(v => !v)}>
                  <div className={`toggle-track${isChild?" on":""}`}><div className="toggle-thumb"/></div>
                  <div>
                    <div style={{ fontSize:"0.85rem", fontWeight:500, color:isChild?"#63B3ED":"rgba(255,255,255,0.55)" }}>Assessment is for a child</div>
                    <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.3)", marginTop:2 }}>Activates pediatric interpretation + weight-based guidance</div>
                  </div>
                </label>
                {isChild && (
                  <div style={{ marginTop:"0.6rem", padding:"0.5rem 0.75rem", background:"rgba(99,179,237,0.06)", border:"1px solid rgba(99,179,237,0.15)", borderRadius:8, fontSize:"0.78rem", color:"rgba(99,179,237,0.8)" }}>
                    Pediatric mode active — childhood disease flagging enabled
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3 Symptoms */}
          <div style={{ marginBottom:"1rem" }}>
            <div className="step-label">
              <span className="step-num">3</span><span className="step-title">Symptoms</span>
              {selected.length > 0 && (
                <span style={{ marginLeft:"auto", fontSize:"0.72rem", fontFamily:"'JetBrains Mono',monospace", color:"#63B3ED", background:"rgba(99,179,237,0.1)", padding:"2px 8px", borderRadius:20, border:"1px solid rgba(99,179,237,0.2)" }}>
                  {selected.length} selected
                </span>
              )}
            </div>
            <div className="form-card">
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.45rem", marginBottom:"0.9rem" }}>
                {t.symptoms.map((s,i) => (
                  <button key={i} className={`chip${selected.includes(s)?" active":""}`} onClick={() => toggle(s)}
                    style={{ padding:"0.4rem 0.85rem", borderRadius:20, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)", color:"rgba(255,255,255,0.45)", fontWeight:500, cursor:"pointer", fontFamily:"'Sora',sans-serif", fontSize:"0.8rem" }}>
                    {s}
                  </button>
                ))}
              </div>
              <textarea value={custom} onChange={e => setCustom(e.target.value)} placeholder={t.otherSymptomsPlaceholder}
                style={{ width:"100%", padding:"0.75rem 1rem", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, fontSize:"0.85rem", minHeight:68, resize:"vertical", outline:"none", color:"white", fontFamily:"'Sora',sans-serif", lineHeight:1.6 }}/>
            </div>
          </div>

          {/* 4 Duration */}
          <div style={{ marginBottom:"1rem" }}>
            <div className="step-label"><span className="step-num">4</span><span className="step-title">Duration</span></div>
            <div className="form-card">
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.45rem" }}>
                {t.durations.map((d,i) => (
                  <button key={i} className={`chip${duration===d?" active":""}`} onClick={() => setDuration(d)}
                    style={{ padding:"0.45rem 0.9rem", borderRadius:20, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)", color:"rgba(255,255,255,0.45)", fontWeight:500, cursor:"pointer", fontFamily:"'Sora',sans-serif", fontSize:"0.82rem" }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5 Severity */}
          <div style={{ marginBottom:"1.5rem" }}>
            <div className="step-label"><span className="step-num">5</span><span className="step-title">Severity</span></div>
            <div className="form-card">
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.6rem" }}>
                {[
                  { label:t.severityMild,     val:"Mild",     accent:"#22C55E", bg:"rgba(34,197,94,0.08)",  border:"rgba(34,197,94,0.25)",  desc:"Manageable" },
                  { label:t.severityModerate, val:"Moderate", accent:"#EAB308", bg:"rgba(234,179,8,0.08)",  border:"rgba(234,179,8,0.25)",  desc:"Limiting" },
                  { label:t.severitySevere,   val:"Severe",   accent:"#EF4444", bg:"rgba(239,68,68,0.08)",  border:"rgba(239,68,68,0.25)",  desc:"Debilitating" },
                ].map(s => (
                  <button key={s.val} onClick={() => setSeverity(s.val)}
                    style={{ padding:"0.9rem 0.5rem", borderRadius:10, border:`1px solid ${severity===s.val?s.border:"rgba(255,255,255,0.07)"}`, background:severity===s.val?s.bg:"rgba(255,255,255,0.02)", cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"all 0.15s", textAlign:"center" }}>
                    <div style={{ fontSize:"0.9rem", fontWeight:700, color:severity===s.val?s.accent:"rgba(255,255,255,0.5)", marginBottom:"0.2rem" }}>{s.label}</div>
                    <div style={{ fontSize:"0.7rem", color:severity===s.val?s.accent:"rgba(255,255,255,0.25)" }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {formError && (
            <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:10, padding:"0.85rem 1rem", marginBottom:"1rem" }}>
              <span style={{ color:"#EF4444", flexShrink:0 }}>⚠</span>
              <span style={{ color:"#FCA5A5", fontSize:"0.85rem" }}>{formError}</span>
            </div>
          )}

          <button className="btn-primary" onClick={submit}
            style={{ width:"100%", background:"#4299E1", border:"none", borderRadius:12, padding:"1rem 2rem", fontSize:"0.98rem", fontWeight:700, color:"white", cursor:"pointer", boxShadow:"0 4px 24px rgba(66,153,225,0.2)", fontFamily:"'Sora',sans-serif", letterSpacing:"0.01em" }}>
            {t.submitBtn}
          </button>
          <p style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.18)", marginTop:"1rem", lineHeight:1.7, textAlign:"center" }}>{t.formDisclaimer}</p>
        </div>
      </div>
    </>
  );

  // ── RESULT (streaming) ────────────────────────────────────────────────────
  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight:"100vh", background:"#050A14", ...BASE }}>

        {/* Header */}
        <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(5,10,20,0.95)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"0.9rem 1.5rem", display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <button onClick={() => streaming ? null : setScreen("symptom")}
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"0.45rem 0.85rem", color: streaming?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.5)", fontSize:"0.82rem", cursor: streaming?"default":"pointer", fontFamily:"'Sora',sans-serif", fontWeight:500, flexShrink:0 }}>
            ← Back
          </button>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:"0.95rem", fontWeight:700, display:"flex", alignItems:"center", gap:"0.5rem" }}>
              {t.resultTitle}
              {streaming && <div style={{ width:12, height:12, border:"1.5px solid rgba(255,255,255,0.15)", borderTop:"1.5px solid #63B3ED", borderRadius:"50%", animation:"spin 0.7s linear infinite", flexShrink:0 }}/>}
            </div>
            <div style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.28)", fontFamily:"'JetBrains Mono',monospace", marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {streaming ? "Generating your assessment…" : symptoms.slice(0,55)+(symptoms.length>55?"…":"")}
            </div>
          </div>
          {streamDone && (
            <button onClick={shareResult}
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"0.45rem 0.85rem", color:shareStatus==="copied"?"#63B3ED":"rgba(255,255,255,0.5)", fontSize:"0.82rem", cursor:"pointer", fontFamily:"'Sora',sans-serif", fontWeight:500, flexShrink:0, transition:"all 0.2s" }}>
              {shareStatus==="copied"?"Copied ✓":"Share"}
            </button>
          )}
          {country && <span style={{ fontSize:"0.9rem", flexShrink:0 }}>{COUNTRY_FLAGS[country]}</span>}
        </div>

        <div style={{ maxWidth:600, margin:"0 auto", padding:"1.25rem 1.5rem 3rem" }}>

          {/* API error */}
          {apiError && (
            <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:12, padding:"1rem 1.25rem", marginBottom:"1rem" }}>
              <div style={{ display:"flex", gap:"0.6rem", marginBottom:"0.6rem" }}>
                <span style={{ color:"#EF4444" }}>⚠</span>
                <span style={{ color:"#FCA5A5", fontSize:"0.85rem" }}>{apiError}</span>
              </div>
              <button onClick={() => { setApiError(null); setScreen("symptom"); }}
                style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:6, padding:"0.4rem 0.9rem", color:"#FCA5A5", fontSize:"0.8rem", cursor:"pointer", fontFamily:"'Sora',sans-serif", fontWeight:600 }}>
                Try again
              </button>
            </div>
          )}

          {/* Urgency — shown as soon as we parse it from the stream */}
          {cfg && (
            <div className="fade-in" style={{ border:`1px solid ${cfg.border}`, borderRadius:14, padding:"1.1rem 1.25rem", marginBottom:"1rem", background:cfg.bg, display:"flex", alignItems:"center", gap:"1rem" }}>
              <div style={{ width:3, height:40, borderRadius:2, background:cfg.color, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"0.68rem", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:cfg.color, marginBottom:4, opacity:0.85 }}>{t.urgencyLabel}</div>
                <div style={{ fontSize:"1rem", fontWeight:700, color:"white" }}>
                  {urgency==="EMERGENCY"?t.urgencyEmergency:urgency==="HIGH"?t.urgencyHigh:urgency==="MODERATE"?t.urgencyModerate:t.urgencyLow}
                </div>
              </div>
              <div style={{ width:36, height:36, borderRadius:10, background:`${cfg.color}18`, border:`1px solid ${cfg.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0 }}>
                {cfg.icon}
              </div>
            </div>
          )}

          {/* Emergency CTA */}
          {urgency==="EMERGENCY" && (
            <a href={`tel:${getEmergencyNumber(country)}`}
              style={{ display:"flex", alignItems:"center", gap:"0.75rem", width:"100%", background:"linear-gradient(135deg,#DC2626,#B91C1C)", borderRadius:14, padding:"1.1rem 1.5rem", fontSize:"1rem", fontWeight:800, color:"white", textDecoration:"none", marginBottom:"1rem", boxShadow:"0 8px 32px rgba(220,38,38,0.35)" }}>
              <span style={{ fontSize:"1.3rem" }}>⚡</span>
              <div>
                <div style={{ fontSize:"0.7rem", fontWeight:600, opacity:0.75, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:2 }}>Emergency</div>
                <div>{t.emergencyCTA} — {getEmergencyNumber(country)}</div>
              </div>
              <span style={{ marginLeft:"auto", opacity:0.7 }}>→</span>
            </a>
          )}

          {/* Low confidence warning */}
          {confidence==="LOW" && (
            <div className="fade-in" style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem", background:"rgba(234,179,8,0.08)", border:"1px solid rgba(234,179,8,0.25)", borderRadius:12, padding:"0.9rem 1.1rem", marginBottom:"1rem" }}>
              <span style={{ color:"#EAB308", flexShrink:0, marginTop:1 }}>◆</span>
              <div>
                <div style={{ fontSize:"0.82rem", fontWeight:600, color:"#EAB308", marginBottom:3 }}>Low confidence result</div>
                <div style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>Your symptoms could match several conditions. Please see a healthcare provider regardless of the urgency level shown.</div>
              </div>
            </div>
          )}

          {isChild && (
            <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"rgba(99,179,237,0.08)", border:"1px solid rgba(99,179,237,0.2)", borderRadius:20, padding:"0.35rem 0.85rem", marginBottom:"0.75rem", fontSize:"0.78rem", color:"#63B3ED" }}>
              Pediatric assessment
            </div>
          )}

          {/* Result sections — render as they stream in */}
          {resultSections.map((s, idx) => {
            const raw = parseSection(result, s.key);
            if (!raw) return null;
            const isLastSection = idx === resultSections.length - 1;
            const cleaned = formatAIContent(raw);
            const meta = SECTION_META[idx];
            const lines = cleaned.split("\n").filter(Boolean);
            // Show blinking cursor on the last visible section while streaming
            const showCursor = streaming && isLastSection;
            return (
              <div key={s.key} className="result-card fade-in" style={{ animationDelay:`${idx*0.05}s` }}>
                <div className="result-card-header">
                  <div className="result-card-icon" style={{ background:meta.color }}>
                    <span style={{ color:meta.iconColor, fontSize:"0.85rem", fontWeight:700 }}>{meta.icon}</span>
                  </div>
                  <span style={{ fontSize:"0.78rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)" }}>{s.title}</span>
                </div>
                <div className="result-card-body">
                  {lines.length > 1 ? (
                    <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                      {lines.map((line, li) => (
                        <div key={li} style={{ display:"flex", gap:"0.7rem", alignItems:"flex-start" }}>
                          <div style={{ width:5, height:5, borderRadius:"50%", background:meta.iconColor, flexShrink:0, marginTop:"0.45rem", opacity:0.6 }}/>
                          <span className="ai-content" style={{ flex:1 }}>
                            {line}
                            {showCursor && li === lines.length - 1 && <span className="cursor"/>}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="ai-content">
                      {cleaned}{showCursor && <span className="cursor"/>}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Skeleton placeholders while streaming sections haven't arrived yet */}
          {streaming && resultSections.map((s, idx) => {
            const raw = parseSection(result, s.key);
            if (raw) return null; // already rendered above
            const meta = SECTION_META[idx];
            return (
              <div key={`skel-${s.key}`} style={{ background:"rgba(255,255,255,0.015)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:16, overflow:"hidden", marginBottom:"0.75rem", opacity:0.5 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"1rem 1.25rem", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:meta.color, display:"flex", alignItems:"center", justifyContent:"center", opacity:0.4 }}>
                    <span style={{ color:meta.iconColor, fontSize:"0.85rem" }}>{meta.icon}</span>
                  </div>
                  <div style={{ width:120, height:10, background:"rgba(255,255,255,0.06)", borderRadius:4 }}/>
                </div>
                <div style={{ padding:"1rem 1.25rem", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                  {[80,60,70].map((w,i) => <div key={i} style={{ width:`${w}%`, height:8, background:"rgba(255,255,255,0.04)", borderRadius:4 }}/>)}
                </div>
              </div>
            );
          })}

          {/* Footer actions — only shown when stream is complete */}
          {streamDone && (
            <>
              <div style={{ border:"1px solid rgba(255,255,255,0.05)", borderRadius:12, padding:"1rem 1.25rem", margin:"0.5rem 0 1.25rem", background:"rgba(255,255,255,0.015)", textAlign:"center" }}>
                <p style={{ color:"rgba(255,255,255,0.22)", fontSize:"0.72rem", margin:0, lineHeight:1.75 }}>{t.resultDisclaimer}</p>
              </div>
              <div style={{ display:"flex", gap:"0.75rem" }}>
                <button onClick={shareResult}
                  style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"0.9rem", fontSize:"0.88rem", fontWeight:600, color:shareStatus==="copied"?"#63B3ED":"rgba(255,255,255,0.6)", cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"all 0.2s" }}>
                  {shareStatus==="copied"?"Copied ✓":"Share result"}
                </button>
                <button className="btn-primary" onClick={resetForm}
                  style={{ flex:1, background:"#4299E1", border:"none", borderRadius:12, padding:"0.9rem", fontSize:"0.88rem", fontWeight:700, color:"white", cursor:"pointer", boxShadow:"0 4px 24px rgba(66,153,225,0.2)", fontFamily:"'Sora',sans-serif" }}>
                  {t.newAssessmentBtn}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const TRANSLATIONS_CHOOSE: Record<Language, string> = {
  en: "Choose your language", fr: "Choisissez votre langue",
  sw: "Chagua lugha yako",    ha: "Zaɓi yarenka", am: "ቋንቋዎን ይምረጡ",
};
const TRANSLATIONS_CONTINUE: Record<Language, string> = {
  en: "Continue", fr: "Continuer", sw: "Endelea", ha: "Ci gaba", am: "ቀጥል",
};

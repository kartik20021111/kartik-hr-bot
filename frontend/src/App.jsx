import { useState, useRef, useEffect } from "react";

// ══════════════════════════════════════════════════════════
//  UTILS
// ══════════════════════════════════════════════════════════
const TODAY    = new Date();
const dSince   = d => Math.floor((TODAY - new Date(d)) / 86400000);
const addD     = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const fDate    = d => new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short",  year:"2-digit" });
const fDateL   = d => new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"long",   year:"numeric" });
const todayStr = () => new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });

// ══════════════════════════════════════════════════════════
//  EMPLOYEE DATA  (seed data — more can be added via Admin UI)
// ══════════════════════════════════════════════════════════
const SEED_EMPS = [
  { id:"E001", name:"Priya Sharma",    dept:"Engineering", role:"Software Engineer",  joining:"2025-04-12", manager:"Rohan Mehta",      email:"priya@kartikcorp.in",     location:"Bangalore" },
  { id:"E002", name:"Arjun Nair",      dept:"Marketing",   role:"Brand Strategist",   joining:"2025-03-01", manager:"Sunita Rao",       email:"arjun@kartikcorp.in",     location:"Mumbai"    },
  { id:"E003", name:"Meera Iyer",      dept:"Finance",     role:"Financial Analyst",  joining:"2025-01-15", manager:"Vikram Singh",     email:"meera@kartikcorp.in",     location:"Delhi"     },
  { id:"E004", name:"Kabir Desai",     dept:"Engineering", role:"DevOps Engineer",    joining:"2024-11-20", manager:"Rohan Mehta",      email:"kabir@kartikcorp.in",     location:"Pune"      },
  { id:"E005", name:"Ananya Pillai",   dept:"HR",          role:"HR Executive",       joining:"2024-09-05", manager:"Preethi Nambiar", email:"ananya@kartikcorp.in",    location:"Chennai"   },
  { id:"E006", name:"Rahul Gupta",     dept:"Sales",       role:"Account Executive",  joining:"2025-05-01", manager:"Sunita Rao",       email:"rahul@kartikcorp.in",     location:"Hyderabad" },
  { id:"E007", name:"Divya Menon",     dept:"Product",     role:"Product Manager",    joining:"2025-04-25", manager:"Rohan Mehta",      email:"divya@kartikcorp.in",     location:"Bangalore" },
  { id:"E008", name:"Siddharth Joshi", dept:"Design",      role:"UI/UX Designer",     joining:"2025-05-05", manager:"Preethi Nambiar", email:"siddharth@kartikcorp.in", location:"Mumbai"    },
];

// ══════════════════════════════════════════════════════════
//  CHECK-IN LOGIC
// ══════════════════════════════════════════════════════════
const CI_DAYS = [15, 30, 60, 90, 120, 180];
function getCIs(emp) {
  const days = dSince(emp.joining);
  return CI_DAYS.map(d => {
    const diff = days - d;
    return { day:d, date:fDate(addD(emp.joining,d)), done:diff>3, due:Math.abs(diff)<=3, upcoming:diff<-3 };
  });
}


// ══════════════════════════════════════════════════════════
//  INTEGRATIONS LIST
// ══════════════════════════════════════════════════════════
const INTEGRATIONS = [
  { name:"Slack",                   emoji:"💬", desc:"Auto-send check-in pings, policy alerts & onboarding reminders directly to employee Slack DMs",       badge:"Recommended" },
  { name:"Gmail / Google Workspace",emoji:"📧", desc:"Automated onboarding emails, check-in surveys, and HR policy digests sent from your domain",           badge:"Connected"   },
  { name:"Microsoft Teams",         emoji:"🔷", desc:"Embed PeopleBot as a native Teams bot — employees chat with HR AI without leaving Teams",               badge:null          },
  { name:"GitHub",                  emoji:"🐙", desc:"Track dev onboarding milestones, auto-assign repos, send welcome issues to new engineers on Day 1",     badge:"Popular"     },
  { name:"Jira / Confluence",       emoji:"🟦", desc:"Auto-create 90-day onboarding task boards for every new hire with pre-loaded milestones",               badge:null          },
  { name:"Notion",                  emoji:"⬜", desc:"Sync HR docs, employee handbook, and policy updates with your Notion workspace in real-time",           badge:null          },
  { name:"Razorpay Payroll",        emoji:"💰", desc:"Connect payroll data so PeopleBot can answer payslip, CTC, and benefit deduction queries accurately",   badge:"Recommended" },
  { name:"Zoom / Google Meet",      emoji:"🎥", desc:"Auto-schedule 30/60/90-day check-in video calls between HR and new joiners based on joining date",      badge:null          },
  { name:"Darwinbox / Keka HR",     emoji:"🏢", desc:"Sync with existing HRMS so PeopleBot reads live employee records, leave balances, and org charts",     badge:"Popular"     },
];

// ══════════════════════════════════════════════════════════
//  EMAIL TEMPLATES
// ══════════════════════════════════════════════════════════
function emailTmpl(emp, day) {
  const fn = emp.name.split(" ")[0];
  const t = {
    15: {
      sub:  `🌟 Day 15 at Kartik Corp — How are you settling in, ${fn}?`,
      body: `Hi ${fn},\n\nTwo weeks in already — time flies! 🎉\n\nThe HR team just wanted to check in and make sure you're feeling settled and supported at Kartik Corp.\n\nA few things we hope you've done by now:\n✓  Connected with your buddy?\n✓  IT setup (laptop, email, Slack) fully working?\n✓  Started your mandatory compliance trainings?\n\nYour feedback genuinely matters to us. Please take 2 minutes to fill out your Day 15 Pulse Survey — it's completely confidential and helps us support you better.\n\n[ 📋 FILL YOUR DAY 15 SURVEY → ]\n\nWarm regards,\nHR Team @ Kartik Corp\nhr@kartikcorp.in  |  +91 80 4567 8900\nhrportal.kartikcorp.in\n\n──────────────────────────────────\nThis is an automated check-in from PeopleBot, Kartik Corp's AI HR System.`,
    },
    30: {
      sub:  `🎊 ONE MONTH at Kartik Corp — You're officially family, ${fn}!`,
      body: `Hi ${fn},\n\nYou've completed your FIRST MONTH at Kartik Corp — and we are so glad you're here! 🎉\n\nBy now, you should have:\n✅  Completed all mandatory compliance trainings\n✅  Met your team and key stakeholders\n✅  Started contributing to your team's goals\n\nAs you step into Month 2, we encourage you to take ownership, ask questions boldly, and share your fresh perspective.\n\nPlease take 3 minutes to fill your 30-Day Feedback Survey:\n\n[ 📋 FILL YOUR DAY 30 SURVEY → ]\n\nYou're doing amazing, ${fn}. Keep going! 💪\n\nWith warmth,\nHR Team @ Kartik Corp\nhr@kartikcorp.in  |  +91 80 4567 8900\n\n──────────────────────────────────\nThis is an automated check-in from PeopleBot, Kartik Corp's AI HR System.`,
    },
    60: {
      sub:  `📈 60 Days In — You're finding your stride, ${fn}!`,
      body: `Hi ${fn},\n\nTwo months at Kartik Corp! You've well and truly moved past the settling-in phase. 🌟\n\nAt this milestone, your Day 90 Probation Review is coming up in about a month. This is a great time to:\n•  Have an open conversation with your manager about your progress\n•  Review your onboarding goals and check-ins\n•  Identify any training, tools, or resources you still need\n\nWe'd love to hear how things are going:\n\n[ 📋 FILL YOUR DAY 60 SURVEY → ]\n\nCheering you on,\nHR Team @ Kartik Corp\nhr@kartikcorp.in  |  +91 80 4567 8900\n\n──────────────────────────────────\nThis is an automated check-in from PeopleBot, Kartik Corp's AI HR System.`,
    },
    90: {
      sub:  `🏆 CONGRATULATIONS ${fn} — 90 Days & You're Officially Confirmed!`,
      body: `Hi ${fn},\n\n🏆  THREE MONTHS — You have successfully completed your probation period at Kartik Corp!\n\nWhat happens next:\n📄  Probation confirmation letter arriving within 5 working days\n💊  Full benefits (PF, health insurance, L&D budget) now fully active\n📅  Your manager will schedule your 90-Day Performance Review\n🎁  You're now eligible for the Employee Referral Bonus (₹25,000!)\n\nPlease fill your 90-Day Experience Survey:\n\n[ 📋 FILL YOUR DAY 90 SURVEY → ]\n\nCONGRATULATIONS, ${fn} — you're officially a Kartik Corper! 🎊\n\nWith immense pride,\nHR Team @ Kartik Corp\nhr@kartikcorp.in  |  +91 80 4567 8900  |  hrportal.kartikcorp.in\n\n──────────────────────────────────\nThis is an automated check-in from PeopleBot, Kartik Corp's AI HR System.`,
    },
  };
  return t[day] || t[30];
}

const FORM_QS = {
  15: [
    { q:"How comfortable do you feel in your new role so far?",                 type:"r5"   },
    { q:"Has your IT setup (laptop, email, Slack, VPN) been fully completed?",  type:"yn"   },
    { q:"Have you met your Buddy and had your first 1:1 with your Manager?",    type:"yn"   },
    { q:"Any challenges or concerns in your first 2 weeks?",                    type:"text" },
  ],
  30: [
    { q:"How would you rate your overall onboarding experience so far?",        type:"r5"   },
    { q:"Are you clear about your role, goals, and responsibilities?",          type:"yn"   },
    { q:"Have you completed all 4 mandatory compliance trainings?",             type:"yn"   },
    { q:"What's been the highlight of your first month?",                       type:"text" },
    { q:"What could Kartik Corp have done better for your onboarding?",         type:"text" },
  ],
  60: [
    { q:"How aligned do you feel with your team's goals and priorities?",       type:"r5"   },
    { q:"Are you receiving adequate support from your manager?",                type:"yn"   },
    { q:"How would you describe Kartik Corp's culture in one line?",            type:"text" },
    { q:"Is there any training, tool, or resource you feel you're missing?",    type:"text" },
  ],
  90: [
    { q:"Rate your overall Kartik Corp experience so far (1–10)",               type:"r10"  },
    { q:"Would you recommend Kartik Corp to a friend as a great place to work?",type:"yn"   },
    { q:"What has been the best part of your first 3 months?",                  type:"text" },
    { q:"One thing HR or leadership could do differently?",                     type:"text" },
    { q:"What are you most excited about in your role going forward?",          type:"text" },
  ],
};

// ══════════════════════════════════════════════════════════
//  OLLAMA PROMPT  — takes live docs so uploaded PDFs are included
// ══════════════════════════════════════════════════════════
function mkPrompt(emp, docs, userQuestion = "") {
  const q = userQuestion.toLowerCase();

  // ✅ CHANGE 1: Only use active documents
  const activeDocs = (docs || []).filter(doc => doc.active !== false);

  const relevantDocs = activeDocs.filter(doc => {
    const text = (doc.title + " " + doc.content).toLowerCase();
    return (
      // --- Benefits Handbook ---
      (q.includes("leave") && text.includes("leave")) ||
      (q.includes("insurance") && text.includes("insurance")) ||
      (q.includes("benefit") && text.includes("benefit")) ||
      (q.includes("bonus") && text.includes("bonus")) ||
      ((q.includes("work from home") || q.includes("wfh")) && text.includes("work from home")) ||
      (q.includes("travel") && text.includes("travel")) ||
      (q.includes("maternity") && text.includes("maternity")) ||
      (q.includes("paternity") && text.includes("paternity")) ||
      (q.includes("gratuity") && text.includes("gratuity")) ||
      ((q.includes("provident fund") || q.includes(" pf ") || q.startsWith("pf")) && text.includes("provident fund")) ||
      (q.includes("wellness") && text.includes("wellness")) ||
      (q.includes("recognition") && text.includes("recognition")) ||
      (q.includes("flexible") && text.includes("flexible")) ||
      // --- Leave Policy ---
      (q.includes("casual leave") && text.includes("casual leave")) ||
      (q.includes("sick leave") && text.includes("sick leave")) ||
      (q.includes("earned leave") && text.includes("earned leave")) ||
      (q.includes("holiday") && text.includes("holiday")) ||
      (q.includes("bereavement") && text.includes("bereavement")) ||
      // --- HR Manual ---
      (q.includes("attendance") && text.includes("attendance")) ||
      (q.includes("working hours") && text.includes("working hours")) ||
      (q.includes("dress code") && text.includes("dress code")) ||
      (q.includes("remote work") && text.includes("remote work")) ||
      (q.includes("safety") && text.includes("safety")) ||
      ((q.includes("exit") || q.includes("resignation") || q.includes("notice period")) && text.includes("separation")) ||
      ((q.includes("performance") || q.includes("review")) && text.includes("performance")) ||
      // --- Training / Learning ---
      ((q.includes("learning") || q.includes("training") || q.includes("development")) && text.includes("training")) ||
      // ✅ CHANGE 2: Code of Conduct topics
      ((q.includes("harassment") || q.includes("bullying") || q.includes("discrimination")) && text.includes("harassment")) ||
      (q.includes("confidential") && text.includes("confidential")) ||
      ((q.includes("conflict of interest") || q.includes("ethics")) && text.includes("conflict")) ||
      ((q.includes("it policy") || q.includes("system usage") || q.includes("software")) && text.includes("system")) ||
      (q.includes("conduct") && text.includes("conduct")) ||
      (q.includes("retaliation") && text.includes("retaliation")) ||
      // ✅ CHANGE 2: Onboarding topics
      ((q.includes("onboarding") || q.includes("joining") || q.includes("first day")) && text.includes("onboarding")) ||
      (q.includes("probation") && text.includes("probation")) ||
      ((q.includes("document") || q.includes("aadhaar") || q.includes("pan card")) && text.includes("document")) ||
      ((q.includes("buddy") || q.includes("mentor")) && text.includes("buddy"))
    );
  });

  const docsToUse = relevantDocs.length > 0 ? relevantDocs : activeDocs.slice(0, 2);

  const kb = docsToUse
    .map(doc => `
TITLE:
${doc.title}
CONTENT:
${doc.content.slice(0, 2500)}  // ✅ CHANGE 3: increased from 1800
`)
    .join("\n\n");

  return `
You are an HR assistant for Kartik Corp.
IMPORTANT RULES:
- Answer ONLY from the policy text provided
- Never make up information
- If answer is unavailable say:
"That information is not available in the company policy."
- Keep responses under 80 words
- Be direct and professional
EMPLOYEE:
${emp.name}
${emp.role}
${emp.dept}
POLICIES:
${kb}
`;
}

// ══════════════════════════════════════════════════════════
//  DESIGN TOKENS — Lumina HR (Dark) + PeopleBot Light
//  Extracted from Google Stitch designs
// ══════════════════════════════════════════════════════════
const A = {
  // Dark theme — Admin view (Lumina HR)
  bg:       "#051424",
  surface:  "#0D1C2D",
  card:     "#122131",
  cardHi:   "#1C2B3C",
  border:   "rgba(255,255,255,0.08)",
  borderHi: "rgba(0,212,212,0.35)",
  text:     "#D4E4FA",
  muted:    "#7A9AB8",
  faint:    "#3A5270",
  cyan:     "#22DCDC",
  cyanDim:  "#00D4D4",
  coral:    "#FF5757",
  gold:     "#FFBB35",
  green:    "#36C97E",
  purple:   "#9D8FFF",
  blue:     "#4DAAFF",
  red:      "#FF5757",
  // Glassmorphism helpers
  glass:    "rgba(12,28,45,0.85)",
  glow:     "0 0 20px rgba(34,220,220,0.15)",
  glowCard: "0 4px 24px rgba(0,0,0,0.4)",
};

const E = {
  // Light theme — Employee view (PeopleBot Light)
  bg:      "#F0F7FF",
  surface: "#FFFFFF",
  card:    "#F9FCFF",
  border:  "#E1E8F4",
  text:    "#07101E",
  muted:   "#5E7A99",
  navy:    "#006A6A",
  teal:    "#006A6A",
  cyan:    "#00D4D4",
  red:     "#B6212A",
  green:   "#059669",
  shadow:  "0 4px 20px rgba(7,16,30,0.06)",
  shadowLg:"0 12px 40px rgba(7,16,30,0.10)",
};

const DC = {
  Engineering:"#9D8FFF", Marketing:"#FB923C", Finance:"#36C97E",
  HR:"#F472B6", Sales:"#4DAAFF", Product:"#FFBB35", Design:"#FF7B7B",
  Operations:"#60A5FA", Legal:"#A78BFA", "Customer Success":"#34D399"
};
const AVS = ["#6366F1","#EC4899","#14B8A6","#F59E0B","#10B981","#3B82F6","#8B5CF6","#EF4444"];

function Av({ name, sz=34 }) {
  const ini = name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
  const c   = AVS[name.charCodeAt(0) % AVS.length];
  return (
    <div style={{ width:sz, height:sz, borderRadius:"50%", background:c, display:"flex", alignItems:"center", justifyContent:"center", fontSize:sz*.35, fontWeight:800, color:"#fff", flexShrink:0, letterSpacing:-1 }}>
      {ini}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  EMAIL MODAL
// ══════════════════════════════════════════════════════════
function EmailModal({ emp, day, onClose, onSent }) {
  const tmpl = emailTmpl(emp, day);
  const qs   = FORM_QS[day] || [];
  const [tab, setTab] = useState("email");
  const [ans, setAns] = useState({});
  function doSend() {
    const toEmail = emp.email || "kartik111102@gmail.com";
    window.open(`mailto:${toEmail}?subject=${encodeURIComponent(tmpl.sub)}&body=${encodeURIComponent(tmpl.body)}`);
    onSent(); onClose();
  }
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }} onClick={onClose}>
      <div style={{ background:A.surface,border:`1px solid ${A.border}`,borderRadius:18,width:"100%",maxWidth:560,maxHeight:"88vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,0.5)" }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:"15px 18px",borderBottom:`1px solid ${A.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div>
            <div style={{ fontSize:14,fontWeight:700,color:A.text }}>Day {day} Check-in Email</div>
            <div style={{ fontSize:11,color:A.muted,marginTop:2 }}>From: kartik111102@gmail.com → To: {emp.email}</div>
          </div>
          <button onClick={onClose} style={{ width:30,height:30,borderRadius:8,border:`1px solid ${A.border}`,background:A.card,color:A.muted,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
        </div>
        <div style={{ display:"flex",borderBottom:`1px solid ${A.border}` }}>
          {[["email","📧 Email Preview"],["form","📋 Feedback Form"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{ flex:1,padding:"10px 0",background:"transparent",border:"none",color:tab===t?A.cyan:A.muted,fontWeight:tab===t?700:400,fontSize:13,cursor:"pointer",borderBottom:tab===t?`2px solid ${A.cyan}`:"2px solid transparent" }}>{l}</button>
          ))}
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"16px 18px" }}>
          {tab==="email" ? (
            <>
              <div style={{ background:A.card,borderRadius:10,padding:"10px 14px",marginBottom:10,border:`1px solid ${A.border}` }}>
                <div style={{ fontSize:10,color:A.muted,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.08em" }}>Subject</div>
                <div style={{ fontSize:13,color:A.text,fontWeight:500 }}>{tmpl.sub}</div>
              </div>
              <div style={{ background:A.card,borderRadius:10,padding:"10px 14px",border:`1px solid ${A.border}` }}>
                <div style={{ fontSize:10,color:A.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em" }}>Body</div>
                <pre style={{ fontSize:12.5,color:A.text,whiteSpace:"pre-wrap",fontFamily:"inherit",lineHeight:1.8,margin:0 }}>{tmpl.body}</pre>
              </div>
            </>
          ) : (
            <div>
              <div style={{ fontSize:12,color:A.muted,marginBottom:14 }}>Day {day} Pulse Survey · {qs.length} questions</div>
              {qs.map((q,i)=>(
                <div key={i} style={{ marginBottom:14,padding:"12px 14px",background:A.card,borderRadius:10,border:`1px solid ${A.border}` }}>
                  <div style={{ fontSize:13,color:A.text,fontWeight:500,marginBottom:8 }}>Q{i+1}: {q.q}</div>
                  {q.type==="r5"  && <div style={{ display:"flex",gap:8 }}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setAns(p=>({...p,[i]:n}))} style={{ width:38,height:38,borderRadius:8,border:`1.5px solid ${ans[i]===n?A.cyan:A.border}`,background:ans[i]===n?`${A.cyan}25`:"transparent",color:ans[i]===n?A.cyan:A.muted,fontSize:14,fontWeight:700,cursor:"pointer" }}>{n}</button>)}</div>}
                  {q.type==="r10" && <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>{[1,2,3,4,5,6,7,8,9,10].map(n=><button key={n} onClick={()=>setAns(p=>({...p,[i]:n}))} style={{ width:34,height:34,borderRadius:7,border:`1.5px solid ${ans[i]===n?A.coral:A.border}`,background:ans[i]===n?`${A.coral}25`:"transparent",color:ans[i]===n?A.coral:A.muted,fontSize:12,fontWeight:700,cursor:"pointer" }}>{n}</button>)}</div>}
                  {q.type==="yn"  && <div style={{ display:"flex",gap:8 }}>{[["Yes ✅",A.green],["No ❌",A.coral]].map(([o,c])=><button key={o} onClick={()=>setAns(p=>({...p,[i]:o}))} style={{ padding:"6px 18px",borderRadius:8,border:`1.5px solid ${ans[i]===o?c:A.border}`,background:ans[i]===o?`${c}25`:"transparent",color:ans[i]===o?c:A.muted,fontSize:13,fontWeight:600,cursor:"pointer" }}>{o}</button>)}</div>}
                  {q.type==="text"&& <textarea value={ans[i]||""} onChange={ev=>setAns(p=>({...p,[i]:ev.target.value}))} placeholder="Employee types response here..." style={{ width:"100%",background:A.bg,border:`1px solid ${A.border}`,borderRadius:8,padding:"8px 10px",color:A.text,fontSize:12,resize:"vertical",minHeight:52,boxSizing:"border-box",outline:"none" }} />}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding:"12px 18px",borderTop:`1px solid ${A.border}`,display:"flex",gap:8,justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ padding:"8px 18px",borderRadius:9,border:`1px solid ${A.border}`,background:"transparent",color:A.muted,fontSize:13,cursor:"pointer" }}>Cancel</button>
          <button onClick={doSend} style={{ padding:"8px 22px",borderRadius:9,border:"none",background:`linear-gradient(135deg,${A.coral},#FF2255)`,color:"white",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 16px ${A.coral}50` }}>
            📤 Send to {emp.email}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  ADD EMPLOYEE MODAL
// ══════════════════════════════════════════════════════════
const DEPTS = ["Engineering","Marketing","Finance","HR","Sales","Product","Design","Operations","Legal","Customer Success"];
function AddEmpModal({ onClose, onAdd, nextId }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ name:"", dept:"Engineering", role:"", joining:today, manager:"", email:"", location:"" });
  const [err,  setErr]  = useState("");
  function submit() {
    if (!form.name||!form.role||!form.joining||!form.manager||!form.email||!form.location) {
      setErr("Please fill in all fields."); return;
    }
    if (!/^\S+@\S+\.\S+/.test(form.email)) {
      setErr("Enter a valid email address."); return;
    }
    onAdd({ id:nextId, ...form });
    onClose();
  }
  const inp = (field, ph, type="text") => (
    <input value={form[field]} type={type} onChange={ev=>{setForm(p=>({...p,[field]:ev.target.value}));setErr("");}}
      placeholder={ph} style={{ width:"100%",padding:"9px 12px",borderRadius:9,border:`1px solid ${A.border}`,background:A.bg,color:A.text,fontSize:13,outline:"none",boxSizing:"border-box" }} />
  );
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16 }} onClick={onClose}>
      <div style={{ background:A.surface,border:`1px solid ${A.border}`,borderRadius:18,width:"100%",maxWidth:480,boxShadow:"0 24px 80px rgba(0,0,0,0.5)" }} onClick={ev=>ev.stopPropagation()}>
        <div style={{ padding:"20px 20px 16px",borderBottom:`1px solid ${A.border}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:20,fontWeight:700,color:A.text,marginBottom:4 }}>Add New Employee</div>
              <div style={{ fontSize:13,color:A.muted }}>Fill in the details to onboard a new team member.</div>
            </div>
            <button onClick={onClose} style={{ width:32,height:32,borderRadius:8,border:`1px solid ${A.border}`,background:A.card,color:A.muted,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
          </div>
        </div>
        <div style={{ padding:"16px 20px",display:"flex",flexDirection:"column",gap:10 }}>
          {err && <div style={{ padding:"8px 12px",background:`${A.coral}18`,border:`1px solid ${A.coral}40`,borderRadius:8,fontSize:12,color:A.coral }}>{err}</div>}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            <div><div style={{ fontSize:11,color:A.muted,marginBottom:4 }}>Full Name *</div>{inp("name","e.g. Neha Kapoor")}</div>
            <div>
              <div style={{ fontSize:11,color:A.muted,marginBottom:4 }}>Department *</div>
              <select value={form.dept} onChange={ev=>setForm(p=>({...p,dept:ev.target.value}))} style={{ width:"100%",padding:"9px 12px",borderRadius:9,border:`1px solid ${A.border}`,background:A.bg,color:A.text,fontSize:13,outline:"none",boxSizing:"border-box" }}>
                {DEPTS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div><div style={{ fontSize:11,color:A.muted,marginBottom:4 }}>Job Title *</div>{inp("role","e.g. Senior Designer")}</div>
            <div><div style={{ fontSize:11,color:A.muted,marginBottom:4 }}>Joining Date *</div>{inp("joining","","date")}</div>
            <div><div style={{ fontSize:11,color:A.muted,marginBottom:4 }}>Manager *</div>{inp("manager","e.g. Rohan Mehta")}</div>
            <div><div style={{ fontSize:11,color:A.muted,marginBottom:4 }}>Location *</div>{inp("location","e.g. Bangalore")}</div>
          </div>
          <div><div style={{ fontSize:11,color:A.muted,marginBottom:4 }}>Work Email *</div>{inp("email","e.g. neha@kartikcorp.in","email")}</div>
          <div style={{ padding:"8px 12px",background:`${A.cyan}10`,borderRadius:8,fontSize:11,color:A.cyan,border:`1px solid ${A.cyan}25` }}>
            ✓ Check-in schedule (Day 15, 30, 60, 90...) auto-starts from the joining date above.
          </div>
        </div>
        <div style={{ padding:"12px 20px 16px",borderTop:`1px solid ${A.border}`,display:"flex",gap:10 }}>
          <button onClick={onClose} style={{ flex:1,padding:"12px 0",borderRadius:10,border:`1px solid ${A.border}`,background:"transparent",color:A.muted,fontSize:14,fontWeight:500,cursor:"pointer" }}>Cancel</button>
          <button onClick={submit} style={{ flex:2,padding:"12px 0",borderRadius:10,border:"none",background:`linear-gradient(135deg,${A.cyan},#009999)`,color:"#001E1E",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 20px ${A.cyan}30`,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save Employee
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  ADD POLICY MODAL  (paste text directly — no PDF needed)
// ══════════════════════════════════════════════════════════
const WORD_LIMIT = 1200;
function AddDocModal({ onClose, onSave, currentTotal }) {
  const [title,   setTitle]   = useState("");
  const [text,    setText]    = useState("");
  const [err,     setErr]     = useState("");
  const [saving,  setSaving]  = useState(false);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const remaining = WORD_LIMIT - currentTotal;
  const isOver    = wordCount > remaining;

  async function handleSave() {
    if (!title.trim())     { setErr("Please enter a policy name."); return; }
    if (!text.trim())      { setErr("Please paste your policy text."); return; }
    if (wordCount < 10)    { setErr("Policy text is too short. Paste the actual policy content."); return; }
    if (isOver)            { setErr(`Too many words. You have ${remaining} words remaining across all policies.`); return; }
    setSaving(true);
    const doc = {
      id:      `p${Date.now()}`,
      title:   title.trim(),
      content: text.trim(),
      cat:     "Policy",
      icon:    "📋",
      date:    new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}),
      active:  true,
    };
    await onSave(doc);
    setSaving(false);
    onClose();
  }

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16 }} onClick={onClose}>
      <div style={{ background:A.surface,border:`1px solid ${A.border}`,borderRadius:18,width:"100%",maxWidth:580,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,0.6)" }} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"16px 20px",borderBottom:`1px solid ${A.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div>
            <div style={{ fontSize:15,fontWeight:700,color:A.text }}>✏️ Add HR Policy</div>
            <div style={{ fontSize:11,color:A.muted,marginTop:2 }}>Paste your policy text — PeopleBot will read and answer from it</div>
          </div>
          <button onClick={onClose} style={{ width:30,height:30,borderRadius:8,border:`1px solid ${A.border}`,background:A.card,color:A.muted,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding:"16px 20px",flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12 }}>
          {err && <div style={{ padding:"8px 12px",background:`${A.coral}18`,border:`1px solid ${A.coral}40`,borderRadius:8,fontSize:12,color:A.coral }}>{err}</div>}

          <div>
            <div style={{ fontSize:11,color:A.muted,marginBottom:4 }}>Policy Name * <span style={{color:A.cyan}}>(e.g. "Leave Policy", "Remote Work Policy")</span></div>
            <input value={title} onChange={e=>{setTitle(e.target.value);setErr("");}} placeholder="e.g. Annual Leave Policy 2025"
              style={{ width:"100%",padding:"9px 12px",borderRadius:9,border:`1px solid ${A.border}`,background:A.bg,color:A.text,fontSize:13,outline:"none",boxSizing:"border-box" }} />
          </div>

          <div style={{ flex:1 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
              <div style={{ fontSize:11,color:A.muted }}>Policy Text * <span style={{color:A.cyan}}>(paste your policy here)</span></div>
              <div style={{ fontSize:11,fontWeight:700,color:isOver?A.coral:wordCount>remaining*0.8?A.gold:A.green }}>
                {wordCount} / {WORD_LIMIT} words {isOver?"⚠️ Over limit!":wordCount>0?"✓":""}
              </div>
            </div>
            <textarea value={text} onChange={e=>{setText(e.target.value);setErr("");}}
              placeholder={`Paste your HR policy text here.\n\nKeep it under ${WORD_LIMIT} words total across all policies.\n\nTip: Write it as bullet points and short paragraphs — tinyllama reads structured text better than long paragraphs.\n\nExample:\nLEAVE POLICY\n• Annual Leave: 18 days per year\n• Sick Leave: 12 days per year\n• How to apply: Submit request on HR portal 3 days in advance\n• Emergency leave: Contact manager directly`}
              style={{ width:"100%",minHeight:280,padding:"10px 12px",borderRadius:9,border:`1.5px solid ${isOver?A.coral:A.border}`,background:A.bg,color:A.text,fontSize:13,lineHeight:1.7,resize:"vertical",outline:"none",boxSizing:"border-box",fontFamily:"inherit" }} />
          </div>

          <div style={{ padding:"8px 12px",background:`${A.cyan}10`,borderRadius:8,fontSize:11,color:A.cyan,border:`1px solid ${A.cyan}25`,lineHeight:1.6 }}>
            💡 <b>Tips for best results:</b> Use bullet points. Include exact numbers (e.g. "18 days annual leave"). One policy per entry. Keep total across all policies under 1200 words.
            {remaining < WORD_LIMIT && <span style={{color:A.gold}}> · You have <b>{remaining} words</b> remaining.</span>}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:"12px 20px",borderTop:`1px solid ${A.border}`,display:"flex",gap:8,justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ padding:"9px 20px",borderRadius:9,border:`1px solid ${A.border}`,background:"transparent",color:A.muted,fontSize:13,cursor:"pointer" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving||isOver||!title.trim()||!text.trim()}
            style={{ padding:"9px 24px",borderRadius:9,border:"none",background:saving||isOver||!title.trim()||!text.trim()?A.faint:`linear-gradient(135deg,${A.cyan},#0099BB)`,color:"white",fontSize:13,fontWeight:700,cursor:saving?"not-allowed":"pointer",boxShadow:`0 4px 14px ${A.cyan}40` }}>
            {saving?"Saving...":"Save to Knowledge Base →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  ADMIN VIEW
// ══════════════════════════════════════════════════════════
function AdminView({ onLogout, sharedDocs, setSharedDocs, employees, setEmployees }) {
  const [tab,          setTab]          = useState("dash");
  const [modal,        setModal]        = useState(null);
  const [showAddEmp,   setShowAddEmp]   = useState(false);
  const [sent,         setSent]         = useState(new Set());
  const [docOpen,      setDocOpen]      = useState(null);
  const [search,       setSearch]       = useState("");
  const [connected,    setConnected]    = useState(new Set(["Gmail / Google Workspace"]));
  const [showAddDoc,   setShowAddDoc]   = useState(false);  // paste policy modal

  // Next employee ID
  const nextEmpId = `E${String(employees.length + 1).padStart(3,"0")}`;

  // Build scheduler
  const schedule = [];
  employees.forEach(emp => {
    const days = dSince(emp.joining);
    [15,30,60,90].forEach(d => {
      const key    = `${emp.id}-${d}`;
      const status = sent.has(key) ? "sent"
                   : Math.abs(days-d) <= 3  ? "due"
                   : days > d+3             ? "overdue"
                   : "scheduled";
      schedule.push({ emp, day:d, status, key, date:fDate(addD(emp.joining,d)) });
    });
  });
  schedule.sort((a,b) => ({due:0,overdue:1,scheduled:2,sent:3}[a.status] - {due:0,overdue:1,scheduled:2,sent:3}[b.status]));

  const onboardingEmps = employees.filter(e => dSince(e.joining) <= 90);
  const dueCount       = schedule.filter(e => e.status==="due" || e.status==="overdue").length;

  // Save a pasted policy doc to backend
  async function saveDoc(doc) {
    await fetch("http://localhost:3001/docs", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(doc),
    }).catch(()=>{});
    setSharedDocs(prev=>[doc,...prev.filter(d=>d.id!==doc.id)]);
  }

  async function deleteDoc(id) {
    await fetch(`http://localhost:3001/docs/${id}`,{method:"DELETE"}).catch(()=>{});
    setSharedDocs(p=>p.filter(d=>d.id!==id));
    setDocOpen(null);
  }

  const ACTIVITY = [
    { icon:"📧", msg:"Day 30 check-in sent to Arjun Nair",         time:"2 hrs ago"  },
    { icon:"🎉", msg:"Siddharth Joshi joined the Design team",      time:"6 days ago" },
    { icon:"🎉", msg:"Rahul Gupta joined the Sales team",           time:"10 days ago"},
    { icon:"📧", msg:"Day 15 check-in sent to Divya Menon",         time:"1 day ago"  },
    { icon:"📄", msg:"Leave Policy 2025 updated by HR Admin",       time:"3 days ago" },
    { icon:"✅", msg:"Day 90 review completed for Kabir Desai",     time:"5 days ago" },
    { icon:"🔗", msg:"Gmail integration connected successfully",    time:"1 week ago" },
  ];

  const NAV = [
    {id:"dash",  label:"Home",      svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>},
    {id:"emps",  label:"Staff",     svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>},
    {id:"sched", label:"Scheduler", svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
    {id:"docs",  label:"Policies",  svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>},
    {id:"int",   label:"Settings",  svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>},
  ];

  

  return (
    <div style={{ display:"flex",height:"100vh",background:A.bg,fontFamily:"'Inter',system-ui,sans-serif",overflow:"hidden" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width:196,background:A.surface,borderRight:`1px solid ${A.border}`,display:"flex",flexDirection:"column",flexShrink:0 }}>
        <div style={{ padding:"16px 14px 12px",borderBottom:`1px solid ${A.border}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${A.cyan},#004F4F)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:A.glow }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="9" cy="10" r="1.5" fill="white"/><circle cx="15" cy="10" r="1.5" fill="white"/><path d="M8 15c1 1.5 5 1.5 6 0" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div style={{ fontSize:13,fontWeight:800,color:A.text,lineHeight:1.1 }}>PeopleBot</div>
              <div style={{ fontSize:10,color:A.cyan,fontWeight:700,letterSpacing:"0.07em" }}>HR ADMIN</div>
            </div>
          </div>
        </div>
        <div style={{ padding:"10px 8px",flex:1 }}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)}
              style={{ width:"100%",padding:"9px 12px",borderRadius:10,border:"none",background:tab===n.id?`${A.cyan}15`:"transparent",color:tab===n.id?A.cyan:A.muted,fontSize:13,fontWeight:tab===n.id?600:400,cursor:"pointer",display:"flex",alignItems:"center",gap:9,marginBottom:2,textAlign:"left",transition:"all 0.15s" }}>
              <span style={{ color:tab===n.id?A.cyan:A.muted }}>{n.svg}</span>{n.label}
            </button>
          ))}
        </div>
        <div style={{ padding:"12px 10px",borderTop:`1px solid ${A.border}` }}>
          <button onClick={()=>{ setShowAddDoc(true); setTab("docs"); }}
            style={{ width:"100%",padding:"9px 0",borderRadius:9,border:`1.5px dashed ${A.cyan}60`,background:`${A.cyan}10`,color:A.cyan,fontSize:12,fontWeight:700,cursor:"pointer" }}>
            ✏️ Add Policy
          </button>
          <button onClick={onLogout} style={{ width:"100%",padding:"7px 0",borderRadius:9,border:"none",background:"transparent",color:A.muted,fontSize:12,cursor:"pointer",marginTop:6 }}>← Switch View</button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex:1,overflowY:"auto",padding:"22px 24px" }}>

        {/* ─ DASHBOARD ─ */}
        {tab==="dash" && (
          <div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:22,fontWeight:800,color:A.text }}>Good morning, Kartik 👋</div>
              <div style={{ fontSize:13,color:A.muted,marginTop:3 }}>{todayStr()} · PeopleBot Admin Console</div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr",gap:10,marginBottom:18 }}>
              {[
                {label:"Total Employees",   val:employees.length,      sub:`+${employees.filter(e=>dSince(e.joining)<=7).length} this week`, col:A.cyan,   icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={A.cyan} strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>},
                {label:"Active Onboarding", val:onboardingEmps.length, sub:"Within 90-day window",   col:A.gold,   icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={A.gold} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>},
                {label:"Emails Due",        val:dueCount,              sub:"Require attention",       col:A.coral,  icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={A.coral} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>},
                {label:"Policies in KB",    val:sharedDocs.length,     sub:"In knowledge base",      col:A.purple, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={A.purple} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>},
              ].map(s=>(
                <div key={s.label} style={{ background:A.card,border:`1px solid ${A.border}`,borderRadius:14,padding:"16px 18px",display:"flex",alignItems:"center",gap:14 }}>
                  <div style={{ width:44,height:44,borderRadius:12,background:`${s.col}15`,border:`1px solid ${s.col}25`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>{s.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10,color:A.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4 }}>{s.label}</div>
                    <div style={{ fontSize:26,fontWeight:700,color:s.col,lineHeight:1 }}>{s.val}</div>
                    <div style={{ fontSize:11,color:A.muted,marginTop:4 }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              <div style={{ background:A.card,border:`1px solid ${A.border}`,borderRadius:14,padding:"15px 16px" }}>
                <div style={{ fontSize:13,fontWeight:700,color:A.text,marginBottom:12 }}>🔔 Check-in Alerts</div>
                {schedule.filter(e=>e.status==="due"||e.status==="overdue").slice(0,5).length===0
                  ? <div style={{ fontSize:12,color:A.muted,textAlign:"center",padding:"16px 0" }}>✅ All check-ins up to date!</div>
                  : schedule.filter(e=>e.status==="due"||e.status==="overdue").slice(0,5).map((s,i)=>(
                    <div key={i} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8,padding:"8px 10px",background:A.bg,borderRadius:9,border:`1px solid ${A.coral}25` }}>
                      <Av name={s.emp.name} sz={30} />
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontSize:12,fontWeight:600,color:A.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.emp.name}</div>
                        <div style={{ fontSize:11,color:A.muted }}>Day {s.day} · {s.status==="due"?"Due now!":"Overdue"}</div>
                      </div>
                      <button onClick={()=>setModal({emp:s.emp,day:s.day})} style={{ padding:"4px 10px",borderRadius:6,border:"none",background:A.coral,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }}>Send</button>
                    </div>
                  ))
                }
              </div>
              <div style={{ background:A.card,border:`1px solid ${A.border}`,borderRadius:14,padding:"15px 16px" }}>
                <div style={{ fontSize:13,fontWeight:700,color:A.text,marginBottom:12 }}>⚡ Recent Activity</div>
                {ACTIVITY.map((a,i)=>(
                  <div key={i} style={{ display:"flex",gap:10,marginBottom:10,alignItems:"flex-start" }}>
                    <div style={{ width:28,height:28,borderRadius:8,background:A.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0 }}>{a.icon}</div>
                    <div>
                      <div style={{ fontSize:12,color:A.text,lineHeight:1.4 }}>{a.msg}</div>
                      <div style={{ fontSize:10,color:A.faint,marginTop:1 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:A.card,border:`1px solid ${A.border}`,borderRadius:14,padding:"15px 16px",marginTop:16 }}>
              <div style={{ fontSize:13,fontWeight:700,color:A.text,marginBottom:12 }}>👥 Team Distribution</div>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                {Object.entries(DC).map(([dept,col])=>{
                  const cnt = employees.filter(e=>e.dept===dept).length;
                  if (!cnt) return null;
                  const pct = Math.round(cnt/employees.length*100);
                  return (
                    <div key={dept} style={{ background:A.bg,border:`1px solid ${col}30`,borderRadius:10,padding:"9px 14px",minWidth:100 }}>
                      <div style={{ fontSize:11,color:col,fontWeight:700,marginBottom:4 }}>{dept}</div>
                      <div style={{ fontSize:18,fontWeight:800,color:A.text }}>{cnt}</div>
                      <div style={{ fontSize:10,color:A.muted }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─ EMPLOYEES ─ */}
        {tab==="emps" && (
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <div style={{ fontSize:18,fontWeight:800,color:A.text }}>👥 Employee Directory</div>
              <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                <input value={search} onChange={ev=>setSearch(ev.target.value)} placeholder="🔍  Search name or dept..." style={{ padding:"9px 14px",borderRadius:9,border:`1px solid ${A.border}`,background:A.card,color:A.text,fontSize:13,width:210,outline:"none" }} />
                <button onClick={()=>setShowAddEmp(true)} style={{ padding:"9px 18px",borderRadius:9,border:"none",background:`linear-gradient(135deg,${A.cyan},#0099BB)`,color:"white",fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",boxShadow:`0 4px 14px ${A.cyan}40` }}>+ Add Employee</button>
              </div>
            </div>
            {employees.filter(e=>!search||e.name.toLowerCase().includes(search.toLowerCase())||e.dept.toLowerCase().includes(search.toLowerCase())).map(emp=>{
              const days = dSince(emp.joining);
              const pct  = Math.min(100,Math.round(days/90*100));
              const col  = DC[emp.dept] || A.muted;
              return (
                <div key={emp.id} style={{ background:A.card,border:`1px solid ${A.border}`,borderRadius:12,padding:"14px 16px",marginBottom:9,display:"flex",alignItems:"center",gap:14 }}>
                  <Av name={emp.name} sz={42} />
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap" }}>
                      <span style={{ fontSize:14,fontWeight:700,color:A.text }}>{emp.name}</span>
                      <span style={{ fontSize:11,padding:"2px 8px",borderRadius:6,background:`${col}20`,color:col,fontWeight:600 }}>{emp.dept}</span>
                      {days<=90 && <span style={{ fontSize:11,padding:"2px 8px",borderRadius:6,background:`${A.gold}20`,color:A.gold,fontWeight:600 }}>🔥 Onboarding</span>}
                    </div>
                    <div style={{ fontSize:12,color:A.muted,marginTop:2 }}>{emp.role} · {emp.location} · {emp.manager}</div>
                    <div style={{ marginTop:6,display:"flex",alignItems:"center",gap:8 }}>
                      <div style={{ flex:1,height:4,background:A.bg,borderRadius:2,maxWidth:130 }}>
                        <div style={{ width:`${pct}%`,height:"100%",borderRadius:2,background:days<=90?`linear-gradient(90deg,${A.cyan},${A.purple})`:A.green }} />
                      </div>
                      <span style={{ fontSize:11,color:A.muted }}>Day {days}{days<=90?" / 90":""}</span>
                    </div>
                  </div>
                  <div style={{ textAlign:"right",flexShrink:0 }}>
                    <div style={{ fontSize:10,color:A.muted,textTransform:"uppercase",letterSpacing:"0.04em" }}>Joined</div>
                    <div style={{ fontSize:13,fontWeight:600,color:A.text }}>{fDate(emp.joining)}</div>
                    <div style={{ display:"flex",gap:6,marginTop:6,justifyContent:"flex-end" }}>
                      <button onClick={()=>{ const next=[15,30,60,90].find(d=>dSince(emp.joining)<d+4)||30; setModal({emp,day:next}); }} style={{ padding:"4px 11px",borderRadius:7,border:"none",background:`${A.cyan}20`,color:A.cyan,fontSize:11,fontWeight:600,cursor:"pointer" }}>📧 Check-in</button>
                      <button onClick={()=>{ if(window.confirm(`Remove ${emp.name}?\n\nThis deletes their record and stops all check-in reminders.`)) setEmployees(p=>p.filter(e=>e.id!==emp.id)); }} style={{ padding:"4px 11px",borderRadius:7,border:`1px solid ${A.coral}40`,background:`${A.coral}12`,color:A.coral,fontSize:11,fontWeight:600,cursor:"pointer" }}>🗑 Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─ SCHEDULER ─ */}
        {tab==="sched" && (
          <div>
            <div style={{ fontSize:18,fontWeight:800,color:A.text,marginBottom:4 }}>📅 Email Scheduler</div>
            <div style={{ fontSize:13,color:A.muted,marginBottom:16 }}>Auto-triggered check-in emails based on each employee's joining date</div>
            <div style={{ display:"flex",gap:10,marginBottom:16,flexWrap:"wrap" }}>
              {[["due","🔴 Due / Overdue",A.coral],["scheduled","🔵 Scheduled",A.blue],["sent","🟢 Sent",A.green]].map(([s,l,c])=>(
                <div key={s} style={{ padding:"6px 14px",borderRadius:20,background:`${c}18`,border:`1px solid ${c}40`,fontSize:12,fontWeight:600,color:c }}>
                  {l}: {schedule.filter(e=>e.status===s||(s==="due"&&e.status==="overdue")).length}
                </div>
              ))}
            </div>
            {schedule.map((s,i)=>{
              const col   = {due:A.coral,overdue:A.gold,scheduled:A.blue,sent:A.green}[s.status]||A.muted;
              const label = {due:"Due Today",overdue:"Overdue",scheduled:"Scheduled",sent:"Sent"}[s.status];
              return (
                <div key={i} style={{ background:A.card,border:`1px solid ${s.status==="due"?`${A.coral}50`:A.border}`,borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12 }}>
                  <Av name={s.emp.name} sz={34} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:A.text }}>{s.emp.name}</div>
                    <div style={{ fontSize:11,color:A.muted,marginTop:1 }}>Day {s.day} Check-in · {s.date} · {s.emp.dept}</div>
                  </div>
                  <span style={{ fontSize:11,padding:"3px 10px",borderRadius:6,background:`${col}20`,color:col,fontWeight:700 }}>{label}</span>
                  {s.status!=="sent" && (
                    <button onClick={()=>setModal({emp:s.emp,day:s.day})} style={{ padding:"7px 16px",borderRadius:8,border:"none",background:s.status==="due"?`linear-gradient(135deg,${A.coral},#FF2255)`:`${A.blue}25`,color:s.status==="due"?"#fff":A.blue,fontSize:12,fontWeight:700,cursor:"pointer" }}>
                      {s.status==="due"?"🔴 Send Now":"📤 Preview"}
                    </button>
                  )}
                  {s.status==="sent" && <span style={{ fontSize:12,color:A.green }}>✅ Sent</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* ─ DOCUMENTS ─ */}
        {tab==="docs" && (
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <div>
                <div style={{ fontSize:18,fontWeight:800,color:A.text }}>📁 Policy Knowledge Base</div>
                <div style={{ fontSize:12,color:A.muted,marginTop:2 }}>PeopleBot reads these to answer employee queries · Max ~1200 words per policy</div>
              </div>
              <button onClick={()=>setShowAddDoc(true)} style={{ padding:"9px 18px",borderRadius:9,border:"none",background:`linear-gradient(135deg,${A.cyan},#0099BB)`,color:"white",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 14px ${A.cyan}40` }}>✏️ Add Policy</button>
            </div>
            {sharedDocs.length===0 && (
              <div style={{ textAlign:"center",padding:"48px 20px",background:A.card,borderRadius:14,border:`1px dashed ${A.border}` }}>
                <div style={{ fontSize:36,marginBottom:12 }}>📋</div>
                <div style={{ fontSize:14,fontWeight:700,color:A.text,marginBottom:6 }}>No policies added yet</div>
                <div style={{ fontSize:12,color:A.muted,marginBottom:16 }}>Click "Add Policy" to paste your HR policy text. PeopleBot will answer employee questions from it instantly.</div>
                <button onClick={()=>setShowAddDoc(true)} style={{ padding:"10px 24px",borderRadius:9,border:"none",background:`linear-gradient(135deg,${A.cyan},#0099BB)`,color:"white",fontSize:13,fontWeight:700,cursor:"pointer" }}>✏️ Add Your First Policy</button>
              </div>
            )}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              {sharedDocs.map(d=>(
                <div key={d.id} style={{ background:A.card,border:`1px solid ${docOpen===d.id?`${A.cyan}60`:A.border}`,borderRadius:12,overflow:"hidden" }}>
                  <div style={{ padding:"14px 16px",cursor:"pointer" }} onClick={()=>setDocOpen(docOpen===d.id?null:d.id)}>
                    <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                      <div style={{ fontSize:28,lineHeight:1,flexShrink:0 }}>{d.icon||"📋"}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13,fontWeight:700,color:A.text }}>{d.title}</div>
                        <div style={{ fontSize:11,color:A.muted,marginTop:2 }}>
                          {d.content ? `~${Math.round(d.content.split(" ").length)} words` : "0 words"} · {d.date}
                        </div>
                        <div style={{ display:"flex",gap:6,marginTop:6 }}>
                          <span style={{ fontSize:10,padding:"2px 8px",borderRadius:5,background:`${A.cyan}18`,color:A.cyan,fontWeight:600 }}>{d.cat||"Policy"}</span>
                          <span style={{ fontSize:10,padding:"2px 8px",borderRadius:5,background:`${A.green}18`,color:A.green,fontWeight:600 }}>● Active</span>
                        </div>
                      </div>
                      <div style={{ display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end" }}>
                        <span style={{ fontSize:16,color:A.faint }}>{docOpen===d.id?"▲":"▼"}</span>
                        <button onClick={ev=>{ ev.stopPropagation(); if(window.confirm(`Delete "${d.title}"?`)) deleteDoc(d.id); }}
                          style={{ fontSize:11,padding:"3px 8px",borderRadius:6,border:`1px solid ${A.coral}40`,background:`${A.coral}12`,color:A.coral,cursor:"pointer",fontWeight:600 }}>
                          🗑 Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  {docOpen===d.id && (
                    <div style={{ borderTop:`1px solid ${A.border}`,padding:"12px 14px",background:A.bg,maxHeight:220,overflowY:"auto" }}>
                      <pre style={{ fontSize:11,color:A.muted,whiteSpace:"pre-wrap",fontFamily:"inherit",lineHeight:1.7,margin:0 }}>{d.content}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {sharedDocs.length>0 && (
              <div style={{ marginTop:14,padding:"10px 14px",background:`${A.gold}12`,borderRadius:10,fontSize:12,color:A.gold,border:`1px solid ${A.gold}30` }}>
                💡 {sharedDocs.length} polic{sharedDocs.length>1?"ies":"y"} in knowledge base ({sharedDocs.reduce((s,d)=>s+(d.content?d.content.split(" ").length:0),0)} total words). Keep combined total under 1200 words for best results.
              </div>
            )}
          </div>
        )}

        {/* ─ INTEGRATIONS ─ */}
        {tab==="int" && (
          <div>
            <div style={{ fontSize:18,fontWeight:800,color:A.text,marginBottom:4 }}>🔗 Integrations</div>
            <div style={{ fontSize:13,color:A.muted,marginBottom:18 }}>Connect PeopleBot to your existing tools for a fully automated HR workflow</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              {INTEGRATIONS.map((int,i)=>{
                const isConn = connected.has(int.name);
                return (
                  <div key={i} style={{ background:A.card,border:`1px solid ${isConn?`${A.green}50`:A.border}`,borderRadius:12,padding:"14px 16px" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                        <span style={{ fontSize:22 }}>{int.emoji}</span>
                        <span style={{ fontSize:13,fontWeight:700,color:A.text }}>{int.name}</span>
                      </div>
                      {int.badge && <span style={{ fontSize:10,padding:"2px 8px",borderRadius:5,background:isConn?`${A.green}22`:int.badge==="Recommended"?`${A.gold}22`:`${A.purple}22`,color:isConn?A.green:int.badge==="Recommended"?A.gold:A.purple,fontWeight:700 }}>{isConn?"Connected":int.badge}</span>}
                    </div>
                    <div style={{ fontSize:12,color:A.muted,lineHeight:1.55,marginBottom:10 }}>{int.desc}</div>
                    <button onClick={()=>setConnected(p=>{ const n=new Set(p); isConn?n.delete(int.name):n.add(int.name); return n; })} style={{ padding:"6px 14px",borderRadius:7,border:`1px solid ${isConn?`${A.green}60`:A.border}`,background:isConn?`${A.green}18`:"transparent",color:isConn?A.green:A.muted,fontSize:12,fontWeight:600,cursor:"pointer" }}>
                      {isConn?"✓ Disconnect":"+ Connect"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showAddDoc  && <AddDocModal onClose={()=>setShowAddDoc(false)} onSave={saveDoc} currentTotal={sharedDocs.reduce((s,d)=>s+(d.content?d.content.split(" ").length:0),0)} />}
      {showAddEmp  && <AddEmpModal nextId={nextEmpId} onClose={()=>setShowAddEmp(false)} onAdd={emp=>{ setEmployees(p=>[...p,emp]); setTab("emps"); }} />}
      {modal       && <EmailModal emp={modal.emp} day={modal.day} onClose={()=>setModal(null)} onSent={()=>setSent(p=>new Set([...p,`${modal.emp.id}-${modal.day}`]))} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  EMPLOYEE VIEW
// ══════════════════════════════════════════════════════════
function EmployeeView({ emp, onLogout, docs }) {
  const [tab,          setTab]          = useState("chat");
  const [msgs,         setMsgs]         = useState([{ role:"assistant", content:`Hey ${emp.name.split(" ")[0]}! 👋 What's on your mind? Ask me about leave, benefits, onboarding, or anything HR-related — I'm here to help. 😊` }]);
  const [input,        setInput]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState(null); // null | "ok" | "down"
  const inpRef = useRef();
  const endRef = useRef();

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);

  // Check backend health on load
  useEffect(()=>{
    fetch("http://localhost:3001/health")
      .then(r => setOllamaStatus(r.ok ? "ok" : "down"))
      .catch(()=> setOllamaStatus("down"));
  }, []);

  async function send() {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setInput("");
    setMsgs(p => [...p, { role:"user", content:txt }]);
    setLoading(true);
    try {
      const history = msgs.slice(-4).map(m=>({ role:m.role, content:m.content }));
      const res  = await fetch("http://localhost:3001/chat", {
        method:  "POST",
        headers: { "Content-Type":"application/json" },
        body:    JSON.stringify({ systemPrompt:mkPrompt(emp, docs, txt), messages:[...history, {role:"user",content:txt}] }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errMsg =
          data.error==="OLLAMA_NOT_RUNNING"    ? "⚠️ Ollama isn't running. Open a terminal and run: **ollama serve** — then try again." :
          data.error==="OLLAMA_MODEL_NOT_FOUND"? "⚠️ Model not downloaded yet. Run: **ollama pull llama3.2** — then try again." :
          `⚠️ Error: ${data.message||"Something went wrong."} — hr@kartikcorp.in`;
        setMsgs(p=>[...p,{role:"assistant",content:errMsg}]);
      } else {
        setMsgs(p=>[...p,{role:"assistant",content:data.reply}]);
      }
    } catch {
      setMsgs(p=>[...p,{role:"assistant",content:"⚠️ Cannot reach the PeopleBot backend. Make sure **node server/index.js** is running in your terminal."}]);
    }
    setLoading(false);
  }

  function fmt(t) {
    return t
      .replace(/\*\*(.*?)\*\*/g,"<b>$1</b>")
      .replace(/^- (.+)/gm,"<li style='margin:3px 0'>$1</li>")
      .replace(/\n/g,"<br/>");
  }

  const days = dSince(emp.joining);
  const pct  = Math.min(100, Math.round(days/90*100));
  const cis  = getCIs(emp);
  const QUICK = ["How do I apply for leave?","What all benefits do I have?","What are the onboarding Policies?","What are Flexible Work Options?","What are rewards and recoginition Plans?"];
  const statusColor = ollamaStatus==="ok" ? "#36C97E" : ollamaStatus==="down" ? "#FF5757" : "#8BA8CC";
  const statusLabel = ollamaStatus==="ok" ? "● Online" : ollamaStatus==="down" ? "● Offline (run: ollama serve)" : "● Checking...";

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100vh",background:E.bg,fontFamily:"'Inter',system-ui,sans-serif",overflow:"hidden" }}>

      {/* Header — matches screen2.png: white with teal bot icon */}
      <div style={{ background:E.surface,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,flexShrink:0,boxShadow:E.shadow,borderBottom:`1px solid ${E.border}` }}>
        <div style={{ width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${E.cyan},#005F5F)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="9" cy="10" r="1.5" fill="white"/><circle cx="15" cy="10" r="1.5" fill="white"/><path d="M8 15c1 1.5 5 1.5 6 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:16,fontWeight:700,color:E.text }}>PeopleBot</div>
          <div style={{ fontSize:11,color:E.muted,display:"flex",alignItems:"center",gap:5 }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:statusColor,display:"inline-block" }}/>
            {ollamaStatus==="ok"?"Online · Kartik Corp HR":ollamaStatus==="down"?"Offline — run: ollama serve":"Connecting..."}
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <div style={{ position:"relative" }}>
            <Av name={emp.name} sz={34} />
            <span style={{ position:"absolute",bottom:0,right:0,width:10,height:10,borderRadius:"50%",background:"#36C97E",border:"2px solid white" }}/>
          </div>
          <button onClick={onLogout} style={{ background:"transparent",border:`1px solid ${E.border}`,color:E.muted,fontSize:11,padding:"5px 12px",borderRadius:8,cursor:"pointer" }}>Exit</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:E.surface,borderBottom:`1px solid ${E.border}`,display:"flex",flexShrink:0,padding:"0 4px" }}>
        {[["chat","💬 Chat"],["journey","🗓 Journey"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"10px 18px",border:"none",background:"transparent",color:tab===t?E.teal:E.muted,fontWeight:tab===t?700:400,fontSize:13,cursor:"pointer",borderBottom:tab===t?`2.5px solid ${E.teal}`:"2.5px solid transparent",transition:"color 0.15s" }}>{l}</button>
        ))}
      </div>

      {/* CHAT — matches screen2.png */}
      {tab==="chat" && (
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
          {/* Date label */}
          <div style={{ textAlign:"center",padding:"12px 0 4px" }}>
            <span style={{ fontSize:12,color:E.muted,background:E.card,padding:"4px 14px",borderRadius:100,border:`1px solid ${E.border}` }}>Today</span>
          </div>
          <div style={{ flex:1,overflowY:"auto",padding:"8px 16px 6px",display:"flex",flexDirection:"column",gap:14 }}>
            {msgs.map((m,i)=>(
              <div key={i} style={{ display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:10,alignItems:"flex-end" }}>
                {m.role==="assistant" && (
                  <div style={{ width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${E.cyan},#005F5F)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:E.shadow }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  </div>
                )}
                <div style={{ maxWidth:"74%",padding:"12px 16px",borderRadius:m.role==="user"?"18px 4px 18px 18px":"4px 18px 18px 18px",background:m.role==="user"?`#006A6A`:E.surface,color:m.role==="user"?"#fff":E.text,fontSize:14,lineHeight:1.65,boxShadow:E.shadow,border:m.role==="user"?"none":`1px solid ${E.border}` }} dangerouslySetInnerHTML={{__html:fmt(m.content)}} />
                {m.role==="user" && <Av name={emp.name} sz={30} />}
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex",gap:10,alignItems:"flex-end" }}>
                <div style={{ width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${E.cyan},#005F5F)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </div>
                <div style={{ padding:"14px 18px",background:E.surface,borderRadius:"4px 18px 18px 18px",border:`1px solid ${E.border}`,display:"flex",gap:5,alignItems:"center",boxShadow:E.shadow }}>
                  {[0,1,2].map(i=><div key={i} style={{ width:8,height:8,borderRadius:"50%",background:E.teal,opacity:0.5,animation:`bob 1.2s ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick chips — matches screen2.png pill chips */}
          {msgs.length<=2 && (
            <div style={{ padding:"6px 14px 8px",display:"flex",gap:8,flexWrap:"nowrap",overflowX:"auto" }}>
              {QUICK.map(q=>(
                <button key={q} onClick={()=>{setInput(q);setTimeout(()=>inpRef.current?.focus(),50);}}
                  style={{ padding:"8px 16px",borderRadius:100,border:`1px solid ${E.border}`,background:E.surface,color:E.teal,fontSize:12,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",boxShadow:E.shadow }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input bar — matches screen2.png */}
          <div style={{ padding:"10px 14px 14px",background:E.surface,borderTop:`1px solid ${E.border}`,display:"flex",gap:8,alignItems:"center" }}>
            <input ref={inpRef} value={input} onChange={ev=>setInput(ev.target.value)} onKeyDown={ev=>ev.key==="Enter"&&!ev.shiftKey&&send()}
              placeholder="Ask me anything..."
              style={{ flex:1,padding:"12px 16px",borderRadius:26,border:`1.5px solid ${E.border}`,background:E.card,fontSize:14,outline:"none",color:E.text,transition:"border-color 0.15s" }}
              onFocus={ev=>ev.target.style.borderColor=E.teal}
              onBlur={ev=>ev.target.style.borderColor=E.border} />
            <button onClick={send} disabled={loading||!input.trim()}
              style={{ width:46,height:46,borderRadius:"50%",background:loading||!input.trim()?E.border:`linear-gradient(135deg,${E.teal},#004F4F)`,border:"none",cursor:loading||!input.trim()?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:!loading&&input.trim()?`0 4px 14px ${E.teal}40`:"none",transition:"all 0.15s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>

          {/* Bottom nav — matches screen2.png */}
          <div style={{ background:E.surface,borderTop:`1px solid ${E.border}`,display:"flex",padding:"8px 0 4px" }}>
            {[["💬","Chat",true],["🕐","History",false],["↻","Updates",false],["⚙","Settings",false]].map(([ic,lb,active])=>(
              <div key={lb} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 0",cursor:"pointer" }}>
                <span style={{ fontSize:18,color:active?E.teal:E.muted }}>{ic}</span>
                <span style={{ fontSize:10,color:active?E.teal:E.muted,fontWeight:active?600:400 }}>{lb}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JOURNEY */}
      {tab==="journey" && (
        <div style={{ flex:1,overflowY:"auto",padding:"20px 18px" }}>
          <div style={{ background:`linear-gradient(135deg,${E.navy},#1E3D6B)`,borderRadius:16,padding:"20px 22px",marginBottom:20,color:"#fff" }}>
            <div style={{ display:"flex",alignItems:"center",gap:14 }}>
              <Av name={emp.name} sz={52} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18,fontWeight:800,marginBottom:2 }}>{emp.name}</div>
                <div style={{ fontSize:13,opacity:0.8 }}>{emp.role} · {emp.dept}</div>
                <div style={{ fontSize:12,opacity:0.6,marginTop:2 }}>{fDateL(emp.joining)} · {emp.location} · Reports to {emp.manager}</div>
              </div>
              <div style={{ textAlign:"center",background:"rgba(255,255,255,0.1)",padding:"10px 16px",borderRadius:12 }}>
                <div style={{ fontSize:34,fontWeight:900,color:"#FFBB35",lineHeight:1 }}>{days}</div>
                <div style={{ fontSize:11,opacity:0.7 }}>days in</div>
              </div>
            </div>
            {days<=90 && (
              <div style={{ marginTop:16 }}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,opacity:0.7,marginBottom:6 }}>
                  <span>Onboarding Progress</span><span>{pct}%</span>
                </div>
                <div style={{ height:7,background:"rgba(255,255,255,0.15)",borderRadius:4,overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`,height:"100%",borderRadius:4,background:"linear-gradient(90deg,#00D4D4,#FFBB35)",transition:"width 0.5s" }} />
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,opacity:0.5,marginTop:4 }}>
                  <span>Day 1</span><span>Day 30</span><span>Day 60</span><span>Day 90</span>
                </div>
              </div>
            )}
          </div>
          <div style={{ fontSize:13,fontWeight:700,color:E.text,marginBottom:14 }}>📅 Your Check-in Timeline</div>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute",left:17,top:0,bottom:0,width:2,background:`linear-gradient(180deg,${E.red},${E.cyan})`,opacity:0.15,borderRadius:1 }} />
            {cis.map(ci=>(
              <div key={ci.day} style={{ paddingLeft:42,marginBottom:12,position:"relative" }}>
                <div style={{ position:"absolute",left:9,top:6,width:18,height:18,borderRadius:"50%",background:ci.done?"#059669":ci.due?E.red:E.border,border:`2.5px solid ${ci.done?"#059669":ci.due?E.red:"#C5D0E8"}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:ci.due?`0 0 10px ${E.red}50`:"none" }}>
                  {ci.done && <span style={{ fontSize:9,color:"#fff",fontWeight:800 }}>✓</span>}
                  {ci.due  && <span style={{ fontSize:8,color:"#fff",fontWeight:800 }}>!</span>}
                </div>
                <div style={{ background:E.surface,border:`1px solid ${ci.due?`${E.red}40`:E.border}`,borderRadius:10,padding:"10px 14px",boxShadow:ci.due?`0 2px 12px ${E.red}15`:"none" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <span style={{ fontSize:13,fontWeight:600,color:E.text }}>Day {ci.day} Check-in</span>
                      {ci.due  && <span style={{ fontSize:11,background:`${E.red}12`,color:E.red,padding:"2px 8px",borderRadius:10,fontWeight:600 }}>Due now</span>}
                      {ci.done && <span style={{ fontSize:11,background:"#05966912",color:"#059669",padding:"2px 8px",borderRadius:10,fontWeight:600 }}>✓ Complete</span>}
                    </div>
                    <span style={{ fontSize:12,color:E.muted }}>{ci.date}</span>
                  </div>
                  <div style={{ fontSize:12,color:E.muted,marginTop:3 }}>
                    {ci.day<=90 ? "HR team checks in every 15 days during your first 3 months" : "Ongoing monthly check-in"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes bob{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  LOGIN — matches Stitch design (screen3.png)
// ══════════════════════════════════════════════════════════
function Login({ onAdmin, onEmp, allEmps }) {
  const [pick, setPick] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(()=>{
    fetch("http://localhost:3001/health").then(r=>r.ok?setStatus("ok"):setStatus("down")).catch(()=>setStatus("down"));
  },[]);

  if (pick) return (
    <div style={{ minHeight:"100vh",background:A.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ width:"100%",maxWidth:380 }}>
        <button onClick={()=>setPick(false)} style={{ background:"transparent",border:"none",color:A.muted,fontSize:13,cursor:"pointer",marginBottom:20,display:"flex",alignItems:"center",gap:6 }}>
          ← Back
        </button>
        <div style={{ fontSize:18,fontWeight:700,color:A.text,marginBottom:4 }}>Select Your Profile</div>
        <div style={{ fontSize:13,color:A.muted,marginBottom:18 }}>Choose your employee to continue</div>
        {allEmps.map(e=>(
          <div key={e.id} onClick={()=>onEmp(e)}
            style={{ background:A.card,border:`1px solid ${A.border}`,borderRadius:14,padding:"14px 16px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all 0.15s" }}
            onMouseEnter={ev=>{ev.currentTarget.style.borderColor=A.cyan;ev.currentTarget.style.background=A.cardHi;}}
            onMouseLeave={ev=>{ev.currentTarget.style.borderColor=A.border;ev.currentTarget.style.background=A.card;}}>
            <Av name={e.name} sz={40} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14,fontWeight:600,color:A.text }}>{e.name}</div>
              <div style={{ fontSize:12,color:A.muted,marginTop:2 }}>{e.role} · {e.dept}</div>
              <div style={{ fontSize:11,color:A.cyan,marginTop:2 }}>Day {dSince(e.joining)} at Kartik Corp</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={A.muted} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:A.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Inter',system-ui,sans-serif",position:"relative",overflow:"hidden" }}>
      {/* Glow effects matching Stitch */}
      <div style={{ position:"absolute",top:"15%",left:"50%",transform:"translateX(-50%)",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(34,220,220,0.08),transparent 70%)",pointerEvents:"none" }} />

      <div style={{ width:"100%",maxWidth:380,textAlign:"center",position:"relative",zIndex:1 }}>

        {/* Logo — matches screen3.png squircle icon */}
        <div style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#0D2A3A,#0A1F2E)",border:`1.5px solid ${A.borderHi}`,marginBottom:20,boxShadow:`0 0 32px rgba(34,220,220,0.2)` }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="#22DCDC" strokeWidth="2.5"/>
            <polyline points="12,20 18,26 28,14" stroke="#22DCDC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="30" cy="10" r="4" fill="#22DCDC"/>
          </svg>
        </div>

        <div style={{ fontSize:32,fontWeight:700,color:A.text,letterSpacing:-0.5,marginBottom:4 }}>PeopleBot</div>
        <div style={{ fontSize:14,color:A.cyan,fontWeight:600,marginBottom:8 }}>by Kartik Corp.</div>
        <div style={{ fontSize:14,color:A.muted,marginBottom:20,lineHeight:1.6 }}>AI-powered HR assistant for the modern enterprise.</div>

        {/* System status pill */}
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:100,background:A.card,border:`1px solid ${A.border}`,marginBottom:32,fontSize:13 }}>
          <span style={{ width:8,height:8,borderRadius:"50%",background:status==="ok"?"#36C97E":status==="down"?"#FF5757":"#FFBB35",display:"inline-block",boxShadow:status==="ok"?"0 0 8px #36C97E80":undefined }} />
          <span style={{ color:A.text,fontWeight:500 }}>{status==="ok"?"System Online":status==="down"?"System Offline":"Checking..."}</span>
        </div>

        <div style={{ fontSize:11,fontWeight:600,color:A.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16 }}>Select your role to continue</div>

        {/* Role cards — matches screen3.png */}
        {[
          { title:"HR Admin",  sub:"Manage talent, payroll, and organization data with full-access control.", icon:"shield", col:A.cyan, action:onAdmin },
          { title:"Employee",  sub:"Access your personal dashboard, submit requests, and view company documents.", icon:"person", col:"#FF9E99", action:()=>setPick(true) },
        ].map(c=>(
          <div key={c.title} onClick={c.action}
            style={{ background:A.card,border:`1px solid ${A.border}`,borderRadius:16,padding:"18px 20px",marginBottom:12,cursor:"pointer",display:"flex",alignItems:"center",gap:16,textAlign:"left",transition:"all 0.2s" }}
            onMouseEnter={ev=>{ev.currentTarget.style.borderColor=c.col;ev.currentTarget.style.boxShadow=`0 4px 20px ${c.col}20`;}}
            onMouseLeave={ev=>{ev.currentTarget.style.borderColor=A.border;ev.currentTarget.style.boxShadow="none";}}>
            <div style={{ width:52,height:52,borderRadius:14,background:`${c.col}18`,border:`1px solid ${c.col}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              {c.icon==="shield"
                ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c.col} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c.col} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              }
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:17,fontWeight:700,color:A.text,marginBottom:4 }}>{c.title}</div>
              <div style={{ fontSize:13,color:A.muted,lineHeight:1.5 }}>{c.sub}</div>
            </div>
          </div>
        ))}

        <div style={{ marginTop:24,fontSize:12,color:A.faint }}>
          Trouble signing in? <span style={{color:A.cyan,cursor:"pointer"}}>Contact IT Support</span>
        </div>
        <div style={{ marginTop:8,fontSize:10,color:A.faint,letterSpacing:"0.1em" }}>V1.0 · KARTIK CORP ENTERPRISE</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  ROOT — shared state lives here
// ══════════════════════════════════════════════════════════
export default function App() {
  const [screen,     setScreen]     = useState("login");
  const [empUser,    setEmpUser]    = useState(null);
  const [employees,  setEmployees]  = useState(SEED_EMPS);  // LIFTED — shared across all views
  const [sharedDocs, setSharedDocs] = useState([]);
  const [docsLoaded, setDocsLoaded] = useState(false);

  // Load saved docs from backend on startup
  useEffect(()=>{
    fetch("http://localhost:3001/docs")
      .then(r=>r.json())
      .then(data=>{ setSharedDocs(Array.isArray(data)?data:[]); setDocsLoaded(true); })
      .catch(()=>setDocsLoaded(true));
  },[]);

  if (!docsLoaded) return (
    <div style={{ minHeight:"100vh",background:"#07101E",display:"flex",alignItems:"center",justifyContent:"center",color:"#5E7A99",fontFamily:"Inter,system-ui,sans-serif",fontSize:14 }}>
      Loading PeopleBot...
    </div>
  );

  if (screen==="admin") return (
    <AdminView
      onLogout={()=>setScreen("login")}
      sharedDocs={sharedDocs}
      setSharedDocs={setSharedDocs}
      employees={employees}
      setEmployees={setEmployees}
    />
  );
  if (screen==="emp" && empUser) return (
    <EmployeeView
      emp={empUser}
      onLogout={()=>setScreen("login")}
      docs={sharedDocs}
    />
  );
  return (
    <Login
      allEmps={employees}
      onAdmin={()=>setScreen("admin")}
      onEmp={e=>{ setEmpUser(e); setScreen("emp"); }}
    />
  );
}

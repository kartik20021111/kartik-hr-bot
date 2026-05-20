// ══════════════════════════════════════════════════════════
//  PEOPLEBOT BACKEND  —  Express + Ollama + Doc Persistence
//  Start with:  node server/index.js
// ══════════════════════════════════════════════════════════

const express = require("express");
const cors    = require("cors");
const fs      = require("fs");
const path    = require("path");

const app = express();
app.use(cors());
app.use(express.json({ limit:"10mb" }));

// ── Docs persistence — saved to docs.json in server folder ──
const DOCS_FILE = path.join(__dirname, "docs.json");

function loadDocs() {
  try {
    if (fs.existsSync(DOCS_FILE)) return JSON.parse(fs.readFileSync(DOCS_FILE, "utf8"));
  } catch(e) { console.error("Could not read docs.json:", e.message); }
  return [];
}

function saveDocs(docs) {
  try { fs.writeFileSync(DOCS_FILE, JSON.stringify(docs, null, 2), "utf8"); }
  catch(e) { console.error("Could not write docs.json:", e.message); }
}

// ── Health check ────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status:"ok", message:"PeopleBot backend running" });
});

// ── GET /docs — load all saved policies ─────────────────────
app.get("/docs", (req, res) => {
  res.json(loadDocs());
});

// ── POST /docs — save a new pasted policy ───────────────────
app.post("/docs", (req, res) => {
  const doc = req.body;
  if (!doc || !doc.id || !doc.title) return res.status(400).json({ error:"Invalid doc" });
  const docs    = loadDocs();
  const updated = [doc, ...docs.filter(d => d.id !== doc.id)];
  saveDocs(updated);
  res.json({ ok:true, count:updated.length });
});

// ── DELETE /docs/:id — remove a policy ──────────────────────
app.delete("/docs/:id", (req, res) => {
  const updated = loadDocs().filter(d => d.id !== req.params.id);
  saveDocs(updated);
  res.json({ ok:true, count:updated.length });
});

// ── POST /chat — send to Ollama ──────────────────────────────
app.post("/chat", async (req, res) => {
  console.log("CHAT REQUEST RECEIVED");
  const { messages, systemPrompt } = req.body;

  if (!messages || !systemPrompt) {
    return res.status(400).json({ error:"messages and systemPrompt required" });
  }

  try {
    console.log("Prompt length:", systemPrompt.length, "chars");

    const ollamaRes = await fetch(
  `${process.env.OLLAMA_URL || "http://localhost:11434"}/api/chat`,
  {
      method:  "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({
        model:   "qwen2:1.5b",
        stream:  false,
        options: {
          temperature: 0,
          num_predict: 120,
          num_ctx:     4096,
        },
        messages: [
          { role:"system", content:systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!ollamaRes.ok) {
      const errText = await ollamaRes.text();
      const isMissing = errText.toLowerCase().includes("model") || ollamaRes.status===404;
      return res.status(503).json({
        error:   isMissing ? "OLLAMA_MODEL_NOT_FOUND" : "OLLAMA_ERROR",
        message: isMissing ? "Model not found. Run: qwen2:1.5b" : "Ollama error: "+errText,
      });
    }

    const data  = await ollamaRes.json();
    console.log("OLLAMA REPLY:", data.message?.content?.slice(0,120));
    const reply = data.message?.content || "No response from model.";
    res.json({ reply });

  } catch(err) {
    if (err.code==="ECONNREFUSED" || err.message.includes("ECONNREFUSED")) {
      return res.status(503).json({
        error:   "OLLAMA_NOT_RUNNING",
        message: "Ollama is not running. Start it with: ollama serve",
      });
    }
    console.error("Chat error:", err.message);
    res.status(500).json({ error:"Server error", message:err.message });
  }
});

// ── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("\n✅  PeopleBot backend running → http://localhost:" + PORT);
  console.log("   /health      — status check");
  console.log("   /docs        — GET load / POST save / DELETE remove policies");
  console.log("   /chat        — Ollama chat");
  console.log("\n   Requires Ollama running:   ollama serve");
  console.log("   Requires model:            qwen2:1.5b\n");
});

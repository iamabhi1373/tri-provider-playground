// server.js
import express from "express";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

// Helpers
const ok = (x) => x && typeof x === "string" && x.trim().length > 0;
const withTimeout = async (p, ms = 60000, name = "request") => {
  const t = new Promise((_, rej) => setTimeout(() => rej(new Error(`${name} timed out after ${ms} ms`)), ms));
  return Promise.race([p, t]);
};

// ---- OpenAI-compatible (OpenAI & DeepSeek) ----
async function callOpenAICompatible({ baseURL, apiKey, model, prompt }) {
  if (!ok(apiKey)) throw new Error("Missing API key");
  const url = `${baseURL}/v1/chat/completions`;
  const body = {
    model: model || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    stream: false,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ error: { message: `Non-JSON response (${res.status})` } }));
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
  const text = data?.choices?.[0]?.message?.content ?? "";
  const usage = data?.usage || null;
  return { text, usage };
}

// ---- Gemini (Google Generative Language API) ----
async function callGemini({ apiKey, model, prompt }) {
  if (!ok(apiKey)) throw new Error("Missing API key");
  const m = model || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }]}],
    generationConfig: { temperature: 0.7 },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ error: { message: `Non-JSON response (${res.status})` } }));
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text ?? "").join("") ?? "";
  const usage = data?.usageMetadata || null; // { promptTokenCount, candidatesTokenCount, totalTokenCount }
  return { text, usage };
}

// POST /api/compare : fan-out to all three in parallel
app.post("/api/compare", async (req, res) => {
  const { prompt, openaiKey, openaiModel, deepseekKey, deepseekModel, geminiKey, geminiModel } = req.body || {};
  if (!ok(prompt)) return res.status(400).json({ error: "Missing prompt" });

  const started = Date.now();
  const jobs = {
    openai: withTimeout(
      callOpenAICompatible({ baseURL: "https://api.openai.com", apiKey: openaiKey, model: openaiModel, prompt }),
      60000,
      "OpenAI"
    ).then(r => ({ ok: true, ...r, ms: Date.now() - started })).catch(e => ({ ok: false, error: String(e.message), ms: Date.now() - started })),

    deepseek: withTimeout(
      callOpenAICompatible({ baseURL: "https://api.deepseek.com", apiKey: deepseekKey, model: deepseekModel || "deepseek-chat", prompt }),
      60000,
      "DeepSeek"
    ).then(r => ({ ok: true, ...r, ms: Date.now() - started })).catch(e => ({ ok: false, error: String(e.message), ms: Date.now() - started })),

    gemini: withTimeout(
      callGemini({ apiKey: geminiKey, model: geminiModel, prompt }),
      60000,
      "Gemini"
    ).then(r => ({ ok: true, ...r, ms: Date.now() - started })).catch(e => ({ ok: false, error: String(e.message), ms: Date.now() - started })),
  };

  const [openai, deepseek, gemini] = await Promise.allSettled([jobs.openai, jobs.deepseek, jobs.gemini]).then((arr) => arr.map(x => x.value));
  res.json({ openai, deepseek, gemini });
});

// Health
app.get("/health", (_, res) => res.json({ ok: true }));

// Serve index.html for root route
app.get("/", (_, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`tri-provider-playground listening on http://localhost:${PORT}`));
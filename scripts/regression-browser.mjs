import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const chrome = process.env.CHROME_BIN || process.env.GOOGLE_CHROME_BIN;
if (!chrome) throw new Error("Set CHROME_BIN to a Chrome/Chromium executable");
const base = (process.env.WEB_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const routes = ["/", "/services", "/book", "/quote", "/about", "/team", "/how-we-clean", "/equipment", "/before-after", "/reviews", "/service-areas", "/faq", "/careers", "/resources"];
const port = 9229 + Math.floor(Math.random() * 500);
const profile = await mkdtemp(join(tmpdir(), "bio-chrome-"));
const proc = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-sandbox", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitJson(url) { for (let i=0;i<50;i++){ try { const r=await fetch(url); if(r.ok)return r.json(); } catch {} await sleep(100); } throw new Error("Chrome DevTools did not start"); }
let seq = 0;
async function openRoute(route) {
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(base + route)}`, { method: "PUT" })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
  const pending = new Map();
  ws.onmessage = (event) => { const msg=JSON.parse(event.data); if(msg.id && pending.has(msg.id)){ pending.get(msg.id)(msg); pending.delete(msg.id); } };
  const send=(method,params={})=>new Promise((resolve)=>{const id=++seq;pending.set(id,resolve);ws.send(JSON.stringify({id,method,params}));});
  await send("Runtime.enable");
  await sleep(600);
  const result = await send("Runtime.evaluate", { expression: `JSON.stringify({title:document.title,text:(document.body?.innerText||"").slice(0,4000),href:location.href})`, returnByValue: true });
  const value = JSON.parse(result.result.result.value || "{}");
  ws.close();
  await fetch(`http://127.0.0.1:${port}/json/close/${tab.id}`);
  if (!value.title || !value.text || /Application error|Internal Server Error/i.test(value.text)) throw new Error(`Invalid render: ${route}`);
  console.log(`PASS ${route} · ${value.title}`);
}
try {
  await waitJson(`http://127.0.0.1:${port}/json/version`);
  for (const route of routes) await openRoute(route);
} finally {
  proc.kill("SIGTERM");
  await rm(profile, { recursive: true, force: true });
}

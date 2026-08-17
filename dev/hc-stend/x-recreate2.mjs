import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const p = await b.newPage(); await p.goto('http://127.0.0.1:4517/');
await p.evaluate(() => { window.__m=[]; addEventListener('message', e => window.__m.push(e.data && e.data.ok)); });
const mk = (id, doc, sb='allow-scripts') => p.evaluate(([id, doc, sb]) => { const f = document.createElement('iframe'); f.id = id; f.setAttribute('sandbox',sb); f.srcdoc = doc; document.body.appendChild(f); }, [id, doc, sb]);
await mk('a', '<script>parent.postMessage({ok:"a"},"*")</script>');
await mk('h', '<script>while(true){}</script>'); await p.waitForTimeout(1500);
// hamma frame'ni olib tashlash
await p.evaluate(() => document.querySelectorAll('iframe').forEach(f => f.remove()));
for (const w of [300, 1000, 3000]) { await p.waitForTimeout(w); await mk('n'+w, `<script>parent.postMessage({ok:"n${w}"},"*")</script>`); await p.waitForTimeout(1500); console.log(`hammasi olib tashlangach +${w}ms:`, await p.evaluate(() => window.__m)); }
// Variant: qotgan frame boshqa sandbox bayrog'i bilan (allow-scripts allow-popups) — boshqa jarayonmi?
await p.evaluate(() => { window.__m=[]; document.querySelectorAll('iframe').forEach(f => f.remove()); });
await mk('h2', '<script>while(true){}</script>', 'allow-scripts allow-popups allow-popups-to-escape-sandbox'); await p.waitForTimeout(1200);
await mk('s', '<script>parent.postMessage({ok:"s-allow-scripts-only"},"*")</script>', 'allow-scripts'); await p.waitForTimeout(1500);
console.log('boshqa sandbox-bayroq → alohida jarayonmi:', await p.evaluate(() => window.__m));
await b.close();

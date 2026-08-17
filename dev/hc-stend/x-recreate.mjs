import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const p = await b.newPage(); await p.goto('http://127.0.0.1:4517/');
const mk = (id, doc) => p.evaluate(([id, doc]) => { const f = document.createElement('iframe'); f.id = id; f.setAttribute('sandbox','allow-scripts'); f.srcdoc = doc; document.body.appendChild(f); }, [id, doc]);
const txt = (id) => Promise.race([p.evaluate((id) => document.getElementById(id).contentWindow ? 'no-access' : 'x', id).catch(e=>'err'), new Promise(r=>setTimeout(()=>r('TIMEOUT'),3000))]);
// A: sog'lom frame + qotgan frame (bir jarayon)
await mk('a', '<h1>A</h1><script>parent.postMessage({ok:"a"},"*")</script>');
await p.evaluate(() => { window.__m=[]; addEventListener('message', e => window.__m.push(e.data && e.data.ok)); });
await mk('h', '<script>while(true){}</script>');
await p.waitForTimeout(1500);
await mk('b', '<h1>B</h1><script>parent.postMessage({ok:"b"},"*")</script>');
await p.waitForTimeout(2500);
console.log('1) qotgan frame TURGANDA yangi frame b xabar yubordimi:', await p.evaluate(() => window.__m));
// remove hung, add new
await p.evaluate(() => document.getElementById('h').remove());
await p.waitForTimeout(500);
await mk('c', '<h1>C</h1><script>parent.postMessage({ok:"c"},"*")</script>');
await p.waitForTimeout(2500);
console.log('2) qotgan frame OLIB TASHLANGACH yangi frame c:', await p.evaluate(() => window.__m));
// srcdoc replace on hung? make new hung then replace srcdoc
await mk('h2', '<script>while(true){}</script>'); await p.waitForTimeout(1000);
await p.evaluate(() => { document.getElementById('h2').srcdoc = '<script>parent.postMessage({ok:"h2-new"},"*")</script>'; });
await p.waitForTimeout(2500);
console.log('3) qotgan frame srcdoc almashtirilsa:', await p.evaluate(() => window.__m));
await p.evaluate(() => document.getElementById('h2').remove()); await p.waitForTimeout(300);
await mk('d', '<script>parent.postMessage({ok:"d"},"*")</script>'); await p.waitForTimeout(2000);
console.log('4) h2 olib tashlangach d:', await p.evaluate(() => window.__m));
await b.close();

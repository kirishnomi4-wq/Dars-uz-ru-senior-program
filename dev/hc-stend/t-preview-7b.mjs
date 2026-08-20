import { chromium } from 'playwright-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const b = await chromium.launch({ executablePath: CHROME, headless: true });
const TASK = { title: 'Layout', brief: 'Shartlarni bajaring', files: [ { name: 'index.html', lang: 'html', starter: '<h1>Salom</h1><p>matn</p>' }, { name: 'style.css', lang: 'css', starter: 'h1{color:red}' }, { name: 'app.js', lang: 'js', starter: 'console.log("salom");console.log("yana")' } ], requirements: [ { id: 'a', label: 'h1 sarlavha', check: { tag: 'h1', text: true } }, { id: 'b', label: 'p matn', check: { tag: 'p', text: true } } ] };
for (const [name, vp] of [['375x667', { width: 375, height: 667 }], ['360x640-urlbar', { width: 360, height: 584 }], ['412x915', { width: 412, height: 915 }], ['768x1024', { width: 768, height: 1024 }]]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.route('http://127.0.0.1:4517/', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0"><div id="root"></div><script src="./bundle.js"></script></body></html>' }));
  await p.goto('http://127.0.0.1:4517/');
  await p.evaluate((TASK) => { const r = document.getElementById('root'); r.style.cssText = 'position:fixed;inset:0;overflow:auto;background:#eee'; window.mountHC({ lang: 'uz', task: TASK }); }, TASK);
  await p.waitForSelector('.hc-code'); await p.waitForTimeout(1000);
  const m = await p.evaluate(() => { const r = document.querySelector('.hc-root'), rb = r.getBoundingClientRect(); const q = (s) => { const e = document.querySelector(s); if (!e) return null; const x = e.getBoundingClientRect(); return `${Math.round(x.width)}x${Math.round(x.height)}@${Math.round(x.top)}`; }; return { inner: innerWidth + 'x' + innerHeight, root: `${Math.round(rb.width)}x${Math.round(rb.height)}`, rootScroll: document.getElementById('root').scrollHeight, editor: q('.hc-editor-pane'), code: q('.hc-code'), keys: q('.hc-keys'), bottom: q('.hc-bottom'), tabs: q('.hc-panetabs'), overflowX: document.documentElement.scrollWidth > innerWidth }; });
  console.log(name, JSON.stringify(m));
  await p.screenshot({ path: `shot-layout-m-${name}.png` });
  await p.click('.hc-panetabs button:has-text("Natija")').catch((e) => console.log('no natija tab', e.message.slice(0, 50))); await p.waitForTimeout(400);
  console.log('  natija:', await p.evaluate(() => { const q = (s) => { const e = document.querySelector(s); if (!e) return null; const x = e.getBoundingClientRect(); return `${Math.round(x.width)}x${Math.round(x.height)}@${Math.round(x.top)}`; }; return { preview: q('.hc-preview-pane'), frame: q('.hc-frame'), console: q('.hc-console') }; }));
  await p.screenshot({ path: `shot-layout-m-${name}-natija.png` });
  await ctx.close();
}
await b.close();

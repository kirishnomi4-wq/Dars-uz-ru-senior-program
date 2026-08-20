import { chromium } from 'playwright-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const b = await chromium.launch({ executablePath: CHROME, headless: true });
const TASK = { title: 'Layout', brief: 'Shartlarni bajaring', files: [ { name: 'index.html', lang: 'html', starter: '<h1>Salom</h1><p>matn</p>' }, { name: 'style.css', lang: 'css', starter: 'h1{color:red}' }, { name: 'app.js', lang: 'js', starter: 'console.log("salom");console.log("yana")' } ], requirements: [ { id: 'a', label: 'h1 sarlavha', check: { tag: 'h1', text: true } }, { id: 'b', label: 'p matn', check: { tag: 'p', text: true } } ] };
for (const [name, vp, mobile] of [['375x667-mobile', { width: 375, height: 667 }, true], ['768x1024', { width: 768, height: 1024 }, false], ['1024x600-short', { width: 1024, height: 600 }, false], ['1366x768', { width: 1366, height: 768 }, false], ['2560x1440', { width: 2560, height: 1440 }, false]]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); await p.goto('http://127.0.0.1:4517/');
  await p.evaluate((TASK) => { const r = document.getElementById('root'); r.style.cssText = 'position:fixed;inset:0;overflow:auto;background:#eee'; window.mountHC({ lang: 'uz', task: TASK }); }, TASK);
  await p.waitForSelector('.hc-code'); await p.waitForTimeout(1200);
  const m = await p.evaluate(() => { const r = document.querySelector('.hc-root'), rb = r.getBoundingClientRect(); const q = (s) => { const e = document.querySelector(s); if (!e) return null; const x = e.getBoundingClientRect(); return `${Math.round(x.width)}x${Math.round(x.height)}@${Math.round(x.top)}`; }; return { root: `${Math.round(rb.width)}x${Math.round(rb.height)}`, docScroll: document.documentElement.scrollHeight + '/' + innerHeight, rootScroll: document.getElementById('root').scrollHeight, editor: q('.hc-editor-pane'), preview: q('.hc-preview-pane'), frame: q('.hc-frame'), console: q('.hc-console'), bottom: q('.hc-bottom'), overflowX: document.documentElement.scrollWidth > innerWidth }; });
  console.log(name, JSON.stringify(m));
  await p.screenshot({ path: `shot-layout-${name}.png` });
  if (mobile) { await p.click('button:has-text("Natija")').catch(() => {}); await p.waitForTimeout(400); await p.screenshot({ path: `shot-layout-${name}-natija.png` }); }
  await ctx.close();
}
await b.close();

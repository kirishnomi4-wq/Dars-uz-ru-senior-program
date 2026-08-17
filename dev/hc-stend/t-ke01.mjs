import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const task = { title: 't', files: [ { name: 'index.html', lang: 'html', starter: '<h1>x</h1>' }, { name: 'style.css', lang: 'css', starter: '' }, { name: 'script.js', lang: 'js', starter: '' } ], requirements: [ { tag: 'h1' } ] };
for (const [w, h, touch] of [[390, 844, true], [600, 900, false], [1024, 768, false], [1280, 800, false], [1366, 768, false], [1400, 900, false]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch }); const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4517/'); await p.evaluate((task) => window.mountHC({ lang: 'uz', task }), task); await p.waitForSelector('.hc-tab');
  const vis = await p.$$eval('.hc-tab', els => els.map(e => { const r = e.getBoundingClientRect(); const pr = e.closest('.hc-tabs').getBoundingClientRect(); return { n: e.textContent, w: Math.round(r.width), inside: r.left >= pr.left - 1 && r.right <= pr.right + 1 && r.width > 0 }; }));
  const tabsW = await p.$eval('.hc-tabs', e => Math.round(e.getBoundingClientRect().width));
  // script.js ga bosib bo'ladimi (scroll bilan)
  let clicked = 'n/a'; try { await p.click('.hc-tab:has-text("script.js")', { timeout: 2000 }); clicked = await p.$eval('.hc-tab.active', e => e.textContent); } catch (e) { clicked = 'BOSIB BO\'LMADI'; }
  console.log(`${w}x${h}${touch?' touch':''}: tabsW=${tabsW} `, vis.map(v => `${v.n}:${v.inside?'ko\'rinadi':'YASHIRIN'}(${v.w})`).join(' '), '| script.js bosish →', clicked);
  await p.screenshot({ path: `ke01-${w}.png` }); await ctx.close();
}
await b.close();

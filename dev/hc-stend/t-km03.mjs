import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
for (const lang of ['uz', 'ru']) {
  const p = await b.newPage(); await p.goto('http://127.0.0.1:4517/'); await p.evaluate((lang) => window.mountHC({ lang }), lang); await p.waitForSelector('.hc-code');
  await p.fill('.hc-code', '<h1>Salom</h1><img src="yoq.png" alt="mushuk"><img src="yoq2.png">'); await p.waitForTimeout(1500);
  const fr = p.frames().find(f => f.parentFrame() === p.mainFrame());
  console.log(lang, '→', await fr.evaluate(() => ({ lang: document.documentElement.lang, fb: [...document.querySelectorAll('.hc-imgfb')].map(e => e.textContent.trim().replace(/\s+/g, ' ')) })));
  await p.close();
}
await b.close();

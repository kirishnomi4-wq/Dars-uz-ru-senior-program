import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 773 } });
await p.goto('http://localhost:5300/#/lesson/m9-01', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(1500);
console.log(await p.evaluate(() => { const root = document.querySelector('.stage-content') || document.querySelector('.lesson-root'); const emo = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}]/gu;
  const out = []; for (const el of root.querySelectorAll('*')) { if (el.children.length) continue; const m = (el.textContent || '').match(emo); if (m) out.push(m.join('') + ' @' + (el.className || el.tagName) + ' «' + el.textContent.trim().slice(0, 30) + '»'); } return out.join('\n'); }));
await b.close();

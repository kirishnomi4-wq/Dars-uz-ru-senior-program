// K-C-09 til-almashuv: BIR XIL instansiyada lang uz→ru — konsol xato-matni qayta ishga tushirmasdan ruscha bo'ladi (K-M-01 mexanizmi)
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 1400, height: 900 } })).newPage();
await p.goto('http://127.0.0.1:4517/i18n.html');
const TASK = { title: 't', requirements: [{ id: 'r', label: 'r', logs: 'zzz' }], files: [{ name: 'index.html', lang: 'html', starter: '<h1>x</h1>' }, { name: 'style.css', lang: 'css', starter: '' }, { name: 'script.js', lang: 'js', starter: 'console.log(1);\nfoo();' }] };
await p.evaluate((t) => { localStorage.clear(); window.renderHC({ lang: 'uz', task: t }); }, TASK);
await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(1500);
const lines = () => p.$$eval('.hc-console-line', els => els.map(e => e.textContent.trim()));
const uz = await lines();
await p.evaluate((t) => window.renderHC({ lang: 'ru', task: t }), TASK);
await p.waitForTimeout(400);
const ru = await lines();
const ok = uz.some(l => /aniqlanmagan/.test(l)) && ru.some(l => /не определено/.test(l)) && uz.length === ru.length;
console.log(`${ok ? '✓' : '✗ KUTILMAGAN'} [TIL bir instansiya] uz=${JSON.stringify(uz)} → ru=${JSON.stringify(ru)} (satr soni ${uz.length}→${ru.length}, qayta ishga tushmadi)`);
await b.close();

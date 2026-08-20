// i18n sinovi 2 — BIR XIL komponent-instansiyada lang: 'uz' → 'ru' almashtirilganda
// qaysi matnlar eski tilda qolib ketishini topadi (kod o'zgarmagan holda).
import { chromium } from 'playwright-core';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const b = await chromium.launch({ executablePath: CHROME, headless: true });
const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
await p.goto('http://127.0.0.1:4517/i18n.html');
await p.evaluate(() => { localStorage.clear(); window.renderHC({ lang: 'uz' }); });
await p.waitForSelector('.hc-root textarea.hc-code');
const CYR = /[\u0400-\u04FF]/;
const snap = () => p.evaluate(() => {
  const q = (s) => [...document.querySelectorAll(s)];
  const t = (s) => q(s).map((e) => e.textContent.trim());
  return {
    code: q('.hc-code').map((e) => e.value), placeholder: q('.hc-code').map((e) => e.placeholder),
    chips: t('.hc-chip'), chipTitles: q('.hc-chip').map((e) => e.title), hint: t('.hc-hint'), err: t('.hc-err'),
    status: t('.hc-status'), next: t('.hc-next'), nextTitle: q('.hc-next').map((e) => e.title), ghost: t('.hc-ghost'),
    tools: q('.hc-ic').map((e) => e.textContent.trim() + '|' + e.title), mini: t('.hc-mini'), pane: t('.hc-pane-name'), live: t('.hc-live,.hc-stale'),
    sb: t('.hc-sb-pos'), brief: t('.hc-brief'), title: t('.hc-title'), note: t('.hc-note'),
  };
});
// 1) xato + hint holatini yaratamiz
await p.click('.hc-code'); await p.keyboard.press('Control+A');
await p.evaluate(() => document.execCommand('insertText', false, '<h1>Salom</h2>\n<p></p>'));
await p.click('body', { position: { x: 5, y: 5 } });
await p.waitForTimeout(1200);
const before = await snap();
console.log('UZ holat:', JSON.stringify(before, null, 1));
// 2) faqat lang o'zgaradi (kod tegilmaydi)
await p.evaluate(() => window.renderHC({ lang: 'ru' }));
await p.waitForTimeout(1200);
const after = await snap();
console.log('\nRU holat (lang almashgach, kod tegilmagan):', JSON.stringify(after, null, 1));
console.log('\n=== ESKI TILDA QOLGANLAR (ru rejimda kirillsiz matn) ===');
for (const [k, v] of Object.entries(after)) {
  for (const s of v) if (s && !CYR.test(s) && /[a-z]{3,}/i.test(s) && !/^(<|index|Enter|CSS|JS|live|on ⇄|typeof|\d)/.test(s)) console.log(`  ${k}: «${s}»`);
}
await p.screenshot({ path: new URL('./i18n-switch-ru.png', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1') });
// 3) endi kodni bir belgiga o'zgartiramiz — yangilanadimi?
await p.click('.hc-code'); await p.keyboard.press('End'); await p.keyboard.type(' ');
await p.click('body', { position: { x: 5, y: 5 } });
await p.waitForTimeout(1200);
const after2 = await snap();
console.log('\nRU holat (kod tegilgandan keyin): hint=', JSON.stringify(after2.hint), 'err=', JSON.stringify(after2.err), 'chipTitles=', JSON.stringify(after2.chipTitles));
// 4) Qaytadan — starter qaysi tilda tushadi?
const ghosts = await p.$$('.hc-ghost'); const rb = ghosts[ghosts.length - 1];
await rb.click(); await p.waitForTimeout(100); await rb.click(); await p.waitForTimeout(300);
console.log('\nRU rejimda «Qaytadan» dan keyin starter:', JSON.stringify(await p.$eval('.hc-code', (e) => e.value)));
await b.close();

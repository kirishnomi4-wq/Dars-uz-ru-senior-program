// m10-11 s6/s7: 5-ekran da'volari (answers[5]) bilan ochib surat oladi
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const OUT = process.argv[2];
const DAV = [{ gk: 'g1', gap: "O'yinchilar jamoa yig'ishda qiynaladi", bolak: 'muammo' }, { gk: 'g2', gap: "Ilovani 30 kishi ishlatyapti", bolak: 'demo' }];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const [sc, nom, ans] of [[6, 's6-data', { 5: { davolar: DAV, saqlandi: true } }], [7, 's7-data', { 5: { davolar: DAV, saqlandi: true }, 6: { dalillar: { g1: 'yoq' }, saqlandi: true } }]]) {
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 0.6, reducedMotion: 'reduce' })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 160)));
  await p.addInitScript(([s, a]) => localStorage.setItem('ccProgress:pm-m10d11-v1', JSON.stringify({ screen: s, answers: a, earned: [], total: 12, savedAt: Date.now() })), [sc, ans]);
  await p.goto('http://localhost:5300/#/lesson/m10-11', { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 2000 }).catch(() => {});
  await p.waitForTimeout(2200);
  await p.screenshot({ path: `${OUT}/m10-11-${nom}.jpg`, type: 'jpeg', quality: 75 });
  console.log(nom, errs.join(' | ') || 'JS xato 0'); await p.context().close();
}
await b.close();

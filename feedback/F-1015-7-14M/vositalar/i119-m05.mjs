// F-1015-119 m12-05 PmPitchTraining: o'quvchi varag'i (pm-m12d5-varaq) bilan 6/7-ekran surati + JS xato.
// node i119-m05.mjs outdir [nom1,nom2]   (vite 5300 kerak). Holat: [nom, ekran, varaq|null, bosiladigan tugmalar regex]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [,, OUT] = process.argv;
const KEY = 'm12-05', LID = 'pm-m12d5-v1', TOT = 12;
const B = ['muammo', 'bozor', 'yechim', 'raqamlar', 'jamoa', 'keyingi'];
const BELGI = ['✓', '✗', '✓', '✗', '✓', '✗'];
const IZOH = ['', "Qancha odam — manba yo'q", '', 'Son qayerdan?', '', "So'rov aniq emas"];
const VARAQ = { tur: 'guruh', varaq: B.map((b, i) => ({ bolak: b, belgi: BELGI[i], izoh: IZOH[i] })), hakamSavoli: 'Pulni qanday topasiz?', vaqt: 290, savedAt: Date.now() };
const HOLATLAR = [
  ['s6-varaq', 6, null, ["5 daqiqani boshlash", "To'xtatish", "Biz tingladik"]],
  ['s7', 7, VARAQ, []],
  ['s7-bir', 7, { ...VARAQ, tuzatishlar: [{ bolak: 'bozor', nima: "Guruhdagi 60 kishini manbasi bilan aytaman", manba: 'x' }] }, []],
];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const [nom, sc, v, seq] of HOLATLAR) {
  if (process.argv[3] && !process.argv[3].split(',').includes(nom)) continue;
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 0.6, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 140)));
  await p.addInitScript(([lid, s, tt, vv]) => { try {
    localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: s, answers: {}, earned: [], total: tt, savedAt: Date.now() }));
    if (vv) localStorage.setItem('pm-m12d5-varaq', JSON.stringify(vv));
  } catch {} }, [LID, sc, TOT, v]);
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
  const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 2000 }).catch(() => {});
  await p.waitForTimeout(1500);
  for (const r of seq) {
    try { await p.getByRole('button', { name: new RegExp(r) }).first().click({ timeout: 3000 }); } catch { errs.push('BOSILMADI ' + r); }
    await p.waitForTimeout(900);
  }
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${OUT}/${KEY}-${nom}.jpg`, type: 'jpeg', quality: 75, fullPage: true });
  console.log(nom, errs.join(' | ') || 'ok'); await ctx.close();
}
await b.close();

// F-1015-116 m9-15 PmOneOnOne: o'quvchi ma'lumoti (roadmap · holat · risk) bilan ekranlarni ochib surat oladi + JS xato.
// node i116.mjs outdir [nom1,nom2]   (vite 5300 kerak). Har holat: [nom, ekran, qoralama, bosiladigan tugmalar regex ro'yxati]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [,, OUT] = process.argv;
const KEY = 'm9-15', LID = 'pm-m9d15-v1', TOT = 12;
const ROADMAP = { ishlar: [
  { nom: 'Kirish sahifasi', ufq: 'hozir' }, { nom: "O'yinlar ro'yxati", ufq: 'hozir' }, { nom: "Qo'shilish tugmasi", ufq: 'hozir' },
  { nom: 'Bildirishnoma', ufq: 'keyinroq' }, { nom: 'Reyting jadvali', ufq: 'uzoqroq' }], hozir: [0, 1, 2] };
const HAMMA_HOLAT = { i0: 'bajarildi', i1: 'kechikdi', i2: 'bajarildi', sinov: 'bajarildi', i3: 'boshlanmadi', i4: 'boshlanmadi' };
const R1 = { risk: 'Imtihon haftasida vaqt qolmaydi', qadam: 'Shanba kuni 1 soat ajrataman' };
const R3 = [R1, { risk: "Sinovchilar kam — 3 kishi", qadam: "Sinfdoshlardan 5 kishini chaqiraman" }, { risk: 'Backend uxlab qoladi', qadam: "Kutish yozuvini qo'shaman" }];
const HOLATLAR = [
  ['s2', 2, {}, []],
  ['s2-bos', 2, {}, ['^Bajarildi$']],
  ['s3', 3, {}, []],
  ['s3-bos', 3, {}, ["Ilovaga kutish yozuvi"]],
  ['s4-javob', 4, {}, ['Imtihon haftasida'], 4800], // nishon oynasi 4 s da o'zi yopiladi
  ['s5', 5, { holat: { i0: 'bajarildi' } }, []],
  ['s6', 6, { holat: HAMMA_HOLAT, risklar: [R1] }, []],
  ['s6-tayyor', 6, { holat: HAMMA_HOLAT, risklar: R3 }, []],
  ['s7', 7, { holat: HAMMA_HOLAT, risklar: R3, ufqlar: ['hozir', null, null] }, []],
];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const [nom, sc, qor, seq, kut = 0] of HOLATLAR) {
  if (process.argv[3] && !process.argv[3].split(',').includes(nom)) continue;
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 0.6, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 140)));
  await p.addInitScript(([lid, s, tt, rm, q]) => { try {
    localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: s, answers: {}, earned: [], total: tt, savedAt: Date.now() }));
    localStorage.setItem('pm-m9d6-roadmap', JSON.stringify(rm)); localStorage.setItem('pm-m9d15-qoralama', JSON.stringify(q));
  } catch {} }, [LID, sc, TOT, ROADMAP, qor]);
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
  const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 2000 }).catch(() => {});
  await p.waitForTimeout(1500);
  for (const r of seq) {
    try { await p.getByRole('button', { name: new RegExp(r) }).first().click({ timeout: 3000 }); } catch { errs.push('BOSILMADI ' + r); }
    await p.waitForTimeout(900);
  }
  await p.waitForTimeout(1200 + kut);
  await p.screenshot({ path: `${OUT}/${KEY}-${nom}.jpg`, type: 'jpeg', quality: 75, fullPage: true });
  console.log(nom, errs.join(' | ') || 'ok'); await ctx.close();
}
await b.close();

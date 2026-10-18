// F-1015-177 matn yig'ish (dars oqimini o'qish uchun): har darsning har ekrani (boshlang'ich holat)
//  karta — chegarali quti soni · ichma — chegarali quti ichida chegarali quti · guruh — bir xil kartalar bir yo'la (eng katta guruh)
//  tugma — faol tugmalar (pastki nav tashqari) · maydon — input/textarea · matn — ko'rinadigan belgi (sarlavha, Mentor tashqari)
//  pastga — kontent pastki nav ostiga tushadi (px)
// Ishlatish: node bitta213.mjs out.jsonl kalitlar.txt [W=4] [filtr]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import fs from 'fs';
const [,, OUT, LIST, W = '4', FILTR] = process.argv;
const faqat = FILTR ? new Set(fs.readFileSync(FILTR, 'utf8').trim().split('\n')) : null; // «kalit s» juftlari — faqat shu ekranlar
let keys = fs.readFileSync(LIST, 'utf8').trim().split('\n').map(l => l.split(' ')[0]);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const out = fs.createWriteStream(OUT);
async function info(KEY) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 } }); const p = await ctx.newPage();
  await p.addInitScript(() => localStorage.setItem('cc_lang', 'uz'));
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 }); await p.waitForTimeout(1000);
  const r = await p.evaluate(() => { const k = Object.keys(localStorage).find(x => x.startsWith('ccProgress:')); let t = 0; try { t = JSON.parse(localStorage.getItem(k)).total; } catch {} return { lid: k && k.slice(11), tot: t }; });
  await ctx.close(); return r;
}
async function ekran(KEY, lid, s, tot) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript(([lid, sc, tt]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: sc, answers: {}, earned: [], total: tt, savedAt: Date.now() })); }, [lid, s, tot]);
  try {
    await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
    const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
    await p.waitForTimeout(1300);
    await p.screenshot({ path: process.env.SURAT_DIR + '/' + KEY + '-s' + s + '.jpg', type: 'jpeg', quality: 65 });
    return { ok: 1 };
  } catch (e) { return { xato: String(e.message).slice(0, 80) }; } finally { await ctx.close(); }
}
const q = keys.slice();
await Promise.all(Array.from({ length: +W }, async () => {
  while (q.length) {
    const KEY = q.shift(); const { lid, tot } = await info(KEY);
    for (let s = 0; s < tot; s++) { if (faqat && !faqat.has(KEY + ' ' + s)) continue; const r = await ekran(KEY, lid, s, tot); out.write(JSON.stringify({ k: KEY, s, tot, ...r }) + '\n'); }
    console.log(KEY, tot);
  }
}));
out.end(); await b.close();

// F-1015-147 sinovi: m8-09 ikkala testni birinchi urinishda to'g'ri yechish → «Natijalar» halqasi 2/2 bo'lishi kerak; bitta xato → 1/2.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const LID = 'm8-09-v1', KEY = 'm8-09';
const yurish = async (birinchiXato) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript(() => { if (!sessionStorage.getItem('seed')) { localStorage.setItem('ccProgress:m8-09-v1', JSON.stringify({ screen: 4, answers: {}, earned: [], total: 12, savedAt: Date.now() })); sessionStorage.setItem('seed', '1'); } });
  const och = async () => { await p.goto(`http://localhost:5300/#/lesson/${KEY}`); await p.waitForSelector('.lesson-root'); const k = p.getByText(/Kodsiz/); if (await k.count()) await k.first().click().catch(() => {}); await p.waitForTimeout(1200); };
  const ekran = async (n) => { await p.evaluate(([lid, n]) => { const d = JSON.parse(localStorage.getItem('ccProgress:' + lid)); d.screen = n; localStorage.setItem('ccProgress:' + lid, JSON.stringify(d)); }, [LID, n]); await p.reload(); await p.waitForSelector('.lesson-root'); const k = p.getByText(/Kodsiz/); if (await k.count()) await k.first().click().catch(() => {}); await p.waitForTimeout(1200); };
  await och();
  if (birinchiXato) { await p.getByText('Yangilanadi, chunki yangi push qilindi').click(); await p.waitForTimeout(400); }
  await p.getByText("Eskicha qoladi, chunki main o'zgarmadi").click(); await p.waitForTimeout(600);
  await ekran(7);
  await p.getByText("Kodni o'qib tekshiraman, keyin sababni yozaman").click(); await p.waitForTimeout(600);
  await ekran(9);
  const t = await p.locator('.ring-num').innerText().catch(() => '?'); const iz = await p.locator('.ring-iz').innerText().catch(() => '?');
  console.log(birinchiXato ? 'bitta xato:' : 'ikkalasi to\'g\'ri:', t.replace(/\s+/g, ''), '|', iz);
  await ctx.close();
};
await yurish(false); await yurish(true); await b.close();

import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import fs from 'fs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const tot = {}; for (const l of fs.readFileSync('q178.jsonl', 'utf8').trim().split('\n')) { const x = JSON.parse(l); tot[x.k] = x.tot; }
async function och(key, sc, lid, total) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  if (lid) await p.addInitScript(([lid, sc, tt]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: sc, answers: {}, earned: [], total: tt, savedAt: Date.now() })); }, [lid, sc, total]);
  await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(1300); return { p, ctx };
}
async function lidOf(key) { const c = await b.newContext(); const p = await c.newPage(); await p.goto(`http://localhost:5300/#/lesson/${key}`); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(800); const r = await p.evaluate(() => { const k = Object.keys(localStorage).find(x => x.startsWith('ccProgress:')); return [k.slice(11), JSON.parse(localStorage.getItem(k)).total]; }); await c.close(); return r; }
const punktirOl = () => {
  for (const e of document.querySelectorAll('.lesson-root *')) {
    const cs = getComputedStyle(e); const sides = ['Top', 'Right', 'Bottom', 'Left'].filter(s => cs['border' + s + 'Style'] === 'dashed');
    if (!sides.length) continue;
    if (sides.length >= 3) { e.style.borderStyle = 'solid'; e.style.borderColor = 'transparent'; if (cs.backgroundColor === 'rgba(0, 0, 0, 0)' || cs.backgroundColor === 'rgb(255, 255, 255)') e.style.backgroundColor = 'rgba(91,61,230,0.06)'; }
    else sides.forEach(s => { e.style['border' + s + 'Style'] = 'none'; });
  }
};
for (const [key, sc] of [['m10-11', 1], ['m12-12', 0], ['m11-09', 1], ['m12-07', 1]]) {
  const [lid, t] = await lidOf(key);
  const o = await och(key, sc, lid, t);
  await o.p.screenshot({ path: `qv/${key}-oldin.jpg`, type: 'jpeg', quality: 72 });
  await o.p.evaluate(punktirOl); await o.p.waitForTimeout(200);
  await o.p.screenshot({ path: `qv/${key}-keyin.jpg`, type: 'jpeg', quality: 72 });
  await o.ctx.close();
}
// kod oynasi
{
  const o = await och('m9-01', 11, 'pm-m9d1-v1', 16);
  await o.p.locator('.ti-darvoza .q-chip').nth(1).click(); await o.p.waitForTimeout(400);
  await o.p.getByText('Kompilyatorni ochish').click(); await o.p.waitForTimeout(1500);
  await o.p.screenshot({ path: 'qv/kod-oldin.jpg', type: 'jpeg', quality: 72 });
  await o.p.evaluate(() => {
    const yaqin = (c, r, g, bb, d = 70) => { const m = c.match(/rgba?\((\d+), (\d+), (\d+)/); return m && Math.abs(+m[1] - r) + Math.abs(+m[2] - g) + Math.abs(+m[3] - bb) < d; };
    for (const e of document.querySelectorAll('*')) {
      const cs = getComputedStyle(e);
      const isOr = (c) => { const m = c.match(/rgba?\((\d+), (\d+), (\d+)/); return m && +m[1] > 220 && +m[2] > 60 && +m[2] < 150 && +m[3] < 90; };
      if (isOr(cs.backgroundColor)) e.style.backgroundColor = '#5B3DE6';
      if (isOr(cs.color)) e.style.color = '#5B3DE6';
      if (isOr(cs.borderTopColor)) e.style.borderColor = '#5B3DE6';
      if (cs.backgroundImage.includes('gradient') && /255, (1[0-4]\d|[6-9]\d)/.test(cs.backgroundImage)) e.style.backgroundImage = 'none', e.style.backgroundColor = '#5B3DE6';
      const m = cs.backgroundColor.match(/rgba?\((\d+), (\d+), (\d+)/); if (m && +m[1] > 245 && +m[2] > 225 && +m[3] < 215) e.style.backgroundColor = '#EBE5FD';
      if (m && +m[1] > 240 && +m[2] > 235 && +m[3] > 220 && +m[1] - +m[3] > 12 && +m[3] < 240) e.style.backgroundColor = '#F2F0FA';
    }
  });
  await o.p.waitForTimeout(200);
  await o.p.screenshot({ path: 'qv/kod-keyin.jpg', type: 'jpeg', quality: 72 });
  await o.ctx.close();
}
// menyu
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); const p = await ctx.newPage();
  await p.goto('http://localhost:5300/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1500);
  await p.screenshot({ path: 'qv/menyu0.jpg', type: 'jpeg', quality: 70 });
  const t = p.getByText(/Oltita g'oyani qayerdan/).first();
  if (await t.count()) { await t.scrollIntoViewIfNeeded(); await p.waitForTimeout(400); await p.screenshot({ path: 'qv/menyu.jpg', type: 'jpeg', quality: 72 }); }
  console.log('menyu topildi', await t.count());
  await ctx.close();
}
await b.close();

import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
async function open(key, lid, sc, tt, lang = 'uz') {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript(([lid, sc, tt, lg]) => { localStorage.setItem('cc_lang', lg); localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: sc, answers: {}, earned: [], total: tt, savedAt: Date.now() })); }, [lid, sc, tt, lang]);
  await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
  const kir = p.getByText(/Kodsiz|Без кода/); if (await kir.count()) await kir.first().click({ timeout: 2000 }).catch(() => {});
  await p.waitForTimeout(1500); return [ctx, p];
}
const shot = (p, n) => p.screenshot({ path: `proto/${n}.jpg`, type: 'jpeg', quality: 72 });
if (0) { // 158: halqa tashqi chizig'isiz
{ const [c, p] = await open('m5-08', 'pm-m5d8-v1', 13, 16); await shot(p, '158-oldin');
  await p.addStyleTag({ content: '.pod-card .ring-wrap{box-shadow:none!important;background:transparent!important}' }); await p.waitForTimeout(300); await shot(p, '158-keyin'); await c.close(); }
}
// 159: chip kartaga kiradi
{ const [c, p] = await open('m5-14', 'pm-m5d11-metrika-v1', 5, 18, 'ru');
  await p.locator('.tg-l').nth(2).click({ force: true }).catch(e => console.log('159 click', e.message.slice(0, 60))); await p.waitForTimeout(900); await shot(p, '159-oldin');
  await p.evaluate(() => { const ch = document.querySelector('.mon-chip'); const tg = document.querySelector('.tg'); if (ch && tg) { tg.style.position = 'relative'; ch.style.position = 'absolute'; ch.style.left = '14px'; ch.style.top = '14px'; tg.prepend(ch); } });
  await p.waitForTimeout(300); await shot(p, '159-keyin'); await c.close(); }
if (0) // 160: tanlov kartaning o'zida
{ const [c, p] = await open('m5-14', 'pm-m5d11-metrika-v1', 7, 18); await shot(p, '160-oldin');
  await p.evaluate(() => { document.querySelector('.gt-btns')?.remove(); document.querySelectorAll('.fz-btn').forEach((b, i) => { b.disabled = false; b.textContent = 'Shu holat yaxshiroq'; b.style.opacity = 1; b.style.background = '#fff'; b.style.color = '#5b3fd6'; b.style.boxShadow = 'inset 0 0 0 2px #5b3fd6'; }); document.querySelectorAll('.fz-pair').forEach(x => { x.style.cursor = 'pointer'; }); });
  await p.waitForTimeout(300); await shot(p, '160-keyin'); await c.close(); }
// 156: m5-01 sinov
{ const [c, p] = await open('m5-01', 'bot-intro-05-01-v18', 7, 20);
  for (let i = 0; i < 5; i++) { await p.locator('.ns-opt.sig').first().click(); await p.waitForTimeout(200); await p.locator('.ns-opt.act').first().click(); await p.waitForTimeout(250); }
  await shot(p, '156-oldin-1');
  await p.evaluate(() => document.querySelectorAll('.ns-tick').forEach(t => t.remove())); await p.waitForTimeout(200); await shot(p, '156-keyin-1');
  await p.getByText(/Botni ishga tushirish/).click(); await p.waitForTimeout(6500); await shot(p, '156-oldin-2');
  await p.evaluate(() => {
    document.querySelectorAll('.ns-row.done').forEach(r => { const t = document.createElement('span'); t.style.cssText = 'font-weight:800;margin-left:6px'; if (r.classList.contains('ok')) { t.textContent = '✓'; t.style.color = '#1f7a4d'; } else if (r.classList.contains('wrong')) { t.textContent = '✗ mos emas'; t.style.color = '#c2410c'; t.style.fontSize = '12px'; } else return; r.querySelector('.ns-done-t').appendChild(t); });
    const res = document.querySelector('.ns-result'); const side = document.querySelector('.ns-side'); const btn = side.querySelector('.btn');
    const w = res.querySelector('.frame-warn p'); const nw = document.querySelectorAll(".ns-row.done.wrong").length; if (w) w.textContent = nw + " ta qator mos emas — ✗ belgili qatorni ↻ bilan almashtiring, keyin «Qayta sinash».";
    btn.after(res); res.style.marginBottom = '6px';
  });
  await p.waitForTimeout(300); await shot(p, '156-keyin-2'); await c.close(); }
await b.close();

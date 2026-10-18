import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [,, OUT, KEYS, W = '1280', H = '2400', DSF = '0.5'] = process.argv;
const keys = KEYS.split(',');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const one = async (key) => {
  const ctx = await b.newContext({ viewport: { width: +W, height: +H }, deviceScaleFactor: +DSF, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  try {
    await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForSelector('.lesson-root', { timeout: 20000 }); await p.waitForTimeout(600);
    const kir = p.getByText(/Kodsiz/); if (await kir.count()) { await kir.first().click({ timeout: 2000 }).catch(()=>{}); await p.waitForTimeout(700); }
    let info = await p.evaluate(() => { let total = 0; for (const el of document.querySelectorAll('.lesson-root *')) { if (el.children.length) continue; const m = /^\s*(\d{2})\s*\/\s*(\d{2})\s*$/.exec(el.textContent || ''); if (m) { total = +m[2]; break; } }
      let lid = null; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) { lid = k.slice(11); break; } } return { total, lid }; });
    if (!info.lid) { await p.getByRole('button', { name: /Davom etish|Boshlaymiz|Boshlash/ }).first().click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(500);
      info.lid = await p.evaluate(() => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) return k.slice(11); } return null; }); }
    if (!info.lid || !info.total) { await p.screenshot({ path: OUT + '/_xato-' + key + '.jpg', type: 'jpeg', quality: 60 }); console.log(key, 'XATO lid/total', JSON.stringify(info)); return; }
    await p.evaluate(([id, sc, tt]) => localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, answers: {}, earned: [], startedAt: Date.now(), total: tt, savedAt: Date.now() })), [info.lid, (process.env.SCR ? +process.env.SCR : info.total - 1), info.total]);
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }); if (process.env.U2) await p.addStyleTag({ content: '.zoomable:not(.z-empty):not(.zoom-on){padding-top:36px!important} .zoomable:not(.zoom-on)>.zoom-btn{top:0!important;right:0!important;left:auto!important}' }); await p.waitForTimeout(1800);
    const shown = await p.evaluate(() => { for (const el of document.querySelectorAll('.lesson-root *')) { if (el.children.length) continue; const m = /^\s*(\d{2})\s*\/\s*(\d{2})\s*$/.exec(el.textContent || ''); if (m) return m[0].trim(); } return null; });
    if (process.env.SCR) { const bb = await p.evaluate(() => { const zs=[...document.querySelectorAll('.zoom-btn')].filter(b=>b.getBoundingClientRect().width>0); const b=zs[0]; if(!b) return null; const r=b.getBoundingClientRect(); const z=b.parentElement.getBoundingClientRect(); return { x:z.x, y:z.y, width:z.width, height:z.height, bx:r.x, by:r.y }; }); if (bb) await p.screenshot({ path: `${OUT}/${key}-s${process.env.SCR}${process.env.U2?'-u2':''}.jpg`, type: 'jpeg', quality: 80, clip: { x: Math.max(0, bb.bx - 440), y: Math.max(0, bb.by - 40), width: 500, height: 200 } }); }
    else await p.screenshot({ path: `${OUT}/${key}.jpg`, type: 'jpeg', quality: 70 });
    console.log(key, 'ok', shown);
  } catch (e) { console.log(key, 'XATO', String(e.message).slice(0, 80)); } finally { await ctx.close(); }
};
for (let i = 0; i < keys.length; i += 4) await Promise.all(keys.slice(i, i + 4).map(one));
await b.close();

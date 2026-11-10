// Tez xato-sweep (03.11): har ekranni ochib, ovozsiz oxirigacha o'tkazadi; pageerror/console.error, segment soni, Davom ochilganini yozadi.
// ISHLATISH (dev :5333): DARS=pg-02 node dev/ekran-sweep.mjs [WxH]  → TSV: ekran · segment · davom · xatolar
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const DARS = process.env.DARS || 'pg-02';
const [W, H] = (process.argv[2] || '1920x1080').split('x').map(Number);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: W, height: H } });
const errs = [];
p.on('pageerror', (e) => errs.push('PAGE: ' + e.message.slice(0, 160)));
p.on('console', (m) => { if (m.type() === 'error' && !/favicon|404/.test(m.text())) errs.push('CON: ' + m.text().slice(0, 160)); });
const url = (i) => `http://localhost:5333/mentor-kurs.html?dars=${DARS}&s=${i}`;
await p.goto(url(0), { waitUntil: 'load' }); await p.waitForSelector('.mk-stage', { timeout: 30000 });
const total = await p.evaluate(() => { const m = document.body.innerText.match(/\b(\d+)\s*\/\s*(\d+)\b/); return m ? Number(m[2]) : 0; });
let bad = 0;
for (let i = 0; i < total; i++) {
  errs.length = 0;
  await p.goto(url(i), { waitUntil: 'load' });
  const ok = await p.waitForSelector('.mk-stage', { timeout: 15000 }).then(() => true).catch(() => false);
  await p.waitForTimeout(250);
  const mute = await p.$('.mk-audio button'); if (mute) await mute.click();
  let segs = 0, ready = false;
  for (let t = 0; t < 50; t++) {
    await p.waitForTimeout(250);
    const st = await p.evaluate(() => { const bt = [...document.querySelectorAll('.mk-nav button')].pop(); const d = [...document.querySelectorAll('.mk-dots i')]; return { ready: bt && !bt.disabled, on: d.findIndex((x) => x.classList.contains('on')), n: d.length }; });
    segs = Math.max(segs, st.n); ready = !!st.ready;
    if (st.ready || (st.n > 0 && st.on === st.n - 1 && t > 3)) break;
    // avval holat o'qiladi, keyin bosiladi (aks holda «Keyingi qadam» bor ekan, holatga yetilmaydi)
    const ask = await p.$('.mk-ask .row button'); if (ask) { await ask.click(); continue; }
    const man = await p.$('button:text-matches("^(Keyingi qadam|Следующий шаг)")'); if (man) { await man.click(); continue; }
  }
  // tekshiruv: to'g'ri javobgacha; satr-tekshiruv: hamma satr
  const o = await p.$$('.mk-opt'); for (const x of o) { try { if (await x.isDisabled()) continue; await x.click({ timeout: 1000 }); await p.waitForTimeout(300); if (await p.$('.mk-opt.ok')) break; } catch (e) {} }
  const ln = await p.$$('.mk-ln.clk'); for (const x of ln) { try { await x.click({ timeout: 800 }); await p.waitForTimeout(150); if (await p.$('.mk-ln.hit, .mk-ln.ok')) break; } catch (e) {} }
  await p.waitForTimeout(300);
  const uniq = [...new Set(errs)];
  if (!ok || uniq.length) bad++;
  console.log([i + 1, segs, ready ? 'davom' : '-', ok ? '' : 'STAGE YO\'Q', uniq.join(' | ')].join('\t'));
}
console.log(`JAMI ${total} ekran · muammo ${bad}`);
await b.close();

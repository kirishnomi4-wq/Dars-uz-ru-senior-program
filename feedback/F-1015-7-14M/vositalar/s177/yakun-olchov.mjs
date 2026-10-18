// 213.14 o'lchov: har tushuncha-ekranning YAKUN holati (storedAnswer seed) — surat + DOM o'lchov. MODUL=9 node yakun-olchov.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
const S = '/tmp/claude-1000/-home-kali-Desktop-internetLesson/748450ec-6330-484f-82b4-09062baf27c7/scratchpad/';
const R = JSON.parse(readFileSync(S + 'yakun-royxat.json', 'utf8')).filter(o => o.modul === process.env.MODUL);
const D = '/home/kali/Desktop/internetLesson/feedback/F-1015-7-14M/suratlar/F-1015-328-olchov/';
const outP = S + `yakun-olchov-m${process.env.MODUL}.json`; const out = existsSync(outP) ? JSON.parse(readFileSync(outP, 'utf8')) : [];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const o of R) {
  mkdirSync(D + o.key, { recursive: true });
  for (const sc of o.ekran) {
    if (out.find(x => x.key === o.key && x.s === sc)) continue;
    const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage(); const err = [];
    p.on('pageerror', e => err.push(e.message.slice(0, 120)));
    const ans = { [sc]: { correct: true, picked: true, solved: true, taxmin: 'x', stage: 'tushuncha', screenIdx: sc } };
    await p.addInitScript(([sc, lid, n, ans]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem(`ccProgress:${lid}`, JSON.stringify({ screen: sc, answers: ans, earned: [], total: n, savedAt: Date.now() })); }, [sc, o.lid, o.n, ans]);
    await p.goto(`http://localhost:5300/#/lesson/${o.key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => err.push('root yoq'));
    const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
    await p.waitForTimeout(2200); const c = p.locator('.acu-overlay'); if (await c.count()) { await c.first().click().catch(() => {}); await p.waitForTimeout(300); }
    const m = await p.evaluate(() => {
      const root = document.querySelector('.lesson-root .q-tushuncha'); if (!root) return { yoq: true };
      const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 40 && r.height > 24 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const boxed = [...root.querySelectorAll('*')].filter(el => { if (!vis(el)) return false; const cs = getComputedStyle(el); return (cs.boxShadow !== 'none' || (cs.borderStyle !== 'none' && parseFloat(cs.borderWidth) > 0 && cs.borderColor !== 'rgba(0, 0, 0, 0)')) && el.getBoundingClientRect().width > 160; });
      // ichma-ich: faqat eng tashqi qutilar
      const tashqi = boxed.filter(el => !boxed.some(p => p !== el && p.contains(el)));
      const ichki = boxed.length - tashqi.length;
      const tel = root.querySelectorAll('[class*="-tel"],[class*="telefon"],[class*="-lap"],[class*="laptop"],[class*="brauzer"],[class*="-tg"]').length;
      const nav = document.querySelector('.lesson-root .nav-next, .lesson-root button.next, .lesson-root [class*="nav"] button:last-child');
      const navT = nav ? nav.textContent.trim() : '';
      const matn = root.innerText.replace(/\s+/g, ' ').length;
      const fokus = !!root.querySelector('.q-fokus');
      const bal = root.querySelectorAll('.q-xulosa').length, izoh = root.querySelectorAll('.q-izoh').length, tug = [...root.querySelectorAll('button')].filter(vis).length;
      const h = root.scrollHeight;
      return { tashqi: tashqi.length, ichki, tel, navT, matn, fokus, xulosa: bal, izoh, tug, h };
    });
    const done = /Davom|Продолж/.test(m.navT || '');
    await p.setViewportSize({ width: 1280, height: 1400 }); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}${o.key}/s${sc}.jpg`, type: 'jpeg', quality: 60 });
    out.push({ key: o.key, s: sc, fayl: o.fayl, done, ...m, err }); writeFileSync(outP, JSON.stringify(out));
    console.log(o.key, 's' + sc, done ? 'DONE' : 'done-yoq', 'quti', m.tashqi, '+', m.ichki, 'tel', m.tel, 'matn', m.matn, 'h', m.h, 'xul', m.xulosa, 'izoh', m.izoh, 'tug', m.tug, err.length ? 'ERR ' + err[0] : '');
    await ctx.close();
  }
}
await b.close(); console.log('TAYYOR');

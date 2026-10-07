// 12-Modul dars tekshiruvi (07.10, F-1006-369/386): har ekranda (1) maket kesigi — chegarali/yumaloq element overflow:hidden ota-blokdan chiqib turmasin,
// (2) pageerror, (3) gorizontal skrol, (4) ⛶ bor bo'lsa — bosiladi va oyna ekran markazida ekani o'lchanadi.
// Ishga tushirish (repo ildizidan, server 127.0.0.1:5174 ishlab turishi kerak):
//   node feedback/F-1006-12modul/vositalar/kesik.mjs m10-03 src/10-Modull/PmRealtimeSpecLesson.jsx [desk|keng|mob ...]
import { chromium } from 'playwright-core';
import fs from 'fs';
const [key, file, ...vpArg] = process.argv.slice(2);
if (!key || !file) { console.log('foydalanish: kesik.mjs <kalit m10-NN> <fayl.jsx> [desk keng mob]'); process.exit(1); }
const src = fs.readFileSync(file, 'utf8');
const id = (src.match(/lessonId: '([^']+)'/) || [])[1];
const m0 = src.indexOf('const SCREEN_META = [');
const N = (src.slice(m0, src.indexOf('];', m0)).match(/\{ id:/g) || []).length;
const VP = { desk: { width: 1100, height: 773 }, keng: { width: 1440, height: 900 }, mob: { width: 390, height: 844 } };
const tanlov = vpArg.length ? vpArg : ['desk', 'keng', 'mob'];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
let jami = 0;
for (const vn of tanlov) {
  const out = [];
  for (let s = 0; s < N; s++) {
    const p = await b.newPage({ viewport: VP[vn] });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(([id, s, N]) => { try { if (!sessionStorage.getItem('_k')) { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, answers: {}, total: N, savedAt: Date.now() })); sessionStorage.setItem('_k', '1'); } } catch {} }, [id, s, N]);
    await p.goto(`http://127.0.0.1:5174/#/lesson/${key}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(2400);
    const r = await p.evaluate(() => {
      const res = [];
      for (const el of document.querySelectorAll('div,span,section')) {
        const cs = getComputedStyle(el);
        const rc = el.getBoundingClientRect();
        if (!(parseFloat(cs.borderTopWidth) >= 1.5 && parseFloat(cs.borderTopLeftRadius) >= 16 && rc.height >= 100 && rc.width >= 60 && rc.width < 420)) continue;
        if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
        let a = el.parentElement;
        while (a && a !== document.body) {
          const oy = getComputedStyle(a).overflowY;
          if (/(hidden|clip)/.test(oy)) { const ar = a.getBoundingClientRect(); const k = Math.round(Math.max(rc.bottom - ar.bottom, ar.top - rc.top)); if (k > 4) res.push(`${(el.className + '').split(' ')[0]} ${k}px kesik (${(a.className + '').split(' ')[0]})`); break; }
          if (/(auto|scroll)/.test(oy)) break;
          a = a.parentElement;
        }
      }
      if (document.documentElement.scrollWidth > innerWidth + 1) res.push('gorizontal skrol ' + document.documentElement.scrollWidth);
      return res;
    });
    // ⛶: birinchi ko'rinadigan tugma bosiladi, oyna markazi o'lchanadi
    const zb = p.locator('.zoom-btn:visible').first();
    if (await zb.count()) {
      await zb.click({ force: true }).catch(() => {}); await p.waitForTimeout(500);
      const z = await p.evaluate(() => { const e = document.querySelector('.zoom-on'); if (!e) return 'ochilmadi'; const q = e.getBoundingClientRect(); const dx = Math.round(q.left + q.width / 2 - innerWidth / 2); return Math.abs(dx) > 2 || q.left < -1 || q.right > innerWidth + 1 ? `⛶ markazdan ${dx}px siljigan` : null; });
      if (z) r.push(z);
    }
    if (r.length || errs.length) out.push(`s${s}: ${[...new Set(r)].join('; ')}${errs.length ? ' · XATO ' + errs.join(' | ') : ''}`);
    jami += r.length + errs.length;
    await p.close();
  }
  console.log(`${vn} ${key} (${N} ekran):`, out.length ? '\n  ' + out.join('\n  ') : 'toza');
}
console.log('JAMI topilma:', jami);
await b.close();

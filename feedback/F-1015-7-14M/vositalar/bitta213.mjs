// F-1015-172 (DE 213 «Bittadan») o'lchovi: har darsning har ekrani (boshlang'ich holat)
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
    return await p.evaluate(() => {
      const root = document.querySelector('.stage-content') || document.querySelector('.lesson-root');
      const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 4 && r.height > 4 && cs.visibility !== 'hidden' && +cs.opacity > 0.05; };
      const chet = (e) => !!e.closest('.mentor, .head, .h-title, nav, .stage-nav, footer, [class*="nav-bar"], [class*="stage-foot"], .zoom-btn, .q-arena, .arena');
      const bord = (e) => { const cs = getComputedStyle(e); const w = ['Top', 'Right', 'Bottom', 'Left'].filter(s => parseFloat(cs['border' + s + 'Width']) >= 1 && cs['border' + s + 'Style'] !== 'none' && !/rgba\(.*, 0\)$/.test(cs['border' + s + 'Color'])); return w.length >= 3; };
      const els = [...root.querySelectorAll('*')].filter(e => vis(e) && !chet(e));
      const kartalar = els.filter(e => { if (!bord(e)) return false; const r = e.getBoundingClientRect(); if (r.width < 120 || r.height < 44) return false; return !/^(BUTTON|INPUT|TEXTAREA|SELECT|CODE|PRE)$/.test(e.tagName) && !e.closest('button'); });
      const ichma = kartalar.filter(k => kartalar.some(o => o !== k && k.contains(o))).length;
      let guruh = 0, guruhNom = '';
      for (const c of new Set(kartalar.map(k => k.parentElement))) {
        const m = {}; for (const k of c.children) if (kartalar.includes(k)) { const n = String(k.className).split(' ')[0]; m[n] = (m[n] || 0) + 1; }
        for (const [n, v] of Object.entries(m)) if (v > guruh) { guruh = v; guruhNom = n; }
      }
      const tugma = els.filter(e => (e.tagName === 'BUTTON' || e.getAttribute('role') === 'button') && !e.disabled && e.getBoundingClientRect().top < innerHeight - 90).length;
      const maydon = els.filter(e => /^(INPUT|TEXTAREA)$/.test(e.tagName) && e.type !== 'hidden' && e.type !== 'checkbox' && e.type !== 'radio').length;
      let matn = 0; const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let t;
      while ((t = tw.nextNode())) { const p = t.parentElement; if (!p || chet(p) || !vis(p)) continue; matn += t.nodeValue.replace(/\s+/g, ' ').trim().length; }
      const navTop = (() => { const n = document.querySelector('.stage-nav, nav, footer'); return n ? n.getBoundingClientRect().top : innerHeight; })();
      const past = Math.max(0, ...els.filter(e => !e.closest('.stage-nav, nav, footer')).map(e => e.getBoundingClientRect().bottom)) - navTop;
      const eb = (document.querySelector('.eyebrow, [class*="eyebrow"]') || {}).innerText || '';
      return { eb: eb.trim().slice(0, 50), karta: kartalar.length, ichma, guruh, guruhNom, tugma, maydon, matn, pastga: Math.round(Math.max(0, past)) };
    });
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

// F-1015-100…107, 0-bosqich: har ekran o'lchovi (faqat o'qiydi, fayllarga tegmaydi).
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { appendFileSync } from 'node:fs';
const [,, OUT, KEYS, PAR = '4'] = process.argv;
const keys = KEYS.split(',');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });

const PROBE = () => {
  const root = document.querySelector('.stage-content') || document.querySelector('.lesson-root');
  const vis = (e) => { const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; };
  const emo = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}]/gu;
  const txt = root.innerText || '';
  const words = (txt.match(/[\p{L}\p{N}'ʻ’-]+/gu) || []).length;
  let blocks = 0, small = 0; const colors = new Set(), sizes = new Set();
  for (const e of root.querySelectorAll('*')) {
    if (!vis(e)) continue;
    const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
    const cs = getComputedStyle(e);
    if (own) {
      const w = (own.match(/[\p{L}\p{N}]+/gu) || []).length;
      if (w >= 3) blocks++;
      if (parseFloat(cs.fontSize) <= 12.5) small++;
      sizes.add(Math.round(parseFloat(cs.fontSize)));
      colors.add(cs.color);
    }
    if (cs.backgroundColor && !/rgba\([^)]*,\s*0\)|transparent/.test(cs.backgroundColor)) colors.add('bg:' + cs.backgroundColor);
  }
  const btns = [...root.querySelectorAll('button, [role=button]')].filter(vis).filter(x => !x.closest('nav, .nav, .stage-nav, .navbar'));
  const inputs = [...root.querySelectorAll('input:not([type=hidden]), textarea, select, [contenteditable=true], [draggable=true]')].filter(vis).length;
  const h = root.querySelector('.h-title, h1, h2');
  return { words, blocks, emoji: (txt.match(emo) || []).length, small, colors: colors.size, sizes: sizes.size, buttons: btns.length, inputs, title: h ? h.innerText.trim().slice(0, 80) : '' };
};

const one = async (key) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  try {
    await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForSelector('.lesson-root', { timeout: 20000 }); await p.waitForTimeout(500);
    const kir = p.getByText(/Kodsiz/); if (await kir.count()) { await kir.first().click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(500); }
    let info = await p.evaluate(() => { let total = 0; for (const el of document.querySelectorAll('.lesson-root *')) { if (el.children.length) continue; const m = /^\s*(\d{2})\s*\/\s*(\d{2})\s*$/.exec(el.textContent || ''); if (m) { total = +m[2]; break; } }
      let lid = null; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) { lid = k.slice(11); break; } } return { total, lid }; });
    if (!info.lid) { await p.getByRole('button', { name: /Davom etish|Boshlaymiz|Boshlash/ }).first().click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(400);
      info.lid = await p.evaluate(() => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) return k.slice(11); } return null; }); }
    if (!info.lid || !info.total) { appendFileSync(OUT, JSON.stringify({ key, err: 'lid/total' }) + '\n'); return; }
    for (let s = 0; s < info.total; s++) {
      await p.evaluate(([id, sc, tt]) => localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, answers: {}, earned: [], startedAt: Date.now(), total: tt, savedAt: Date.now() })), [info.lid, s, info.total]);
      await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(900);
      const r0 = await p.evaluate(PROBE);
      // «bos → matn» sinovi: 3 tagacha nav'dan tashqari tugma bosiladi
      let clicked = 0, inputsAfter = r0.inputs, wordsAfter = r0.words;
      for (let k = 0; k < 3; k++) {
        const btn = p.locator('.stage-content button:visible').filter({ hasNotText: /Orqaga|Davom|Keyingi|Yakunlash|Boshlaymiz|Qaytadan/ }).nth(k);
        if (!(await btn.count())) break;
        await btn.click({ timeout: 800 }).catch(() => {}); clicked++; await p.waitForTimeout(350);
      }
      if (clicked) { const r1 = await p.evaluate(PROBE); inputsAfter = r1.inputs; wordsAfter = r1.words; }
      appendFileSync(OUT, JSON.stringify({ key, s, total: info.total, ...r0, clicked, inputsAfter, wordsAfter }) + '\n');
    }
  } catch (e) { appendFileSync(OUT, JSON.stringify({ key, err: String(e.message).slice(0, 80) }) + '\n'); }
  finally { await ctx.close(); }
};
const q = [...keys];
await Promise.all(Array.from({ length: +PAR }, async () => { while (q.length) await one(q.shift()); }));
await b.close();
console.log('tayyor');

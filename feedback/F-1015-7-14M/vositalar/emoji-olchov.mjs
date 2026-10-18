// F-1015-100…107, 0-bosqich: har ekran o'lchovi (faqat o'qiydi, fayllarga tegmaydi).
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { appendFileSync } from 'node:fs';
const [,, OUT, KEYS, PAR = '4'] = process.argv;
const keys = KEYS.split(',');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });

const PROBE = () => {
  const root = document.querySelector('.stage-content') || document.querySelector('.lesson-root');
  const emo = /\p{Extended_Pictographic}(?:\ufe0f|\u200d\p{Extended_Pictographic})*/gu; const WL = new Set(['▶','▸','◂','◀','✓','✔','✕','✗','×','↻','↺','←','→','↑','↓','↔','⏹','✎','•','·','—','–','↩','⬆','⬇','➜','⛶']);
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(e).visibility !== 'hidden'; };
  const items = [];
  for (const el of root.querySelectorAll('*')) { if (el.children.length || !vis(el)) continue; const tx = (el.textContent || '').trim(); const m = (tx.match(emo) || []).map(x => x.replace(/\ufe0f/g, '')).filter(x => !WL.has(x)); if (!m.length) continue;
    const xizmat = el.closest('button') && tx.replace(emo, '').replace(/[\u200d\ufe0f]/g, '').trim() === '';
    const oyin = !!el.closest('.ach-badge, .ach-coll, .podium, .arena, .cs-cta, .live-badge, .qz-cta');
    items.push({ e: m.join(''), xizmat, oyin, t: tx.slice(0, 40), c: String(el.className || el.tagName).slice(0, 30) }); }
  return { emojiItems: items };
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
      appendFileSync(OUT, JSON.stringify({ key, s, total: info.total, ...r0 }) + '\n');
    }
  } catch (e) { appendFileSync(OUT, JSON.stringify({ key, err: String(e.message).slice(0, 80) }) + '\n'); }
  finally { await ctx.close(); }
};
const q = [...keys];
await Promise.all(Array.from({ length: +PAR }, async () => { while (q.length) await one(q.shift()); }));
await b.close();
console.log('tayyor');

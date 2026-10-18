// F-1015-123: Yakunda «Uyga vazifa» bosilgandan keyin ochiladigan karta — surat (faqat karta) + tuzilma o'lchovi.
// node hwkarta.mjs <outdir> <kalitlar> — lokal vite :5300 kerak. Dars faylini o'zgartirmaydi.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [,, OUT, KEYS] = process.argv;
const keys = KEYS.split(',');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const one = async (key) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1600 }, deviceScaleFactor: 1, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  try {
    await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForSelector('.lesson-root', { timeout: 20000 }); await p.waitForTimeout(600);
    const kir = p.getByText(/Kodsiz/); if (await kir.count()) { await kir.first().click({ timeout: 2000 }).catch(() => {}); await p.waitForTimeout(700); }
    let info = await p.evaluate(() => { let total = 0; for (const el of document.querySelectorAll('.lesson-root *')) { if (el.children.length) continue; const m = /^\s*(\d{2})\s*\/\s*(\d{2})\s*$/.exec(el.textContent || ''); if (m) { total = +m[2]; break; } }
      let lid = null; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) { lid = k.slice(11); break; } } return { total, lid }; });
    if (!info.lid) { await p.getByRole('button', { name: /Davom etish|Boshlaymiz|Boshlash/ }).first().click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(500);
      info.lid = await p.evaluate(() => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) return k.slice(11); } return null; }); }
    if (!info.lid || !info.total) { console.log('HW', key, JSON.stringify({ xato: 'lid/total' })); return; }
    await p.evaluate(([id, sc, tt]) => localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, answers: {}, earned: [], startedAt: Date.now(), total: tt, savedAt: Date.now() })), [info.lid, info.total - 1, info.total]);
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }); await p.waitForTimeout(1800);
    for (let i = 0; i < 3; i++) { const ov = await p.evaluate(() => !!document.querySelector('[class*="acu-"], .ach-celebrate, .ach-overlay')); if (!ov) break; await p.mouse.click(30, 300); await p.keyboard.press('Escape'); await p.waitForTimeout(900); }
    const banner = p.locator('.hw-big').first();
    if (!(await banner.count())) { console.log('HW', key, JSON.stringify({ banner: false })); return; }
    const bw = await banner.evaluate(e => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; });
    const before = await p.evaluate(() => document.querySelectorAll('.lesson-root *').length);
    await banner.scrollIntoViewIfNeeded(); await banner.click({ timeout: 3000 }); await p.waitForTimeout(2200);
    const pr = await p.evaluate(() => {
      const ov = document.querySelector('.hw-ov, [role=dialog]');
      const wrap = document.querySelector('.hw-big-wrap') || document.querySelector('.hw-big').parentElement;
      let card = ov ? (ov.querySelector('.hw-ov-in') || ov) : null;
      if (!card) { let n = wrap.nextElementSibling; while (n && n.getBoundingClientRect().height < 20) n = n.nextElementSibling; card = n; }
      if (!card) return { none: 1 };
      card.setAttribute('data-hwk', '1');
      const r = card.getBoundingClientRect(); const t = card.innerText;
      const lbl = [...card.querySelectorAll('*')].filter(e => !e.children.length && /^[A-ZА-ЯЁʻ' 0-9]{3,20}$/.test((e.innerText || '').trim()) && getComputedStyle(e).textTransform === 'uppercase' || (!e.children.length && getComputedStyle(e).textTransform === 'uppercase' && (e.innerText || '').trim().length < 20)).map(e => e.innerText.trim());
      const head = (card.querySelector('.card-lbl, h3, h4, [class*=lbl], [class*=-h]') || {}).innerText || '';
      const chips = [...card.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean);
      const marker = /[①②③④⑤]/.test(t) ? 'doira-belgi' : (card.querySelector('ol, [class*=num], [class*=step] > span:first-child') ? 'raqam-doira' : (card.querySelector('li') ? 'nuqta/so\'z' : 'yo\'q'));
      return { mode: ov ? 'popup' : 'ichida', cls: (card.className || '').toString().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), head: head.trim().slice(0, 40), lbl: [...new Set(lbl)].slice(0, 6), chips: chips.slice(0, 4), marker, keyingi: /Keyingi dars|Следующий урок/.test(t), emoji: /\p{Extended_Pictographic}/u.test(head), cols: getComputedStyle(card).display + '/' + getComputedStyle(card).gridTemplateColumns.split(' ').length, txt: t.slice(0, 300) };
    });
    console.log('HW', key, JSON.stringify({ banner: bw, ...pr }));
    const el = p.locator('[data-hwk]').first();
    if (await el.count()) await el.screenshot({ path: `${OUT}/${key}.png` }).catch(() => {});
  } catch (e) { console.log('HW', key, JSON.stringify({ xato: String(e.message).slice(0, 80) })); } finally { await ctx.close(); }
};
for (let i = 0; i < keys.length; i += 4) await Promise.all(keys.slice(i, i + 4).map(one));
await b.close();

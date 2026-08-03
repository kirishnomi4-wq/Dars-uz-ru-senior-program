// _clip-audit.mjs — QIRQILISH / USTMA-UST AUDITI (F-0802-16)
//
// Dalil: feedback/F-0802-14-kartalar-siqilishi.png — bashorat-kartasining variant-chiplari
// yarim balandlikda kesilgan. Sabab-sinf: `overflow: hidden` bo'lgan blok flex-siqilish
// tufayli kontentidan past bo'lib qoladi → skroll o'rniga KESILADI.
//
// 60-qonun tuzatishi `.screen` ning BEVOSITA bolalarini himoyaladi. Bu audit shu sinf
// ichkariroq qatlamlarda (ichki flex-ustunlar, qat'iy balandliklar) qolgan-qolmaganini
// O'LCHAYDI — taxmin qilmaydi.
//
// ⚠️ SKROLL nuqson EMAS (60-qonun uni maqbul deb belgilagan) — faqat kesilish va
//    ustma-ust tushish sanaladi.
//
// 🔴 MENTOR REJIMI majburiy: ba'zi ekranlar faqat mentorda eng baland holatga chiqadi
//    (PmLesson4 keys-ekranida bashorat + slayd BIRGA chiziladi) — foydalanuvchi dalili
//    aynan shu holatdan olingan. self rejimi buni prinsipial ravishda ko'rmaydi.
//
// Tezlik: ekranlar bo'ylab YURILMAYDI — `ccProgress:<lessonId>` ga to'g'ridan-to'g'ri
// ekran raqami yoziladi va sahifa qayta yuklanadi (yurishdan ~10x tez, deterministik).
//
// Ishlatish: node _clip-audit.mjs [--keys m2-02] [--mode self,mentor] [--vp 1280x773] [--selftest]

import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5300';
const NL = String.fromCharCode(10);
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const SELFTEST = argv.includes('--selftest');
const MODES = arg('mode', 'self,mentor').split(',');
const [VW, VH] = arg('vp', '1280x773').split('x').map(Number);
const PAR = Number(arg('par', 6));

const app = readFileSync('src/App.jsx', 'utf8');
const ALL_KEYS = [...app.matchAll(/key: '([a-z0-9-]+)'/g)].map(m => m[1]);
const KEYS = arg('keys', '') ? arg('keys').split(',') : ALL_KEYS;
const LESSON_IDS = readFileSync('_lessonids.txt', 'utf8').split(NL).map(s => s.trim()).filter(Boolean);

// ---------- sahifa ichidagi o'lchov ----------
const MEASURE = () => {
  const out = { clip: [], overlap: [] };
  const root = document.querySelector('.lesson-root');
  if (!root) return out;
  const nameOf = (el) => {
    const c = (typeof el.className === 'string' && el.className.trim())
      ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    return (el.tagName.toLowerCase() + c).slice(0, 52);
  };
  // A) QIRQILISH — overflow yashiradi, OQIMDAGI kontent sig'magan.
  // ⚠️ `scrollHeight > clientHeight` YOLG'ON signal beradi: ko'p kartada ataylab kesiladigan
  // bezak qatlami bor (`.hw-sky` suzuvchi so'zlar, nur, konfetti) — ular absolyut joylashgan
  // va `aria-hidden`. Shuning uchun faqat OQIMDAGI (static/relative), ko'rinadigan, MATNLI
  // bolaning konteyner tubidan oshib ketgani sanaladi. (F-0802-16 kalibrovkasi.)
  for (const el of root.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue;
    if (!(cs.overflowY === 'hidden' || cs.overflow === 'hidden')) continue;
    const box = el.getBoundingClientRect();
    if (box.height < 24) continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    const padB = parseFloat(cs.paddingBottom) || 0;
    const limit = box.bottom - padB;
    let worst = 0, who = '';
    for (const kid of el.children) {
      const ks = getComputedStyle(kid);
      if (ks.position === 'absolute' || ks.position === 'fixed') continue;   // bezak qatlami
      if (ks.display === 'none' || ks.visibility === 'hidden') continue;
      if (kid.getAttribute('aria-hidden') === 'true') continue;
      const kt = (kid.innerText || '').trim();
      if (!kt) continue;                                                      // matnsiz — bezak
      const kb = kid.getBoundingClientRect();
      if (kb.height < 6) continue;
      const over = kb.bottom - limit;
      if (over > worst) { worst = over; who = kt.slice(0, 44).replace(/\s+/g, ' '); }
    }
    if (worst <= 6) continue;                       // 1-6px — yaxlitlash shovqini
    out.clip.push({ el: nameOf(el), cut: Math.round(worst), h: Math.round(box.height), txt: who });
  }
  // B) USTMA-UST — .screen ning ketma-ket bolalari
  const scr = root.querySelector('.screen');
  if (scr) {
    const kids = [...scr.children].filter(k => getComputedStyle(k).display !== 'none' && k.getBoundingClientRect().height > 0);
    for (let i = 0; i < kids.length - 1; i++) {
      const a = kids[i].getBoundingClientRect(), b = kids[i + 1].getBoundingClientRect();
      if (a.bottom > b.top + 1) out.overlap.push({ a: nameOf(kids[i]), b: nameOf(kids[i + 1]), px: Math.round(a.bottom - b.top) });
    }
  }
  return out;
};

const browser = await chromium.launch({ executablePath: CHROME, headless: true });

async function makeCtx(mode) {
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
  await ctx.addInitScript(([ids, md]) => {
    try {
      ids.forEach(id => localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: md })));
    } catch {}
  }, [LESSON_IDS, mode]);
  return ctx;
}

async function auditLesson(key, mode) {
  const ctx = await makeCtx(mode);
  const page = await ctx.newPage();
  const errs = []; const findings = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 70)));
  try {
    await page.goto(`${BASE}/#/lesson/${key}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForSelector('.lesson-root', { timeout: 15000 });
    await page.waitForTimeout(500);
    // Dars identifikatorini va ekranlar sonini sahifadan olamiz
    const info = await page.evaluate(() => {
      let total = 0;
      const m = (document.querySelector('.lesson-root')?.innerText || '').match(/(\d+)\s*\/\s*(\d+)/);
      if (m) total = +m[2];
      let lid = null;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('ccProgress:')) { lid = k.slice(11); break; }
      }
      return { total, lid };
    });
    // lessonId topilmasa — bitta ekranni o'lchab qaytamiz
    const total = info.total || 1;
    let lid = info.lid;
    if (!lid) {
      // progress hali yozilmagan: bir marta oldinga bosib yozdiramiz
      await page.getByRole('button', { name: /Davom etish|Boshlaymiz/ }).first().click({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(400);
      lid = await page.evaluate(() => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) return k.slice(11); } return null; });
    }
    for (let s = 0; s < total; s++) {
      if (lid) {
        await page.evaluate(([id, sc, tt]) => {
          localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, answers: {}, earned: [], startedAt: Date.now(), total: tt, savedAt: Date.now() }));
        }, [lid, s, total]);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.lesson-root', { timeout: 12000 }).catch(() => {});
      }
      await page.waitForTimeout(260);
      if (SELFTEST) { await page.addStyleTag({ content: '.screen{flex:1 1 0%!important;min-height:0!important}.screen>*{flex-shrink:1!important}' }); await page.waitForTimeout(180); }
      const m = await page.evaluate(MEASURE);
      if (m.clip.length || m.overlap.length) findings.push({ screen: s, ...m });
      if (!lid) break;
    }
  } catch (e) { errs.push('NAV: ' + String(e.message).slice(0, 50)); }
  await ctx.close();
  return { key, mode, findings, errs: [...new Set(errs)] };
}

const results = [];
for (const mode of MODES) {
  for (let i = 0; i < KEYS.length; i += PAR) {
    const batch = KEYS.slice(i, i + PAR);
    const r = await Promise.all(batch.map(k => auditLesson(k, mode)));
    results.push(...r);
    const bad = r.filter(x => x.findings.length);
    process.stdout.write(`${mode} [${Math.min(i + PAR, KEYS.length)}/${KEYS.length}] ` + (bad.length ? `NUQSON: ${bad.map(x => x.key).join(',')}` : 'toza') + NL);
  }
}
await browser.close();

writeFileSync('_clip-audit.json', JSON.stringify(results, null, 1));
const bad = results.filter(r => r.findings.length);
console.log(NL + '===== NATIJA =====');
console.log(`tekshirildi: ${results.length} (dars x rejim) · nuqsonli: ${bad.length}`);
const cls = {};
for (const r of bad) for (const f of r.findings) for (const c of f.clip) cls[c.el] = (cls[c.el] || 0) + 1;
if (Object.keys(cls).length) {
  console.log(NL + '--- QIRQILGAN ELEMENTLAR (sinf bo\'yicha) ---');
  for (const [k, v] of Object.entries(cls).sort((a, b) => b[1] - a[1])) console.log(`  ${v}x  ${k}`);
}
console.log(NL + '--- DARSLAR ---');
for (const r of bad) {
  console.log(`${r.key} (${r.mode}) — ${r.findings.length} ekran`);
  for (const f of r.findings.slice(0, 3)) {
    if (f.clip.length) console.log(`   ekran${f.screen} QIRQILISH: ` + f.clip.slice(0, 2).map(c => `${c.el} -${c.cut}px "${c.txt}"`).join(' | '));
    if (f.overlap.length) console.log(`   ekran${f.screen} USTMA-UST: ` + f.overlap.map(o => `${o.a}/${o.b} ${o.px}px`).join(' | '));
  }
}
const errd = results.filter(r => r.errs.length);
if (errd.length) { console.log(NL + `⚠️ sahifa-xatolari: ${errd.length}`); for (const r of errd.slice(0, 8)) console.log(`   ${r.key} ${r.mode}: ${r.errs[0]}`); }
console.log(NL + "to'liq hisobot: _clip-audit.json");

// F-1019-04 · m1-04 (Htmllesson2) s5 «Struktura» — passiv «har bir bo'limni bosing» → qaror qadamlari (DE 213.22) sinovi.
// node feedback/F-1019-04-passiv/sinov/m1-04.mjs <suratlar/m1-04-uz papkasi (shots.mjs _p.html)>
import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const ID = 'html-02-v16'; const TOTAL = 19; const SC = 5;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = []; const log = (x) => console.log(x);
const ochish = async (screen, answers = {}, w = 1280, h = 860) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, sc, ans, n]) => { for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, maxReached: sc, answers: ans, earned: [], startedAt: Date.now(), total: n, savedAt: Date.now() })); }, [ID, screen, answers, TOTAL]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + OUT + '/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900); return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : ' (ochiq)') : null; });
const teglar = (p) => p.$$eval('.szone-tag', a => a.map(x => x.innerText.trim()).join(' '));
const kod = (p) => p.innerText('pre.code-box').then(t => t.replace(/\n/g, ' | ')).catch(() => '—');
let xatolar = 0;
const qaror = async (p, togri, xato, nom, surat) => {
  const savol = await p.innerText('.qr-s').catch(() => "YO'Q");
  const faol = await p.innerText('.szone.active .szone-h').catch(() => "YO'Q");
  await p.locator('.qr-v button', { hasText: xato }).click(); await p.waitForTimeout(350);
  const izoh = await p.innerText('.qr .qr-xato').catch(() => "YO'Q");
  const yopiq = await p.locator('.qr-v button', { hasText: xato }).isDisabled();
  if (izoh === "YO'Q" || !yopiq) xatolar++;
  if (surat) await p.screenshot({ path: OUT + '/' + surat });
  await p.locator('.qr-v button').filter({ hasText: new RegExp('^' + togri.replace(/[<>/]/g, m => '\\' + m) + '$') }).click(); await p.waitForTimeout(600);
  log(`  ${nom}: bo'lim «${faol}» · «${savol}» · xato «${xato}» → sabab «${izoh}» (tugma yopildi: ${yopiq}) → to'g'ri «${togri}» ✓ · nav=${await nav(p)}`);
  log(`    teglar: ${await teglar(p)} · kod: ${await kod(p)} · vazifa-karta: ${await p.innerText('.sk-info .sk-chip').catch(() => "yo'q")}`);
};
let p = await ochish(SC);
log('s5 boshida: nav=' + await nav(p) + ' · teglar: ' + await teglar(p) + ' · kod: ' + await kod(p) + ' · bo\'lim animatsiyasi: ' + await p.$eval('.szone', x => getComputedStyle(x).animationName));
await qaror(p, '<header>', '<head>', '1 tepa', 't-s5-xato.png');
await qaror(p, '<main>', '<body>', '2 asosiy');
await qaror(p, '<footer>', '<main>', '3 pastki');
await p.waitForTimeout(500);
log('s5 oxiri: nav=' + await nav(p) + ' · savol: ' + !!(await p.$('.qr')) + ' · xulosa: ' + !!(await p.$('.frame-success')) + ' · saqlandi: ' + await p.evaluate(([id, sc]) => !!(JSON.parse(localStorage.getItem('ccProgress:' + id) || '{}').answers || {})[sc], [ID, SC]));
await p.locator('.szone', { hasText: 'Asosiy qism' }).click(); await p.waitForTimeout(400);
log('  tugagach «Asosiy qism» bosildi → vazifa-karta: ' + await p.innerText('.sk-info').then(t => t.replace(/\n/g, ' ')).catch(() => "yo'q"));
await p.screenshot({ path: OUT + '/t-s5-tugadi.png' });
p = await ochish(SC, { [SC]: { correct: true, picked: true } });
log('s5 qaytish (saqlangan): nav=' + await nav(p) + ' · savol: ' + !!(await p.$('.qr')) + ' · teglar: ' + await teglar(p) + ' · xulosa: ' + !!(await p.$('.frame-success')));
const m = await ochish(SC, {}, 390, 844); await m.screenshot({ path: OUT + '/t-s5-390.png', fullPage: true });
log('qaror xatolari (sabab yo\'q / tugma yopilmadi): ' + xatolar);
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();

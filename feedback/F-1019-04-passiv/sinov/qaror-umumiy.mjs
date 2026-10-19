// F-1019-06 (DE 213.22) · qaror qadamlari umumiy sinovi: har qadam xato → sabab, tugma yopiq → to'g'ri → keyingi; oxirida «Davom etish»; qaytganda tugagan holat; pageerror.
import { chromium } from 'playwright-core';
export const sina = async ({ OUT, ID, total, screen, pre, qadamlar, kut = 1500, nom }) => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const errs = []; const log = (x) => console.log(x);
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, sc, tot]) => {
    if (sessionStorage.getItem('_init')) return; sessionStorage.setItem('_init', '1');
    for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); }
    localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' }));
    localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: tot, savedAt: Date.now() }));
  }, [ID, screen, total]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + OUT + '/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  const nav = () => p.evaluate(() => { const x = [...document.querySelectorAll('.stage-nav button')].pop(); return x ? x.innerText.trim() + (x.disabled ? ' (yopiq)' : ' (ochiq)') : null; });
  log(`== ${nom} · ekran ${screen}`);
  log('boshida: nav=' + await nav() + ' · qaror: ' + !!(await p.$('.' + pre + '-qr')) + ' · eski stepper: ' + !!(await p.$('.' + pre + '-qadamlar')));
  const v = await p.$$('.q-bashorat button'); await v[0].click(); await p.waitForTimeout(800);
  log('bashoratdan keyin: nav=' + await nav() + ' · savol: ' + await p.innerText('.' + pre + '-qr-s'));
  await p.screenshot({ path: OUT + '/t-1.png' });
  let ok = true;
  for (let i = 0; i < qadamlar.length; i++) {
    const [togri, xatolar] = qadamlar[i];
    const savol = await p.innerText('.' + pre + '-qr-s');
    for (const x of xatolar) {
      await p.locator('.' + pre + '-qr-v button', { hasText: x }).click(); await p.waitForTimeout(300);
      const izoh = await p.innerText('.' + pre + '-qr .q-xato').catch(() => "YO'Q");
      const yopiq = await p.locator('.' + pre + '-qr-v button', { hasText: x }).isDisabled();
      if (izoh === "YO'Q" || !yopiq) ok = false;
      log(`  ${i + 1}. «${savol}» xato «${x}» → «${izoh}» (tugma yopildi: ${yopiq})`);
      if (i === 0 && x === xatolar[0]) await p.screenshot({ path: OUT + '/t-xato.png' });
    }
    await p.locator('.' + pre + '-qr-v button', { hasText: togri }).click();
    if (i < qadamlar.length - 1) {
      await p.waitForFunction(([s, pr]) => { const e = document.querySelector('.' + pr + '-qr-s'); return e && e.innerText !== s; }, [savol, pre], { timeout: 15000 }).catch(() => { ok = false; });
      await p.waitForTimeout(400);
      const iz = await p.innerText('.' + pre + '-sahna-iz').catch(() => "YO'Q");
      const ichida = await p.evaluate((pr) => { const e = document.querySelector('.' + pr + '-sahna-iz'); return !!(e && e.closest('.zoomable')); }, pre);
      log(`     to'g'ri «${togri}» ✓ → nav=${await nav()} · sahna izohi (karta ichida: ${ichida}): «${iz}»`);
      if (i === 0) await p.screenshot({ path: OUT + '/t-2.png' });
    } else {
      await p.waitForFunction((pr) => !document.querySelector('.' + pr + '-qr'), pre, { timeout: 15000 }).catch(() => { ok = false; });
      await p.waitForTimeout(kut);
      log(`     to'g'ri «${togri}» ✓ → oxiri: nav=${await nav()} · xulosa: ${!!(await p.$('.q-xulosa'))}`);
    }
  }
  await p.screenshot({ path: OUT + '/t-tugadi.png' });
  const javob = await p.evaluate(([id, sc]) => { const c = JSON.parse(localStorage.getItem('ccProgress:' + id) || '{}'); return c.answers ? JSON.stringify(c.answers[sc] || null) : 'yo\'q'; }, [ID, screen]);
  log('saqlangan javob: ' + javob);
  // Qaytish: Davom etish → Orqaga
  await p.locator('.stage-nav button').last().click(); await p.waitForTimeout(1200);
  await p.locator('.stage-nav button').first().click(); await p.waitForTimeout(1500);
  const n1 = await nav(); const q1 = !!(await p.$('.' + pre + '-qr'));
  log('orqaga qaytganda: nav=' + n1 + ' · qaror qayta chiqdimi: ' + q1 + ' · xulosa: ' + !!(await p.$('.q-xulosa')));
  // Qayta yuklash
  await p.reload(); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(1500);
  const n2 = await nav(); const q2 = !!(await p.$('.' + pre + '-qr'));
  log('qayta yuklanganda: nav=' + n2 + ' · qaror qayta chiqdimi: ' + q2);
  if (!/Davom etish \(ochiq\)/.test(n1) || q1 || q2) ok = false;
  await p.screenshot({ path: OUT + '/t-qaytish.png' });
  // 390 px
  const m = await b.newContext({ viewport: { width: 390, height: 844 } }); await m.route(/^https?:\/\//, r => r.abort());
  await m.addInitScript(([id, sc, tot]) => { for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: tot, savedAt: Date.now() })); }, [ID, screen, total]);
  const pm = await m.newPage(); pm.on('pageerror', e => errs.push(e.message));
  await pm.goto('file://' + OUT + '/_p.html'); await pm.waitForSelector('.lesson-root'); await pm.waitForTimeout(900);
  await (await pm.$$('.q-bashorat button'))[0].click(); await pm.waitForTimeout(700);
  await pm.locator('.' + pre + '-qr-v button', { hasText: qadamlar[0][1][0] }).click(); await pm.waitForTimeout(300);
  await pm.locator('.' + pre + '-qr-v button', { hasText: qadamlar[0][0] }).click(); await pm.waitForTimeout(kut + 6000);
  const gor = await pm.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  log('390 px: gorizontal toshish ' + gor + ' px');
  await pm.screenshot({ path: OUT + '/t-390.png', fullPage: true });
  log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
  log('HUKM: ' + (ok && !errs.length ? 'PASS' : 'MUAMMO'));
  await b.close();
};

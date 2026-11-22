// 19-dars «Bloklar ortidagi kod» — to'liq jonli dars sinovi (22.11). Manba: new-junior/manba/019-bloklar-ortidagi-kod.md v1.
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali. 18 qadam: huk (uch sinov), yangi so'z «kod», ustoz «Kodini ko‘rsat»ni ochadi (7),
// koddagi sonni o'zgartiradi (10) va faqat kodni o'qib bayroqcha qo'yadi (14); 1–3-bekat pog'onalari (Aziz — hammasi, Lola — har bekatning 1-pog'onasi;
// haqiqiy bosishlar: qator, blok, koddagi son, katak; o'yinni bot o'ynaydi), doskalar, 16-qadam (A·1), natija sonlari, yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-019 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/019-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-019.html', X = 'd19' + Date.now().toString(36)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const URUG = (sd) => { let u = sd * 7919; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } }
const oyna = async (n, w, h, sd) => { const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); await p.addInitScript(URUG, sd); p.on('pageerror', (e) => xato.push(n + ': ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(n + ' konsol: ' + m.text()) }); return p }
const u = await oyna('ustoz', 1600, 900, 2), a = await oyna('Aziz', 1440, 810, 3), l = await oyna('Lola', 1440, 810, 5)
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || iz === '' ? '' : '  — ' + iz)) }
const kut = (ms) => u.waitForTimeout(ms)
const R = (p) => (p === u ? '#ust' : '#bol')
const id = (p) => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (p, s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (p, f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ekrangacha = async (p, e, ms = 8000) => { const r = await gacha(p, (e) => { const ek = document.querySelector('#ilova .ekran'); return ek?.dataset.id === e && (!ek.querySelector('.per-q') || !!ek.__per) }, e, ms); await p.waitForTimeout(500); return r }
const keyingi = async () => { await u.click('#ust .hn .asos'); await kut(600) }
const hint = (p) => matn(p, R(p) + ' .hn .hint')
const muam = (p) => p.evaluate((r) => { const m = document.querySelector(r + ' .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' }, R(p))
const vol = (p, v) => p.evaluate(({ r, v }) => vOl(document.querySelector(r + ' .ekran'), v), { r: R(p), v })
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
const tugma = (p) => R(p) + (p === u ? ' .hn .ishga' : ' .hn .ishga, ' + R(p) + ' .hn .asos')
const boshla = async (p) => { await p.click(tugma(p)); await p.waitForTimeout(500) }
const kodT = async (p) => { await p.click(R(p) + ' .hn .kod-t'); await p.waitForTimeout(450) }
const kodOchiq = (p) => p.evaluate((r) => document.querySelector(r + ' .ekran').classList.contains('kod-och'), R(p))
const karta = async (p, pid) => { await p.click(R(p) + ' .per-k[data-p="' + pid + '"]'); await p.waitForTimeout(400) }
const kodSonQ = async (p, rx, qiymat, f = 'N', n = 0) => {
  await p.locator(R(p) + ' .kodp .kq', { hasText: rx }).locator('.kn[data-f="' + f + '"]').nth(n).click(); await p.waitForTimeout(350)
  await p.locator('.blocklyDropDownDiv .blocklyMenuItem:visible', { hasText: new RegExp('^' + qiymat + '$') }).first().click(); await p.waitForTimeout(550)
}
const nishonId = (p) => p.evaluate((r) => document.querySelector(r + ' .ekran').__kod.nishon, R(p))
const qatorBos = async (p, idd) => { await p.locator(R(p) + ' .kodp .kq[data-b="' + idd + '"]').click(); await p.waitForTimeout(900) }
const blokBos = async (p, idd) => { const r = await p.evaluate(({ r, idd }) => { const ek = document.querySelector(r + ' .ekran'), x = BL_WS.get(ek).getBlockById(idd).getSvgRoot().getBoundingClientRect(); return [x.left, x.top] }, { r: R(p), idd }); await p.mouse.click(r[0] + 10, r[1] + 11); await p.waitForTimeout(900) }
const katak = async (p, x, y) => { await p.locator(R(p) + ' .katak.maydon .kt-c[data-k="' + x + ',' + (4 - y) + '"]').click({ force: true }); await p.waitForTimeout(300) }
async function bot(p, rejim = 'ur') {
  const r0 = R(p)
  const bos = async (k) => { for (let t = 0; t < 40 && (await p.evaluate((r) => !!document.querySelector(r + ' .ekran').dataset.yuryapti, r0)); t++) await p.waitForTimeout(40); await p.keyboard.press(k) }
  for (let t = 0; t < 800; t++) {
    const s = await p.evaluate((r) => {
      const ek = document.querySelector(r + ' .ekran'), o = OYIN.get(ek); if (!ek.dataset.oyin || !o || !o.h) return null
      const d = (ek.__dush ? ek.__dush.nusxa : []).map((n, i) => ({ i, x: n.x, y: n.y, ot: !!n.__ot })).filter((n, i) => { const q = ek.__dush.nusxa[i]; return !q.ochdi && q.yurdi })
      return { x: o.h.x, d, band: !!ek.dataset.yuryapti }
    }, r0)
    if (!s) break
    if (!s.band) {
      const xavf = (x) => s.d.some((n) => n.x === x && n.y <= 1)
      if (xavf(s.x)) { const yon = [s.x - 1, s.x + 1].filter((x) => x >= 0 && x <= 6 && !xavf(x)); if (yon.length) await bos(yon[0] < s.x ? 'ArrowLeft' : 'ArrowRight') }
      else if (rejim === 'ur') {
        const n = s.d.filter((n) => !n.ot && n.y >= 2).sort((a2, c) => ((c.y >= 3) - (a2.y >= 3)) || Math.abs(a2.x - s.x) - Math.abs(c.x - s.x) || c.y - a2.y)[0]
        if (n && n.x === s.x) { await bos(' '); await p.evaluate(({ r, i }) => { document.querySelector(r + ' .ekran').__dush.nusxa[i].__ot = true }, { r: r0, i: n.i }) }
        else if (n && !xavf(s.x + (n.x > s.x ? 1 : -1))) await bos(n.x > s.x ? 'ArrowRight' : 'ArrowLeft')
      }
    }
    await p.waitForTimeout(100)
  }
  await p.waitForTimeout(700)
}
// pog'onalar: har biri — bola harakati; keyin ekran almashishi kutiladi
const B1A = async (p) => { await kodT(p); await karta(p, 'oq'); await karta(p, 'dushman') }
const B1B = async (p) => { for (let i = 0; i < 3; i++) { const n = await nishonId(p); if (!n) break; await qatorBos(p, n) } }
const B1C = async (p) => { for (let i = 0; i < 3; i++) { const n = await nishonId(p); if (!n) break; await blokBos(p, n) } }
const B1Y = async (p) => { await karta(p, 'raketa'); if (await kodOchiq(p)) await kodT(p); await p.locator(R(p) + ' .rg .rd.f-t').click(); await p.waitForTimeout(300); await p.locator(R(p) + ' .pl .mbw').first().click(); await p.waitForTimeout(500); await kodT(p) }
const B2A = async (p) => { await kodSonQ(p, /for \(let i = 0; i < \d+/, '8'); await boshla(p); await bot(p, 'ur') }
const B2B = async (p) => { await karta(p, 'oq'); await kodSonQ(p, /ball = ball/, '2'); await boshla(p); await bot(p, 'ur') }
const B2C = async (p) => { await karta(p, 'raketa'); await kodSonQ(p, /^\s*\d+\s*jon = \d+;/, '5'); await boshla(p); await bot(p, 'ur') }
const B2Y = async (p) => { await karta(p, 'dushman'); await kodSonQ(p, /for \(let i = 0; i < \d+/, '6'); await kodSonQ(p, /goTo\(random/, '5', 'B'); await boshla(p); await bot(p, 'ur') }
const bash = (x, y) => async (p) => { await katak(p, x, y); await boshla(p); await p.waitForTimeout(2800) }
const B3Y = async (p) => { await kodSonQ(p, /for \(let i = 0; i < \d+/, '5'); await boshla(p); await p.waitForTimeout(3000) }
const P1 = [['B1A', B1A], ['B1B', B1B], ['B1C', B1C], ['B1Y', B1Y]], P2 = [['B2A', B2A], ['B2B', B2B], ['B2C', B2C], ['B2Y', B2Y]], P3 = [['B3A', bash(2, 1)], ['B3B', bash(5, 0)], ['B3C', bash(3, 3)], ['B3Y', B3Y]]
const pog = async (p, [e, f], keyin) => { await ekrangacha(p, e); await p.waitForTimeout(400); await f(p); return { e, g: await hint(p), m: await muam(p), o: await ekrangacha(p, keyin, 9000) } }

await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Lola'); localStorage.setItem('demo-qah', 'nihol') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`); await kut(1500)
// ---------- 1–4
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · «Kirdi: 2», «Bloklar ortida nima bor?»', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bloklar ortida nima bor?', await hint(u) + ' | ' + await matn(u, '#ust .sar'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
await keyingi(); await ekrangacha(a, 'P2N'); await a.locator('#bol .jk').nth(2).click(); await l.locator('#bol .jk').nth(1).click(); await kut(1200)
tek('2 · «Javob berdi: 2 / 2»', (await hint(u)) === 'Javob berdi: 2 / 2', await hint(u))
await keyingi()
const jn = (n) => gacha(u, (n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, n, 90000)
await jn(1); tek('3 · A — «✕ kompyuter bu so‘zni bilmaydi»', (await matn(u, '#ust .jk.c1 .jn')) === '✕ kompyuter bu so‘zni bilmaydi')
await keyingi(); await jn(2); tek('3 · B — «✕ belgi — buyruq emas»', (await matn(u, '#ust .jk.c2 .jn')) === '✕ belgi — buyruq emas')
await keyingi(); await jn(3); tek('3 · C — «✓ raketa yurdi»', (await matn(u, '#ust .jk.c3 .jn')) === '✓ raketa yurdi')
await keyingi(); tek('4 · javob: A, B xira', (await id(u)) === 'P2C' && (await u.$$('#ust .jk.n-yoq')).length === 2)
// ---------- 5–6
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(250) }
tek('5 · «Kod nima?» — uch bo‘lak va ta’rif', (await u.$$('#ust .xs-b.on')).length === 3 && !!(await u.$('#ust .xs-ta.on')))
await keyingi(); tek('6 · reja', (await id(u)) === 'P4')
// ---------- 7: «Kodini ko'rsat»
await keyingi(); await kut(500)
tek('7 · P7: uch karta, kod yopiq, «Kodini ko‘rsat» tugmasi; bolada «Ustoz kodni ochyapti»', (await u.$$('#ust .per-k')).length === 3 && !(await kodOchiq(u)) && !!(await u.$('#ust .hn .kod-t')) && (await matn(a, '#bol .qarang')).includes('Ustoz kodni ochyapti'), await matn(a, '#bol .qarang'))
await kodT(u); tek('7 · kod ochildi: onKey("right") va moveRight();', (await kodOchiq(u)) && /onKey\("right"/.test(await matn(u, '#ust .kodp-q')) && /moveRight\(\);/.test(await matn(u, '#ust .kodp-q')))
const q1 = await u.locator('#ust .kodp .kq', { hasText: /moveRight\(\);/ }).first().getAttribute('data-b'); await qatorBos(u, q1)
tek('7 · qatorni bosdi — o‘sha blok yondi (coral)', await u.evaluate((q) => !!document.querySelector('#ust .dst .kod-yon') && document.querySelector('#ust .kodp .kq[data-b="' + q + '"]').classList.contains('on'), q1))
await karta(u, 'dushman'); tek('7 · «Dushman» kartasi — kod ham almashdi', /onClone/.test(await matn(u, '#ust .kodp-q')))
// ---------- 8: blok va qator
await keyingi(); await ekrangacha(a, 'B1A'); await ekrangacha(l, 'B1A'); await kut(600)
tek('8 · B1A: «Kodini ko‘rsat» tugmasi bor, kod yopiq', !!(await a.$('#bol .hn .kod-t')) && !(await kodOchiq(a)))
let r
for (let i = 0; i < 4; i++) { r = await pog(a, P1[i], i < 3 ? P1[i + 1][0] : 'BK'); tek('8 · Aziz ' + P1[i][0] + ' → ' + (i < 3 ? P1[i + 1][0] : 'BK'), r.o, JSON.stringify(r)) }
r = await pog(l, P1[0], 'B1B'); tek('8 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('8 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 9–10: kodda son
await keyingi(); await keyingi(); await kut(500)
tek('10 · P8: kod ochiq, «Dushman» tanlangan', (await kodOchiq(u)) && !!(await u.$('#ust .per-k.on[data-p="dushman"]')) && /onClone/.test(await matn(u, '#ust .kodp-q')))
await kodSonQ(u, /for \(let i = 0; i < \d+/, '8')
tek('10 · kodda 5 → 8: repeat blokida ham 8', await u.evaluate(() => BL_WS.get(document.querySelector('#ust .ekran')).getAllBlocks(false).filter((b) => b.type === 'repeat').some((b) => b.getFieldValue('N') === '8')))
await boshla(u); await bot(u, 'ur'); tek('10 · sakkizta dushman tushdi — «Dushman: 8»', (await matn(u, '#ust .kl-son')) === 'Dushman: 8', await matn(u, '#ust .kl-son'))
// ---------- 11
await keyingi(); await ekrangacha(a, 'B2A'); await kut(500)
tek('11 · B2A: Aziz — kod ochiq, «ball: 0» sahnada', (await kodOchiq(a)) && !!(await a.$('#bol .oyna .ball-k[data-v="ball"]:not(.yoq)')))
for (let i = 0; i < 4; i++) { r = await pog(a, P2[i], i < 3 ? P2[i + 1][0] : 'BK'); tek('11 · Aziz ' + P2[i][0] + ' → ' + (i < 3 ? P2[i + 1][0] : 'BK'), r.o, JSON.stringify(r)) }
r = await pog(l, P2[0], 'B2B'); tek('11 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('11 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 12–14
await keyingi(); tek('12 · xulosa «Kod»', (await matn(u, '#ust .sar')) === 'Kod', await matn(u, '#ust .sar'))
await keyingi(); await keyingi(); await kut(500)
tek('14 · P10: faqat kod — bloklar yashirin, goTo(1, 0);', (await u.evaluate(() => document.querySelector('#ust .ekran').classList.contains('kod-faqat'))) && /goTo\(1, 0\);/.test(await matn(u, '#ust .kodp-q')))
await katak(u, 3, 0); await boshla(u); await kut(3000)
tek('14 · (3, 0) — «Oldindan aytdingiz!», bloklar ham ko‘rindi', /Oldindan aytdingiz/.test(await hint(u)) && !(await u.evaluate(() => document.querySelector('#ust .ekran').classList.contains('kod-faqat'))), await hint(u))
// ---------- 15
await keyingi(); await ekrangacha(a, 'B3A'); await ekrangacha(l, 'B3A'); await kut(600)
tek('15 · B3A: bolada faqat kod, sonlar bosilmaydi', await a.evaluate(() => { const ek = document.querySelector('#bol .ekran'); return ek.classList.contains('kod-faqat') && ek.querySelector('.kodp-q').classList.contains('tahrir-yoq') }))
for (let i = 0; i < 4; i++) { r = await pog(a, P3[i], i < 3 ? P3[i + 1][0] : 'BK'); tek('15 · Aziz ' + P3[i][0] + ' → ' + (i < 3 ? P3[i + 1][0] : 'BK'), r.o, JSON.stringify(r)) }
r = await pog(l, P3[0], 'B3B'); tek('15 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('15 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 16–18
await keyingi(); await kut(1200)
tek('16 · Aziz — oxirgi pog‘onasi (B3Y); Lola — B3A', (await id(a)) === 'B3Y' && (await id(l)) === 'B3A', (await id(a)) + ' ' + (await id(l)))
await keyingi(); await ekrangacha(a, 'B5'); await kut(800)
const K3 = ['ta qatorni topdi', 'ta sonni o‘zgartirdi', 'pog‘ona bajardi']
const nat = (p, r2 = '#bol') => p.evaluate(({ K3, r2 }) => K3.map((k) => +document.querySelector(r2 + ' .sn-t[data-k="' + k + '"] b').textContent), { K3, r2 })
const na = await nat(a), nl = await nat(l)
tek('17 · Aziz: qator ≥ 6, son ≥ 6, pog‘ona 12', na[0] >= 6 && na[1] >= 6 && na[2] === 12, na.join(','))
tek('17 · Lola: son ≥ 1, pog‘ona 3', nl[1] >= 1 && nl[2] === 3, nl.join(','))
await keyingi(); await kut(800)
const sinf = await nat(u, '#ust')
tek('18 · sinf = Aziz + Lola', sinf.join(',') === na.map((x, i) => x + nl[i]).join(','), sinf.join(','))
await u.click('#ust .hn .asos'); await kut(800); tek('18 · «Dars tugadi!»', !!(await u.$('#ust .tugadi-k')))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); await b.close()
process.exit(ok === jami ? 0 : 1)

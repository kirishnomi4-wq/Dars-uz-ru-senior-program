// 12-dars «Jon va qadam» — to'liq jonli dars sinovi (21.11). Manba: new-junior/manba/012-ozgaruvchi-jon-vaqt.md (v1, tavsiya bo'yicha).
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali. 18 qadam: huk (uch karta o'zi o'ynaladi), javob, yangi so'z (birma-bir),
// ustoz javondan HAQIQIY bosib jon qoidasini tuzadi (tur, o'zgaruvchi, son — ro'yxatdan), bolalar sinov pog'onalarida qoidani sinaydi, yutish pog'onalarida o'ynaydi
// (dastur if ichidagilari bilan pog'onadan pog'onaga), 3-bekat tayyor o'yin bilan, qadam qoidasi, doskalar sanog'i, 16-qadam (A·1), natija sonlari, yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-012 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/012-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5360/demo-012.html', X = 'd12-' + Date.now().toString(36)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const oyna = async (n, w, h) => { const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); p.on('pageerror', (e) => xato.push(n + ': ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(n + ' console: ' + m.text()) }); return p }
const u = await oyna('ustoz', 1600, 900), a = await oyna('Aziz', 1440, 810), l = await oyna('Lola', 1440, 810)
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || iz === '' ? '' : '  — ' + iz)) }
const kut = (ms) => u.waitForTimeout(ms)
const id = (p) => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (p, s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (p, f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ekrangacha = (p, e, ms = 8000) => gacha(p, (e) => document.querySelector('#ilova .ekran')?.dataset.id === e, e, ms)
const keyingi = async () => { await u.click('#ust .hn .asos'); await kut(500) }
const R = (p) => (p === u ? '#ust' : '#bol')
const hint = (p) => matn(p, R(p) + ' .hn .hint')
const muam = (p) => p.evaluate((r) => { const m = document.querySelector(r + ' .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' }, R(p))
const ozg = (p) => p.evaluate((r) => { const v = {}; document.querySelectorAll(r + ' .oyna .ball-k[data-v]:not(.yoq)').forEach((k) => { v[k.dataset.v] = k.querySelector('b').textContent }); return JSON.stringify(v) }, R(p))
const tugadi = (p) => p.evaluate((r) => !!document.querySelector(r + ' .oyin-tugadi'), R(p))
const tinch = (p) => gacha(p, (r) => !document.querySelector(r + ' .ekran')?.dataset.yuryapti, R(p), 30000)
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p) } await p.waitForTimeout(350) }
const boshla = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(400); await tinch(p) }
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
const jav = async (p, f, t) => { await p.click(R(p) + ' .rg .rd.f-' + f); await p.waitForTimeout(120); await p.click(R(p) + ` .pl .mbw:not(.yopiq) .mb[data-tur="${t}"]`); await p.waitForTimeout(300) }
// dastur — Blockly bloklari bevosita (javon yo'li ustoz qadamlarida haqiqiy bosish bilan sinaladi): [[hodisa t, m], [ostidagilar [t, m, ichki?]…]]
const dastur = (p, d) => p.evaluate(({ r, d }) => {
  const ek = document.querySelector(r + ' .ekran'), ws = BL_WS.get(ek); ws.clear()
  const zanjir = (ota, q, ichki) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else if (ichki) ota.getInput('DO').connection.connect(x.previousConnection); else ota.nextConnection.connect(x.previousConnection); if (ich) zanjir(x, ich, true); o = x } }
  d.forEach(([[t, m], q], i) => { const h = blYangi(ws, t, m); h.moveTo(new Blockly.utils.Coordinate(0, 1000 * i)); zanjir(h, q || [], false) })
  ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); sanoq(ek)
}, { r: R(p), d }).then(() => p.waitForTimeout(300))
const tuz = (p) => p.evaluate((r) => blDasturchalar(document.querySelector(r + ' .ekran')).map((x) => x.tur + ':' + (x.olma || x.tugma || '') + '[' + x.daraxt.map(function f(t) { const el = t.el, ty = blokTuri(el); return ty + (ty !== 'g' ? '(' + ozgNom(el) + ' ' + blokSon(el) + ')' : '') + (t.ichki.length ? '{' + t.ichki.map(f).join(',') + '}' : '') }).join(',') + ']').join(' '), R(p))
const menyu = async (p, blok, n, q) => { await p.locator(`${R(p)} .jr-bl .mb[data-tur="${blok}"]`).last().locator('.blocklyDropdownField').nth(n).click(); await p.waitForTimeout(180); await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: new RegExp('^\\s*' + q + '\\s*$') }).first().click(); await p.waitForTimeout(180) }
const javT = async (p, f, sel) => { await p.click(R(p) + ' .rg .rd.f-' + f); await p.waitForTimeout(120); await p.click(R(p) + ' .pl .mbw:not(.yopiq) ' + sel); await p.waitForTimeout(300) }
const ST = (o) => [['f'], Object.entries(o).map(([n, v]) => ['z', n + ':' + v])]
const JQR = [['c', 'jon:-1'], ['i', 'jon:0', [['g']]]], QQR = [['c', 'qadam:-1'], ['i', 'qadam:0', [['g']]]]
const KAK = (q) => [['q', 'cactus'], q], OLM = (n) => [['q', 'apple'], [['c', 'ball:' + n]]], ANY = (q) => [['k', 'any'], q]
// manba yechimlari — eng qisqa yo'llar kaktusga tegmay (sinov/dvigatel/jon.mjs mustaqil hisobda tekshirilgan)
const Y = {"P7":"↑→→↓↑↑→↑→→↓→↑↑","B1C":"↑→↑→↑→→→→↓↓↓","B1Y":"↑→→→↑↑→→↓↓→↓","B2A":"↑↑↑→→↓→↓↑→→→↓↓","B2B":"←←→↑↑←↓←←←←→→↑↑→↑","B2C":"↑→→↓↑←←↑↑→→→→→↓","B2Y":"↑→→↓↑↑↑→↑→↓↓↓↓↑→→↓","B3B":"→→↑→↑→→↓↓","B3C":"↑←↑↓←↓↑←↑↓←←←↓","B3Y":"→→←←↑↑↑↓→→↑→↑→→↓↓→↑↑"}
const pog = async (p, e, d, bosish, keyin) => { await ekrangacha(p, e); await kut(400); if (d) await dastur(p, d); await boshla(p); await bos(p, bosish); const g = await hint(p); return { g, v: await ozg(p), o: keyin ? await ekrangacha(p, keyin, 6000) : false } }

const SG = 'Shart ishladi: jon 0 — o‘yin tugadi!'
// ---------- 1
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await kut(1500)
tek('1 · Aziz: B0; Lola: avval BQ', (await id(a)) === 'B0' && (await id(l)) === 'BQ')
await l.locator('#bol .tq-o').nth(4).click(); await ekrangacha(l, 'B0')
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · ustoz: «Kirdi: 2»; «Bugun o‘yinda jon bo‘ladi!»; «O‘tgan darsda» — o‘zgaruvchi', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun o‘yinda jon bo‘ladi!' && (await matn(u, '#ust .otd')).includes('O‘zgaruvchi'), await matn(u, '#ust .sar'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
// ---------- 2–4
await keyingi(); await ekrangacha(a, 'P2N'); await ekrangacha(l, 'P2N')
await a.locator('#bol .jk').nth(2).click(); await l.locator('#bol .jk').nth(1).click(); await kut(1200)
await gacha(u, () => /2 \/ 2/.test(document.querySelector('#ust .hn .hint')?.textContent)); tek('2 · «Javob berdi: 2 / 2»; sahnada «jon: 3»', (await hint(u)) === 'Javob berdi: 2 / 2' && (await ozg(u)) === '{"jon":"3"}')
await keyingi()
const karta = () => u.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | '))
await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 1 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · A: «✕ jon 3 — tugadi», «O‘yin tugadi»', (await karta()) === '✕ jon 3 — tugadi' && (await tugadi(u)), await karta())
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 2 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · B: «✕ jon −1», o‘yin tugamadi', (await karta()).endsWith('✕ jon −1') && (await ozg(u)) === '{"jon":"−1"}' && !(await tugadi(u)), await karta())
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 3 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · C: «✓ jon 0 — tugadi»', (await karta()).endsWith('✓ jon 0 — tugadi') && (await tugadi(u)), await karta())
await keyingi(); tek('4 · javob «Kamaytiramiz va tekshiramiz»: A, B xira; «jon: 0», «O‘yin tugadi»', (await id(u)) === 'P2C' && (await u.$$('#ust .jk.n-yoq')).length === 2 && (await ozg(u)) === '{"jon":"0"}' && (await tugadi(u)))
// ---------- 5–6
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(250) }
tek('5 · «Jon nima?» — uch bo‘lak yondi, «jon: 0», uch yurakcha xira, «O‘yin tugadi»', (await u.$$('#ust .xyl p.on')).length === 3 && (await u.evaluate(() => document.querySelector('#ust .jr .q3').classList.contains('on') && document.querySelector('#ust .jr-t').classList.contains('on'))) && (await u.$$('#ust .jr-y i.on')).length === 3 && (await id(u)) === 'P3')
await keyingi(); tek('6 · reja', (await id(u)) === 'P4')
// ---------- 7: ustoz jon qoidasi (javondan, ro'yxatdan)
await keyingi(); await kut(500)
tek('7 · P6: tayyor ▶ set jon 3; bolada «Ustoz jon qoidasini ko‘rsatyapti»', (await tuz(u)) === 'when_start:[z(jon 3)]' && (await matn(a, '#bol .qarang')).includes('Ustoz jon qoidasini'), await tuz(u))
await javT(u, 'e', '.mb[data-tur="q"]'); await menyu(u, 'q', 0, 'cactus'); await javT(u, 'o', '.mb[data-tur="c"]'); await menyu(u, 'c', 0, 'jon'); await menyu(u, 'c', 1, '−1')
await javT(u, 'a', '.mb[data-tur="i"]'); await menyu(u, 'i', 0, 'jon'); await javT(u, 'e', '.mb[data-tur="g"]')
tek('7 · javondan: kaktus → change jon −1, if jon = 0 { game over }', (await tuz(u)) === 'when_start:[z(jon 3)] when_touch:cactus[c(jon -1),i(jon 0){g}]', await tuz(u))
await boshla(u); await bos(u, '↑↑↑'); tek('7 · ↑↑↑ — «jon: 0», «O‘yin tugadi»', (await ozg(u)) === '{"jon":"0"}' && (await tugadi(u)))
// ---------- 8: jon (1–4)
await keyingi(); await ekrangacha(a, 'B1A'); await ekrangacha(l, 'B1A'); await kut(600)
tek('8 · Aziz B1A: tayyor bo‘lak, «jon: 0»', (await tuz(a)) === 'when_start:[z(jon 3)] when_touch:cactus[]' && (await ozg(a)) === '{"jon":"0"}', await tuz(a))
let r = await pog(a, 'B1A', [ST({ jon: 3 }), KAK([['c', 'jon:-1']])], '→→→→→'); tek('8 · shartsiz — Kamvoy «Jon tugadi-ku!»', (await muam(a)) === 'kamvoy:Jon tugadi-ku!', JSON.stringify(r)); await a.click('#bol .hn .asos'); await kut(300)
r = await pog(a, 'B1A', [ST({ jon: 3 }), KAK(JQR)], '→→→→', 'B1B'); tek('8 · Aziz 1-pog‘ona: «Shart ishladi: jon 0 — o‘yin tugadi!» → B1B', r.g === SG && r.o, JSON.stringify(r))
tek('8 · B1B o‘sha dastur bilan (if ichidagisi ham)', (await tuz(a)) === 'when_start:[z(jon 3)] when_touch:cactus[c(jon -1),i(jon 0){g}]', await tuz(a))
r = await pog(a, 'B1B', [ST({ jon: 4 }), KAK([['c', 'jon:-2'], ['i', 'jon:0', [['g']]]])], '↑→', 'B1C'); tek('8 · 2-pog‘ona: jon 4, −2 → B1C', r.o, JSON.stringify(r))
r = await pog(a, 'B1C', [ST({ jon: 2 }), KAK(JQR)], Y.B1C, 'B1Y'); tek('8 · 3-pog‘ona: yutdi → B1Y', r.o, JSON.stringify(r))
r = await pog(a, 'B1Y', [ST({ jon: 1 }), KAK(JQR)], Y.B1Y, 'BK'); tek('8 · ★: jon 1 bilan yutdi → BK', r.o, JSON.stringify(r))
r = await pog(l, 'B1A', [ST({ jon: 3 }), KAK(JQR)], '→→→→', 'B1B'); tek('8 · Lola 1-pog‘ona', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('8 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 9–10
await keyingi(); await keyingi(); await kut(500)
tek('10 · P7: jon qoidasi tayyor, olma va set ball yo‘q', (await tuz(u)) === 'when_start:[z(jon 3)] when_touch:cactus[c(jon -1),i(jon 0){g}]', await tuz(u))
await dastur(u, [ST({ jon: 3, ball: 0 }), KAK(JQR), OLM(1)]); await boshla(u); tek('10 · ikki kapsula: «ball: 0», «jon: 3»', (await ozg(u)) === '{"ball":"0","jon":"3"}', await ozg(u))
await bos(u, '→' + Y.P7); tek('10 · ataylab → — jon 2; teradi — ball 3, yutdi', (await ozg(u)) === '{"ball":"3","jon":"2"}' && (await hint(u)) === 'Siz yutdingiz!', await ozg(u))
// ---------- 11: ball va jon (5–8)
await keyingi(); await ekrangacha(a, 'B2A'); await ekrangacha(l, 'B2A'); await kut(500)
tek('11 · Aziz B2A: dastur 8-qadamdan (jon 1)', (await tuz(a)) === 'when_start:[z(jon 1)] when_touch:cactus[c(jon -1),i(jon 0){g}]', await tuz(a))
r = await pog(a, 'B2A', [ST({ ball: 0, jon: 3 }), OLM(1), KAK(JQR)], Y.B2A, 'B2B'); tek('11 · Aziz 1-pog‘ona: ball 3 → B2B', r.o && r.v === '{"ball":"3","jon":"3"}', JSON.stringify(r))
r = await pog(a, 'B2B', [ST({ ball: 0, jon: 1 }), OLM(1), [['q', 'gold'], [['c', 'jon:1']]], KAK(JQR)], Y.B2B, 'B2C'); tek('11 · 2-pog‘ona: oltin olma — jon 2 → B2C', r.o, JSON.stringify(r))
r = await pog(a, 'B2C', [ST({ ball: 0, jon: 3 }), OLM(1), KAK([['c', 'jon:-1'], ['c', 'ball:-2'], ['i', 'jon:0', [['g']]]])], Y.B2C, 'B2Y'); tek('11 · 3-pog‘ona: qimmat kaktus → B2Y', r.o, JSON.stringify(r))
r = await pog(a, 'B2Y', [ST({ ball: 0, jon: 1 }), OLM(2), KAK(JQR)], Y.B2Y, 'BK'); tek('11 · ★: ball 10 → BK', r.o, JSON.stringify(r))
r = await pog(l, 'B2A', null, Y.B2A); tek('11 · Lola: ball qismi yo‘q — Bo‘shvoy «Olma terildi, ball-chi?», yutsa ham ball 0', (await muam(l)) === 'kamvoy:Ball kam!' || /ball-chi/.test(await muam(l)), JSON.stringify(r))
r = await pog(l, 'B2A', [ST({ ball: 0, jon: 3 }), OLM(1), KAK(JQR)], Y.B2A, 'B2B'); tek('11 · Lola: ball 3 → B2B', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('11 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 12–14
await keyingi(); tek('12 · xulosa «Jon»', (await matn(u, '#ust .sar')) === 'Jon')
await keyingi(); await keyingi(); await kut(500)
tek('14 · P8: bo‘sh when ▶ clicked, yulduz ko‘rinadi', (await tuz(u)) === 'when_start:[]', await tuz(u))
await javT(u, 'o', '.mb[data-tur="z"]'); await menyu(u, 'z', 0, 'qadam'); await menyu(u, 'z', 1, '6')
await javT(u, 'e', '.mb[data-tugma="any"]'); await javT(u, 'o', '.mb[data-tur="c"]'); await menyu(u, 'c', 0, 'qadam'); await menyu(u, 'c', 1, '−1'); await javT(u, 'a', '.mb[data-tur="i"]'); await menyu(u, 'i', 0, 'qadam'); await javT(u, 'e', '.mb[data-tur="g"]')
tek('14 · javondan: ▶ set qadam 6; any → change qadam −1, if qadam = 0 { game over }', (await tuz(u)) === 'when_start:[z(qadam 6)] when_key:any[c(qadam -1),i(qadam 0){g}]', await tuz(u))
await boshla(u); await bos(u, '↑↑↓↓↑↑'); tek('14 · ↑↑↓↓↑↑ — «qadam: 0», «O‘yin tugadi»', (await ozg(u)) === '{"qadam":"0"}' && (await tugadi(u)))
await boshla(u); await bos(u, '→→→→'); tek('14 · →→→→ — yutdi, «qadam: 2»', (await ozg(u)) === '{"qadam":"2"}' && (await hint(u)) === 'Siz yutdingiz!')
// ---------- 15: qadam (9–12)
await keyingi(); await ekrangacha(a, 'B3A'); await ekrangacha(l, 'B3A'); await kut(500)
tek('15 · Aziz B3A: tayyor o‘yin (bolaning 2-bekat dasturi emas)', (await tuz(a)) === 'when_start:[z(ball 0),z(jon 3)] when_touch:apple[c(ball 1)] when_touch:cactus[c(jon -1),i(jon 0){g}]', await tuz(a))
const T3 = (q, j = 3) => [ST({ ball: 0, jon: j, qadam: q }), OLM(1), KAK(JQR), ANY(QQR)]
r = await pog(a, 'B3A', T3(5), '→→→→→', 'B3B'); tek('15 · Aziz 1-pog‘ona: «Shart ishladi: qadam 0 — o‘yin tugadi!» → B3B', r.g === 'Shart ishladi: qadam 0 — o‘yin tugadi!' && r.o, JSON.stringify(r))
r = await pog(a, 'B3B', null, Y.B3B, 'B3C'); tek('15 · 2-pog‘ona (dastur B3A dan, qadam 5 — yetmaydi)…', !r.o, JSON.stringify(r))
r = await pog(a, 'B3B', T3(12), Y.B3B, 'B3C'); tek('15 · … qadam 12 — ball 3, qadam 3 → B3C', r.o, JSON.stringify(r))
r = await pog(a, 'B3C', T3(16, 2), Y.B3C, 'B3Y'); tek('15 · 3-pog‘ona: jon 2, qadam 16 → B3Y', r.o, JSON.stringify(r))
r = await pog(a, 'B3Y', T3(25), Y.B3Y, 'BK'); tek('15 · ★: «O‘yiningiz tayyor!» → BK', r.g === 'O‘yiningiz tayyor!' && r.o, JSON.stringify(r))
r = await pog(l, 'B3A', T3(5), '→→→→→', 'B3B'); tek('15 · Lola 1-pog‘ona', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('15 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 16
await keyingi(); await kut(1200)
tek('16 · ustoz P11: faqat «Boshqaruv»', (await id(u)) === 'P11' && (await tuz(u)) === '')
tek('16 · Aziz: oxirgi yechgan pog‘onasi — B3Y o‘z dasturi bilan', (await id(a)) === 'B3Y' && (await tuz(a)).includes('when_key:any') && (await hint(a)) === 'Dasturingizni ustozga o‘qib bering', await id(a))
await dastur(u, T3(25)); await boshla(u); await bos(u, '→' + Y.B3Y); tek('16 · ustoz bola o‘qigan dastur bilan o‘ynadi (ataylab bir tegish) — jon 2', (await ozg(u)).includes('"jon":"2"') && (await hint(u)) === 'Siz yutdingiz!', await ozg(u))
// ---------- 17–18
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5'); await kut(700)
const son = (p, kk) => p.evaluate(({ r, kk }) => kk.map((k) => (document.querySelector(r + ' .sn-t[data-k="' + k + '"] b') || {}).textContent).join(','), { r: R(p), kk })
const BOLA = ['ta o‘yin yutdi', 'ta shart qo‘ydi', 'ta o‘zgaruvchi ishlatdi'], SINF = ['ta o‘yin yutdi', 'ta shart qo‘ydi']
// Aziz: yutish pog'onalari B1C, B1Y, B2A–B2Y, B3B, B3C, B3Y = 9; shart eng ko'pi 2; o'zgaruvchi 3. Lola: B2A — 1 yutish; shart 2 (B3A), o'zgaruvchi 3
tek('17 · Aziz: 9 ta o‘yin yutdi, 2 ta shart, 3 ta o‘zgaruvchi', (await son(a, BOLA)) === '9,2,3', await son(a, BOLA))
tek('17 · Lola: 1, 2, 3', (await son(l, BOLA)) === '1,2,3', await son(l, BOLA))
tek('17 · yakun: «O‘yiningizda jon bor!», keyingi dars «13 · Tasodifiy son»', (await matn(u, '#ust .sar')) === 'O‘yiningizda jon bor!' && (await matn(u, '#ust [data-z="keyingi dars"]')).includes('13 · Tasodifiy son'))
await keyingi(); await kut(1200)
tek('18 · Sinfimiz bugun: 10 ta o‘yin yutdi, 4 ta shart qo‘ydi', (await son(u, SINF)) === '10,4', await son(u, SINF))
await u.click('#ust .hn .asos'); await kut(2500)
tek('18 · «Darsni yakunlash» — hammada «Dars tugadi»', (await matn(u, '#ust .tugadi-k')).includes('Dars tugadi!') && (await hint(a)).includes('Ko‘rishguncha'))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

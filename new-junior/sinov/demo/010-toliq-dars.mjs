// 10-dars «Labirint o‘yini 2» — to'liq jonli dars sinovi (20.11). Manba: new-junior/manba/010-labirint-oyini-2.md (v1.1, tavsiya bo'yicha).
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali. 18 qadam: huk (avto o'yin, uch karta), javob, yangi so'z, ustoz labirint yasaydi
// (asbob va katak HAQIQIY sichqoncha bosishi), bolalar pog'onalarda o'z 2-darajasini yasaydi va o'zi o'ynab yutadi, darajalar, chek-list, doskalar sanog'i,
// «Do‘stingiz o‘ynaydi», natija sonlari (yasalgan labirintlardan hisoblangan), yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-010 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/010-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-010.html', X = 'd10-' + Date.now()
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
const tinch = (p) => gacha(p, (r) => !document.querySelector(r + ' .ekran')?.dataset.yuryapti, R(p), 30000)
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p) } await p.waitForTimeout(350) }
const boshla = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(400) }
const olchov = (p) => matn(p, R(p) + ' .olchov')
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
const m = (s) => s.replace(/·/g, '.').replace(/★/g, '*')
const LB = { D1: '##···#★|#K#·##·|#·#··E·|#·#·###|S···###', U1: '··#···★|·##·#·#|····#··|·##·##·|S······', U2: '··#··E★|·##·#·#|K···#··|·##·##·|S······',
  N1: '······★|·##·##·|·······|·#·##·#|S······', N2: '······★|····###|·······|######·|S······', N3: '#####·★|#···#·#|#·#·#·#|#·#···#|S·#####', NY: '·####·★|····#·#|#·#·#·#|#·#····|S··###·',
  NK1: '·####E★|····#·#|#K#·#·#|#·#····|S··###·', NK2: 'K####E★|····#·#|#·#·#·#|#·#····|S··###·', NKY: '·K···E★|·#·####|·#·····|######·|S······' }
// manba yechimlari (eng qisqa yo'l; labirint2.mjs mustaqil hisobda tekshirilgan)
const Y = { D1: '→↑↑↑↓↓↓→→↑↑→→→↑↑', U1: '→→→↑↑↑↑→→→', U2: '↑↑→→→↑↑→→→', N1: '→→→→→↑↑→↑↑', N2: '→→→→→→↑↑←←←↑↑→→→', N3: '→↑↑↑→→↓↓→→↑↑↑→', NY: '→↑↑↑→→↓↓→→↑↑↑→', NK1: '→↑↑↑→→↓↓→→↑↑↑→', NK2: '→↑↑↑←↑↓→→→↓↓→→↑↑↑→', NKY: '→→→→→→↑↑←←←←↑↑←→→→→→' }
const katak = async (p, x, y) => { const pt = await p.evaluate(([r, x, y]) => { const k = document.querySelector(r + ' .katak.maydon'), svg = k.querySelector('svg.kt'), H = katakXarita(k.dataset.xarita).length, pnt = svg.createSVGPoint(); pnt.x = x * KT + 50; pnt.y = (H - 1 - y) * KT + 50; const q = pnt.matrixTransform(svg.getScreenCTM()); return [q.x, q.y] }, [R(p), x, y]); await p.mouse.click(pt[0], pt[1]); await p.waitForTimeout(120) }
const asbob = async (p, a) => { await p.click(`${R(p)} .pl .asb[data-t="${a}"]`); await p.waitForTimeout(100) }
const yasa = async (p, nm) => {
  const maq = m(LB[nm]).split('|'), H = maq.length, hoz = () => p.evaluate((r) => document.querySelector(r + ' .katak').dataset.xarita.split('|'), R(p))
  let h = await hoz(); await asbob(p, 'devor')
  for (let q = 0; q < H; q++) for (let x = 0; x < 7; x++) if ((maq[q][x] === '#') !== (h[q][x] === '#')) await katak(p, x, H - 1 - q)
  for (const [as, ch] of [['kalit', 'K'], ['eshik', 'E']]) { h = await hoz(); const t = maq.join('').indexOf(ch); if (t >= 0) { if (h[Math.floor(t / 7)][t % 7] !== ch) { await asbob(p, as); await katak(p, t % 7, H - 1 - Math.floor(t / 7)) } } else { const e = h.join('').indexOf(ch); if (e >= 0) { await asbob(p, as); await katak(p, e % 7, H - 1 - Math.floor(e / 7)) } } }
  await asbob(p, 'devor')
}
// pog'ona: yasa → sinab ko'rish → yechim → keyingi ekran
const pog = async (p, e, nm, keyin) => { await ekrangacha(p, e); await kut(400); await yasa(p, nm); await boshla(p); await bos(p, Y[nm]); const g = await hint(p); return { g, o: await ekrangacha(p, keyin, 6000) } }

// ---------- 1
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await kut(1500)
tek('1 · Aziz: B0 — 9-darsdagi o‘yini yo‘q: «Tayyor o‘yin ochildi…»; Lola: avval BQ', (await id(a)) === 'B0' && (await a.$eval('#bol .ok-t', (e) => !e.hidden)) && (await id(l)) === 'BQ')
await l.locator('#bol .tq-o').nth(4).click(); await ekrangacha(l, 'B0')
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · ustoz: «Kirdi: 2»; «Bugun o‘yiningizni davom ettiramiz!»', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun o‘yiningizni davom ettiramiz!', await matn(u, '#ust .sar'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)

// ---------- 2–4
await keyingi(); await ekrangacha(a, 'P2N'); await ekrangacha(l, 'P2N')
await u.click('#ust .hn .so-t'); await kut(300); await tinch(u); await kut(300)
tek('2 · «O‘ynab ko‘rsat» — Coddy 1-darajani yutdi, «Daraja: 1 / 1»', (await u.$$('#ust .oyna .konfeti')).length > 0 && (await matn(u, '#ust .daraja-yz')) === 'Daraja: 1 / 1')
await a.locator('#bol .jk').nth(1).click(); await l.locator('#bol .jk').nth(2).click(); await kut(1200)
await gacha(u, () => /2 \/ 2/.test(document.querySelector('#ust .hn .hint')?.textContent)); tek('2 · «Javob berdi: 2 / 2»', (await hint(u)) === 'Javob berdi: 2 / 2')
await keyingi()
const karta = () => u.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | '))
await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 1 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · A: yangi o‘yin — Bo‘shvoy «Men nimani kutaman?», «✕ boshqaruv va qoida yo‘q»', (await karta()) === '✕ boshqaruv va qoida yo‘q' && (await muam(u)) === 'boshvoy:Men nimani kutaman?', await karta())
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 2 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 30000)
tek('3 · B: «✕ labirint baribir bitta», «Daraja: 1 / 1»', (await karta()).endsWith('✕ labirint baribir bitta') && (await matn(u, '#ust .daraja-yz')) === 'Daraja: 1 / 1', await karta())
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 3 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 60000)
tek('3 · C: D1, «2-daraja!», Z — «✓ ikki labirint, dastur o‘sha», «Daraja: 2 / 2»', (await karta()).endsWith('✓ ikki labirint, dastur o‘sha') && (await matn(u, '#ust .daraja-yz')) === 'Daraja: 2 / 2', await karta())
await keyingi(); tek('4 · javob «Dastur bitta, labirint ko‘p»: A, B xira; ikki labirint', (await id(u)) === 'P2C' && (await u.$$('#ust .jk.n-yoq')).length === 2 && (await u.$$('#ust .egiz.j2 .katak')).length === 2)

// ---------- 5–6
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(200) }
tek('5 · «Daraja nima?» — uch bo‘lak yondi, «Daraja: 2 / 2» ko‘rindi', (await u.$$('#ust .xyl .xq.on')).length === 3 && (await u.$$('#ust .daraja-yz.on')).length === 1 && (await id(u)) === 'P3')
await keyingi(); tek('6 · reja', (await id(u)) === 'P4')

// ---------- 7: ustoz labirint yasaydi
await keyingi(); await kut(500)
tek('7 · P6: asboblar, «Devor: 0 · Yo‘l: 10 qadam»; bolada «Ustoz labirint yasayapti»', (await u.$$('#ust .pl .asb')).length === 4 && (await olchov(u)) === 'Devor: 0 · Yo‘l: 10 qadam' && (await matn(a, '#bol .qarang')).includes('Ustoz labirint yasayapti'), await olchov(u))
await yasa(u, 'U1'); tek('7 · U1 yasaldi — «Devor: 10 · Yo‘l: 10 qadam»', (await olchov(u)) === 'Devor: 10 · Yo‘l: 10 qadam', await olchov(u))
await katak(u, 5, 4); tek('7 · (5, 4) — «Yo‘l yo‘q», Kamvoy «Yo‘l yo‘q!»', (await olchov(u)) === 'Devor: 11 · Yo‘l yo‘q' && (await muam(u)) === 'kamvoy:Yo‘l yo‘q!')
await katak(u, 5, 4); await boshla(u); await bos(u, Y.U1); tek('7 · devor olindi, «▶ Sinab ko‘rish» — «Siz yutdingiz!»', (await hint(u)) === 'Siz yutdingiz!', await hint(u))

// ---------- 8: o'z labirintingiz (1–4)
await keyingi(); await ekrangacha(a, 'B1A'); await ekrangacha(l, 'B1A'); await kut(600)
tek('8 · Aziz B1A: BOSH, «Devor: 0 / 6 · Yo‘l: 10 qadam», «Sinab ko‘rish»', (await olchov(a)) === 'Devor: 0 / 6 · Yo‘l: 10 qadam' && /Sinab ko‘rish/.test(await matn(a, '#bol .hn .asos')), await olchov(a))
await boshla(a); await bos(a, '→→→→→→↑↑↑↑'); tek('8 · devorsiz yutdi — Kamvoy «Oz qoldi!», «Devor: 0 ta. Kerak: kamida 6»', (await muam(a)) === 'kamvoy:Oz qoldi!' && (await hint(a)) === 'Devor: 0 ta. Kerak: kamida 6', await hint(a))
await a.click('#bol .hn .mas'); await kut(300); tek('8 · «Maslahat» — manbadagi gap', (await hint(a)) === 'Devorlar yo‘lni to‘smasin: yulduzga yo‘l qolsin')
let r = await pog(a, 'B1A', 'N1', 'B1B'); tek('8 · Aziz 1-pog‘ona: 8 devor, o‘zi yutdi — «Labirint tayyor!» → B1B', r.g === 'Labirint tayyor!' && r.o, r.g)
tek('8 · B1B o‘sha labirint bilan, «Yo‘l: 10 / 14 qadam»', (await olchov(a)) === 'Yo‘l: 10 / 14 qadam', await olchov(a))
r = await pog(a, 'B1B', 'N2', 'B1C'); tek('8 · 2-pog‘ona: yo‘l 16 → B1C', r.o, r.g)
r = await pog(a, 'B1C', 'N3', 'B1Y'); tek('8 · 3-pog‘ona: burilish 6 → B1Y', r.o, r.g)
r = await pog(a, 'B1Y', 'NY', 'BK'); tek('8 · ★: boshi berk 3 → BK', r.o, r.g)
r = await pog(l, 'B1A', 'N1', 'B1B'); tek('8 · Lola 1-pog‘ona', r.o, r.g)
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('8 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())

// ---------- 9–10: ustoz kalit va eshik
await keyingi(); await keyingi(); await kut(500)
await asbob(u, 'eshik'); await katak(u, 3, 4); tek('10 · eshik (3, 4) — Ortiqvoy «Eshik keraksiz!»', (await muam(u)) === 'ortiqvoy:Eshik keraksiz!')
await katak(u, 5, 4); tek('10 · eshik (5, 4) — Kamvoy «Kalit qani?»', (await muam(u)) === 'kamvoy:Kalit qani?')
await asbob(u, 'kalit'); await katak(u, 0, 2); tek('10 · kalit (0, 2) — «Kalit ✓ · Eshik ✓ · Yo‘l: 10 qadam»', (await olchov(u)) === 'Kalit ✓ · Eshik ✓ · Yo‘l: 10 qadam', await olchov(u))
await boshla(u); await bos(u, Y.U2); tek('10 · «Sinab ko‘rish» — kalit, eshik, yutdi', (await hint(u)) === 'Siz yutdingiz!')

// ---------- 11: kalit va eshik (5–7)
await keyingi(); await ekrangacha(a, 'B2A'); await kut(500)
tek('11 · Aziz B2A — labirint 8-qadamdan (NY), «Kalit — · Eshik —»', (await olchov(a)) === 'Kalit — · Eshik —', await olchov(a))
r = await pog(a, 'B2A', 'NK1', 'B2B'); tek('11 · Aziz 1-pog‘ona: eshik to‘sadi, kalitga yo‘l → B2B', r.o, r.g)
r = await pog(a, 'B2B', 'NK2', 'B2Y'); tek('11 · 2-pog‘ona: kalit chetda → B2Y', r.o, r.g)
r = await pog(a, 'B2Y', 'NKY', 'BK'); tek('11 · ★: yo‘l 20 → BK', r.o, r.g)
r = await pog(l, 'B2A', 'NK1', 'B2B'); tek('11 · Lola 1-pog‘ona (N1 dan NK1)', r.o, r.g)
await gacha(u, () => /1\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')) && document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('11 · doska: «1 / 2»; zinapoya 2 · 1 · 1', (await pogSon()) === '1/2 2 1 1', await pogSon())

// ---------- 12–14
await keyingi(); tek('12 · xulosa «Daraja»', (await matn(u, '#ust .sar')) === 'Daraja')
await keyingi(); await keyingi(); await kut(500)
await boshla(u); await bos(u, Y.D1); await kut(1800); tek('14 · 1-daraja yutildi — U2, «Daraja: 2 / 2»', (await matn(u, '#ust .daraja-yz')) === 'Daraja: 2 / 2')
await bos(u, Y.U2); tek('14 · 2-daraja ham — «Siz yutdingiz!», «Ikki daraja yutildi» ✓', (await hint(u)) === 'Siz yutdingiz!' && (await u.$$('#ust .pl .chek .ch-ikki.ok')).length === 1)

// ---------- 15: ikki daraja (8–9)
await keyingi(); await ekrangacha(a, 'B3A'); await kut(600)
tek('15 · Aziz B3A: ro‘yxat — 4 band, «Ikki daraja» hali bo‘sh', (await a.$$('#bol .pl .chek .ch-r.ok')).length === 3, String((await a.$$('#bol .pl .chek .ch-r.ok')).length))
await boshla(a); await bos(a, Y.D1); await kut(1800); await bos(a, Y.NKY); r = { g: await hint(a), o: await ekrangacha(a, 'B3Y', 6000) }
tek('15 · Aziz: D1 → o‘z labirinti (NKY) — «O‘yiningiz tayyor!» → B3Y', r.g === 'O‘yiningiz tayyor!' && r.o, r.g)
await boshla(a); await bos(a, Y.D1); await kut(1800); await bos(a, Y.NKY); r = { g: await hint(a), o: await ekrangacha(a, 'BK', 6000) }
tek('15 · ★ adashmasdan → BK', r.o, r.g)
await ekrangacha(l, 'B3A'); await kut(500); await boshla(l); await bos(l, Y.D1); await kut(1800); await bos(l, Y.NK1); r = { o: await ekrangacha(l, 'B3Y', 6000) }
tek('15 · Lola: D1 → NK1 → B3Y', r.o)
await gacha(u, () => /2\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')))
tek('15 · doska: «Ikki darajani yutdi 2 / 2»; zinapoya 2 · 1', (await pogSon()) === '2/2 2 1', await pogSon())

// ---------- 16: do'st o'ynaydi
await keyingi(); await ekrangacha(a, 'BD'); await ekrangacha(l, 'BD'); await kut(500)
tek('16 · bolalarda «▶ Do‘stingiz o‘ynaydi», dastur yo‘q', (await matn(a, '#bol .hn .so-t')) === '▶ Do‘stingiz o‘ynaydi' && !(await a.$('#bol .jr-bl')))
await a.click('#bol .hn .so-t'); await kut(400); await bos(a, '↑' + Y.D1); await kut(1800); await bos(a, Y.NKY)
const dn = (p) => p.evaluate(() => { const d = document.querySelector('#bol .dost-n'); return d && !d.hidden ? d.querySelector('b').textContent : '' })
tek('16 · Aziz o‘yinini do‘st o‘ynadi — «Do‘stingiz o‘ynadi: 2 / 2 daraja · 1 marta devor oldida to‘xtadi»', (await dn(a)) === 'Do‘stingiz o‘ynadi: 2 / 2 daraja · 1 marta devor oldida to‘xtadi', await dn(a))
await l.click('#bol .hn .so-t'); await kut(400); await bos(l, Y.D1); await kut(1800); await bos(l, '→')
await l.click('#bol .hn .so-t'); await kut(300)
tek('16 · Lola o‘yinini do‘st 1-darajada to‘xtatdi — «1 / 2 daraja · 0 marta»', (await dn(l)) === 'Do‘stingiz o‘ynadi: 1 / 2 daraja · 0 marta devor oldida to‘xtadi', await dn(l))
await gacha(u, () => /2\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')))
tek('16 · doska «O‘ynab ko‘rildi: 2 / 2» (sinfda 2 bola)', (await matn(u, '#ust .tugatdi b')).replace(/\s/g, '') === '2/2', await matn(u, '#ust .tugatdi b'))

// ---------- 17–18
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5'); await kut(700)
const son = (p, kk) => p.evaluate(({ r, kk }) => kk.map((k) => (document.querySelector(r + ' .sn-t[data-k="' + k + '"] b') || {}).textContent).join(','), { r: R(p), kk })
const BOLA = ['ta devor qo‘ydi', 'qadam — labirintingiz yo‘li', 'daraja yutdi'], SINF = ['ta labirint yasaldi', 'ta o‘yinni do‘st o‘ynadi', 'daraja yutildi']
// Aziz: oxirgi labirinti NKY — 12 devor, 20 qadam; darajalar 2 (B3A) + 2 (B3Y) = 4. Lola: NK1 — 15 devor, 14 qadam; 2 daraja
tek('17 · Aziz: 12 ta devor, 20 qadam, 4 daraja', (await son(a, BOLA)) === '12,20,4', await son(a, BOLA))
tek('17 · Lola: 15, 14, 2', (await son(l, BOLA)) === '15,14,2', await son(l, BOLA))
tek('17 · Aziz: ro‘yxat besh band ✓, «O‘yiningiz saqlandi»', (await a.$$('#bol .chek-y .ch-r.ok')).length === 5 && !(await a.$eval('#bol .saqlandi', (e) => e.hidden)))
tek('17 · yakun: «Siz ikki darajali o‘yin yasadingiz!», keyingi dars «11 · O‘zgaruvchi: ball»', (await matn(u, '#ust .sar')) === 'Siz ikki darajali o‘yin yasadingiz!' && (await matn(u, '#ust [data-z="keyingi dars"]')).includes('11 · O‘zgaruvchi: ball'))
await keyingi(); await kut(1200)
tek('18 · Sinfimiz bugun: 2 labirint yasaldi, 2 o‘yinni do‘st o‘ynadi, 6 daraja', (await son(u, SINF)) === '2,2,6', await son(u, SINF))
await u.click('#ust .hn .asos'); await kut(2500)
tek('18 · «Darsni yakunlash» — hammada «Dars tugadi»', (await matn(u, '#ust .tugadi-k')).includes('Dars tugadi!') && (await hint(a)).includes('Ko‘rishguncha'))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

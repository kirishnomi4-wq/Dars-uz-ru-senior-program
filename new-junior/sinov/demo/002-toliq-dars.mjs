// 2-dars «Labirint» — to'liq jonli dars sinovi (dvigatel 5b-3, 19.11). Manba: new-junior/manba/002-ketma-ketlik.md (v1.2).
// Ustoz va ikki o'quvchi — alohida brauzer oynalari (alohida saqlov), lokal sinf serveri orqali (/__sinf), alohida xona.
//   «Aziz» — 1-darsdan qahramoni bor (jele, kurs bo'yi saqlanadi, 94-qaror); «Lola» — yangi bola: ism yozib kiradi va qahramon tanlaydi (BQ).
// 18 qadamning hammasi: huk (uch sinov), raqamlar, ustoz namoyishlari (yo'l tuzish, xato — blok joyini almashtirish, kalit), uch zinapoya
// (Aziz 11 labirintning hammasini yechadi — 2-bekatda bloklar joyini bosib almashtiradi; Lola ikkitasini), doskalar sanog'i, «Yordam so'radi»,
// sahifa yangilansa davom, 16-qadamda bola ekrani o'zgarmaydi, bolaning va sinfning natijasi (sonlar manbadagi yechimlardan hisoblangan), yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-002 yig'ilgan): node new-junior/sinov/demo/002-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-002.html', X = 'd2-' + Date.now()
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
const ot = async (i) => { await u.selectOption('select[data-a=sakra]', String(i)); await kut(900) }
const keyingi = async () => { await u.click('#ust .hn .asos'); await kut(500) }
const BLOK = { r: 'move right', l: 'move left', u: 'move up', d: 'move down' }
const R = (p) => (p === u ? '#ust' : '#bol')
const qosh = async (p, dastur) => { for (const t of dastur) { await p.locator(R(p) + ' .pl .mbw:not(.yopiq) .mb', { hasText: BLOK[t] }).first().click(); await p.waitForTimeout(90) } }
const dastur = (p) => p.evaluate((r) => blBloklar(document.querySelector(r + ' .ekran')).map(blokTuri).join(''), R(p))
// ishga tushirish va tugashini kutish (bolada asosiy tugma — «Ishga tushir», ustozda — ikkinchi darajali «▶ Ishga tushir»)
const ishga = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(250); await gacha(p, (r) => { const e = document.querySelector(r + ' .ekran'); return e && !e.dataset.yuryapti }, R(p), 20000); await p.waitForTimeout(150) }
const hint = (p) => matn(p, R(p) + ' .hn .hint')
const muam = (p) => p.evaluate((r) => { const m = document.querySelector(r + ' .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' }, R(p))
// dasturdagi n-blokni bosish (0 dan) — tanlash yoki joy almashtirish (95-qaror); blok o'z qatoridan bosiladi
const bos = async (p, n) => { await p.locator(R(p) + ' .jr-bl .mb').nth(n).click({ position: { x: 18, y: 14 } }); await p.waitForTimeout(350) }
const almashtir = async (p, i, j) => { await bos(p, i); await bos(p, j) }
const urilgan = (p) => p.evaluate((r) => blBloklar(document.querySelector(r + ' .ekran')).findIndex((x) => x.classList.contains('urildi')) + 1, R(p))
// pog'onani yechish: dastur → ishga → «yetdi» gapi → keyingi ekran
const yech = async (p, e, prog, keyin) => { await ekrangacha(p, e); if (prog) await qosh(p, prog); await ishga(p); const g = await hint(p); const o = keyin ? await ekrangacha(p, keyin, 5000) : true; return { g, o } }

// ---------- kirish
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await kut(1500)
tek('1 · Aziz: B0, qahramoni 1-darsdan (tanlash yo‘q)', (await id(a)) === 'B0')
tek('1 · Lola (qahramoni yo‘q): avval BQ', (await id(l)) === 'BQ')
await l.locator('#bol .tq-o').nth(4).click(); await ekrangacha(l, 'B0')
tek('1 · Lola qahramon tanladi → B0', (await id(l)) === 'B0')
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · ustoz: «Kirdi: 2» (haqiqiy)', (await hint(u)) === 'Kirdi: 2', await hint(u))
tek('1 · sarlavha va «O‘tgan darsda»', (await matn(u, '#ust .sar')) === 'Bugun labirintdan chiqamiz!' && (await matn(u, '#ust .otd')).includes('Ketma-ket buyruqlar'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
tek('1 · «Tayyorman» → «Ustoz ekraniga qarang»', (await id(a)) === 'BK' && (await id(l)) === 'BK')

// ---------- 2–4: huk
await keyingi(); await ekrangacha(a, 'P2N'); await ekrangacha(l, 'P2N')
tek('2 · bolalarda dastur kartalari', (await id(a)) === 'P2N' && (await a.$$('#bol .jk .mb')).length === 18)
await a.locator('#bol .jk').nth(0).click(); await l.locator('#bol .jk').nth(2).click(); await kut(1200)
tek('2 · javob → «Javobingiz qabul qilindi»', (await matn(a, '#bol .qarang')).includes('Javobingiz qabul qilindi'))
await gacha(u, () => /2 \/ 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('2 · ustoz: «Javob berdi: 2 / 2», A da 1, B yashirin, C da 1', (await hint(u)) === 'Javob berdi: 2 / 2' && (await matn(u, '#ust .jk.c1 .jr-s')) === '1' && (await matn(u, '#ust .jk.c3 .jr-s')) === '1' && await u.$eval('#ust .jk.c2 .jr-s', (e) => e.style.visibility) === 'hidden')
await keyingi()
const karta = (i) => u.evaluate((i) => { const k = document.querySelectorAll('#ust .jk')[i], jn = k.querySelector('.jn'); return (jn ? jn.textContent : '') + '|' + (Array.from(k.querySelectorAll('.mb')).findIndex((x) => x.classList.contains('urildi')) + 1) }, i)
await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 1)
tek('3 · A o‘zi sinaldi: «✕ devorga urildi», 3-blokda', (await karta(0)) === '✕ devorga urildi|3', await karta(0))
tek('3 · bolalarda «Ustoz dasturlarni sinayapti — kuzating»', (await matn(a, '#bol .qarang')).includes('Ustoz dasturlarni sinayapti'))
tek('3 · tugma «Keyingi ›» (sinov paytida bosilsa — e’tiborsiz)', (await matn(u, '#ust .hn .asos')) === 'Keyingi ›')
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 2)
tek('3 · B: 1-blokda urildi', (await karta(1)) === '✕ devorga urildi|1', await karta(1))
await keyingi(); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 3)
tek('3 · C: «✓ chiqdi», konfeti', (await karta(2)) === '✓ chiqdi|0' && (await u.$$('#ust .konfeti')).length > 0, await karta(2))
await keyingi()
tek('4 · Javob: A, B xira, C oltin; sarlavha «Bloklar bir xil, tartib boshqa»', (await id(u)) === 'P2C' && (await u.$$('#ust .jk.n-yoq')).length === 2 && (await u.$$('#ust .jk.n-ok')).length === 1 && (await matn(u, '#ust .sar')) === 'Bloklar bir xil, tartib boshqa')

// ---------- 5: yangi so'z — raqamlar birma-bir
await keyingi()
const yondi = () => u.evaluate(() => [document.querySelectorAll('#ust .dk-q.on').length, document.querySelectorAll('#ust .kt-rq.on').length].join(','))
tek('5 · «Ketma-ketlik nima?», raqamlar o‘chiq; bolada «Yangi so‘z: ketma-ketlik»', (await matn(u, '#ust .sar')) === 'Ketma-ketlik nima?' && (await yondi()) === '0,0' && (await matn(a, '#bol .qarang')).includes('Yangi so‘z: ketma-ketlik'))
await u.click('#ust .hn .asos'); await kut(150)
tek('5 · 1-bosish: 1-blok va 1-katak birga', (await yondi()) === '1,1' && await u.$eval('#ust .dk-q[data-r="1"]', (e) => e.classList.contains('on')) && await u.$eval('#ust .kt-rq[data-r="1"]', (e) => e.classList.contains('on')))
for (let k = 2; k <= 6; k++) { await u.click('#ust .hn .asos'); await kut(120) }
tek('5 · 6 bosish: hammasi yondi, qadam o‘sha', (await yondi()) === '6,6' && (await id(u)) === 'P3')
await keyingi(); tek('5 · 7-bosish → 6-qadam (reja)', (await id(u)) === 'P4' && (await matn(u, '#ust .hn .asos')) === 'Boshladik ›')

// ---------- 7: ustoz yo'l tuzadi
await keyingi()
tek('7 · P6: dastur bo‘sh, javonda to‘rt blok; bolada «Ustoz yo‘l tuzyapti»', (await dastur(u)) === '' && (await u.$$('#ust .pl .mbw:not(.yopiq) .mb')).length === 4 && (await matn(a, '#bol .qarang')).includes('Ustoz yo‘l tuzyapti'))
await qosh(u, 'rurr'); await ishga(u)
tek('7 · → ↑ → → — Coddy yulduzda, konfeti', (await hint(u)) === 'Yetib bordi!' && (await u.$$('#ust .konfeti')).length > 0)

// ---------- 8: pog'onalar (1–4)
await keyingi()
tek('8 · Aziz B2, Lola B2 (o‘z qahramoni labirintda)', (await ekrangacha(a, 'B2')) && (await ekrangacha(l, 'B2')) && (await a.$$('#bol .kt-q svg')).length === 1)
await qosh(a, 'rrr'); await ishga(a)
tek('8 · Aziz: xato yo‘l — To‘siqvoy «Devor!», 1-blok sariq', (await muam(a)) === 'tosiqvoy:Devor!' && (await urilgan(a)) === 1 && (await hint(a)) === 'Qahramon shu blokda to‘xtadi. Bu yerda qaysi tomonga yurish kerak?', (await muam(a)) + ' ' + (await urilgan(a)))
await a.click('#bol .hn .mas'); await kut(300)
tek('8 · «Maslahat» — manbadagi gap', (await hint(a)) === 'Qahramondan yulduzgacha yo‘lni barmog‘ingiz bilan yuring: qayerda buriladi?')
await gacha(u, () => /Yordam so‘radi: 1/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('8 · ustoz: «Yordam so‘radi: 1»', (await hint(u)).startsWith('Yordam so‘radi: 1'), await hint(u))
await a.evaluate(() => { const ek = document.querySelector('#bol .ekran'); BL_WS.get(ek).clear(); sanoq(ek) })
let r = await yech(a, 'B2', 'uurrr', 'B2B'); tek('8 · Aziz 1-pog‘ona: «Yetib bordi!» → B2B', r.g === 'Yetib bordi!' && r.o, r.g)
r = await yech(a, 'B2B', 'rddrr', 'B2C'); tek('8 · 2-pog‘ona (move down) → B2C', r.g === 'Yetib bordi!' && r.o)
r = await yech(a, 'B2C', 'rurrur', 'B2Y'); tek('8 · 3-pog‘ona → B2Y', r.g === 'Yetib bordi!' && r.o)
r = await yech(a, 'B2Y', 'ruurrrur', 'BK'); tek('8 · ★ → BK «Hamma pog‘onalarni bajardingiz!»', r.g === 'Yetib bordi!' && r.o && (await matn(a, '#bol .qarang')).includes('Hamma pog‘onalarni bajardingiz!'))
r = await yech(l, 'B2', 'uurrr', 'B2B'); tek('8 · Lola 1-pog‘ona', r.o)
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('8 · doska: «Uch pog‘onani tugatdi 1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())

// ---------- 9–10: 2-bekat, ustoz xatoni topadi
await keyingi(); tek('9 · reja: 1-bekat ✓, «2 · Xatoni topamiz»', (await id(u)) === 'P4B' && (await u.$$('#ust .tp-st.otdi')).length === 1)
await keyingi()
tek('10 · P7: tayyor dastur → → ↑ → ↑ →', (await dastur(u)) === 'rrurur')
await ishga(u)
tek('10 · 4-blokda urildi: To‘siqvoy, 4-blok sariq', (await muam(u)) === 'tosiqvoy:Devor!' && (await urilgan(u)) === 4)
await almashtir(u, 3, 4)
tek('10 · 4- va 5-blok joyi almashdi (bosib tanlash) — → → ↑ ↑ → →, sariq belgi ketdi', (await dastur(u)) === 'rruurr' && (await urilgan(u)) === 0, await dastur(u))
await ishga(u); tek('10 · qayta ishga tushirildi — yulduzda', (await hint(u)) === 'Yetib bordi!')

// ---------- 11: xatoni tuzating (5–8)
await keyingi()
tek('11 · Aziz B3A — tayyor xatoli dastur ↑ → ↑ → →', (await ekrangacha(a, 'B3A')) && (await dastur(a)) === 'ururr')
await ishga(a); tek('11 · B3A: 2-blokda urildi', (await urilgan(a)) === 2)
await almashtir(a, 1, 2); r = await yech(a, 'B3A', '', 'B3B'); tek('11 · 2- va 3-blok almashdi → «Xatoni tuzatdingiz!» → B3B', r.g === 'Xatoni tuzatdingiz!' && r.o, r.g)
await ishga(a); tek('11 · B3B: 3-blokda urildi', (await urilgan(a)) === 3)
await almashtir(a, 2, 3); r = await yech(a, 'B3B', '', 'B3C'); tek('11 · B3B tuzatildi → B3C', r.g === 'Xatoni tuzatdingiz!' && r.o)
await ishga(a); tek('11 · B3C: 1-blokda urildi', (await urilgan(a)) === 1)
await almashtir(a, 0, 1); r = await yech(a, 'B3C', '', 'B3Y'); tek('11 · B3C tuzatildi → B3Y', r.g === 'Xatoni tuzatdingiz!' && r.o)
await ishga(a); tek('11 · B3Y: 1-blokda urildi', (await urilgan(a)) === 1)
await almashtir(a, 0, 1); await ishga(a); tek('11 · birinchi xato tuzatilgach — 6-blokda urildi (manba)', (await urilgan(a)) === 6)
await almashtir(a, 5, 6); r = await yech(a, 'B3Y', '', 'BK'); tek('11 · ikkinchi xato ham — B3Y tuzatildi → BK', r.g === 'Xatoni tuzatdingiz!' && r.o)
await gacha(u, () => /1\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')))
tek('11 · doska: «Uch xatoni tuzatdi 1 / 2»; zinapoya 1 · 1 · 1 · 1', (await pogSon()) === '1/2 1 1 1 1', await pogSon())

// ---------- 12–14: xulosa, 3-bekat, kalit
await keyingi(); tek('12 · xulosa «Ketma-ketlik»', (await matn(u, '#ust .sar')) === 'Ketma-ketlik')
await keyingi(); tek('13 · reja: 1, 2 ✓', (await u.$$('#ust .tp-st.otdi')).length === 2)
await keyingi()
await qosh(u, 'urrr'); await ishga(u)
tek('14 · kalitsiz: eshik yopiq — Kamvoy «Kalit qani?», 3-blok', (await muam(u)) === 'kamvoy:Kalit qani?' && (await urilgan(u)) === 3 && (await hint(u)) === 'Eshik yopiq. Avval kalitni oling')
await almashtir(u, 0, 1); await ishga(u)
tek('14 · → ↑ → → — kalit olindi, eshik ochildi, yulduzda', (await dastur(u)) === 'rurr' && (await hint(u)) === 'Yetib bordi!' && await u.$eval('#ust .katak', (e) => e.classList.contains('kalitli')) && (await u.$$('#ust .kt-eshik.ochiq')).length === 1)

// ---------- 15: labirintdan chiqamiz (9–11)
await keyingi()
r = await yech(a, 'B4A', 'rluurrrr', 'B4B'); tek('15 · Aziz K1 → «Labirintdan chiqdingiz!» → B4B', r.g === 'Labirintdan chiqdingiz!' && r.o, r.g)
r = await yech(a, 'B4B', 'dduurrrr', 'B4Y'); tek('15 · K2 (kalit pastda) → B4Y', r.o)
await ekrangacha(a, 'B4Y'); await qosh(a, 'rrlluurrrr'); await qosh(a, 'r')
tek('15 · ★: 10 ta blok — dastur to‘ldi, 11-chisi qo‘shilmaydi', (await dastur(a)).length === 10 && (await hint(a)).startsWith('Dastur to‘ldi'))
r = await yech(a, 'B4Y', '', 'BK'); tek('15 · ★ K3 yechildi → BK', r.o)
await ekrangacha(l, 'B2B'); await l.reload(); await kut(1500)
tek('15 · Lola sahifani yangiladi — 15-qadam ekraniga qaytdi (B4A)', await ekrangacha(l, 'B4A'))
r = await yech(l, 'B4A', 'rluurrrr', 'B4B'); tek('15 · Lola K1 yechdi', r.o)
await gacha(u, () => /2\/2/.test(document.querySelector('#ust .tugatdi b')?.textContent.replace(/\s/g, '')))
tek('15 · doska: «Labirintdan chiqdi 2 / 2»; zinapoya 2 · 1 · 1', (await pogSon()) === '2/2 2 1 1', await pogSon())

// ---------- 16: o'qib berish — bola ekrani o'zgarmaydi
await qosh(l, 'rl')
await keyingi(); await kut(2500)
// A·1 (U-1): Lola oxirgi yechgan labirinti — B4A, o'z dasturi bilan
await ekrangacha(l, 'B4A')
tek('16 · ustoz P11; Lola — oxirgi yechgan B4A, o‘z dasturi bilan; «Dasturingizni ustozga o‘qib bering»', (await id(u)) === 'P11' && (await id(l)) === 'B4A' && (await dastur(l)) === 'rluurrrr' && (await hint(l)) === 'Dasturingizni ustozga o‘qib bering', (await id(l)) + ' ' + (await dastur(l)) + ' ' + (await hint(l)))
await qosh(u, 'rluurrrr'); await ishga(u); tek('16 · ustoz o‘qilgan dasturni bosdi — Coddy chiqdi', (await hint(u)) === 'Yetib bordi!')

// ---------- 17–18: natija
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5')
const son = (p) => p.evaluate((r) => ['qadam', 'tuzatilgan xato', 'labirint'].map((k) => document.querySelector(r + ' .sn-t[data-k="' + k + '"] b').textContent).join(','), R(p))
// Aziz: 1-bekat 5+5+6+8, 2-bekat 5+5+6+8, 3-bekat 8+8+10 = 74 qadam; 4 tuzatilgan xato; 11 labirint. Lola: 5 + 8 = 13 qadam; 0; 2
tek('17 · Aziz natijasi: 74 qadam, 4 tuzatilgan xato, 11 labirint', (await son(a)) === '74,4,11', await son(a))
tek('17 · Lola natijasi: 13 qadam, 0, 2 labirint', (await son(l)) === '13,0,2', await son(l))
tek('17 · yakun: «Labirintdan chiqdingiz!», keyingi dars «3 · X va Y»', (await matn(u, '#ust .sar')) === 'Labirintdan chiqdingiz!' && (await matn(u, '#ust [data-z="keyingi dars"]')).includes('3 · X va Y'))
await keyingi(); await kut(1200)
tek('18 · Sinfimiz bugun: 87 qadam, 4, 13 labirint (ikki bola yig‘indisi)', (await son(u)) === '87,4,13', await son(u))
await u.click('#ust .hn .asos'); await kut(2500)
tek('18 · «Darsni yakunlash» — ustozda «Dars tugadi!», bolalarda «Dars tugadi. Ko‘rishguncha!»', (await matn(u, '#ust .tugadi-k')).includes('Dars tugadi!') && (await hint(a)).includes('Ko‘rishguncha') && (await hint(l)).includes('Ko‘rishguncha'))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

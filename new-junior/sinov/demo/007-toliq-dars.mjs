// 7-dars «Kostyum, animatsiya va tovush» — to'liq jonli dars sinovi (20.11). Manba: new-junior/manba/007-kostyum-tovush.md (v1, filtr qarorlari bilan).
// Ustoz va ikki o'quvchi, lokal sinf serveri. Aziz — qahramoni oldingi darslardan; Lola — yangi (BQ).
// 18 qadam: huk (A — bir kostyum, B — silkinish, C — almashish), yangi so'z «animatsiya», kostyum bloki javondan va ro'yxatdan, kostyum belgisi,
// animatsiya hisobi va «har qadamda», ikki rejim (3-bekat — o'yin), tovush, yulduzda space, «ikki xil», 16-qadam (A·1), natija sonlari, yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-007 yig'ilgan): node new-junior/sinov/demo/007-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-007.html', X = 'd7-' + Date.now()
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
const BLOK = { r: 'move right', l: 'move left', u: 'move up', d: 'move down' }
const oila = async (p, f) => { await p.click(R(p) + ' .rg .rd.f-' + f); await p.waitForTimeout(100) }
const menyu = async (p, n, v) => { await p.locator(R(p) + ' .jr-bl .mb').nth(n).locator('.blocklyDropdownField').first().click(); await p.waitForTimeout(150); await p.locator('.blocklyDropDownDiv .blocklyMenuItem').filter({ hasText: new RegExp('^\\s*' + v + '\\s*$') }).first().click(); await p.waitForTimeout(150) }
// javon orqali: repeat N (tanlanadi) → ichiga bloklar → repeat ni yana bosib tanlovni bekor qilish
const takror = async (p, n, ichki) => {
  const k = (await p.$$(R(p) + ' .jr-bl .mb')).length
  await oila(p, 'b'); await p.locator(R(p) + ' .pl .mbw:not(.yopiq) .mb', { hasText: 'repeat' }).first().click(); await p.waitForTimeout(200)
  await menyu(p, k, n); await oila(p, 'h')
  for (const t of ichki) { await p.locator(R(p) + ' .pl .mbw:not(.yopiq) .mb', { hasText: BLOK[t] }).first().click(); await p.waitForTimeout(120) }
  await p.locator(R(p) + ' .jr-bl .mb').nth(k).click({ position: { x: 14, y: 12 } }); await p.waitForTimeout(250)
}
// tez yo'l (dvigatel funksiyasi bilan — javon yo'li takror() va takror.mjs da sinalgan): 'p5[r] p3[u]'
const KOSQ = { xo: 'xotirjam', xu: 'xursand', ha: 'hayron', oy: 'oylanadi' }
const tokn = (t) => (t[0] === 'c' ? { t: 'v', m: KOSQ[t.slice(1)] } : { t })
const qur = (p, s) => p.evaluate(({ r, d }) => { const ek = document.querySelector(r + ' .ekran'); blQur(ek, d); sanoq(ek) }, { r: R(p), d: [...s.matchAll(/p(\d+)\(([^)]*)\)|c(?:xo|xu|ha|oy)|[rlud]/g)].map((m) => (m[1] ? { t: 'p', m: m[1], ichki: m[2].split(',').filter(Boolean).map(tokn) } : tokn(m[0]))) })
const tuz = (p, ds) => p.evaluate(({ r, ds }) => { const ek = document.querySelector(r + ' .ekran'); blYukla(ek, ds.flatMap(([k, ...b]) => [{ t: 'k', m: k }, ...b.map((x) => (x.includes(':') ? { t: x[0], m: x.slice(2) } : { t: x }))])); sanoq(ek) }, { r: R(p), ds })
const KEY = { '→': 'ArrowRight', '↑': 'ArrowUp', _: ' ' }
const boshla = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(350) }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await gacha(p, (r) => !document.querySelector(r + ' .ekran')?.dataset.yuryapti, R(p), 8000); await p.waitForTimeout(50) } await p.waitForTimeout(350) }
// o'yin hali yursa (masalan «Tovush qani?» dan keyin) — bola avval ■ To'xtatadi, dasturni tuzatadi, keyin ▶ Boshlaydi
const oyna7 = async (p, e, ds, keys, keyin) => { await ekrangacha(p, e); if (await p.evaluate((r) => !!document.querySelector(r + ' .ekran').dataset.oyin, R(p))) await boshla(p); await tuz(p, ds); await boshla(p); await bos(p, keys); const g = await hint(p); return { g, o: keyin ? await ekrangacha(p, keyin, 5000) : true } }
const kos = (p) => p.evaluate((r) => [...document.querySelectorAll(r + ' .kt-q .kos')].filter((g) => g.style.display !== 'none').map((g) => g.dataset.kos).join(), R(p))
const tuzilish = (p) => p.evaluate((r) => { const ws = BL_WS.get(document.querySelector(r + ' .ekran')); return blRoyxat(ws).map((b) => b.type === 'repeat' ? 'p' + b.getFieldValue('N') + '[' + blZanjir(b.getInputTargetBlock('DO')).map((c) => BL_TURI[c.type]).join('') + ']' : BL_TURI[b.type]).join(' ') }, R(p))
const ishga = async (p) => { await p.click(R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')); await p.waitForTimeout(250); await gacha(p, (r) => { const e = document.querySelector(r + ' .ekran'); return e && !e.dataset.yuryapti }, R(p), 30000); await p.waitForTimeout(150) }
const yech = async (p, e, s, keyin) => { await ekrangacha(p, e); if (s) await qur(p, s); await ishga(p); const g = await hint(p); return { g, o: keyin ? await ekrangacha(p, keyin, 5000) : true } }

// ---------- 1
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await kut(1500)
await l.locator('#bol .tq-o').nth(4).click(); await ekrangacha(l, 'B0')
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · «Kirdi: 2»; «Bugun qahramonni jonlantiramiz!»; «O‘tgan darslarda» — takrorlash', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun qahramonni jonlantiramiz!' && (await matn(u, '#ust .otd')).includes('Bir ishni ko‘p marta bajarish'))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
// ---------- 2–5
await keyingi(); await ekrangacha(a, 'P2N'); await ekrangacha(l, 'P2N')
await a.locator('#bol .jk').nth(1).click(); await l.locator('#bol .jk').nth(2).click(); await kut(1200)
await gacha(u, () => /2 \/ 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('2 · «Javob berdi: 2 / 2»; savol «Coddy qanday qo‘l silkitadi?»; ikki kostyum kartochkasi', (await hint(u)) === 'Javob berdi: 2 / 2' && (await matn(u, '#ust .sar')) === 'Coddy qanday qo‘l silkitadi?' && (await u.$$('#ust .kos2 .kos-m')).length === 2)
await keyingi()
const karta = () => u.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | '))
for (let k = 1; k <= 3; k++) { if (k > 1) await keyingi(); await gacha(u, (n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, k, 25000) }
tek('3 · uch sinov: «✕ bir marta ko‘tardi | ✕ qo‘li qimirlamadi | ✓ qo‘l silkitdi»', (await karta()) === '✕ bir marta ko‘tardi | ✕ qo‘li qimirlamadi | ✓ qo‘l silkitdi', await karta())
await keyingi(); tek('4 · javob «Kostyumlar almashsa — jonlanadi»', (await matn(u, '#ust .sar')) === 'Kostyumlar almashsa — jonlanadi')
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(150) }
tek('5 · «Animatsiya nima?» — uch qator yondi', (await u.$$('#ust .xyl .xq.on')).length === 3 && (await id(u)) === 'P3' && (await matn(u, '#ust .sar')) === 'Animatsiya nima?')
// ---------- 6–8: kostyum
await keyingi(); await keyingi()
tek('7 · P6: javonda Ko‘rinish oilasi; Hodisa va Tovush yashirin', (await id(u)) === 'P6' && (await u.$$('#ust .rg .rd.f-v')).length === 1 && (await u.$$('#ust .rg .rd.f-e.yoq')).length === 1)
await u.click('#ust .rg .rd.f-h'); await u.locator('#ust .pl .mbw .mb', { hasText: 'move right' }).first().click(); await kut(150); await u.locator('#ust .pl .mbw .mb', { hasText: 'move right' }).first().click(); await kut(150)
await u.click('#ust .rg .rd.f-v'); await u.locator('#ust .pl .mbw .mb', { hasText: 'switch costume to' }).first().click(); await kut(300)
await ishga(u); tek('7 · → → switch costume to xursand — yulduzda Coddy xursand', (await hint(u)) === 'Yetib bordi!' && (await kos(u)) === 'xursand', (await hint(u)) + ' ' + (await kos(u)))
await keyingi(); await ekrangacha(a, 'B1A')
tek('8 · Aziz B1A: tayyor → → →, «Dasturni tuzing, keyin ▶ Ishga tushir»', (await a.$$('#bol .jr-bl .mb')).length === 3 && (await hint(a)) === 'Dasturni tuzing, keyin ▶ Ishga tushir')
await ishga(a); tek('8 · kostyumsiz — Kamvoy «Kostyum boshqa!»', (await muam(a)) === 'kamvoy:Kostyum boshqa!' && (await hint(a)) === 'Hozir: xotirjam. Kerak: xursand. Oxiriga switch costume to xursand', await hint(a))
await a.click('#bol .hn .mas'); await kut(300); tek('8 · «Maslahat» — yo‘nalish', (await hint(a)) === 'Yulduzga yetgach — kostyumni almashtiring', await hint(a))
let r = await yech(a, 'B1A', 'r r r cxu', 'B1B'); tek('8 · → → → xursand — «Yetib bordi!» → B1B', r.g === 'Yetib bordi!' && r.o, r.g)
r = await yech(a, 'B1B', 'u u u cha', 'B1C'); tek('8 · B1B hayron → B1C', r.o, r.g)
r = await yech(a, 'B1C', 'r r u u cxu'); tek('8 · B1C belgisiz — Kamvoy «Bu katakda — hayron!»', (await muam(a)) === 'kamvoy:Bu katakda — hayron!' && r.g === '(2, 0) da switch costume to hayron qo‘ying', r.g)
r = await yech(a, 'B1C', 'r r cha u u cxu', 'B1Y'); tek('8 · B1C ikki kostyum → B1Y', r.o, r.g)
r = await yech(a, 'B1Y', 'u u cha r r coy r r r cxu', 'BK'); tek('8 · B1Y uch belgi → BK', r.o, r.g)
await ekrangacha(l, 'B1A'); r = await yech(l, 'B1A', 'r r r cxu', 'B1B'); tek('8 · Lola 1-pog‘ona', r.o)
// ---------- 9–11: animatsiya
await keyingi(); await keyingi()
tek('10 · P7: «Animatsiya: 0 / 3»', (await id(u)) === 'P7' && (await matn(u, '#ust .an-yz b')) === '0 / 3')
await qur(u, 'p3(r,cxu,cxo)'); await ishga(u); tek('10 · repeat 3 [→, xursand, xotirjam] — «3 / 3», «Yetib bordi!»', (await hint(u)) === 'Yetib bordi!' && (await matn(u, '#ust .an-yz b')) === '3 / 3', (await hint(u)) + ' ' + (await matn(u, '#ust .an-yz b')))
await keyingi(); await ekrangacha(a, 'B2A')
r = await yech(a, 'B2A', 'r r p2(cxu,cxo)'); tek('11 · B2A ikki marta — «Animatsiya: 2 / 3. repeat sonini tekshiring»', (await muam(a)) === 'kamvoy:Oz qoldi!' && r.g === 'Animatsiya: 2 / 3. repeat sonini tekshiring', r.g)
r = await yech(a, 'B2A', 'r r p3(cxu,cxo)', 'B2B'); tek('11 · B2A uch marta → B2B', r.o, r.g)
r = await yech(a, 'B2B', 'r r r r p4(cxu,cxo)'); tek('11 · B2B oxirida — Kamvoy «Animatsiya qani?»', (await muam(a)) === 'kamvoy:Animatsiya qani?', r.g)
r = await yech(a, 'B2B', 'p4(r,cxu,cxo)', 'B2C'); tek('11 · B2B har qadamda → B2C', r.o, r.g)
r = await yech(a, 'B2C', 'p3(u,cxu,cxo) p3(r,cxu,cxo)', 'B2Y'); tek('11 · B2C → B2Y', r.o, r.g)
r = await yech(a, 'B2Y', 'p6(r,cxu,cxo) p4(u,cxu,cxo)', 'BK'); tek('11 · B2Y uzoq yo‘l → BK', r.o, r.g)
await ekrangacha(l, 'B2A'); r = await yech(l, 'B2A', 'r r p3(cxu,cxo)', 'B2B'); tek('11 · Lola 1-pog‘ona', r.o)
// ---------- 12–15: tovush (o'yin)
await keyingi(); tek('12 · xulosa «Animatsiya»', (await matn(u, '#ust .sar')) === 'Animatsiya')
await keyingi(); await keyingi()
tek('14 · P8: o‘yin — javonda Hodisa va Tovush, Takrorlash yashirin', (await id(u)) === 'P8' && (await u.$$('#ust .rg .rd.f-t')).length === 1 && (await u.$$('#ust .rg .rd.f-b.yoq')).length === 1)
await tuz(u, [['right', 'r', 'n:qadam'], ['space', 'v:xursand', 'n:jiring']]); await boshla(u); await bos(u, '→→→→→')
tek('14 · → besh marta — yulduzda «Yulduzdasiz — space bosing»', (await hint(u)) === 'Yulduzdasiz — space bosing', await hint(u))
await bos(u, '_'); tek('14 · space — Coddy xursand, «Yetib bordi!»', (await hint(u)) === 'Yetib bordi!' && (await kos(u)) === 'xursand', (await hint(u)) + ' ' + (await kos(u)))
await keyingi(); await ekrangacha(a, 'B3A')
r = await oyna7(a, 'B3A', [['right', 'r']], '→→→→'); tek('15 · B3A tovushsiz — Kamvoy «Tovush qani?»', (await muam(a)) === 'kamvoy:Tovush qani?' && r.g === '→ dasturchasiga play sound qadam ulang', r.g)
r = await oyna7(a, 'B3A', [['right', 'r', 'n:qadam']], '→→→→', 'B3B'); tek('15 · B3A qadam tovushi → B3B', r.g === 'Yetib bordi!' && r.o, r.g)
r = await oyna7(a, 'B3B', [['right', 'r', 'n:qadam'], ['up', 'u', 'n:qadam'], ['space', 'v:xursand', 'n:jiring']], '→→→↑↑_', 'B3Y'); tek('15 · B3B yulduzda space → B3Y', r.o, r.g)
r = await oyna7(a, 'B3Y', [['right', 'r', 'v:xursand', 'n:qadam'], ['up', 'u', 'v:hayron', 'n:sakrash'], ['space', 'v:oylanadi', 'n:jiring']], '→→→→→→↑↑↑↑_', 'BK'); tek('15 · B3Y o‘z qahramoni → BK', r.o, r.g)
await ekrangacha(l, 'B3A'); r = await oyna7(l, 'B3A', [['right', 'r', 'n:qadam']], '→→→→', 'B3B'); tek('15 · Lola 1-pog‘ona', r.o)
// ---------- 16: bola oxirgi yechgan pog'onasi (A·1)
await keyingi(); await kut(1500); await ekrangacha(a, 'B3Y'); await ekrangacha(l, 'B3A')
tek('16 · ustoz P11; Aziz — B3Y (3 dasturcha), Lola — B3A (1 dasturcha); «Dasturingizni ustozga o‘qib bering»', (await id(u)) === 'P11' && (await id(a)) === 'B3Y' && (await matn(a, '#bol .dsn')) === '3 ta dasturcha' && (await id(l)) === 'B3A' && (await matn(l, '#bol .dsn')) === '1 ta dasturcha' && (await hint(l)) === 'Dasturingizni ustozga o‘qib bering', [await id(a), await matn(a, '#bol .dsn'), await id(l), await matn(l, '#bol .dsn'), await hint(l)].join(' | '))
// ---------- 17–18
await keyingi(); await ekrangacha(a, 'B5'); await ekrangacha(l, 'B5')
const son = (p) => p.evaluate((r) => ['marta kostyum almashtirdi', 'ta animatsiya tuzdi', 'marta tovush chaldi'].map((k) => document.querySelector(r + ' .sn-t[data-k="' + k + '"] b').textContent).join(','), R(p))
// Aziz: kostyum 1+1+2+3 + 6+8+12+20 + 0+1+3 = 57; animatsiya (juftlar) 3+4+6+10 = 23; tovush 4 + (3+2+1) + (6+4+1) = 21. Lola: 1+6 = 7; 3; 4
tek('17 · Aziz: 57, 23, 21', (await son(a)) === '57,23,21', await son(a))
tek('17 · Lola: 7, 3, 4', (await son(l)) === '7,3,4', await son(l))
tek('17 · yakun «Qahramoningiz jonlandi!», keyingi dars «8 · Shart»', (await matn(u, '#ust .sar')) === 'Qahramoningiz jonlandi!' && (await matn(u, '#ust [data-z="keyingi dars"]')).includes('8 · Shart'))
await keyingi(); await kut(1200); tek('18 · Sinfimiz bugun: 64, 26, 25', (await son(u)) === '64,26,25', await son(u))
await u.click('#ust .hn .asos'); await kut(2500)
tek('18 · «Darsni yakunlash» — hammada «Dars tugadi»', (await matn(u, '#ust .tugadi-k')).includes('Dars tugadi!') && (await hint(a)).includes('Ko‘rishguncha') && (await hint(l)).includes('Ko‘rishguncha'))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

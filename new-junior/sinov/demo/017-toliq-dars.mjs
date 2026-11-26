// 17-dars «Kosmik o‘yin 1» — to'liq jonli dars sinovi (21.11). Manba: new-junior/manba/017-kosmik-oyin-1.md v1.
// Ustoz va ikki o'quvchi — alohida brauzer oynalari, lokal sinf serveri orqali. 18 qadam: huk (A — raketaning o'zi, B — bitta o'q, C — nusxalar),
// yangi so'z (birma-bir), ustoz raketa dasturini (7) va o'q dasturini (10: o'q turib qoladi → when I start as a clone) tuzadi, 1–3-bekat pog'onalari
// (Aziz — hammasi, Lola — har bekatning 1-pog'onasi), nishonlar (14, 15 — nishon-bot), doskalar, 16-qadam (A·1), natija sonlari, saqlash, yakunlash.
// Ishlatish (lokal server 5340 yoniq, demo-017 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/017-toliq-dars.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-017.html', X = 'd17' + Date.now().toString(36)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const oyna = async (n, w, h) => { const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); p.on('pageerror', (e) => xato.push(n + ': ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(n + ' konsol: ' + m.text()) }); return p }
const u = await oyna('ustoz', 1600, 900), a = await oyna('Aziz', 1440, 810), l = await oyna('Lola', 1440, 810)
let ok = 0, jami = 0
const tek = (nom, shart, iz = '') => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom + (shart || iz === '' ? '' : '  — ' + iz)) }
const kut = (ms) => u.waitForTimeout(ms)
const id = (p) => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (p, s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (p, f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ekrangacha = (p, e, ms = 8000) => gacha(p, (e) => document.querySelector('#ilova .ekran')?.dataset.id === e, e, ms)
const keyingi = async () => { await u.click('#ust .hn .asos'); await kut(600) }
const R = (p) => (p === u ? '#ust' : '#bol')
const hint = (p) => matn(p, R(p) + ' .hn .hint')
const muam = (p) => p.evaluate((r) => { const m = document.querySelector(r + ' .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' }, R(p))
const pogSon = () => u.evaluate(() => [document.querySelector('#ust .tugatdi b').textContent.replace(/\s/g, ''), ...Array.from(document.querySelectorAll('#ust .pg-k .pg-s b')).map((x) => x.textContent)].join(' '))
// ikkala personaj dasturi (tanlangani — Blockly'da)
const qur = (p, g) => p.evaluate(({ r, g }) => { const ek = document.querySelector(r + ' .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek) }, { r: R(p), g }).then(() => p.waitForTimeout(400))
const tugma = (p) => R(p) + (p === u ? ' .hn .ishga' : ' .hn .asos')
const band = (p) => p.evaluate((r) => !!document.querySelector(r + ' .ekran').dataset.yuryapti, R(p))
const bos = async (p, k, n = 1) => { for (let i = 0; i < n; i++) { for (let t = 0; t < 40 && (await band(p)); t++) await p.waitForTimeout(60); await p.keyboard.press(k); await p.waitForTimeout(260) } }
const oyinda = (p) => p.evaluate((r) => !!document.querySelector(r + ' .ekran[data-oyin]'), R(p))
const boshla = async (p) => { await p.click(tugma(p)); await p.waitForTimeout(700) }
// nishon bot: eng yaqin nishon ustuniga borib, space — hammasi urilguncha
const nishonBot = async (p) => {
  await bos(p, 'ArrowLeft'); await bos(p, 'ArrowRight')
  for (let t = 0; t < 40; t++) {
    const h = await p.evaluate((r) => { const ek = document.querySelector(r + ' .ekran'), o = OYIN.get(ek); return o ? { x: o.h.x, n: Array.from(ek.querySelectorAll('.ks-n:not(.urildi)')).map((e) => +e.dataset.k.split(',')[0]) } : null }, R(p))
    if (!h || !h.n.length) break
    const x = h.n.reduce((a2, c) => (Math.abs(c - h.x) < Math.abs(a2 - h.x) ? c : a2))
    if (x !== h.x) await bos(p, x > h.x ? 'ArrowRight' : 'ArrowLeft', Math.abs(x - h.x))
    await bos(p, ' '); await p.waitForTimeout(1900)
  }
  await p.waitForTimeout(500)
}
const RAK = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]], RAKT = [[['k', 'right'], ['r'], ['n', 'qadam']], [['k', 'left'], ['l'], ['n', 'qadam']]]
const OQ = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]], OQT = [[['k', 'space'], ['C'], ['n', 'sakrash']], OQ[1]]
// pog'onalar: [ekran, dastur, o'ynash]
const P1 = [['B1A', { raketa: [RAK[0]] }, async (p) => { await bos(p, 'ArrowRight', 4) }], ['B1B', { raketa: RAK }, async (p) => { await bos(p, 'ArrowLeft', 3); await bos(p, 'ArrowRight', 6) }],
  ['B1C', { raketa: [...RAK, [['f'], ['x', '3,0']]] }, async (p) => { await p.waitForTimeout(900) }], ['B1Y', { raketa: RAKT }, async (p) => { await bos(p, 'ArrowRight'); await bos(p, 'ArrowLeft') }]]
const otish = async (p) => { await bos(p, ' '); await p.waitForTimeout(2600) }
const P2 = [['B2A', { oq: OQ }, otish], ['B2B', { oq: OQ }, otish], ['B2C', { oq: OQ }, otish], ['B2Y', { oq: OQT }, otish]]
const P3 = [['B3A', null, nishonBot], ['B3B', null, nishonBot], ['B3C', null, nishonBot], ['B3Y', null, async (p) => { await p.evaluate((r) => { const ek = document.querySelector(r + ' .ekran'); ek.__ksNishon = [[0, 4], [2, 3], [4, 2], [6, 4]]; kosmikChiz(ek) }, R(p)); await boshla(p); await nishonBot(p) }]]
const pog = async (p, [e, d, ish], keyin) => { await ekrangacha(p, e); await p.waitForTimeout(500); if (d) await qur(p, d); if (e !== 'B3Y') await boshla(p); await ish(p); return { e, g: await hint(p), m: await muam(p), o: await ekrangacha(p, keyin, 8000) } }

await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele'); localStorage.setItem('demo-qism', 'Bulut') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Lola'); localStorage.setItem('demo-qah', 'nihol') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`); await kut(1500)
// ---------- 1–4
await gacha(u, () => /Kirdi: 2/.test(document.querySelector('#ust .hn .hint')?.textContent))
tek('1 · «Kirdi: 2», «Bugun raketa uchadi!», raketa va uch nishon', (await hint(u)) === 'Kirdi: 2' && (await matn(u, '#ust .sar')) === 'Bugun raketa uchadi!' && (await u.$$('#ust .ks-n')).length === 3, await hint(u))
for (const p of [a, l]) await p.click('#bol .asos'); await kut(400)
await keyingi(); await ekrangacha(a, 'P2N'); await a.locator('#bol .jk').nth(2).click(); await l.locator('#bol .jk').nth(1).click(); await kut(1200)
tek('2 · «Javob berdi: 2 / 2»', (await hint(u)) === 'Javob berdi: 2 / 2', await hint(u))
await keyingi()
const jn = (n) => gacha(u, (n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, n, 90000)
await jn(1); tek('3 · A — «✕ raketa ketib qoldi»', (await matn(u, '#ust .jk.c1 .jn')) === '✕ raketa ketib qoldi')
await keyingi(); await jn(2); tek('3 · B — «✕ bir marta otildi», Bo‘shvoy «O‘q qani?»', (await matn(u, '#ust .jk.c2 .jn')) === '✕ bir marta otildi')
await keyingi(); await jn(3); tek('3 · C — «✓ har safar yangi o‘q», nishon parchalandi', (await matn(u, '#ust .jk.c3 .jn')) === '✓ har safar yangi o‘q' && !!(await u.$('#ust .ks-n.urildi')))
await keyingi(); tek('4 · javob: A, B xira, uchayotgan uch o‘q', (await id(u)) === 'P2C' && (await u.$$('#ust .jk.n-yoq')).length === 2 && (await u.$$('#ust .kt-klon')).length === 3)
// ---------- 5–6
await keyingi(); for (let k = 0; k < 3; k++) { await u.click('#ust .hn .asos'); await kut(250) }
tek('5 · «Personaj nima?» — uch bo‘lak va ta’rif', (await u.$$('#ust .xs-b.on')).length === 3 && !!(await u.$('#ust .xs-ta.on')))
await keyingi(); tek('6 · reja', (await id(u)) === 'P4')
// ---------- 7: raketaning dasturi
await keyingi(); await kut(500)
tek('7 · P7: kartalar «Raketa» · «O‘q», «Raketa dasturi», bo‘sh; bolada «Ustoz raketani yurgizyapti»', (await u.$$('#ust .per-k')).length === 2 && (await matn(u, '#ust .dsb b')) === 'Raketa dasturi' && (await matn(u, '#ust .dsn')).includes('0 / 8 ta blok') && (await matn(a, '#bol .qarang')).includes('Ustoz raketani yurgizyapti'), await matn(u, '#ust .dsn'))
await qur(u, { raketa: RAK }); await boshla(u); await bos(u, 'ArrowRight', 2); await bos(u, 'ArrowLeft')
tek('7 · → → ← — raketa (4, 0)', (await u.evaluate(() => OYIN.get(document.querySelector('#ust .ekran'))?.h.x)) === 4)
await u.click(tugma(u)); await kut(300)
// ---------- 8: raketa
await keyingi(); await ekrangacha(a, 'B1A'); await ekrangacha(l, 'B1A'); await kut(600)
tek('8 · B1A: «O‘q» kartasi qulf', !!(await a.$('#bol .per-k.qulf[data-p="oq"]')))
await a.click('#bol .per-k[data-p="oq"]'); await kut(200); tek('8 · qulf karta — «O‘q — 2-bekatda»', (await hint(a)) === 'O‘q — 2-bekatda', await hint(a))
let r
for (let i = 0; i < 4; i++) { r = await pog(a, P1[i], i < 3 ? P1[i + 1][0] : 'BK'); tek('8 · Aziz ' + P1[i][0] + ' → ' + (i < 3 ? P1[i + 1][0] : 'BK'), r.o, JSON.stringify(r)) }
r = await pog(l, P1[0], 'B1B'); tek('8 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('8 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 9–10: o'qning dasturi
await keyingi(); await keyingi(); await kut(500)
tek('10 · P8: «O‘q dasturi» tanlangan, bo‘sh', (await matn(u, '#ust .dsb b')) === 'O‘q dasturi' && !!(await u.$('#ust .per-k.on[data-p="oq"]')))
await qur(u, { oq: [OQ[0]] }); await boshla(u); await bos(u, ' '); await kut(900)
tek('10 · S[C] — o‘q paydo bo‘ldi, Bo‘shvoy «Men nima qilay?»', (await muam(u)) === 'boshvoy:Men nima qilay?' && (await u.$$('#ust .kt-klon')).length === 1, await muam(u))
await u.click(tugma(u)); await kut(300)
await qur(u, { oq: OQ }); await boshla(u); await bos(u, ' '); await bos(u, 'ArrowRight'); await bos(u, ' '); await kut(2800)
tek('10 · + K[R4[↑] D] — ikki o‘q uchib o‘chdi, «O‘q: 2»', (await u.$$('#ust .kt-klon')).length === 0 && (await matn(u, '#ust .kl-son')) === 'O‘q: 2', await matn(u, '#ust .kl-son'))
await u.click(tugma(u)); await kut(300)
// ---------- 11
await keyingi(); await ekrangacha(a, 'B2A'); await kut(500)
tek('11 · B2A: Aziz — o‘z raketa dasturi (1-bekatdan emas, tayyor), «O‘q dasturi»', (await matn(a, '#bol .dsb b')) === 'O‘q dasturi')
for (let i = 0; i < 4; i++) { r = await pog(a, P2[i], i < 3 ? P2[i + 1][0] : 'BK'); tek('11 · Aziz ' + P2[i][0] + ' → ' + (i < 3 ? P2[i + 1][0] : 'BK'), r.o, JSON.stringify(r)) }
r = await pog(l, P2[0], 'B2B'); tek('11 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('11 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 12–14
await keyingi(); tek('12 · xulosa «Personaj»', (await matn(u, '#ust .sar')) === 'Personaj')
await keyingi(); await keyingi(); await kut(500)
tek('14 · P10: uch nishon, ro‘yxat «O‘yiningizda:» (0 / 4)', (await u.$$('#ust .ks-n')).length === 3 && (await u.$$('#ust .pl .chek .ch-r')).length === 4 && (await u.$$('#ust .pl .chek .ch-r.ok')).length === 0)
await boshla(u); await nishonBot(u)
tek('14 · hamma nishon urildi — «Siz yutdingiz!», ro‘yxat 4 / 4', (await hint(u)) === 'Siz yutdingiz!' && (await u.$$('#ust .pl .chek .ch-r.ok')).length === 4, await hint(u))
// ---------- 15
await keyingi(); await ekrangacha(a, 'B3A'); await ekrangacha(l, 'B3A'); await kut(600)
tek('15 · B3A: Aziz dasturi 2-bekatdan — o‘q dasturida otish tovushi bor', await a.evaluate(() => JSON.stringify(document.querySelector('#bol .ekran').__per.json.oq || {}).includes('sakrash')))
for (let i = 0; i < 4; i++) { r = await pog(a, P3[i], i < 3 ? P3[i + 1][0] : 'BK'); tek('15 · Aziz ' + P3[i][0] + ' → ' + (i < 3 ? P3[i + 1][0] : 'BK'), r.o, JSON.stringify(r)) }
r = await pog(l, P3[0], 'B3B'); tek('15 · Lola 1', r.o, JSON.stringify(r))
await gacha(u, () => document.querySelectorAll('#ust .pg-k .pg-s b')[0]?.textContent === '2')
tek('15 · doska: «1 / 2»; zinapoya 2 · 1 · 1 · 1', (await pogSon()) === '1/2 2 1 1 1', await pogSon())
// ---------- 16–18
await keyingi(); await kut(1200)
tek('16 · Aziz — oxirgi pog‘onasi (B3Y); Lola — B3A', (await id(a)) === 'B3Y' && (await id(l)) === 'B3A', (await id(a)) + ' ' + (await id(l)))
await keyingi(); await ekrangacha(a, 'B5'); await kut(800)
const K3 = ['ta o‘q otdi', 'ta nishon urildi', 'pog‘ona bajardi']
const nat = (p, r2 = '#bol') => p.evaluate(({ K3, r2 }) => K3.map((k) => +document.querySelector(r2 + ' .sn-t[data-k="' + k + '"] b').textContent), { K3, r2 })
const na = await nat(a), nl = await nat(l)
tek('17 · Aziz: o‘q ≥ 17, nishon 17, pog‘ona 12', na[0] >= 17 && na[1] === 17 && na[2] === 12, na.join(','))
tek('17 · Lola: o‘q ≥ 3, nishon 3, pog‘ona 3', nl[0] >= 3 && nl[1] === 3 && nl[2] === 3, nl.join(','))
tek('17 · «O‘yiningiz saqlandi.» — ikkalasida', !(await a.$eval('#bol .saqlandi', (e) => e.hidden)) && !(await l.$eval('#bol .saqlandi', (e) => e.hidden)))
await keyingi(); await kut(800)
const sinf = await nat(u, '#ust')
tek('18 · sinf = Aziz + Lola', sinf.join(',') === na.map((x, i) => x + nl[i]).join(','), sinf.join(','))
await u.click('#ust .hn .asos'); await kut(800); tek('18 · «Dars tugadi!»', !!(await u.$('#ust .tugadi-k')))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 4).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); await b.close()
process.exit(ok === jami ? 0 : 1)

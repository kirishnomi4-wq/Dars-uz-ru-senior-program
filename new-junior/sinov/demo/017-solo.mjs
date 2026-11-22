// 17-dars «Kosmik o‘yin 1» — solo sinovi (21.11): bola darsni ustozsiz o'zi o'tadi (manba 017, «Solo»; 88-qaror). Har bekatda — avval xato varianti
// (muammocha), keyin namunaviy yechim; pog'ona bajarilsa keyingisi o'zi ochiladi; 7, 10, 14-qadamda dastur tayyor; 16 va 18-qadam yo'q.
// Ishlatish (lokal server 5340 yoniq, demo-017 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/017-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-017.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ekrangacha = (e, ms = 8000) => gacha((e) => document.querySelector('#ilova .ekran')?.dataset.id === e, e, ms)
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(700) }
const hint = () => matn('#ilova .hn .hint')
const muam = () => p.evaluate(() => { const m = document.querySelector('#ilova .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' })
const yol = [], qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
const tugma = () => p.evaluate(() => (document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)'))
const boshla = async () => { await p.click(await tugma()); await p.waitForTimeout(700) }
const toxtat = async () => { if (await p.evaluate(() => !!document.querySelector('#ilova .ekran[data-oyin]'))) { await p.click(await tugma()); await p.waitForTimeout(300) } }
const band = () => p.evaluate(() => !!document.querySelector('#ilova .ekran').dataset.yuryapti)
const bos = async (k, n = 1) => { for (let i = 0; i < n; i++) { for (let t = 0; t < 40 && (await band()); t++) await p.waitForTimeout(60); await p.keyboard.press(k); await p.waitForTimeout(260) } }
const qur = (g) => p.evaluate((g) => { const ek = document.querySelector('#ilova .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek) }, g).then(() => p.waitForTimeout(400))
const nishonBot = async () => {
  await bos('ArrowLeft'); await bos('ArrowRight')
  for (let t = 0; t < 40; t++) {
    const h = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), o = OYIN.get(ek); return o ? { x: o.h.x, n: Array.from(ek.querySelectorAll('.ks-n:not(.urildi)')).map((e) => +e.dataset.k.split(',')[0]) } : null })
    if (!h || !h.n.length) break
    const x = h.n.reduce((a2, c) => (Math.abs(c - h.x) < Math.abs(a2 - h.x) ? c : a2))
    if (x !== h.x) await bos(x > h.x ? 'ArrowRight' : 'ArrowLeft', Math.abs(x - h.x))
    await bos(' '); await p.waitForTimeout(1900)
  }
  await p.waitForTimeout(500)
}
const RAK = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]], RAKT = [[['k', 'right'], ['r'], ['n', 'qadam']], [['k', 'left'], ['l'], ['n', 'qadam']]]
const OQ = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]], OQT = [[['k', 'space'], ['C'], ['n', 'sakrash']], OQ[1]]

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1', (await qayd()) === 'P1'); await keyingi(); tek('P2N', (await qayd()) === 'P2N'); await p.locator('#bol .jk').nth(2).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish»', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await p.waitForTimeout(300); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 90000) }
tek('P2S: uchala karta', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ raketa ketib qoldi | ✕ bir marta otildi | ✓ har safar yangi o‘q')
await keyingi(); tek('P2C', (await qayd()) === 'P2C'); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) } tek('P3: uch bo‘lak', (await p.$$('#ust .xs-b.on')).length === 3)
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi()
tek('P7: raketa dasturi tayyor (solo)', (await qayd()) === 'P7' && (await p.evaluate(() => BL_WS.get(document.querySelector('#ilova .ekran')).getAllBlocks(false).length)) === 4)
await boshla(); await bos('ArrowRight'); tek('P7: → — raketa (4, 0)', (await p.evaluate(() => OYIN.get(document.querySelector('#ilova .ekran'))?.h.x)) === 4); await toxtat()
await keyingi(); tek('B1A', (await qayd()) === 'B1A')
await boshla(); await bos('ArrowRight'); tek('B1A: dastur bo‘sh — Bo‘shvoy', /^boshvoy:/.test(await muam()), await muam()); await toxtat()
await qur({ raketa: [RAK[0]] }); await boshla(); await bos('ArrowRight', 4); tek('B1A → B1B', await ekrangacha('B1B'))
await qur({ raketa: RAK }); await boshla(); await bos('ArrowLeft', 3); await bos('ArrowRight', 6); tek('B1B → B1C', await ekrangacha('B1C'))
await boshla(); tek('B1C: ▶ yo‘q — «Oz qoldi!»', (await muam()) === 'kamvoy:Oz qoldi!' && (await hint()) === '▶ bosilganda raketa (3, 0) ga borsin', await hint()); await toxtat()
await qur({ raketa: [...RAK, [['f'], ['x', '3,0']]] }); await boshla(); tek('B1C → B1Y', await ekrangacha('B1Y'))
await qur({ raketa: RAKT }); await boshla(); await bos('ArrowRight'); await bos('ArrowLeft'); tek('B1Y → P4B', await ekrangacha('P4B'))
await qayd(); await keyingi(); tek('P8: o‘q dasturi tayyor (solo)', (await qayd()) === 'P8' && (await matn('#ilova .dsb b')) === 'O‘q dasturi')
await boshla(); await bos(' '); await p.waitForTimeout(2600); tek('P8: o‘q uchib o‘chdi — «O‘q: 1»', (await matn('#ilova .kl-son')) === 'O‘q: 1' && !(await p.$('#ilova .kt-klon')), await matn('#ilova .kl-son')); await toxtat()
await keyingi(); tek('B2A', (await qayd()) === 'B2A')
await boshla(); await bos(' '); tek('B2A: tayyor K, space yo‘q — Bo‘shvoy', /^boshvoy:/.test(await muam()), await muam()); await toxtat()
await qur({ oq: OQ }); await boshla(); await bos(' '); await p.waitForTimeout(2600); tek('B2A → B2B', await ekrangacha('B2B'))
await boshla(); await bos(' '); await p.waitForTimeout(900); tek('B2B: K[D] — «Oz qoldi!» «O‘q tepaga yetmay o‘chdi»', (await muam()) === 'kamvoy:Oz qoldi!' && /yetmay o‘chdi/.test(await hint()), await hint()); await toxtat()
await qur({ oq: OQ }); await boshla(); await bos(' '); await p.waitForTimeout(2600); tek('B2B → B2C', await ekrangacha('B2C'))
await boshla(); await bos(' '); await p.waitForTimeout(2600); tek('B2C: K[R4[↑]] — «Tepada qolib ketdi!»', (await muam()) === 'kamvoy:Tepada qolib ketdi!', await muam()); await toxtat()
await qur({ oq: OQ }); await boshla(); await bos(' '); await p.waitForTimeout(2600); tek('B2C → B2Y', await ekrangacha('B2Y'))
await qur({ oq: OQT }); await boshla(); await bos(' '); await p.waitForTimeout(2600); tek('B2Y → P9', await ekrangacha('P9', 9000))
await qayd(); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi()
tek('P10: ikkala dastur tayyor, ro‘yxat 0 / 4', (await qayd()) === 'P10' && (await p.$$('#ilova .pl .chek .ch-r')).length === 4)
await boshla(); await nishonBot(); tek('P10: «Siz yutdingiz!»', (await hint()) === 'Siz yutdingiz!', await hint())
await keyingi(); tek('B3A: dasturlar 2-bekatdan', (await qayd()) === 'B3A' && await p.evaluate(() => JSON.stringify(document.querySelector('#ilova .ekran').__per.json.oq || {}).includes('sakrash')))
await boshla(); await nishonBot(); tek('B3A → B3B', await ekrangacha('B3B'))
await boshla(); await nishonBot(); tek('B3B → B3C', await ekrangacha('B3C'))
await boshla(); await nishonBot(); tek('B3C → B3Y', await ekrangacha('B3Y'))
await boshla(); tek('B3Y: nishonsiz — «Kamida 4 ta nishon qo‘ying»', /Kamida 4 ta nishon/.test(await hint()), await hint())
for (const [x, q] of [[0, 0], [2, 1], [4, 2], [6, 0]]) await p.click('#ilova .katak.maydon .kt-c[data-k="' + x + ',' + q + '"]', { force: true })
tek('B3Y: to‘rt nishon qo‘yildi', (await p.$$('#ilova .ks-n')).length === 4 && /Nishon: 4 ta/.test(await hint()), await hint())
await boshla(); await nishonBot(); tek('B3Y → B5', await ekrangacha('B5', 9000))
await qayd(); tek('B5: «O‘yiningiz saqlandi.»', !(await p.$eval('#ilova .saqlandi', (e) => e.hidden).catch(() => true)))
const n = await p.evaluate(() => ['ta o‘q otdi', 'ta nishon urdi', 'pog‘ona bajardi'].map((k) => +document.querySelector('#ilova .sn-t[data-k="' + k + '"] b').textContent))
tek('B5: nishon 17, pog‘ona 12', n[1] === 17 && n[2] === 12 && n[0] >= 17, n.join(','))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato.slice(0, 5) : 'yo‘q'); console.log('yo‘l:', yol.join(' ')); await b.close()
process.exit(ok === jami ? 0 : 1)

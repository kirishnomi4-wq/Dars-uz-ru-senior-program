// 7-dars «Kostyum, animatsiya va tovush» — solo sinovi (20.11): bola darsni ustozsiz o'tadi (manba 007, «Solo»; 88-qaror).
// Ekranlar tartibi (16, 18-qadam yo'q, doskalar o'rniga darhol o'z ekrani), uch kartani bola o'zi sinaydi, 5-qadamda «Keyingi»ni o'zi bosadi,
// 7, 10, 14-qadamda dastur tayyor — o'zi ishga tushiradi (14-qadamda ▶ Boshlash, → va space; ishora «Ovozni yoqing»), pog'ona bajarilsa keyingisi ochiladi, natija.
// Ishlatish (lokal server 5340 yoniq, demo-007 yig'ilgan): node new-junior/sinov/demo/007-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-007.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const ishga = async () => { await p.click('#ilova .hn .ishga, #ilova .hn .asos:not(.k-solo)'); await p.waitForTimeout(250); await gacha(() => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, 30000); await p.waitForTimeout(150) }
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(500) }
const KOSQ = { xo: 'xotirjam', xu: 'xursand', ha: 'hayron', oy: 'oylanadi' }
const tokn = (t) => (t[0] === 'c' ? { t: 'v', m: KOSQ[t.slice(1)] } : { t })
const qur = (s) => p.evaluate((d) => { const ek = document.querySelector('#ilova .ekran'); blQur(ek, d); sanoq(ek) }, [...s.matchAll(/p(\d+)\(([^)]*)\)|c(?:xo|xu|ha|oy)|[rlud]/g)].map((m) => (m[1] ? { t: 'p', m: m[1], ichki: m[2].split(',').filter(Boolean).map(tokn) } : tokn(m[0]))))
const tuz = (ds) => p.evaluate((ds) => { const ek = document.querySelector('#ilova .ekran'); blYukla(ek, ds.flatMap(([k, ...b]) => [{ t: 'k', m: k }, ...b.map((x) => (x.includes(':') ? { t: x[0], m: x.slice(2) } : { t: x }))])); sanoq(ek) }, ds)
const KEY = { '→': 'ArrowRight', '↑': 'ArrowUp', _: ' ' }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await gacha(() => !document.querySelector('#ilova .ekran')?.dataset.yuryapti, null, 8000); await p.waitForTimeout(50) } await p.waitForTimeout(350) }
const kos = () => p.evaluate(() => [...document.querySelectorAll('#ilova .kt-q .kos')].filter((g) => g.style.display !== 'none').map((g) => g.dataset.kos).join())
const yol = []
const qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1 — «Kirdi» soni yo‘q', (await qayd()) === 'P1' && !/[0-9]/.test(await matn('#ust .hn .hint')))
await keyingi(); tek('P2N', (await qayd()) === 'P2N'); await p.locator('#bol .jk').nth(0).click(); await p.waitForTimeout(900)
tek('P2S: «▶ Sinab ko‘rish» har kartada', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 25000) }
tek('P2S: bola uchalasini sinadi', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ bir marta ko‘tardi | ✕ qo‘li qimirlamadi | ✓ qo‘l silkitdi')
await keyingi(); await qayd(); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(120) }
tek('P3: uch qatorni o‘zi yoqdi', (await p.$$('#ust .xyl .xq.on')).length === 3 && (await id()) === 'P3')
await keyingi(); await qayd(); await keyingi()
tek('P6: dastur tayyor — → → xursand', (await qayd()) === 'P6' && (await p.$$('#ust .jr-bl .mb')).length === 3)
await ishga(); tek('P6: o‘zi ishga tushirdi — yulduzda xursand', (await matn('#ust .hn .hint')) === 'Yetib bordi!' && (await kos()) === 'xursand')
await keyingi(); tek('B1A: darhol o‘z topshirig‘i; «Keyingi ›»', (await qayd()) === 'B1A' && (await p.$$('#bol .hn .k-solo')).length === 1)
await qur('r r r cxu'); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B1B', null, 5000)
tek('B1A bajarildi → B1B', (await qayd()) === 'B1B')
await p.reload(); await p.waitForTimeout(1200); tek('yangilandi — o‘sha joydan (B1B)', (await id()) === 'B1B')
await keyingi(); await qayd(); await keyingi(); await qayd(); tek('«Keyingi ›» bilan B1Y', (await id()) === 'B1Y'); await keyingi()
tek('P4B', (await qayd()) === 'P4B'); await keyingi()
tek('P7: dastur tayyor — repeat 3 [→, xursand, xotirjam]', (await qayd()) === 'P7' && (await p.$$('#ust .jr-bl .mb')).length === 4)
await ishga(); tek('P7: o‘zi ishga tushirdi — «Animatsiya: 3 / 3»', (await matn('#ust .hn .hint')) === 'Yetib bordi!' && (await matn('#ust .an-yz b')) === '3 / 3', await matn('#ust .an-yz b'))
await keyingi(); tek('B2A', (await qayd()) === 'B2A')
await qur('r r p3(cxu,cxo)'); await ishga(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2B', null, 5000)
tek('B2A → B2B', (await qayd()) === 'B2B')
for (const e of ['B2C', 'B2Y']) { await keyingi(); await qayd() }
await keyingi(); tek('P9', (await qayd()) === 'P9'); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi()
tek('P8: o‘yin, dasturchalar tayyor; ishora «Ovozni yoqing — tovush eshitiladi»', (await qayd()) === 'P8' && (await matn('#ust .hn .hint')) === 'Ovozni yoqing — tovush eshitiladi', await matn('#ust .hn .hint'))
await p.click('#ust .hn .ishga'); await p.waitForTimeout(350); await bos('→→→→→_')
tek('P8: o‘zi o‘ynadi — yulduzda space, «Yetib bordi!»', (await matn('#ust .hn .hint')) === 'Yetib bordi!' && (await kos()) === 'xursand', await matn('#ust .hn .hint'))
await keyingi(); tek('B3A', (await qayd()) === 'B3A')
await tuz([['right', 'r', 'n:qadam']]); await p.click('#bol .hn .ishga'); await p.waitForTimeout(350); await bos('→→→→'); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B3B', null, 5000)
tek('B3A qadam tovushi → B3B', (await qayd()) === 'B3B')
await keyingi(); await qayd()
await keyingi(); tek('16-qadam yo‘q — B5', (await qayd()) === 'B5')
const son = () => p.evaluate(() => ['marta kostyum almashtirdi', 'ta animatsiya tuzdi', 'marta tovush chaldi'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('B5: 1 + 6 = 7 kostyum, 3 animatsiya, 4 tovush (B1A, B2A, B3A)', (await son()) === '7,3,4', await son())
tek('solo yo‘li: 25 ekran', yol.join(' ') === 'B0 P1 P2N P2S P2C P3 P4 P6 B1A B1B B1C B1Y P4B P7 B2A B2B B2C B2Y P9 P4C P8 B3A B3B B3Y B5', yol.join(' '))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

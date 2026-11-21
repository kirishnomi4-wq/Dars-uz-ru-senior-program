// 11-dars «O‘zgaruvchi: ball» — solo sinovi (21.11): bola darsni ustozsiz o'zi o'tadi (manba 011, «Solo»; 88-qaror).
// Ekranlar tartibi (16, 18-qadam yo'q, doskalar o'rniga darhol o'z ekrani), 3-qadamda uch kartani bola o'zi sinaydi, 5-qadamda bo'laklarni o'zi yoqadi,
// 7-qadamda dastur tayyor — bola o'zi o'ynaydi, 10-qadamda ikki marta o'ynaydi, keyin set o'zi qo'shiladi, 14-qadamda 5 kartasini o'zi tanlaydi,
// pog'ona yutilsa keyingisi o'zi ochiladi, «Keyingi ›» bilan o'tkazsa bo'ladi, oxiri — o'z natijasi.
// Ishlatish (lokal server 5340 yoniq, demo-011 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/011-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-011.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const tinch = () => gacha(() => !document.querySelector('#ilova .ekran')?.dataset.yuryapti, null, 60000)
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch() } await p.waitForTimeout(350) }
const tugma = () => p.evaluate(() => document.querySelector('#ilova .hn .ishga') ? '#ilova .hn .ishga' : '#ilova .hn .asos')
const boshla = async () => { await p.click(await tugma()); await p.waitForTimeout(400); await tinch() }
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(600) }
const hint = () => matn('#ilova .hn .hint')
const ball = () => matn('#ilova .oyna .ball-k b, #ilova .oyna .bsh-k b')
const yol = [], qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
const D = (d) => [...(d.S != null ? [['f'], ['z', String(d.S)]] : []), ...(d.O != null ? [['q', 'apple'], ['c', String(d.O)]] : []), ...(d.G != null ? [['q', 'gold'], ['c', String(d.G)]] : [])]
const dastur = (d) => p.evaluate((x) => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear(); for (const [t, m] of x) blQosh(ek, t, m); sanoq(ek) }, D(d)).then(() => p.waitForTimeout(250))
// eng qisqa yo'l (sinov/dvigatel/ozgaruvchi.mjs mustaqil hisobidagi usul): olmalar eng yaxshi tartibda, keyin yulduz
const man = (a, c) => Math.abs(a[0] - c[0]) + Math.abs(a[1] - c[1])
function yolT(s, nuq, y) { let eng = null, uz = Infinity; const perm = (q, j, d, t) => { if (d >= uz) return; if (!q.length) { const k = d + man(j, y); if (k < uz) { uz = k; eng = t } return } q.forEach((n, i) => perm(q.filter((_, k) => k !== i), n, d + man(j, n), [...t, n])) }; perm(nuq, s, 0, []); let [x, c] = s, r = ''; for (const [a, e] of [...eng, y]) { while (x < a) { r += '→'; x++ } while (x > a) { r += '←'; x-- } while (c < e) { r += '↑'; c++ } while (c > e) { r += '↓'; c-- } } return r }
const Y = { P6: yolT([0, 0], [[2, 0], [3, 2], [5, 2]], [5, 0]), B1A: yolT([0, 0], [[0, 2], [3, 1], [4, 0]], [6, 0]), B2A: yolT([0, 0], [[1, 3], [3, 1], [5, 2], [6, 0]], [4, 4]) }

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1 — «Kirdi» soni yo‘q', (await qayd()) === 'P1' && !/[0-9]/.test(await matn('#ust .hn .hint')))
await keyingi(); tek('P2N — uch karta', (await qayd()) === 'P2N' && (await p.$$('#bol .jk')).length === 3)
await p.locator('#bol .jk').nth(2).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish»', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await p.waitForTimeout(300); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 60000) }
tek('P2S: uchala kartani bola o‘zi sinadi', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ doim 1 | ✕ birdan 3 | ✓ ball: 3')
await keyingi(); tek('P2C', (await qayd()) === 'P2C'); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) }
tek('P3: uch bo‘lak o‘zi yoqildi, ekran o‘sha', (await p.$$('#ust .xyl p.on')).length === 3 && (await id()) === 'P3')
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi(); await p.waitForTimeout(400)
tek('P6: dastur tayyor — when touching apple → change ball by 1', (await qayd()) === 'P6' && (await p.evaluate(() => { const d = blDasturchalar(document.querySelector('#ilova .ekran')); return d.length === 1 && d[0].tur === 'when_touch' && d[0].bloklar.length === 1 })))
await boshla(); await bos(Y.P6); tek('P6: bola o‘zi o‘ynadi — ball 3, «Siz yutdingiz!»', (await ball()) === '3' && (await hint()) === 'Siz yutdingiz!', await hint())
await keyingi(); tek('B1A: o‘z topshirig‘i; «Keyingi ›» bor', (await qayd()) === 'B1A' && (await p.$$('#bol .hn .k-solo')).length === 1)
await dastur({ O: 1 }); await boshla(); await bos(Y.B1A); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B1B', null, 6000)
tek('B1A: ball 3 — yutdi → B1B o‘zi ochildi', (await qayd()) === 'B1B')
await p.reload(); await p.waitForTimeout(1500); tek('sahifa yangilandi — o‘sha joydan (B1B), dastur saqlangan', (await id()) === 'B1B' && (await p.evaluate(() => blDasturchalar(document.querySelector('#ilova .ekran')).length)) === 1)
await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi()
tek('P4B', (await qayd()) === 'P4B'); await keyingi(); await p.waitForTimeout(400)
tek('P7: dastur tayyor (O[+1]), ishora «Ikki marta o‘ynang…»', (await qayd()) === 'P7' && (await hint()) === 'Ikki marta o‘ynang: ball qanday bo‘ladi?', await hint())
await boshla(); await bos(Y.P6); tek('P7: 1-o‘yin — 3', (await ball()) === '3')
await boshla(); await bos(Y.P6); tek('P7: 2-o‘yin — 6, «Olma 3 ta — ball 6»', (await ball()) === '6' && (await matn('#ilova .ball-iz')) === 'Olma 3 ta — ball 6')
await gacha(() => blDasturchalar(document.querySelector('#ilova .ekran')).length === 2, null, 5000)
tek('P7: set o‘zi qo‘shildi — when ▶ clicked → set ball to 0; ishora', (await p.evaluate(() => { const s = blDasturchalar(document.querySelector('#ilova .ekran')).find((x) => x.tur === 'when_start'); return !!s && blokSon(s.bloklar[0]) === 0 })) && (await hint()) === 'O‘yin boshida ball 0 bo‘ladi. Yana o‘ynang', await hint())
await boshla(); tek('P7: «▶ Boshlash» — ball 0', (await ball()) === '0'); await bos(Y.P6); tek('P7: set bilan — 3', (await ball()) === '3')
await keyingi(); tek('B2A: «ball: 5»', (await qayd()) === 'B2A' && (await ball()) === '5')
await dastur({ S: 0, O: 1 }); await boshla(); await bos(Y.B2A); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2B', null, 6000)
tek('B2A: ▶[0] O[+1] — 4 → B2B', (await qayd()) === 'B2B')
await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi(); tek('P9', (await qayd()) === 'P9'); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi(); await p.waitForTimeout(400)
tek('P8: ishora «5 kartasini bosing, keyin «Tekshirish»»', (await qayd()) === 'P8' && (await hint()) === '5 kartasini bosing, keyin «Tekshirish»', await hint())
await p.click('#ilova .bsh-q .sk[data-v="5"]'); await boshla(); tek('P8: bola o‘zi tekshirdi — «Oldindan aytdingiz!»', (await hint()) === 'Oldindan aytdingiz!' && (await ball()) === '5', await hint())
await keyingi(); tek('B3A', (await qayd()) === 'B3A')
await p.click('#ilova .bsh-q .sk[data-v="9"]'); await boshla(); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B3B', null, 6000)
tek('B3A: 9 — birinchi urinishda → B3B', (await qayd()) === 'B3B')
await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi()
tek('16, 18-qadam yo‘q — B5', (await qayd()) === 'B5'); await p.waitForTimeout(600)
const son = () => p.evaluate(() => ['ta olma terdi', 'eng katta ball', 'marta oldindan aytdi'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('B5: o‘z natijasi — 7 ta olma (3 + 4), eng katta ball 4, 1 marta oldindan aytdi; kapsula «ball: 4»', (await son()) === '7,4,1' && (await ball()) === '4', await son())
const KUT = 'B0 P1 P2N P2S P2C P3 P4 P6 B1A B1B B1C B1Y P4B P7 B2A B2B B2C B2Y P9 P4C P8 B3A B3B B3C B3Y B5'
tek('solo yo‘li: 26 ekran, 16 va 18-qadamsiz', yol.join(' ') === KUT, yol.join(' '))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

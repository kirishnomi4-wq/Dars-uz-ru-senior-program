// 9-dars «Labirint o‘yini 1» — solo sinovi (20.11): bola darsni ustozsiz o'zi o'tadi (manba 009, «Solo»; 88-qaror).
// Ekranlar tartibi (16 va 18-qadam yo'q, doskalar o'rniga darhol o'z ekrani), sinf sonlari yo'q, 2-qadamda «O‘ynab ko‘rsat»ni bola o'zi bosadi,
// uch kartani o'zi sinaydi, 4-qadamda o'zi o'ynaydi, 7/10/14-qadamda dastur tayyor (10-qadamda — ikki dasturcha qoida bilan), pog'ona yutilsa keyingisi
// o'zi ochiladi, «Keyingi ›» bilan o'tkazsa bo'ladi, sahifa yangilansa o'sha joydan, oxiri — o'z natijasi.
// Ishlatish (lokal server 5340 yoniq, demo-009 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/009-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-009.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const tinch = () => gacha(() => !document.querySelector('#ilova .ekran')?.dataset.yuryapti, null, 30000)
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown', '_': ' ' }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch() } await p.waitForTimeout(350) }
const boshla = async () => { await p.click('#ilova .hn .ishga'); await p.waitForTimeout(350) }
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(500) }
const hint = () => matn('#ilova .hn .hint')
const muam = () => p.evaluate(() => { const m = document.querySelector('#ilova .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' })
const yol = []
const qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
const qur = (nom) => p.evaluate((nom) => { labQur(document.querySelector('#ilova .ekran'), nom) }, nom).then(() => p.waitForTimeout(500))
const tuzilish = () => p.evaluate(() => { const ws = BL_WS.get(document.querySelector('#ilova .ekran')), y = { right: '→', left: '←', up: '↑', down: '↓' }, t = { move_right: '→', move_left: '←', move_up: '↑', move_down: '↓' }; const z = (b) => (b.type === 'if_path' ? 'if' + y[b.getFieldValue('YON')] + '[' + blZanjir(b.getInputTargetBlock('DO')).map(z).join(' ') + ']' : t[b.type] || b.type); return ws.getTopBlocks(false).map((h) => 'W' + y[h.getFieldValue('KEY')] + '[' + blZanjir(h).slice(1).map(z).join(' ') + ']').join(' ') })
const Y = { N: '→→↑↑→→→', B1: '→→→→→', Q1: '→↑↑→→↑↑→→→', K1: '→→↑↑→→→→' }

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1 — «Kirdi» soni yo‘q', (await qayd()) === 'P1' && !/[0-9]/.test(await matn('#ust .hn .hint')))
await keyingi(); tek('P2N: bolada «O‘ynab ko‘rsat»', (await qayd()) === 'P2N' && (await matn('#bol .hn .so-t')) === '▶ O‘ynab ko‘rsat')
await p.click('#bol .hn .so-t'); await p.waitForTimeout(300); await tinch(); await p.waitForTimeout(300)
tek('P2N: bola o‘zi bosdi — 7-bosishda urildi, To‘siqvoy', (await muam()) === 'tosiqvoy:Devor!' && (await matn('#bol .kt-yr text')) === '(4, 2)', await muam())
await p.locator('#bol .jk').nth(2).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish»', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await p.waitForTimeout(300); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 30000) }
tek('P2S: uchala kartani bola o‘zi sinadi', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ baribir urildi | ✕ ↑ kerak joyda yurmadi | ✓ adashsa ham yutdi')
await keyingi(); tek('P2C: «▶ Boshlash», ishora «Endi o‘zingiz…»', (await qayd()) === 'P2C' && (await hint()) === 'Endi o‘zingiz: ataylab devor tomonga bosing, keyin yuting', await hint())
await p.click('#ust .hn .so-t'); await p.waitForTimeout(300); await bos('↑→↑→→↑→→↑↑→'); tek('P2C: bola o‘zi o‘ynadi — yutdi', (await hint()) === 'Siz yutdingiz!', await hint())
await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) }
tek('P3: uch bo‘lak o‘zi yoqildi, ekran o‘sha', (await p.$$('#ust .xyl .xq.on')).length === 3 && (await id()) === 'P3')
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi()
tek('P6: dastur tayyor (W→[→] W↑[↑]), «▶ Boshlash»', (await qayd()) === 'P6' && (await tuzilish()) === 'W→[→] W↑[↑]' && (await matn('#ust .hn .ishga')) === '▶ Boshlash', await tuzilish())
await boshla(); await bos(Y.N); tek('P6: bola o‘zi o‘ynadi — yutdi', (await hint()) === 'Siz yutdingiz!')
await keyingi(); tek('B1A: darhol o‘z topshirig‘i; «Keyingi ›» bor', (await qayd()) === 'B1A' && (await p.$$('#bol .hn .k-solo')).length === 1)
await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); blQosh(ek, 'k', 'right'); blQosh(ek, 'r'); sanoq(ek) })
await boshla(); await bos(Y.B1); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B1B', null, 5000)
tek('B1A yutildi → B1B o‘zi ochildi, dastur oldingi pog‘onadan', (await qayd()) === 'B1B' && (await tuzilish()) === 'W→[→]', await tuzilish())
await p.reload(); await p.waitForTimeout(1500); tek('sahifa yangilandi — o‘sha joydan (B1B)', (await id()) === 'B1B')
await keyingi(); await qayd(); await keyingi(); await qayd()
tek('«Keyingi ›» bilan o‘tkazildi (B1Y)', (await id()) === 'B1Y'); await keyingi()
tek('P4B', (await qayd()) === 'P4B'); await keyingi()
tek('P7: solo’da ikki dasturcha qoida bilan tayyor; ishora «Ataylab devor tomonga bosing — qoidani ko‘ring»', (await qayd()) === 'P7' && (await tuzilish()) === 'W→[if→[→]] W↑[if↑[↑]]' && (await hint()) === 'Ataylab devor tomonga bosing — qoidani ko‘ring', (await tuzilish()) + ' | ' + (await hint()))
await boshla(); await bos('→↑↑→'); tek('P7: →↑↑→ — «yo‘q», qahramon turdi', (await matn('#ust .kt-yr text')) === '(1, 2)' && !(await muam()))
await bos('↑→→→→→'); tek('P7: yutdi', (await hint()) === 'Siz yutdingiz!')
await keyingi(); tek('B2A', (await qayd()) === 'B2A')
await qur('qoida'); await boshla(); await bos('↑' + Y.Q1); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2B', null, 5000)
tek('B2A: qoida, «yo‘q», yutdi → B2B', (await qayd()) === 'B2B')
for (const e of ['B2C', 'B2Y']) { await keyingi(); await qayd() }
await keyingi(); tek('P9', (await qayd()) === 'P9'); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi()
tek('P8: to‘rt dasturcha qoida bilan; ro‘yxat bor', (await qayd()) === 'P8' && (await p.$$('#ust .pl .chek .ch-r')).length === 4)
await boshla(); await bos('→→↑↑↑→←→→→→→'); tek('P8: bola o‘zi — kalit, eshik, yutdi', (await hint()) === 'Siz yutdingiz!', await hint())
await keyingi(); tek('B3A — dastur 11-qadamdan (qoida bilan)', (await qayd()) === 'B3A' && (await tuzilish()) === 'W→[if→[→]] W←[if←[←]] W↑[if↑[↑]] W↓[if↓[↓]]', await tuzilish())
await boshla(); await bos(Y.K1); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B3B', null, 5000)
tek('B3A yutildi → B3B', (await qayd()) === 'B3B')
await keyingi(); await qayd(); await keyingi()
tek('16-qadam yo‘q — darhol B5', (await qayd()) === 'B5')
await p.waitForTimeout(500)
const son = () => p.evaluate(() => ['marta tugma bosdi', 'marta devor oldida to‘xtadi', 'labirint yutdi'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('B5: o‘z natijasi — 5 + 11 + 8 = 24 marta tugma bosdi, 1 marta devor oldida, 3 labirint', (await son()) === '24,1,3', await son())
tek('B5: o‘yin saqlanmagan (15 · 2 o‘tkazildi) — «saqlandi» gapi yo‘q', await p.$eval('#bol .saqlandi', (e) => e.hidden))
const KUT = 'B0 P1 P2N P2S P2C P3 P4 P6 B1A B1B B1C B1Y P4B P7 B2A B2B B2C B2Y P9 P4C P8 B3A B3B B3Y B5'
tek('solo yo‘li: 25 ekran, 16 va 18-qadamsiz', yol.join(' ') === KUT, yol.join(' '))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

// 10-dars «Labirint o‘yini 2» — solo sinovi (20.11): bola darsni ustozsiz o'zi o'tadi (manba 010, «Solo»; 88-qaror).
// Ekranlar tartibi (18-qadam yo'q, doskalar o'rniga darhol o'z ekrani), 2–3-qadamda avto o'yin va uch kartani bola o'zi sinaydi, 7/10-qadamda ustozning
// labirinti (U1, U2) tayyor — bola o'zi «Sinab ko‘rish», 14-qadamda Coddy'ning ikki darajali o'yinini o'zi o'ynaydi, pog'ona yutilsa keyingisi o'zi ochiladi,
// «Keyingi ›» bilan o'tkazsa bo'ladi (16-qadam ham), oxiri — o'z natijasi.
// Ishlatish (lokal server 5340 yoniq, demo-010 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/010-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-010.html'
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
const boshla = async () => { await p.click('#ilova .hn .ishga'); await p.waitForTimeout(400) }
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(600) }
const hint = () => matn('#ilova .hn .hint')
const yol = [], qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
const m = (s) => s.replace(/·/g, '.').replace(/★/g, '*')
const LB = { U1: '··#···★|·##·#·#|····#··|·##·##·|S······', U2: '··#··E★|·##·#·#|K···#··|·##·##·|S······', N1: '······★|·##·##·|·······|·#·##·#|S······', NK1: '·####E★|····#·#|#K#·#·#|#·#····|S··###·' }
const Y = { D1: '→↑↑↑↓↓↓→→↑↑→→→↑↑', U1: '→→→↑↑↑↑→→→', U2: '↑↑→→→↑↑→→→', N1: '→→→→→↑↑→↑↑', NK1: '→↑↑↑→→↓↓→→↑↑↑→' }
const katak = async (x, y) => { const pt = await p.evaluate(([x, y]) => { const k = document.querySelector('#ilova .katak.maydon'), svg = k.querySelector('svg.kt'), H = katakXarita(k.dataset.xarita).length, q = svg.createSVGPoint(); q.x = x * KT + 50; q.y = (H - 1 - y) * KT + 50; const r = q.matrixTransform(svg.getScreenCTM()); return [r.x, r.y] }, [x, y]); await p.mouse.click(pt[0], pt[1]); await p.waitForTimeout(120) }
const asbob = async (a) => { await p.click(`#ilova .pl .asb[data-t="${a}"]`); await p.waitForTimeout(100) }
const yasa = async (nm) => { const maq = m(LB[nm]).split('|'); let h = await p.evaluate(() => document.querySelector('#ilova .katak').dataset.xarita.split('|')); await asbob('devor'); for (let q = 0; q < 5; q++) for (let x = 0; x < 7; x++) if ((maq[q][x] === '#') !== (h[q][x] === '#')) await katak(x, 4 - q); for (const [a, ch] of [['kalit', 'K'], ['eshik', 'E']]) { const t = maq.join('').indexOf(ch); if (t >= 0) { await asbob(a); await katak(t % 7, 4 - Math.floor(t / 7)) } } await asbob('devor') }

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0 — «Tayyor o‘yin ochildi…»', (await qayd()) === 'B0' && (await p.$eval('#ilova .ok-t', (e) => !e.hidden))); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1 — «Kirdi» soni yo‘q', (await qayd()) === 'P1' && !/[0-9]/.test(await matn('#ust .hn .hint')))
await keyingi(); tek('P2N: «O‘ynab ko‘rsat»', (await qayd()) === 'P2N' && (await matn('#bol .hn .so-t')) === '▶ O‘ynab ko‘rsat')
await p.click('#bol .hn .so-t'); await p.waitForTimeout(300); await tinch(); await p.waitForTimeout(300); tek('P2N: bola o‘zi bosdi — Coddy yutdi', (await p.$$('#bol .oyna .konfeti')).length > 0)
await p.locator('#bol .jk').nth(2).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish»', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await p.waitForTimeout(300); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 60000) }
tek('P2S: uchala kartani bola o‘zi sinadi', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ boshqaruv va qoida yo‘q | ✕ labirint baribir bitta | ✓ ikki labirint, dastur o‘sha')
await keyingi(); tek('P2C', (await qayd()) === 'P2C'); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) }
tek('P3: uch bo‘lak o‘zi yoqildi, ekran o‘sha', (await p.$$('#ust .xyl .xq.on')).length === 3 && (await id()) === 'P3')
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi(); await p.waitForTimeout(400)
tek('P6: ustozning labirinti (U1) tayyor; ishora «Katakni bosing — devor…»; «▶ Sinab ko‘rish»', (await qayd()) === 'P6' && (await p.evaluate(() => document.querySelector('#ilova .katak').dataset.xarita)) === m(LB.U1) && (await hint()) === 'Katakni bosing — devor. Yana bosing — devor ketadi' && (await matn('#ust .hn .ishga')) === '▶ Sinab ko‘rish', await hint())
await katak(5, 4); tek('P6: bola devor qo‘ydi — «Yo‘l yo‘q»', (await matn('#ust .olchov')) === 'Devor: 11 · Yo‘l yo‘q'); await katak(5, 4)
await boshla(); await bos(Y.U1); tek('P6: «Sinab ko‘rish» — yutdi', (await hint()) === 'Siz yutdingiz!')
await keyingi(); tek('B1A: o‘z topshirig‘i; «Keyingi ›» bor', (await qayd()) === 'B1A' && (await p.$$('#bol .hn .k-solo')).length === 1)
await yasa('N1'); await boshla(); await bos(Y.N1); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B1B', null, 6000)
tek('B1A: 8 devor, o‘zi yutdi → B1B o‘zi ochildi', (await qayd()) === 'B1B')
await p.reload(); await p.waitForTimeout(1500); tek('sahifa yangilandi — o‘sha joydan (B1B), labirint saqlangan', (await id()) === 'B1B' && (await p.evaluate(() => document.querySelector('#ilova .katak').dataset.xarita)) === m(LB.N1))
await keyingi(); await qayd(); await keyingi(); await qayd(); await keyingi()
tek('P4B', (await qayd()) === 'P4B'); await keyingi(); await p.waitForTimeout(400)
tek('P7: ustozning U2 tayyor', (await qayd()) === 'P7' && (await p.evaluate(() => document.querySelector('#ilova .katak').dataset.xarita)) === m(LB.U2))
await boshla(); await bos(Y.U2); tek('P7: «Sinab ko‘rish» — kalit, eshik, yutdi', (await hint()) === 'Siz yutdingiz!')
await keyingi(); tek('B2A', (await qayd()) === 'B2A')
await yasa('NK1'); await boshla(); await bos(Y.NK1); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B2B', null, 6000)
tek('B2A: kalit va eshik, yutdi → B2B', (await qayd()) === 'B2B')
await keyingi(); await qayd(); await keyingi(); tek('P9', (await qayd()) === 'P9'); await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi(); await p.waitForTimeout(400)
tek('P8: Coddy’ning o‘yini, «Daraja: 1 / 2»', (await qayd()) === 'P8' && (await matn('#ust .daraja-yz')) === 'Daraja: 1 / 2')
await boshla(); await bos(Y.D1); await p.waitForTimeout(1800); await bos(Y.U2); tek('P8: bola o‘zi ikkala darajani yutdi', (await hint()) === 'Siz yutdingiz!', await hint())
await keyingi(); await p.waitForTimeout(400); tek('B3A — 2-daraja o‘zi yasagani (NK1)', (await qayd()) === 'B3A')
await boshla(); await bos(Y.D1); await p.waitForTimeout(1800); await bos(Y.NK1); await gacha(() => document.querySelector('#ilova .ekran')?.dataset.id === 'B3Y', null, 6000)
tek('B3A: ikkala daraja yutildi → B3Y', (await qayd()) === 'B3Y')
await keyingi(); tek('BD: «Do‘stingiz o‘ynaydi» (solo’da ham), «Keyingi ›» bilan o‘tkazsa bo‘ladi', (await qayd()) === 'BD' && (await p.$$('#bol .hn .so-t')).length === 1 && (await p.$$('#bol .hn .k-solo')).length === 1)
await keyingi(); tek('18-qadam yo‘q — B5', (await qayd()) === 'B5'); await p.waitForTimeout(600)
const son = () => p.evaluate(() => ['ta devor qo‘ydi', 'qadam — labirintingiz yo‘li', 'daraja yutdi'].map((k) => document.querySelector('#bol .sn-t[data-k="' + k + '"] b').textContent).join(','))
tek('B5: o‘z natijasi — NK1: 15 devor, 14 qadam, 2 daraja', (await son()) === '15,14,2', (await son()) + ' — ' + (await p.evaluate(() => JSON.stringify({ K, qBlok, kalitlar: Object.keys(localStorage).filter((k) => /bloklar|chek|daraja2/.test(k)) }))))
tek('B5: «Do‘stingiz o‘ynadi» bandi bo‘sh (o‘tkazildi)', (await p.$$('#bol .chek-y .ch-dost.ok')).length === 0 && (await p.$$('#bol .chek-y .ch-r.ok')).length === 4)
const KUT = 'B0 P1 P2N P2S P2C P3 P4 P6 B1A B1B B1C B1Y P4B P7 B2A B2B B2Y P9 P4C P8 B3A B3Y BD B5'
tek('solo yo‘li: 24 ekran, 18-qadamsiz', yol.join(' ') === KUT, yol.join(' '))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

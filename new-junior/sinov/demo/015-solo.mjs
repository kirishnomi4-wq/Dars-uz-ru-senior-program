// 15-dars «Xakaton №1» — solo sinovi (21.11): bola darsni ustozsiz o'zi o'tadi va «Labirint» o'yinini yasaydi (manba 015, «Solo»; 88-qaror).
// 3-qadamda uch kartani o'zi sinaydi, 5- va 7-qadamda qatorlarni o'zi yoqadi; 8, 16, 18-qadam yo'q; rollar va «Almashdik» yo'q — qism tayyor bo'lsa keyingisi
// o'zi ochiladi; Labirint qismlari: Strelka va qoida → 2-daraja (labirint yasash, «Sinab ko‘rish») → Kalit va eshik → ★ Uzun daraja; 13-qadamda ustoz
// o'yinini o'zi tuzatadi (−2 → −1); 3-bekatda ikki daraja yutildi, devor tomonga bosildi, kalitsiz eshik; «Kimgadir o‘ynating»; natija.
// Ishlatish (lokal server 5340 yoniq, demo-015 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/015-solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-015.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const id = () => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const tinch = () => gacha(() => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, 60000)
const keyingi = async () => { await p.click('#ilova .hn .asos.k-solo, #ust .hn .asos'); await p.waitForTimeout(700) }
const hint = () => matn('#ilova .hn .hint')
const bn = (p) => p.evaluate(() => (document.querySelector('#ilova .xk-bn') || {}).textContent || '')
const muam = () => p.evaluate(() => { const m = document.querySelector('#ilova .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' })
const yol = [], qayd = async () => { const e = await id(); if (yol[yol.length - 1] !== e) yol.push(e); return e }
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown', ' ': ' ' }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch() } await p.waitForTimeout(350) }
const oyinT = () => p.evaluate(() => (document.querySelector('#ilova .hn .ishga:not([hidden])') ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)'))
const boshla = async () => { await p.click(await oyinT()); await p.waitForTimeout(500); await tinch() }
const toxtat = async () => { await p.click(await oyinT()); await p.waitForTimeout(400) }
const roy = () => p.evaluate(() => Array.from(document.querySelectorAll('#ilova .xk-rq .xk-r')).map((x) => (x.classList.contains('ok') ? '✓' : x.classList.contains('hozir') ? '>' : '·') + x.textContent.replace(/^[✓★0-9]/, '').trim()).join(' | '))
const sarl = () => p.evaluate(() => [document.querySelector('#ilova .ust .tag')?.textContent, document.querySelector('#ilova .ust .sar')?.textContent].join(' · '))
const dastur = (g) => p.evaluate((g) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  const ichiga = (ota, q) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else ota.getInput('DO').connection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } }
  g.forEach(([h, ...q], i) => { const hb = blYangi(ws, h[0], h[1]); hb.moveTo(new Blockly.utils.Coordinate(0, i * 90)); let o = hb; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); o.nextConnection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } })
  blTartib(ws); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, g).then(() => p.waitForTimeout(500))
const QOIDA = ['right', 'left', 'up', 'down'].map((y) => [['k', y], ['a', y, [[{ right: 'r', left: 'l', up: 'u', down: 'd' }[y]]]]])
// labirint yasash (10-dars sinovidagi usul): katakni haqiqiy sichqoncha bilan bosish
const m = (s) => s.replace(/·/g, '.').replace(/★/g, '*')
const LB = { NY: '·####·★|····#·#|#·#·#·#|#·#····|S··###·', NK1: '·####E★|····#·#|#K#·#·#|#·#····|S··###·', NKY: '·K···E★|·#·####|·#·····|######·|S······' }
const Y = { D1: '→↑↑↑↓↓↓→→↑↑→→→↑↑', NY: '→↑↑↑→→↓↓→→↑↑↑→', NK1: '→↑↑↑→→↓↓→→↑↑↑→', NKY: '→→→→→→↑↑←←←←↑↑←→→→→→' }
const katak = async (x, y) => { const pt = await p.evaluate(([x, y]) => { const k = document.querySelector('#ilova .katak.maydon'), svg = k.querySelector('svg.kt'), H = katakXarita(k.dataset.xarita).length, pnt = svg.createSVGPoint(); pnt.x = x * KT + 50; pnt.y = (H - 1 - y) * KT + 50; const q = pnt.matrixTransform(svg.getScreenCTM()); return [q.x, q.y] }, [x, y]); await p.mouse.click(pt[0], pt[1]); await p.waitForTimeout(120) }
const asbob = async (a) => { await p.click(`#ilova .pl .asb[data-t="${a}"]`); await p.waitForTimeout(100) }
const yasa = async (nm) => {
  const maq = m(LB[nm]).split('|'), H = maq.length, hoz = () => p.evaluate(() => document.querySelector('#ilova .katak').dataset.xarita.split('|'))
  let h = await hoz(); await asbob('devor')
  for (let q = 0; q < H; q++) for (let x = 0; x < 7; x++) if ((maq[q][x] === '#') !== (h[q][x] === '#')) await katak(x, H - 1 - q)
  for (const [as, ch] of [['kalit', 'K'], ['eshik', 'E']]) { h = await hoz(); const t = maq.join('').indexOf(ch); if (t >= 0) { if (h[Math.floor(t / 7)][t % 7] !== ch) { await asbob(as); await katak(t % 7, H - 1 - Math.floor(t / 7)) } } else { const e = h.join('').indexOf(ch); if (e >= 0) { await asbob(as); await katak(e % 7, H - 1 - Math.floor(e / 7)) } } }
  await asbob('devor')
}

await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo'); await p.waitForTimeout(1000)
tek('B0', (await qayd()) === 'B0'); await p.click('#ilova .hn .asos'); await p.waitForTimeout(500)
tek('P1', (await qayd()) === 'P1'); await keyingi(); tek('P2N', (await qayd()) === 'P2N'); await p.locator('#bol .jk').nth(2).click(); await p.waitForTimeout(900)
tek('P2S: har kartada «▶ Sinab ko‘rish»', (await qayd()) === 'P2S' && (await p.$$('#ust .hk-sinab')).length === 3)
for (let i = 0; i < 3; i++) { await p.locator('#ust .jk').nth(i).locator('.hk-sinab').click(); await p.waitForTimeout(300); await gacha((n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, i + 1, 60000) }
tek('P2S: uchala kartani o‘zi sinadi', await p.evaluate(() => [...document.querySelectorAll('#ust .jk .jn')].map((x) => x.textContent).join(' | ')) === '✕ ikkalamiz bir ishni qildik | ✕ ikki yarim o‘yin | ✓ bitta to‘liq o‘yin')
await keyingi(); tek('P2C', (await qayd()) === 'P2C'); await keyingi(); tek('P3', (await qayd()) === 'P3')
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) } tek('P3: uch bo‘lak o‘zi yoqildi', (await p.$$('#ust .xs-b.on')).length === 3 && (await id()) === 'P3')
await keyingi(); tek('P4', (await qayd()) === 'P4'); await keyingi()
for (let k = 0; k < 3; k++) { await p.click('#ust .hn .asos'); await p.waitForTimeout(150) } tek('P6: uch qator; solo ishorasi', (await qayd()) === 'P6' && (await p.$$('#ust .xyl .xq.on')).length === 3)
await keyingi(); tek('8-qadam (juftlik) yo‘q — BT', (await qayd()) === 'BT')
await p.click('#bol .xk-o[data-o=lab]'); await p.waitForTimeout(300)
tek('BT: Labirint — «Kalit va eshik» xira («2-daraja bilan»)', (await p.$$('#bol .xk-qk.yop[data-q=kalit]')).length === 1 && (await matn('#bol .xk-qk[data-q=kalit] em')) === '2-daraja bilan')
await p.click('#bol .xk-qk[data-q=daraja2]'); await p.waitForTimeout(150); await p.click('#bol .xk-qk[data-q=kalit]'); await p.waitForTimeout(150)
await p.click('#bol .hn .asos'); await p.waitForTimeout(300); await p.click('#bol .hn .asos'); await p.waitForTimeout(700)
tek('P4B', (await qayd()) === 'P4B'); await keyingi(); await p.waitForTimeout(500)
tek('BXL: «Xakaton · 1-qism · Strelka va qoida», rollar yo‘q', (await qayd()) === 'BXL' && (await sarl()) === 'Xakaton · 1-qism · Strelka va qoida' && !(await p.$('#bol .xk-rr')), await sarl())
await dastur(QOIDA); await boshla(); await bos('→↑'); tek('BXL: qoida — devor tomonga ↑ — urilmadi', !(await muam()), await muam()); await toxtat(); await p.waitForTimeout(1900)
tek('BXL: 1-qism tayyor → 2-qism o‘zi ochildi: 2-daraja, «Labirint» asboblari', (await sarl()) === 'Xakaton · 2-qism · 2-daraja' && (await p.$$('#bol .pl .asb')).length === 4, await sarl())
tek('BXL: tugma «▶ Sinab ko‘rish», o‘lchov', (await matn(await oyinT())) === '▶ Sinab ko‘rish' && /Devor: 0/.test(await matn('#bol .olchov')), await matn('#bol .olchov'))
await yasa('NY'); await boshla(); await bos(Y.NY); await p.waitForTimeout(1900)
tek('BXL: 2-daraja yutildi → 3-qism: Kalit va eshik', (await sarl()) === 'Xakaton · 3-qism · Kalit va eshik', (await sarl()) + ' / ' + (await hint()))
await yasa('NK1'); await boshla(); await bos(Y.NK1); await p.waitForTimeout(1900)
tek('BXL: uch qism tayyor → ★ Uzun daraja o‘zi ochildi', (await sarl()) === 'Xakaton · ★ qo‘shimcha · Uzun daraja', (await sarl()) + ' / ' + (await hint()))
await yasa('NKY'); await boshla(); await bos(Y.NKY); await p.waitForTimeout(900)
tek('BXL: ★ tayyor — hammasi ✓', (await roy()).split(' | ').every((x) => x[0] === '✓'), await roy())
await keyingi(); tek('P4C', (await qayd()) === 'P4C'); await keyingi()
tek('P8: ustoz o‘yini tayyor; solo ishorasi', (await qayd()) === 'P8' && (await hint()) === 'Kaktusga ataylab tegib ko‘ring — jon 0 da tugaydimi?', await hint())
await boshla(); await bos('→→→→↑↑'); tek('P8: −2 — Kamvoy «Jon tugadi-ku!»', (await muam()) === 'kamvoy:Jon tugadi-ku!', await muam()); await toxtat()
await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.getAllBlocks(false).find((x) => x.type === 'change_var' && x.getFieldValue('VAR') === 'jon').setFieldValue('-1', 'N'); sanoq(ek) })
await boshla(); await bos('→→→→↑↑↑'); tek('P8: −1 — «Jon 0 da tugaydi» ✓', /✓Jon 0 da tugaydi/.test(await roy()), await roy())
await keyingi(); tek('BSL', (await qayd()) === 'BSL')
tek('BSL: daraja 1 / 2', (await matn('#bol .daraja-yz b')) === '1 / 2', await matn('#bol .daraja-yz b'))
await boshla(); await bos('↓' + Y.D1); await p.waitForTimeout(1800); await bos(Y.NKY); await p.waitForTimeout(500)
tek('BSL: ikki daraja yutildi ✓, devor tomonga ✓', /✓Ikki daraja yutildi/.test(await roy()) && /✓Devor tomonga bosildi/.test(await roy()) && /✓O‘yin yutildi/.test(await roy()), await roy())
await boshla(); await bos('→→→↑↑→→'); await p.waitForTimeout(300)
tek('BSL: kalitsiz eshik ochilmadi ✓', /✓Kalitsiz eshik ochilmadi/.test(await roy()), await roy())
tek('BSL: «O‘yiningiz sinaldi!»', (await bn(p)) === 'O‘yiningiz sinaldi!' || (await roy()).split(' | ').slice(0, -1).every((x) => x[0] === '✓'), (await hint()) + ' / ' + (await roy()))
await keyingi(); tek('BDL: «Kimgadir o‘ynating»', (await qayd()) === 'BDL' && (await hint()) === 'Kimgadir o‘ynating — uydagilardan biri o‘ynasa bo‘ladi', await hint())
await boshla(); await bos('→↑↑'); await toxtat(); await p.waitForTimeout(400)
await p.click('#bol .xk-yk[data-k=yana]'); await p.click('#bol .xk-yq-t'); await p.waitForTimeout(500)
tek('BDL: natija — devor oldida to‘xtadi', /^Do‘stlaringiz o‘ynadi: yulduzgacha yetmadi · \d+ marta devor oldida to‘xtadi · Yoqdi: Yana o‘ynayman$/.test(await matn('#bol .xk-dn b')), await matn('#bol .xk-dn b'))
await keyingi(); tek('16, 18-qadam yo‘q — B5', (await qayd()) === 'B5'); await p.waitForTimeout(600)
const son = () => p.evaluate(() => ['ta qism yasadingiz', 'ikkalangiz ham haydadingiz ✓', 'marta o‘ynab ko‘rildi'].map((k) => { const t = document.querySelector('#bol .sn-t[data-k="' + k + '"]'); return t ? (t.hidden ? 'yo‘q' : t.querySelector('b').textContent) : '-' }).join(','))
tek('B5: 4 qism · (solo — «ikkalangiz» yo‘q) · 1 marta', (await son()) === '4,yo‘q,1', await son())
const KUT = 'B0 P1 P2N P2S P2C P3 P4 P6 BT P4B BXL P4C P8 BSL BDL B5'
tek('solo yo‘li: 8, 16, 18-qadamsiz', yol.join(' ') === KUT, yol.join(' '))
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

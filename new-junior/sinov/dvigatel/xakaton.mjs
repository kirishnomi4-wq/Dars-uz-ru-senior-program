// 15-dars «Xakaton №1» — qismlar sinovi (21.11; manba 015 KOD 15). To'liq dars sinovlarida bo'lmagan qismlar: «Olma terish» — Qadam, Quvonch;
// «Labirint» — Qadam tovushi, Startga qaytish. Har qism: namunaviy yechim (jadval) bilan «Qism tayyor», yechimsiz — tayyor emas; 3-bekatda sinash bandi.
// Yana: «Qadam yetmaydi» (set qadam eng qisqa yo'ldan kam), tanlanmagan qism muammochasizligi, tugamagan qism o'yinni buzsa — «Tugamagan qism: …».
// Holat (K+'xk') to'g'ridan-to'g'ri yoziladi, ekran solo yo'lidan ochiladi (BX — 10, BS — 13).
// Ishlatish (lokal server 5340 yoniq, demo-015 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/dvigatel/xakaton.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-015.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) xato.push(m.text()) })
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const gacha = async (f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const tinch = () => gacha(() => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, 60000)
const hint = () => matn('#ilova .hn .hint')
const bn = (p) => p.evaluate(() => (document.querySelector('#ilova .xk-bn') || {}).textContent || '')
const muam = () => p.evaluate(() => { const m = document.querySelector('#ilova .dv-muam'); return m ? (m.className.match(/m-(\w+)/) || [])[1] + ':' + m.textContent.trim() : '' })
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown', '_': 'Space' }
const bos = async (s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch() } await p.waitForTimeout(350) }
const oyinT = () => p.evaluate(() => (document.querySelector('#ilova .hn .ishga:not([hidden])') ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)'))
const boshla = async () => { await p.click(await oyinT()); await p.waitForTimeout(500); await tinch() }
const toxtat = async () => { if (await p.evaluate(() => !!document.querySelector('#ilova .ekran[data-oyin]'))) { await p.click(await oyinT()); await p.waitForTimeout(400) } }
const roy = () => p.evaluate(() => Array.from(document.querySelectorAll('#ilova .xk-rq .xk-r')).map((x) => (x.classList.contains('ok') ? '✓' : x.classList.contains('hozir') ? '>' : '·') + x.textContent.replace(/^[✓★0-9]/, '').trim()).join(' | '))
const sar = () => matn('#ilova .ust .sar')
const dastur = (g) => p.evaluate((g) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  const ichiga = (ota, q) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else ota.getInput('DO').connection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } }
  g.forEach(([h, ...q], i) => { const hb = blYangi(ws, h[0], h[1]); hb.moveTo(new Blockly.utils.Coordinate(0, i * 90)); let o = hb; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); o.nextConnection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } })
  blTartib(ws); ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, g).then(() => p.waitForTimeout(500))
// holatni yozib, solo yo'lidagi ekranni ochish (q — solo qadami: 10 — yasash, 13 — sinash)
const och = async (xk, q) => { await p.goto(U + '?rol=varaq'); await p.evaluate(([xk, q]) => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr015-xk', JSON.stringify(xk)); localStorage.setItem('demo-jr015-solo', q + ':0') }, [xk, q]); await p.goto(U + '?rol=solo'); await p.waitForTimeout(1500) }
const xk = (oyin, qism, tayyor = []) => ({ oyin, qism, tanladi: 1, tayyor: Object.fromEntries(tayyor.map((x) => [x, 1])), kim: {}, sina: {}, iz: {}, haydovchi: 1, dost: [] })
const TORT = [[['k', 'right'], ['r']], [['k', 'left'], ['l']], [['k', 'up'], ['u']], [['k', 'down'], ['d']]]
const QOIDA = (tov = false) => ['right', 'left', 'up', 'down'].map((y) => [['k', y], ['a', y, [[{ right: 'r', left: 'l', up: 'u', down: 'd' }[y]], ...(tov ? [['n', 'qadam']] : [])]]])
const QADAM = (n) => [[['f'], ['z', 'qadam:' + n]], [['k', 'any'], ['c', 'qadam:-1'], ['i', 'qadam:0', [['g']]]]]
const QUVONCH = [[['q', 'apple'], ['v', 'xursand'], ['n', 'jiring']]]
const YUTISH = '→→→→→↑↑←←←↑↑→→→→' // 16 bosish: (5, 0) · (2, 2) · (3, 4) · yulduz (6, 4)

// ---------- Olma terish: Qadam ----------
await och(xk('olma', ['strelka', 'qadam', 'quvonch'], ['strelka']), 10)
tek('Qadam: hozirgi qism — «Qadam»', (await sar()) === 'Qadam', await sar())
await dastur([...TORT, ...QADAM(10)]); await boshla(); await bos('→'); await toxtat()
tek('Qadam: set qadam 10 — «Qadam yetmaydi — yulduzgacha yetib bo‘lmaydi», tayyor emas', (await hint()) === 'Qadam yetmaydi — yulduzgacha yetib bo‘lmaydi' && (await sar()) === 'Qadam', await hint())
await dastur([...TORT, ...QADAM(20)]); await boshla(); await bos('→'); await toxtat(); await p.waitForTimeout(1900)
tek('Qadam: set qadam 20 — tayyor, keyingisi «Quvonch»', (await sar()) === 'Quvonch', (await sar()) + ' / ' + (await hint()))
await boshla(); await bos('→→→→→'); tek('Quvonch: olma dasturchasisiz — 7-dars muammochasi (hozirgi qism)', /^boshvoy:/.test(await muam()), await muam()); await toxtat()
await dastur([...TORT, ...QADAM(20), ...QUVONCH]); await boshla(); await bos('→→→→→'); await toxtat(); await p.waitForTimeout(800)
tek('Quvonch: kostyum va tovush olma hodisasida — tayyor', (await roy()).split(' | ').filter((x) => !x.includes('Haydovchi')).every((x) => x[0] === '✓'), await roy())
// 3-bekat: qadam 0 da tugaydi, quvonch, yutish
await p.evaluate(() => localStorage.setItem('demo-jr015-solo', '13:0')); await p.goto(U + '?rol=solo'); await p.waitForTimeout(1500)
tek('BSO: sinash bandlari bo‘sh', (await roy()) === '✓To‘rt strelka | ·Har strelka o‘z tomoniga | ✓Qadam | ·Qadam 0 da tugaydi | ✓Quvonch | ·Olma terilganda — xursand va ♪ | ·O‘yin yutildi | ·Do‘stlar o‘ynadi', await roy())
await boshla(); await bos('→→→→→'); tek('BSO: olma terildi — «xursand va ♪» ✓ shu zahoti', /✓Olma terilganda/.test(await roy()), await roy())
await bos('↑↑←←←↑↑→→→→'); await p.waitForTimeout(400); tek('BSO: yutdi (16 bosish, qadam 20) ✓', /✓O‘yin yutildi/.test(await roy()), await roy())
await boshla(); await bos('↑↓'.repeat(10)); await p.waitForTimeout(400)
tek('BSO: 20-bosishda — «O‘yin tugadi», «Qadam 0 da tugaydi» ✓', !!(await p.$('#ilova .oyin-tugadi')) && /✓Qadam 0 da tugaydi/.test(await roy()), await roy())
tek('BSO: hamma band ✓ (↓ ham yurdi) — «O‘yiningiz sinaldi!»', (await bn(p)) === 'O‘yiningiz sinaldi!' && /✓Har strelka/.test(await roy()), (await hint()) + ' / ' + (await roy()))
// tugamagan qism o'yinni buzadi: Jon tanlangan, tayyor emas — kaktus dasturchasida bo'sh if
await och(xk('olma', ['strelka', 'ball', 'jon'], ['strelka', 'ball']), 13)
tek('BSO: tugamagan qism — xira, «tugamagan»', /·Jon tugamagan/.test(await roy()), await roy())
await dastur([...TORT, [['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'apple'], ['c', 'ball:1']], [['q', 'cactus'], ['i', 'jon:0']]]); await boshla()
tek('BSO: bo‘sh if — Bo‘shvoy «Ichi bo‘sh-ku…»', (await muam()) === 'boshvoy:Ichi bo‘sh-ku…', await muam())

// ---------- Labirint: Qadam tovushi, Startga qaytish ----------
await och(xk('lab', ['qoida', 'tovush', 'start'], ['qoida']), 10)
tek('Lab: hozirgi qism — «Qadam tovushi»', (await sar()) === 'Qadam tovushi', await sar())
await dastur(QOIDA()); await boshla(); await bos('→'); await toxtat(); tek('Lab: tovushsiz — tayyor emas', (await sar()) === 'Qadam tovushi', await sar())
await dastur([...QOIDA(true)]); await boshla(); await bos('→↓'); await toxtat(); await p.waitForTimeout(1900)
tek('Lab: if ichida tovush, yurganda chalindi — tayyor; keyingisi «Startga qaytish»', (await sar()) === 'Startga qaytish', (await sar()) + ' / ' + (await hint()))
await dastur([...QOIDA(true), [['k', 'space'], ['x', '1,1']]]); await boshla(); await bos('→_'); tek('Lab: go to (1, 1) — Kamvoy «Bu start emas!»', (await muam()) === 'kamvoy:Bu start emas!', await muam()); await toxtat()
await dastur([...QOIDA(true), [['k', 'space'], ['x', '0,0']]]); await boshla(); await bos('→_'); await toxtat(); await p.waitForTimeout(900)
tek('Lab: space → (0, 0) — tayyor', (await roy()).split(' | ').filter((x) => !/Haydovchi/.test(x)).every((x) => x[0] === '✓'), await roy())
await p.evaluate(() => localStorage.setItem('demo-jr015-solo', '13:0')); await p.goto(U + '?rol=solo'); await p.waitForTimeout(1500)
await boshla(); await bos('↓→'); tek('BSL: turganda jim, yurganda ♪ — ✓', /✓Yurganda ♪, turganda jim/.test(await roy()), await roy())
await bos('_'); tek('BSL: space — qahramon startda ✓', /✓Tugma bosildi — qahramon startda/.test(await roy()), await roy())
tek('konsolda xato yo‘q', !xato.length, xato.slice(0, 3).join(' | '))
console.log(`\nNATIJA: ${ok} / ${jami}`); await b.close()
process.exit(ok === jami ? 0 : 1)

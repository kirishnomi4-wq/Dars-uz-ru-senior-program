// 16-dars «Klonlar» — 3-bekat o'yinlari sinovi (21.11; manba 016 KOD 12): namunaviy dushman dasturi bilan har pog'ona 6 xil urug'da o'ynaladi —
// dodge-bot (nusxa qahramon ustunida y ≤ 2 yoki yerda bo'lsa — yon tomonga) har safar yutishi kerak (o'yin yutiladigan).
// Ishlatish (lokal server 5340 yoniq, demo-016 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/dvigatel/klon.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-016.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
let xatoBor = false
const P = { B3A: [1, [[['f'], ['p', '5', [['C']]]], [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']]]], B3B: [2, [[['f'], ['p', '8', [['C']]]], [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']]]], B3C: [3, [[['f'], ['p', '6', [['C']]]], [['H'], ['y', 'r1-5,4'], ['p', '4', [['d']]], ['D']]]] }
for (const [id, [i, prog]] of Object.entries(P)) {
  const r = { yut: 0, tug: 0, boshqa: [] }
  for (let seed = 1; seed <= 6; seed++) {
    const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
    await p.goto(U + '?rol=varaq'); await p.evaluate((i) => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol'); localStorage.setItem('demo-jr016-solo', '14:' + i) }, i - 1)
    await p.goto(U + '?rol=solo'); await p.waitForTimeout(1300)
    await p.evaluate((sd) => { let u = sd * 7919; Math.random = () => { u = (u * 1103515245 + 12345) % 2147483648; return u / 2147483648 } }, seed)
    await p.evaluate((g) => { const ek = document.querySelector('#ilova .ekran'); klonQur(ek, g) }, prog); await p.waitForTimeout(500)
    await p.click('#ilova .hn .ishga'); await p.waitForTimeout(300)
    for (let t = 0; t < 400; t++) {
      const st = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'), s = ek.__klon; if (!ek.dataset.oyin || !s || !s.h) return null; return { x: s.h.x, n: s.nusxa.filter((n) => !n.ochdi).map((n) => [n.x, n.y, !!n.yerda]) } })
      if (!st) break
      const xavf = (x) => st.n.some(([a, c, yer]) => a === x && (c <= 2 || yer))
      if (xavf(st.x)) { const yon = [st.x - 1, st.x + 1].filter((x) => x >= 0 && x <= 6 && !xavf(x)); if (yon.length) await p.keyboard.press(yon[0] < st.x ? 'ArrowLeft' : 'ArrowRight') }
      await p.waitForTimeout(110)
    }
    const h = await p.evaluate(() => document.querySelector('#ilova .hn .hint').textContent)
    if (h === 'Siz yutdingiz!') r.yut++; else if (/Jon tugadi/.test(h)) r.tug++; else r.boshqa.push(h)
    await p.context().close()
  }
  console.log((r.yut === 6 ? '✓ ' : '✗ ') + id + ': ' + r.yut + ' / 6 yutdi' + (r.tug ? ', ' + r.tug + ' marta jon tugadi' : '') + (r.boshqa.length ? ' — ' + r.boshqa.join(' | ') : ''))
  if (r.yut !== 6) xatoBor = true
}
await b.close()
console.log(xatoBor ? 'NATIJA: muammo bor' : 'NATIJA: toza')
process.exit(xatoBor ? 1 : 0)

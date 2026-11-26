// 18-dars B1C: hozirgi va taklif qilingan «Hammasi bir ustundan tushdi» ishorasi — darsning o'z muammo()/ishora() funksiyasi bilan
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const O = process.argv[2]
const U = 'http://localhost:5340/demo-018.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
const xato = []; p.on('pageerror', (e) => xato.push(e.message))
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo&xona=surat18'); await p.waitForTimeout(900)
const SOLO = await p.evaluate(() => (window.__jrSinov ? window.__jrSinov.SOLO_R : SOLO_R))
let topildi = false
for (const q of Object.keys(SOLO).map(Number)) { const i = SOLO[q].indexOf('B1C'); if (i >= 0) { await p.evaluate(([q, i]) => { if (window.__jrSinov) return window.__jrSinov.bor(q, i); qadam = q; ichki = i; chiz() }, [q, i]); topildi = true; break } }
await p.waitForTimeout(900)
console.log('ekran', await p.evaluate(() => document.querySelector('#ilova .ekran').dataset.id), topildi)
const variant = [['hozir', 'Hammasi bir ustundan tushdi. Son o‘rniga random qo‘ying'], ['taklif', 'Hammasi bir ustundan tushdi. Nusxa boshiga go to qo‘ying, x — random']]
for (const [nom, gap] of variant) {
  await p.evaluate((gap) => { const ek = document.querySelector('#ilova .ekran'); muammo(ek, 'kamvoy', 'Yana o‘sha joy!'); ishora(ek, gap) }, gap)
  await p.waitForTimeout(900)
  await p.screenshot({ path: `${O}/d018-B1C-${nom}.png` })
}
console.log('xato:', xato.length ? xato : 'yo‘q')
await b.close()

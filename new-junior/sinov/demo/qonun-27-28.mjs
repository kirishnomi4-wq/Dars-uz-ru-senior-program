// 27-qonun: asosiy tugmaning o'ng cheti hamma qadamda bir xil · 28-qonun: qahramon yurganda zonachalar joyida
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const u = await (await b.newContext({ viewport: { width: 1600, height: 900 } })).newPage()
await u.goto('http://localhost:5340/demo.html?rol=ustoz&yangi=1&xona=qonun'); await u.waitForTimeout(800)
const n = await u.$$eval('select[data-a=sakra] option', (a) => a.length), ong = []
for (let i = 0; i < n; i++) { await u.selectOption('select[data-a=sakra]', String(i)); await u.waitForTimeout(350)
  ong.push(await u.evaluate(() => { const ek = document.querySelector('#ust .ekran').getBoundingClientRect(), a = document.querySelector('#ust .hn > .asos:last-child'); return [document.querySelector('#ust .ekran').dataset.id, a ? +((a.getBoundingClientRect().right - ek.left) / ek.width * 100).toFixed(1) : null, a ? a.textContent.trim() : ''] })) }
const qiy = ong.filter((x) => x[1] != null).map((x) => x[1]), farq = Math.max(...qiy) - Math.min(...qiy)
console.log((farq <= 0.5 ? '✓' : '✗') + ' 27-qonun: asosiy tugma o‘ng cheti ' + Math.min(...qiy) + '…' + Math.max(...qiy) + '% (' + qiy.length + ' qadam)')
ong.filter((x) => x[1] == null).forEach((x) => console.log('   tugmasiz qadam:', x[0]))
// zonachalar: Coddy sanaydi (P6) — yurish oldidan va oxirida
await u.selectOption('select[data-a=sakra]', '11'); await u.waitForTimeout(700)
const zona = () => u.$$eval('#ust .oyna .yol .z', (a) => a.map((z) => Math.round(z.getBoundingClientRect().left)))
const z0 = await zona(); await u.click('#ust .hn .ishga'); await u.waitForTimeout(1100); const z1 = await zona(); await u.waitForTimeout(2600); const z2 = await zona()
console.log((JSON.stringify(z0) === JSON.stringify(z1) && JSON.stringify(z0) === JSON.stringify(z2) ? '✓' : '✗') + ' 28-qonun: zonachalar joyida', z0.join(','), '|', z1.join(','), '|', z2.join(','))
await b.close()

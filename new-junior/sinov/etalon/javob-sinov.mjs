// Sahifa ishlashini sinaydi: javob tugmalari va nusxa matni, eski jadval, setka tugmasi, kattalashtirish, xato yo'qligi, telefonda yonga siljish.
// Ishlatish: node new-junior/sinov/etalon/javob-sinov.mjs [sahifa.html]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const p = await b.newPage({ viewport: { width: 1300, height: 900 } })
const err = []; p.on('pageerror', (e) => err.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') err.push(m.text()) })
await p.goto('file://' + (process.argv[2] || new URL('../../etalon/etalon.html', import.meta.url).pathname)); await p.waitForTimeout(800)
await p.click('figure[data-id="P1"] .ov button[data-v="qabul"]')
await p.click('figure[data-id="P4"] .ov button[data-v="boshqa"]'); await p.fill('figure[data-id="P4"] .ov input', 'sinov izohi')
console.log(await p.textContent('.javob-m'))
console.log('ekranlar:', await p.$$eval('figure[data-id]', (f) => f.map((x) => x.dataset.id).join(' ')))
console.log('P2B yo‘q:', !(await p.$('figure[data-id="P2B"]')), '· tanlov qolmadi:', (await p.$$('.tanlov')).length === 0)
await p.click('details.eski summary'); console.log('eski jadval ochildi:', await p.$eval('details.eski', (d) => d.open))
await p.click('.setka-b'); console.log('setka:', await p.evaluate(() => document.documentElement.hasAttribute('data-setka')))
await p.click('figure[data-id="P8"] .ekran'); console.log('kattalashdi:', !!(await p.$('.katta-fon'))); await p.keyboard.press('Escape')
console.log('xato:', err.length ? err : 'yo‘q')
const t = await b.newPage({ viewport: { width: 390, height: 844 } }); await t.goto('file://' + (process.argv[2] || new URL('../../etalon/etalon.html', import.meta.url).pathname)); await t.waitForTimeout(800)
console.log('telefon gorizontal aylantirish:', await t.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1 ? 'BOR ' + document.documentElement.scrollWidth : 'yo‘q'))
await b.close()

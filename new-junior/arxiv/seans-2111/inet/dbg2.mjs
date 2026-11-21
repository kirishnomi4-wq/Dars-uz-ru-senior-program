import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const P = process.argv[2] || '5360', U = `http://localhost:${P}/demo-013.html`, X = 'T' + Date.now().toString(36).slice(-4).toUpperCase()
const oy = async (n) => { const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage(); p.on('pageerror', (e) => console.log(n, 'XATO', e.message)); return p }
const u = await oy('u'), a = await oy('a'), l = await oy('l')
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele') })
await l.goto(U + '?rol=varaq'); await l.evaluate(() => localStorage.clear())
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`); await l.goto(`${U}?rol=bola&xona=${X}`)
const hol = async (t) => console.log(t, '| u:', await u.evaluate(() => document.querySelector('#ust .ekran')?.dataset.id + ' ' + document.querySelector('#ust .hn .hint')?.textContent), '| a:', await a.evaluate(() => document.querySelector('#ilova .ekran')?.dataset.id), '| l:', await l.evaluate(() => (document.querySelector('#ilova .ekran')?.dataset.id) + ' ' + (document.querySelector('#ei') ? 'ism-maydoni' : '')))
await u.waitForTimeout(3000); await hol('3s')
await l.fill('#ei', 'Lola'); await l.click('#ef button'); await u.waitForTimeout(1500); await hol('ism')
await l.locator('#bol .tq-o').nth(4).click(); await u.waitForTimeout(3000); await hol('qah')
await u.waitForTimeout(8000); await hol('+8s')
await b.close()

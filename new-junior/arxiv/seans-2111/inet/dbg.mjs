import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const P = process.argv[2] || '5360', D = process.argv[3] || '013', U = `http://localhost:${P}/demo-${D}.html`, X = 'T' + Date.now().toString(36).slice(-4).toUpperCase()
const oy = async (n) => { const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage(); const so = []; p.on('request', (r) => { if (/sinf/.test(r.url())) so.push(r.method() + ' ' + r.url().replace(/^.*\/(api\/sinf|__sinf)/, '$1').slice(0, 60)) }); p.on('console', (m) => { if (m.type() === 'error') console.log(n, 'KONSOL', m.text().slice(0, 150)) }); p.on('pageerror', (e) => console.log(n, 'XATO', e.message)); p.so = so; return p }
const u = await oy('u'), a = await oy('a')
await a.goto(U + '?rol=varaq'); await a.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'jele') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await a.goto(`${U}?rol=bola&xona=${X}`)
await u.waitForTimeout(6000)
console.log('ustoz hint:', await u.evaluate(() => document.querySelector('#ust .hn .hint')?.textContent), '| aloqa:', await u.evaluate(() => document.querySelector('.ustoz-tasma')?.textContent.slice(-20)))
await u.click('#ust .hn .asos').catch((e) => console.log('click', e.message.slice(0, 80))); await u.waitForTimeout(4000)
console.log('bola ekran:', await a.evaluate(() => document.querySelector('#ilova .ekran')?.dataset.id), '| ustoz:', await u.evaluate(() => document.querySelector('#ust .ekran')?.dataset.id))
console.log('u so:', [...new Set(u.so)].slice(0, 6)); console.log('a so:', [...new Set(a.so)].slice(0, 6))
await b.close()

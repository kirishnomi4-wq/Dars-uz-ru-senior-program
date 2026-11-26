import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const [, , n, ID, oila, O, en = '1628', bo = '1182'] = process.argv
const U = 'http://localhost:5340/demo-' + n + '.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const p = await (await b.newContext({ viewport: { width: +en, height: +bo } })).newPage()
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo&xona=javon'); await p.waitForTimeout(900)
const SOLO = await p.evaluate(() => (window.__jrSinov ? window.__jrSinov.SOLO_R : SOLO_R))
for (const q of Object.keys(SOLO).map(Number)) { const i = SOLO[q].indexOf(ID); if (i >= 0) { await p.evaluate(([q, i]) => { if (window.__jrSinov) return window.__jrSinov.bor(q, i); qadam = q; ichki = i; chiz() }, [q, i]); break } }
await p.waitForTimeout(2000)
await p.click('#ilova .rg .rd.f-' + oila).catch((e) => console.log('oila yo‘q', e.message.slice(0, 80)))
await p.waitForTimeout(800)
const r = await p.evaluate(() => [...document.querySelectorAll('#ilova .pl .mbw:not(.yopiq) .mb')].map((m) => { const s = m.getBoundingClientRect(), pl = m.closest('.pl').getBoundingClientRect(); return m.textContent.trim().slice(0, 24) + ' w=' + Math.round(s.width) + ' sw=' + m.scrollWidth + ' cw=' + m.clientWidth + ' o‘ng=' + Math.round(s.right) + ' pl=' + Math.round(pl.right) }))
console.log(r.join('\n'))
const pl = await p.$('#ilova .pl'); if (pl) await pl.screenshot({ path: O })
await b.close()

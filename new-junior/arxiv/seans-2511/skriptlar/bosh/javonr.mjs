// Javon tuzatishining prototipi: sahifaga uslub qo'shib, har oila javonini o'lchaydi va suratga oladi
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const [, , n, ID, O] = process.argv
const CSS = ".pl .mb.sigmas:has(> .xy:last-child){flex-wrap:wrap}.pl .mb.sigmas:has(> .xy:last-child) > span:not(.xy){flex:1 1 0}.pl .mb.sigmas:has(> .xy:last-child)::after{content:\"\";flex-basis:100%;height:0;order:1}.pl .mb.sigmas:has(> .xy:last-child) > .xy{order:2;margin-top:.35cqw}"
const U = 'http://localhost:5340/demo-' + n + '.html'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo&xona=jp'); await p.waitForTimeout(900)
const SOLO = await p.evaluate(() => (window.__jrSinov ? window.__jrSinov.SOLO_R : SOLO_R))
for (const q of Object.keys(SOLO).map(Number)) { const i = SOLO[q].indexOf(ID); if (i >= 0) { await p.evaluate(([q, i]) => { if (window.__jrSinov) return window.__jrSinov.bor(q, i); qadam = q; ichki = i; chiz() }, [q, i]); break } }
await p.waitForTimeout(1800); await p.addStyleTag({ content: CSS }); await p.waitForTimeout(300)
const n2 = await p.$$eval('#ilova .rg .rd', (a) => a.length)
for (let k = 0; k < n2; k++) {
  await p.locator('#ilova .rg .rd').nth(k).click(); await p.waitForTimeout(300)
  const r = await p.evaluate(() => [...document.querySelectorAll('#ilova .pl .mbw:not(.yopiq) .mb')].filter((m) => m.getBoundingClientRect().width > 3).map((m) => m.textContent.trim().replace(/\s+/g, ' ').slice(0, 22) + (m.scrollWidth > m.clientWidth + 2 ? ' QIRQ+' + (m.scrollWidth - m.clientWidth) : ' ok') + ((() => { const c = [...m.children].map((x) => x.getBoundingClientRect()).filter((r) => r.width > 0); for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) { const a = c[i], b = c[j]; if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2) return ' MINDI' } for (const r of c) if (r.right > m.getBoundingClientRect().right + 1) return ' CHIQDI'; return '' })()) + ' h=' + Math.round(m.getBoundingClientRect().height)))
  console.log('oila', k, r.join(' | '))
  const pl = await p.$('#ilova .pl'); if (pl) await pl.screenshot({ path: `${O}-${k}.png` })
}
await b.close()

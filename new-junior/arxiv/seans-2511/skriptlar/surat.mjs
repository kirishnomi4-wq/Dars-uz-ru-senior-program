// Ko'rik sahifasi uchun surat: node surat.mjs <dars> <papka> <ID,ID,...>  — solo yo'lidagi va ustoz qadamlaridagi shu ekranlar
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const [, , n, O, ids] = process.argv
const kerak = new Set(ids.split(','))
const U = 'http://localhost:5340/' + (n === '001' ? 'demo.html' : 'demo-' + n + '.html')
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const bor = (p, q, i = 0) => p.evaluate(([q, i]) => { if (window.__jrSinov) return window.__jrSinov.bor(q, i); qadam = q; ichki = i; chiz() }, [q, i]).then(() => p.waitForTimeout(2500)).then(() => p.waitForFunction(() => !document.querySelector('.ekran[data-joylanmoqda]'), null, { timeout: 4000, polling: 50 }).catch(() => {}))
const malumot = (p) => p.evaluate(() => { const s = window.__jrSinov; return { QADAM: s ? s.QADAM : QADAM, SOLO: s ? s.SOLO_R : (typeof SOLO_R !== 'undefined' ? SOLO_R : {}) } })
const id = (p) => p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
const c = await b.newContext({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 1 }); const p = await c.newPage()
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo&xona=surat'); await p.waitForTimeout(900)
const { SOLO, QADAM } = await malumot(p)
for (const q of Object.keys(SOLO).map(Number).sort((a, c) => a - c)) for (let i = 0; i < SOLO[q].length; i++) {
  await bor(p, q, i); const e = await id(p)
  if (kerak.has(e)) { await p.screenshot({ path: `${O}/d${n}-s-${e}.png` }); console.log('solo', e, 'qadam', q + 1) }
}
await c.close()
const c2 = await b.newContext({ viewport: { width: 1440, height: 810 } }); const u = await c2.newPage()
await u.goto(U + '?rol=ustoz&yangi=1&xona=surat-u'); await u.waitForTimeout(900)
for (let q = 0; q < QADAM.length; q++) { await bor(u, q); const e = await id(u); if (kerak.has('u' + (q + 1)) || kerak.has('u-' + e)) { await u.screenshot({ path: `${O}/d${n}-u${q + 1}-${e}.png` }); console.log('ustoz', q + 1, e) } }
console.log('ustoz qadamlari:', QADAM.map((x, k) => (k + 1) + ':' + JSON.stringify(x[1]).slice(0, 12)).join(' '))
await c2.close(); await b.close()

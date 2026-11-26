// Sinf-supurish (25.11): pastki qatordagi tugmalarda belgi tugma foni bilan bir rangda (ko'rinmas) emasmi.
// Solo — har qadamning har ekrani; o'yin/ishga tugmasi bo'lsa: bosiladi → to'xtatiladi → qayta tekshiriladi. Ustoz — har qadam.
// Ishlatish: node supur.mjs 001 002 …  (lokal server 5340)
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const darslar = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const bor = (p, q, i = 0) => p.evaluate(([q, i]) => { if (window.__jrSinov) return window.__jrSinov.bor(q, i); qadam = q; ichki = i; chiz() }, [q, i]).then(() => p.waitForTimeout(400)).then(() => p.waitForFunction(() => !document.querySelector('.ekran[data-joylanmoqda]'), null, { timeout: 4000, polling: 50 }).catch(() => {}))
const malumot = (p) => p.evaluate(() => { const s = window.__jrSinov; return { QADAM: s ? s.QADAM : QADAM, SOLO: s ? s.SOLO_R : (typeof SOLO_R !== 'undefined' ? SOLO_R : {}) } })
const tekshir = (p, r) => p.evaluate((r) => {
  const rgb = (c) => { const m = (c || '').match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number).join(',') : '' }
  const fon = (el) => { for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return rgb(c) } return '255,255,255' }
  const out = []
  document.querySelectorAll(r + ' .hn .mas, ' + r + ' .hn .asos, ' + r + ' .hn .ishga').forEach((t) => {
    const rb = t.getBoundingClientRect(); if (!rb.width || getComputedStyle(t).visibility === 'hidden') return
    const f = fon(t)
    t.querySelectorAll('svg path, svg rect, svg circle, svg polygon').forEach((s) => {
      const cs = getComputedStyle(s), sb = s.getBoundingClientRect(); if (!sb.width && !sb.height) return
      const fl = cs.fill !== 'none' ? rgb(cs.fill) : null, st = cs.stroke !== 'none' ? rgb(cs.stroke) : null
      const korinadi = (fl && fl !== f) || (st && st !== f)
      if (!korinadi) out.push(t.textContent.trim().slice(0, 24) + ' [fon ' + f + ', belgi ' + (fl || st) + ']')
    })
  })
  return [...new Set(out)]
}, r)
let jamiXato = 0
for (const n of darslar) {
  const U = 'http://localhost:5340/' + (n === '001' ? 'demo.html' : n === 'eski9' ? 'demo-eski9.html' : 'demo-' + n + '.html')
  const ctx = await b.newContext({ viewport: { width: 1440, height: 810 } }); const p = await ctx.newPage()
  await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
  await p.goto(U + '?rol=solo&xona=supur'); await p.waitForTimeout(900)
  const { SOLO, QADAM } = await malumot(p)
  let ekranlar = 0, bosildi = 0; const xato = []
  for (const q of Object.keys(SOLO).map(Number).sort((a, c) => a - c)) for (let i = 0; i < SOLO[q].length; i++) {
    await bor(p, q, i); ekranlar++
    const id = await p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
    for (const x of await tekshir(p, '#ilova')) xato.push('solo ' + id + ': ' + x)
    const t = await p.$('#ilova .hn .ishga')
    if (t && /Boshla|Sinab|Ishga|Tekshir|O‘ynab/.test(await t.textContent())) {
      bosildi++
      await t.click().catch(() => {}); await p.waitForTimeout(700)
      for (const x of await tekshir(p, '#ilova')) xato.push('solo ' + id + ' (o‘yin paytida): ' + x)
      const t2 = await p.$('#ilova .hn .ishga'); if (t2 && /To‘xtat|■/.test(await t2.textContent())) { await t2.click().catch(() => {}); await p.waitForTimeout(500) }
      await p.waitForFunction(() => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, { timeout: 15000, polling: 100 }).catch(() => {})
      for (const x of await tekshir(p, '#ilova')) xato.push('solo ' + id + ' (to‘xtagach): ' + x)
    }
  }
  await ctx.close()
  const c2 = await b.newContext({ viewport: { width: 1440, height: 810 } }); const u = await c2.newPage()
  await u.goto(U + '?rol=ustoz&yangi=1&xona=supur-u'); await u.waitForTimeout(900)
  for (let q = 0; q < QADAM.length; q++) { await bor(u, q); for (const x of await tekshir(u, '#ilova')) xato.push('ustoz ' + (q + 1) + '-qadam: ' + x) }
  await c2.close()
  const uniq = [...new Set(xato)]; jamiXato += uniq.length
  console.log(n + ': solo ' + ekranlar + ' ekran (o‘yin tugmasi bosildi ' + bosildi + '), ustoz ' + QADAM.length + ' qadam — ' + (uniq.length ? uniq.length + ' TOPILMA' : 'toza'))
  uniq.slice(0, 8).forEach((x) => console.log('   ✗ ' + x))
}
console.log('JAMI TOPILMA: ' + jamiXato)
await b.close()

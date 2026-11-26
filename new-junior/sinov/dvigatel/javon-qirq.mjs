// 25.11 (QA F-1125-09): javondagi blok matni qirqilmaydi — har studiya ekranida har oila javoni bosiladi, .pl .mb da scrollWidth > clientWidth.
// O'lcham cqw — en ahamiyatsiz (1280 da ham, 1628 da ham bir xil nisbat). Ishlatish: node javon-qirq.mjs <dars-raqami …>
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const darslar = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const bor = (p, q, i = 0) => p.evaluate(([q, i]) => { if (window.__jrSinov) return window.__jrSinov.bor(q, i); qadam = q; ichki = i; chiz() }, [q, i]).then(() => p.waitForTimeout(700))
let jami = 0
for (const n of darslar) {
  const U = 'http://localhost:5340/' + (n === '001' ? 'demo.html' : 'demo-' + n + '.html')
  const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
  await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
  await p.goto(U + '?rol=solo&xona=javon'); await p.waitForTimeout(900)
  const SOLO = await p.evaluate(() => (window.__jrSinov ? window.__jrSinov.SOLO_R : SOLO_R))
  const top = new Map()
  for (const q of Object.keys(SOLO).map(Number).sort((a, c) => a - c)) for (let i = 0; i < SOLO[q].length; i++) {
    await bor(p, q, i)
    const id = await p.evaluate(() => document.querySelector('#ilova .ekran')?.dataset.id || '')
    const oilalar = await p.$$eval('#ilova .rg .rd', (a) => a.map((e, k) => k))
    for (const k of oilalar.length ? oilalar : [-1]) {
      if (k >= 0) { await p.locator('#ilova .rg .rd').nth(k).click({ timeout: 1500 }).catch(() => {}) /* ko'rinmas oila — 30 s kutmaydi */; await p.waitForTimeout(250) }
      const q2 = await p.evaluate(() => [...document.querySelectorAll('#ilova .pl .mbw:not(.yopiq) .mb, #ilova .pl > .mb')].filter((m) => m.getBoundingClientRect().width > 3).map((m) => { // 25.11 kech: qirqilish + blok ichida bo'laklar bir-biriga minishi yoki blokdan chiqishi (flex:1 1 0 urinishida matn yorliq ostida qoldi, scrollWidth ko'rmadi)
        const nom = m.textContent.trim().replace(/\s+/g, ' ').slice(0, 30); if (m.scrollWidth > m.clientWidth + 2) return nom + ' (+' + (m.scrollWidth - m.clientWidth) + ' px)'
        const B = m.getBoundingClientRect(), c = [...m.children].map((x) => x.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0)
        for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) { const x = c[i], y = c[j]; if (Math.min(x.right, y.right) - Math.max(x.left, y.left) > 2 && Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top) > 2) return nom + ' (bo‘laklar ustma-ust)' }
        if ([...m.children].some((x) => x.clientWidth > 0 && x.scrollWidth > x.clientWidth + 1)) return nom + ' (matn o‘z qutisidan toshdi)'
        return c.some((r) => r.right > B.right + 1 || r.left < B.left - 1) ? nom + ' (bo‘lak blokdan chiqdi)' : ''
      }).filter(Boolean))
      for (const x of q2) { if (!top.has(x)) top.set(x, new Set()); top.get(x).add(id) }
    }
  }
  await p.context().close()
  jami += top.size
  console.log(n + ': ' + (top.size ? top.size + ' TOPILMA' : 'toza'))
  for (const [x, e] of top) console.log('   ✗ ' + x + '  [' + [...e].slice(0, 8).join(' ') + (e.size > 8 ? ' …' : '') + ']')
}
console.log('JAMI TOPILMA: ' + jami)
await b.close()

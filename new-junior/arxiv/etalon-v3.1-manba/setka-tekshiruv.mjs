// Qat'iy setka tekshiruvi: (1) panel/matn qahramonni yopmaydimi; (2) yo'l qatlamiga (oynaning pastki 40%) panel tushmaydimi; (3) narsa oynadan chiqib ketmaydimi
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
for (const n of ['1', '2', '3']) {
  const p = await b.newPage({ viewport: { width: 1500, height: 1000 } })
  await p.goto('file://' + process.argv[2]); await p.evaluate((n) => { document.documentElement.dataset.shrift = n }, n); await p.waitForTimeout(1500)
  const r = await p.evaluate(() => {
    const out = [], R = (e) => e.getBoundingClientRect()
    const kes = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
    document.querySelectorAll('.wrap .ekran').forEach((ek) => {
      const id = ek.getAttribute('aria-label').split(' ')[0]
      ek.querySelectorAll('.oyna').forEach((o) => {
        const or = R(o), yq = { left: or.left, right: or.right, top: or.top + or.height * 0.6, bottom: or.bottom }
        const panel = [...o.querySelectorAll('.gl, .jv')].filter((e) => !e.closest('.yol'))
        const aktyor = [...o.querySelectorAll('.yol .q svg, .cdy svg, .cdy2 svg, .qq svg')]
        panel.forEach((pn) => { const pr = R(pn); if (kes(pr, yq) > 4) out.push(`${id}: «${(pn.className + '').slice(0, 18)}» yo‘l qatlamiga tushdi (${Math.round(kes(pr, yq))}px²)`) ; if (pr.left < or.left - 1 || pr.right > or.right + 1 || pr.top < or.top - 1 || pr.bottom > or.bottom + 1) out.push(`${id}: «${(pn.className + '').slice(0, 18)}» oynadan chiqdi`)
          aktyor.forEach((a) => { const ar = R(a), k = kes(pr, ar); if (k > ar.width * ar.height * 0.03) out.push(`${id}: «${(pn.className + '').slice(0, 18)}» qahramonni yopdi (${Math.round(100 * k / (ar.width * ar.height))}%)`) }) })
        aktyor.forEach((a) => { const ar = R(a); if (ar.top < or.top + or.height * 0.35) out.push(`${id}: qahramon tepa qatlamga chiqdi`) })
      })
      const hm = R(ek.querySelector('.hm'));
      [...ek.querySelectorAll('.hm > *')].forEach((e) => { const er = R(e); if (er.width && (er.bottom > hm.bottom + 1 || er.right > hm.right + 1)) out.push(`${id}: «${(e.className + '').slice(0, 18)}» ish zonasidan chiqdi`) })
    })
    return out
  })
  console.log('shrift', n, r.length ? '\n  ' + [...new Set(r)].join('\n  ') : 'toza')
  await p.close()
}
await b.close()

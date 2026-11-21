// Ishlatish: node new-junior/sinov/etalon/quti.mjs [sahifa.html]
// Quti ichidagi bo'sh joy: chap ustundagi fonli qutilarda mazmun qutining qancha qismini egallaydi
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } })
await p.goto('file://' + (process.argv[2] || new URL('../../etalon/etalon.html', import.meta.url).pathname)); await p.waitForTimeout(1500)
const r = await p.evaluate(() => {
  const out = []
  document.querySelectorAll('.wrap .ekran.t1 .chap').forEach((c) => {
    const ek = c.closest('.ekran'), id = ek.getAttribute('aria-label').split(' ')[0], cw = ek.getBoundingClientRect().width / 100
    c.querySelectorAll(':scope > *, :scope > * > *').forEach((e) => {
      const cs = getComputedStyle(e), fon = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none'
      const er = e.getBoundingClientRect(); if (!fon || er.height < 6 * cw) return
      const ich = er.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      const rg = document.createRange(); rg.selectNodeContents(e); const mazmun = rg.getBoundingClientRect().height
      const ulush = mazmun / ich
      out.push(`${id.padEnd(4)} ${(e.className + '').slice(0, 14).padEnd(14)} quti ${(er.height / cw).toFixed(1)} cqw · mazmun ${(100 * ulush).toFixed(0)}%`)
    })
  })
  return out
})
console.log(r.join('\n')); await b.close()

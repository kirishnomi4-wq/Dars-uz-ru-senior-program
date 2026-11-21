// Chap ustun: har bolaning balandligi (cqw) va ustunga nisbatan ortiqcha/kam joy
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } })
await p.goto('file://' + (process.argv[2] || new URL('../../etalon/etalon.html', import.meta.url).pathname)); await p.waitForTimeout(1500)
const ids = (process.argv[3] || 'P1,P3,P5,B5').split(',')
const r = await p.evaluate((ids) => ids.map((id) => {
  const ek = document.querySelector(`.e-${id}`), cw = ek.getBoundingClientRect().width / 100, c = ek.querySelector('.chap'), cr = c.getBoundingClientRect()
  const k = [...c.children].map((e) => `${(e.className || e.tagName).toString().slice(0, 12)}=${(e.getBoundingClientRect().height / cw).toFixed(1)}`)
  const oxir = Math.max(...[...c.children].map((e) => e.getBoundingClientRect().bottom))
  return `${id}: ustun ${(cr.height / cw).toFixed(1)} · ${k.join(' ')} · pastda ${((cr.bottom - oxir) / cw).toFixed(1)} cqw`
}), ids)
console.log(r.join('\n')); await b.close()

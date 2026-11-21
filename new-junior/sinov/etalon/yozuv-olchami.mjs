// Yozuv o'lchami: har ekrandagi ko'rinadigan yozuvlarning shrift o'lchami (ekran kengligining foizi, cqw) va
// 1366 pikselli proyektorda necha piksel bo'lishi. Qoida hali yo'q — bu o'lchov qaror uchun ma'lumot beradi.
// Ishlatish: node new-junior/sinov/etalon/yozuv-olchami.mjs [sahifa.html]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const file = process.argv[2] || new URL('../../etalon/etalon.html', import.meta.url).pathname
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } })
await p.goto('file://' + file); await p.waitForTimeout(1500)
const r = await p.evaluate(() => {
  const natija = []
  document.querySelectorAll('.wrap figure[data-id] .ekran').forEach((ek) => {
    const id = ek.getAttribute('aria-label').split(' ')[0], proyektor = ek.closest('figure').classList.contains('pr'), cw = ek.getBoundingClientRect().width / 100
    const olch = []
    const w = document.createTreeWalker(ek, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.textContent.trim() && !n.parentElement.closest('svg') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT })
    while (w.nextNode()) { const el = w.currentNode.parentElement, cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || el.getBoundingClientRect().width === 0) continue; olch.push({ c: parseFloat(cs.fontSize) / cw, t: w.currentNode.textContent.trim().slice(0, 24) }) }
    olch.sort((a, b) => a.c - b.c)
    natija.push({ id, proyektor, min: olch[0], kichik: olch.filter((o) => o.c < 1.2).length, jami: olch.length })
  })
  return natija
})
const px = (c) => Math.round(c * 13.66)
console.log('ekran  qayer      eng kichik            1,2 cqw dan kichik (1366 px proyektorda < 16 px)')
for (const x of r) console.log(`${x.id.padEnd(5)}  ${x.proyektor ? 'proyektor' : 'noutbuk  '}  ${x.min.c.toFixed(2)} cqw ≈ ${px(x.min.c)} px «${x.min.t}»`.padEnd(64) + `  ${x.kichik} / ${x.jami}`)
const pr = r.filter((x) => x.proyektor)
console.log(`\nProyektor ekranlari: ${pr.length}; 1,2 cqw dan kichik yozuvi borlari: ${pr.filter((x) => x.kichik).length}; eng kichigi ${Math.min(...pr.map((x) => x.min.c)).toFixed(2)} cqw ≈ ${px(Math.min(...pr.map((x) => x.min.c)))} px`)
await b.close()

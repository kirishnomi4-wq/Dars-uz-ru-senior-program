// Fayllarga tegmasdan, ochilgan sahifada tuzatish sinovi: K8 (yakun ekrani — xabar kartasi kapsulalarni yopmasin), K7 (dastur bo'yi — masshtab chegarasi)
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const O = process.argv[2]
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const sahifa = async (n, ID) => {
  const U = 'http://localhost:5340/demo-' + n + '.html'
  const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
  await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
  await p.goto(U + '?rol=solo&xona=prot'); await p.waitForTimeout(900)
  const SOLO = await p.evaluate(() => (window.__jrSinov ? window.__jrSinov.SOLO_R : SOLO_R))
  for (const q of Object.keys(SOLO).map(Number)) { const i = SOLO[q].indexOf(ID); if (i >= 0) { await p.evaluate(([q, i]) => { if (window.__jrSinov) return window.__jrSinov.bor(q, i); qadam = q; ichki = i; chiz() }, [q, i]); break } }
  await p.waitForTimeout(2500)
  return p
}
// K8: xabar kartasi kapsulalar ustunidan o'ngda boshlanadi
const K8 = '.oyna:has(> .ball-q) > .gl.kd2.a-tr{left:calc(5.6cqw + var(--kq-en, 0px) + 1.2cqw)}'
for (const [n, f] of [['012', 'k8-012'], ['023', 'k8-023'], ['018', 'k8-018']]) {
  const p = await sahifa(n, 'B5')
  await p.evaluate((css) => { const ek = document.querySelector('#ilova .ekran'); const q = ek.querySelector('.oyna > .ball-q'); if (!q) return; const en = q.getBoundingClientRect().width; ek.querySelector('.oyna').style.setProperty('--kq-en', en + 'px'); const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s) }, K8)
  await p.waitForTimeout(500)
  await p.screenshot({ path: `${O}/${f}.png` })
  await p.context().close()
}
// K7: bo'yi bo'yicha ham darsning masshtabMin chegarasi (0.6 o'rniga)
{
  const p = await sahifa('023', 'B2Y')
  const r = await p.evaluate(() => {
    const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek)
    const asos = ek.getBoundingClientRect().width / BL_ASOS
    blTartib(ws)
    const bb = ws.getBlocksBoundingBox(), h = bb.bottom - bb.top, joy = ws.getParentSvg().getBoundingClientRect().height
    const s = Math.max(asos * (DARS.masshtabMin || 0.6), (joy - 2) / h); ws.setScale(s); blTartib(ws)
    return { asos: +asos.toFixed(3), h: Math.round(h), joy: Math.round(joy), yangi: +s.toFixed(3), eski: +(asos * 0.6).toFixed(3) }
  })
  await p.waitForTimeout(800)
  console.log('K7', JSON.stringify(r))
  console.log('K7 joylar', await p.evaluate(() => { const ws = BL_WS.get(document.querySelector('#ilova .ekran')); return ws.getTopBlocks(false).map((t) => { const r = t.getBoundingRectangle(); return t.type + ' ' + Math.round(r.top) + '..' + Math.round(r.bottom) }).join(' | ') }))
  await p.screenshot({ path: `${O}/k7-023.png` })
  await p.context().close()
}
await b.close()

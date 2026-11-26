// Sinf-supurish (25.11): Blockly dasturida dasturchalar bir-birining ustiga tushmaganmi (har personaj dasturi ham).
// Solo — har qadamning har ekrani; ustoz — har qadam. Ishlatish: node ustma.mjs 001 002 …  [--surat <papka>]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const arg = process.argv.slice(2), si = arg.indexOf('--surat'), SUR = si >= 0 ? arg[si + 1] : null
const darslar = arg.filter((a, k) => !a.startsWith('--') && k !== si + 1)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const bor = (p, q, i = 0) => p.evaluate(([q, i]) => { if (window.__jrSinov) return window.__jrSinov.bor(q, i); qadam = q; ichki = i; chiz() }, [q, i]).then(() => p.waitForTimeout(700)).then(() => p.waitForFunction(() => !document.querySelector('.ekran[data-joylanmoqda]'), null, { timeout: 4000, polling: 50 }).catch(() => {}))
const malumot = (p) => p.evaluate(() => { const s = window.__jrSinov; return { QADAM: s ? s.QADAM : QADAM, SOLO: s ? s.SOLO_R : (typeof SOLO_R !== 'undefined' ? SOLO_R : {}) } })
// ekrandagi har Blockly maydoni: yuqori bloklar to'rtburchaklari kesishadimi (2 px dan ortiq)
const tekshir = (p) => p.evaluate(() => {
  const out = []
  // o'zgaruvchi kapsulalari (ball, jon, qadam…) boshqa narsa ostida qolmaganmi: markaz va to'rt chekka nuqtasi
  document.querySelectorAll('#ilova .ekran .oyna .ball-k, #ilova .ekran .oyna .bsh-k').forEach((k) => {
    const r = k.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || getComputedStyle(k).visibility === 'hidden' || k.closest('[hidden]') || k.classList.contains('yashirin')) return
    const nuq = [[.5, .5], [.15, .5], [.85, .5], [.5, .2], [.5, .8]].map(([a, c]) => [r.left + r.width * a, r.top + r.height * c])
    const yopiq = nuq.filter(([x, y]) => { const e = document.elementFromPoint(x, y); return e && !k.contains(e) })
    if (yopiq.length) { const e = document.elementFromPoint(yopiq[0][0], yopiq[0][1]); out.push('kapsula «' + k.textContent.trim().slice(0, 12) + '» ostida: ' + (e.className && e.className.baseVal === undefined ? e.className : e.tagName) + ' (' + yopiq.length + '/5 nuqta)') }
  })
  if (typeof BL_WS === 'undefined') return out
  document.querySelectorAll('#ilova .ekran').forEach((ek) => {
    const ws = BL_WS.get(ek); if (!ws || !ws.getTopBlocks) return
    const qut = ws.getTopBlocks(false).filter((bl) => !bl.isInsertionMarker || !bl.isInsertionMarker()).map((bl) => ({ r: bl.getBoundingRectangle(), t: bl.type }))
    for (let i = 0; i < qut.length; i++) for (let j = i + 1; j < qut.length; j++) {
      const a = qut[i].r, c = qut[j].r
      const x = Math.min(a.right, c.right) - Math.max(a.left, c.left), y = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top)
      if (x > 2 && y > 2) out.push(qut[i].t + ' × ' + qut[j].t + ' (' + Math.round(x) + '×' + Math.round(y) + ')')
    }
  })
  return out
})
// personaj kartalari bo'lsa — har birini bosib tekshiradi
const kartalar = (p) => p.$$eval('#ilova .ekran .dst .per-k:not(.qulf)', (a) => a.map((e) => e.dataset.p)).catch(() => [])
let jami = 0
for (const n of darslar) {
  const U = 'http://localhost:5340/' + (n === '001' ? 'demo.html' : 'demo-' + n + '.html')
  const c = await b.newContext({ viewport: { width: 1440, height: 810 } }); const p = await c.newPage()
  await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
  await p.goto(U + '?rol=solo&xona=ustma'); await p.waitForTimeout(900)
  const { SOLO, QADAM } = await malumot(p); const xato = []; let n2 = 0
  const bir = async (yorliq) => {
    const id = await p.evaluate(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id || '')
    const per = await kartalar(p)
    const sinash = async (pn) => { const t = await tekshir(p); n2++; if (t.length) { xato.push(yorliq + ' ' + id + (pn ? ' [' + pn + ']' : '') + ': ' + t.join('; ')); if (SUR) await p.screenshot({ path: `${SUR}/ustma-${n}-${yorliq}-${id}${pn ? '-' + pn : ''}.png` }) } }
    if (per.length) { for (const pn of per) { await p.click(`#ilova .ekran .dst .per-k[data-p="${pn}"]`).catch(() => {}); await p.waitForTimeout(500); await sinash(pn) } } else await sinash('')
  }
  for (const q of Object.keys(SOLO).map(Number).sort((a, c) => a - c)) for (let i = 0; i < SOLO[q].length; i++) { await bor(p, q, i); await bir('solo') }
  await c.close()
  const c2 = await b.newContext({ viewport: { width: 1440, height: 810 } }); const u = await c2.newPage()
  await u.goto(U + '?rol=ustoz&yangi=1&xona=ustma-u'); await u.waitForTimeout(900)
  for (let q = 0; q < QADAM.length; q++) {
    await bor(u, q)
    const t = await tekshir(u)
    if (t.length) { const id = await u.evaluate(() => document.querySelector('#ilova .ekran')?.dataset.id); xato.push('ustoz ' + (q + 1) + '-qadam ' + id + ': ' + t.join('; ')); if (SUR) await u.screenshot({ path: `${SUR}/ustma-${n}-ustoz-${q + 1}.png` }) }
  }
  await c2.close()
  jami += xato.length
  console.log(n + ': ' + n2 + ' holat — ' + (xato.length ? xato.length + ' TOPILMA' : 'toza'))
  xato.forEach((x) => console.log('   ✗ ' + x.slice(0, 220)))
}
console.log('JAMI TOPILMA: ' + jami)
await b.close()

// 25.11 (QA F-1125-06/09/16): haqiqiy demoda, bir nechta oyna enida — element o'z kartasidan chiqmaydi, blok matni qirqilmaydi.
// Setka (setka.mjs) statik ekranlarni 1280 px da tekshiradi; bu — jonli sahifa (solo har ekran + ustoz har qadam), QA o'lchamlarida.
// Ishlatish: node qutiden.mjs <dars-raqami …> [--en 1086,1280,1524,1628,1759] [--surat papka]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const arg = process.argv.slice(2), oi = (k) => { const i = arg.indexOf(k); return i >= 0 ? arg[i + 1] : null }
const ENLAR = (oi('--en') || '1086,1280,1524,1628,1759').split(',').map(Number), SUR = oi('--surat')
const darslar = arg.filter((a, k) => !a.startsWith('--') && !(k > 0 && arg[k - 1].startsWith('--')))
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const bor = (p, q, i = 0) => p.evaluate(([q, i]) => { if (window.__jrSinov) return window.__jrSinov.bor(q, i); qadam = q; ichki = i; chiz() }, [q, i]).then(() => p.waitForTimeout(1800)).then(() => p.waitForFunction(() => !document.querySelector('.ekran[data-joylanmoqda]'), null, { timeout: 4000, polling: 50 }).catch(() => {}))
const malumot = (p) => p.evaluate(() => { const s = window.__jrSinov; return { QADAM: s ? s.QADAM : QADAM, SOLO: s ? s.SOLO_R : (typeof SOLO_R !== 'undefined' ? SOLO_R : {}) } })
// tekshiruv: (1) karta ichidagi narsa kartadan chiqmaydi (2 px ruxsat); (2) bir qatorli blok/kod matni qirqilmaydi
const tekshir = (p) => p.evaluate(() => {
  const out = [], ek = document.querySelector('#ilova .ekran'); if (!ek) return out
  const ER = ek.getBoundingClientRect()
  const quti = (el) => { for (let e = el.parentElement; e && e !== ek; e = e.parentElement) { const s = getComputedStyle(e); if ((s.backgroundColor && !/rgba\(0, 0, 0, 0\)|transparent/.test(s.backgroundColor)) || parseFloat(s.borderLeftWidth) > 0 || (s.boxShadow && s.boxShadow !== 'none')) return e } return null }
  const nom = (e) => (e.className && e.className.baseVal === undefined ? '.' + String(e.className).trim().split(/\s+/).slice(0, 2).join('.') : e.tagName) + ' «' + (e.textContent || '').trim().slice(0, 22) + '»'
  const kor = (e) => { const r = e.getBoundingClientRect(); if (r.width < 3 || r.height < 3) return false; for (let x = e; x && x !== ek; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) < 0.05) return false } return true }
  // Blockly ichi (jr-bl) va o'yin harakatidagi narsalar tekshirilmaydi; muammocha, konfeti — vaqtinchalik
  const tanla = '.mb, .c-blok, .kod-k, .kk, .tf-r > *, .xs-d > *, .jk svg, .jk img, .kc-mini, .dkv .jk > *'
  ek.querySelectorAll(tanla).forEach((el) => {
    if (el.closest('.jr-bl, .blocklyWidgetDiv, .muam, .dv-muam, .konfeti, .hn')) return
    if (!kor(el)) return
    const q = quti(el); if (!q || !kor(q)) return
    const a = el.getBoundingClientRect(), c = q.getBoundingClientRect()
    const osh = Math.max(c.left - a.left, a.right - c.right, c.top - a.top, a.bottom - c.bottom)
    if (osh > 2) out.push('chiqdi ' + Math.round(osh) + ' px: ' + nom(el) + ' ⟶ ' + nom(q))
  })
  // matn qirqilishi: bir qatorli yozuv o'z elementidan keng (overflow yashiringan joyda) — javon bloklari ham
  ek.querySelectorAll('.mb, .mb > span, .kod-k, .kq, .hn .hint, .hn .mas, .hn .asos').forEach((el) => {
    if (el.closest('.jr-bl') || !kor(el)) return
    if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflowX !== 'visible') out.push('qirqildi ' + (el.scrollWidth - el.clientWidth) + ' px: ' + nom(el))
  })
  // pastki qator (hn): hech bir tugma ekrandan tashqarida emas va qator o'ramaydi
  ek.querySelectorAll('.hn > *').forEach((el) => { if (!kor(el)) return; const r = el.getBoundingClientRect(); if (r.bottom > ER.bottom + 1 || r.right > ER.right + 1 || r.left < ER.left - 1) out.push('hn tashqarida: ' + nom(el)) })
  return [...new Set(out)]
})
let jami = 0
for (const n of darslar) {
  const U = 'http://localhost:5340/' + (n === '001' ? 'demo.html' : 'demo-' + n + '.html')
  const top = new Map()
  for (const en of ENLAR) {
    const c = await b.newContext({ viewport: { width: en, height: Math.round(en * 0.72) } }); const p = await c.newPage()
    await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
    await p.goto(U + '?rol=solo&xona=quti'); await p.waitForTimeout(900)
    const { SOLO, QADAM } = await malumot(p)
    for (const q of Object.keys(SOLO).map(Number).sort((a, c) => a - c)) for (let i = 0; i < SOLO[q].length; i++) {
      await bor(p, q, i); const id = await p.evaluate(() => document.querySelector('#ilova .ekran')?.dataset.id || '')
      for (const x of await tekshir(p)) { const k = 'solo ' + id + ': ' + x; if (!top.has(k)) top.set(k, []); top.get(k).push(en); if (SUR && top.get(k).length === 1) await p.screenshot({ path: `${SUR}/q-${n}-${id}-${en}.png` }).catch(() => {}) }
    }
    await c.close()
    const c2 = await b.newContext({ viewport: { width: en, height: Math.round(en * 0.72) } }); const u = await c2.newPage()
    await u.goto(U + '?rol=ustoz&yangi=1&xona=quti-u'); await u.waitForTimeout(900)
    for (let q = 0; q < QADAM.length; q++) { await bor(u, q); const id = await u.evaluate(() => document.querySelector('#ilova .ekran')?.dataset.id || ''); for (const x of await tekshir(u)) { const k = 'ustoz ' + (q + 1) + ' ' + id + ': ' + x; if (!top.has(k)) top.set(k, []); top.get(k).push(en); if (SUR && top.get(k).length === 1) await u.screenshot({ path: `${SUR}/q-${n}-u${q + 1}-${en}.png` }).catch(() => {}) } }
    await c2.close()
  }
  jami += top.size
  console.log(n + ': ' + (top.size ? top.size + ' TOPILMA' : 'toza') + ' (enlar ' + ENLAR.join(', ') + ')')
  for (const [k, e] of top) console.log('   ✗ ' + k.slice(0, 200) + '  [' + (e.length === ENLAR.length ? 'hamma enda' : e.join(', ')) + ']')
}
console.log('JAMI TOPILMA: ' + jami)
await b.close()

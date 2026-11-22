// --- kichik nusxa (21.11, F-1121): darslar uslubida bloklar rasmi CSS zoom bilan kichraytiriladi (huk kartalari, «O‘tgan darsda», doska).
// Safari (WebKit) va «eng kichik shrift» sozlamasi bor brauzerlar 9 px dan kichik harfni kattalashtiradi: zoom ichida harf katta, hoshiya
// va kenglik kichik qoladi — blok kartadan chiqib ketadi (13-dars huk C kartasi: Chrome'da 131 px, WebKit'da 183 px).
// Bu yerda bir marta o'lchanadi: brauzer zoom li nusxani aniq kichraytirsa (Chrome) — hech narsa qilinmaydi, ekranlar avvalgidek.
// Aks holda har zoom li element o'z o'lchamida chiziladi va transform bilan siqiladi (harf siqilganda kattalashmaydi); egallagan joyi
// zoom dagidek qoladi (manfiy chet), kengligini ota-qutisidan olgan element esa zoom dagidek o'sha qutini to'ldiradi.
// Fayl mustaqil: hech narsa chaqirmaydi — demo, LMS va setka sinovi sahifasi (sinov/dvigatel/setka.mjs) bir xil ishlatadi.
// boshidagi «;» — LMS yig'masida oldingi qator obyekt bilan tugaydi (const KIRISH = {…}); usiz ikkalasi «chaqiruv» bo'lib qo'shilardi (21.11, 1-dars LMS ko'rigi oq ekran)
;(function () {
  if (typeof window === 'undefined' || window.__kichikNusxa) return
  window.__kichikNusxa = true
  // brauzer zoom ni aniq qo'llaydimi: 0,3 lik nusxa (6 px harf, cqw hoshiya) asl nusxaning aynan 0,3 qismi bo'lishi kerak
  function aniqmi() {
    const d = document.createElement('div')
    d.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;container-type:inline-size;width:1000px'
    const s = 'display:inline-block;white-space:nowrap;font:20px/1 sans-serif;padding:0 2cqw'
    d.innerHTML = '<span style="' + s + '">MMMMMMMMMM</span><br><span style="' + s + ';zoom:.3">MMMMMMMMMM</span>'
    document.body.appendChild(d)
    const a = d.children[0].getBoundingClientRect().width, b = d.children[2].getBoundingClientRect().width
    d.remove()
    return a > 0 && Math.abs(b / a - 0.3) < 0.01
  }
  const px = (v) => parseFloat(v) || 0
  function qoy(e) {
    const z = +e.dataset.kz
    e.style.zoom = '1'; e.style.transform = ''; e.style.margin = ''; e.style.width = ''
    const s = getComputedStyle(e)
    const w0 = e.offsetWidth
    e.style.width = 'max-content'
    const ichki = e.offsetWidth
    e.style.width = ''
    const toldir = w0 > ichki + 1 // kenglikni ota-qutidan olgan (blok, cho'zilgan) — zoom da u qutini to'liq to'ldiradi
    if (toldir) e.style.width = (w0 / z) + 'px'
    const w = e.offsetWidth, h = e.offsetHeight
    e.style.transformOrigin = '0 0'
    e.style.transform = 'scale(' + z + ')'
    e.style.margin = (px(s.marginTop) * z) + 'px ' + (px(s.marginRight) * z + (z - 1) * w) + 'px ' + (px(s.marginBottom) * z + (z - 1) * h) + 'px ' + (px(s.marginLeft) * z) + 'px'
  }
  const kuzat = typeof ResizeObserver === 'function' ? new ResizeObserver((yoz) => { yoz.forEach((x) => { const e = x.target; if (e.isConnected && e.dataset.kz && !e.__kqoy) { e.__kqoy = true; requestAnimationFrame(() => { e.__kqoy = false; if (e.isConnected) qoy(e) }) } }) }) : null
  function tuzat(ildiz) {
    const els = ildiz.nodeType === 1 ? [ildiz].concat(Array.from(ildiz.querySelectorAll('*'))) : []
    els.forEach((e) => {
      if (!(e instanceof HTMLElement) || e.dataset.kz || e.closest('svg')) return
      const z = parseFloat(getComputedStyle(e).zoom)
      if (!z || Math.abs(z - 1) < 0.001) return
      e.dataset.kz = String(z)
      qoy(e)
      if (kuzat) kuzat.observe(e)
    })
  }
  function boshla() {
    if (aniqmi()) return
    document.documentElement.classList.add('kichik-siqiladi')
    tuzat(document.body)
    // yangi qo'shilgan ekran bo'laklari — o'sha zahoti (kuzatuvchi ekran chizilishidan oldin ishlaydi: buzuq ko'rinish bir lahza ham chiqmaydi)
    new MutationObserver((ms) => {
      ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1 && n.isConnected) tuzat(n) }))
    }).observe(document.body, { childList: true, subtree: true })
    // oyna o'lchami o'zgarsa — cqw o'lchamlari ham o'zgaradi: hammasi qaytadan
    let t = 0
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => document.querySelectorAll('[data-kz]').forEach((e) => qoy(e)), 120) })
  }
  if (document.body) boshla(); else document.addEventListener('DOMContentLoaded', boshla)
})()

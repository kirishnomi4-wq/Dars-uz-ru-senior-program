// Demo aloqasi va kirishi — brauzerda ishlaydi (dvigatel 2c, 19.11; avval qobiq.js ichida edi, mazmuni o'zgarmagan).
// sahifa.mjs uni qobiq.js dan OLDIN skriptga qo'shadi, tepadagi // qatorlarini tashlab. LMS'da bu fayl yo'q: o'rniga lms/aloqa.js (sinfAloqa)
// va lms/yig.mjs dagi kirish (rol, ism, kalit — Dars.jsx dan).
// Aloqaning ko'rinishi ikkala yo'lda bir xil: boshla({ kim, rol, qabul, holat, ulandi, bor }) — tinglashni yoqadi; yubor(x) — xabar.
//   bor() — lokal server yoki internet borligi bilindi (ulanishdan oldin ham; ustoz panelidagi «aloqa» belgisi shunga qaraydi).
// Demo uch yo'lni birga ishlatadi: BroadcastChannel (bitta brauzer ichida) · lokal server (vite «sinf-aloqa», /__sinf, SSE) ·
// internet (api/sinf — Vercel funksiyasi + Redis, har ~1 soniyada so'raydi).
function aloqaDemo(xona) {
  let kanal = null; try { kanal = new BroadcastChannel('junior-demo-' + xona) } catch (e) {}
  let serverBor = false, internet = false, kim = '', h = null
  const yubor = (x) => {
    const m = JSON.stringify(x)
    if (kanal) kanal.postMessage(m)
    if (serverBor) fetch('/__sinf/yubor?xona=' + xona + '&id=' + kim, { method: 'POST', body: m }).catch(() => {})
    if (internet) fetch('/api/sinf?xona=' + xona + '&id=' + kim, { method: 'POST', body: m, headers: { 'Content-Type': 'application/json' } }).catch(() => h.holat(false))
  }
  function boshla(hh) {
    h = hh; kim = h.kim
    if (kanal) kanal.onmessage = (e) => h.qabul(e.data)
    fetch('/__sinf/bor').then((r) => r.ok && r.text()).then((t) => {
      if (t !== 'ha') return
      serverBor = true; h.bor()
      const es = new EventSource('/__sinf/oqim?xona=' + xona + '&id=' + kim)
      es.onmessage = (e) => h.qabul(e.data)
      es.onopen = () => h.ulandi()
      es.onerror = () => h.holat(false)
    }).catch(() => {})
    // internet orqali (Vercel funksiyasi + Redis): har ~1 soniyada yangi xabarlarni so'raydi
    fetch('/api/sinf?bor=1').then((r) => r.ok ? r.json() : null).then((j) => {
      if (!j || !j.redis) return
      internet = true; h.bor()
      let dan = -1
      const sora = () => fetch('/api/sinf?xona=' + xona + '&id=' + kim + '&dan=' + dan, { cache: 'no-store' }).then((r) => r.ok ? r.json() : Promise.reject(r.status)).then((d) => {
        h.holat(true)
        const birinchi = dan < 0
        dan = d.n
        if (birinchi) h.ulandi()
        else (d.x || []).forEach(h.qabul)
      }).catch(() => h.holat(false)).finally(() => setTimeout(sora, h.rol === 'bola' ? 900 : 1500))
      sora()
    }).catch(() => {})
  }
  return { yubor, boshla }
}
// demo kirishi: rol, sinf kodi (xona) va «boshidan» — manzildan; saqlov kalitlari: dars holati 'demo-<dars kaliti>-…' (masalan demo-jr002-pog),
// bolaning profili (ism, qahramon) — 'demo-…', kurs bo'yi umumiy (5b-1, 94-qaror)
const KIRISH = (() => {
  const P = new URLSearchParams(location.search)
  return { rol: P.get('rol') || 'eshik', k: 'demo-' + DARS.lms.kalit + '-', kp: 'demo-', yangi: !!P.get('yangi'), aloqa: aloqaDemo(P.get('xona') || 'demo') }
})()

// Sinf holati: ustoz qaysi sahnada, har bola nima qildi.
// Uch rejim:
//   ustoz — proyektor (ustoz noutbuki). Darsning EGASI: holat shu oynada yashaydi, o'quvchilarga tarqatiladi.
//   bola  — o'quvchi noutbuki. Ustozga ulanadi, sinfdagi 14 o'rindan birini egallaydi, egaga ergashadi.
//   yonma — ko'rik: proyektor va bitta o'quvchi bitta sahifada. Hech qayerga ulanmaydi (boshqa oynalar bilan aralashmaydi).
// Aloqa: lokal server orqali (vite.config.js dagi «sinf-aloqa», /__sinf) — ikki XIL brauzer yoki ikki kompyuter orasida ham ishlaydi.
// Server topilmasa (masalan, tayyor yig'ma oddiy xostingda) — BroadcastChannel: faqat bitta brauzer ichida.
// O'rinlarning egallanmagani SOXTA: ustoz ochgan sahnaga qarab o'zi harakat qiladi (KONSEPSIYA 9-qaror).
// Tarix (fidbek 13.11): avval yonma-yon sahifa ham, proyektor oynasi ham o'zini ega deb bilib, bola oynasiga ikki xil holat yuborar edi.
import { useSyncExternalStore } from 'react'
import { SAHNALAR, OXIRGI_SAHNA, RANGLAR } from './manba.js'

const QAHRAMONLAR = ['momiq', 'jele', 'katak', 'yulduz', 'nihol']
const ISMLAR = ['Aziz', 'Madina', 'Jasur', 'Sevara', 'Bekzod', 'Laylo', 'Sardor', 'Nilufar', 'Otabek', 'Zarina', 'Temur', 'Kamola', 'Diyor', 'Malika']
// birga — 4-sahnada qahramonini yulduzga olib bordi; rang, qism — qahramonning rangi va ismi (10-sahna); pog2 — gapirtirish pog'onasi;
// sahnam — o'z sahnasi { zona, dastur }; qadam, gap — yakundagi sanoq (bolaning o'z dasturlaridan)
const bosh = () => ({ kirdi: false, qahramon: null, birga: false, taxmin2: null, taxmin5: null, pog: 0, yordam: false, taxmin9: null, rang: null, qism: '', pog2: 0, sahnam: null, tayyor: false, qadam: 0, gap: 0 })
// real — o'rinni egallagan o'quvchi oynasining belgisi; bo'sh bo'lsa o'rin soxta.
// boshlandi — sahna qachon boshlangani (ustoz panelidagi soat), qBoshlandi — shu qadam qachon boshlangani (sinf doskasidagi qolgan vaqt)
// ochildi — dars ichidagi testning natijasi proyektorda ochilgan sahnalar ({ 2: true, 5: true, 9: true }): shu lahzada bola noutbukida o'z natijasi chiqadi (2-tur, 7-band)
const boshHolat = () => ({ sahna: 1, qadam: 0, yur: 0, ochildi: {}, boshlandi: Date.now(), qBoshlandi: Date.now(), bolalar: ISMLAR.map((ism, i) => ({ id: 'o' + i, ism, real: null, ...bosh() })) })
// sahna yoki qadam almashganda vaqt belgilari yangilanadi
const vaqtli = (h, y) => { const t = Date.now(); return { ...y, qBoshlandi: t, boshlandi: y.sahna !== h.sahna ? t : h.boshlandi } }

let holat = boshHolat()
let rol = null // 'yonma' | 'ustoz' | 'bola'
let asosiy = false // shu oyna — dars egasi
let ulandi = false // ergashuvchi: egadan holat keldi
let kid = null // shu oynadagi o'quvchining belgisi
let ism = '' // o'quvchi ismi (ko'rik uchun manzildan; aslida tizimdan keladi)
const meniId = 'c' + Math.random().toString(36).slice(2, 10) // shu oynaning aloqa belgisi (har ochilishda yangi)
let jonat = () => {} // xabarni boshqa oynalarga yuboradi
let serverli = null // null — hali aniq emas; 'lokal' — lokal sinf serveri; 'internet' — internet orqali (Vercel + Upstash); false — faqat shu brauzer ichida
// Sinf kodi (internet orqali ulanishda): manzildagi ?xona=K7P2 — har dars o'z xonasida; kod yo'q bo'lsa — umumiy xona
const XONA = (() => { try { const x = new URLSearchParams(window.location.search).get('xona') || ''; return /^[A-Za-z0-9]{3,8}$/.test(x) ? x.toUpperCase() : 'dars001' } catch { return 'dars001' } })()
export const sinfKodi = XONA === 'dars001' ? null : XONA
let davr = 0, raqam = 0 // ega: qachon ega bo'lgani va holatning tartib raqami — eski xabar yangisini bosib ketmasin
let korganDavr = 0, korganRaqam = -1, egaId = null
let amalRaqam = 0
let kutilgan = [] // ergashuvchi: egaga yuborilgan, lekin hali tasdiqlanmagan o'z amallari — ega holati kelganda ustiga qayta qo'yiladi
const korildi = {} // ega: har oynaning oxirgi bajarilgan amali
const tinglovchilar = new Set()
const XOTIRA = 'nj-d1-holat', XOTIRA_KID = 'nj-d1-kid'
const xotira = {
  ol: (k) => { try { return sessionStorage.getItem(k) } catch { return null } },
  qoy: (k, v) => { try { sessionStorage.setItem(k, v) } catch { /* xotira yopiq bo'lsa ham dars ishlayveradi */ } },
  och: (k) => { try { sessionStorage.removeItem(k) } catch { /* xotira yopiq */ } },
}

function qoyil(h, a) {
  if (a.t === 'keyingi') {
    if (h.qadam < SAHNALAR[h.sahna].qadamlar - 1) return vaqtli(h, { ...h, qadam: h.qadam + 1 })
    return h.sahna < OXIRGI_SAHNA ? vaqtli(h, { ...h, sahna: h.sahna + 1, qadam: 0 }) : h
  }
  if (a.t === 'orqaga') {
    if (h.qadam > 0) return vaqtli(h, { ...h, qadam: h.qadam - 1 })
    return h.sahna > 1 ? vaqtli(h, { ...h, sahna: h.sahna - 1, qadam: SAHNALAR[h.sahna - 1].qadamlar - 1 }) : h
  }
  if (a.t === 'bola') return { ...h, bolalar: h.bolalar.map((b) => (b.id === a.id ? { ...b, ...a.ozgarish } : b)) }
  if (a.t === 'yur') return { ...h, yur: h.yur + (a.n || 1) }
  if (a.t === 'ochildi') return h.ochildi?.[a.k] ? h : { ...h, ochildi: { ...(h.ochildi || {}), [a.k]: true } }
  if (a.t === 'kirish') {
    // o'quvchi sinfga kirdi: birinchi bo'sh (soxta) o'rin unga beriladi va tozalanadi
    if (h.bolalar.some((b) => b.real === a.kid)) return h
    const i = h.bolalar.findIndex((b) => !b.real)
    if (i < 0) return h
    return { ...h, bolalar: h.bolalar.map((b, k) => (k === i ? { ...bosh(), id: b.id, ism: a.ism || b.ism, real: a.kid } : b)) }
  }
  if (a.t === 'qayta') { const y = boshHolat(); if (rol === 'yonma') y.bolalar[0].real = 'yonma'; return y }
  return h
}
const xabar = () => tinglovchilar.forEach((f) => f())

// Ega: holatni boshqa oynalarga tarqatadi (ketma-ket o'zgarishlar bitta xabarga yig'iladi) va o'z oynasida saqlaydi (sahifa yangilansa dars davom etadi)
let tarqatTaymer = null
function tarqat() {
  if (!asosiy || rol === 'yonma' || tarqatTaymer) return
  tarqatTaymer = setTimeout(() => {
    tarqatTaymer = null
    if (!asosiy) return
    jonat({ t: 'holat', holat, davr, raqam: ++raqam, korildi })
    xotira.qoy(XOTIRA, JSON.stringify(holat))
  }, 40)
}

export function yubor(a) {
  if (asosiy) {
    const yangi = qoyil(holat, a)
    if (yangi === holat) return
    holat = yangi; xabar(); tarqat()
  } else {
    // ergashuvchi oyna: bolaning harakatini o'zida darhol ko'rsatadi va egaga jo'natadi
    const n = ++amalRaqam
    if (a.t === 'bola' || a.t === 'yur') { kutilgan.push({ n, a }); holat = qoyil(holat, a); xabar() }
    jonat({ t: 'amal', a, n })
  }
}

function qabul(m) {
  if (!m || m.kim === meniId) return
  if (m.t === 'holat') {
    if (asosiy) {
      // ikki ega to'qnashdi (ikki ustoz oynasi deyarli bir vaqtda ochilgan): oldin ochilgani ega bo'lib qoladi
      if (m.davr < davr || (m.davr === davr && m.kim < meniId)) { asosiy = false; taymerlar.forEach(clearTimeout); taymerlar = [] } else { tarqat(); return }
    }
    if (m.davr < korganDavr || (m.davr === korganDavr && m.raqam <= korganRaqam)) return
    if (m.davr !== korganDavr) kutilgan = []
    korganDavr = m.davr; korganRaqam = m.raqam; egaId = m.kim; ulandi = true
    const k = (m.korildi && m.korildi[meniId]) || 0
    kutilgan = kutilgan.filter((x) => x.n > k)
    holat = kutilgan.reduce((h, x) => qoyil(h, x.a), m.holat); xabar()
  }
  if (m.t === 'amal' && asosiy) {
    korildi[m.kim] = m.n
    const yangi = qoyil(holat, m.a)
    if (yangi !== holat) { holat = yangi; xabar() }
    tarqat() // holat o'zgarmasa ham: tasdiq yetib borsin
  }
  if (m.t === 'salom' && asosiy) tarqat()
  if (m.t === 'ketdi' && m.kim === egaId && rol === 'ustoz' && !asosiy) asosiyBol() // ega oynasi yopildi: ikkinchi ustoz oynasi shu joydan davom ettiradi
  if (m.t === 'ulandi') { if (asosiy) tarqat(); else salom() } // aloqa uzilib, qayta tiklandi
}

function asosiyBol() {
  if (asosiy) return
  asosiy = true; ulandi = true; davr = Date.now(); raqam = 0
  xabar(); tarqat()
  oxirgi = ''; soxtaSinf()
}
const salom = () => { jonat({ t: 'salom' }); if (rol === 'bola') jonat({ t: 'amal', a: { t: 'kirish', kid, ism }, n: ++amalRaqam }) }

/* ===== Aloqa: avval lokal server (ikki brauzer orasida ham), bo'lmasa — internet orqali, u ham bo'lmasa — bitta brauzer ichida ===== */
function serverAloqa() {
  return new Promise((hal) => {
    if (typeof EventSource === 'undefined') { hal(null); return }
    let ochildi = false, navbat = Promise.resolve()
    const manzil = (yol) => `/__sinf/${yol}?xona=${XONA}&id=${meniId}`
    const es = new EventSource(manzil('oqim'))
    // xabarlar ketma-ket yuboriladi: keyingisi oldingisidan o'zib ketmasin
    const yuborgich = (m) => { navbat = navbat.then(() => fetch(manzil('yubor'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(m), keepalive: true }).catch(() => {})) }
    const muddat = setTimeout(() => { if (!ochildi) { es.close(); hal(null) } }, 2500)
    es.onopen = () => { if (ochildi) { qabul({ t: 'ulandi' }); return } ochildi = true; clearTimeout(muddat); hal(yuborgich) }
    es.onmessage = (e) => { try { qabul(JSON.parse(e.data)) } catch { /* buzuq xabar tashlab yuboriladi */ } }
    es.onerror = () => { if (!ochildi) { clearTimeout(muddat); es.close(); hal(null) } }
  })
}
// Internet orqali (Vercel + Upstash, api/sinf.mjs): xabarlar har 0,7 soniyada so'rab olinadi (oyna yashirin bo'lsa — 2 soniyada)
function internetAloqa() {
  return (async () => {
    try { const j = await fetch('/api/sinf?bor=1', { cache: 'no-store' }); const d = j.ok ? await j.json() : null; if (!d?.redis) return null } catch { return null }
    const manzil = `/api/sinf?xona=${XONA}&id=${meniId}`
    let dan = -1
    try { const j = await fetch(manzil + '&dan=-1', { cache: 'no-store' }); if (!j.ok) return null; dan = (await j.json()).n } catch { return null }
    let uzildi = false
    ;(async () => {
      for (;;) {
        await new Promise((r) => setTimeout(r, document.hidden ? 2000 : 700))
        try {
          const j = await fetch(manzil + '&dan=' + dan, { cache: 'no-store' })
          if (!j.ok) throw new Error(String(j.status))
          const d = await j.json()
          if (uzildi) { uzildi = false; qabul({ t: 'ulandi' }) }
          for (const m of d.x) { try { qabul(m) } catch { /* buzuq xabar tashlab yuboriladi */ } }
          dan = Math.max(dan, d.n)
        } catch { uzildi = true }
      }
    })()
    let navbat = Promise.resolve()
    window.addEventListener('pagehide', () => { try { navigator.sendBeacon(manzil, new Blob([JSON.stringify({ t: 'ketdi', kim: meniId })], { type: 'application/json' })) } catch { /* yopilish xabari yetmasa ham dars ishlaydi */ } })
    // xabarlar ketma-ket yuboriladi: keyingisi oldingisidan o'zib ketmasin
    return (m) => { navbat = navbat.then(() => fetch(manzil, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(m), keepalive: JSON.stringify(m).length < 60000 }).catch(() => {})) }
  })()
}
function brauzerAloqa() {
  if (typeof BroadcastChannel === 'undefined') return () => {}
  const kanal = new BroadcastChannel('junior-dars-001' + (XONA === 'dars001' ? '' : '-' + XONA))
  kanal.onmessage = (e) => qabul(e.data)
  window.addEventListener('pagehide', () => kanal.postMessage({ t: 'ketdi', kim: meniId }))
  return (m) => kanal.postMessage(m)
}

let sozlangan = false
export function sozla(yangiRol, { ism: berilganIsm = '', yangi = false } = {}) {
  if (sozlangan) return
  sozlangan = true
  rol = yangiRol
  if (rol === 'yonma') { holat.bolalar[0].real = kid = 'yonma'; asosiyBol(); return }
  if (rol === 'ustoz') {
    // sahifa yangilansa dars o'sha joydan davom etadi; «yangi» — boshidan
    if (yangi) xotira.och(XOTIRA)
    const eski = xotira.ol(XOTIRA)
    if (eski) { try { const h = JSON.parse(eski); if (h && SAHNALAR[h.sahna] && Array.isArray(h.bolalar)) holat = h } catch { /* buzuq yozuv — boshidan */ } }
  } else {
    kid = xotira.ol(XOTIRA_KID) || 'k' + Math.random().toString(36).slice(2, 10)
    xotira.qoy(XOTIRA_KID, kid)
    ism = berilganIsm.trim().slice(0, 14)
  }
  // aloqa: avval lokal sinf serveri, bo'lmasa — internet orqali, u ham bo'lmasa — shu brauzer ichida
  serverAloqa().then(async (y) => {
    let tur = y ? 'lokal' : false
    if (!y) { y = await internetAloqa(); if (y) tur = 'internet' }
    serverli = tur; xabar()
    const xom = y || brauzerAloqa()
    jonat = (m) => xom({ ...m, kim: meniId })
    salom()
    // ustoz: boshqa ustoz oynasi darsni olib borayotgan bo'lsa — unga ergashadi, bo'lmasa o'zi ega bo'ladi
    if (rol === 'ustoz') setTimeout(() => { if (!ulandi) asosiyBol() }, 700)
    // o'quvchi: ustoz hali ochmagan yoki o'rni yo'q bo'lsa — qayta-qayta so'raydi
    else setInterval(() => { if (!ulandi || !orin(holat)) salom() }, 1500)
  })
}

const obuna = (f) => { tinglovchilar.add(f); return () => tinglovchilar.delete(f) }
export const useSinf = () => useSyncExternalStore(obuna, () => holat)
// 'kutmoqda' — ustoz darsni hali ochmagan · 'tola' — sinfda bo'sh o'rin yo'q · 'bor' — hammasi joyida
export const useServerli = () => useSyncExternalStore(obuna, () => serverli)
export const useUlanish = () => useSyncExternalStore(obuna, () => (!ulandi ? 'kutmoqda' : rol === 'bola' && !orin(holat) ? 'tola' : 'bor'))
const orin = (h) => h.bolalar.find((b) => b.real === kid)
export const men = orin // shu oynadagi o'quvchining o'rni (ustoz oynasida yo'q)
export const sana = (h, f) => h.bolalar.filter(f).length

/* ===== Soxta sinf: egallanmagan o'rinlar ustoz ochgan sahnaga qarab o'zi harakat qiladi ===== */
let taymerlar = []
let oxirgi = ''
let ulangan = false
const tasodif = (a, b) => a + Math.random() * (b - a)
const keyin = (ms, f) => taymerlar.push(setTimeout(f, ms))
// o'rinni shu orada haqiqiy o'quvchi egallagan bo'lsa, soxta harakat bekor
const ozgar = (id, ozgarish) => { if (asosiy && !holat.bolalar.find((b) => b.id === id)?.real) yubor({ t: 'bola', id, ozgarish }) }

function sahnaBoshlandi() {
  taymerlar.forEach(clearTimeout); taymerlar = []
  if (!asosiy) return
  const { sahna, qadam } = holat
  // har o'ringa doimiy «fe'l-atvor» raqami (0–12) — qaysi bola tez, qaysi biri yordam so'raydi
  const bb = holat.bolalar.map((b, k) => ({ ...b, i: (k + 12) % 13 })).filter((b) => !b.real)
  const har = (f) => bb.forEach((b) => f(b, b.i))
  if (sahna === 1) har((b) => !b.kirdi && keyin(tasodif(400, 6500), () => ozgar(b.id, { kirdi: true })))
  // huk savoli: ko'pchilik «sudraymiz» yoki «baqiramiz» deydi, ozchilik — «buyruq»
  if (sahna === 2 && qadam === 0) har((b, i) => b.taxmin2 == null && keyin(tasodif(1500, 8500), () => ozgar(b.id, { taxmin2: [1, 0, 1, 2, 1, 0, 1, 0, 2, 1, 0, 1, 0][i] })))
  // 13 soxta bola tinmay bosadi: chorak soniyada bir to'plam (har biri sekundiga ~3–4 marta) — o'lchagich 6–7 soniyada to'ladi
  if (sahna === 2 && qadam === 2) for (let i = 0; i < 32; i++) keyin(700 + i * 280 + tasodif(0, 80), () => asosiy && yubor({ t: 'yur', n: 11 + Math.floor(Math.random() * 7) }))
  if (sahna === 3 && qadam === 2) har((b, i) => !b.qahramon && keyin(tasodif(900, 9000), () => ozgar(b.id, { kirdi: true, qahramon: QAHRAMONLAR[(i * 2 + 1) % 5] })))
  if (sahna >= 4) har((b, i) => !b.qahramon && ozgar(b.id, { kirdi: true, qahramon: QAHRAMONLAR[(i * 2 + 1) % 5] }))
  // birinchi dastur: uch blok qo'yib yulduzga olib boradi; bittasi qiynaladi va yordam so'raydi
  if (sahna === 4 && qadam === 1) har((b, i) => {
    if (b.birga) return
    if (i === 4) { keyin(9000, () => ozgar(b.id, { yordam: true })); keyin(21000, () => ozgar(b.id, { yordam: false, birga: true, qadam: b.qadam + 5 })); return }
    keyin(tasodif(4000, 19000), () => ozgar(b.id, { birga: true, qadam: b.qadam + 3 }))
  })
  if (sahna === 5 && qadam === 0) har((b, i) => b.taxmin5 == null && i !== 9 && keyin(tasodif(1200, 8000), () => ozgar(b.id, { taxmin5: [1, 1, 2, 1, 0, 2, 1, 1, 2, 1, 2, 1, 0][i] })))
  if (sahna === 6) har((b, i) => {
    const tez = [1, 0.7, 1.6, 0.9, 2.2, 0.8, 1.2, 0.6, 1.4, 1, 1.9, 0.75, 1.1][i]
    const eng = [3, 4, 2, 3, 1, 4, 3, 4, 2, 3, 2, 4, 3][i]
    for (let p = b.pog + 1; p <= eng; p++) keyin((p - b.pog) * 11000 * tez + tasodif(0, 4000), () => ozgar(b.id, { pog: p, yordam: false, qadam: (holat.bolalar.find((x) => x.id === b.id)?.qadam || 0) + [4, 2, 5, 9][p - 1] }))
    if (i === 4) keyin(9000, () => ozgar(b.id, { yordam: true }))
    if (i === 10) { keyin(26000, () => ozgar(b.id, { yordam: true })); keyin(41000, () => ozgar(b.id, { yordam: false })) }
  })
  if (sahna === 9 && qadam === 2) har((b, i) => b.taxmin9 == null && i !== 3 && keyin(tasodif(1200, 7500), () => ozgar(b.id, { taxmin9: [0, 1, 0, 1, 2, 0, 1, 0, 1, 1, 0, 2, 0][i] })))
  if (sahna === 10) har((b, i) => !b.rang && keyin(tasodif(1500, 11000), () => ozgar(b.id, { rang: RANGLAR[(i * 3 + 1) % 8], qism: 'bor' })))
  // gapirtirish: bolalar ustoz namunasidan keyin (2-qadamdan) ishlaydi; har pog'ona — bir-ikki gap
  if (sahna === 11 && qadam >= 1) har((b, i) => {
    const tez = [1.1, 0.8, 1.7, 1, 2.1, 0.9, 1.3, 0.7, 1.5, 1, 1.8, 0.8, 1.2][i]
    const eng = [3, 4, 2, 3, 2, 4, 3, 4, 2, 3, 1, 4, 3][i]
    for (let k = b.pog2 + 1; k <= eng; k++) keyin((k - b.pog2) * 12000 * tez + tasodif(0, 4000), () => ozgar(b.id, { pog2: k, yordam: false, gap: (holat.bolalar.find((x) => x.id === b.id)?.gap || 0) + 1 + (k % 2) }))
    if (i === 10 && qadam === 1) keyin(11000, () => ozgar(b.id, { yordam: true }))
  })
  // o'z sahnasi: avval joy tanlaydi (sinf doskasida «kim qayerni tanladi» shu bilan to'ladi), keyinroq sahnasi tayyor bo'ladi
  if (sahna === 13) har((b, i) => {
    const zona = ['hovli', 'kosmos', 'suv', 'kosmos'][i % 4]
    if (!b.sahnam) keyin(tasodif(2000, 9000), () => ozgar(b.id, { sahnam: { zona } }))
    if (!b.tayyor && i !== 6) keyin(tasodif(14000, 42000), () => ozgar(b.id, { tayyor: true, sahnam: { zona: holat.bolalar.find((x) => x.id === b.id)?.sahnam?.zona || zona }, qadam: (holat.bolalar.find((x) => x.id === b.id)?.qadam || 0) + 4, gap: (holat.bolalar.find((x) => x.id === b.id)?.gap || 0) + 2 }))
  })
  // yakun: o'z dasturini yurgizmagan soxta bolalarga (masalan, dars o'rtasidan ochilgan ko'rikda) taxminiy sanoq — «Sinfimiz bugun» bo'sh chiqmasin
  if (sahna === 15) har((b, i) => { if (!b.qadam && !b.gap) ozgar(b.id, { qadam: 12 + ((i * 7) % 17), gap: 2 + ((i * 3) % 6) }) })
}
function soxtaSinf() {
  const tekshir = () => { if (!asosiy) return; const k = holat.sahna + ':' + holat.qadam; if (k !== oxirgi) { oxirgi = k; sahnaBoshlandi() } }
  if (!ulangan) { ulangan = true; tinglovchilar.add(tekshir) }
  tekshir()
}

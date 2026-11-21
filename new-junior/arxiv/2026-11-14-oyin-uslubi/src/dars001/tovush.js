// Tovush effektlari (gap emas): qadam, yulduz, muammocha, tugma. Faqat proyektorda yoqiladi — bola noutbuklari jim (qaror 13.11).
let ctx = null
let yoqilgan = false
export const tovushniYoq = (ha) => { yoqilgan = ha }

function nota(chastota, boshi, uzunligi, tur = 'sine', kuch = 0.12) {
  const o = ctx.createOscillator(), g = ctx.createGain()
  o.type = tur; o.frequency.value = chastota
  g.gain.setValueAtTime(0.0001, ctx.currentTime + boshi)
  g.gain.exponentialRampToValueAtTime(kuch, ctx.currentTime + boshi + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + boshi + uzunligi)
  o.connect(g).connect(ctx.destination)
  o.start(ctx.currentTime + boshi); o.stop(ctx.currentTime + boshi + uzunligi + 0.02)
}
const KUY = {
  bos: () => nota(520, 0, 0.07, 'triangle', 0.08),
  qadam: () => nota(330, 0, 0.13, 'triangle', 0.11),
  yulduz: () => [660, 880, 1100, 1320].forEach((f, i) => nota(f, i * 0.09, 0.22, 'sine', 0.11)),
  muammo: () => { nota(330, 0, 0.16, 'sine', 0.1); nota(262, 0.14, 0.24, 'sine', 0.1) },
}
export function chal(nom) {
  if (!yoqilgan) return
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    KUY[nom]?.()
  } catch { /* tovush chiqmasa dars to'xtamaydi */ }
}

// Coddy ovozi (8-versiya, 13-band qabul qilingan): «de» blokidagi gapni o'zbekcha aytadi — tovush kabi faqat proyektorda
// (bola noutbuklari darsda jim; uyda mustaqil ishlaganda yoqiladi).
// 1) Darsdagi tayyor gaplar oldindan mp3 qilingan (public/ovoz, sinov/ovoz-yarat.py — mentor kursidagi kabi Sardor ovozi): har qanday brauzerda gapiradi.
// 2) Ro'yxatda yo'q gap (ustoz o'zi yozgani) — brauzerning o'zbek ovozi bilan, agar bo'lsa (Edge'da bor deb bilamiz).
// 3) Ikkalasi ham bo'lmasa — jim, pufak baribir chiqadi: boshqa tilning ovozi o'zbekcha so'zni buzib o'qiydi.
// Bola yozgan gap ovoz chiqarib aytiladigan joyda (uy, galereya) qo'pol so'z filtri shart bo'ladi (KONSEPSIYA 12-bo'lim, 35-band).
export const kalit = (s) => s.toLowerCase().replace(/[’ʻʼ`]/g, "'").replace(/[^\p{L}\p{N}\s']/gu, '').replace(/\s+/g, ' ').trim()
const OVOZ_PAPKA = (import.meta.env?.BASE_URL || '/') + 'ovoz/'
let royxat = null
if (typeof window !== 'undefined') fetch(OVOZ_PAPKA + 'royxat.json').then((j) => (j.ok ? j.json() : {})).then((r) => { royxat = r }).catch(() => { royxat = {} })
let uzOvoz = null
const ovozTop = () => { try { uzOvoz = window.speechSynthesis.getVoices().find((v) => /^uz/i.test(v.lang)) || null } catch { uzOvoz = null } }
if (typeof window !== 'undefined' && window.speechSynthesis) { ovozTop(); window.speechSynthesis.addEventListener?.('voiceschanged', ovozTop) }
export const ozbekOvozBor = () => !!uzOvoz
let ijro = null
// gapiradimi — true: ovoz chiqadi (chaqiruvchi «bos» tovushini chalmaydi)
export function gapir(matn) {
  if (!yoqilgan || !matn) return false
  try {
    ijro?.pause(); window.speechSynthesis?.cancel()
    const fayl = royxat?.[kalit(matn)]
    if (fayl) { ijro = new Audio(OVOZ_PAPKA + fayl); ijro.play().catch(() => {}); return true }
    if (!uzOvoz) return false
    const u = new SpeechSynthesisUtterance(matn)
    u.voice = uzOvoz; u.lang = uzOvoz.lang; u.pitch = 1.45; u.rate = 0.95
    window.speechSynthesis.speak(u)
    return true
  } catch { return false /* ovoz chiqmasa dars to'xtamaydi */ }
}

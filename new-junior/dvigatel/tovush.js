// ===== Demo: tovushlar (18.11, qaror 3A) =====
// Tovush effektlari (gap emas — Coddy gapini ovozda o'qish shart emas, foydalanuvchi 18.11): bosish · qadam · sakrash · yulduz · xato.
// Ohanglar eski 1-dars kodidagi bilan bir xil (src/dars001/tovush.js), brauzerning o'zida sintez qilinadi — fayl kerak emas.
// Qachon chalinadi: ustoz ekranida (proyektor) — doim; ikkala oyna yonma-yon (ko'rik) — ham; jonli darsda bola noutbuki — jim
// (14 ta noutbuk birdan chalinmasin); bola solo (ustozsiz) o'tsa — uning noutbukida. Ustoz panelidagi «Ovoz» tugmasi o'chirib-yoqadi.
// sahifa.mjs shu faylni studiya kodidan OLDIN qo'shadi; ROL, SOLO — asosiy skriptda (chaqirilganda tayyor bo'ladi).
let TOV_CTX = null
function tovNota(ch, boshi, uz, tur = 'sine', kuch = 0.12) {
  const c = TOV_CTX, o = c.createOscillator(), g = c.createGain()
  o.type = tur; o.frequency.value = ch
  g.gain.setValueAtTime(0.0001, c.currentTime + boshi)
  g.gain.exponentialRampToValueAtTime(kuch, c.currentTime + boshi + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + boshi + uz)
  o.connect(g).connect(c.destination)
  o.start(c.currentTime + boshi); o.stop(c.currentTime + boshi + uz + 0.02)
}
const TOV_KUY = {
  bos: () => tovNota(520, 0, 0.07, 'triangle', 0.08),
  qadam: () => tovNota(330, 0, 0.13, 'triangle', 0.11),
  sakra: () => { tovNota(392, 0, 0.1, 'triangle', 0.1); tovNota(523, 0.08, 0.14, 'triangle', 0.1) },
  yulduz: () => [660, 880, 1100, 1320].forEach((f, i) => tovNota(f, i * 0.09, 0.22, 'sine', 0.11)),
  muammo: () => { tovNota(330, 0, 0.16, 'sine', 0.1); tovNota(262, 0.14, 0.24, 'sine', 0.1) },
  // 5a: labirintda devorga urilish — qisqa past «tuk»
  tuk: () => { tovNota(150, 0, 0.08, 'square', 0.06); tovNota(110, 0.02, 0.12, 'sine', 0.12) },
}
// ustozning tanlovi shu kompyuterda saqlanadi (dars sessiyasiga bog'liq emas — keyingi darsda ham o'sha)
function ovozKalit() { return 'jr-ovoz' }
function ovozYoqiq() { try { return localStorage.getItem(ovozKalit()) !== '0' } catch (e) { return true } }
function ovozAlmashtir() { const y = !ovozYoqiq(); try { localStorage.setItem(ovozKalit(), y ? '1' : '0') } catch (e) {} return y }
function ovozShumi() {
  if (!ovozYoqiq()) return false
  const rol = typeof ROL !== 'undefined' ? ROL : ''
  if (rol === 'ustoz' || rol === 'yonma') return true
  return rol === 'bola' && typeof SOLO !== 'undefined' && !!SOLO
}
function chal(nom) {
  if (!ovozShumi() || !TOV_KUY[nom]) return
  try {
    TOV_CTX = TOV_CTX || new (window.AudioContext || window.webkitAudioContext)()
    if (TOV_CTX.state === 'suspended') TOV_CTX.resume()
    TOV_KUY[nom]()
  } catch (e) { /* tovush chiqmasa dars to'xtamaydi */ }
}

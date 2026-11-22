// --- tahrir: «aynan bitta xato» (14-dars, KOD 4; 21.11) — toza hisob, DOM'ga tegmaydi (studiya.js chaqiradi; sinov Node'da ham yuritadi).
// Dastur: [{ t, n?, X?, Y?, ichki }] — t: 'r' 'l' 'u' 'd' (move), 'x' (go to: X, Y), 'p' (repeat: n, ichki). Maydon m: { w, h, start: [x, y],
// olma: [[x, y]…], yulduz: [x, y] } — y tepaga (sahna.js maydonBajar qoidalari: move chetdan chiqsa — to'xtaydi; go to — o'sha katakka;
// olma — qahramon o'sha katakka tushganda olinadi). Bitta o'zgartirish (manba 014 KOD 4, sinov/dvigatel/xato.mjs bilan bir ma'noda):
// move tomoni · repeat soni 2–10 · go to X 0…w−1 yoki Y 0…h−1 · blokni ✕ (ichidagilari bilan) · bir ro'yxatda ikki blok joyi · istalgan joyga move.
function thNusxa(d) { return d.map((t) => ({ t: t.t, n: t.n, X: t.X, Y: t.Y, ichki: thNusxa(t.ichki || []) })) }
function thSana(d) { return d.reduce((a, t) => a + 1 + thSana(t.ichki || []), 0) }
function thSinov(d, m) {
  const DY = { r: [1, 0], l: [-1, 0], u: [0, 1], d: [0, -1] }
  let x = m.start[0], y = m.start[1], chet = false
  const otdi = new Set([x + ',' + y])
  const yur = (r) => {
    for (const t of r) {
      if (chet) return
      if (t.t === 'p') { for (let i = 0; i < (t.n || 0) && !chet; i++) yur(t.ichki || []); continue }
      if (t.t === 'x') { x = Math.max(0, Math.min(m.w - 1, t.X)); y = Math.max(0, Math.min(m.h - 1, t.Y)); otdi.add(x + ',' + y); continue }
      const d = DY[t.t]; if (!d) continue
      const nx = x + d[0], ny = y + d[1]
      if (nx < 0 || ny < 0 || nx >= m.w || ny >= m.h) { chet = true; return }
      x = nx; y = ny; otdi.add(x + ',' + y)
    }
  }
  yur(d)
  return !chet && (m.olma || []).every(([a, b]) => otdi.has(a + ',' + b)) && x === m.yulduz[0] && y === m.yulduz[1]
}
function* thTahrirlar(d, m) {
  const yollar = [], yig = (L, yol) => { yollar.push(yol); L.forEach((t, i) => { if (t.t === 'p') yig(t.ichki, yol.concat(i)) }) }
  yig(d, [])
  const ol = (D, yol) => yol.reduce((L, i) => L[i].ichki, D)
  for (const yol of yollar) {
    const L0 = ol(d, yol), yangi = (f) => { const D = thNusxa(d); f(ol(D, yol)); return D }
    for (let i = 0; i < L0.length; i++) {
      const t = L0[i]
      if ('rlud'.indexOf(t.t) >= 0) for (const k of 'rlud') if (k !== t.t) yield yangi((L) => { L[i].t = k })
      if (t.t === 'p') for (let n = 2; n <= 10; n++) if (n !== t.n) yield yangi((L) => { L[i].n = n })
      if (t.t === 'x') { for (let X = 0; X < m.w; X++) if (X !== t.X) yield yangi((L) => { L[i].X = X }); for (let Y = 0; Y < m.h; Y++) if (Y !== t.Y) yield yangi((L) => { L[i].Y = Y }) }
      yield yangi((L) => { L.splice(i, 1) })
      for (let j = i + 1; j < L0.length; j++) yield yangi((L) => { const a = L[i]; L[i] = L[j]; L[j] = a })
    }
    for (let i = 0; i <= L0.length; i++) for (const k of 'rlud') yield yangi((L) => { L.splice(i, 0, { t: k, ichki: [] }) })
  }
}
// natija: 'kam' — bloklar kam · 'ishlayapti' — xato yo'q · 'tayyor' — aynan bitta xato · 'kop' — bitta o'zgartirish bilan tuzalmaydi
function thTopishmoq(d, m, kam = 3) {
  if (thSana(d) < kam) return 'kam'
  if (thSinov(d, m)) return 'ishlayapti'
  for (const D of thTahrirlar(d, m)) if (thSinov(D, m)) return 'tayyor'
  return 'kop'
}

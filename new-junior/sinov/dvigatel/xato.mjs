// 14-dars «Xatoni topish» — 1-qism: MUSTAQIL hisob (21.11, avtopilot). Dvigatelga tegmaydi: manba 014 jadvalidagi har da'vo
// (nima bo'ladi, «Bitta qadam» nechanchi bosishda rasmdan chiqadi, bitta o'zgartirish bilan qaysi tuzatishlar ishlaydi, bezak) o'z simulyatori bilan.
// Tahrir qidiruvi — bola qila oladigan hamma bitta o'zgartirish: son (repeat 2–10 — dvigateldagidek, 21.11 manba 2-qarori, go to X 0–6 / Y 0–4), tomon (move, if), blokni ✕ (ichidagilari bilan),
// bir ro'yxatdagi ikki blok joyini almashtirish, istalgan joyga move qo'shish.
// Ishlatish: node new-junior/sinov/dvigatel/xato.mjs
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const D = { r: [1, 0], l: [-1, 0], u: [0, 1], d: [0, -1] }
const K = (x, y) => x + ',' + y
// dastur yozuvi: «R2[r] R3[u]», «go(5,2)», «r r d», ichki — kvadrat qavsda; if — «i:r[r]»
function oqi(s) {
  const t = s.replace(/\[/g, ' [ ').replace(/\]/g, ' ] ').trim().split(/\s+/).filter(Boolean); let i = 0
  const ro = () => { const out = []; while (i < t.length && t[i] !== ']') { const w = t[i++]
    if (/^R\d+$/.test(w)) { i++; out.push({ t: 'R', n: +w.slice(1), b: ro() }); i++ } // R10 ham (repeat 2–10)
    else if (/^i:[rlud]$/.test(w)) { i++; out.push({ t: 'if', d: w[2], b: ro() }); i++ }
    else if (/^go\(/.test(w)) { const [x, y] = w.slice(3, -1).split(','); out.push({ t: 'g', x: +x, y: +y }) }
    else out.push({ t: 'm', d: w }) } return out }
  return ro()
}
const yoz = (p) => p.map((b) => b.t === 'R' ? `R${b.n}[${yoz(b.b)}]` : b.t === 'if' ? `i:${b.d}[${yoz(b.b)}]` : b.t === 'g' ? `go(${b.x},${b.y})` : b.d).join(' ')
const nusxa = (p) => JSON.parse(JSON.stringify(p))
// bajarish: maydon 7×5 yoki labirint (lab — qatorlar tepadan); qadam = move yoki go to (if tekshiruvi qadam emas — bu hisobda)
function bajar(p, start, lab) {
  let [x, y] = start; const iz = [{ x, y, q: 0, blok: 0 }]; let q = 0, n = 0, toxta = null
  const W = lab ? lab[0].length : 7, H = lab ? lab.length : 5
  const bor = (a, b) => a >= 0 && a < W && b >= 0 && b < H && (!lab || lab[H - 1 - b][a] !== '#')
  const raq = new Map(); const sana = (r) => r.forEach((b) => { raq.set(b, ++n); if (b.b) sana(b.b) }); sana(p)
  const yur = (r) => { for (const b of r) { if (toxta) return
    if (b.t === 'R') { for (let k = 0; k < b.n && !toxta; k++) yur(b.b) }
    else if (b.t === 'if') { const [dx, dy] = D[b.d]; if (bor(x + dx, y + dy)) yur(b.b) }
    else if (b.t === 'g') { q++; if (!(b.x >= 0 && b.x < W && b.y >= 0 && b.y < H)) { toxta = { q, blok: raq.get(b), tur: 'chet' }; return } x = b.x; y = b.y; iz.push({ x, y, q, blok: raq.get(b) }) }
    else { const [dx, dy] = D[b.d]; q++; if (!bor(x + dx, y + dy)) { toxta = { q, blok: raq.get(b), tur: lab ? 'devor' : 'chet' }; return } x += dx; y += dy; iz.push({ x, y, q, blok: raq.get(b) }) } } }
  yur(p); return { iz, oxiri: [x, y], toxta }
}
// topshiriq: yulduz (olmalar terilib, oxiri yulduzda, to'xtamasdan) yoki rasm (kulrangdan chiqmay, hammasi bo'yalgan)
function holat(p, v) {
  const r = bajar(p, v.start, v.lab)
  if (v.rasm) { const g = new Set(v.rasm.map(([a, b]) => K(a, b))), chiq = r.iz.find((s) => !g.has(K(s.x, s.y))), bo = new Set(r.iz.map((s) => K(s.x, s.y)))
    return { r, chiq, ok: !r.toxta && !chiq && [...g].every((k) => bo.has(k)) } }
  const bo = new Set(r.iz.map((s) => K(s.x, s.y))), qol = (v.olma || []).filter(([a, b]) => !bo.has(K(a, b)))
  return { r, qol, ok: !r.toxta && !qol.length && K(...r.oxiri) === K(...v.yulduz) }
}
// bitta o'zgartirishlar
function* royxatlar(p) { yield p; for (const b of p) if (b.b) yield* royxatlar(b.b) }
function* tahrirlar(p0) {
  const L0 = [...royxatlar(p0)]
  const har = function* (f) { for (let li = 0; li < L0.length; li++) { const p = nusxa(p0), L = [...royxatlar(p)]; const r = f(L[li], li, p); if (r) yield* r } }
  for (let li = 0; li < L0.length; li++) for (let bi = 0; bi < L0[li].length; bi++) {
    const b0 = L0[li][bi], ol = () => { const p = nusxa(p0); return [p, [...royxatlar(p)][li][bi], [...royxatlar(p)][li]] }
    if (b0.t === 'R') for (let n = 2; n <= 10; n++) if (n !== b0.n) { const [p, b] = ol(); b.n = n; yield [p, `${bi + 1}-blok R${b0.n}→R${n}`] }
    if (b0.t === 'm' || b0.t === 'if') for (const d of 'rlud') if (d !== b0.d) { const [p, b] = ol(); b.d = d; yield [p, `${b0.t === 'if' ? 'if' : 'move'} ${b0.d}→${d}`] }
    if (b0.t === 'g') { for (let x = 0; x <= 6; x++) if (x !== b0.x) { const [p, b] = ol(); b.x = x; yield [p, `go X ${b0.x}→${x}`] } for (let y = 0; y <= 4; y++) if (y !== b0.y) { const [p, b] = ol(); b.y = y; yield [p, `go Y ${b0.y}→${y}`] } }
    { const [p, , r] = ol(); r.splice(bi, 1); yield [p, `✕ ${yoz([b0])}`] }
    for (let bj = bi + 1; bj < L0[li].length; bj++) { const [p, , r] = ol(); [r[bi], r[bj]] = [r[bj], r[bi]]; yield [p, `almash ${yoz([b0])} ↔ ${yoz([L0[li][bj]])}`] }
  }
  yield* har(function* (r, li) { for (let k = 0; k <= r.length; k++) for (const d of 'rlud') { const p = nusxa(p0), R = [...royxatlar(p)][li]; R.splice(k, 0, { t: 'm', d }); yield [p, `+${d} ${li ? 'ichiga' : ''}${k + 1}-o‘ringa`] } })
}
const tuzat = (p, v) => { const s = []; for (const [q, nom] of tahrirlar(p)) if ((v.lab2 ? holat(q, v).ok && holat(q, { ...v, lab: v.lab2, start: v.start2 }).ok : holat(q, v).ok)) s.push(nom); return s }
const BEZAK = ['1,1', '4,3', '6,1', '0,4', '2,3', '5,4', '6,3']

// ===== 1-qism: maydon va rasm pog'onalari
const T = {
  huk: { start: [0, 0], rasm: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [3, 2], [4, 2], [5, 2]], p: 'R2[r] R3[u] R3[r]', fix: 'R2[r] R2[u] R3[r]' },
  u10: { start: [2, 0], rasm: [[2, 0], [3, 0], [3, 1], [4, 1], [4, 2], [5, 2], [5, 3]], p: 'R3[u r]', fix: 'R3[r u]' },
  b81: { start: [0, 0], olma: [[4, 1]], yulduz: [4, 2], p: 'R4[l] R2[u]', fix: 'R4[r] R2[u]' },
  b82: { start: [5, 3], olma: [[5, 2], [5, 1]], yulduz: [5, 0], p: 'R5[d]', fix: 'R3[d]' },
  b83: { start: [0, 0], olma: [[6, 2], [4, 2], [2, 2]], yulduz: [1, 2], p: 'go(5,2) R5[l]', fix: 'go(6,2) R5[l]' },
  b8y: { start: [6, 0], olma: [[3, 0]], yulduz: [0, 2], p: 'R6[r] R3[u]', fix: 'R6[l] R2[u]' },
  b111: { start: [0, 0], rasm: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2]], p: 'R2[u] u R3[r]', fix: 'R2[u] R3[r]' },
  b112: { start: [0, 2], rasm: [[0, 2], [1, 2], [2, 2], [2, 1], [2, 0], [3, 0], [4, 0]], p: 'r r d r r', fix: 'r r d d r r' },
  b113: { start: [2, 0], rasm: [[2, 0], [2, 1], [2, 2], [3, 2], [4, 2], [4, 1], [4, 0]], p: 'R2[u] R2[d] R2[r]', fix: 'R2[u] R2[r] R2[d]' },
  b11y: { start: [0, 0], rasm: [[0, 0], [0, 1], [0, 2], [0, 3], [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [5, 0], [5, 1], [5, 2], [5, 3]], p: 'R3[u] go(2,0) R4[u] go(5,0) R3[u]', fix: 'R3[u] go(3,0) R4[u] go(5,0) R3[u]' },
}
for (const [k, v] of Object.entries(T)) { const h = holat(oqi(v.p), v), f = holat(oqi(v.fix), v); tek(`${k}: tayyor dastur ishlamaydi, tuzatilgani ishlaydi`, !h.ok && f.ok, `${h.ok} ${f.ok}`) }
// nima bo'ladi
let h = holat(oqi(T.huk.p), T.huk); tek('huk: rasmdan chiqdi (2, 3) — 5-qadam, 4-blok; oxiri (5, 3)', K(h.chiq.x, h.chiq.y) === '2,3' && h.chiq.q === 5 && h.chiq.blok === 4 && K(...h.r.oxiri) === '5,3', JSON.stringify(h.chiq))
h = holat(oqi('R2[r] R3[u] R2[r]'), T.huk); tek('huk A (oxirgi repeat 3→2): yana (2, 3), oxiri (4, 3)', K(h.chiq.x, h.chiq.y) === '2,3' && K(...h.r.oxiri) === '4,3')
h = holat(oqi('R3[r] R3[u] R3[r]'), T.huk); tek('huk B (1-repeat 2→3): chiqdi (3, 0)', K(h.chiq.x, h.chiq.y) === '3,0')
h = holat(oqi(T.u10.p), T.u10); tek('10: chiqdi (2, 1) — 1-qadam, 2-blok', K(h.chiq.x, h.chiq.y) === '2,1' && h.chiq.q === 1 && h.chiq.blok === 2)
h = holat(oqi(T.b81.p), T.b81); tek('8 · 1: 2-blokda darrov chet', h.r.toxta?.tur === 'chet' && h.r.toxta.blok === 2 && h.r.toxta.q === 1)
h = holat(oqi(T.b82.p), T.b82); tek('8 · 2: yulduzga yetib, 4-safarda chet (2-blok)', h.r.toxta?.blok === 2 && h.r.toxta.q === 4 && h.r.iz.some((s) => K(s.x, s.y) === '5,0'))
h = holat(oqi(T.b83.p), T.b83); tek('8 · 3: (0, 2) da tugadi, olma (6, 2) qoldi', !h.r.toxta && K(...h.r.oxiri) === '0,2' && h.qol.length === 1 && K(...h.qol[0]) === '6,2')
h = holat(oqi('go(5,2) R4[l]'), T.b83); tek('8 · 3: R5→R4 — olma (6, 2) baribir qoladi', !h.ok && h.qol.some(([a, b]) => K(a, b) === '6,2'))
h = holat(oqi(T.b8y.p), T.b8y); tek('8 · ★: 2-blokda darrov chet', h.r.toxta?.blok === 2 && h.r.toxta.q === 1)
h = holat(oqi('R6[l] R3[u]'), T.b8y); tek('8 · ★: birinchisi tuzatilsa — yulduzdan o‘tib ketdi (0, 3)', !h.r.toxta && K(...h.r.oxiri) === '0,3')
h = holat(oqi(T.b111.p), T.b111); tek('11 · 1: chiqdi (0, 3) — 3-qadam, 3-blok; oxiri (3, 3)', K(h.chiq.x, h.chiq.y) === '0,3' && h.chiq.q === 3 && h.chiq.blok === 3 && K(...h.r.oxiri) === '3,3')
h = holat(oqi('R2[u] r R3[r]'), T.b111); tek('11 · 1: ortiqcha ↑ ni → ga almashtirish — (4, 2) chiqadi', !h.ok && K(h.chiq.x, h.chiq.y) === '4,2')
h = holat(oqi(T.b112.p), T.b112); tek('11 · 2: chiqdi (3, 1) — 4-qadam, 4-blok; oxiri (4, 1)', K(h.chiq.x, h.chiq.y) === '3,1' && h.chiq.q === 4 && h.chiq.blok === 4 && K(...h.r.oxiri) === '4,1')
h = holat(oqi(T.b113.p), T.b113); tek('11 · 3: chiqdi (3, 0) — 5-qadam, 6-blok; oxiri (4, 0)', K(h.chiq.x, h.chiq.y) === '3,0' && h.chiq.q === 5 && h.chiq.blok === 6 && K(...h.r.oxiri) === '4,0')
h = holat(oqi(T.b11y.p), T.b11y); tek('11 · ★: 13 ta kulrang; chiqdi (2, 0) — 4-qadam, 3-blok; oxiri (5, 3)', T.b11y.rasm.length === 13 && K(h.chiq.x, h.chiq.y) === '2,0' && h.chiq.q === 4 && h.chiq.blok === 3 && K(...h.r.oxiri) === '5,3')
// tahrir qidiruvi: manbadagi «bitta o'zgartirish bilan» ustuni
const KUT = {
  huk: ['2-blok R3→R2'], u10: ['almash u ↔ r'], b81: ['move l→r'], b82: ['1-blok R5→R3'], b83: ['go X 5→6', '+r 2-o‘ringa'] /* manba: «faqat X 5→6» — mustaqil qidiruv ikkinchisini topdi: go to dan keyin → */, b8y: [],
  b111: ['✕ u', '+d 2-o‘ringa'] /* manba: «faqat ✕» — yana: ↓ qo'shish (↑↑↓↑ — kulrangda qoladi); R2→R1 — dvigatelda repeat 1 yo'q (21.11) */, b112: ['+d 3-o‘ringa', '+d 4-o‘ringa'], b113: ['almash R2[d] ↔ R2[r]'], b11y: ['go X 2→3'],
}
for (const [k, v] of Object.entries(T)) { const s = tuzat(oqi(v.p), v); tek(`${k}: bitta o'zgartirish bilan — ${KUT[k].length ? KUT[k].join(', ') : 'yo‘q'}`, JSON.stringify(s) === JSON.stringify(KUT[k]), s.join(' | ')) }
// bezak: start, olma, yulduz, kulrang va tuzatilgan yo'l bezakda emas
for (const [k, v] of Object.entries(T)) { const kat = [v.start, ...(v.olma || []), ...(v.yulduz ? [v.yulduz] : []), ...(v.rasm || [])].map(([a, b]) => K(a, b)), yol = bajar(oqi(v.fix), v.start).iz.map((s) => K(s.x, s.y)); const t = [...kat, ...yol].filter((c) => BEZAK.includes(c)); tek(`${k}: start/olma/yulduz/kulrang va tuzatilgan yo'l bezakdan tashqari`, !t.length, t.join(' ')) }
// tuzatilganlar takrorlanmaydi
const fx = Object.values(T).map((v) => v.fix); tek('tuzatilgan dasturlar (maydon/rasm) hammasi har xil', new Set(fx).size === fx.length)

// ===== 2-qism: 3-bekat
const L1 = ['#######', 'S···★##', '#######'].map((r) => r.replace('S', '·').replace('★', '·')), L2 = ['###·★', '##··#', '#··##', 'S·###'].map((r) => r.replace('S', '·').replace('★', '·'))
const V15 = { start: [0, 1], yulduz: [4, 1], lab: L1, start2: [0, 0], lab2: L2 }
const lab = (p0, n) => { const p = typeof p0 === 'string' ? oqi(p0) : p0; return n === 1 ? holat(p, { start: V15.start, yulduz: V15.yulduz, lab: L1 }) : holat(p, { start: V15.start2, yulduz: [4, 3], lab: L2 }) }
let a = lab('R6[i:r[r] i:d[u]]', 1), b = lab('R6[i:r[r] i:d[u]]', 2)
tek('15 · 1: 1-labirintda ★ (4 qadam); 2-labirintda 1 qadamda turib qoldi', a.ok && a.r.iz.length - 1 === 4 && !b.ok && b.r.iz.length - 1 === 1, `${a.r.iz.length - 1} ${b.r.iz.length - 1}`)
a = lab('R6[i:r[r] i:u[u]]', 1); b = lab('R6[i:r[r] i:u[u]]', 2)
tek('15 · 1: tuzatilgani — ikkala labirintda ★, 2-labirintda 7 qadam', a.ok && b.ok && b.r.iz.length - 1 === 7, `${a.ok} ${b.ok} ${b.r.iz.length - 1}`)
tek('15 · 1: R3 bilan 2-labirintda yetmaydi (son 4 dan kam)', !lab('R3[i:r[r] i:u[u]]', 2).ok && lab('R4[i:r[r] i:u[u]]', 2).ok)
{ const s = []; for (const [q, nom] of tahrirlar(oqi('R6[i:r[r] i:d[u]]'))) { if (lab(q, 1).ok && lab(q, 2).ok) s.push(nom) } tek('15 · 1: bitta o‘zgartirish bilan — faqat ikkinchi if tomoni ↓→↑', JSON.stringify(s) === JSON.stringify(['if d→u']), s.join(' | ')) }
// 15 · 2 o'yin: hodisalar — bosilgan tugmaning hamma dasturchasi ketma-ket
const oyin = (ev, bos, start = [0, 0]) => { let [x, y] = start; const iz = [K(x, y)], bosh = []; for (const c of bos) { const ds = ev.filter(([t]) => t === c); if (!ds.length) { bosh.push(c); continue } for (const [, d] of ds) { const [dx, dy] = D[d]; if (x + dx >= 0 && x + dx < 7 && y + dy >= 0 && y + dy < 5) { x += dx; y += dy; iz.push(K(x, y)) } } } return { x, y, iz, bosh } }
const XATO2 = [['r', 'r'], ['l', 'l'], ['u', 'u'], ['u', 'd']], TOG2 = [['r', 'r'], ['l', 'l'], ['u', 'u'], ['d', 'd']]
let o = oyin(XATO2, 'u'); tek('15 · 2: ↑ — tepaga chiqib qaytib tushadi (ikki dasturcha)', o.x === 0 && o.y === 0 && o.iz.includes('0,1'))
o = oyin(XATO2, 'd'); tek('15 · 2: ↓ — dasturcha yo‘q (Bo‘shvoy)', o.bosh.join('') === 'd')
o = oyin(XATO2, 'rrll'); tek('15 · 2: → va ← ishlaydi', o.iz.join(' ') === '0,0 1,0 2,0 1,0 0,0')
const NAMUNA = 'uurrddrrrlluuuu'; o = oyin(TOG2, NAMUNA)
tek('15 · 2: namuna o‘yin — 15 bosish, olmalar (2, 2), (5, 0), oxiri yulduz (3, 4)', NAMUNA.length === 15 && o.iz.includes('2,2') && o.iz.includes('5,0') && K(o.x, o.y) === '3,4' && o.iz.indexOf('3,4') > Math.max(o.iz.indexOf('2,2'), o.iz.indexOf('5,0')))
tek('15 · 2: namuna yo‘li va start/olma/yulduz bezakka tegmaydi', !o.iz.some((c) => BEZAK.includes(c)) && !['0,0', '2,2', '5,0', '3,4'].some((c) => BEZAK.includes(c)))
// random: savatlar
const savat = (xs, y) => new Set(xs.map((x) => K(x, y)))
const S14 = savat([2, 3, 4, 5, 6], 0), S153 = savat([0, 1, 2, 3, 4, 5], 2)
tek('14: go(R2-7, 0) — 7 maydondan tashqari, 2…6 savatga', [2, 3, 4, 5, 6].every((x) => S14.has(K(x, 0))) && 7 > 6)
const p7 = 1 - (5 / 6) ** 3; tek(`14: uch ishga tushirishda 7 chiqishi — ${(p7 * 100).toFixed(1)}% (manbada 42%; 21.11 gacha «41%» edi)`, Math.round(p7 * 100) === 42)
tek('15 · 3: go(R1-5, 2) — har tanlov savatga, (0, 2) ga hech qachon', [1, 2, 3, 4, 5].every((x) => S153.has(K(x, 2))) && ![1, 2, 3, 4, 5].includes(0))
tek('15 · 3: R0-5 — hamma savatga yetadi; R0-6 — (6, 2) da savat yo‘q', [0, 1, 2, 3, 4, 5].every((x) => S153.has(K(x, 2))) && !S153.has('6,2'))
tek('savatlar, Coddy (0, 2) / qahramon (3, 0) bezakda emas', ![...S14, ...S153, '0,2', '3,0'].some((c) => BEZAK.includes(c)))
// 15 · ★ topishmoq: dastur ishlamaydi, bitta o'zgartirish bilan ishlaydi, kamida 3 blok
const VT = { start: [0, 0], olma: [[2, 2]], yulduz: [4, 2] }
const bloklar = (p) => [...royxatlar(p)].reduce((s, r) => s + r.length, 0)
const topish = (s) => { const p = oqi(s); if (bloklar(p) < 3) return 'kam'; if (holat(p, VT).ok) return 'ishlayapti'; for (const [q] of tahrirlar(p)) if (holat(q, VT).ok) return 'tayyor'; return 'kop' }
for (const [s, kut] of [['R2[u] R3[r]', 'tayyor'], ['R2[u] R4[l]', 'tayyor'], ['R4[r] R2[u]', 'tayyor'], ['R2[u] R4[r]', 'ishlayapti'], ['R3[u] R5[r]', 'kop'], ['go(4,2) R2[u]', 'kop'], ['r r', 'kam']])
  tek(`15 · ★: ${s} — ${kut}`, topish(s) === kut, topish(s))
tek('15 · ★: start, olma, yulduz bezakda emas', !['0,0', '2,2', '4,2'].some((c) => BEZAK.includes(c)))

// ===== 3-qism (21.11): dvigateldagi topishmoq tekshiruvi (dvigatel/tahrir.js) shu mustaqil hisob bilan bir xilmi — tasodifiy dasturlar
{
  const { readFileSync } = await import('node:fs')
  const TH = new Function(readFileSync(new URL('../../dvigatel/tahrir.js', import.meta.url), 'utf8') + '; return { thTopishmoq, thSinov }')()
  const th = (p) => p.map((b) => (b.t === 'R' ? { t: 'p', n: b.n, ichki: th(b.b) } : b.t === 'g' ? { t: 'x', X: b.x, Y: b.y, ichki: [] } : { t: b.d, ichki: [] }))
  const M = { w: 7, h: 5, start: VT.start, olma: VT.olma, yulduz: VT.yulduz }
  for (const [s, kut] of [['R2[u] R3[r]', 'tayyor'], ['R2[u] R4[l]', 'tayyor'], ['R4[r] R2[u]', 'tayyor'], ['R2[u] R4[r]', 'ishlayapti'], ['R3[u] R5[r]', 'kop'], ['go(4,2) R2[u]', 'kop'], ['r r', 'kam']])
    tek(`dvigatel tahrir.js: ${s} — ${kut}`, TH.thTopishmoq(th(oqi(s)), M) === kut, TH.thTopishmoq(th(oqi(s)), M))
  // ishlaydigan dasturlardan boshlab 0–2 ta tasodifiy bitta o'zgartirish (mustaqil tahrirlar() dan) — natijalar aralash chiqsin
  let u = 2026, farq = []; const son = {}
  const rnd = (n) => { u = (u * 1103515245 + 12345) % 2147483648; return u % n }
  const ASOS = ['R2[u] R4[r]', 'go(2,2) R2[r]', 'R2[r] R2[u] R2[r]', 'u u R4[r]', 'R2[u] r r r r', 'go(0,2) R4[r]', 'r r R2[u] r r', 'R2[u] R2[r] R2[r]']
  for (let i = 0; i < 400; i++) { let p = oqi(ASOS[rnd(ASOS.length)]); for (let k = rnd(3); k > 0; k--) { const t = [...tahrirlar(p)]; p = t[rnd(t.length)][0] } const s = yoz(p), a = topish(s), b2 = TH.thTopishmoq(th(oqi(s)), M); son[a] = (son[a] || 0) + 1; if (a !== b2) farq.push(`${s}: mustaqil ${a}, dvigatel ${b2}`) }
  console.log('   taqsimot:', JSON.stringify(son))
  tek('dvigatel tahrir.js = mustaqil hisob (400 dastur: ishlaydigandan 0–2 o‘zgartirish, urug‘ 2026)', !farq.length && son.tayyor > 50 && son.kop > 50 && son.ishlayapti > 20, farq.slice(0, 3).join(' | '))
}

console.log(`\n${ok} / ${jami}`); process.exit(ok === jami ? 0 : 1)

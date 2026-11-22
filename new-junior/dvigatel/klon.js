// ===== 16-dars (21.11, manba 016): klonlar — dushman (asl) va uning nusxalari =====
// studiya.js va xakaton.js dan keyin qo'shiladi (yigish.mjs skript). Studiya ekrani — bosh.klon:
//   { asl: [x, y] — asl dushman katagi, soni — nechta nusxa yerga tushishi kerak, joy — [[x, y]…] nusxa tushishi kerak katak(lar),
//     ustun: 'xil' (kamida 2 xil ustun) yoki [a, b] (ruxsat etilgan ustunlar), yer: false (yerga yetish shart emas), oyin: true — 3-bekat }.
// Dastur egasi — dushman: `when ▶ clicked` (asl bajaradi) va `when I start as a clone` (har nusxa bajaradi — alohida ijro, bir vaqtda).
// Nusxa — maydondagi alohida rasm (.kt-klon, dushman rasmi DARS.klonSvg), o'z (x, y) si bilan; `move`, `go to` (random bilan), `delete this clone`.
// Gaplar — DARS.klonGap (dvigatelda dars matni yo'q).
const KG = (k, n) => { const g = (typeof DARS !== 'undefined' && DARS.klonGap) || {}; const t = g[k] != null ? g[k] : ''; return n != null && typeof t === 'string' ? t.replace(/\bN\b/, n) : t } // N — alohida so'z («Nusxa» dagi N emas)
const klonBola = (ek) => { const r = ek && ek.parentNode && ek.parentNode.closest('#ust,#bol'); return !!r && r.id === 'bol' }
const KL_W = () => ((typeof DARS !== 'undefined' && DARS.maydon) || { w: 7 }).w - 1
const KL_H = () => ((typeof DARS !== 'undefined' && DARS.maydon) || { h: 5 }).h - 1
function klonMaydon(ek) { const k = ek.querySelector('.oyna .katak.maydon'); return k ? { k, svg: k.querySelector('svg.kt'), H: katakXarita(k.dataset.xarita).length } : null }
// dushman rasmi katakda (x, y — maydon koordinatasi, Y tepaga)
// svg — boshqa personaj rasmi (18-dars: o'q va dushman bir o'yinda); bo'lmasa DARS.klonSvg
function klonRasm(ek, x, y, cls, svg) {
  const m = klonMaydon(ek); if (!m || !m.svg) return null
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.setAttribute('class', cls); g.style.transform = katakJoy(x, m.H - 1 - y)
  g.innerHTML = (svg || DARS.klonSvg || '').replace('<svg ', '<svg x="4" y="18" width="72" height="62" ')
  m.svg.insertBefore(g, m.k.querySelector('.kt-q'))
  return g
}
function klonSur(ek, n, sakrab = true) { const m = klonMaydon(ek); if (m && n.g) katakSur(n.g, n.x, m.H - 1 - n.y, sakrab) }
function klonOl(ek) { ek.querySelectorAll('.katak .kt-klon, .katak .kt-asl').forEach((x) => x.remove()); ek.__klon = null }
// tayyorlash (studiyaTayyorla dan): asl o'z katagida, nusxalar yo'q, sanoq «Nusxa: 0 / N»
function klonTayyorla(ek) {
  const b = TOP(ek.dataset.id).bosh, k = b.klon || {}
  klonOl(ek)
  { const bq = ek.querySelector('.dst .bq-q'), dsb = ek.querySelector('.dst .dsb'); if (bq && dsb && dsb.nextElementSibling !== bq) dsb.after(bq); if (bq) bq.classList.remove('ochiq') } // «Boshqaruv» — sarlavhadan keyin (11–12-darsdagidek)
  const [ax, ay] = k.asl || [3, KL_H()]
  if (b.soloProg && typeof SOLO !== 'undefined' && SOLO && !ek.__klonQurildi) { ek.__klonQurildi = true; klonQur(ek, b.soloProg) }
  ek.__klon = { asl: { x: ax, y: ay, g: klonRasm(ek, ax, ay, 'kt-asl'), asl: true }, nusxa: [], soni: 0 }
  klonSanoq(ek)
}
// solo'da tayyor dastur (jonli darsda ustoz o'zi tuzadigan ekran): [[hodisa, [blok, m, ichki?]…]…]
function klonQur(ek, prog) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (!ws) return
  ws.clear()
  const ichiga = (ota, q) => { let o = null; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else ota.getInput('DO').connection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } }
  B_GURUH(() => prog.forEach(([h, ...q], i) => { const hb = blYangi(ws, h[0], h[1]); hb.moveTo(new Blockly.utils.Coordinate(0, i * 1000)); let o = hb; for (const [t, m, ich] of q) { const x = blYangi(ws, t, m); o.nextConnection.connect(x.previousConnection); if (ich) ichiga(x, ich); o = x } }))
  ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); if (typeof blTartibKeyin === 'function') blTartibKeyin(ws); sanoq(ek)
}
function klonSanoq(ek) {
  const b = TOP(ek.dataset.id).bosh, k = b.klon || {}, s = ek.__klon || { nusxa: [] }, ob = ek.querySelector('.oyna'); if (!ob) return
  let el = ob.querySelector('.kl-son'); if (!el) { ob.insertAdjacentHTML('beforeend', '<span class="gl kl-son"></span>'); el = ob.querySelector('.kl-son') }
  el.textContent = KG('sanoq', s.nusxa.length + (k.soni ? ' / ' + k.soni : ''))
}
// random bilan son (13-dars tasodif — urug'li); blok ustida tanlangan son
function klonSon(ek, b, nm) {
  const x = b.getInputTargetBlock(nm)
  if (x && x.type === 'random_n') { const a = +x.getFieldValue('A'), c = +x.getFieldValue('B'), v = tasodif(ek, Math.min(a, c), Math.max(a, c)); if (typeof blSanoq === 'function') blSanoq(x.getSvgRoot(), v); return v }
  return x ? +x.getFieldValue('N') || 0 : 0
}
// bitta blok — nusxa (yoki asl) uchun: harakat, go to, delete; 'toxta' — dasturcha shu yerda to'xtaydi
// n.s — nusxa qaysi klon holatiga tegishli (18-dars: ikki xil nusxa; bo'lmasa ek.__klon)
async function klonBlok(ek, n, t) {
  const s = n.s || ek.__klon; if (!s || n.ochdi || n.toxtat || s.toxtat) return 'toxta'
  if (t.tur === 'C') { if (n.asl) await klonYasa(ek, s); return }
  if (t.tur === 'D') { if (!n.asl) { klonOchir(ek, n); return 'toxta' } return }
  const d = { r: [1, 0], l: [-1, 0], u: [0, 1], d: [0, -1] }[t.tur]
  let nx = n.x, ny = n.y
  if (d) { nx += d[0]; ny += d[1] }
  else if (t.tur === 'x') { const [a, c] = blokXY(t.el); nx = a; ny = c }
  else if (t.tur === 'y') { const bl = blBlok(t.el), sp = (v) => { const m = /^r(\d+)-(\d+)$/.exec(v || ''); return m ? tasodif(ek, Math.min(+m[1], +m[2]), Math.max(+m[1], +m[2])) : +v || 0 }; if (bl) { nx = klonSon(ek, bl, 'X'); ny = klonSon(ek, bl, 'Y') } else if (t.el && t.el.dataset && t.el.dataset.kx != null) { nx = sp(t.el.dataset.kx); ny = sp(t.el.dataset.ky) } else return } // 18-dars: tanlanmagan personaj — saqlangan dasturdan (kosmik.js perJsonD: data-kx, data-ky)
  else return
  if (nx < 0 || nx > KL_W() || ny < 0 || ny > KL_H()) { n.chet = { x: nx, y: ny, tur: t.tur }; chal('tuk'); if (n.g && n.g.animate && d) n.g.animate([{ transform: n.g.style.transform }, { transform: n.g.style.transform.replace(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/, (m0, a, c) => 'translate(' + (+a + d[0] * 18) + 'px,' + (+c - d[1] * 18) + 'px)') }, { transform: n.g.style.transform }], { duration: 380 }); return 'toxta' }
  n.x = nx; n.y = ny; klonSur(ek, n, t.tur === 'x' || t.tur === 'y') // pastga — silliq tushish (uslubdagi transition), go to — sakrash
  chal('qadam')
  if (s.oyin && !n.asl) klonTegdimi(ek, n)
  if (s.kosmik && !n.asl && typeof kosmikNishon === 'function') kosmikNishon(ek, n) // 17-dars: o'q nishonga tegdi
}
// nusxa yasaladi — aslning joyida; o'z dasturchasini darhol boshlaydi (kutilmaydi)
async function klonYasa(ek, s0) {
  const s = s0 || ek.__klon; if (!s) return
  if (s.kosmik && !s.tushadi && typeof kosmikAslJoy === 'function') kosmikAslJoy(ek, s) // 17-dars: o'qning asli raketa ichida — raketa turgan katak
  const n = { x: s.asl.x, y: s.asl.y, g: klonRasm(ek, s.asl.x, s.asl.y, 'kt-klon yangi' + (s.cls ? ' ' + s.cls : ''), s.svg), boshladi: false, s }
  s.nusxa.push(n); s.soni++; if (!s.sanoqYoq) klonSanoq(ek); chal('bos')
  if (n.g) setTimeout(() => n.g && n.g.classList.remove('yangi'), 400)
  const d = (s.nusxaD ? s.nusxaD() : blDasturchalar(ek)).filter((x) => x.tur === 'when_clone') // 17-dars: s.nusxaD — o'q personajining dasturchalari (kosmik.js)
  n.boshladi = d.some((x) => x.bloklar.length)
  n.tugadi = Promise.all(d.map((x) => ijro(turla(x.daraxt), (t) => klonBlok(ek, n, t), { kut: s.kut || 620 }))).then(() => { if (!n.ochdi) n.yerda = true; if (s.kosmik && typeof kosmikNusxaTugadi === 'function') kosmikNusxaTugadi(ek, n) }) // o'chmagan nusxa — o'z joyida qoladi
  s.ishlar.push(n.tugadi)
}
function klonOchir(ek, n) {
  n.ochdi = true; const g = n.g; n.g = null
  if (g) { if (g.animate) { g.animate([{ opacity: 1, transform: g.style.transform }, { opacity: 0, transform: g.style.transform + ' scale(.6)' }], { duration: 260 }); setTimeout(() => g.remove(), 250) } else g.remove() }
}
// 1–2-bekat: «▶ Ishga tushir»
async function klonIshga(ek) {
  if (ek.dataset.yuryapti) return
  maslahatOch(ek); if (typeof blTanlovOl === 'function') blTanlovOl(ek); urildiOl(ek); muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove())
  const id = ek.dataset.id, b = TOP(id).bosh, k = b.klon || {}, g = TOP(id).gap || {}
  const ds = blDasturchalar(ek), st = ds.filter((x) => x.tur === 'when_start')
  if (!ds.length || ds.every((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, KG('bosh')); muammo(ek, 'boshvoy', KG('boshP')); return }
  klonTayyorla(ek)
  const s = ek.__klon; s.ishlar = []
  ek.dataset.yuryapti = '1'; ishora(ek, KG('ishlayapti'))
  for (const x of st) { x.hodisa.classList.add('hozir'); await ijro(turla(x.daraxt), (t) => klonBlok(ek, s.asl, t), { kut: 620 }); x.hodisa.classList.remove('hozir') }
  while (s.ishlar.length) { const r = s.ishlar.splice(0); await Promise.all(r) }
  delete ek.dataset.yuryapti
  klonBaho(ek, k, g)
}
// natija: hamma nusxa to'xtagach — avval ko'ringani (maydon cheti, yerga yetmadi), keyin sanab topilgani (soni, ustun)
function klonBaho(ek, k, g) {
  const s = ek.__klon, nus = s.nusxa, M = (kim, p, i) => { chal('muammo'); ishora(ek, i); muammo(ek, kim, p) }
  if (!nus.length) return M('boshvoy', KG('yoqP'), KG('yoq'))
  if (nus.some((n) => !n.boshladi)) return M('boshvoy', KG('turibP'), KG('turib'))
  const chet = nus.find((n) => n.chet)
  if (chet) return M('kamvoy', KG('chetP'), chet.chet.tur === 'y' ? KG(chet.chet.x < 0 || chet.chet.x > KL_W() ? 'chetX' : 'chetY', chet.chet.x < 0 || chet.chet.x > KL_W() ? chet.chet.x : chet.chet.y) : KG('chet'))
  const osil = nus.find((n) => !n.ochdi && n.y > 0 && k.yer !== false)
  if (osil) return M('kamvoy', KG('yetmadiP'), KG('yetmadi', osil.y).replace('(x, y)', '(' + osil.x + ', ' + osil.y + ')'))
  if (k.soni && nus.length < k.soni) return M('kamvoy', KG('kamP'), KG('soni', k.soni))
  if (k.soni && nus.length > k.soni) return M('ortiqvoy', KG('kopP'), KG('soni', k.soni))
  if (k.joy && nus.some((n) => !k.joy.some(([x, y]) => x === n.x && y === n.y))) { const n = nus.find((q) => !k.joy.some(([x, y]) => x === q.x && y === q.y)); return M('kamvoy', KG('joyP'), KG('joy').replace('(x, y)', '(' + n.x + ', ' + n.y + ')').replace('(a, b)', '(' + k.joy[0].join(', ') + ')')) }
  const r = klonRandom(ek)
  if (k.ustun === 'xil' && !r.bor) return M('kamvoy', KG('birP'), KG('bir'))
  if (Array.isArray(k.ustun)) { const tash = r.bor ? r.qiymat.find((v) => v < k.ustun[0] || v > k.ustun[1]) : nus.map((n) => n.x).find((v) => v < k.ustun[0] || v > k.ustun[1]); if (tash != null) return M('ortiqvoy', KG('ustunP'), KG('ustun', tash)) }
  if (r.bor && r.qiymat.some((v) => v < 0 || v > KL_W())) { const v = r.qiymat.find((q) => q < 0 || q > KL_W()); return M('kamvoy', KG('chetP'), KG('chetX', v)) }
  ishora(ek, g.yetdi ? GAPT(g.yetdi) : KG('tayyor')); konfeti(ek)
  klonHisob(ek)
}
// nusxa dasturchasidagi go to X random qiymatlari (hammasi — 13-darsdagidek sanab chiqiladi)
function klonRandom(ek) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek), r = { bor: false, qiymat: [] }; if (!ws) return r
  ws.getBlocksByType('go_to_r', false).filter((b) => (b.getRootBlock() || {}).type === 'when_clone').forEach((b) => { const x = b.getInputTargetBlock('X'); if (x && x.type === 'random_n') { const a = +x.getFieldValue('A'), c = +x.getFieldValue('B'); if (a !== c) r.bor = true; for (let v = Math.min(a, c); v <= Math.max(a, c); v++) r.qiymat.push(v) } })
  return r
}
// natija: 'N' — yasalgan nusxalar (hammasi), 'W' — yutilgan o'yin; pog'ona
function klonHisob(ek, yutdi) {
  if (!klonBola(ek) || ek.dataset.oqish) return
  const b = TOP(ek.dataset.id).bosh, s = ek.__klon || { nusxa: [] }, bl = (tur, n) => Array.from({ length: n }, () => ({ dataset: { tur } }))
  oxirgiSaqla(ek)
  if (typeof blokQosh === 'function') blokQosh(ek.dataset.id, [...bl('N', s.nusxa.length), ...bl('W', yutdi ? 1 : 0)])
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  otKeyin(ek)
}

// ---- 3-bekat: o'yin — dushman dasturi va qahramon BIR VAQTDA; nusxa qahramonga tushsa — jon −1 ----
async function klonOyinBoshla(ek) {
  const id = ek.dataset.id, b = TOP(id).bosh, k = b.klon || {}
  muammoOl(ek); urildiOl(ek); ek.querySelectorAll('.konfeti,.dv-pufak,.oyin-tugadi').forEach((x) => x.remove())
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  const ds = blDasturchalar(ek)
  if (!ds.length || ds.every((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, KG('bosh')); muammo(ek, 'boshvoy', KG('boshP')); return }
  klonTayyorla(ek)
  const s = ek.__klon; s.ishlar = []; s.oyin = true; s.kut = k.kut || 560
  const h = await SAHNA.katak.boshla(ek, b); s.h = h; s.jon = k.jon || 3; klonJon(ek)
  const o = { h, klon: true, bosish: 0 }
  OYIN.set(ek, o); ek.dataset.oyin = 'klon'
  const tb = oyinTugma(ek); if (tb) tb.textContent = '■ To‘xtatish'
  ishora(ek, KG('oyinIshora'))
  maslahatOch(ek)
  const st = ds.filter((x) => x.tur === 'when_start')
  for (const x of st) { x.hodisa.classList.add('hozir'); await ijro(turla(x.daraxt), (t) => klonBlok(ek, s.asl, t), { kut: s.kut }); x.hodisa.classList.remove('hozir'); if (OYIN.get(ek) !== o) return }
  while (s.ishlar.length) { const r = s.ishlar.splice(0); await Promise.all(r) }
  if (OYIN.get(ek) !== o) return
  klonOyinTugadi(ek, o)
}
function klonJon(ek) { const s = ek.__klon; if (typeof ballKor === 'function') ballKor(ek, s.jon, null, null, 'jon') }
// nusxa qahramon katagiga tushdi (yoki qahramon nusxaga yurdi)
function klonTegdimi(ek, n) {
  const s = ek.__klon, h = s && s.h; if (!h || n.ochdi || !ek.dataset.oyin) return false
  if (n.x !== h.x || n.y !== mdY(h.xr, h.y)) return false
  s.jon--; klonJon(ek); chal('tuk'); klonOchir(ek, n)
  if (ballKor && h.q) ballKor(ek, s.jon, '−1', h.q, 'jon')
  if (s.jon <= 0) { klonOyinToxtat(ek); ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-tugadi">O‘yin tugadi</span>'); ishora(ek, KG('jonTugadi')) }
  return true
}
async function klonOyinBos(ek, k, o) {
  const s = ek.__klon, h = o.h; if (!s || !h || (k !== 'right' && k !== 'left')) return
  const nx = h.x + (k === 'right' ? 1 : -1), y = mdY(h.xr, h.y)
  if (nx < 0 || nx > KL_W()) { chal('tuk'); return }
  // yerda qolgan nusxa — devor (qahramon o'ta olmaydi)
  if (s.nusxa.some((n) => !n.ochdi && n.x === nx && n.y === y && n.yerda)) { chal('tuk'); if (!s.qamaldi) { s.qamaldi = true; chal('muammo'); muammo(ek, 'kamvoy', KG('yerdaP')); ishora(ek, KG('yerda')) } return }
  o.bosish++
  await SAHNA.katak.bajar(h, { tur: k === 'right' ? 'r' : 'l', el: document.createElement('span') }); h.urildi = null
  for (const n of s.nusxa) if (!n.ochdi && klonTegdimi(ek, n)) break
}
// hamma nusxa to'xtadi: yerda qolgani bo'lsa — Kamvoy; jon qolgan bo'lsa — yutdi
function klonOyinTugadi(ek, o) {
  const s = ek.__klon, b = TOP(ek.dataset.id).bosh, k = b.klon || {}
  const qoldi = s.nusxa.filter((n) => !n.ochdi)
  qoldi.forEach((n) => { n.yerda = true })
  if (!s.nusxa.length) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('yoq')); muammo(ek, 'boshvoy', KG('yoqP')); return }
  if (qoldi.length) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('yerda')); muammo(ek, 'kamvoy', KG('yerdaP')); return }
  if (k.soni && s.nusxa.length < k.soni) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('soni', k.soni)); muammo(ek, 'kamvoy', KG('kamP')); return }
  if (k.kamida && s.nusxa.length < k.kamida) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('kamida', k.kamida)); muammo(ek, 'kamvoy', KG('kamP')); return }
  if (k.soni && s.nusxa.length > k.soni) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('soni', k.soni)); muammo(ek, 'ortiqvoy', KG('kopP')); return }
  const r = klonRandom(ek)
  if (Array.isArray(k.ustun) && r.qiymat.some((v) => v < k.ustun[0] || v > k.ustun[1])) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('ustun', r.qiymat.find((v) => v < k.ustun[0] || v > k.ustun[1]))); muammo(ek, 'ortiqvoy', KG('ustunP')); return }
  if (k.random && !r.bor) { klonOyinToxtat(ek); chal('muammo'); ishora(ek, KG('bir')); muammo(ek, 'kamvoy', KG('birP')); return }
  klonOyinToxtat(ek); ishora(ek, KG('yutdi')); konfeti(ek)
  klonHisob(ek, true)
}
function klonOyinToxtat(ek) { const s = ek.__klon; if (s) { s.toxtat = true; s.nusxa.forEach((n) => { if (!n.ochdi) n.toxtat = true }) } oyinToxtat(ek) }

// ---- huk (2–4): karta o'z dasturi bilan (data-klon — JSON: { asl: [bloklar], nusxa: [bloklar], kop: N — B: shuncha dushman, har biri o'z dasturi bilan }) ----
// bloklar: 'C' — nusxa, 'd' — pastga, ['x', X, Y] (X 'r' — tasodifiy 0…6), ['p', n, [...]] — takrorla
async function klonHuk(ek, k) {
  const d = JSON.parse(k.dataset.klon || '{}'), m = klonMaydon(ek); if (!m) return 'kam'
  klonOl(ek); const asl = d.asl0 || [3, KL_H()]
  const s = ek.__klon = { asl: { x: asl[0], y: asl[1], g: d.kop ? null : klonRasm(ek, asl[0], asl[1], 'kt-asl'), asl: true }, nusxa: [], soni: 0, ishlar: [], eng: 0 }
  const jon = () => { s.eng = Math.max(s.eng, s.nusxa.filter((n) => !n.ochdi).length + (d.ozi ? 1 : 0)) }
  const yur = async (n, bl) => {
    for (const t of bl) {
      if (n.ochdi) return
      if (Array.isArray(t) && t[0] === 'p') { for (let i = 0; i < t[1]; i++) await yur(n, t[2]); continue }
      if (t === 'C') { const q = { x: s.asl.x, y: s.asl.y, g: klonRasm(ek, s.asl.x, s.asl.y, 'kt-klon yangi') }; s.nusxa.push(q); chal('bos'); jon(); s.ishlar.push(yur(q, d.nusxa || [])); await KUT(560); continue }
      if (t === 'D') { klonOchir(ek, n); continue }
      if (t === 'd') { n.y--; katakSur(n.g, n.x, m.H - 1 - n.y, false); chal('qadam'); jon() }
      if (Array.isArray(t) && t[0] === 'x') { n.x = t[1] === 'r' ? tasodif(ek, 0, KL_W()) : t[1]; n.y = t[2]; if (!n.g) n.g = klonRasm(ek, n.x, n.y, 'kt-klon'); katakSur(n.g, n.x, m.H - 1 - n.y, true) }
      await KUT(520)
    }
  }
  if (d.kop) { const x0 = d.kopX || [0, 2, 3, 4, 6]; const bir = x0.map((x) => ({ x, y: KL_H(), g: klonRasm(ek, x, KL_H(), 'kt-klon') })); s.nusxa.push(...bir); jon(); await Promise.all(bir.map((n) => yur(n, d.nusxa || []))) }
  else { d.ozi = !d.nusxa; await yur(s.asl, d.asl || []); while (s.ishlar.length) await Promise.all(s.ishlar.splice(0)) }
  return 'yetdi'
}
// huk kartasi (hukSina dan): karta kattalashadi, dastur o'ynaladi, natija kartada (hukAvto kabi); data-ok — natija ✓ yoki ✕
async function klonHukSina(ek, k, i) {
  if (ek.dataset.yuryapti) return
  const g = TOP(ek.dataset.id).gap || {}
  ek.dataset.yuryapti = '1'
  ek.querySelectorAll('.jk').forEach((x) => x.classList.toggle('sinov', x === k)); ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  k.classList.remove('n-ok', 'n-yoq'); k.querySelectorAll('.jn').forEach((x) => x.remove())
  await klonHuk(ek, k)
  delete ek.dataset.yuryapti
  const ok = k.dataset.ok === '1'
  k.classList.remove('sinov'); k.classList.add(ok ? 'n-ok' : 'n-yoq')
  ;(k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<small class="jn">' + k.dataset.nat + '</small>')
  if (ok) konfeti(ek)
  ek.dataset.huk = Math.max(+(ek.dataset.huk || 0), i + 1)
  const a = ek.querySelector('.hn .asos'); if (a && g.keyingi) a.textContent = g.keyingi
}

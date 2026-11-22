// ===== 15-dars (21.11, manba 015): xakaton — juftlik, o'yin va qism tanlash, qismlar navbat bilan, sinash ro'yxati, «Do‘stlar o‘ynaydi» =====
// studiya.js dan keyin qo'shiladi (yigish.mjs skript): uning yordamchilaridan foydalanadi (TOP, OYIN, ishora, muammo, konfeti, ball*, lab*, yasash*).
// Qismlar va shartlar — DARS.xakaton (dars.mjs): { olma | lab: { nom, qism: [{ id, nom, karta, hajm, maslahat, oila, tayyor, sina, yasash, yulduz, ozi }] } }.
// Studiya ekrani — bosh.xk ('olma' | 'lab') va bosh.bosqich: 'yasash' (2-bekat: hozirgi qism, rollar, «Almashdik»), 'sinash' (3-bekat: sinash bandlari),
// 'dost' (do'stlar o'ynaydi: dastur va ro'yxat yopiq, keyin «Sizga yoqdi:»), 'namoyish' (13-qadam, ustoz: holat saqlanmaydi).
// Holat bitta — o'yin noutbukida localStorage K+'xk': { oyin, qism: [id…], tanladi, tayyor: {id: 1}, kim: {id: haydovchi}, haydovchi, juft, sina: {kalit: 1},
// iz: { tomon: […], ball0: n }, dastur (Blockly), dost: [{ yutdi, teg, yoq, belgi }] }. «Qism tayyor» = statik shart (xkStatik) + o'yin bir marta buzilmay
// o'ynaldi (muammochasiz tugadi; devorga urilish va game over — buzilish emas). Ikkinchi noutbuk va ustoz orqali natija — qobiq.js (juftlik).
// darsning gaplari — DARS.xakaton.gap (N — son yoki nom); dvigatelda xakaton matni yozilmaydi
const XG = (k, n) => { const g = ((typeof DARS !== 'undefined' && DARS.xakaton) || {}).gap || {}; const t = g[k] != null ? g[k] : ''; return n != null && typeof t === 'string' ? t.replace(/\bN\b/, n) : t }
// sahna ustidagi yozuv («Qism tayyor!», «O‘yiningiz sinaldi!») — 2,6 soniya (bosishni to'smaydi)
function xkBanner(ek, t) { const o = ek.querySelector('.oyna'); if (!o) return; o.querySelectorAll('.xk-bn').forEach((x) => x.remove()); if (!t) return; o.insertAdjacentHTML('beforeend', '<span class="gl xk-bn">' + t + '</span>'); const bn = o.querySelector('.xk-bn'); setTimeout(() => bn.remove(), 2600) }
const xkKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'xk'
function xkOl() { try { return JSON.parse(localStorage.getItem(xkKalit()) || 'null') || {} } catch (e) { return {} } }
function xkYoz(s) { try { localStorage.setItem(xkKalit(), JSON.stringify(s)) } catch (e) {} }
const xkBola = (ek) => { const r = ek && ek.parentNode && ek.parentNode.closest('#ust,#bol'); return !!r && r.id === 'bol' }
const xkSolo = () => typeof SOLO !== 'undefined' && SOLO
const xkO = (s) => DARS.xakaton[s.oyin === 'lab' ? 'lab' : 'olma']
const xkQ = (s, id) => xkO(s).qism.find((q) => q.id === id)
const xkBirinchi = (s) => xkO(s).qism.find((q) => q.birinchi)
const xkYulduzQ = (s) => xkO(s).qism.find((q) => q.yulduz)
// ekran holati: bola — saqlangan (o'yin noutbukida); ustoz namoyishi — ekranniki (qismlar tayyor, saqlanmaydi)
function xkS(ek) {
  if (ek.__xk) return ek.__xk
  const b = TOP(ek.dataset.id).bosh
  if (!xkBola(ek)) { const q = b.namoyish || []; ek.__xk = { oyin: b.xk, qism: q, tayyor: Object.fromEntries(q.map((x) => [x, 1])), kim: {}, sina: {}, iz: {}, haydovchi: 1, dost: [] }; return ek.__xk }
  const s = xkOl()
  if (!s.oyin) s.oyin = b.xk
  if (s.oyin !== b.xk) { s.oyin = b.xk; s.qism = null } // solo: boshqa o'yin ekrani ochildi
  if (!s.qism || !s.qism.length) s.qism = [xkBirinchi(s).id]
  s.tayyor = s.tayyor || {}; s.kim = s.kim || {}; s.sina = s.sina || {}; s.iz = s.iz || {}; s.dost = s.dost || []; s.haydovchi = s.haydovchi || 1
  ek.__xk = s; return s
}
const xkSaqla = (ek) => { if (xkBola(ek)) xkYoz(ek.__xk) }
const xkTayyorSoni = (s) => s.qism.filter((id) => s.tayyor[id] && !xkQ(s, id).yulduz).length
// hozirgi qism — ro'yxatdagi birinchi tayyor bo'lmagani (2-bekat)
const xkHozir = (s) => { const id = s.qism.find((x) => !s.tayyor[x]); return id ? xkQ(s, id) : null }
// ★ — uch qism tayyor bo'lsa va bog'liq qismi bor bo'lsa (Olma terish — «Ball», Labirint — «2-daraja»)
const xkYulduzBor = (s) => { const y = xkYulduzQ(s); return y && s.qism.indexOf(y.id) < 0 && xkTayyorSoni(s) >= 3 && (!y.ozi || s.tayyor[y.ozi]) ? y : null }
const xkBosqich = (ek) => TOP(ek.dataset.id).bosh.bosqich

// ---- bosh bayroqlari (studiya.js tekshiruvlari shu bayroqlar bilan ishlaydi; har qism almashganda yangilanadi) ----
function xkBosh(ek) {
  const t = TOP(ek.dataset.id), b = t.bosh, s = xkS(ek), bq = xkBosqich(ek)
  const p = bq === 'yasash' ? xkHozir(s) : null, bor = (id) => !!s.tayyor[id] || (p && p.id === id)
  b.saqla = true // o'zgaruvchilar o'yindan o'yinga saqlanadi — «O‘yin noldan boshlansin» (set) bola ishi
  if (b.xk === 'olma') {
    b.qoida = ['jon', 'qadam'].filter((n) => bor(n))
  } else {
    b.qoida = bor('qoida'); b.qoidaIshora = !!(p && p.id === 'qoida'); b.tovushIf = bor('tovush'); b.startga = bor('start')
    b.yasash = !!(p && p.yasash); b.kerak = p && p.yasash ? p.yasash : null
    b.olchov = p && p.yasash ? (p.id === 'kalit' ? ['kalit', 'eshik'] : p.id === 'uzun' ? ['yol'] : ['devor', 'yol']) : null
    b.darajalar = s.tayyor.daraja2 && !b.yasash ? ['D1', 'L2'] : null
  }
  t.maslahat = p ? p.maslahat : null
}
// 2-daraja — bu darsning o'z kaliti (10-darsdagi «jr-labirint-daraja2» ga yozilmaydi)
const xkD2Kalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'd2'

// ---- studiya tayyorlash (oyinTayyorla dan) ----
function xkTayyorla(ek, qayta) {
  const t = TOP(ek.dataset.id), b = t.bosh, s = xkS(ek), bq = xkBosqich(ek)
  oyinToxtat(ek); muammoOl(ek)
  xkBosh(ek)
  ek.classList.toggle('xk-dost', bq === 'dost'); ek.classList.toggle('xk-sinash', bq === 'sinash')
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek)
  if (!qayta && ws && s.dastur && bq !== 'namoyish') { ws.clear(); Blockly.serialization.workspaces.load(s.dastur, ws); ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); if (typeof blTartibKeyin === 'function') blTartibKeyin(ws); sanoq(ek) }
  // maydon
  if (b.xk === 'olma') {
    const y = xkYulduzQ(s), m = DARS.xakaton.olma.maydon, oltin = !!(y && s.qism.indexOf(y.id) >= 0)
    if (m && (oltin || ek.__xkOltin)) { xkMaydonQoy(ek, oltin ? { ...m, oltin: [DARS.xakaton.olma.oltin] } : m); ek.__xkOltin = oltin }
    ballTayyorla(ek)
  } else {
    if (b.yasash) { mdQayta(ek, xkD2() || DARS.labirintlar.BOSH); darajaYoz(ek, 1, 2); ek.dataset.asb = 'devor'; olchovYoz(ek); yasashMuammo(ek, false) }
    else { mdQayta(ek, DARS.labirintlar.D1); ek.querySelectorAll('.olchov').forEach((x) => x.remove()); if (b.darajalar) darajaYoz(ek, 0, 2); else ek.querySelectorAll('.daraja-yz').forEach((x) => x.remove()) }
    katakAsl(ek); labJoyKuzat(ek)
    // yasash qismida javon — «Labirint» asboblari (rg dagi tugma), boshqasida — bloklar
    const rd = ek.querySelector('.rg .rd.f-L'); if (rd) { rd.hidden = !b.yasash; if (b.yasash && !rd.classList.contains('on')) rd.click(); if (!b.yasash && rd.classList.contains('on')) { const e = ek.querySelector('.rg .rd.f-e'); if (e) e.click() } }
  }
  const tb = oyinTugma(ek); if (tb) { tb.innerHTML = bq === 'dost' ? XG('dostTugma') : b.yasash ? '▶ Sinab ko‘rish' : '▶ Boshlash'; tb.dataset.asl = tb.innerHTML }
  const m = ek.querySelector('.hn .mas:not(.ishga)'); if (m) m.hidden = bq !== 'yasash' || !t.maslahat
  xkKarta(ek); xkRoyChiz(ek)
  if (bq === 'yasash' && qayta && DARS.maslahatKeyin && xkBola(ek) && t.maslahat) xkQulf(ek)
  if (bq === 'dost') xkDostKor(ek)
  const g = t.gap || {}
  if (bq === 'yasash') ishora(ek, xkHozir(s) ? XG('karta') : XG('tayyor'))
  else if (bq === 'sinash') ishora(ek, XG('sinang'))
  else if (bq === 'dost') ishora(ek, xkSolo() ? XG('soloDost') : '')
  else if (g.boshla && GAPT(g.boshla)) ishora(ek, GAPT(g.boshla))
}
// «Olma terish» maydonini to'liq qayta chizish (★ — oltin olma bilan); qahramon elementi o'z joyida qoladi (mdQayta kabi — u faqat labirint belgilarini o'qiydi)
function xkMaydonQoy(ek, m) {
  const k = ek.querySelector('.oyna .katak.maydon'); if (!k) return
  const q = k.querySelector('.kt-q'), t = document.createElement('div')
  t.innerHTML = maydonHtml(m, {}); const yk = t.firstElementChild, yq = yk.querySelector('.kt-q')
  if (q && yq) { q.querySelectorAll('.kt-qk').forEach((x) => x.remove()); const yk2 = yq.querySelector('.kt-qk'); if (yk2) q.appendChild(yk2); yq.replaceWith(q) }
  k.replaceWith(yk)
}
function xkD2() { try { return localStorage.getItem(xkD2Kalit()) || '' } catch (e) { return '' } }
// «Maslahat» qulfi — har qismda yangidan (studiyaTayyorla dagi qulf bilan bir xil)
function xkQulf(ek) { const m = ek.querySelector('.hn .mas:not(.ishga)'); if (!m || m.classList.contains('qulf')) return; ek.dataset.maslahatQulf = '1'; m.classList.add('qulf'); m.insertAdjacentHTML('beforeend', '<svg class="mas-qulf" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7.5" rx="1.6" fill="currentColor"/><path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.6 0V7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>') }
// qism kartasi (sarlavha): «Xakaton · N-qism» — nomi — kartadagi gap va hajm belgisi; doim ochiq
function xkKarta(ek) {
  const s = xkS(ek), bq = xkBosqich(ek), u = ek.querySelector('.ust'); if (!u || bq !== 'yasash') return
  const p = xkHozir(s), tag = u.querySelector('.tag'), sar = u.querySelector('.sar')
  let iz = u.querySelector('.iz'); if (!iz) { u.insertAdjacentHTML('beforeend', '<span class="iz"></span>'); iz = u.querySelector('.iz') }
  if (!p) { tag.textContent = XG('tag'); sar.innerHTML = XG('tayyorSar'); iz.innerHTML = ''; return }
  const n = s.qism.indexOf(p.id) + 1
  tag.textContent = p.yulduz ? XG('yulduzTag') : XG('qismTag', n)
  sar.textContent = p.nom
  iz.innerHTML = p.karta + ' <b class="xk-hj f-' + p.oila + '">' + p.hajm + '</b>'
}
// «O‘yiningizda:» — tanlangan qismlar; yasashda hozirgisi yonida rul va xarita; sinashda tayyor qism ostida sinash bandi
const XK_RUL = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="12" cy="12" r="2.4" fill="currentColor"/><path d="M12 14.4v6M9.8 11.2 3.8 9.6M14.2 11.2l6-1.6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
const XK_XARITA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.2 8.6 4l6.8 2.4L21 4.2v13.6l-5.6 2.2-6.8-2.4L3 19.8z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M8.6 4v13.6M15.4 6.4V20" stroke="currentColor" stroke-width="2"/></svg>'
function xkRollar(s) {
  const r = '<span class="xk-rl k-rul">' + XK_RUL + XG('haydovchi') + '</span>', x = '<span class="xk-rl k-xar">' + XK_XARITA + XG('xaritachi') + '</span>'
  return '<span class="xk-rr' + ((s.haydovchi || 1) % 2 ? '' : ' alm') + '">' + r + x + '</span>'
}
function xkRoyChiz(ek) {
  const s = xkS(ek), bq = xkBosqich(ek), q = ek.querySelector('.xk-roy .xk-rq'); if (!q) return
  const p = bq === 'yasash' ? xkHozir(s) : null, jonli = !xkSolo() && xkBola(ek)
  let h = ''
  for (const id of s.qism) {
    const x = xkQ(s, id), ok = !!s.tayyor[id], hz = p && p.id === id
    const cls = ok ? 'ok' : hz ? 'hozir' : bq === 'yasash' ? 'kut' : 'tug'
    h += '<i class="xk-r ' + cls + '"><span class="xk-b">' + (ok ? '✓' : x.yulduz ? '★' : s.qism.indexOf(id) + 1) + '</span>' + x.nom + (cls === 'tug' ? ' <small>' + XG('tugamagan') + '</small>' : '') + '</i>'
    if (hz && jonli) h += xkRollar(s)
    if ((bq === 'sinash' || bq === 'namoyish') && ok && x.sina) h += '<i class="xk-r sn' + (s.sina[x.sina[0]] ? ' ok' : '') + '"><span class="xk-b">' + (s.sina[x.sina[0]] ? '✓' : '') + '</span>' + x.sina[1] + '</i>'
  }
  if (bq === 'sinash' || bq === 'namoyish') { const [k, t] = DARS.xakaton.yutdi; h += '<i class="xk-r sn' + (s.sina[k] ? ' ok' : '') + '"><span class="xk-b">' + (s.sina[k] ? '✓' : '') + '</span>' + t + '</i>' }
  if (bq === 'sinash' || bq === 'dost') h += '<i class="xk-r' + (s.dost.length ? ' ok' : '') + '"><span class="xk-b">' + (s.dost.length ? '✓' : '') + '</span>' + XG('dostlar') + '</i>'
  q.innerHTML = h
}
// sinash ro'yxati to'liqmi: har tayyor qismning bandi va «O‘yin yutildi»
const xkSinaldi = (s) => s.qism.filter((id) => s.tayyor[id] && xkQ(s, id).sina).every((id) => s.sina[xkQ(s, id).sina[0]]) && !!s.sina[DARS.xakaton.yutdi[0]]

// ---- statik shart («Qism tayyor»: bloklar o'z hodisasida) ----
const xkKos = (el) => blokQiymat(el, 'KOS')
function xkStatik(ek, s, p, o) {
  const ds = blDasturchalar(ek), tr = p.tayyor || {}
  const bloklar = (f) => ds.filter(f).flatMap((x) => x.bloklar)
  if (tr.tort) return ['right', 'left', 'up', 'down'].every((k) => ds.some((x) => x.tur === 'when_key' && x.tugma === k && x.bloklar.some((el) => ['r', 'l', 'u', 'd'].indexOf(blokTuri(el)) >= 0)))
  if (tr.set && !bloklar((x) => x.tur === 'when_start').some((el) => blokTuri(el) === 'z' && ozgNom(el) === tr.set)) return false
  if (tr.set === 'qadam' && tr.yetsin) { const v = bloklar((x) => x.tur === 'when_start').filter((el) => blokTuri(el) === 'z' && ozgNom(el) === 'qadam').map(blokSon); if (v.length && Math.max(...v) < DARS.xakaton.olma.kamQadam) { ishora(ek, XG('qadamKam')); return false } }
  const hd = tr.hodisa ? bloklar((x) => (tr.hodisa === 'any' ? x.tur === 'when_key' && x.tugma === 'any' : x.tur === 'when_touch' && x.olma === tr.hodisa)) : []
  if (tr.change && !hd.some((el) => blokTuri(el) === 'c' && ozgNom(el) === tr.change)) return false
  if (typeof tr.qoida === 'string' && !qoidaBor(ek, tr.qoida)) return false
  if (tr.kostyum && !hd.some((el) => blokTuri(el) === 'v' && xkKos(el) === tr.kostyum)) return false
  if (tr.tovush && !hd.some((el) => blokTuri(el) === 'n')) return false
  if (tr.oltin && !(o && o.xk && o.xk.oltin === tr.oltin)) return false
  if (tr.qoida === true) { const q = labQoida(ek); if (q.strelka < 4 || q.ochiq.length || q.boshqa.length) return false }
  if (tr.tovushIf && !(o && o.tovushIf)) return false
  if (tr.startga && !(o && o.startga)) return false
  if (p.yasash && !(o && o.xk && o.xk.yutdi && kerakOk(labOlchov(yasashXarita(ek)), p.yasash))) return false
  return true
}

// ---- o'yin seansi: boshlandi / har bosish / tugadi ----
// oyinBoshla, ballBoshla dan keyin: seans belgilari (buzildi — o'yin paytida muammocha chiqdi; devor va game over — buzilish emas)
function xkSeansBosh(ek) { xkBanner(ek, ''); const o = OYIN.get(ek); if (!o || o.xk) return; o.xk = { buz: false, tomon: new Set() }; if (xkBosqich(ek) === 'dost') o.xk.dost = { yoq: 0 } }
function xkMuammo(ek, kim) { const o = ek && ek.dataset.oyin && OYIN.get(ek); if (o && o.xk && kim !== 'tosiqvoy') o.xk.buz = true }
// «Olma terish»: strelka bosildi — o'sha tugmaning dasturchalari (4-dars), o'zgaruvchi bloklari bilan (ballBlok)
async function xkOlmaBos(ek, k, o) {
  const d = blDasturchalar(ek).filter((x) => x.tur === 'when_key' && x.tugma === k)
  if (!d.length) { chal('muammo'); ishora(ek, TUGMA_BELGI[k] + ' tugmasi uchun when ' + TUGMA_BELGI[k] + ' key pressed bloki kerak'); muammo(ek, 'boshvoy', 'Bu tugma uchun dasturcha yo‘q-ku…'); return false }
  if (d.every((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, 'Hodisa blokining ostiga move blokini ulang'); muammo(ek, 'kamvoy', 'Tugma bosildi, lekin men nima qilay?'); return false }
  const x0 = o.h.x, y0 = o.h.y
  for (const x of d) { x.hodisa.classList.add('hozir'); await ijro(turla(x.daraxt), (n) => ballBlok(ek, o.h, n), { kut: 140 }); x.hodisa.classList.remove('hozir'); if (ek.__tugadi || (o.h.urildi && o.h.urildi.kaktus)) break }
  const dx = o.h.x - x0, dy = o.h.y - y0, yon = dx > 0 ? 'right' : dx < 0 ? 'left' : dy < 0 ? 'up' : dy > 0 ? 'down' : '' // h.y — qator (tepadan)
  if (o.xk && yon === k) o.xk.tomon.add(k)
  return true
}
// olma, oltin, kaktus hodisasi: tanlanmagan (hozirgi bo'lmagan) qism muammocha chiqarmaydi; «Quvonch» — kostyum va tovush belgilanadi
function xkTegishYoq(ek, olma) {
  const s = xkS(ek), p = xkBosqich(ek) === 'yasash' ? xkHozir(s) : null
  const kerak = { apple: ['ball', 'quvonch'], cactus: ['jon'], gold: ['oltin'] }[olma] || []
  return !(p && kerak.indexOf(p.id) >= 0)
}
const xkHozirId = (ek) => { const p = xkBosqich(ek) === 'yasash' ? xkHozir(xkS(ek)) : null; return p ? p.id : '' }
function xkTegdi(ek, o, olma, old) {
  if (!o.xk) return
  if (olma === 'gold' && vOl(ek, 'ball') - (old.ball || 0) === 10) o.xk.oltin = 10
  if (olma === 'apple') { const h = o.h; if (h.kos === 'xursand' && (h.tovushlar || []).length > (o.xk.tov0 || 0)) o.xk.quvonch = true; o.xk.tov0 = (h.tovushlar || []).length; if (vOl(ek, 'ball') > (old.ball || 0)) o.xk.ballOsdi = true }
}
// labirint: har bosishdan keyin (labTugmaBos) — sinash belgilari
function xkLabIz(ek, o, iz, k, yoq0) {
  if (!o.xk) return
  const h = o.h
  if ((h.yoqSoni || 0) > yoq0 && !h.urildi) o.xk.yoq = true
  if (h.eshikYoq || (h.urildi && h.urildi.eshik)) o.xk.eshik = true
  if (iz.tovush && iz.yurdi) o.xk.tovYur = true
  if (!iz.tovush && !iz.yurdi && k !== 'space') o.xk.tovJim = true
  if (k === 'space' && iz.go && !iz.go[0] && !iz.go[1]) o.xk.start = true
  if (o.xk.dost && (h.yoqSoni || 0) > yoq0) o.xk.dost.yoq++
  xkJonli(ek, o)
}
// seans tugadi: nat — 'yutdi' | 'tugadi' (game over) | 'urildi' | 'toxta'
function xkSeans(ek, o, nat) {
  if (!o || !o.xk || o.xk.tugadi) return
  o.xk.tugadi = true; if (nat === 'yutdi') o.xk.yutdi = true
  const s = xkS(ek), bq = xkBosqich(ek), b = TOP(ek.dataset.id).bosh
  if (bq === 'dost') return xkSizgaYoqdi(ek, o, nat)
  // sinash belgilari — faqat 3-bekatda (va ustoz namoyishida) yig'iladi: 2-bekatdagi o'yinlar ro'yxatni oldindan to'ldirmaydi
  const sina = bq === 'sinash' || bq === 'namoyish', sn = sina ? s.sina : {}, iz = sina ? s.iz : {}
  if (sina) xkJonliYoz(s, o)
  if (o.ball0 === 0 && o.xk.ballOsdi) { iz.ball0 = (iz.ball0 || 0) + 1; if (iz.ball0 >= 2) sn.ball0 = 1 }
  let gap = ''
  if (nat === 'tugadi') { const n = ek.__ifOzg; if (n && vOl(ek, n) === 0 && !(o.manfiy || {})[n]) sn['nol:' + n] = 1; else if (n && vOl(ek, n) > 0) gap = (xkQ(s, n) || {}).royxat || '' }
  if (nat === 'yutdi') { sn.yutdi = 1; if (b.darajalar && b.darajalar.length > 1) sn.ikki = 1 }
  // 2-bekat: hozirgi qism tayyormi
  if (bq === 'yasash') { const p = xkHozir(s); if (p && (o.bosish || 0) > 0 && !o.xk.buz && xkStatik(ek, s, p, o)) { xkSaqla(ek); return xkQismTayyor(ek, p) } }
  if (bq === 'sinash' || bq === 'namoyish') {
    if (gap && !o.xk.buz) { chal('muammo'); ishora(ek, gap); muammo(ek, 'kamvoy', 'Oz qoldi!') }
    // tugamagan qism o'yinni buzdi (masalan, ichi bo'sh if) — o'sha qism nomi bilan
    const tug = s.qism.map((id) => xkQ(s, id)).find((x) => !s.tayyor[x.id])
    if (o.xk.buz && tug && bq === 'sinash') { ishora(ek, XG('tugQism', tug.nom)); muammo(ek, 'kamvoy', 'Oz qoldi!') }
    xkSinaldiMi(ek)
  }
  xkDasturSaqla(ek); xkSaqla(ek); xkRoyChiz(ek)
}
// o'yin davomidagi sinash belgilari (har bosishdan keyin — ✓ shu zahoti): har strelka o'z tomoniga, quvonch, devor tomonga, kalitsiz eshik, tovush, start
function xkJonliYoz(s, o) {
  const sn = s.sina, iz = s.iz, eski = JSON.stringify(sn)
  iz.tomon = [...new Set([...(iz.tomon || []), ...o.xk.tomon])]; if (iz.tomon.length === 4) sn.tomon = 1
  if (o.xk.quvonch) sn.quvonch = 1
  if (o.xk.yoq) sn.yoq = 1
  if (o.xk.eshik) sn.eshik = 1
  if (o.xk.tovJim) iz.tovJim = 1
  if (o.xk.tovYur && iz.tovJim) sn.tovush = 1
  if (o.xk.start) sn.start = 1
  return JSON.stringify(sn) !== eski
}
function xkJonli(ek, o) {
  const bq = xkBosqich(ek); if (!o || !o.xk || (bq !== 'sinash' && bq !== 'namoyish')) return
  const s = xkS(ek); if (!xkJonliYoz(s, o)) return
  xkSaqla(ek); xkRoyChiz(ek); xkSinaldiMi(ek)
}
// hamma band ✓ — «O‘yiningiz sinaldi!» (bir marta; ustoz doskasida — «Ro‘yxati to‘liq»)
function xkSinaldiMi(ek) {
  const s = xkS(ek); if (xkBosqich(ek) !== 'sinash' || s.sinaldi || !xkSinaldi(s)) return
  s.sinaldi = 1; xkSaqla(ek); konfeti(ek); xkBanner(ek, XG('sinaldi')); ishora(ek, XG('dostKut'))
  if (xkBola(ek) && typeof pogQosh === 'function') pogQosh(7)
  xkBildir(ek)
}
function xkDasturSaqla(ek) { if (!xkBola(ek)) return; const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (ws) ek.__xk.dastur = Blockly.serialization.workspaces.save(ws) }

// ---- qism tayyor → «Almashdik» → keyingi qism ----
function xkQismTayyor(ek, p) {
  const s = xkS(ek)
  s.tayyor[p.id] = 1; s.kim[p.id] = s.haydovchi || 1
  xkDasturSaqla(ek); xkSaqla(ek)
  const n = xkTayyorSoni(s)
  if (xkBola(ek) && typeof pogQosh === 'function') pogQosh(p.yulduz ? 6 : 2 + n)
  if (xkBola(ek) && typeof blokQosh === 'function') blokQosh('xk', xkBelgilar(s))
  xkBildir(ek)
  konfeti(ek); xkBanner(ek, n >= 3 && !p.yulduz ? XG('tayyor') : XG('qismTayyor')); ishora(ek, '')
  xkRoyChiz(ek)
  const keyin = xkHozir(s) || xkYulduzBor(s)
  if (!keyin) { xkKarta(ek); return }
  ek.__xkKut = true
  setTimeout(() => { if (!document.body.contains(ek)) return; if (xkSolo() || !xkBola(ek)) return xkKeyingi(ek); xkAlmashKor(ek) }, 1400)
}
// juftlikda: rul va xarita joy almashadi, «Almashdik» (asosiy tugma; «▶ Boshlash» ikkinchi darajaga)
function xkAlmashKor(ek) {
  const s = xkS(ek), fo = ek.querySelector('.hn'); if (!fo || fo.querySelector('.xk-alm')) return
  s.haydovchi = (s.haydovchi || 1) % (s.juft || 2) + 1; xkSaqla(ek)
  const rr = ek.querySelector('.xk-rr'); if (rr) rr.classList.toggle('alm')
  ishora(ek, (s.juft || 2) > 2 ? XG('almash3') : XG('almash'))
  const a = oyinTugma(ek); if (a) a.hidden = true
  fo.insertAdjacentHTML('beforeend', '<span class="asos xk-alm">' + XG('almashdik') + '</span>')
}
function xkKeyingi(ek) {
  const s = xkS(ek)
  ek.querySelectorAll('.hn .xk-alm').forEach((x) => x.remove()); const a = oyinTugma(ek); if (a) a.hidden = false
  const y = !xkHozir(s) && xkYulduzBor(s); if (y) s.qism.push(y.id)
  delete ek.__xkKut; xkSaqla(ek)
  xkTayyorla(ek, true)
  if (y) ishora(ek, XG('vaqt'))
}
// natija belgilari (DARS.natija: W — o'yin yasaldi (1-qism tayyor), Q — tayyor qismlar, D — do'stlar o'ynagan marta)
function xkBelgilar(s) { const b = (tur, n) => Array.from({ length: n }, () => ({ dataset: { tur } })); return [...b('W', s.tayyor[xkBirinchi(s).id] ? 1 : 0), ...b('Q', s.qism.filter((id) => s.tayyor[id]).length), ...b('D', s.dost.length)] }
// ustozga juftlik xulosasi (ikkinchi noutbukka uzatiladi — qobiq.js): qismlar, ikkalasi ham haydadimi, do'stlar
function xkXulosa(s) { const kim = new Set(Object.values(s.kim || {})); return { oyin: s.oyin, q: s.qism.filter((id) => s.tayyor[id]).length, ikki: kim.size >= 2, d: (s.dost || []).length, w: !!(s.tayyor || {})[xkBirinchi(s).id], royxat: s.qism.map((id) => [xkQ(s, id).nom, !!s.tayyor[id]]) } }
function xkBildir(ek) { if (xkBola(ek)) bildirB(ek, { t: 'xk', x: xkXulosa(xkS(ek)) }) }

// ---- bosishlar (studiyaBosish dan; true — shu yerda ishlandi) ----
function xkBosish(e, ek) {
  if (e.target.closest('.hn .xk-alm')) { chal('bos'); xkKeyingi(ek); return true }
  if (ek.__xkKut && e.target.closest('.hn .ishga, .hn .asos')) return true // «Qism tayyor!» dan keyingi 1,4 soniya
  if (e.target.closest('.xk-yq')) return xkYoqdiBos(e, ek)
  return null
}

// ---- 15-qadam: do'stlar o'ynaydi — o'yin tugagach «Sizga yoqdi:» (kamida bitta karta), natija egasining noutbukida ----
const XK_YOQDI = () => XG('yoqdiK') || []
const XK_YQ_RASM = {
  qiziq: '<svg viewBox="-1.2 -1.2 2.4 2.4" aria-hidden="true"><circle r="1.1" fill="#FFE9A8"/><path d="' + (typeof KT_YULDUZ !== 'undefined' ? KT_YULDUZ : '') + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".06"/></svg>',
  chiroyli: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3.6" fill="#FF8FB1"/><circle cx="7.4" cy="10.6" r="3.6" fill="#FF8FB1"/><circle cx="16.6" cy="10.6" r="3.6" fill="#FF8FB1"/><circle cx="9" cy="15.4" r="3.6" fill="#FF8FB1"/><circle cx="15" cy="15.4" r="3.6" fill="#FF8FB1"/><circle cx="12" cy="11.8" r="3" fill="#F5B82E"/></svg>',
  yana: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.6l7 4.4-7 4.4z" fill="#2F8FF0"/><path d="M19.4 12a7.4 7.4 0 0 1-12.8 5M4.6 12a7.4 7.4 0 0 1 12.8-5" fill="none" stroke="#2F8FF0" stroke-width="2.2" stroke-linecap="round"/></svg>',
}
function xkSizgaYoqdi(ek, o, nat) {
  const ob = ek.querySelector('.oyna'); if (!ob) return
  ek.__xkDost = { yutdi: nat === 'yutdi', teg: o.teg || 0, yoq: (o.xk.dost || {}).yoq || 0, bosish: o.bosish || 0 }
  const qah = ek.querySelector('.oyna .kt-q svg, .oyna .aktyor svg'), quv = qah ? qah.outerHTML : ''
  ob.insertAdjacentHTML('beforeend', '<div class="xk-yq-f"></div><div class="gl xk-yq"><b class="xk-yq-s">' + XG('yoqdi') + '</b><div class="xk-yq-k">' + XK_YOQDI().map(([k, t]) => '<span class="xk-yk" data-k="' + k + '" role="button"><i>' + (k === 'quvnoq' ? quv : XK_YQ_RASM[k]) + '</i><b>' + t + '</b></span>').join('') + '</div><span class="xk-yq-t off" role="button">' + XG('tayyorT') + '</span></div>')
  ishora(ek, '')
}
function xkYoqdiBos(e, ek) {
  const k = e.target.closest('.xk-yk'), box = ek.querySelector('.xk-yq')
  if (k) { k.classList.toggle('on'); chal('bos'); box.querySelector('.xk-yq-t').classList.toggle('off', !box.querySelector('.xk-yk.on')); return true }
  if (!e.target.closest('.xk-yq-t') || !box.querySelector('.xk-yk.on')) return true
  const s = xkS(ek), d = ek.__xkDost || {}
  d.belgi = [...box.querySelectorAll('.xk-yk.on')].map((x) => x.dataset.k)
  s.dost.push(d); delete ek.__xkDost; xkSaqla(ek)
  box.remove(); ek.querySelectorAll('.xk-yq-f').forEach((x) => x.remove())
  if (xkBola(ek) && typeof blokQosh === 'function') blokQosh('xk', xkBelgilar(s))
  if (xkBola(ek) && typeof pogQosh === 'function') pogQosh(8)
  xkBildir(ek); chal('yulduz'); xkDostKor(ek); xkRoyChiz(ek)
  return true
}
// egasi ko'radigan natija: «Do‘stlaringiz o‘ynadi: yutdi · 2 marta kaktusga tegdi · Yoqdi: Qiziq, Chiroyli» (bir necha marta — jamlanadi)
function xkDostMatn(s) {
  const d = s.dost || []; if (!d.length) return ''
  const yut = d.filter((x) => x.yutdi).length, lab = s.oyin === 'lab', teg = d.reduce((a, x) => a + (lab ? x.yoq : x.teg), 0)
  const belgi = [...new Set(d.flatMap((x) => x.belgi || []))].map((k) => (XK_YOQDI().find((y) => y[0] === k) || [, k])[1])
  const t = XG(lab ? 'devor' : 'teg', teg), q = ' · ' + t + ' · ' + XG('belgi') + belgi.join(', ')
  if (d.length === 1) return XG('dost1') + (yut ? XG('yutdi') : XG('yetmadi')) + q
  return XG('dostN', d.length) + (yut ? XG('yutdiN', yut) : XG('yetmadi')) + q
}
function xkDostKor(ek) {
  const s = xkS(ek), m = xkDostMatn(s), ob = ek.querySelector('.oyna'); if (!ob) return
  ob.querySelectorAll('.xk-dn').forEach((x) => x.remove())
  if (m) ob.insertAdjacentHTML('beforeend', '<div class="gl xk-dn">' + (xkSolo() ? '' : '<small>' + XG('joy') + '</small>') + '<b>' + m + '</b></div>') // solo'da stol yo'q — «Joyingizga qayting» chiqmaydi
}

// ---- 8-qadam: juftlik tanlovi; ikkinchi noutbuk — do'stining qahramoni (qobiq.js juftlik) ----
function juftlikTayyorla(ek) { ek.querySelectorAll('.jf-o').forEach((x) => x.classList.remove('on')) }
function juftlikBosish(e, ek) {
  const c = e.target.closest('.jf-o'); if (!c) return false
  ek.querySelectorAll('.jf-o').forEach((x) => x.classList.toggle('on', x === c)); chal('bos')
  if (typeof juftTanla === 'function') juftTanla(c.dataset.j)
  return true
}
// 9-qadam: o'yin → qismlar → «Tanladik» → «Tayyormiz»
function xkTanlovTayyorla(ek) {
  const s = xkOl()
  ek.__tan = { oyin: s.tanladi ? s.oyin : '', tan: s.tanladi ? s.qism.slice(1) : [], bosqich: s.tanladi ? 2 : 0 }
  xkTanlovChiz(ek)
}
function xkTanlovChiz(ek) {
  const t = ek.__tan, xt = ek.querySelector('.xk-t'), a = ek.querySelector('.hn .asos'), pr = ek.querySelector('.xk-pr')
  if (xt && !xt.__kartalar) xt.__kartalar = xt.innerHTML
  if (pr) { pr.classList.toggle('on', !!t.oyin); pr.querySelectorAll('[data-o]').forEach((x) => { x.hidden = x.dataset.o !== t.oyin }) }
  if (!t.oyin) { if (xt) xt.innerHTML = xt.__kartalar; if (a) a.classList.add('off'); ishora(ek, XG('tanlaO')); return }
  const o = DARS.xakaton[t.oyin], sar = ek.querySelector('.chap .sar'); if (sar) sar.textContent = o.nom
  const ql = xt
  if (ql) {
    const yop = (q) => q.ozi && t.tan.indexOf(q.ozi) < 0
    ql.innerHTML = '<div class="xk-ql">' + o.qism.map((q) => {
      const tan = q.birinchi || t.tan.indexOf(q.id) >= 0, cls = q.birinchi ? 'qot' : q.yulduz ? 'yd' : yop(q) ? 'yop' : tan ? 'on' : ''
      return '<span class="xk-qk ' + cls + '" data-q="' + q.id + '" role="button"><span class="xk-qt"><i>' + (q.birinchi ? '1' : q.yulduz ? '★' : tan ? '✓' : '') + '</i><b>' + q.nom + '</b><small class="xk-hj f-' + q.oila + '">' + q.hajm + '</small></span>' + (q.birinchi ? '<em>' + XG('yurmaydi') + '</em>' : q.yulduz ? '<em>' + XG('vaqtQ') + '</em>' : yop(q) ? '<em>' + q.bilan + '</em>' : tan ? '<em>' + q.karta + '</em>' : '') + '</span>'
    }).join('') + '</div>'
  }
  if (t.bosqich === 2) { if (a) { a.textContent = XG('tayyormiz'); a.classList.remove('off') } ishora(ek, XG('birinchi')); return }
  if (a) { a.textContent = XG('tanladik'); a.classList.toggle('off', t.tan.length !== 2) }
  ishora(ek, '')
}
function xkTanlovBosish(e, ek) {
  const t = ek.__tan; if (!t) return false
  if (e.target.closest('.xk-pr') && t.bosqich !== 2) { t.oyin = ''; t.tan = []; chal('bos'); xkTanlovChiz(ek); return true } // o'yin rasmi bosilsa — o'yin tanlashga qaytadi
  const o = e.target.closest('.xk-o[data-o]')
  if (o && t.bosqich !== 2 && o.dataset.o !== t.oyin) { t.oyin = o.dataset.o; t.tan = []; chal('bos'); xkTanlovChiz(ek); return true } // boshqa o'yin bosilsa — tanlov yangidan
  const q = e.target.closest('.xk-qk')
  if (q && t.bosqich !== 2) {
    const x = DARS.xakaton[t.oyin].qism.find((y) => y.id === q.dataset.q); if (!x || x.birinchi || x.yulduz) return true
    if (x.ozi && t.tan.indexOf(x.ozi) < 0) { ishora(ek, x.bilan); return true }
    const i = t.tan.indexOf(x.id)
    if (i >= 0) { t.tan.splice(i, 1); t.tan = t.tan.filter((id) => { const z = DARS.xakaton[t.oyin].qism.find((y) => y.id === id); return !z.ozi || t.tan.indexOf(z.ozi) >= 0 }) } else if (t.tan.length < 2) t.tan.push(x.id)
    chal('bos'); xkTanlovChiz(ek); return true
  }
  if (e.target.closest('.hn .asos')) {
    if (t.bosqich === 2) { chal('bos'); return false } // «Tayyormiz» — qobiq bolaKeyingi
    if (t.tan.length !== 2) return true
    const s = { oyin: t.oyin, qism: [DARS.xakaton[t.oyin].qism.find((y) => y.birinchi).id, ...t.tan], tanladi: 1, tayyor: {}, kim: {}, sina: {}, iz: {}, haydovchi: 1, dost: [], juft: (xkOl().juft) || 2 }
    xkYoz(s); t.bosqich = 2; chal('bos'); xkTanlovChiz(ek)
    if (typeof pogQosh === 'function') pogQosh(2)
    bildirB(ek, { t: 'xk', x: xkXulosa(s) })
    return true
  }
  return true
}
// 16-qadam: ustoz aytayotgan juftlik o'yini turini bosadi — karta yonadi
function xkKorsatBosish(e, ek) { const o = e.target.closest('.xk-o'); if (!o) return false; ek.querySelectorAll('.xk-o').forEach((x) => x.classList.toggle('on', x === o)); chal('bos'); return true }

// ---- 17-qadam: o'z natijasi (o'yin noutbuki — o'z holatidan; ikkinchi noutbuk — ustoz orqali kelgan xulosa) ----
function xkNatija(ek) {
  if (!DARS.xakaton) return
  const juft = typeof juftRol === 'function' ? juftRol() : 'oyin', s = xkOl()
  const x = juft === 'ikki' ? (typeof juftXulosa === 'function' ? juftXulosa() : null) : s.oyin ? xkXulosa({ ...s, tayyor: s.tayyor || {}, kim: s.kim || {}, dost: s.dost || [] }) : null
  const qo = (k, v) => { const b = ek.querySelector('.sn-t[data-k="' + k + '"] b'); if (b) b.textContent = v }
  const sn = ek.querySelector('.sn'), st = ek.querySelector('.st-s')
  if (!x) { if (sn) sn.hidden = true; if (st) st.hidden = true; const h = ek.querySelector('.chap .sar'); if (h) h.innerHTML = XG('natijaYoq'); return }
  qo('ta qism yasadingiz', x.q); qo('marta o‘ynab ko‘rildi', x.d)
  const ik = ek.querySelector('.sn-t[data-k="ikkalangiz ham haydadingiz ✓"]'); if (ik) ik.hidden = !x.ikki
  // ro'yxat «O‘yiningizda:» va o'yin maydoni
  const rq = ek.querySelector('.xk-nr .xk-rq'); if (rq && x.royxat) rq.innerHTML = x.royxat.map(([n, ok]) => '<i class="xk-r ' + (ok ? 'ok' : 'tug') + '"><span class="xk-b">' + (ok ? '✓' : '') + '</span>' + n + '</i>').join('')
  if (x.oyin === 'lab') { const k = ek.querySelector('.oyna .katak'); if (k) mdQayta(ek, DARS.labirintlar.D1) }
  const sq = ek.querySelector('.saqlandi'); if (sq) sq.hidden = !(juft !== 'ikki' && s.dastur)
}

// 8-qadam, ikkinchi noutbuk: o'yin noutbuklaridagi qahramonlar (ustozdan, qobiq.js juftRoyxat) — kalit «qahramon|rang|nomi»; bosgach — «Juftlikdasiz»
const juftQ = (k) => { const [q, r, n] = String(k).split('|'); return { q: q || 'momiq', r: +r, n: n || (typeof QNOM !== 'undefined' && QNOM[q]) || '' } }
function juftQahTayyorla(ek) {
  const jq = ek.querySelector('.tq.jq'); if (!jq || typeof juftRoyxat !== 'function') return
  jq.innerHTML = juftRoyxat().map((k) => { const x = juftQ(k); return '<span class="tq-o jq-o" data-k="' + k + '" role="button"><span class="aktyor tq-q">' + (QAH_SVG[x.q] || '') + '</span><i class="z"></i><b class="jq-n">' + x.n + '</b></span>' }).join('')
}
function juftQahBosish(e, ek) {
  const o = e.target.closest('.jq-o'); if (!o) return false
  ek.querySelectorAll('.jq-o').forEach((x) => x.classList.toggle('on', x === o)); chal('bos')
  try { localStorage.setItem(K + 'juftQ', o.dataset.k) } catch (er) {}
  if (typeof bildir === 'function') bildir({ t: 'juftIkki', q: o.dataset.k })
  setTimeout(() => { if (typeof bolaKeyingi === 'function') bolaKeyingi() }, 600)
  return true
}
// «Juftlikdasiz» va ikkinchi noutbukning natijasi: do'stining qahramoni
function juftDost() { let k = ''; try { k = localStorage.getItem(K + 'juftQ') || '' } catch (e) {} return k ? juftQ(k) : null }
function juftDostQoy(ek) { const d = juftDost(), q = ek.querySelector('.jd-q'); if (d && q && QAH_SVG[d.q]) q.innerHTML = QAH_SVG[d.q] }

// ===== 17-dars (21.11, manba 017): kosmik o'yin — personajlar (har birining o'z dasturi), raketa, o'q (klon), nishonlar =====
// klon.js dan keyin qo'shiladi (yigish.mjs skript). Studiya ekrani — bosh.personaj { royxat: [{ id, nom }], ochiq: [id…], tanla: id } va bosh.kosmik
// { bayroq: [[x, y]…], nishon: [[x, y]…], kerak: 'o‘ng' | 'ikki' | 'start' | 'tovush' | 'otish' | 'uchish' | 'ochish' | 'oqTovush' | 'nishon', chek: true }.
// Personaj dasturi: tanlangani — Blockly'da (yonib bajariladi), boshqasi — saqlangan Blockly JSON (ichki daraxt, yonmaydi). Raketa — maydondagi qahramon
// (.kt-q, rasmi raketa); o'qning asli raketa ichida — `create clone of myself` o'qni raketa turgan katakda paydo qiladi (klon.js nusxa mexanizmi).
// Gaplar — DARS.kosmikGap (dvigatelda dars matni yo'q). Dasturlar pog'onadan pog'onaga — bosh.prog 'per' (K+'per'; 18-dars ham o'qiydi; 'oldingi' emas — u 4-darsdagi o'yin dasturini yuklaydi).
const KS = (k, n) => { const g = (typeof DARS !== 'undefined' && DARS.kosmikGap) || {}; const t = g[k] != null ? g[k] : ''; return n != null && typeof t === 'string' ? t.replace(/\bN\b/, n) : t }
const perKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'per'
function perOl() { try { return JSON.parse(localStorage.getItem(perKalit()) || 'null') || {} } catch (e) { return {} } }
function perYoz(m) { try { localStorage.setItem(perKalit(), JSON.stringify(m)) } catch (e) {} }
const perBola = (ek) => { const r = ek && ek.parentNode && ek.parentNode.closest('#ust,#bol'); return !!r && r.id === 'bol' }
const perWs = (ek) => typeof BL_WS !== 'undefined' && BL_WS.get(ek)
const perSave = (ek) => { const ws = perWs(ek); return ws ? Blockly.serialization.workspaces.save(ws) : null }
function perLoad(ek, j) { const ws = perWs(ek); if (!ws) return; ws.clear(); if (j) Blockly.serialization.workspaces.load(j, ws); ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); if (typeof blTartibKeyin === 'function') blTartibKeyin(ws); sanoq(ek) }
// tayyorlash: har personajning dasturi — saqlangan (prog 'oldingi') yoki pog'onaning tayyor dasturi (perProg) yoki bo'sh
function perTayyorla(ek) {
  const b = TOP(ek.dataset.id).bosh, P = b.personaj; if (!P || !perWs(ek)) return
  const saq = perOl(), json = {}; let pp = (typeof SOLO !== 'undefined' && SOLO && b.soloPerProg) || b.perProg
  // 21–23-dars: karta bo'yicha tayyor dastur (kod.js kartaProg) — kartaProg: true (hammasi) yoki ['dushman', …]; solo'da soloKarta. (DARS demoda JSON bo'lib o'tadi — funksiya yozilmaydi)
  const kp = (typeof SOLO !== 'undefined' && SOLO && b.soloKarta) || b.kartaProg
  if (kp && typeof kartaProg === 'function') { const kpp = kartaProg(); pp = { ...(pp || {}) }; for (const k of (kp === true ? Object.keys(kpp) : kp)) pp[k] = kpp[k] }
  // solo'da — tayyor dastur (jonli darsda ustoz o'zi tuzadigan ekran)
  const saq17 = b.prog === 'per17' && perBola(ek) ? perOl17() : {} // 18-dars 1-pog'ona: 17-darsda saqlangan o'yin
  for (const { id } of P.royxat) {
    if (b.prog === 'per' && saq[id] && perBola(ek) && !(b.progYoq || []).includes(id)) json[id] = saq[id]
    else if (saq17[id]) json[id] = saq17[id]
    else if (pp && pp[id]) { klonQur(ek, pp[id]); json[id] = perSave(ek) }
    else json[id] = null
  }
  ek.__per = { cur: P.tanla || P.royxat[0].id, json }
  perLoad(ek, json[ek.__per.cur])
  perKartalar(ek)
  if (D18(ek)) kosmikOzg(ek)
}
function perKartalar(ek) {
  const b = TOP(ek.dataset.id).bosh, P = b.personaj, s = ek.__per, dst = ek.querySelector('.dst'); if (!P || !s || !dst) return
  let q = dst.querySelector('.per-q'); if (!q) { dst.querySelector('.dsb').insertAdjacentHTML('afterend', '<div class="per-q"></div>'); q = dst.querySelector('.per-q') }
  const ochiq = (id) => !P.ochiq || P.ochiq.indexOf(id) >= 0
  q.innerHTML = P.royxat.map(({ id, nom }) => '<span class="per-k' + (id === s.cur ? ' on' : '') + (ochiq(id) ? '' : ' qulf') + '" data-p="' + id + '" role="button"><i>' + ((DARS.perRasm || {})[id] || '') + '</i><b>' + nom + '</b></span>').join('')
  const sb = dst.querySelector('.dsb b'), p = P.royxat.find((x) => x.id === s.cur); if (sb && p) sb.textContent = p.nom + ' ' + KS('dasturi')
}
function perAlmash(ek, id) {
  const s = ek.__per; if (!s || s.cur === id || ek.dataset.oyin || ek.dataset.yuryapti) return
  s.json[s.cur] = perSave(ek); s.cur = id; perLoad(ek, s.json[id]); perKartalar(ek); chal('bos')
  if (D18(ek)) kosmikOzg(ek)
  if (typeof kodPersonaj === 'function') kodPersonaj(ek) // 19-dars: kod ham almashadi
}
function perSaqla(ek) { const s = ek.__per; if (!s || !perBola(ek)) return; s.json[s.cur] = perSave(ek); perYoz(s.json) }
// saqlangan JSON → dasturchalar (blDasturchalar shaklida): har tugun — yashirin element (data-tur, data-n, data-x/y, data-q), yonmaydi
function perJsonD(j) {
  const bl = ((j || {}).blocks || {}).blocks || [], r = []
  const kir = (b, nm) => { const q = b.inputs && b.inputs[nm], x = q && (q.block || q.shadow); if (!x) return '0'; const g = x.fields || {}; return x.type === 'random_n' ? 'r' + g.A + '-' + g.B : String(g.N == null ? 0 : g.N) } // go to (son katakli): random yoki son; oddiy son — shadow blokda (22.11)
  const tugun = (b) => { const tur = BL_TURI[b.type] || '?', f = b.fields || {}, el = document.createElement('span'); el.dataset.tur = tur; if (f.N != null) el.dataset.n = f.N; if (f.X != null) { el.dataset.x = f.X; el.dataset.y = f.Y } if (f.NOM) el.dataset.q = f.NOM; if (f.VAR) el.dataset.v = f.VAR; if (b.type === 'go_to_r') { el.dataset.kx = kir(b, 'X'); el.dataset.ky = kir(b, 'Y') } const t = { el, tur, ichki: [] }; if (b.inputs && b.inputs.DO && b.inputs.DO.block) t.ichki = zanjir(b.inputs.DO.block); return t }
  const zanjir = (b) => { const z = []; while (b) { z.push(tugun(b)); b = b.next && b.next.block } return z }
  for (const t of bl) if (BL_HODISA.has(t.type)) { const z = zanjir(t.next && t.next.block); r.push({ tur: t.type, tugma: t.type === 'when_key' ? (t.fields || {}).KEY : '', olma: t.type === 'when_touch' ? (t.fields || {}).OLMA : '', daraxt: z, bloklar: z.map((x) => x.el), hodisa: document.createElement('span') }) }
  return r
}
function kosmikNatija(ek) {
  const s = ek.querySelector('.saqlandi'), m = perOl(); let y = null; try { y = localStorage.getItem(perKalit() + '3') } catch (e) {} if (s) s.hidden = !(y && (m.raketa || m.oq))
  const ch = ksChekOl(); ek.querySelectorAll('.chek-y .ch-r[data-ch]').forEach((r) => { const ok = !!ch[r.dataset.ch]; r.classList.toggle('ok', ok); const i = r.querySelector('i'); if (i) i.textContent = ok ? '✓' : '' }) // 25.11 (K1)
}
function perD(ek, id) { const s = ek.__per; if (!s) return []; return id === s.cur ? blDasturchalar(ek) : perJsonD(s.json[id]) }

// ---- maydon: bayroqlar va nishonlar ----
// rasmlar — dars qismlaridan (DARS.ksNishon, DARS.ksBayroq: katak ichidagi SVG)
function kosmikChiz(ek) {
  const b = TOP(ek.dataset.id).bosh, k = b.kosmik || {}, m = klonMaydon(ek); if (!m || !m.svg) return
  m.svg.querySelectorAll('.ks-b,.ks-n').forEach((x) => x.remove())
  const g = (cls, x, y, ic) => { const e = document.createElementNS('http://www.w3.org/2000/svg', 'g'); e.setAttribute('class', cls); e.dataset.k = x + ',' + y; e.style.transform = katakJoy(x, m.H - 1 - y); e.innerHTML = ic; m.svg.insertBefore(e, m.k.querySelector('.kt-q')); return e }
  ;(k.bayroq || []).forEach(([x, y]) => g('ks-b', x, y, DARS.ksBayroq || ''))
  ;(k.nishon || ek.__ksNishon || []).forEach(([x, y]) => g('ks-n', x, y, DARS.ksNishon || ''))
}
function kosmikTayyorla(ek) {
  const b = TOP(ek.dataset.id).bosh
  if ((b.kosmik || {}).qoy) ek.__ksNishon = [] // 15 · ★: nishonlarni bola o'zi qo'yadi (katakni bosib)
  perTayyorla(ek); kosmikChiz(ek); kosmikChekChiz(ek, {}) // tugma va boshlang'ich ishora — oyinTayyorla (bosh.oyin)
  if (D18(ek)) dushTayyorla(ek)
}
// chek-list «O‘yiningizda:» (3-bekat) — javon ustunining pastida (9-darsdagi .chek ko'rinishi); oila almashsa ham qaytadi (studiya.js)
// 25.11 (K1): bola o'yinlarida belgilangan bandlar dars bo'yi to'planadi — yakunda (.chek-y) ✓ bo'lib chiqadi
const ksChekKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'ksChek'
function ksChekOl() { try { return JSON.parse(localStorage.getItem(ksChekKalit()) || '{}') || {} } catch (e) { return {} } }
function kosmikChekChiz(ek, c) {
  const b = TOP(ek.dataset.id).bosh, k = b.kosmik || {}, pl = ek.querySelector('.pl'); if (!pl || !k.chek) return
  if (c && perBola(ek)) { const s = ksChekOl(); let o = false; for (const id in c) if (c[id] && !s[id]) { s[id] = true; o = true } if (o) try { localStorage.setItem(ksChekKalit(), JSON.stringify(s)) } catch (e) {} }
  c = c || ek.__ksChek || {}; ek.__ksChek = c
  pl.querySelectorAll('.chek').forEach((x) => x.remove())
  pl.insertAdjacentHTML('beforeend', '<div class="chek"><small>' + KS('royxat') + '</small>' + (KS('chek') || []).map(([id, t]) => '<span class="ch-r' + (c[id] ? ' ok' : '') + '"><i>' + (c[id] ? '✓' : '') + '</i>' + t + '</span>').join('') + '</div>')
}

// ---- o'yin ----
function kosmikAslJoy(ek, s0) { const s = s0 || ek.__klon, o = OYIN.get(ek); if (s && o && o.h) { s.asl.x = o.h.x; s.asl.y = mdY(o.h.xr, o.h.y) } }
async function kosmikBoshla(ek) {
  const id = ek.dataset.id, b = TOP(id).bosh, k = b.kosmik || {}
  muammoOl(ek); urildiOl(ek); ek.querySelectorAll('.konfeti,.dv-pufak').forEach((x) => x.remove())
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  const P = b.personaj, all = P.royxat.flatMap(({ id: p }) => perD(ek, p).map((d) => ({ ...d, p })))
  if (!all.length || all.every((d) => !d.bloklar.length)) { chal('muammo'); ishora(ek, KS('bosh')); muammo(ek, 'boshvoy', KS('boshP')); return }
  if (k.qoy && (ek.__ksNishon || []).length < k.qoy) { chal('muammo'); ishora(ek, KS('qoyKam', k.qoy)); muammo(ek, 'kamvoy', KS('ozP')); return }
  kosmikChiz(ek)
  klonOl(ek)
  const h = await SAHNA.katak.boshla(ek, b); h.tez = true // 25.11 (Q12-A): raketa sakramaydi — tez sirpanadi (sahna.js)
  ek.__klon = { asl: { x: h.x, y: mdY(h.xr, h.y), asl: true }, nusxa: [], soni: 0, ishlar: [], kosmik: true, kut: k.kut || 380, nusxaD: () => perD(ek, 'oq'), sanoqYoq: D18(ek) } // 18-dars: sanoq — faqat «Dushman: N»
  const o = { h, bosish: 0, yurdi: new Set(), bayroq: new Set(), tovushYur: new Set(), oqTovush: false, urildi: 0, tepaga: 0, tepadaOchdi: 0, chek: {}, kosmik: true }
  OYIN.set(ek, o); ek.dataset.oyin = 'kosmik'
  const tb = oyinTugma(ek); if (tb) tb.textContent = '■ To‘xtatish'
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-yz">' + KS('oyinYz') + '</span>')
  maslahatOch(ek)
  if (D18(ek)) return dushBoshla(ek, o, all) // 18-dars: dushman, ball, jon
  // when ▶ clicked — hamma personajda, o'yin boshida
  const x0 = h.x, y0 = mdY(h.xr, h.y)
  for (const d of all.filter((x) => x.tur === 'when_start')) { ek.dataset.yuryapti = '1'; d.hodisa.classList && d.hodisa.classList.add('hozir'); await ijro(turla(d.daraxt), (t) => kosmikBlok(ek, o, d.p, t), { kut: 300 }); d.hodisa.classList && d.hodisa.classList.remove('hozir'); delete ek.dataset.yuryapti; if (OYIN.get(ek) !== o) return }
  if (k.kerak === 'start') { const x = o.h.x, y = mdY(o.h.xr, o.h.y); if ((x !== x0 || y !== y0) && x === 3 && y === 0) return kosmikYutdi(ek, o); if (x0 !== 3) { chal('muammo'); ishora(ek, KS('startKerak')); muammo(ek, 'kamvoy', KS('ozP')) } }
}
async function kosmikBos(ek, k, o) {
  const b = TOP(ek.dataset.id).bosh, P = b.personaj
  const ds = P.royxat.flatMap(({ id }) => perD(ek, id).filter((d) => d.tur === 'when_key' && d.tugma === k).map((d) => ({ ...d, p: id })))
  muammoOl(ek)
  if (!ds.length) { chal('muammo'); ishora(ek, TUGMA_BELGI[k] + ' tugmasi uchun when ' + TUGMA_BELGI[k] + ' key pressed bloki kerak'); muammo(ek, 'boshvoy', 'Bu tugma uchun dasturcha yo‘q-ku…'); return }
  if (ds.every((d) => !d.bloklar.length)) { chal('muammo'); ishora(ek, 'Hodisa blokining ostiga blok ulang'); muammo(ek, 'kamvoy', 'Tugma bosildi, lekin men nima qilay?'); return }
  o.bosish++
  // raketa dasturchalari — kutiladi (raketa yuradi); o'q dasturchalari — nusxa yasaydi (uchishi kutilmaydi)
  ek.dataset.yuryapti = '1'
  const bor = (z, tur) => z.some((t) => t.tur === tur || bor(t.ichki || [], tur))
  for (const d of ds.filter((x) => x.p !== 'oq')) { d.hodisa.classList && d.hodisa.classList.add('hozir'); const x0 = o.h.x, z = turla(d.daraxt); await ijro(z, (t) => kosmikBlok(ek, o, d.p, t), { kut: 70, oxir: 20 }) /* 25.11 (QA F-1125-12, Q12-A): raketa ~2× tez */; d.hodisa.classList && d.hodisa.classList.remove('hozir'); if (o.h.x !== x0 && bor(z, 'n')) o.tovushYur.add(o.h.x > x0 ? 'r' : 'l') } // ★: tovush — yurgan dasturchada
  delete ek.dataset.yuryapti
  const oqD = ds.filter((x) => x.p === 'oq').map((d) => ({ ...d, z: turla(d.daraxt) }))
  if (k === 'space' && !oqD.some((d) => bor(d.z, 'C')) && !ds.some((d) => d.p !== 'oq' && bor(turla(d.daraxt), 'C'))) { chal('muammo'); ishora(ek, KS('oqQani')); muammo(ek, 'boshvoy', KS('oqQaniP')) } // space — o'q paydo bo'lmaydi
  for (const d of oqD) ijro(d.z, (t) => kosmikBlok(ek, o, d.p, t), { kut: 120 })
  if (OYIN.get(ek) === o) kosmikTekshir(ek, o)
}
// bitta blok — personaj bo'yicha: raketa (qahramon h) yoki o'qning asli (nusxa yasaydi)
async function kosmikBlok(ek, o, p, t) {
  if (OYIN.get(ek) !== o) return 'toxta'
  if (t.tur === 'z' || t.tur === 'c' || t.tur === 'i' || t.tur === 'g') { const r = ballBlok(ek, null, t); if (t.tur === 'g') { if (OYIN.get(ek) === o) kosmikOyinTugadi(ek, o); return 'toxta' } return r } // 18-dars: o'zgaruvchilar va game over
  if (p === 'dushman') { if (t.tur === 'C') { await klonYasa(ek, ek.__dush); dushSanoq(ek) } else if (t.tur === 'n') chal('bos'); return } // dushmanning asli — faqat nusxa yasaydi
  if (t.tur === 'C') { if (p !== 'oq') { chal('muammo'); ishora(ek, KS('raketaKlon')); muammo(ek, 'kamvoy', KS('raketaKlonP')); return 'toxta' } await klonYasa(ek, ek.__klon); o.chek.otildi = true; kosmikChekChiz(ek, o.chek); return }
  if (t.tur === 'n' && p === 'oq') { o.oqTovush = true; chal('sakrash'); return }
  if (p === 'oq') return // o'qning asli harakatlanmaydi — raketa ichida
  const x0 = o.h.x
  const r = await SAHNA.katak.bajar(o.h, t); o.h.urildi = null
  const dx = o.h.x - x0; if (dx) o.yurdi.add(dx > 0 ? 'r' : 'l')
  const y = mdY(o.h.xr, o.h.y); ((TOP(ek.dataset.id).bosh.kosmik || {}).bayroq || []).forEach(([bx, by]) => { if (bx === o.h.x && by === y) { o.bayroq.add(bx + ',' + by); const e = ek.querySelector('.ks-b[data-k="' + bx + ',' + by + '"]'); if (e) e.classList.add('ok') } })
  if (o.yurdi.has('r') && o.yurdi.has('l')) { o.chek.yuradi = true; if (!o.d18) kosmikChekChiz(ek, o.chek) }
  if (o.d18 && dx && ek.__dush) { const d = ek.__dush.nusxa.find((q) => !q.ochdi && q.x === o.h.x && q.y === y); if (d) await dushTegdi(ek, o, d) } // raketa dushmanga yurdi
  return r
}
// o'q nishon katagiga kirdi — nishon parchalanadi, o'q o'chadi
function kosmikNishon(ek, n) {
  if (D18(ek)) return kosmikTegish(ek, n) // 18-dars: o'q ↔ dushman, dushman ↔ raketa
  const o = OYIN.get(ek); if (!o || n.ochdi) return
  const e = ek.querySelector('.ks-n:not(.urildi)[data-k="' + n.x + ',' + n.y + '"]'); if (!e) return
  e.classList.add('urildi'); chal('bos'); n.nishon = true; klonOchir(ek, n); o.urildi++; o.chek.ochdi = true; kosmikChekChiz(ek, o.chek)
  setTimeout(() => e.remove(), 380)
  kosmikTekshir(ek, o)
}
// o'q nusxasining dasturchasi tugadi: tepada qoldi / maydondan chiqmoqchi bo'ldi / o'chdi
function kosmikNusxaTugadi(ek, n) {
  const o = OYIN.get(ek); if (!o) return
  if (ek.__dush && n.s === ek.__dush) return // dushman nusxalari — o'yin oxirida (dushTugadi)
  const tepa = n.y === KL_H()
  if (tepa || (n.chet && n.chet.tur === 'u')) o.tepaga++
  if (n.ochdi && tepa) { o.tepadaOchdi++; o.chek.ochdi = true; kosmikChekChiz(ek, o.chek) }
  if (!n.boshladi) { if (!o.turibGap) { o.turibGap = true; chal('muammo'); ishora(ek, KS('turib')); muammo(ek, 'boshvoy', KS('turibP')) } }
  else if (n.chet) { chal('muammo'); ishora(ek, KS('chet')); muammo(ek, 'kamvoy', KS('chetP')) }
  else if (!n.ochdi && tepa && !o.qolganGap) { o.qolganGap = true; chal('muammo'); ishora(ek, KS('qoldi')); muammo(ek, 'kamvoy', KS('qoldiP')) }
  else if (!tepa && !n.nishon && !o.yetmadiGap) { o.yetmadiGap = true; chal('muammo'); ishora(ek, KS('yetmadi')); muammo(ek, 'kamvoy', KS('yetmadiP')) }
  kosmikTekshir(ek, o)
}
// pog'ona sharti — har bosish va har nusxa tugaganidan keyin
function kosmikTekshir(ek, o) {
  const b = TOP(ek.dataset.id).bosh, k = b.kosmik || {}, s = ek.__klon || { nusxa: [] }
  const ok = {
    'o‘ng': () => (k.bayroq || []).every(([x, y]) => o.bayroq.has(x + ',' + y)),
    ikki: () => (k.bayroq || []).every(([x, y]) => o.bayroq.has(x + ',' + y)),
    tovush: () => o.tovushYur.has('r') && o.tovushYur.has('l'),
    otish: () => o.tepadaOchdi >= 1,
    uchish: () => o.tepadaOchdi >= 1,
    ochish: () => o.tepadaOchdi >= 1,
    oqTovush: () => o.oqTovush && o.tepadaOchdi >= 1,
    nishon: () => !ek.querySelector('.ks-n:not(.urildi)') && (!k.chek || ['yuradi', 'otildi', 'ochdi'].every((c) => o.chek[c])),
  }[k.kerak]
  if (!ok || !ok()) return
  if (k.kerak === 'nishon') { o.chek.hamma = true; kosmikChekChiz(ek, o.chek) }
  return kosmikYutdi(ek, o)
}
function kosmikYutdi(ek, o, tugadi) {
  const id = ek.dataset.id, t = TOP(id), b = t.bosh, g = t.gap || {}
  if (o.yutdi) return; o.yutdi = true
  kosmikToxtat(ek); ishora(ek, g.yetdi ? GAPT(g.yetdi) : tugadi === 'oynadi' ? KS('oynadi') : tugadi ? KS('tugadiYutdi') : KS('yutdi')); konfeti(ek)
  if (!perBola(ek) || ek.dataset.oqish) return
  perSaqla(ek); oxirgiSaqla(ek)
  if ((b.kosmik || {}).chek) try { localStorage.setItem(perKalit() + '3', '1') } catch (e) {} // 3-bekatda yutildi — o'yin saqlandi (yakun ekrani)
  const s = ek.__klon || { nusxa: [] }, bl = (tur, n) => Array.from({ length: n }, () => ({ dataset: { tur } }))
  if (typeof blokQosh === 'function') blokQosh(id, [...(o.d18 ? [...bl('U', o.urdi), ...bl('W', 1)] : [...bl('O', s.nusxa.length), ...bl('U', o.urildi)]), ...(typeof kodHisob === 'function' && b.kod ? kodHisob(ek) : [])])
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  otKeyin(ek)
}
function kosmikToxtat(ek) { for (const s of [ek.__klon, ek.__dush]) if (s) { s.toxtat = true; s.nusxa.forEach((n) => { n.toxtat = true }) } oyinToxtat(ek) }
// bosishlar (studiyaBosish dan): personaj kartasi
function kosmikBosish(e, ek) {
  const ks = TOP(ek.dataset.id).bosh.kosmik || {}
  if (ks.qoy && !ek.dataset.oyin) { const c = e.target.closest('.katak.maydon .kt-c, .katak.maydon .ks-n'), m = klonMaydon(ek); if (c && m) { const [x, r] = c.dataset.k.split(',').map(Number), y = c.classList.contains('ks-n') ? r : m.H - 1 - r; if (y < 2) { ishora(ek, KS('qoyPast')); return true } const l = ek.__ksNishon = ek.__ksNishon || [], i = l.findIndex(([a, q]) => a === x && q === y); if (i >= 0) l.splice(i, 1); else l.push([x, y]); chal('bos'); kosmikChiz(ek); ishora(ek, KS('qoyN', l.length)); return true } }
  const k = e.target.closest('.dst .per-k'); if (!k) return null
  if (k.classList.contains('qulf')) { ishora(ek, KS('qulf')); return true }
  perAlmash(ek, k.dataset.p); return true
}

// ---- huk (2–4): A — raketaning o'zi uchadi, B — bitta o'q (nusxasiz), C — o'q nusxalari; data-kosmik = 'A' | 'B' | 'C' ----
async function kosmikHuk(ek, k) {
  const m = klonMaydon(ek); if (!m) return
  const q = m.k.querySelector('.kt-q'), tur = k.dataset.kosmik, H = m.H
  ek.querySelectorAll('.kt-klon').forEach((x) => x.remove()); ek.querySelectorAll('.ks-n.urildi').forEach((x) => x.classList.remove('urildi')); if (q) katakSur(q, 3, H - 1, false) // huk ekrani — statik nishon (3, 4)
  const ur = () => { const n = ek.querySelector('.ks-n:not(.urildi)'); if (n) { n.classList.add('urildi'); chal('bos') } }
  await KUT(400)
  if (tur === 'A') { for (let y = 1; y <= 4; y++) { katakSur(q, 3, H - 1 - y, true); chal('qadam'); await KUT(420) } ur(); await KUT(700); chal('tuk'); await KUT(500); return } // raketa tepada qoldi; yana space — chiqib bo'lmaydi
  const oq = (y) => klonRasm(ek, 3, y, 'kt-klon')
  if (tur === 'B') { const g = oq(0); for (let y = 1; y <= 4; y++) { katakSur(g, 3, H - 1 - y, false); await KUT(380) } ur(); await KUT(800); chal('muammo'); muammo(ek, 'boshvoy', KS('oqQaniP')); await KUT(900); return }
  for (let i = 0; i < 3; i++) { const g = oq(0); (async () => { for (let y = 1; y <= 4; y++) { katakSur(g, 3, H - 1 - y, false); await KUT(380) } if (!i) ur(); g.remove() })(); await KUT(700) }
  await KUT(1700)
}
async function kosmikHukSina(ek, k, i) {
  if (ek.dataset.yuryapti) return
  const g = TOP(ek.dataset.id).gap || {}
  ek.dataset.yuryapti = '1'
  ek.querySelectorAll('.jk').forEach((x) => x.classList.toggle('sinov', x === k)); ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove()); muammoOl(ek)
  k.classList.remove('n-ok', 'n-yoq'); k.querySelectorAll('.jn').forEach((x) => x.remove())
  await (k.dataset.kodh ? kodHuk(ek, k) : k.dataset.kosmik2 ? kosmikHuk2(ek, k) : kosmikHuk(ek, k)) // 19-dars: kod.js
  delete ek.dataset.yuryapti
  const ok = k.dataset.ok === '1'
  k.classList.remove('sinov'); k.classList.add(ok ? 'n-ok' : 'n-yoq')
  ;(k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<small class="jn">' + k.dataset.nat + '</small>')
  if (ok) konfeti(ek)
  ek.dataset.huk = Math.max(+(ek.dataset.huk || 0), i + 1)
  const a = ek.querySelector('.hn .asos'); if (a && g.keyingi) a.textContent = g.keyingi
}

// ===== 18-dars (21.11, manba 018): Dushman — uchinchi personaj (asli tepada, nusxalari tushadi), tegish, ball va jon =====
// bosh.kosmik.dushman { asl: [x, y] } bo'lsa — ikki klon holati: ek.__klon (o'q, tepaga) va ek.__dush (dushman, pastga); klon.js n.s orqali ajratadi.
// Tegish: o'q va dushman bir katakda — ikkalasi o'chadi, o'q dasturidagi `when touching enemy` (ball); dushman raketa katagida — dushman o'chadi,
// raketa dasturidagi `when touching enemy` (jon). O'zgaruvchilar — 11–12-darsdagi ballBlok (set, change, if, game over); ekranda saqlanadi (o'yindan o'yinga).
const D18 = (ek) => !!(((TOP(ek.dataset.id) || {}).bosh || {}).kosmik || {}).dushman
const perKalit17 = () => { const k = perKalit(), a = (DARS.lms || {}).kalit, b = DARS.perKalit17; return a && b && k.indexOf(a) >= 0 ? k.replace(a, b) : null }
function perOl17() { const k = perKalit17(); if (!k) return {}; try { return JSON.parse(localStorage.getItem(k) || 'null') || {} } catch (e) { return {} } }
// sahnadagi kapsulalar: hamma personaj dasturidagi o'zgaruvchilar (tanlanmaganlari ham) ko'rinadi
function kosmikOzg(ek) {
  const q = ek.querySelector('.oyna .ball-q'), s = ek.__per; if (!q || !s) return
  const v = new Set(); JSON.stringify(s.json).replace(/"VAR":"(\w+)"/g, (m, n) => { v.add(n); return m })
  if ((TOP(ek.dataset.id).bosh.kosmik || {}).ozg) v.add('ball') // 2–3-bekat: «ball: 0» doim sahnada (manba 11-qadam)
  q.dataset.doim = [...v].join(','); if (typeof ozgKorinsin === 'function') ozgKorinsin(ek)
}
function dushAslChiz(ek) {
  const k = TOP(ek.dataset.id).bosh.kosmik.dushman, a = k.asl || [3, KL_H()]
  ek.querySelectorAll('.katak .kt-asl.ks-d').forEach((x) => x.remove())
  return { x: a[0], y: a[1], g: klonRasm(ek, a[0], a[1], 'kt-asl ks-d', DARS.dushSvg), asl: true }
}
// raketa dasturida «jon tugasa — o'yin tugaydi» qoidasi bormi (if jon = 0 ichida game over)
function jonQoidasi(ek) { const bor = (z) => z.some((t) => (t.tur === 'i' && ozgNom(t.el) === 'jon' && blokSon(t.el) === 0 && (t.ichki || []).some((x) => x.tur === 'g')) || bor(t.ichki || [])); return perD(ek, 'raketa').some((d) => bor(turla(d.daraxt))) }
function dushTayyorla(ek) {
  ek.__ksChek = {}; ek.__oyinlar = 0; ek.__oldBall = null
  if (typeof vBosh === 'function') vBosh(ek, {})
  kosmikOzg(ek)
}
async function dushBoshla(ek, o, all) {
  const b = TOP(ek.dataset.id).bosh, k = b.kosmik
  o.chek = ek.__ksChek = ek.__ksChek || {}; o.urdi = 0; o.tegdi = 0; o.tushdi = 0; o.d18 = true
  ek.querySelectorAll('.oyin-tugadi').forEach((x) => x.remove()); ek.__tugadi = false
  const s2 = ek.__dush = { asl: dushAslChiz(ek), nusxa: [], soni: 0, ishlar: [], kosmik: true, tushadi: true, svg: DARS.dushSvg, cls: 'ks-d', sanoqYoq: true, kut: k.kutD || 600, nusxaD: () => perD(ek, 'dushman') }
  s2.asl.s = s2
  ;['ball', 'jon'].forEach((n) => { if (typeof ballKor === 'function') ballKor(ek, vOl(ek, n), null, null, n) })
  dushSanoq(ek)
  if (jonQoidasi(ek)) o.chek.tugaydi = true
  kosmikChekChiz(ek, o.chek)
  // ▶ — raketa va o'q (o'zgaruvchilar) darhol; dushman — asta (nusxalar oralig'i), tugmalarni to'smaydi
  ek.__oyinlar++
  for (const d of all.filter((x) => x.tur === 'when_start' && x.p !== 'dushman')) { ek.dataset.yuryapti = '1'; await ijro(turla(d.daraxt), (t) => kosmikBlok(ek, o, d.p, t), { kut: 200 }); delete ek.dataset.yuryapti; if (OYIN.get(ek) !== o) return }
  o.ball0 = vOl(ek, 'ball'); o.jon0 = vOl(ek, 'jon')
  if (k.kerak === 'ball0' && ek.__oyinlar >= 2 && o.ball0 !== 0) { chal('muammo'); ishora(ek, KS('eskiBall')); muammo(ek, 'kamvoy', KS('eskiBallP')) }
  const ds = all.filter((x) => x.tur === 'when_start' && x.p === 'dushman')
  ;(async () => {
    for (const d of ds) { await ijro(turla(d.daraxt), (t) => kosmikBlok(ek, o, 'dushman', t), { kut: k.kutAsl || 900 }); if (OYIN.get(ek) !== o) return }
    while (s2.ishlar.length) { const r = s2.ishlar.splice(0); await Promise.all(r) }
    await KUT(300)
    if (OYIN.get(ek) === o && !o.yutdi) dushTugadi(ek, o)
  })()
}
function dushSanoq(ek) { const ob = ek.querySelector('.oyna'), s2 = ek.__dush; if (!ob) return; let el = ob.querySelector('.kl-son'); if (!el) { ob.insertAdjacentHTML('beforeend', '<span class="gl kl-son"></span>'); el = ob.querySelector('.kl-son') } el.textContent = KS('dushSanoq', s2 ? s2.nusxa.length : 0) }
// tegish (klon.js klonBlok dan — har nusxa yurgandan keyin; kosmikBlok dan — raketa yurgandan keyin)
function kosmikTegish(ek, n) {
  const o = OYIN.get(ek), s1 = ek.__klon, s2 = ek.__dush; if (!o || !s2 || n.ochdi) return
  const tirik = (s) => (s ? s.nusxa.filter((q) => !q.ochdi) : [])
  if (n.s === s2) {
    n.yurdi = true
    const q = tirik(s1).find((q) => q.x === n.x && q.y === n.y); if (q) return dushUrish(ek, o, q, n)
    if (o.h && o.h.x === n.x && mdY(o.h.xr, o.h.y) === n.y) return dushTegdi(ek, o, n)
  } else {
    const d = tirik(s2).find((d) => d.x === n.x && d.y === n.y); if (d) return dushUrish(ek, o, n, d)
  }
}
async function tegishIsh(ek, o, p) {
  const ds = perD(ek, p).filter((d) => d.tur === 'when_touch' && d.olma === 'enemy')
  for (const d of ds) { await ijro(turla(d.daraxt), (t) => kosmikBlok(ek, o, p, t), { kut: 60 }); if (ek.__tugadi) break }
  return ds.length
}
async function dushUrish(ek, o, q, d) {
  klonOchir(ek, q); klonOchir(ek, d); q.nishon = true; d.urildi = true; chal('bos'); o.urdi++
  const b0 = vOl(ek, 'ball'); await tegishIsh(ek, o, 'oq')
  if (OYIN.get(ek) !== o) return
  if (vOl(ek, 'ball') > b0) { o.chek.ball = true; kosmikChekChiz(ek, o.chek) } else o.ballsiz = true
  if (ek.__tugadi) return kosmikOyinTugadi(ek, o)
  dushTekshir(ek, o, 'urdi')
}
async function dushTegdi(ek, o, d) {
  klonOchir(ek, d); d.tegdi = true; o.tegdi++; chal('tuk'); if (o.h && o.h.q) katakTurtil(o.h, [0, 1])
  const j0 = vOl(ek, 'jon'); await tegishIsh(ek, o, 'raketa')
  if (OYIN.get(ek) !== o) return
  const j = vOl(ek, 'jon')
  if (j < j0) { o.chek.jon = true; kosmikChekChiz(ek, o.chek) } else if (!o.jonGap && (TOP(ek.dataset.id).bosh.kosmik || {}).chek) { /* «Jon qani?» — faqat 3-bekatda: jon 14-qadamda o'tiladi, 1–2-bekatda tegish gapsiz */ o.jonGap = true; chal('muammo'); ishora(ek, KS('jonQani')); muammo(ek, 'kamvoy', KS('jonQaniP')) }
  if (ek.__tugadi) return kosmikOyinTugadi(ek, o)
  if (j <= 0 && j < j0) { kosmikToxtat(ek); chal('muammo'); ishora(ek, KS('jonTugadi')); muammo(ek, 'kamvoy', KS('jonTugadiP')); return } // jon tugadi, o'yin davom etyapti — qoida yo'q
  dushTekshir(ek, o, 'tegdi')
}
// game over: «O‘yin tugadi» taxtasi; 3-bekat 2-pog'ona — jon aynan 0 da tugadi — yutdi
function kosmikOyinTugadi(ek, o) {
  const k = TOP(ek.dataset.id).bosh.kosmik
  kosmikToxtat(ek); ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-tugadi">O‘yin tugadi</span>'); chal('tuk')
  const j = vOl(ek, 'jon')
  if (j === 0) { o.chek.tugaydi = true; kosmikChekChiz(ek, o.chek) }
  if (k.kerak === 'tugaydi' && j === 0) return kosmikYutdi(ek, o, true)
  if (k.kerak === 'oynadi') return kosmikYutdi(ek, o, 'oynadi') // 23-dars: mehmon o'ynadi — o'yin tugadi ham sanaladi
  ishora(ek, KS('tugadi'))
}
// pog'ona sharti o'yin paytida (urish / tegish)
function dushTekshir(ek, o, nima) {
  const k = TOP(ek.dataset.id).bosh.kosmik
  if (k.kerak === 'jon' && nima === 'tegdi' && o.chek.jon) return kosmikYutdi(ek, o)
}
// hamma dushman tugadi (o'yin oxiri)
function dushTugadi(ek, o) {
  const k = TOP(ek.dataset.id).bosh.kosmik, s2 = ek.__dush, nus = s2.nusxa, ball = vOl(ek, 'ball'), jon = vOl(ek, 'jon')
  const M = (kim, p, i) => { kosmikToxtat(ek); chal('muammo'); ishora(ek, i); muammo(ek, kim, p) }
  if (!nus.length) return M('boshvoy', KS('dushQaniP'), KS('dushQani'))
  if (nus.some((n) => !n.boshladi)) return M('boshvoy', KS('turibP'), KS('turib'))
  if (nus.some((n) => n.chet)) return M('kamvoy', KS('chetP'), KS('chetD'))
  if (nus.some((n) => !n.ochdi)) return M('kamvoy', KS('yerdaP'), KS('yerda'))
  o.tushdi = nus.filter((n) => n.yurdi).length
  if (o.tushdi >= 3) { o.chek.tushadi = true; kosmikChekChiz(ek, o.chek) }
  if (o.ballsiz && !o.chek.ball && (k.kerak || '').indexOf('ball') === 0) return M('kamvoy', KS('ballQaniP'), KS('ballQani'))
  if (o.jonGap && !o.chek.jon && ['jon', 'tugaydi', 'toliq'].includes(k.kerak)) return M('kamvoy', KS('jonQaniP'), KS('jonQani')) // tegdi, jon o'zgarmadi — oxirida ham «Jon qani?» (ball kabi)
  const yon = jon > 0 || !perD(ek, 'raketa').length || !JSON.stringify(ek.__per.json).includes('"jon"')
  const ustun = new Set(nus.map((n) => n.x)).size
  const sh = {
    dush1: () => nus.length >= 1 || KS('soni', 1),
    dush5: () => nus.length === 5 || KS('soni', 5),
    ustun: () => (nus.length >= 5 && ustun >= 2) || (nus.length < 5 ? KS('soni', 5) : KS('bir')), // «har xil» — kamida 2 ustun (16-dars 'xil'); 22.11: 3 ustunda 5 ta tushsa ham «5 ta tushsin» derdi
    urdi: () => o.urdi >= (k.soni || 3) || KS('urdiKam', k.soni || 3),
    ball1: () => ball >= 1 || KS('ballKam', ball),
    ball0: () => (ek.__oyinlar >= 2 && o.ball0 === 0 && ek.__oldBall > 0 && ball >= 1) || (ek.__oyinlar < 2 ? KS('ikkinchi') : o.ball0 !== 0 ? KS('eskiBall') : KS('ballKam', ball)),
    ball2: () => (ball >= 2 && ball === 2 * o.urdi) || KS('ikkiBall'),
    rekord: () => ball >= 8 || KS('ballKam', ball),
    jon: () => KS('tegsin'),
    tugaydi: () => KS('tegsin'),
    toliq: () => (jon > 0 && ball >= 3 && ['tushadi', 'ball', 'jon', 'tugaydi'].every((c) => o.chek[c])) || (jon > 0 && ball < 3 ? KS('ballKam', ball) : KS('toliqKam')),
    oz: () => nus.length >= 8 || KS('kamida8'),
    oynadi: () => true, // 23-dars: bitta o'yin tugadi
    kod: () => (typeof kodOyinShart === 'function' ? kodOyinShart(ek, o, { nus, ball, jon }) : true), // 19-dars: kodda son (kod.js)
    karta1: () => kartaShart(ek, o, { nus, ball, jon }, 'karta1'), karta2: () => kartaShart(ek, o, { nus, ball, jon }, 'karta2'), karta3: () => kartaShart(ek, o, { nus, ball, jon }, 'karta3'), karta4: () => kartaShart(ek, o, { nus, ball, jon }, 'karta4'), karta5: () => kartaShart(ek, o, { nus, ball, jon }, 'karta5'), // 21–23-dars: loyiha kartasi (kod.js)
  }[k.kerak]
  ek.__oldBall = ball
  if (yon && sh) { const r = sh(); if (r === true) { if (yon) { o.chek.yutdi = true; kosmikChekChiz(ek, o.chek) } return kosmikYutdi(ek, o) } kosmikToxtat(ek); if (k.kerak === 'ball0' && ek.__oyinlar < 2) { chal('qadam'); ishora(ek, r); return } chal('muammo'); ishora(ek, r); muammo(ek, 'kamvoy', KS('ozP')); return }
  kosmikToxtat(ek); ishora(ek, KS('yutdi'))
}

// ---- huk (2–4, 18-dars): A — o'q uradi, son yo'q; B — beshta dushman, har birida blok; C — o'q tegsa ball +1 (data-kosmik2) ----
async function kosmikHuk2(ek, k) {
  const m = klonMaydon(ek); if (!m) return
  const tur = k.dataset.kosmik2, H = m.H, kap = ek.querySelector('.oyna .ball-k[data-v="ball"]')
  ek.querySelectorAll('.katak .kt-klon').forEach((x) => x.remove()); if (typeof vBosh === 'function') vBosh(ek, {}); if (kap) { kap.classList.toggle('yoq', tur !== 'C'); ballKor(ek, 0, null, null, 'ball') }
  const uch = async (x, y) => { const g = klonRasm(ek, x, 0, 'kt-klon'); for (let q = 1; q <= y; q++) { katakSur(g, x, H - 1 - q, false); await KUT(330) } g.remove() }
  const dush = (x, y) => klonRasm(ek, x, y, 'kt-klon ks-d', DARS.dushSvg)
  await KUT(300)
  if (tur === 'A') { const d = dush(3, 3); await uch(3, 3); d.remove(); chal('bos'); await KUT(900); return }
  if (tur === 'B') { const r = [1, 2, 3, 4, 5].map((x) => dush(x, 3)); for (const d of r) { d.classList.add('yangi'); chal('bos'); await KUT(260) } await KUT(800); r.forEach((d) => d.remove()); return }
  for (let i = 1; i <= 3; i++) { const d = dush(3, 3); await uch(3, 3); d.remove(); chal('bos'); vQoy(ek, 'ball', i); ballKor(ek, i, '+1', null, 'ball'); await KUT(450) }
  await KUT(900)
}

// ===== Demo: haqiqiy studiya (16.11) — bloklarni bosib qo'shish/olib tashlash, «Ishga tushir», qahramon yuradi/sakraydi/gapiradi =====
// sahifa.mjs shu faylni demo.html ichidagi skriptga qo'shadi. Umumiy o'zgaruvchilar (QADAM, qadam, ichki, chiz, bolaKeyingi, PAL_HTML) o'sha skriptda.
const KUT = (ms) => new Promise((r) => setTimeout(r, ms))
const ATLAR = (q) => { for (let i = 0; i < 8; i++) if (q.classList.contains('at' + i)) return i; return 0 }
// 3b (19.11): qaysi ekranda qaysi ish, qanday topshiriq va shu ekranga xos gaplar — DARS.studiya (darslar/<dars>/dars.mjs).
// Bu faylda — ishlarning o'zi va ularning umumiy gaplari. GAPT: [jonli, solo] juftligidan rejimga mosi.
const TOP = (id) => (DARS.studiya && DARS.studiya[id]) || {}
const GAPT = (g) => Array.isArray(g) ? (typeof SOLO !== 'undefined' && SOLO ? g[1] : g[0]) : g
function atQoy(q, at) { for (let i = 0; i < 8; i++) q.classList.remove('at' + i); if (at) q.classList.add('at' + at) }
// Qahramonni yangi zonachaga silliq sakratib o'tkazish (FLIP)
function kochir(q, at) {
  const s = q.firstElementChild; if (!s) return
  const r1 = s.getBoundingClientRect(); atQoy(q, at); const r2 = s.getBoundingClientRect()
  const dx = r1.left - r2.left
  if (Math.abs(dx) > 1 && s.animate) s.animate([{ transform: 'translate(' + dx + 'px,0)' }, { transform: 'translate(' + dx / 2 + 'px,' + (-r2.height * 0.32) + 'px)' }, { transform: 'none' }], { duration: 520, easing: 'ease-in-out' })
}
function sakra(q) { const s = q.firstElementChild; if (s && s.animate) s.animate([{ transform: 'none' }, { transform: 'translateY(-38%)' }, { transform: 'none' }], { duration: 520, easing: 'ease-in-out' }) }
function silkit(q) { const s = q.firstElementChild; if (s && s.animate) s.animate([{ transform: 'none' }, { transform: 'translateX(-6%) rotate(-6deg)' }, { transform: 'translateX(6%) rotate(6deg)' }, { transform: 'none' }], { duration: 420 }) }
// erkin sahna (o'z sahnangiz): zonachalar yo'q — qahramon gorizontal suriladi
function suril(q, qadamlar) { const o = q.closest('.oyna'), w = o ? o.getBoundingClientRect().width : 600; const t = q.parentNode && q.parentNode.classList.contains('c1') ? q.parentNode : q; t.style.transition = 'transform .5s ease-in-out'; t.style.transform = 'translateX(' + Math.round(qadamlar * w * 0.11) + 'px)' }
function pufak(oyna, q, matn) {
  oyna.querySelectorAll('.dv-pufak').forEach((x) => x.remove())
  if (!matn) return
  const o = oyna.getBoundingClientRect(), r = (q.firstElementChild || q).getBoundingClientRect()
  const p = document.createElement('span'); p.className = 'gl gap-p dv-pufak'; p.textContent = matn
  p.style.left = Math.max(2, Math.min(70, (r.left + r.width * 0.55 - o.left) / o.width * 100)) + '%'
  p.style.top = 'auto'; p.style.bottom = Math.min(80, (o.bottom - r.top) / o.height * 100 + 2) + '%'; p.style.right = 'auto'; p.style.transform = 'none'
  oyna.appendChild(p)
  const pr = p.getBoundingClientRect(); if (pr.right > o.right - 8) p.style.left = Math.max(1, (o.right - 8 - pr.width - o.left) / o.width * 100) + '%'
}
function bloklar(st) { const r = typeof blBloklar === 'function' && blBloklar(st); return r || Array.from(st.querySelectorAll('.dst .mb')) }
function blokTuri(mb) { if (mb && mb.dataset && mb.dataset.tur) return mb.dataset.tur; const t = (mb.querySelector('span') || {}).textContent || ''; if (t.indexOf('if path') >= 0) return 'a'; if (t.indexOf('switch costume') >= 0) return 'v'; if (t.indexOf('play sound') >= 0) return 'n'; return t.indexOf('right') >= 0 ? 'r' : t.indexOf('left') >= 0 ? 'l' : t.indexOf('jump') >= 0 ? 'j' : t.indexOf('move up') >= 0 ? 'u' : t.indexOf('move down') >= 0 ? 'd' : t.indexOf('go to') >= 0 ? 'x' : t.indexOf('when') >= 0 ? 'k' : t.indexOf('repeat') >= 0 ? 'p' : 's' }
// 5a: dastur to'xtagan blokning belgisi (ijrochi.js, «urildi») — dastur o'zgarsa yoki qayta ishga tushirilsa ketadi
function urildiOl(ek) { ek.querySelectorAll('.mb.urildi').forEach((x) => x.classList.remove('urildi')) }
function sanoq(st) { muammoOl(st); urildiOl(st); const n = bloklar(st).length, s = st.querySelector('.dsn'); if (s) s.textContent = typeof BL_DASTURCHA === 'function' && BL_DASTURCHA(st) && typeof blDasturchalar === 'function' ? blDasturchalar(st).length + ' ta dasturcha' + (DARS.dasturchaBlok ? '\n' + n + ' / ' + (TOP(st.dataset.id).chegara || DARS.blokChegara) + ' ta blok' : '') : TOP(st.dataset.id).chegara ? n + ' / ' + TOP(st.dataset.id).chegara + ' ta blok' : n + ' ta blok'; if (typeof ozgKorinsin === 'function') ozgKorinsin(st); const jb = st.querySelector('.jr-bl'); if (jb) { jb.classList.toggle('bosh-bor', !n); if (typeof blSigdir === 'function') blSigdir(st); shartYangila(st); return } if (!n) { const w = st.querySelector('.dst .mbw'); if (w) w.remove(); if (!st.querySelector('.dst .bosh')) st.querySelector('.dst .dsb').insertAdjacentHTML('afterend', '<span class="bosh">Blokni shu yerga ulang</span>') } shartYangila(st) }
function ishora(st, matn) { const h = st.querySelector('.hn .hint'); if (h) h.textContent = matn }
// Muammocha (qaror 1-B, 18.11; etalon B3, 73-qaror): xato chiqqanda sahnada chiqadi — pufagida faqat bitta gap; «Maslahat» yonadi.
// Kamvoy — yetmadi, Ortiqvoy — ortiqcha, Bo'shvoy — bo'sh. Qahramon chapda bo'lsa — muammocha o'ng tomonda (uni yopmaydi).
function muammo(ek, kim, gap) {
  muammoOl(ek)
  const o = ek.querySelector('.oyna'); if (!o || typeof MUAM_SVG === 'undefined' || !MUAM_SVG[kim]) return
  const q = o.querySelector('.yol .q') || o.querySelector('.katak .kt-q'), or = o.getBoundingClientRect(), qr = q && (q.firstElementChild || q).getBoundingClientRect()
  const ong = qr && or.width && (qr.left + qr.width / 2 - or.left) / or.width < 0.45
  // labirint butun oynani egallaydi — muammocha burchakda: avval buta (devor) turgan burchaklar, ulardan qahramondan uzoqrog'i — yo'l va oltin iz
  // ochiq qoladi (5c, 2b-A, 20.11); buta burchagi bo'lmasa — qahramonga teskari burchak (avvalgidek)
  let kat = '', kOng = ong
  const kt = o.querySelector('.katak')
  if (kt && qr && or.height) {
    const xr = katakXarita(kt.dataset.xarita), H = xr.length, W = Math.max(...xr.map((r) => r.length)), qx = (qr.left + qr.width / 2 - or.left) / or.width, qy = (qr.top + qr.height / 2 - or.top) / or.height
    const bur = [[0, 0, xr[0][0]], [1, 0, xr[0][W - 1]], [0, 1, xr[H - 1][0]], [1, 1, xr[H - 1][W - 1]]].filter((c) => c[2] === '#').sort((a, c) => Math.hypot(c[0] - qx, c[1] - qy) - Math.hypot(a[0] - qx, a[1] - qy))
    const [bx, by] = bur.length ? bur[0] : [qx < 0.45 ? 1 : 0, qy < 0.5 ? 1 : 0]
    kat = ' kt-m ' + (by ? 'k-past' : 'k-tepa'); kOng = !!bx
  }
  const d = document.createElement('div'); d.className = 'muam dv-muam m-' + kim + (kOng ? ' o-ng' : '') + kat
  d.innerHTML = '<span class="mk">' + MUAM_SVG[kim] + '</span><span class="gl pufak"><b></b></span>'; d.querySelector('b').textContent = gap
  o.appendChild(d)
  const m = ek.querySelector('.hn .mas:not(.ishga)'); if (m) m.classList.add('yon')
}
function muammoOl(ek) { ek.querySelectorAll('.dv-muam').forEach((x) => x.remove()); const m = ek.querySelector('.hn .mas.yon:not(.ishga)'); if (m) m.classList.remove('yon') }
// Har topshiriqning boshlang'ich holati (bosh) — DARS.studiya[id].bosh; maydonlari dars.mjs da izohlangan
// ustoz ekranidagi sarlavha va izohni almashtirish (natija ko'rsatilguncha javob aytilmaydi)
function sarlavha(ek, h, iz) { const s = ek.querySelector('.ust .sar'); if (s) s.innerHTML = h; let z = ek.querySelector('.ust .iz'); if (!z && iz) { ek.querySelector('.ust').insertAdjacentHTML('beforeend', '<span class="iz"></span>'); z = ek.querySelector('.ust .iz') } if (z) z.textContent = iz || '' }
// bola ekranidan ustozga xabar (ustoz «yonma» rejimida — to'g'ridan-to'g'ri)
function bildirB(ek, m) { const ildiz = ek && ek.parentNode && ek.parentNode.closest('#ust,#bol'); if (ildiz && ildiz.id === 'bol' && typeof bildir === 'function') bildir(m) }
function studiyaTayyorla(ildiz) {
  if (!ildiz) return
  const ek = ildiz.querySelector('.ekran'); if (!ek) return
  const id = ek.dataset.id
  if (ildiz.id === 'ust') { const fo = ek.querySelector('.hn'); if (fo && !fo.querySelector('.orq') && !fo.querySelector('.k-ust')) { const a = fo.querySelector('.asos'); if (a) { a.className = 'mas ishga'; a.textContent = '▶ Ishga tushir' } fo.insertAdjacentHTML('beforeend', '<span class="asos k-ust">Keyingi ›</span>') } }
  const t = TOP(id)
  if (t.ish === 'uchBosish') return uchBosish(ek, true)
  if (t.ish === 'rang') { ek.querySelectorAll('.rd').forEach((r) => r.classList.remove('ok', 'puls', 'on')); const h = ek.querySelector('.rd.f-h'); if (h) h.classList.add('on', 'puls'); ek.querySelector('.ishora') && (ek.querySelector('.ishora').lastChild.textContent = 'Ko‘k doirachani bosing'); ishora(ek, 'Ikkala rangni bosing · 0 / 2') }
  if (t.ish === 'ism') return ismTayyorla(ek)
  if (t.ish === 'huk') return hukTayyorla(ek)
  if (t.ish === 'raqam') return raqamTayyorla(ek)
  if (t.ish === 'katakBos') return katakBosTayyorla(ek)
  if (t.ish === 'sahnaOyin') return sahnaOyinTayyorla(ek, ildiz)
  if (t.ish === 'oyinKarta') return oyinKarta(ek) // 10-dars
  if (t.dunyo) dunyoQoy(ek)
  if (t.ish === 'takror') return takrorla(ek)
  if (t.ish === 'natija') return natijaYoz(ek)
  if (t.ish === 'sudrash') return sudrashTayyorla(ek)
  const b = t.bosh; if (!b) return
  if (b.korish) { ek.dataset.korish = '1'; return }
  ek.dataset.qurish = '1'
  if (t.tur === 'namoyish') { sarlavha(ek, t.gap.sarlavha, ''); ishora(ek, GAPT(t.gap.boshla)) }
  ek.querySelectorAll('.olma-z').forEach((o) => o.classList.remove('olindi'))
  const tox = ek.querySelector('.y-tox'); if (tox) { ek.dataset.tox = tox.outerHTML; tox.remove() }
  if (b.sana) yuzSon(ek, 0)
  if (b.q) { const r = ek.querySelector(b.q); if (r) { r.style.transition = 'none'; r.style.transform = 'none' } }
  const fo = ek.querySelector('.hn'); if (fo && fo.querySelector('.orq') && !fo.querySelector('.ishga')) fo.querySelector('.asos').insertAdjacentHTML('beforebegin', '<span class="mas ishga">▶ Ishga tushir</span>')
  // 5b-2: prog [jonli, solo] juftligi ham bo'ladi (2-dars: ustoz ko'rsatadigan ekranda ustoz dasturni o'zi tuzadi, solo'da bola tayyor dasturni ishga tushiradi)
  if (GAPT(b.prog) === 0) { const w = ek.querySelector('.dst .mbw'); if (w) w.remove(); sanoq(ek) }
  if (t.tur === 'gap') { const inp = ek.querySelector('.dst .mb .inp'); if (inp) inp.textContent = DARS.gapStandart; const iz = ek.querySelector('.tahrir-iz'); if (iz) iz.remove() }
  if (t.tur === 'sahna') { ek.querySelectorAll('.dv-pufak,.gap-p,.yrl.tayyor').forEach((x) => x.remove()); shartYangila(ek) }
  const q = ek.querySelector(b.q || '.oyna .yol .q'); if (q && !b.erkin) atQoy(q, b.at); if (q && b.erkin && !b.q) suril(q, 0)
  if (sahnaTuri(b) === 'katak') katakAsl(ek)
  ek.querySelectorAll('.yoy path').forEach((p) => p.classList.remove('otdi'))
  ek.querySelectorAll('.oyna .gap-p:not(.dv-pufak)').forEach((x) => x.remove())
  ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  // 3-dars «oldindan ayting»: dastur tayyor va o'zgarmaydi (HTML bloklar, Blockly'siz), bola katakni bosib bayroqcha qo'yadi
  // 6-dars (KOD 1): DARS.maslahatKeyin — o'quvchi pog'onasida «Maslahat» qulf bilan; birinchi «▶ Ishga tushir»dan keyin ochiladi (ishgaTushir)
  if (DARS.maslahatKeyin && ildiz.id === 'bol' && TOP(id).maslahat) { const m = ek.querySelector('.hn .mas:not(.ishga)'); if (m) { ek.dataset.maslahatQulf = '1'; m.classList.add('qulf'); m.insertAdjacentHTML('beforeend', '<svg class="mas-qulf" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7.5" rx="1.6" fill="currentColor"/><path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.6 0V7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>') } }
  if (b.bashorat) return bashoratTayyorla(ek)
  // 8-dars: .solo-faqat — tayyor dasturning faqat solo'dagi qismi (jonli darsda ustoz o'zi qo'shadi)
  if (!(typeof SOLO !== 'undefined' && SOLO)) ek.querySelectorAll('.dst .solo-faqat').forEach((x) => x.remove())
  if (typeof blTayyorla === 'function' && ek.querySelector('.dst')) blTayyorla(ek)
  if (b.sonBashorat) { const bq = ek.querySelector('.dst .bq-q'); if (bq) bq.remove(); return sonBashTayyorla(ek) } // 11-dars
  if (b.olmaDastur) { olmaTayyorla(ek); const bq = ek.querySelector('.dst .bq-q'), dsb = ek.querySelector('.dst .dsb'); if (bq && dsb && dsb.nextElementSibling !== bq) dsb.after(bq) } // 13-dars
  // 4-dars: o'yin — dastur tugmani kutadi («▶ Boshlash»)
  if (b.oyin) oyinTayyorla(ek)
  // 5-dars: qisqartirish ko'rsatish (ustoz «Keyingi»: juftliklar, keyin qisqa dastur)
  if (t.qisqa) ek.dataset.qisqa = '0'
}
// O'z sahnangiz shartlari: joy · kamida 2 ta harakat bloki · o'z gapi · ★ jump
function shartYangila(ek) {
  const top = ek && TOP(ek.dataset.id); if (!top || top.tur !== 'sahna') return
  const bl = bloklar(ek), tur = bl.map(blokTuri)
  const harakat = tur.filter((t) => t !== 's').length >= top.harakat
  const gap = bl.some((mb) => blokTuri(mb) === 's' && blokMatn(mb) && blokMatn(mb) !== DARS.gapStandart)
  const ok = { joy: true, blok: harakat, gap, jump: tur.indexOf('j') >= 0 }
  ek.querySelectorAll('.sh-r').forEach((r) => { const k = (r.className.match(/sh-(joy|blok|gap|jump)/) || [])[1]; if (!k) return; r.classList.toggle('ok', !!ok[k]); const b = r.querySelector('b'); if (ok[k] && !b) r.insertAdjacentHTML('beforeend', '<b>✓</b>'); if (!ok[k] && b) b.remove() })
  return ok
}
function maslahatOch(ek) { if (!ek.dataset.maslahatQulf) return; delete ek.dataset.maslahatQulf; const m = ek.querySelector('.hn .mas.qulf'); if (m) { m.classList.remove('qulf'); m.querySelectorAll('.mas-qulf').forEach((x) => x.remove()) } }
async function ishgaTushir(ek) {
  if (ek.dataset.yuryapti) return
  { const b0 = TOP(ek.dataset.id).bosh; if (b0 && b0.olmaDastur && !b0.oyin) return olmaIshga(ek) } // 13-dars: olma dasturi
  maslahatOch(ek)
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  urildiOl(ek)
  const id = ek.dataset.id, b = TOP(id).bosh || { at: 0 }, oyna = ek.querySelector('.oyna'), q = ek.querySelector(b.q || '.oyna .yol .q')
  // 4b: dastur — daraxt (ijrochi.js), bajarish — ijro(); bu yerda faqat har blokning ishi
  const dastur = dasturDaraxti(ek), bl = [...ijroTartibi(dastur)].map((t) => t.el)
  // 5-dars: ichi bo'sh takrorlash — hech narsa takrorlanmaydi
  if (typeof blIchiBosh === 'function' && blIchiBosh(ek)) { ishora(ek, 'repeat ichiga blok qo‘ying'); chal('muammo'); muammo(ek, 'boshvoy', 'Ichi bo‘sh-ku…'); return }
  if (typeof blShartBosh === 'function' && blShartBosh(ek)) { ishora(ek, 'if ichiga blok qo‘ying — yo‘l bo‘lsa, u bajariladi'); chal('muammo'); muammo(ek, 'boshvoy', 'Ichi bo‘sh-ku…'); return }
  if (!bl.length) { ishora(ek, 'Avval blokni bosing — u dasturga qo‘shiladi'); if (TOP(id).bosh && !TOP(id).bosh.erkin) { chal('muammo'); muammo(ek, 'boshvoy', 'Bu yerda hech narsa yo‘q-ku…') } return }
  ek.dataset.yuryapti = '1'
  // boshlang'ich holatga qaytaramiz (hamma sahnada bir xil); qolgani — sahnaning o'zida (sahna.js, 4c)
  pufak(oyna, q, ''); muammoOl(ek); const tx = ek.querySelector('.y-tox'); if (tx) tx.remove(); ek.querySelectorAll('.konfeti').forEach((x) => x.remove())
  egizAlmash(ek, 1)
  const sahna = SAHNA[sahnaTuri(b)], h = await sahna.boshla(ek, b)
  ishora(ek, 'Dastur ishlayapti…')
  await ijro(dastur, (tugun) => sahna.bajar(h, tugun))
  // 8-dars: egizak labirint (bosh.egiz) — dastur bitta: avval 1-labirintda, yetsa — 2-labirintda; har biri yonida ✓ / ✕
  if (b.egiz && ek.querySelector('.katak[data-egiz="2"]')) {
    const bh1 = sahna.baho(h, b, bl); egizBelgi(ek, 1, bh1.tur === 'yetdi')
    if (bh1.tur === 'yetdi') {
      await KUT(700); egizAlmash(ek, 2)
      const h2 = await sahna.boshla(ek, b); h2.egizN = 2
      await ijro(dastur, (tugun) => sahna.bajar(h2, tugun))
      egizBelgi(ek, 2, sahna.baho(h2, b, bl).tur === 'yetdi')
      delete ek.dataset.yuryapti; natija(ek, id, h2, bl); return
    }
    h.egizN = 1
  }
  delete ek.dataset.yuryapti
  natija(ek, id, h, bl)
}
// egizak labirint: ikkalasi ko'rinadi (.egiz — ko'rinish tartibi CSS order bilan); faol labirint DOM'da birinchi turadi — sahna uni oladi;
// har labirint burchagida yorliq «1» / «2» va natija ✓ / ✕ (yangi ishga tushirishda tozalanadi)
function egizAlmash(ek, n) {
  const k = ek.querySelector('.katak[data-egiz="' + n + '"]'); if (!k) return
  k.parentNode.insertBefore(k, k.parentNode.firstChild)
  ek.querySelectorAll('.katak[data-egiz]').forEach((x) => x.classList.toggle('faol', x === k))
  if (n === 1) ek.querySelectorAll('.katak[data-egiz] .egiz-n').forEach((x) => x.classList.remove('ok', 'yoq'))
}
function egizBelgi(ek, n, ok) { const x = ek.querySelector('.katak[data-egiz="' + n + '"] .egiz-n'); if (x) { x.classList.toggle('ok', ok); x.classList.toggle('yoq', !ok) } }
function natija(ek, id, h, bl) {
  const ildiz = ek.parentNode.closest('#ust,#bol')
  const bola = ildiz && ildiz.id === 'bol'
  const t = TOP(id), b = t.bosh || {}, g = t.gap || {}
  if (t.tur === 'korish') { ishora(ek, GAPT(g.yetdi)); konfeti(ek); return }
  if (t.tur === 'yol') {
    const bh = SAHNA[sahnaTuri(b)].baho(h, b, bl)
    if (bh.maydon) return maydonNatija(ek, id, h, bh, bl, bola)
    // 5a, labirint: devorga urildi (To'siqvoy, 96-qaror) · yopiq eshikka keldi, kalit yo'q (Kamvoy)
    // 8-dars: shart darsida To'siqvoyning ikki gapi (urilgan blokning ota shart bloki va tomoni bo'yicha), «N-labirint» bilan
    const nL = h.egizN ? h.egizN + '-labirint' : ''
    if (bh.tur === 'urildi' && b.shartGap) { const ota = typeof blOtaShart === 'function' && blOtaShart(h.urildi && h.urildi.el); chal('muammo'); ishora(ek, (nL ? nL + ': ' : '') + (ota ? 'shart bir tomonni tekshirdi, blok boshqa tomonga yurdi' : 'bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring')); muammo(ek, 'tosiqvoy', 'Devor!'); return }
    if (bh.tur === 'kam' && b.shartGap) { chal('muammo'); ishora(ek, (g.kam && GAPT(g.kam)) || (nL ? nL + 'da' : 'Labirintda') + ' yulduzgacha yetmadi. repeat soni va shart tomonini tekshiring'); muammo(ek, 'kamvoy', 'Oz qoldi!'); return }
    // 8-dars 15 · ★: erkin sayr (yulduzsiz) — kamida ikki shart har xil tomonga, urilmadi, kamida 4 qadam
    if (bh.tur === 'kamShart') { chal('muammo'); ishora(ek, 'Ikki if qo‘ying — har xil tomonga'); muammo(ek, 'kamvoy', 'Oz qoldi!'); return }
    if (bh.tur === 'kamYurdi') { chal('muammo'); ishora(ek, 'Qahramon kam yurdi. Boshqa tomonlarni tekshiring'); muammo(ek, 'kamvoy', 'Oz qoldi!'); return }
    if (bh.tur === 'urildi') { chal('muammo'); ishora(ek, g.urildi ? GAPT(g.urildi) : 'Qahramon shu blokda to‘xtadi. Bu yerda qaysi tomonga yurish kerak?'); muammo(ek, 'tosiqvoy', 'Devor!'); return }
    if (bh.tur === 'eshik') { chal('muammo'); ishora(ek, g.eshik ? GAPT(g.eshik) : 'Eshik yopiq. Avval kalitni oling'); muammo(ek, 'kamvoy', 'Kalit qani?'); return }
    if (bh.tur === 'olmasiz') { ishora(ek, 'Avval olmani oling — u ' + b.olma + '-zonachada'); chal('muammo'); muammo(ek, 'kamvoy', 'Olma qoldi-ku!'); return }
    if (bh.tur === 'aniqEmas') { chal('muammo'); ishora(ek, 'Yo‘l to‘g‘ri, lekin ' + bh.n + ' ta blok — ' + bh.kerak + ' ta bo‘lishi kerak'); muammo(ek, bh.n > bh.kerak ? 'ortiqvoy' : 'kamvoy', bh.n > bh.kerak ? 'Ko‘payib ketdi!' : 'Oz qoldi!'); return }
    if (bh.tur === 'yetdi' || bh.tur === 'tayyor') {
      ishora(ek, g.yetdi ? GAPT(g.yetdi) : bh.olmaKerak ? 'Zo‘r! Olma ham, yulduz ham!' : 'Yetib bordi!')
      konfeti(ek)
      if (bola) {
        if (typeof blokQosh === 'function') blokQosh(id, [...bl, ...labirintBelgi(h, b)])
        if (typeof oxirgiSaqla === 'function') oxirgiSaqla(ek)
        if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
        setTimeout(() => { if (t.keyin) { ichki = QADAM[qadam][2].indexOf(t.keyin); chiz() } else bolaKeyingi() }, 1400)
      }
    } else {
      chal('muammo')
      if (bh.tur === 'kam') { ishora(ek, g.kam ? GAPT(g.kam) : sahnaTuri(b) === 'katak' ? 'Oz qoldi! Yana blok qo‘shing' : 'Oz qoldi! Yana bitta blok qo‘shing'); muammo(ek, 'kamvoy', bh.teskari ? 'Yulduz boshqa tomonda!' : 'Oz qoldi!') }
      else { ishora(ek, 'Bir qadam ortiqcha! Ortiqcha blokni bosing, keyin ✕'); muammo(ek, 'ortiqvoy', 'Ko‘payib ketdi!') }
    }
    return
  }
  if (t.tur === 'namoyish') {
    const n = bl.length, p = h.p, yulduz = h.yulduz
    if (p > yulduz) {
      if (ek.dataset.tox) ek.querySelector('.oyna').insertAdjacentHTML('beforeend', ek.dataset.tox)
      sarlavha(ek, n + ' ta blok — <em>' + n + ' qadam</em>', g.ortiq)
      ishora(ek, GAPT(g.ortiqIshora))
      if (ildiz && ildiz.id === 'ust' && typeof ochil === 'function') ochil()
    } else if (p === yulduz) { sarlavha(ek, n + ' ta blok — <em>' + n + ' qadam</em>', g.teng); ishora(ek, 'Yetib bordi!'); konfeti(ek) }
    else { sarlavha(ek, n + ' ta blok — <em>' + n + ' qadam</em>', g.kam); ishora(ek, 'Oz qoldi — yana blok qo‘shing') }
    return
  }
  if (t.tur === 'izoh') { ishora(ek, g.matn); return }
  if (t.tur === 'gap') {
    const sb = bl.find((x) => blokTuri(x) === 's'), m = sb ? blokMatn(sb) : ''
    if (!m || m === DARS.gapStandart) { ishora(ek, sb ? 'Yozuvni bosib, o‘zingiz yozing — keyin yana ishga tushiring' : 'Binafsha say blokini qo‘shing'); chal('muammo'); muammo(ek, !sb ? 'kamvoy' : !m ? 'boshvoy' : 'kamvoy', !sb ? 'Yurdi, lekin jim…' : !m ? 'Hech narsa demadi…' : 'Hali ham «' + DARS.gapStandart + '» deyapti'); return }
    ishora(ek, 'Qahramoningiz gapirdi!')
    if (bola) { if (typeof blokQosh === 'function') blokQosh(id, bl); setTimeout(bolaKeyingi, 1800) }
    return
  }
  if (t.tur === 'sahna') {
    if (typeof qDasturSaqla === 'function') qDasturSaqla(bl.map((mb) => ({ t: blokTuri(mb), m: blokMatn(mb) })))
    const ok = shartYangila(ek)
    if (ok && ok.blok && ok.gap) {
      ishora(ek, 'Sahna tayyor! Yana o‘zgartirsangiz bo‘ladi'); if (!ek.querySelector('.yrl.tayyor')) ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl yrl tayyor">✓ Sahna tayyor!</span>')
      if (bola) { if (typeof blokQosh === 'function') blokQosh(id, bl); if (typeof tayyorBildir === 'function') tayyorBildir() }
    }
    else ishora(ek, !ok.blok ? 'Yana harakat bloki kerak (kamida ' + t.harakat + ' ta)' : 'Binafsha blokka o‘zingiz gap yozing')
  }
}
// 3-sinov: ustoz move right blokini bosadi — har bosishda Coddy bitta zonachaga sakraydi
function uchBosish(ek, boshla) {
  const q = ek.querySelector('.oyna .yol .q'), qator = ek.querySelector('.sin3'), yozuv = qator && qator.querySelector('.tf-t span')
  if (!q || !qator) return
  if (boshla) { atQoy(q, 0); ek.querySelectorAll('.yoy path').forEach((p) => p.classList.remove('otdi')); ek.dataset.bosish = '0'; if (yozuv) yozuv.textContent = 'Blokni bosing · 0 / 3'; return }
  let k = +(ek.dataset.bosish || 0); if (k >= 3) return
  const mb = qator.querySelector('.mb'); if (mb && mb.animate) mb.animate([{ transform: 'scale(1)' }, { transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: 220 })
  const yo = ek.querySelectorAll('.yoy path')[k]; k++; ek.dataset.bosish = k; kochir(q, k); chal(k < 3 ? 'qadam' : 'yulduz'); if (yo) yo.classList.add('otdi')
  if (yozuv) yozuv.textContent = k < 3 ? 'Blokni bosing · ' + k + ' / 3' : 'Yulduzga yetdi! · 3 / 3'
}
// 5b-1: huk — dastur kartalari (2-dars, «Uch sinov»): har kartada kichik dastur (.jk ichidagi bloklar). Ustoz asosiy tugmani bosadi — navbatdagi
// karta katta labirintda (katak sahnasi) sinaladi: karta kattalashadi, bloklari birma-bir yonadi, natija kartaning o'zida (gap.yetdi / gap.urildi /
// gap.kam). Hamma karta sinalgach asosiy tugma odatdagidek keyingi qadamga o'tadi. Solo: har kartada «▶ Sinab ko‘rish» (gap.sinab) — bola o'zi.
function hukTayyorla(ek) {
  ek.dataset.huk = '0'; delete ek.dataset.yuryapti; katakAsl(ek)
  ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  const g = TOP(ek.dataset.id).gap || {}, solo = typeof SOLO !== 'undefined' && SOLO
  ek.querySelectorAll('.jk').forEach((k) => {
    k.classList.remove('sinov', 'n-ok', 'n-yoq'); k.querySelectorAll('.jn,.hk-sinab').forEach((x) => x.remove())
    if (solo && g.sinab) (k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<span class="hk-sinab" role="button">' + g.sinab + '</span>')
  })
  // gap.avto — ustoz ekranida birinchi karta o'zi boshlanadi (oldingi qadamdagi «Sinab ko‘ramiz ›» bosilgani — shu)
  const ust = ek.parentNode && ek.parentNode.closest('#ust')
  if (g.avto && ust && !solo) setTimeout(() => { if (document.body.contains(ek) && ek.dataset.huk === '0') hukSina(ek, 0) }, 700)
}
function hukBosish(e, ek, ildiz) {
  const kartalar = Array.from(ek.querySelectorAll('.jk'))
  const sb = e.target.closest('.hk-sinab'); if (sb) { hukSina(ek, kartalar.indexOf(sb.closest('.jk'))); return true }
  if (ildiz.id !== 'ust' || (typeof SOLO !== 'undefined' && SOLO) || !e.target.closest('.hn .asos')) return false
  if (ek.dataset.yuryapti) return true
  const i = +(ek.dataset.huk || 0); if (i >= kartalar.length) return false
  hukSina(ek, i); return true
}
async function hukSina(ek, i) {
  const k = ek.querySelectorAll('.jk')[i]; if (!k || ek.dataset.yuryapti || ek.dataset.oyin) return
  // 4-dars: karta yulduzni ko'chiradi (data-yulduz); C kartasi — o'yin (data-oyin: strelkalar bilan, ustoz yoki solo'da bola bosadi)
  if (k.dataset.yulduz) { const [x, y] = k.dataset.yulduz.split(',').map(Number); mdYulduzQoy(ek, x, y) }
  if (k.dataset.oyin) return hukOyin(ek, k, i)
  if (k.dataset.avto) return hukAvto(ek, k, i)
  if (k.dataset.olma || k.dataset.tanlov) return hukOlma(ek, k, i) // 13-dars
  const g = TOP(ek.dataset.id).gap || {}
  ek.dataset.yuryapti = '1'
  ek.querySelectorAll('.jk').forEach((x) => x.classList.toggle('sinov', x === k)); ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  k.classList.remove('n-ok', 'n-yoq'); k.querySelectorAll('.jn').forEach((x) => x.remove()); urildiOl(k)
  let ok, bh = {}
  if (k.dataset.yon) {
    // 3-dars: xat aniq emas — maydonda bir nechta katak birin-ketin yonadi (qahramon joyida qoladi)
    katakAsl(ek); const kt = ek.querySelector('.katak'), xr = katakXarita(kt.dataset.xarita)
    for (const p of k.dataset.yon.split(';')) { const [x, y] = p.split(',').map(Number), c = kt.querySelector('.kt-c[data-k="' + x + ',' + (xr.length - 1 - y) + '"]'); if (c) c.classList.add('yonk'); chal('qadam'); await KUT(420) }
    const q = kt.querySelector('.kt-q'); if (q) pufak(ek.querySelector('.oyna'), q, 'Qaysi biri?')
    ok = false
  } else {
    // data-dastur: «rrrruu» yoki go to bilan «x6,0» (5-dars huk B) — har belgi bitta blok
    const els = k.dataset.dastur ? (k.dataset.dastur.match(/x\d+,\d+|c(?:xo|xu|ha|oy)|[rludw]/g) || []).map((t) => { const x = document.createElement('span'); x.dataset.tur = t[0] === 'c' ? 'v' : t[0]; if (t[0] === 'x') { const [a, c] = t.slice(1).split(','); x.dataset.x = a; x.dataset.y = c } if (t[0] === 'c') x.dataset.q = { xo: 'xotirjam', xu: 'xursand', ha: 'hayron', oy: 'oylanadi' }[t.slice(1)]; return x }) : Array.from(k.querySelectorAll('.mb'))
    // 8-dars: data-daraxt — ichma-ich dastur (takrorlash, shart) JSON'da: [{ t: 'p', n, ichki }, { t: 'a', yon, ichki }, { t: 'r' }]
    const dq = (x) => ({ el: document.createElement('span'), tur: x.t, n: x.n || 0, yon: x.yon || '', ichki: (x.ichki || []).map(dq) })
    const daraxt = k.dataset.daraxt ? JSON.parse(k.dataset.daraxt).map(dq) : els.map((el) => ({ el, tur: blokTuri(el), ichki: [] }))
    egizAlmash(ek, 1)
    let h = await SAHNA.katak.boshla(ek, {}), qoch = hukQoch(k)
    let n = 0
    await ijro(daraxt, async (t) => { const r = await SAHNA.katak.bajar(h, t); n++; if (qoch && n === qoch.n) yulduzQoch(ek, h, qoch.x, qoch.y); return r })
    // egizak labirint: 1-labirintda yetsa — o'sha dastur 2-labirintda
    if (ek.querySelector('.katak[data-egiz="2"]')) {
      const b1 = SAHNA.katak.baho(h, {}); egizBelgi(ek, 1, b1.tur === 'yetdi')
      if (b1.tur === 'yetdi') { await KUT(500); egizAlmash(ek, 2); h = await SAHNA.katak.boshla(ek, {}); await ijro(daraxt, (t) => SAHNA.katak.bajar(h, t)); egizBelgi(ek, 2, SAHNA.katak.baho(h, {}).tur === 'yetdi') }
    }
    // 7-dars: kartada natija oldindan aytilgan (data-ok) — yulduzsiz huk
    bh = SAHNA.katak.baho(h); ok = k.dataset.ok ? k.dataset.ok === '1' : bh.tur === 'yetdi'
  }
  // natija chiqdi — «sinalyapti» hoshiyasi olinadi (5c, 2c-A, 20.11): karta endi faqat natijasini ko'rsatadi
  k.classList.remove('sinov'); k.classList.add(ok ? 'n-ok' : 'n-yoq')
  ;(k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<small class="jn">' + (k.dataset.nat || (ok ? g.yetdi : bh.tur === 'kam' ? g.kam : g.urildi)) + '</small>')
  if (ok) konfeti(ek)
  delete ek.dataset.yuryapti
  ek.dataset.huk = Math.max(+(ek.dataset.huk || 0), i + 1)
  const a = ek.querySelector('.hn .asos'); if (a && g.keyingi) a.textContent = g.keyingi
}
// 5b-2: raqamlar birma-bir yonadi (2-dars, «Yangi so'z: ketma-ketlik»): ekrandagi [data-r] belgilar (dastur bloki va labirint katagi — bir xil raqam).
// Ustoz ekranida asosiy tugma har bosishda navbatdagi raqamni yoqadi (blok va katak birga); hammasi yongach tugma odatdagidek keyingi qadamga o'tadi.
function raqamTayyorla(ek) { ek.dataset.raqam = '0'; ek.querySelectorAll('[data-r]').forEach((x) => x.classList.remove('on')) }
function raqamBosish(e, ek, ildiz) {
  if (ildiz.id !== 'ust' || !e.target.closest('.hn .asos')) return false
  const n = +(ek.dataset.raqam || 0), jami = Math.max(0, ...Array.from(ek.querySelectorAll('[data-r]')).map((x) => +x.dataset.r))
  if (n >= jami) return false
  ek.dataset.raqam = n + 1; ek.querySelectorAll('[data-r="' + (n + 1) + '"]').forEach((x) => x.classList.add('on')); chal('qadam')
  // [data-yur] (maydon katagi) — qahramon o'sha katakka haqiqatan bir sakraydi, yorlig'i yangilanadi
  ek.querySelectorAll('[data-r="' + (n + 1) + '"][data-yur]').forEach((x) => {
    const k = x.closest('.katak.maydon'), g = k && k.querySelector('.kt-q'); if (!g) return
    const [X, Y] = x.dataset.yur.split(',').map(Number), q = katakXarita(k.dataset.xarita).length - 1 - Y
    katakSur(g, X, q, true); mdYorliqQoy(k, X, q)
  })
  return true
}
// Studiya ichidagi bosishlar. true qaytarsa — bosish shu yerda ishlandi
function studiyaBosish(e) {
  const ildiz = e.target.closest('#ust,#bol'); if (!ildiz) return false
  const ek = ildiz.querySelector('.ekran'); if (!ek) return false
  const id = ek.dataset.id
  if (TOP(id).ish === 'uchBosish') { if (e.target.closest('.sin3')) { uchBosish(ek); return true } return false }
  if (TOP(id).ish === 'huk') return hukBosish(e, ek, ildiz)
  if (TOP(id).ish === 'raqam') return raqamBosish(e, ek, ildiz)
  if (TOP(id).ish === 'katakBos') return katakBosish(e, ek, ildiz)
  if (TOP(id).ish === 'sahnaOyin') return sahnaOyinBosish(e, ek, ildiz)
  if (TOP(id).bosh && TOP(id).bosh.bashorat) { const r = bashoratBosish(e, ek, ildiz); if (r != null) return r }
  if (TOP(id).bosh && TOP(id).bosh.yasash) { const r = yasashBosish(e, ek, ildiz); if (r != null) return r } // 10-dars: labirint yasash
  if (TOP(id).bosh && (TOP(id).bosh.ball || TOP(id).bosh.sonBashorat || TOP(id).bosh.olmaDastur)) { const r = ballBosish(e, ek, ildiz); if (r != null) return r } // 11-dars
  if (TOP(id).bosh && TOP(id).bosh.oyin) { const r = oyinBosish(e, ek); if (r != null) return r }
  // 5-dars, 14-qadam: ustoz «Keyingi» — 1) bir xil juftliklar hoshiyalanadi, 2) dastur qisqa ko'rinishga o'tadi; keyin odatdagidek keyingi qadam
  if (TOP(id).qisqa && ildiz.id === 'ust' && !(typeof SOLO !== 'undefined' && SOLO) && e.target.closest('.hn .asos') && !e.target.closest('.hn .ishga') && !ek.dataset.yuryapti) {
    const n = +(ek.dataset.qisqa || 0)
    if (n === 0) { bloklar(ek).forEach((el, i) => el.classList.add('bl-juft', 'bl-juft-' + (Math.floor(i / 2) % 2))); ishora(ek, 'Bir xil juftlik — ' + Math.floor(bloklar(ek).length / 2) + ' marta'); chal('qadam'); ek.dataset.qisqa = '1'; return true }
    if (n === 1 && typeof blQur === 'function') { blQur(ek, TOP(id).qisqa); sanoq(ek); katakAsl(ek); ishora(ek, 'Rasm o‘sha — bloklar kam'); chal('qadam'); ek.dataset.qisqa = '2'; return true }
  }
  // birinchi dastur — «Qayta ko'rish»: o'sha dastur yana o'ynaydi
  if (ek.dataset.korish && e.target.closest('.hn .mas')) { ishgaTushir(ek); return true }
  // ranglar: doiracha bosilsa — o'sha oila bloklari (Ranglar qadamida hali o'rgatilmagan bloklar yopiq)
  const rd = e.target.closest('.rg .rd')
  if (rd && ek.querySelector('.pl')) {
    const f = (rd.className.match(/\bf-(\w)\b/) || [])[1] || 'h' // oila: h, g (1-dars), e (4-dars: Hodisa)
    ek.querySelectorAll('.rg .rd').forEach((r) => r.classList.toggle('on', r === rd))
    rd.classList.remove('puls'); rd.classList.add('ok')
    const pl = ek.querySelector('.pl'); if (!pl.dataset.asl) pl.dataset.asl = (pl.querySelector('small') || {}).className || ''
    const yangiPal = (TOP(id).ish === 'rang' && typeof PAL_B1 !== 'undefined' && PAL_B1[f]) || (DARS.palQosh && DARS.palQosh[f]) || PAL_HTML[f] // 10-dars: palQosh — «Labirint» asboblari
    if ((pl.dataset.asl || '').indexOf('f-' + f) < 0 || pl.dataset.almashgan) { pl.querySelectorAll('.chek').forEach((x) => x.remove()); if (!pl.dataset.aslHtml) pl.dataset.aslHtml = pl.innerHTML; pl.innerHTML = (pl.dataset.asl.indexOf('f-' + f) >= 0) ? pl.dataset.aslHtml : yangiPal; pl.dataset.almashgan = '1'; if (((TOP(id).bosh || {}).chek)) chekChiz(ek); if (TOP(id).ochiq) ballJavon(ek); if (f === 'L') pl.querySelectorAll('.asb').forEach((x) => x.classList.toggle('on', x.dataset.t === (ek.dataset.asb || 'devor'))) }
    if (TOP(id).ish === 'rang') {
      const n = ek.querySelectorAll('.rg .rd.ok').length, ish = ek.querySelector('.ishora')
      if (f === 'h' && n < 2) { const g = ek.querySelector('.rd.f-g'); if (g) g.classList.add('puls'); if (ish) { ish.lastChild.textContent = 'Endi binafshani bosing'; ish.classList.add('g') } }
      if (n >= 2) { if (ish) ish.lastChild.textContent = 'Zo‘r!'; setTimeout(() => { const x = ek.querySelector('.xira'); if (x) x.remove(); if (ish) ish.remove() }, 1600) }
      ishora(ek, 'Ikkala rangni bosing · ' + Math.min(2, n) + ' / 2')
    }
    return true
  }
  if (!ek.dataset.qurish) return false
  if (e.target.closest('.jr-bl .bl-x')) { if (typeof blTanlovOchir === 'function') blTanlovOchir(ek); return true }
  if (e.target.closest('.jr-bl')) return true
  const inp = e.target.closest('.dst .mb .inp')
  if (inp) { inp.contentEditable = 'true'; inp.spellcheck = false; inp.focus(); const r = document.createRange(); r.selectNodeContents(inp); const s = getSelection(); s.removeAllRanges(); s.addRange(r); return true }
  const pmb = e.target.closest('.pl .mbw:not(.yopiq) .mb')
  if (pmb) {
    // 5-dars: tanlangan takrorlash bloki tanlovda qoladi — javondan bosilgan blok uning ichiga tushadi (blockly.js, blQosh)
    const tk = typeof blTanlov === 'function' && blTanlov(ek)
    if (typeof blTanlovOl === 'function' && !(tk && (tk.type === 'repeat' || tk.type === 'if_path' || tk.type === 'if_var' || (BL_HODISA.has(tk.type) && !BL_BOSH(blokTuri(pmb)))))) blTanlovOl(ek) // C-blok (takrorlash, shart) tanlovi qoladi — keyingi bloklar ichiga
    const chegara = TOP(id).chegara || DARS.blokChegara || 10
    if (bloklar(ek).length >= chegara) {
      // 5-dars: topshiriqning o'z chegarasi — Ortiqvoy «Joy qolmadi!» (takrorlashga ishora); 1–4-darsda avvalgidek faqat ishora
      if (TOP(id).chegara) { chal('muammo'); ishora(ek, (TOP(id).joyQolmadi || DARS.joyQolmadi) ? (TOP(id).joyQolmadi || DARS.joyQolmadi).replace('N', chegara) : 'Dasturga ' + chegara + ' ta blok sig‘adi. Takrorlanadigan bloklarni repeat ichiga qo‘ying'); muammo(ek, 'ortiqvoy', 'Joy qolmadi!') } else ishora(ek, 'Dastur to‘ldi — ' + chegara + ' ta blokdan ko‘p bo‘lmaydi')
      return true
    }
    chal('bos')
    // javon blokining sozlamasi ham o'tadi: takrorlash soni (data-n), hodisa tugmasi (data-tugma); gap — yozuvi
    const jt = blokTuri(pmb), jm = jt === 'p' ? pmb.dataset.n : jt === 'k' ? pmb.dataset.tugma : jt === 'v' || jt === 'n' ? pmb.dataset.q : jt === 'a' ? pmb.dataset.yon : jt === 'q' ? pmb.dataset.q : jt === 'z' || jt === 'c' ? pmb.dataset.n : jt === 'y' ? (pmb.dataset.x || '0') + ',' + (pmb.dataset.y || '0') : jt === 'm' ? (pmb.dataset.ra || '1') + '-' + (pmb.dataset.rb || '10') : ((pmb.querySelector('.inp') || {}).textContent || '').trim()
    if (ek.querySelector('.jr-bl')) { blQosh(ek, jt, jm); sanoq(ek); ishora(ek, TOP(id).maslahat ? 'Blok qo‘shildi. «Ishga tushir»ni bosing' : ''); return true }
    let w = ek.querySelector('.dst .mbw'); if (!w) { const bo = ek.querySelector('.dst .bosh'); if (bo) bo.remove(); ek.querySelector('.dst .dsb').insertAdjacentHTML('afterend', '<div class="mbw"></div>'); w = ek.querySelector('.dst .mbw') }
    const yangi = pmb.cloneNode(true); yangi.classList.remove('yangi', 'tushadi', 'qol', 'yon', 'hozir'); w.appendChild(yangi)
    if (yangi.animate) yangi.animate([{ opacity: 0, transform: 'translateY(-40%)' }, { opacity: 1, transform: 'none' }], { duration: 220 })
    sanoq(ek); ishora(ek, TOP(id).maslahat ? 'Blok qo‘shildi. «Ishga tushir»ni bosing' : ''); return true
  }
  const dmb = e.target.closest('.dst .mb')
  if (dmb && !ek.dataset.yuryapti) { chal('bos'); dmb.remove(); sanoq(ek); ishora(ek, 'Blok olib tashlandi'); return true }
  if (e.target.closest('.hn .ishga')) { ishgaTushir(ek); return true }
  if (e.target.closest('.hn .mas') && ek.dataset.maslahatQulf) { ishora(ek, 'Avval bir marta ishga tushiring'); return true }
  if (e.target.closest('.hn .mas')) { ishora(ek, TOP(id).maslahat || ''); bildirB(ek, { t: 'yordam', s: typeof qadam !== 'undefined' ? qadam : 0 }); return true }
  const asos = e.target.closest('.hn .asos'); if (asos && asos.textContent.indexOf('Ishga tushir') >= 0) { ishgaTushir(ek); return true }
  return false
}
document.addEventListener('input', (e) => { const inp = e.target.closest && e.target.closest('.dst .mb .inp'); if (!inp) return; if (inp.textContent.length > 30) inp.textContent = inp.textContent.slice(0, 30); muammoOl(inp.closest('.ekran')); shartYangila(inp.closest('.ekran')) })
document.addEventListener('keydown', (e) => { if (e.target.closest && e.target.closest('.dst .mb .inp') && e.key === 'Enter') { e.preventDefault(); e.target.blur() } }, true)

function konfeti(ek) { const o = ek.querySelector('.oyna'); if (!o) return; chal('yulduz'); o.querySelectorAll('.konfeti').forEach((x) => x.remove()); o.insertAdjacentHTML('beforeend', '<div class="konfeti">' + Array.from({ length: 16 }, (_, i) => '<i style="--x:' + (i * 37) % 100 + '%;--d:' + (i % 5) * 0.12 + 's;--r:' + (i * 47) % 360 + 'deg" class="k' + i % 4 + '"></i>').join('') + '</div>') }
// Coddy yuzidagi son (qadamlarni sanaydi)
function yuzSon(ek, n) { const t = ek.querySelector('.oyna .yol .q svg text'); if (t) t.textContent = n }
// Joy: bola tanlagan dunyo (hovli · kosmos · suv osti)
function dunyoQoy(ek) { const j = (typeof qJoy !== 'undefined' && qJoy) || ''; if (!j || !DUNYO_HTML[j]) return; const w = ek.querySelector('.oyna > svg.world'); if (w) w.outerHTML = DUNYO_HTML[j] }
// Ism va rang: ism yoziladi (12 harfgacha), «Ism tanlab ber», sakkiz rangdan biri — qahramonga darhol qo'llanadi
const ISMLAR = DARS.ismlar // «Ism tanlab ber» ro'yxati — dars e'lonida
function ismTayyorla(ek) {
  const s = ek.querySelector('.ism-i'); if (!s || s.querySelector('input')) return
  let nom = ''; Array.from(s.childNodes).forEach((n) => { if (n.nodeType === 3) { nom += n.textContent; n.remove() } })
  const k = s.querySelector('.kursor'); if (k) k.remove()
  s.insertAdjacentHTML('afterbegin', '<input class="ism-inp" maxlength="12" autocomplete="off" spellcheck="false">'); s.querySelector('input').value = nom.trim()
  ek.querySelectorAll('.rng i').forEach((i) => i.classList.remove('on'))
  ismYangila(ek)
}
function ismYangila(ek) { const v = (ek.querySelector('.ism-inp') || {}).value || ''; const t = ek.querySelector('.ism-tag'); if (t) t.textContent = v || '…'; const c = ek.querySelector('.ism-s'); if (c) c.textContent = v.length + ' / 12 harf'; if (typeof qismSaqla === 'function') qismSaqla(v.trim()) }
function ismBosish(e) {
  const ek = e.target.closest('.ekran'); if (!ek || TOP(ek.dataset.id).ish !== 'ism') return false
  if (e.target.closest('.ism-t')) { const inp = ek.querySelector('.ism-inp'); if (inp) { let y; do { y = ISMLAR[Math.floor(Math.random() * ISMLAR.length)] } while (y === inp.value && ISMLAR.length > 1); inp.value = y; ismYangila(ek) } return true }
  const r = e.target.closest('.rng i'); if (r) { ek.querySelectorAll('.rng i').forEach((i) => i.classList.toggle('on', i === r)); if (typeof qrangSaqla === 'function') qrangSaqla(Array.from(r.parentNode.children).indexOf(r)); return true }
  return false
}
document.addEventListener('input', (e) => { if (e.target.classList && e.target.classList.contains('ism-inp')) ismYangila(e.target.closest('.ekran')) })

// Ko'rgazma: bolaning o'z dasturi qayta-qayta o'ynaydi (ekran almashguncha)
async function takrorla(ek) {
  const d = (typeof qDastur !== 'undefined' && qDastur) || []; if (!d.length) return
  const q = ek.querySelector('.oyna .yol .q'), oyna = ek.querySelector('.oyna'); if (!q || !oyna) return
  oyna.querySelectorAll('.gap-p').forEach((x) => x.remove())
  await KUT(700)
  while (document.body.contains(ek)) {
    let p = 0; suril(q, 0); pufak(oyna, q, ''); await KUT(700)
    for (const b of d) {
      if (!document.body.contains(ek)) return
      if (b.t === 'r' || b.t === 'l') { p = Math.max(-4, Math.min(4, p + (b.t === 'r' ? 1 : -1))); suril(q, p) } else if (b.t === 'j') sakra(q); else pufak(oyna, q, b.m)
      await KUT(850)
    }
    await KUT(1800)
  }
}

// 2-sinov: Coddy'ni sichqoncha bilan haqiqatan sudrash mumkin — u biroz ergashadi, qo'yib yuborilsa joyiga qaytadi (yo'l bo'ylab yurmaydi)
function sudrashTayyorla(ek) {
  const q = ek.querySelector('.oyna .yol .q'), s = q && q.firstElementChild; if (!s) return
  let bosh = null
  const qayt = () => {
    if (!bosh) return
    const t = getComputedStyle(s).transform
    s.style.transform = ''; bosh = null
    if (s.animate) s.animate([{ transform: t === 'none' ? 'none' : t }, { transform: 'translate(0,-6%)' }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.3,1.5,.5,1)' })
    const jk = ek.querySelector('.jk.c2')
    if (jk && !jk.classList.contains('n-yoq')) { jk.classList.remove('sinov'); jk.classList.add('n-yoq'); const jt = jk.querySelector('.jt'); if (jt) jt.insertAdjacentHTML('beforeend', '<small class="jn">✕ qimirlamadi</small>') }
    ishora(ek, 'Coddy joyiga qaytdi — sichqoncha bilan ham bo‘lmadi')
  }
  s.addEventListener('pointerdown', (e) => { e.preventDefault(); bosh = { x: e.clientX, y: e.clientY }; s.setPointerCapture && s.setPointerCapture(e.pointerId) })
  s.addEventListener('pointermove', (e) => {
    if (!bosh) return
    const w = ek.getBoundingClientRect().width, lim = w * 0.035
    const dx = Math.max(-lim, Math.min(lim, (e.clientX - bosh.x) * 0.22)), dy = Math.max(-lim, Math.min(lim * 0.6, (e.clientY - bosh.y) * 0.22))
    s.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (dx / lim * 8) + 'deg)'
  })
  s.addEventListener('pointerup', qayt); s.addEventListener('pointercancel', qayt); s.addEventListener('lostpointercapture', qayt)
}
// Yakun: bolaning o'z natijasi — ustozdagi «Sinfimiz bugun» bilan bir xil to'rt son, bir xil manbadan (muvaffaqiyatli dasturlar + tayyor sahna), 17.11
function natijaYoz(ek) {
  dunyoQoy(ek)
  if (typeof labNatija === 'function') labNatija(ek)
  if (typeof ballNatija === 'function') ballNatija(ek) // 11-dars
  // 3-dars: maydonda bolaning ★ yo'li (erkin yo'l — go to manzillari, qDastur) oltin iz bilan qayta chiziladi
  const md = ek.querySelector('.katak.maydon'); if (md && typeof qDastur !== 'undefined') mdYolChiz(md, qDastur.filter((b) => b.t === 'x').map((b) => String(b.m).split(',').map(Number)))
  if (typeof blokJami !== 'function') return
  // sonlar — dars e'lonidagi natija turlari (DARS.natija, qobiq.js: natijaSon)
  const n = natijaSon(blokJami(), typeof qTayyor !== 'undefined' && qTayyor), qo = (k, v) => { const b = ek.querySelector('.sn-t[data-k="' + k + '"] b'); if (b) b.textContent = v }
  for (const k in n) qo(k, n[k])
}

// ===== 3-dars (20.11, manba 003): maydon topshiriqlari =====
// Katakni bosing (8-qadam): DARS.studiya[id] = { ish: 'katakBos', katak: [[x, y]…] (ketma-ket), pog, maslahat, gap: { yetdi, endi } }. Bosilgan katakka
// qahramon sakraydi; to'g'ri — yulduz paydo bo'ladi va konfeti; ★ da birinchisi topilgach «Endi (x, y)»; boshqa katak — Kamvoy, pufakda o'sha katakning manzili.
function katakBosTayyorla(ek) { ek.dataset.kb = '0'; delete ek.dataset.yuryapti; katakAsl(ek); ek.querySelectorAll('.muam,.konfeti,.md-top').forEach((x) => x.remove()) }
function katakBosish(e, ek, ildiz) {
  const id = ek.dataset.id, t = TOP(id), g = t.gap || {}
  if (e.target.closest('.hn .mas')) { ishora(ek, t.maslahat || ''); bildirB(ek, { t: 'yordam', s: typeof qadam !== 'undefined' ? qadam : 0 }); return true }
  const c = mdBosilgan(e, ek); if (!c) return false
  if (ek.dataset.yuryapti) return true
  const i = +(ek.dataset.kb || 0), kerak = t.katak[i]; if (!kerak) return true
  const k = ek.querySelector('.katak.maydon'), xr = katakXarita(k.dataset.xarita), q = xr.length - 1 - c[1], qh = k.querySelector('.kt-q')
  muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove())
  const kc = k.querySelector('.kt-c[data-k="' + c[0] + ',' + q + '"]'); if (kc) { kc.classList.add('yonk'); setTimeout(() => kc.classList.remove('yonk'), 600) }
  katakSur(qh, c[0], q, true, 30); mdYorliqQoy(k, c[0], q); chal('sakra')
  if (c[0] === kerak[0] && c[1] === kerak[1]) {
    const y = document.createElementNS('http://www.w3.org/2000/svg', 'g'); y.setAttribute('class', 'md-top'); y.setAttribute('transform', 'translate(' + (c[0] * KT + 50) + ' ' + (q * KT + 30) + ') scale(24)')
    y.innerHTML = '<path d="' + KT_YULDUZ + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07" stroke-linejoin="round"/>'; k.querySelector('.kt-iz').insertAdjacentElement('afterend', y)
    konfeti(ek); ek.dataset.kb = i + 1
    if (i + 1 < t.katak.length) { ishora(ek, (g.endi || 'Endi') + ' ' + mdYorliq(...t.katak[i + 1])); return true }
    ishora(ek, g.yetdi || 'Topdingiz!')
    if (ildiz.id === 'bol') {
      if (typeof blokQosh === 'function') blokQosh(id, t.katak.map(() => ({ dataset: { tur: 'c' } })))
      if (t.pog && typeof pogQosh === 'function') pogQosh(t.pog)
      ek.dataset.yuryapti = '1'; setTimeout(() => { delete ek.dataset.yuryapti; bolaKeyingi() }, 1400)
    }
    return true
  }
  chal('muammo'); setTimeout(() => { if (document.body.contains(ek)) muammo(ek, 'kamvoy', 'Bu — ' + mdYorliq(c[0], c[1])) }, 300)
  ishora(ek, 'Avval X — o‘ngga sanang, keyin Y — tepaga')
  return true
}
// Oldindan ayting (14, 15-qadam): bosh.bashorat — dastur tayyor (o'zgarmaydi, javon yopiq); bola katakni bosib bayroqcha qo'yadi (ko'chirsa bo'ladi),
// «▶ Tekshirish» bayroqchasiz xira. Ustoz ekranida «Keyingi» avval har blok yonidagi sanoq yozuvini birma-bir yoqadi ([data-r], raqam ishidagidek).
function bashoratTayyorla(ek) {
  delete ek.dataset.bayroq; ek.querySelectorAll('.md-bq.b-bola,.muam,.konfeti').forEach((x) => x.remove())
  ek.dataset.raqam = '0'; ek.querySelectorAll('[data-r]').forEach((x) => x.classList.remove('on'))
  const ig = ek.querySelector('.hn .ishga'); if (ig) ig.textContent = '▶ Tekshirish'
  const tb = bashoratTugma(ek); if (tb) tb.classList.add('kut')
  const g = TOP(ek.dataset.id).gap || {}; if (g.boshla && GAPT(g.boshla)) ishora(ek, GAPT(g.boshla))
  // solo'da ustoz yo'q — sanoq yozuvlari darhol ko'rinadi
  if (typeof SOLO !== 'undefined' && SOLO) ek.querySelectorAll('[data-r]').forEach((x) => x.classList.add('on'))
}
// «Tekshirish» tugmasi: ustoz ekranida (va solo'da) — «▶ Tekshirish» (.ishga), bola noutbukida — asosiy tugma
function bashoratTugma(ek) { return ek.querySelector('.hn .ishga') || ek.querySelector('.hn .asos') }
function bashoratBosish(e, ek, ildiz) {
  const id = ek.dataset.id, t = TOP(id)
  // ustoz ekranidagi «Keyingi ›» (.asos — «Tekshirish»dan boshqa asosiy tugma; ustoz ekranlarida «Orqaga» bor, shuning uchun k-ust klassi bo'lmaydi)
  const kb = e.target.closest('.hn .asos')
  if (ildiz.id === 'ust' && !(typeof SOLO !== 'undefined' && SOLO) && kb && kb !== bashoratTugma(ek)) {
    const n = +(ek.dataset.raqam || 0), jami = Math.max(0, ...Array.from(ek.querySelectorAll('[data-r]')).map((x) => +x.dataset.r))
    if (n >= jami) return false
    ek.dataset.raqam = n + 1; ek.querySelectorAll('[data-r="' + (n + 1) + '"]').forEach((x) => x.classList.add('on')); chal('qadam'); return true
  }
  if (e.target.closest('.dst')) return true
  if (ek.dataset.yuryapti) return e.target.closest('.katak,.hn') ? true : null
  const c = mdBosilgan(e, ek)
  if (c) { chal('bos'); muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove()); katakAsl(ek); mdBayroqQoy(ek, c[0], c[1]); const tb = bashoratTugma(ek); if (tb) tb.classList.remove('kut'); ishora(ek, 'Bayroqcha qo‘yildi. «Tekshirish»ni bosing'); return true }
  const tb = bashoratTugma(ek), tek = tb && e.target.closest('.hn .ishga, .hn .asos') === tb
  if (tek) { if (!ek.dataset.bayroq) { ishora(ek, 'Avval bayroqchani qo‘ying'); return true } ishgaTushir(ek); return true }
  if (e.target.closest('.hn .mas')) { ishora(ek, t.maslahat || ''); bildirB(ek, { t: 'yordam', s: typeof qadam !== 'undefined' ? qadam : 0 }); return true }
  return null
}
// maydon topshirig'ining natijasi (sahna.js, maydonBaho): gap qahramonning haqiqiy manzili bilan; yetdi / tayyor / oldindan — konfeti, bola keyingi pog'onaga
function maydonNatija(ek, id, h, bh, bl, bola) {
  const t = TOP(id), b = t.bosh || {}, g = t.gap || {}, joy = mdYorliq(...bh.joy)
  const xato = { chet: ['Maydon tugadi!', 'Qahramon shu blokda to‘xtadi. Boshqa tomonga yuring'], boshqa: ['Yulduz bu yerda emas!', 'Qahramon ' + joy + ' da. Sonlarni tekshiring: avval X, keyin Y'],
    olmasiz: ['Olma qoldi-ku!', 'Avval olmaga boring — u ' + (bh.olma ? mdYorliq(...bh.olma) : '') + ' da'], kamManzil: ['Oz qoldi!', 'Yana bitta manzil qo‘shing'],
    boshqaKatak: ['Boshqa katak!', 'Qahramon ' + joy + ' da to‘xtadi. Dasturni qaytadan sanang: X qancha, Y qancha'],
    // 5-dars
    otibKetdi: ['Ko‘payib ketdi!', 'Qahramon yulduzdan o‘tib ketdi — repeat sonini kamaytiring', 'ortiqvoy'],
    rasmKam: ['Oz qoldi!', 'Kulrang katak qoldi — ' + (bh.katak ? mdYorliq(...bh.katak) : '') + '. repeat sonini tekshiring'],
    rasmChiqdi: ['Rasmdan chiqdi!', 'Qahramon ' + (bh.katak ? mdYorliq(...bh.katak) : '') + ' ga chiqdi — u kulrang emas. Son va yo‘nalishni tekshiring', 'ortiqvoy'],
    kamIchki: ['Oz qoldi!', 'repeat ichiga kamida ikkita blok qo‘ying'],
    // 6-dars
    kamOila: ['Oz qoldi!', 'Dasturda go to ham, repeat ham bo‘lsin'],
    // 7-dars
    kostyumBoshqa: ['Kostyum boshqa!', 'Hozir: ' + KN(bh.hozir) + '. Kerak: ' + KN(bh.kerak) + '. Oxiriga switch costume to ' + KN(bh.kerak)],
    belgiKostyum: ['Bu katakda — ' + KN(bh.kerak) + '!', (bh.katak ? mdYorliq(...bh.katak) : '') + ' da switch costume to ' + KN(bh.kerak) + ' qo‘ying'],
    animKam: ['Oz qoldi!', 'Animatsiya: ' + bh.n + ' / ' + bh.kerak + '. repeat sonini tekshiring'],
    animQani: ['Animatsiya qani?', 'Har move blokidan keyin: switch costume to xursand, switch costume to xotirjam'] }[bh.tur]
  // gap[tur] — matn yoki [jonli, solo] juftligi; bo'sh bo'lsa — standart gap (6-dars P8: faqat solo'da o'z ishorasi)
  const gt = g[bh.tur] && GAPT(g[bh.tur])
  if (xato) { chal('muammo'); ishora(ek, gt ? gt.replace('(x, y)', bh.katak ? mdYorliq(...bh.katak) : joy).replace('(x2, y2)', bh.yulduzK ? mdYorliq(...bh.yulduzK) : '') : xato[1]); muammo(ek, xato[2] || 'kamvoy', xato[0]); return }
  ishora(ek, g.yetdi ? GAPT(g.yetdi) : { yetdi: 'Yetib bordi!', tayyor: 'Yo‘lingiz tayyor!', oldindan: 'Oldindan aytdingiz!', rasmTayyor: 'Rasm tayyor!' }[bh.tur])
  konfeti(ek)
  if (!bola || ek.dataset.oqish) return
  oxirgiSaqla(ek)
  if (bh.tur === 'tayyor' && typeof qDasturSaqla === 'function') qDasturSaqla(h.go.map(([x, y]) => ({ t: 'x', m: x + ',' + y })))
  // «manzilga bordi» — bolaning o'z dasturidagi go to bloklari; oldindan aytishda dastur tayyor — faqat ekran sanaladi
  // dastur bloklari (takrorlash va uning ichidagilar bir martadan; takrorlashsiz darslarda — bajarilgan bloklar bilan bir xil); rasm va tejalgan bloklar — belgi bloklar
  const dasturBl = typeof bloklar === 'function' ? bloklar(ek) : bl
  const qosh = [...kosTovushBelgi(h), ...(b.bashorat ? [] : dasturBl), ...(bh.rasm ? [{ dataset: { tur: 'c' } }] : []), ...Array.from({ length: b.uzun ? Math.max(0, b.uzun.length - dasturBl.length) : 0 }, () => ({ dataset: { tur: 'z' } }))]
  if ((bh.tur === 'rasmTayyor' || bh.tur === 'tayyor') && b.erkinRasm && typeof qDasturSaqla === 'function') qDasturSaqla(h.yol.map(([x, q]) => ({ t: 'x', m: x + ',' + mdY(h.xr, q) })))
  if (typeof blokQosh === 'function') blokQosh(id, qosh)
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  setTimeout(() => { if (t.keyin) { ichki = QADAM[qadam][2].indexOf(t.keyin); chiz() } else bolaKeyingi() }, 1400)
}
// yakun ekrani: bolaning ★ yo'li — startdan manzillarga to'g'ri oltin punktir, qahramon oxirgi manzilda
function mdYolChiz(k, nuqtalar) {
  if (!nuqtalar.length) return
  const xr = katakXarita(k.dataset.xarita), H = xr.length, s = (k.dataset.start || '0,0').split(',').map(Number), iz = k.querySelector('.kt-iz'), q = (y) => H - 1 - y
  let [ax, ay] = s
  iz.innerHTML = ''
  for (const [x, y] of nuqtalar) {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line'); l.setAttribute('class', 'kt-il kt-gl')
    l.setAttribute('x1', ax * KT + 50); l.setAttribute('y1', q(ay) * KT + 52); l.setAttribute('x2', x * KT + 50); l.setAttribute('y2', q(y) * KT + 52); iz.appendChild(l)
    const c = k.querySelector('.kt-c[data-k="' + x + ',' + q(y) + '"]'); if (c) c.classList.add('iz')
    ax = x; ay = y
  }
  const g = k.querySelector('.kt-q'); if (g) g.style.transform = katakJoy(ax, q(ay))
  mdYorliqQoy(k, ax, q(ay))
}

// ===== 4-dars (20.11, manba 004): hodisalar — o'yin rejimi =====
// Topshiriq: bosh.oyin (sahna 'katak' — maydon). «▶ Boshlash» bosilsa dastur tugmani kutadi: strelka yoki space bosilsa — o'sha tugmaning
// dasturchalari (blockly.js, blDasturchalar) ijrochi bilan bajariladi; bir dasturcha ishlayotganda bosilgan tugma o'tkazib yuboriladi.
// Maydon chetiga urilish o'yinni to'xtatmaydi (faqat «tuk»). Olma hisobi «Olma: N / M»; yashirin yulduz hamma olma olingach ochiladi.
// Yulduzga yetdi (olmalar olingan) — bosh.kerak shartlari tekshiriladi, keyin yutdi: konfeti, bola keyingi pog'onaga; dasturchalar saqlanadi
// (keyingi pog'ona bosh.prog 'oldingi' bo'lsa — shular bilan ochiladi). Klaviatura faqat o'yin paytida ushlanadi (ustoz ekranida ham → qadam almashtirmaydi).
const OYIN = new Map()
const OYIN_TUGMA = { ArrowRight: 'right', ArrowLeft: 'left', ArrowUp: 'up', ArrowDown: 'down', ' ': 'space' }
const TUGMA_BELGI = { right: '→', left: '←', up: '↑', down: '↓', space: 'space' }
const oyinTugma = (ek) => ek.querySelector('.hn .ishga') || ek.querySelector('.hn .asos')
const oyinKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'dasturcha'
function oyinDasturOl() { try { return JSON.parse(localStorage.getItem(oyinKalit()) || '[]') } catch (e) { return [] } }
function oyinDasturSaqla(r) { try { localStorage.setItem(oyinKalit(), JSON.stringify(r)) } catch (e) {} }
function oyinTayyorla(ek) {
  const t = TOP(ek.dataset.id), b = t.bosh, g = t.gap || {}
  oyinToxtat(ek)
  if (b.prog === 'oldingi' && b.labirint) labDasturYukla(ek)
  else if (b.soloDastur && typeof SOLO !== 'undefined' && SOLO) labQur(ek, b.soloDastur)
  else if (b.prog === 'oldingi' && typeof blYukla === 'function') { const s = oyinDasturOl(); if (s.length) { blYukla(ek, s); sanoq(ek) } }
  if (b.chek) chekChiz(ek)
  if (b.ball) ballTayyorla(ek) // 11-dars
  if (b.labirint) labJoyKuzat(ek)
  if (b.yasash) yasashTayyorla(ek) // 10-dars
  else if (b.darajalar) { mdQayta(ek, darajaXarita(b.darajalar[0])); darajaYoz(ek, 0, b.darajalar.length) }
  const tb = oyinTugma(ek); if (tb) { if (tb.classList.contains('ishga')) tb.textContent = b.yasash ? '▶ Sinab ko‘rish' : '▶ Boshlash'; tb.dataset.asl = tb.innerHTML } // 10-dars: labirint yasashda — «Sinab ko‘rish»
  if (g.boshla && GAPT(g.boshla)) ishora(ek, GAPT(g.boshla))
}
function oyinBosish(e, ek) {
  const tb = oyinTugma(ek)
  if (tb && e.target.closest('.hn .ishga, .hn .asos') === tb) { if (ek.dataset.oyin) oyinToxtat(ek); else oyinBoshla(ek); return true }
  return null
}
function oyinYozuv(ek, o) {
  const p = ek.querySelector('.oyin-yz'); if (!p) return
  const n = o.h.olma.filter(([x, y]) => o.h.yol.some(([a, c]) => a === x && c === y)).length
  p.innerHTML = 'O‘yin: strelkalarni bosing' + (o.h.olma.length ? ' · Olma: <b>' + n + ' / ' + o.h.olma.length + '</b>' : '')
}
async function oyinBoshla(ek) {
  const b = TOP(ek.dataset.id).bosh
  if (b.ball) return ballBoshla(ek) // 11-dars
  if (b.olmaDastur) return olmaOyinBoshla(ek) // 13-dars
  muammoOl(ek); urildiOl(ek); ek.querySelectorAll('.konfeti,.dv-pufak').forEach((x) => x.remove())
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  if (!blDasturchalar(ek).length) { chal('muammo'); ishora(ek, 'Avval hodisa blokini qo‘ying: when … key pressed'); muammo(ek, 'boshvoy', 'Men nimani kutaman?'); return }
  if (b.yasash && labOlchov(ek.querySelector('.katak').dataset.xarita).yol == null) { yasashMuammo(ek, true); return }
  if (b.darajalar) { mdQayta(ek, darajaXarita(b.darajalar[0])); darajaYoz(ek, 0, b.darajalar.length) }
  if (b.labirint && typeof blShartBosh === 'function' && blShartBosh(ek)) { chal('muammo'); ishora(ek, 'if ichiga blok qo‘ying — yo‘l bo‘lsa, u bajariladi'); muammo(ek, 'boshvoy', 'Ichi bo‘sh-ku…'); return }
  const h = await SAHNA.katak.boshla(ek, b)
  // yashirin yulduz — hamma olma olinmaguncha ochilmaydi (qahramon o'sha katakdan o'tsa ham)
  h.yashirinKut = !!(h.k.querySelector('.kt-yul.yashirin') && h.olma.length)
  const o = { h, bosildi: new Set(), bosish: 0, qaytdi: false, gapAytildi: false }
  OYIN.set(ek, o); ek.dataset.oyin = '1'
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-yz"></span>'); oyinYozuv(ek, o)
  const tb = oyinTugma(ek); if (tb) tb.textContent = '■ To‘xtatish'
  // ogohlantirish (o'yin baribir boshlanadi): hodisasiz bloklar hech qachon bajarilmaydi; bitta tugmaga ikki dasturcha — ikkalasi ham ishlaydi
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek), yetim = ws ? blTepalar(ws).some((t) => t.type !== 'when_key') : false
  const tug = blDasturchalar(ek).map((d) => d.tugma), ikki = tug.find((t, i) => tug.indexOf(t) !== i)
  ishora(ek, yetim ? 'Bu bloklar hech qachon ishlamaydi — tepasiga hodisa bloki qo‘ying' : ikki ? TUGMA_BELGI[ikki] + ' uchun ikkita dasturcha bor — ikkalasi ham ishlaydi' : '')
}
function oyinToxtat(ek) {
  delete ek.dataset.oyin; OYIN.delete(ek)
  ek.querySelectorAll('.oyin-yz').forEach((x) => x.remove())
  const tb = oyinTugma(ek); if (tb && tb.dataset.asl) tb.innerHTML = tb.dataset.asl
}
document.addEventListener('keydown', (e) => {
  const ek = document.querySelector('.ekran[data-oyin]'); if (!ek) return
  const k = OYIN_TUGMA[e.key]; if (!k) return
  if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable=true]')) return
  // o'yin paytida strelka va space faqat o'yinniki: ustoz ekranida qadam almashmaydi, Blockly ham olmaydi
  e.preventDefault(); e.stopPropagation()
  oyinTugmaBos(ek, k)
}, true)
async function oyinTugmaBos(ek, k) {
  const o = OYIN.get(ek); if (!o || ek.dataset.yuryapti) return
  if (ek.dataset.oyin === 'huk') return hukOyinBos(ek, k, o)
  if (ek.dataset.oyin === 'sahna') return sahnaOyinBos(ek, k, o)
  if ((TOP(ek.dataset.id).bosh || {}).ball) return ballBos(ek, k, o) // 11-dars
  if ((TOP(ek.dataset.id).bosh || {}).olmaDastur) return olmaOyinBos(ek, k, o) // 13-dars
  if ((TOP(ek.dataset.id).bosh || {}).labirint) return labTugmaBos(ek, k, o)
  o.bosildi.add(k); o.bosish++; o.tugma = k; muammoOl(ek)
  const d = blDasturchalar(ek).filter((x) => x.tugma === k)
  if (!d.length) { chal('muammo'); ishora(ek, TUGMA_BELGI[k] + ' tugmasi uchun when ' + TUGMA_BELGI[k] + ' key pressed bloki kerak'); muammo(ek, 'boshvoy', 'Bu tugma uchun dasturcha yo‘q-ku…'); return }
  if (d.every((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, 'Hodisa blokining ostiga move blokini ulang'); muammo(ek, 'kamvoy', 'Tugma bosildi, lekin men nima qilay?'); return }
  ek.dataset.yuryapti = '1'
  for (const x of d) {
    x.hodisa.classList.add('hozir')
    await ijro(x.bloklar.map((el) => ({ el, tur: blokTuri(el), ichki: [] })), (t) => {
      if (t.tur === 's' && blokMatn(t.el) && blokMatn(t.el) !== DARS.gapStandart) o.gapAytildi = true
      if (t.tur === 'n') { o.tovushT = o.tovushT || {}; (o.tovushT[k] = o.tovushT[k] || new Set()).add(blokQiymat(t.el, 'NOM') || 'qadam') }
      if (t.tur === 'x' && k === 'space' && blokXY(t.el).join(',') === '0,0') o.qaytdi = true
      return SAHNA.katak.bajar(o.h, t)
    }, { kut: 140 })
    x.hodisa.classList.remove('hozir')
    if (o.h.urildi) { o.h.urildi = null; urildiOl(ek) }
  }
  delete ek.dataset.yuryapti
  if (OYIN.get(ek) === o) oyinTekshir(ek, o)
}
function oyinTekshir(ek, o) {
  const h = o.h, b = TOP(ek.dataset.id).bosh
  const qoldi = h.olma.filter(([x, y]) => !h.yol.some(([a, c]) => a === x && c === y))
  oyinYozuv(ek, o)
  if (!qoldi.length && h.yashirinKut) { h.yashirinKut = false; const y = h.k.querySelector('.kt-yul.yashirin'); if (y) y.classList.add('topildi'); chal('bos'); o.qochBos = 0; o.endiChiqdi = true }
  if (!h.yulduz || h.yashirinKut) return
  if (h.x !== h.yulduz[0] || h.y !== h.yulduz[1]) { oyinQoch(ek, o, b); return }
  if (qoldi.length) { chal('muammo'); ishora(ek, 'Avval olmani oling — u ' + mdYorliq(qoldi[0][0], mdY(h.xr, qoldi[0][1])) + ' da'); muammo(ek, 'kamvoy', 'Olma qoldi-ku!'); return }
  // 7-dars: yulduzda space (b.oxiri) — yulduzga yetganda o'yin to'xtamaydi; kerakli tovush (b.tovush); ★ — kamida ikki xil kostyum va tovush (b.xil)
  if (b.oxiri === 'space' && o.tugma !== 'space') { ishora(ek, 'Yulduzdasiz — space bosing'); return }
  if (b.tovush && !((o.tovushT || {})[b.tovush.tugma] || new Set()).has(b.tovush.nom)) { chal('muammo'); ishora(ek, TUGMA_BELGI[b.tovush.tugma] + ' dasturchasiga play sound ' + b.tovush.nom + ' ulang'); muammo(ek, 'kamvoy', 'Tovush qani?'); return }
  if (b.kostyum && h.kos !== b.kostyum) { chal('muammo'); ishora(ek, 'Hozir: ' + KN(h.kos) + '. Kerak: ' + KN(b.kostyum) + '. space dasturchasiga switch costume to ' + KN(b.kostyum)); muammo(ek, 'kamvoy', 'Kostyum boshqa!'); return }
  if (b.xil && (new Set(h.kosNomlar || []).size < b.xil || new Set(h.tovushlar || []).size < b.xil)) { chal('muammo'); ishora(ek, 'Yana bitta kostyum yoki tovush qo‘shing — kamida ikki xil'); muammo(ek, 'kamvoy', 'Hammasi bir xil-ku!'); return }
  const xato = b.kerak && oyinShart(ek, o, b.kerak)
  if (xato) { chal('muammo'); ishora(ek, xato[1]); muammo(ek, 'kamvoy', xato[0]); return }
  oyinYutdi(ek, o)
}
// 4-dars 3-bekat (4·11 A): qochadigan yulduz — bosh.qoch { har, joy: [[x, y]…] }: yulduz ko'ringach har «har» bosishda ro'yxatdagi navbatdagi
// katakka sakraydi (qahramon turgan katak o'tkazib yuboriladi); ro'yxat tugagach joyida qoladi — bola tutib oladi
function oyinQoch(ek, o, b) {
  const q = b && b.qoch; if (!q || !q.joy) return
  if (o.endiChiqdi) { o.endiChiqdi = false; return } // yulduz chiqqan bosish sanalmaydi
  o.qochBos = (o.qochBos || 0) + 1; if (o.qochBos % q.har) return
  const h = o.h; let i = o.qochI || 0
  while (i < q.joy.length && q.joy[i][0] === h.x && q.joy[i][1] === mdY(h.xr, h.y)) i++
  if (i >= q.joy.length) return
  o.qochI = i + 1; yulduzQoch(ek, h, q.joy[i][0], q.joy[i][1])
}
// ★ shartlari: { tugma, tur, blok } — o'sha tugmaning dasturchasida shu turdagi bloklar kamida «blok» ta; qaytdi — space bilan (0, 0) ga qaytdi; gap — o'z gapi aytildi
const KN = (k) => (k === 'oylanadi' ? 'o‘ylanadi' : k) // kostyum nomi ekranda
// 7-dars natijasi: 'K' — kostyum haqiqatan almashgan marta, 'T' — chalingan tovush (faqat dars natijasida shu belgilar bo'lsa)
function kosTovushBelgi(h) {
  const n = (DARS.natija || []).map((x) => x.blok); if (!h || (n.indexOf('K') < 0 && n.indexOf('T') < 0 && n.indexOf('N') < 0)) return []
  return [...Array.from({ length: h.kosSoni || 0 }, () => ({ dataset: { tur: 'K' } })), ...Array.from({ length: h.anim || 0 }, () => ({ dataset: { tur: 'N' } })), ...Array.from({ length: (h.tovushlar || []).length }, () => ({ dataset: { tur: 'T' } }))]
}
// 8-dars natijasi: 'L' — o'tilgan labirintlar (egizakda 2 ta); faqat dars natijasida 'L' bo'lsa
// 'S' — dasturdagi shart bloklari (har biri bir marta; bl esa bajarilish tartibi — takrorlash ichida bir necha marta)
function labirintBelgi(h, b) {
  const n = (DARS.natija || []).map((x) => x.blok), r = []
  if (n.indexOf('S') >= 0) { const ws = typeof BL_WS !== 'undefined' && BL_WS.get(h.ek); r.push(...Array.from({ length: ws ? ws.getBlocksByType('if_path', false).length : 0 }, () => ({ dataset: { tur: 'S' } }))) }
  if (n.indexOf('L') >= 0 && !b.erkinSayr) r.push(...Array.from({ length: h.egizN === 2 ? 2 : 1 }, () => ({ dataset: { tur: 'L' } })))
  return r
}
function oyinShart(ek, o, sh) {
  const d = blDasturchalar(ek).filter((x) => x.tugma === sh.tugma), soni = Math.max(0, ...d.map((x) => x.bloklar.filter((el) => blokTuri(el) === sh.tur).length))
  if (sh.blok && soni < sh.blok) return ['Oz qoldi!', sh.gap0]
  if (sh.qaytdi && !o.qaytdi) return ['Oz qoldi!', sh.gap0]
  if (sh.gap && !o.gapAytildi) return ['Hech narsa demadi…', sh.gap0]
  return null
}
function oyinYutdi(ek, o) {
  const id = ek.dataset.id, t = TOP(id), b = t.bosh, g = t.gap || {}
  oyinToxtat(ek)
  ishora(ek, g.yetdi ? GAPT(g.yetdi) : 'Yetib bordi!'); konfeti(ek)
  const ildiz = ek.parentNode && ek.parentNode.closest('#ust,#bol'); if (!ildiz || ildiz.id !== 'bol' || ek.dataset.oqish) return
  oxirgiSaqla(ek); oyinDasturSaqla(blRoyxatMa(ek))
  if (b.labirint) labYutdi(ek, o) // 9-dars: dastur if ichidagilari bilan; bosh.saqla — o'yin 10-dars uchun
  // natija: shu o'yinda bosilgan tugmalar va terilgan olmalar (haqiqiy son — oldingi pog'onadan kelgan dasturchalar qayta sanalmaydi; audit 20.11)
  // 9-dars: 'Y' — shart «yo'q» bergan bosishlar (devor oldida to'xtadi), 'L' — yutilgan labirint
  const lab = b.labirint ? [...Array.from({ length: labYoq(o) }, () => ({ dataset: { tur: 'Y' } })), { dataset: { tur: 'L' } }, ...Array.from({ length: b.darajalar ? (o.daraja || 0) + 1 : 0 }, () => ({ dataset: { tur: 'G' } }))] : []
  if (typeof blokQosh === 'function') blokQosh(id, [...Array.from({ length: o.bosish }, () => ({ dataset: { tur: 't' } })), ...o.h.olma.map(() => ({ dataset: { tur: 'o' } })), ...kosTovushBelgi(o.h), ...lab])
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  setTimeout(() => bolaKeyingi(), 1400)
}
// A·1 (20.11, foydalanuvchi qarori): 16-qadam «… o'qib bering» — bola noutbukida oxirgi yechgan pog'onasi o'z dasturi bilan qayta ochiladi
// (qadamning bola ro'yxati 'oxirgi' — qobiq.js). Dastur Blockly'ning o'z saqlash shaklida (takrorlash ichidagilar va bir necha dasturcha bilan);
// oldindan aytishda — bayroqcha. Shu ekranda qayta ishga tushirilsa natija va pog'ona qayta sanalmaydi (ek.dataset.oqish).
const oxirgiKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'oxirgi'
function oxirgiSaqla(ek) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek)
  const x = { id: ek.dataset.id, bl: ws ? Blockly.serialization.workspaces.save(ws) : null, bayroq: ek.dataset.bayroq || '' }
  try { localStorage.setItem(oxirgiKalit(), JSON.stringify(x)) } catch (e) {}
}
function oxirgiOl() { try { return JSON.parse(localStorage.getItem(oxirgiKalit()) || 'null') } catch (e) { return null } }
function oqishYukla(ek) {
  const x = oxirgiOl(); if (!ek || !x || x.id !== ek.dataset.id) return
  ek.dataset.oqish = '1'
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek)
  if (ws && x.bl) { ws.clear(); Blockly.serialization.workspaces.load(x.bl, ws); ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); blTartibKeyin(ws); sanoq(ek) }
  if (x.bayroq && x.bayroq.indexOf('son:') === 0) { if (typeof sonBashTayyorla === 'function') sonBashTayyorla(ek); const sk = ek.querySelector('.bsh-q .sk[data-v="' + x.bayroq.slice(4) + '"]'); if (sk) { sk.classList.add('tan'); ek.dataset.bayroq = x.bayroq; const ish = ek.querySelector('.hn .ishga') || ek.querySelector('.hn .asos'); if (ish) ish.classList.remove('xira') } } // 11-dars
  else if (x.bayroq) { const [a, c] = x.bayroq.split(',').map(Number); mdBayroqQoy(ek, a, c) }
  ishora(ek, DARS.oqishGap || 'Dasturingizni ustozga o‘qib bering')
}
// huk (4-dars): yulduzni boshqa katakka ko'chirish (karta sinovi oldidan)
// 4-dars huk (4·10 A): yulduz yurish paytida qochadi — karta data-qoch «N:x,y»: N-qadamdan (o'yinda N-bosishdan) keyin yulduz (x, y) ga sakraydi.
// Tayyor dastur moslasha olmaydi (o'sha yo'ldan boradi), strelka esa moslashadi.
function hukQoch(k) { const m = k && k.dataset.qoch && k.dataset.qoch.match(/^(\d+):(\d+),(\d+)$/); return m ? { n: +m[1], x: +m[2], y: +m[3] } : null }
function yulduzQoch(ek, h, x, y) {
  const s = ek.querySelector('.katak.maydon .kt-yul'), kor = s && s.classList.contains('topildi')
  mdYulduzQoy(ek, x, y); h.yulduz = [x, h.xr.length - 1 - y]; chal('sakra')
  if (s) { if (kor) s.classList.add('topildi'); s.classList.remove('qochdi'); void s.getBoundingClientRect(); s.classList.add('qochdi') }
}
function mdYulduzQoy(ek, x, y) {
  const k = ek.querySelector('.katak.maydon'); if (!k) return
  const xr = katakXarita(k.dataset.xarita).map((r) => r.replace('*', '.')), q = xr.length - 1 - y
  xr[q] = xr[q].slice(0, x) + '*' + xr[q].slice(x + 1); k.dataset.xarita = xr.join('|')
  const s = k.querySelector('.kt-yul'); if (s) { s.setAttribute('transform', 'translate(' + (x * KT + 50) + ' ' + (q * KT + 52) + ') scale(30)'); s.classList.remove('topildi') }
}
// huk C kartasi: o'yin — strelkalar qahramonni to'g'ridan-to'g'ri yurgizadi (dastur yo'q), yulduzga yetsa karta «✓»
async function hukOyin(ek, k, i) {
  ek.querySelectorAll('.jk').forEach((x) => x.classList.toggle('sinov', x === k)); ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  k.classList.remove('n-ok', 'n-yoq'); k.querySelectorAll('.jn').forEach((x) => x.remove())
  const h = await SAHNA.katak.boshla(ek, {})
  OYIN.set(ek, { h, huk: { k, i, qoch: hukQoch(k), n: 0 } }); ek.dataset.oyin = 'huk'
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-yz">O‘yin: strelkalarni bosing</span>')
}
async function hukOyinBos(ek, key, o) {
  const tur = { right: 'r', left: 'l', up: 'u', down: 'd' }[key]; if (!tur) return
  ek.dataset.yuryapti = '1'
  await SAHNA.katak.bajar(o.h, { tur, el: document.createElement('span') }); if (o.h.urildi) o.h.urildi = null
  o.huk.n++; const qc = o.huk.qoch; if (qc && o.huk.n === qc.n) yulduzQoch(ek, o.h, qc.x, qc.y)
  await KUT(160); delete ek.dataset.yuryapti
  const h = o.h; if (!h.yulduz || h.x !== h.yulduz[0] || h.y !== h.yulduz[1]) return
  const { k, i } = o.huk, g = TOP(ek.dataset.id).gap || {}
  oyinToxtat(ek)
  k.classList.remove('sinov'); k.classList.add('n-ok')
  ;(k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<small class="jn">' + (k.dataset.nat || g.yetdi) + '</small>')
  konfeti(ek)
  ek.dataset.huk = Math.max(+(ek.dataset.huk || 0), i + 1)
  const a = ek.querySelector('.hn .asos'); if (a && g.keyingi) a.textContent = g.keyingi
}

// ===== 9-dars (20.11, manba 009): labirint o'yini — maydonda devor, kalit, eshik; strelka dasturchalarida shart (qoida) =====
// bosh.labirint — o'yin (bosh.oyin) labirint maydonda: dasturcha daraxt bo'lib bajariladi (if ichiga kiriladi — ijrochi.js), shartsiz move devorga,
// maydon chetiga yoki kalitsiz eshikka urilsa — o'yin TO'XTAYDI (4-darsdagi «tuk, davom» emas; manba «Savollar» 2). Pog'ona shartlari (yulduzga
// yetganda): qoida (har strelka dasturchasidagi move — o'z tomonli if ichida), yoq (o'yinda kamida bir «yo'q»), tovushIf (play sound if ichida va yurganda
// chalindi), startga (go to qahramonni (0, 0) ga qaytardi), chekTola (chek-list to'rtala band). shartGap — 2-bekatdan To'siqvoy gapi; qoidaIshora — qoidasiz strelka.
const LAB_YON = { r: 'right', l: 'left', u: 'up', d: 'down' }
const YON_GAP = { right: 'o‘ngga', left: 'chapga', up: 'tepaga', down: 'pastga' }
const STRELKA = ['right', 'left', 'up', 'down']
const labTurla = (t) => { t.tur = blokTuri(t.el); t.ichki.forEach(labTurla); return t }
const labBola = (ek) => { const r = ek && ek.parentNode && ek.parentNode.closest('#ust,#bol'); return !!r && r.id === 'bol' }
// dasturchalarning statik holati: ochiq — shartsiz move bor strelkalar; boshqa — [strelka, shart tomoni] (move boshqa tomonga); strelka — dasturchasi bor strelkalar soni
function labQoida(ek) {
  const r = { ochiq: [], boshqa: [], strelka: 0, move: 0 }, bor = new Set()
  for (const x of blDasturchalar(ek)) {
    if (STRELKA.indexOf(x.tugma) < 0) continue
    if (x.bloklar.length) bor.add(x.tugma)
    const yur = (tt, ota) => tt.forEach((t) => {
      const tur = blokTuri(t.el)
      if (tur === 'a') return yur(t.ichki, t.yon)
      if (LAB_YON[tur]) { r.move++; if (!ota) { if (r.ochiq.indexOf(x.tugma) < 0) r.ochiq.push(x.tugma) } else if (ota !== LAB_YON[tur]) r.boshqa.push([x.tugma, ota]) }
      yur(t.ichki, ota)
    })
    yur(x.daraxt, null)
  }
  r.strelka = bor.size; r.ok = r.move > 0 && !r.ochiq.length && !r.boshqa.length
  return r
}
async function labTugmaBos(ek, k, o) {
  const b = TOP(ek.dataset.id).bosh, h = o.h
  o.bosildi.add(k); o.bosish++; o.tugma = k; muammoOl(ek)
  const d = blDasturchalar(ek).filter((x) => x.tugma === k)
  if (!d.length) { chal('muammo'); ishora(ek, TUGMA_BELGI[k] + ' tugmasi uchun when ' + TUGMA_BELGI[k] + ' key pressed bloki kerak'); muammo(ek, 'boshvoy', 'Bu tugma uchun dasturcha yo‘q-ku…'); return }
  if (d.every((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, 'Hodisa blokining ostiga move blokini ulang'); muammo(ek, 'kamvoy', 'Tugma bosildi, lekin men nima qilay?'); return }
  ek.dataset.yuryapti = '1'
  const iz = { yurdi: 0, yon: [], boshqa: null, tovush: false, tovushIf: false, go: null }, yoq0 = h.yoqSoni || 0
  for (const x of d) {
    x.hodisa.classList.add('hozir')
    await ijro(x.daraxt.map(labTurla), async (t) => {
      const q0 = h.qadamlar, r = await SAHNA.katak.bajar(h, t)
      if (t.tur === 'a') iz.yon.push(t.yon)
      if (LAB_YON[t.tur] && h.qadamlar > q0) { iz.yurdi++; if (LAB_YON[t.tur] !== k && k !== 'space') iz.boshqa = LAB_YON[t.tur] }
      if (t.tur === 'n') { iz.tovush = true; if (typeof blOtaShart === 'function' && blOtaShart(t.el)) iz.tovushIf = true }
      if (t.tur === 'x' && r !== 'toxta') iz.go = [h.x, mdY(h.xr, h.y)]
      return r
    }, { kut: 140 })
    x.hodisa.classList.remove('hozir')
    if (h.urildi) break
  }
  delete ek.dataset.yuryapti
  if (OYIN.get(ek) !== o) return
  // urildi — o'yin to'xtadi (blok «urildi» belgisi bilan qoladi; «▶ Boshlash» — startdan)
  if (h.urildi) {
    const u = h.urildi; h.urildi = null; o.toxtadi = true
    oyinToxtat(ek); chal('muammo')
    if (u.eshik) { ishora(ek, 'Eshik yopiq. Avval kalitni oling'); muammo(ek, 'kamvoy', 'Kalit qani?') }
    else { const ota = typeof blOtaShart === 'function' && blOtaShart(u.el); ishora(ek, ota ? 'Shart bir tomonni tekshirdi, blok boshqa tomonga yurdi' : b.shartGap ? 'Bu blok yo‘lni tekshirmay yurdi. Yurishdan oldin tekshiring' : 'O‘yin to‘xtadi. Qaytadan — «▶ Boshlash»'); muammo(ek, 'tosiqvoy', 'Devor!') }
    labChekYangila(ek, o); return
  }
  if (b.startga && iz.go && !iz.go[0] && !iz.go[1]) o.startga = true
  if (iz.tovushIf && iz.yurdi) o.tovushIf = true
  // o'yin davom etadi — muammocha yoki ishora (bittasi, muhimrog'i)
  let mm = null, gap = ''
  if (h.eshikYoq) { h.eshikYoq = false; mm = ['kamvoy', 'Kalit qani?']; gap = 'Eshik yopiq. Avval kalitni oling' }
  else if (b.tovushIf && iz.tovush && !iz.yurdi) { mm = ['kamvoy', 'Men yurmadim-ku!']; gap = 'Tovush qahramon turganda ham chalindi. U faqat yurganda chalinsin' }
  else if (b.startga && iz.go && (iz.go[0] || iz.go[1])) { mm = ['kamvoy', 'Bu start emas!']; gap = 'Qahramon ' + mdYorliq(...iz.go) + ' ga bordi. Start — (0, 0)' }
  else if (iz.boshqa) gap = TUGMA_BELGI[k] + ' bosildi — qahramon ' + YON_GAP[iz.boshqa] + ' yurdi. Dasturchani tekshiring'
  else if (!iz.yurdi && k !== 'space' && iz.yon.some((y) => y !== k)) gap = TUGMA_BELGI[k] + ' bosildi — shart ' + TUGMA_BELGI[iz.yon.find((y) => y !== k)] + ' tomonni tekshirdi'
  else if (b.adashmay && (h.yoqSoni || 0) > yoq0) gap = 'Devor tomonga bosildi. Qaytadan — «▶ Boshlash»'
  else if (b.qoidaIshora && k !== 'space' && labQoida(ek).ochiq.indexOf(k) >= 0) gap = TUGMA_BELGI[k] + ' dasturchasi yo‘lni tekshirmaydi'
  if (mm) { chal('muammo'); muammo(ek, mm[0], mm[1]) }
  ishora(ek, gap)
  labChekYangila(ek, o)
  labTekshir(ek, o)
}
// yulduzga yetdi — pog'ona shartlari; bajarilmasa Kamvoy, o'yin davom etadi (bola yana sinaydi)
async function labTekshir(ek, o) {
  const h = o.h, b = TOP(ek.dataset.id).bosh
  if (!h.yulduz || h.x !== h.yulduz[0] || h.y !== h.yulduz[1]) return
  if (b.yasash) return yasashYutdi(ek, o) // 10-dars: «Sinab ko‘rish» — o'z labirintini yutdi
  if (b.darajalar && (o.daraja || 0) < b.darajalar.length - 1) return darajaKeyingi(ek, o, b) // 10-dars: keyingi daraja
  let xato = null
  if (b.qoida) { const q = labQoida(ek); if (q.ochiq.length) xato = ['Oz qoldi!', TUGMA_BELGI[q.ochiq[0]] + ' dasturchasi yo‘lni tekshirmaydi']; else if (q.boshqa.length) xato = ['Oz qoldi!', TUGMA_BELGI[q.boshqa[0][0]] + ' dasturchasida shart ' + TUGMA_BELGI[q.boshqa[0][1]] + ' tomonni tekshiradi']; else if (!q.move) xato = ['Oz qoldi!', 'Hodisa blokining ostiga move blokini ulang'] }
  if (!xato && b.adashmay && labYoq(o) > 0) xato = ['Oz qoldi!', 'Devor tomonga bosildi. Qaytadan — «▶ Boshlash»']
  if (!xato && b.yoq && !(h.yoqSoni > 0)) xato = ['Oz qoldi!', 'Ataylab devor tomonga bosing — keyin yuting']
  if (!xato && b.tovushIf && !o.tovushIf) xato = ['Oz qoldi!', 'Qahramon yurganda tovush chalinsin']
  if (!xato && b.startga && !o.startga) xato = ['Oz qoldi!', 'Bitta tugma qahramonni startga qaytarsin']
  if (xato) { chal('muammo'); ishora(ek, xato[1]); muammo(ek, 'kamvoy', xato[0]); return }
  if (b.darajalar && b.darajalar.length > 1) chekBelgi(ek, 'ikki') // 10-dars: «Ikki daraja yutildi»
  if (b.chek) chekBelgi(ek, 'yulduz') // «Yulduz» — ro'yxat bor o'yinda (3-bekat): 1–2-bekatdagi yutishlar uni oldindan belgilab qo'ymasin
  if (b.chekTola) { const bosh = chekRoyxat().filter(([c]) => (Array.isArray(b.chekTola) ? b.chekTola.indexOf(c) >= 0 : true) && !chekHolat(ek)[c]).map(([, t]) => t); if (bosh.length && b.darajalar) { oyinToxtat(ek); chal('muammo'); ishora(ek, 'Ro‘yxatda bo‘sh band bor: ' + bosh[0]); muammo(ek, 'kamvoy', 'Oz qoldi!'); return } if (bosh.length) { oyinToxtat(ek); ishora(ek, 'Siz yutdingiz! Ro‘yxatda bo‘sh band bor: ' + bosh.join(', ')); konfeti(ek); return } }
  oyinYutdi(ek, o)
}
// yutdi (oyinYutdi ichidan, faqat bola): dastur if ichidagilari bilan saqlanadi (keyingi pog'ona — shundan); bosh.saqla — o'yin 10-dars uchun
const labKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'labdastur'
const LAB_OYIN = 'jr-labirint-oyini' // 10-dars ham o'qiydi — dars kalitisiz
function labYutdi(ek, o) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (!ws) return
  const bl = Blockly.serialization.workspaces.save(ws)
  try { localStorage.setItem(labKalit(), JSON.stringify(bl)) } catch (e) {}
  if (TOP(ek.dataset.id).bosh.saqla) try { localStorage.setItem(LAB_OYIN, JSON.stringify({ bl, xarita: (ek.querySelector('.katak') || {}).dataset.xarita, bosish: o.bosish })) } catch (e) {}
}
function labDasturYukla(ek) {
  let bl = null; try { bl = JSON.parse(localStorage.getItem(labKalit()) || 'null') } catch (e) {}
  // 10-dars (DARS.oyin9): o'z dasturi bo'lmasa — 9-darsda saqlangan o'yin, u ham bo'lmasa — tayyor o'yin (DARS.oyinTayyor)
  if (!bl && DARS.oyin9) { try { bl = (JSON.parse(localStorage.getItem(LAB_OYIN) || 'null') || {}).bl || null } catch (e) {} if (!bl && DARS.oyinTayyor) return labQur(ek, DARS.oyinTayyor) }
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (!ws || !bl) return
  ws.clear(); Blockly.serialization.workspaces.load(bl, ws); ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); blTartibKeyin(ws); sanoq(ek)
}
// solo'da tayyor dastur (DARS.oyinlar[nom] — if ichidagilari bilan): jonli darsda ustoz o'zi tuzadigan ekran (10-qadam)
function labQur(ek, nom) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (!ws) return
  ws.clear()
  const zanjir = (ota, r) => { let o = ota; r.forEach((x, i) => { const b = blYangi(ws, x.t, x.t === 'a' ? x.yon : x.m); if (i === 0 && ota.type !== 'when_key') ota.getInput('DO').connection.connect(b.previousConnection); else o.nextConnection.connect(b.previousConnection); if (x.ichki) zanjir(b, x.ichki); o = b }) }
  B_GURUH(() => { ((DARS.oyinlar || {})[nom] || []).forEach(([tugma, d], n) => { const h = blYangi(ws, 'k', tugma); h.moveTo(new Blockly.utils.Coordinate(0, 1000 * n)); zanjir(h, d) }) })
  ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); blTartibKeyin(ws); sanoq(ek)
}
// C-blokli dasturchalar (if ichida move) Blockly'da kechroq chiziladi — balandligi eski o'lchanib, dasturchalar ustma-ust tushardi (20.11, surat).
// Dastur o'zgarganda (bloklar chizilib bo'lgach) dasturchalar qayta joylanadi va ustunga sig'adigan qilib moslanadi; o'zgarish bo'lmasa — jim
function labJoyKuzat(ek) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (!ws || ws.__labJoy) return
  ws.__labJoy = true; let t = 0, iz = ''
  // ochiq ro'yxat (tugma, tomon) bo'lsa — kutadi: masshtab o'zgarsa Blockly ro'yxatni yopib qo'yadi; joylashuv o'zgarmagan bo'lsa — hech narsa qilmaydi
  const joyla = () => {
    if (ws.disposed || !document.body.contains(ek)) return
    if ((Blockly.DropDownDiv && Blockly.DropDownDiv.isVisible && Blockly.DropDownDiv.isVisible()) || (Blockly.WidgetDiv && Blockly.WidgetDiv.isVisible && Blockly.WidgetDiv.isVisible())) { clearTimeout(t); t = setTimeout(joyla, 300); return }
    const yangi = ws.getTopBlocks(false).map((x) => { const xy = x.getRelativeToSurfaceXY(), hw = x.getHeightWidth(); return [x.id, Math.round(xy.x), Math.round(xy.y), Math.round(hw.height), Math.round(hw.width)].join() }).join('|') + '|' + Math.round(ek.getBoundingClientRect().width)
    if (yangi === iz) { delete ek.dataset.joylanmoqda; return } // barqaror — belgi olinadi (oltin sinovi shuni kutadi)
    blTartib(ws); blMasshtab(ek, ws)
    // ikki ustunli dastur ustunga eniga ham sig'sin (kichik ekranda — yonma-yon ko'rik — masshtabning pastki chegarasi uni chiqarib yuborardi, Blockly esa itarardi)
    const bb = ws.getBlocksBoundingBox(), en = (bb.right - bb.left) * ws.scale, jEn = ws.getParentSvg().getBoundingClientRect().width
    if (en > jEn - 2 && bb.right > bb.left) { ws.setScale((jEn - 2) / (bb.right - bb.left)); blTartib(ws) }
    iz = ws.getTopBlocks(false).map((x) => { const xy = x.getRelativeToSurfaceXY(), hw = x.getHeightWidth(); return [x.id, Math.round(xy.x), Math.round(xy.y), Math.round(hw.height), Math.round(hw.width)].join() }).join('|') + '|' + Math.round(ek.getBoundingClientRect().width)
    clearTimeout(t); t = setTimeout(joyla, 150) // o'zgardi — barqarorligini yana bir bor tekshiradi
  }
  ek.dataset.joylanmoqda = '1' // joylash tugaguncha (dasturchalar ikki ustunda — bir necha bosqich)
  ws.addChangeListener((e) => { if (e.isUiEvent) return; ek.dataset.joylanmoqda = '1'; clearTimeout(t); t = setTimeout(joyla, 120) })
  t = setTimeout(joyla, 300)
}
function labOyinSaqlandi() { try { return !!localStorage.getItem(LAB_OYIN) } catch (e) { return false } }
// ---- chek-list «O‘yiningizda:» (javon ustunining pastida; bola — dars bo'yi to'planadi, ustoz — shu ekrandagi dasturdan) ----
const CHEK = [['strelka', 'To‘rt strelka'], ['qoida', 'Qoida'], ['kalit', 'Kalit va eshik'], ['yulduz', 'Yulduz']]
const chekKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'chek'
function chekSaqlangan() { try { return JSON.parse(localStorage.getItem(chekKalit()) || '{}') || {} } catch (e) { return {} } }
function chekHolat(ek) {
  const bola = labBola(ek), s = bola ? chekSaqlangan() : (ek.__chek = ek.__chek || {})
  if (ek.querySelector('.jr-bl')) { const q = labQoida(ek); if (q.strelka === 4) s.strelka = true; if ((!bola || DARS.chekStatik) && q.ok) s.qoida = true }
  if (DARS.chekStatik) { const d2 = labOlchov(darajaXarita('L2')); if (d2.eshik && d2.kalit && d2.eshikTosadi && d2.kalitYol && d2.yol != null) s.daraja2 = true } // 10-dars: «2-daraja: kalit va eshik»
  return s
}
function chekBelgi(ek, k) {
  const s = chekHolat(ek); if (s[k]) return
  s[k] = true
  if (labBola(ek)) try { localStorage.setItem(chekKalit(), JSON.stringify(s)) } catch (e) {}
  if (ek.querySelector('.chek')) { chekChiz(ek); const r = ek.querySelector('.chek .ch-' + k); if (r && r.animate) r.animate([{ transform: 'scale(1.12)' }, { transform: 'none' }], { duration: 300 }) }
}
function chekChiz(ek) {
  const pl = ek.querySelector('.pl'); if (!pl) return
  pl.querySelectorAll('.chek').forEach((x) => x.remove())
  const c = chekHolat(ek)
  if (labBola(ek) && c.strelka) try { localStorage.setItem(chekKalit(), JSON.stringify(c)) } catch (e) {}
  pl.insertAdjacentHTML('beforeend', chekHtml(c))
}
const chekRoyxat = () => DARS.chek || CHEK
const chekHtml = (c) => '<div class="chek"><small>O‘yiningizda:</small>' + chekRoyxat().map(([k, t]) => '<span class="ch-r ch-' + k + (c[k] ? ' ok' : '') + '"><i>' + (c[k] ? '✓' : '') + '</i>' + t + '</span>').join('') + '</div>'
function labChekYangila(ek, o) {
  const h = o.h, q = labQoida(ek)
  if (q.strelka === 4) chekBelgi(ek, 'strelka')
  if (q.ok && h.yoqSoni > 0) chekBelgi(ek, 'qoida')
  if (h.kalit && h.eshikOchildi) chekBelgi(ek, 'kalit')
}
// yakun ekrani (natijaYoz): chek-list va «O‘yiningiz saqlandi» (faqat haqiqatan saqlangan bo'lsa)
function labNatija(ek) {
  const c = ek.querySelector('.chek-y'); if (c) c.innerHTML = chekHtml(chekSaqlangan())
  const s = ek.querySelector('.saqlandi'); if (s) s.hidden = !(DARS.chekStatik ? labD2() : labOyinSaqlandi())
  // 10-dars: bolaning 2-darajasi, qahramon yulduzda; do'stining natijasi
  if (DARS.chekStatik && ek.querySelector('.katak.maydon')) {
    const k = mdQayta(ek, darajaXarita('L2')), xr = katakXarita(k.dataset.xarita), y = katakTop(xr, '*'), g = k.querySelector('.kt-q')
    if (y && g) { g.style.transform = katakJoy(y[0], y[1]); mdYorliqQoy(k, y[0], y[1]) }
    let x = null; try { x = JSON.parse(localStorage.getItem(LAB_DOST()) || 'null') } catch (e) {} dostKor(ek, x)
  }
}
function oyinKarta(ek) { let bor = false; try { bor = !!localStorage.getItem(LAB_OYIN) } catch (e) {} ek.querySelectorAll('.ok-9').forEach((x) => { x.hidden = !bor }); ek.querySelectorAll('.ok-t').forEach((x) => { x.hidden = bor }) }

// ---- dasturi ko'rinmaydigan o'yin (huk, javob): DARS.oyinlar[nom] = [[tugma, [{ t, yon?, ichki? }…]]…] ----
// studiya[id] = { ish: 'sahnaOyin', dastur, avto? ('→↑…' — «O‘ynab ko‘rsat»: dvigatel o'zi bosadi), soloFaqat? (jonli darsda tugma yo'q) }
// huk kartasi: data-avto, data-dastur, data-lb (oynadagi template.lb-<nom> — kartaning o'z labirinti)
const AVTO_TUGMA = { '→': 'right', '←': 'left', '↑': 'up', '↓': 'down' }
function sahnaDastur(nom) {
  const tug = (x) => { const el = document.createElement('span'); if (x.t === 'x') { const [a, c] = String(x.m || '0,0').split(','); el.dataset.x = a; el.dataset.y = c } if (x.t === 'n') el.dataset.q = x.m || 'qadam'; if (x.t === 's') el.innerHTML = '<span class="inp">' + (x.m || '') + '</span>'; if (x.t === 'z' || x.t === 'c' || x.t === 'i') { const [a, c] = String(x.m).indexOf(':') >= 0 ? String(x.m).split(':') : ['', x.m]; if (a) el.dataset.v = a; el.dataset.n = c } return { el, tur: x.t, yon: x.yon || '', n: x.n || 0, ichki: (x.ichki || []).map(tug) } }
  return ((DARS.oyinlar || {})[nom] || []).map(([tugma, d]) => ({ tugma, daraxt: d.map(tug) }))
}
function bosildiKor(ek, k) {
  const o = ek.querySelector('.oyna'); if (!o) return
  o.querySelectorAll('.oyin-bos').forEach((x) => x.remove())
  o.insertAdjacentHTML('beforeend', '<span class="gl oyin-bos">' + TUGMA_BELGI[k] + '</span>')
  const p = o.querySelector('.oyin-bos'); setTimeout(() => p.remove(), 420)
}
async function sahnaBos(ek, o, k) {
  bosildiKor(ek, k)
  const d = sahnaDastur(o.dastur).filter((x) => x.tugma === k)
  if (!d.length) { await KUT(300); return '' }
  for (const x of d) {
    await ijro(x.daraxt, (t) => SAHNA.katak.bajar(o.h, t), { kut: 140 })
    // 12-dars huk: kaktusga tegdi — kaktus dasturchasi (game over bo'lsa — o'yin tugadi)
    if (o.h.urildi && o.h.urildi.kaktus && sahnaDastur(o.dastur).some((y) => y.tugma === 'cactus')) { o.h.urildi = null; for (const y of sahnaDastur(o.dastur).filter((z) => z.tugma === 'cactus')) { await ijro(y.daraxt, (t) => ballBlok(ek, o.h, t), { kut: 420 }); if (ek.__tugadi) return 'tugadi' } return '' }
    if (o.h.urildi) return 'urildi'
  }
  // 11-dars huk: olma terilganda — o'sha olma turining dasturchasi (gap — pufak ko'rinsin deb sekinroq)
  const tg = sahnaDastur(o.dastur).some((x) => x.tugma === 'apple' || x.tugma === 'gold') ? ballTegdi(o) : ''
  if (tg) for (const x of sahnaDastur(o.dastur).filter((y) => y.tugma === tg)) await ijro(x.daraxt, (t) => ballBlok(ek, o.h, t), { kut: 520 })
  return ''
}
const sahnaYetdi = (h) => h.yulduz && h.x === h.yulduz[0] && h.y === h.yulduz[1]
async function sahnaAvto(ek, nom, ketma, lbs) {
  ek.dataset.yuryapti = '1'
  muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove())
  // 10-dars: lbs — darajalar (DARS.labirintlar nomlari); ketma — har daraja uchun '|' bilan; dastur bo'sh — Bo'shvoy (huk A)
  if (lbs) { mdQayta(ek, darajaXarita(lbs[0])); darajaYoz(ek, 0, lbs.length) }
  const o = { h: await SAHNA.katak.boshla(ek, {}), dastur: nom, daraja: 0 }
  if (!sahnaDastur(nom).length) { await KUT(300); bosildiKor(ek, AVTO_TUGMA[ketma[0]] || 'right'); chal('muammo'); muammo(ek, 'boshvoy', 'Men nimani kutaman?'); delete ek.dataset.yuryapti; return 'bosh' }
  let nat = 'kam'
  for (const ch of [...ketma]) {
    if (!document.body.contains(ek)) break
    if (ch === '|') continue
    const r = await sahnaBos(ek, o, AVTO_TUGMA[ch])
    if (r === 'urildi') { nat = 'urildi'; chal('muammo'); muammo(ek, 'tosiqvoy', 'Devor!'); break }
    if (r === 'tugadi') { nat = 'tugadi'; ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-tugadi">O‘yin tugadi</span>'); chal('tuk'); break } // 12-dars huk
    if (sahnaYetdi(o.h)) { if (lbs && o.daraja < lbs.length - 1) { await sahnaDarajaKeyingi(ek, o, lbs); continue } nat = 'yetdi'; break }
    await KUT(260)
  }
  delete ek.dataset.yuryapti
  return nat
}
function sahnaOyinTayyorla(ek, ildiz) {
  const t = TOP(ek.dataset.id), solo = typeof SOLO !== 'undefined' && SOLO
  oyinToxtat(ek); katakAsl(ek); delete ek.dataset.yuryapti
  ek.querySelectorAll('.muam,.konfeti,.oyin-bos').forEach((x) => x.remove())
  if (t.darajalar) { mdQayta(ek, darajaXarita(t.darajalar[0])); darajaYoz(ek, 0, t.darajalar.length) } // 10-dars
  if (t.dost) { let x = null; try { x = JSON.parse(localStorage.getItem(LAB_DOST()) || 'null') } catch (e) {} dostKor(ek, x) }
  if (t.soloFaqat && !solo) return
  const fo = ek.querySelector('.hn'); if (!fo || fo.querySelector('.so-t')) return
  const yoz = '<span class="mas ishga so-t">' + (t.tugma || (t.avto ? '▶ O‘ynab ko‘rsat' : '▶ Boshlash')) + '</span>', a = fo.querySelector('.asos')
  if (a) a.insertAdjacentHTML('beforebegin', yoz); else fo.insertAdjacentHTML('afterbegin', yoz)
  const tb = fo.querySelector('.so-t'); tb.dataset.asl = tb.innerHTML
  if (t.gap && t.gap.boshla && GAPT(t.gap.boshla)) ishora(ek, GAPT(t.gap.boshla))
}
function sahnaOyinBosish(e, ek, ildiz) {
  const tb = e.target.closest('.hn .so-t'); if (!tb) return false
  if (ek.dataset.yuryapti) return true
  const t = TOP(ek.dataset.id), g = t.gap || {}
  if (t.avto) { ishora(ek, ''); sahnaAvto(ek, t.dastur, t.avto, t.darajalar).then((r) => { if (r === 'yetdi') konfeti(ek); if (g[r] && GAPT(g[r])) ishora(ek, GAPT(g[r])) }); return true }
  if (ek.dataset.oyin) { const o = OYIN.get(ek); if (t.dost && o) dostYoz(ek, o, t.darajalar || ['D1']); sahnaOyinToxtat(ek); return true }
  sahnaOyinBoshla(ek); return true
}
async function sahnaOyinBoshla(ek) {
  muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove())
  const t = TOP(ek.dataset.id)
  if (t.darajalar) { mdQayta(ek, darajaXarita(t.darajalar[0])); darajaYoz(ek, 0, t.darajalar.length) }
  if (t.dost) { DARS.oyinlar = DARS.oyinlar || {}; DARS.oyinlar.__dost = bolaDastur(); ek.querySelectorAll('.dost-n').forEach((x) => x.remove()) } // do'st bolaning dasturi bilan o'ynaydi (dastur ko'rinmaydi)
  const h = await SAHNA.katak.boshla(ek, {})
  OYIN.set(ek, { h, dastur: t.dost ? '__dost' : t.dastur, daraja: 0, yoqOld: 0 }); ek.dataset.oyin = 'sahna'
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-yz">O‘yin: strelkalarni bosing</span>')
  const tb = ek.querySelector('.hn .so-t'); if (tb) tb.textContent = '■ To‘xtatish'
}
async function sahnaOyinBos(ek, k, o) {
  if (k === 'space') return
  ek.dataset.yuryapti = '1'; muammoOl(ek)
  const r = await sahnaBos(ek, o, k)
  delete ek.dataset.yuryapti
  if (OYIN.get(ek) !== o) return
  const t = TOP(ek.dataset.id), lbs = t.darajalar
  if (r === 'urildi') { o.h.urildi = null; if (t.dost) dostYoz(ek, o, lbs || ['D1']); sahnaOyinToxtat(ek); chal('muammo'); muammo(ek, 'tosiqvoy', 'Devor!'); ishora(ek, 'O‘yin to‘xtadi. Qaytadan — «▶ Boshlash»'); return }
  if (sahnaYetdi(o.h)) {
    if (lbs && o.daraja < lbs.length - 1) { ek.dataset.yuryapti = '1'; await sahnaDarajaKeyingi(ek, o, lbs); delete ek.dataset.yuryapti; return }
    o.yutdi = true; if (t.dost) dostYoz(ek, o, lbs || ['D1'])
    sahnaOyinToxtat(ek); ishora(ek, 'Siz yutdingiz!'); konfeti(ek)
  }
}
function sahnaOyinToxtat(ek) { oyinToxtat(ek); const tb = ek.querySelector('.hn .so-t'); if (tb && tb.dataset.asl) tb.innerHTML = tb.dataset.asl }
// huk kartasi — avto o'yin: kartaning labirinti (data-lb) va dasturi bilan o'sha bosishlar; natija kartada
function lbAlmash(ek, lb) {
  const kt = ek.querySelector('.oyna .katak'); if (!kt) return
  if (!ek.__lbAsl) ek.__lbAsl = kt.outerHTML
  if ((ek.dataset.lbHozir || '') === (lb || '')) return
  const tpl = lb && ek.querySelector('template.lb-' + lb)
  kt.outerHTML = tpl ? tpl.innerHTML : ek.__lbAsl; ek.dataset.lbHozir = lb || ''
}
async function hukAvto(ek, k, i) {
  if (ek.dataset.yuryapti) return
  const g = TOP(ek.dataset.id).gap || {}
  ek.querySelectorAll('.jk').forEach((x) => x.classList.toggle('sinov', x === k)); ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  k.classList.remove('n-ok', 'n-yoq'); k.querySelectorAll('.jn').forEach((x) => x.remove())
  lbAlmash(ek, k.dataset.lb || '')
  const bk = ek.querySelector('.oyna .ball-k:not([data-v])'); if (bk) bk.classList.toggle('yashirin', !k.dataset.ball) // 11-dars: kapsula faqat C kartasida
  if (ek.querySelector('.oyna .ball-k')) { vBosh(ek, k.dataset.v0 || 0); ek.__tugadi = false; ek.querySelectorAll('.oyin-tugadi').forEach((x) => x.remove()) } // 12-dars: data-v0 «jon:3»
  const r = await sahnaAvto(ek, k.dataset.dastur, k.dataset.avto, k.dataset.lbs ? k.dataset.lbs.split(',') : null), ok = k.dataset.ok ? k.dataset.ok === '1' : r === 'yetdi'
  k.classList.remove('sinov'); k.classList.add(ok ? 'n-ok' : 'n-yoq')
  ;(k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<small class="jn">' + (k.dataset.nat || (ok ? g.yetdi : g.urildi)) + '</small>')
  if (ok) konfeti(ek)
  ek.dataset.huk = Math.max(+(ek.dataset.huk || 0), i + 1)
  const a = ek.querySelector('.hn .asos'); if (a && g.keyingi) a.textContent = g.keyingi
}

// ===== 10-dars (20.11, manba 010): labirint yasash, o'lchovlar, darajalar, «Do‘stingiz o‘ynaydi» =====
// bosh.yasash — studiyada javon o'rnida «Labirint» asboblari (DARS.palQosh.L), katakni bosib labirint o'zgaradi; bosh.kerak — pog'ona sharti
// ({ devor, yol, burilish, boshiBerk, eshik, qaytish }), bosh.olchov — o'lchov qatoridagi bandlar; «▶ Sinab ko‘rish» — shu labirintni o'yin rejimida
// o'ynash (bola o'zi yutishi — pog'onaning ikkinchi sharti). bosh.darajalar — o'yin labirintlar ro'yxati bilan ([nom…]: DARS.labirintlar, 'L2' — bola yasagani).
const LAB_D2 = 'jr-labirint-daraja2' // bola yasagan 2-daraja (keyingi darslar ham o'qiydi — dars kalitisiz)
function labD2() { try { return localStorage.getItem(LAB_D2) || '' } catch (e) { return '' } }
function darajaXarita(nom) { return nom === 'L2' ? (labD2() || (DARS.labirintlar || {}).BOSH || '') : ((DARS.labirintlar || {})[nom] || nom) }
const labYoq = (o) => (o.yoqOld || 0) + ((o.h && o.h.yoqSoni) || 0) // hamma darajadagi «yo'q»lar
// o'lchovlar (manba «O'lchovlar»; sinov — labirint.mjs dagi mustaqil hisob): yol — startdan yulduzgacha eng qisqa yo'l (kalit va eshik bilan; kalitsiz eshik — devor),
// burilish — eng qisqa yo'llar orasida eng kami (orqaga qaytish ham burilish), boshiBerk — ochiq katak (start, yulduz, kalit emas), to'rt qo'shnisidan bittasi ochiq,
// eshikTosadi — eshik devor bo'lsa yulduzga yo'l yo'q, kalitYol — kalitga eshikdan o'tmay yetiladi, qaytish — hamma eng qisqa yo'lda biror katakdan ikki marta o'tiladi
const LAB_D4 = [[1, 0], [-1, 0], [0, -1], [0, 1]]
function labOlchov(xarita) {
  const xr = katakXarita(xarita), H = xr.length, W = Math.max(...xr.map((r) => r.length)), c = (x, y) => (xr[y] || '')[x]
  const S = katakTop(xr, 'S') || [0, H - 1], Y = katakTop(xr, '*'), K = katakTop(xr, 'K'), E = katakTop(xr, 'E')
  let devor = 0, boshiBerk = 0
  const ochiq0 = (x, y) => { const ch = c(x, y); return ch !== undefined && ch !== '#' }
  xr.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '#') devor++; else if ('S*K'.indexOf(ch) < 0 && LAB_D4.filter(([dx, dy]) => ochiq0(x + dx, y + dy)).length === 1) boshiBerk++ }))
  const ochiq = (x, y, k, eshikDevor) => { const ch = c(x, y); if (ch === undefined || ch === '#') return false; return ch === 'E' ? !eshikDevor && !!k : true }
  const qidir = (eshikDevor) => {
    if (!Y) return null
    const id = (x, y, k, d) => ((y * W + x) * 2 + k) * 5 + d, dist = new Map(), bur = new Map(), nav = [[S[0], S[1], 0, 4]]
    dist.set(id(S[0], S[1], 0, 4), 0); bur.set(id(S[0], S[1], 0, 4), 0)
    let eng = null
    for (let i = 0; i < nav.length; i++) {
      const [x, y, k, d] = nav[i], j = id(x, y, k, d), dd = dist.get(j), bb = bur.get(j)
      if (eng && dd > eng.d) break
      if (x === Y[0] && y === Y[1]) { if (!eng || bb < eng.b) eng = { d: dd, b: bb }; continue }
      LAB_D4.forEach(([dx, dy], nd) => {
        const nx = x + dx, ny = y + dy; if (!ochiq(nx, ny, k, eshikDevor)) return
        const nk = k || c(nx, ny) === 'K' ? 1 : 0, nj = id(nx, ny, nk, nd), nb = bb + (d !== 4 && d !== nd ? 1 : 0)
        if (!dist.has(nj)) { dist.set(nj, dd + 1); bur.set(nj, nb); nav.push([nx, ny, nk, nd]) } else if (dist.get(nj) === dd + 1 && nb < bur.get(nj)) bur.set(nj, nb)
      })
    }
    return eng
  }
  const eng = qidir(false), r = { devor, boshiBerk, yol: eng ? eng.d : null, burilish: eng ? eng.b : null, kalit: !!K, eshik: !!E, eshikTosadi: false, kalitYol: false, qaytish: false }
  if (E) r.eshikTosadi = !qidir(true)
  if (K) { const kor = new Set([S.join()]), nav = [S]; for (let i = 0; i < nav.length; i++) { const [x, y] = nav[i]; if (x === K[0] && y === K[1]) { r.kalitYol = true; break } LAB_D4.forEach(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (ochiq(nx, ny, 0, true) && !kor.has(nx + ',' + ny)) { kor.add(nx + ',' + ny); nav.push([nx, ny]) } }) } }
  // borib qaytish: eshik bo'lib kalit kerak bo'lsa — uzunligi «yol» ga teng, hech bir katakdan ikki marta o'tmaydigan yo'l bormi (to'liq qidiruv, 7 × 5 — kichik)
  if (eng && E && K && r.eshikTosadi) {
    const man = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]), qolgan = (x, y, k) => (k ? man([x, y], Y) : man([x, y], K) + man(K, Y)), bor = new Set([S.join()])
    const dfs = (x, y, k, n) => { if (x === Y[0] && y === Y[1]) return n === eng.d; if (n + qolgan(x, y, k) > eng.d) return false; for (const [dx, dy] of LAB_D4) { const nx = x + dx, ny = y + dy, kk = nx + ',' + ny; if (!ochiq(nx, ny, k, false) || bor.has(kk)) continue; bor.add(kk); const ok = dfs(nx, ny, k || c(nx, ny) === 'K' ? 1 : 0, n + 1); bor.delete(kk); if (ok) return true } return false }
    r.qaytish = !dfs(S[0], S[1], 0, 0)
  }
  return r
}
// labirintni qayta chizish (yasash, darajalar): yangi maydon, qahramon (o'z SVG'si bilan) o'sha guruhda qoladi
function mdQayta(ek, xarita) {
  const k = ek.querySelector('.oyna .katak.maydon'); if (!k || !xarita) return null
  if (k.dataset.xarita === katakXarita(xarita).join('|') && k.dataset.qayta) return k
  const q = k.querySelector('.kt-q'), m = mdXaritaM(xarita), t = document.createElement('div')
  t.innerHTML = maydonHtml(m, {}); const yk = t.firstElementChild, yq = yk.querySelector('.kt-q'); yk.dataset.qayta = '1'
  if (q && yq) { q.querySelectorAll('.kt-qk').forEach((x) => x.remove()); const yk2 = yq.querySelector('.kt-qk'); if (yk2) q.appendChild(yk2); yq.replaceWith(q) }
  k.replaceWith(yk)
  return yk
}
function darajaYoz(ek, i, n) { const o = ek.querySelector('.oyna'); if (!o) return; let d = o.querySelector('.daraja-yz'); if (!d) { o.insertAdjacentHTML('beforeend', '<span class="gl daraja-yz"></span>'); d = o.querySelector('.daraja-yz') } d.innerHTML = 'Daraja: <b>' + (i + 1) + ' / ' + n + '</b>' }
// daraja yutildi — «2-daraja!» (~1,4 s), keyingi labirint, qahramon startda, kalit labirintniki (har daraja boshidan)
async function darajaKeyingi(ek, o, b) {
  o.daraja = (o.daraja || 0) + 1; o.yoqOld = labYoq(o)
  ek.dataset.yuryapti = '1'; chal('yulduz')
  const ob = ek.querySelector('.oyna'); ob.querySelectorAll('.daraja-otdi').forEach((x) => x.remove()); ob.insertAdjacentHTML('beforeend', '<span class="gl daraja-otdi">' + (o.daraja + 1) + '-daraja!</span>')
  await KUT(1400)
  ob.querySelectorAll('.daraja-otdi').forEach((x) => x.remove())
  if (OYIN.get(ek) !== o) { delete ek.dataset.yuryapti; return }
  mdQayta(ek, darajaXarita(b.darajalar[o.daraja])); darajaYoz(ek, o.daraja, b.darajalar.length)
  o.h = await SAHNA.katak.boshla(ek, b)
  delete ek.dataset.yuryapti
}
// ---- labirint yasash ----
function yasashXarita(ek) { return (ek.querySelector('.oyna .katak') || {}).dataset.xarita || '' }
function yasashTayyorla(ek) {
  const b = TOP(ek.dataset.id).bosh, solo = typeof SOLO !== 'undefined' && SOLO
  const nom = labBola(ek) ? 'L2' : (solo && b.xaritaSolo) || b.xarita || 'BOSH'
  mdQayta(ek, darajaXarita(nom)); darajaYoz(ek, 1, 2)
  ek.dataset.asb = 'devor'; ek.querySelectorAll('.pl .asb').forEach((x) => x.classList.toggle('on', x.dataset.t === 'devor'))
  const tb = oyinTugma(ek); if (tb && tb.classList.contains('ishga')) { tb.textContent = '▶ Sinab ko‘rish'; tb.dataset.asl = tb.innerHTML }
  olchovYoz(ek); yasashMuammo(ek, false)
  if (TOP(ek.dataset.id).gap && TOP(ek.dataset.id).gap.boshla) ishora(ek, GAPT(TOP(ek.dataset.id).gap.boshla))
}
const OLCHOV_YOZ = {
  devor: (o, k) => 'Devor: ' + o.devor + (k.devor ? ' / ' + k.devor : ''),
  yol: (o, k) => (o.yol == null ? 'Yo‘l yo‘q' : 'Yo‘l: ' + o.yol + (k.yol ? ' / ' + k.yol : '') + ' qadam'),
  burilish: (o, k) => 'Burilish: ' + (o.burilish == null ? 0 : o.burilish) + (k.burilish ? ' / ' + k.burilish : ''),
  boshiBerk: (o, k) => 'Boshi berk yo‘l: ' + o.boshiBerk + (k.boshiBerk ? ' / ' + k.boshiBerk : ''),
  kalit: (o) => 'Kalit ' + (o.kalit ? '✓' : '—'), eshik: (o) => 'Eshik ' + (o.eshik ? '✓' : '—'),
  qaytish: (o) => 'Borib qaytish: ' + (o.qaytish ? 'bor' : 'yo‘q'),
}
function olchovYoz(ek) {
  const b = TOP(ek.dataset.id).bosh, k = b.kerak || {}, o = labOlchov(yasashXarita(ek)), f = b.olchov || ['devor', 'yol']
  const qism = f.map((x) => OLCHOV_YOZ[x](o, k)); if (o.yol == null && f.indexOf('yol') < 0) qism.push('Yo‘l yo‘q')
  const ob = ek.querySelector('.oyna'); let s = ob.querySelector('.olchov'); if (!s) { ob.insertAdjacentHTML('beforeend', '<span class="gl olchov"></span>'); s = ob.querySelector('.olchov') }
  s.textContent = qism.join(' · '); s.classList.toggle('yoq', o.yol == null)
  return o
}
function kerakOk(o, k) { return o.yol != null && (!k.devor || o.devor >= k.devor) && (!k.yol || o.yol >= k.yol) && (!k.burilish || o.burilish >= k.burilish) && (!k.boshiBerk || o.boshiBerk >= k.boshiBerk) && (!k.eshik || (o.eshik && o.kalit && o.eshikTosadi && o.kalitYol)) && (!k.qaytish || o.qaytish) }
function kerakGap(o, k) {
  if (k.devor && o.devor < k.devor) return 'Devor: ' + o.devor + ' ta. Kerak: kamida ' + k.devor
  if (k.yol && o.yol < k.yol) return 'Yo‘l: ' + o.yol + ' qadam. Kerak: kamida ' + k.yol
  if (k.burilish && o.burilish < k.burilish) return 'Burilish: ' + o.burilish + '. Kerak: kamida ' + k.burilish
  if (k.boshiBerk && o.boshiBerk < k.boshiBerk) return 'Boshi berk yo‘l: ' + o.boshiBerk + '. Kerak: kamida ' + k.boshiBerk
  if (k.eshik && !o.eshik) return 'Eshik qo‘ying — yulduzga yo‘lni to‘ssin'
  if (k.qaytish && !o.qaytish) return 'Borib qaytish: yo‘q. Kalitni yo‘ldan chetga qo‘ying'
  return ''
}
// labirint o'zgarganda: yo'l yo'q / kalit qani / eshik keraksiz — muammocha; shart bajarilgan, hali o'ynalmagan — ishora
function yasashMuammo(ek, boshlandi) {
  muammoOl(ek)
  const b = TOP(ek.dataset.id).bosh, o = labOlchov(yasashXarita(ek)), k = b.kerak || {}
  // tartib (manba 10-qadam): eshik yo'lni to'smasa — «Eshik keraksiz!» (kalit bo'lmasa ham); to'sadi, kalit yo'q yoki eshik ortida — «Kalit qani?»; keyin — yo'l yo'q
  if (o.eshik && !o.eshikTosadi) { chal('muammo'); ishora(ek, 'Yulduzga eshikdan o‘tmay ham boriladi. Eshik yo‘lni to‘ssin'); muammo(ek, 'ortiqvoy', 'Eshik keraksiz!'); return o }
  if (o.eshik && (!o.kalit || !o.kalitYol)) { chal('muammo'); ishora(ek, 'Kalitga eshikdan o‘tmasdan yetib bo‘ladigan joy toping'); muammo(ek, 'kamvoy', 'Kalit qani?'); return o }
  if (o.yol == null) { chal('muammo'); ishora(ek, 'Yulduzga yo‘l yo‘q. Qaysi devorni olib tashlaysiz?'); muammo(ek, 'kamvoy', 'Yo‘l yo‘q!'); return o }
  if (b.kerak && kerakOk(o, k) && labBola(ek)) ishora(ek, 'Labirint tayyor. Endi o‘zingiz o‘ynab ko‘ring — «Sinab ko‘rish»')
  return o
}
function yasashBosish(e, ek, ildiz) {
  if (ek.dataset.oyin) return null
  const a = e.target.closest('.pl .asb')
  if (a) { ek.dataset.asb = a.dataset.t; /* data-t: data-a — qobiqning tasma tugmalariniki */ ek.querySelectorAll('.pl .asb').forEach((x) => x.classList.toggle('on', x === a)); chal('bos'); return true }
  const c = mdBosilgan(e, ek); if (!c) return null
  if (ek.dataset.yuryapti) return true
  if (!c[0] && !c[1]) { ishora(ek, 'Start — (0, 0). Unga hech narsa qo‘yilmaydi'); return true }
  const xr = katakXarita(yasashXarita(ek)).map((r) => [...r]), H = xr.length, q = H - 1 - c[1], x = c[0], ch = xr[q][x], asb = ek.dataset.asb || 'devor'
  const qoy = (b) => { xr.forEach((r) => r.forEach((v, i) => { if (v === b) r[i] = '.' })); xr[q][x] = b }
  if (asb === 'devor') { if (ch === '*') { ishora(ek, 'Yulduzni «Yulduz» asbobi bilan ko‘chiring'); return true } xr[q][x] = ch === '#' ? '.' : '#' }
  else { const b = { kalit: 'K', eshik: 'E', yulduz: '*' }[asb]; if (ch === '*' && b !== '*') { ishora(ek, 'Yulduzni «Yulduz» asbobi bilan ko‘chiring'); return true } if (ch === b) { if (b !== '*') xr[q][x] = '.' } else qoy(b) }
  const yangi = xr.map((r) => r.join('')).join('|')
  chal('bos'); mdQayta(ek, yangi); katakAsl(ek)
  if (labBola(ek)) try { localStorage.setItem(LAB_D2, yangi) } catch (e2) {}
  olchovYoz(ek); yasashMuammo(ek, false); if (DARS.chekStatik && ek.querySelector('.chek')) chekChiz(ek)
  return true
}
// «Sinab ko‘rish» da yutdi: pog'ona sharti (o'lchov) — bajarilsa «Labirint tayyor!», keyingi pog'ona; bo'lmasa Kamvoy, haqiqiy son bilan
function yasashYutdi(ek, o) {
  const t = TOP(ek.dataset.id), b = t.bosh, g = t.gap || {}, k = b.kerak, ol = labOlchov(yasashXarita(ek))
  oyinToxtat(ek); muammoOl(ek)
  if (!k) { ishora(ek, 'Siz yutdingiz!'); konfeti(ek); return }
  if (!kerakOk(ol, k)) { chal('muammo'); ishora(ek, kerakGap(ol, k)); muammo(ek, 'kamvoy', 'Oz qoldi!'); return }
  ishora(ek, g.yetdi ? GAPT(g.yetdi) : 'Labirint tayyor!'); konfeti(ek)
  if (!labBola(ek) || ek.dataset.oqish) return
  oxirgiSaqla(ek)
  if (ol.eshik && ol.kalit && ol.eshikTosadi && ol.kalitYol) chekBelgi(ek, 'daraja2')
  if (typeof blokQosh === 'function') { blokQosh('L2', [...Array.from({ length: ol.devor }, () => ({ dataset: { tur: 'D' } })), ...Array.from({ length: ol.yol || 0 }, () => ({ dataset: { tur: 'Q' } }))]); blokQosh(ek.dataset.id, [{ dataset: { tur: 'y' } }]) }
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  setTimeout(() => bolaKeyingi(), 1400)
}
// ---- dasturi ko'rinmaydigan o'yin darajalar bilan (huk, «Do‘stingiz o‘ynaydi») ----
// saqlangan Blockly dasturi (serialization) → DARS.oyinlar shakli: [[tugma, [{ t, yon?, m?, ichki? }]]]
function blJsonDaraxt(bl) {
  const zanjir = (b) => { const r = []; while (b) { const t = BL_TURI[b.type] || 's', f = b.fields || {}, n = { t }; if (t === 'a') n.yon = f.YON; if (t === 'x') n.m = f.X + ',' + f.Y; if (t === 'n') n.m = f.NOM; if (b.inputs && b.inputs.DO && b.inputs.DO.block) n.ichki = zanjir(b.inputs.DO.block); r.push(n); b = b.next && b.next.block } return r }
  return (((bl || {}).blocks || {}).blocks || []).filter((b) => b.type === 'when_key').map((b) => [(b.fields || {}).KEY, zanjir(b.next && b.next.block)])
}
// bolaning o'yin dasturi (o'zi saqlagan → 9-dars → tayyor)
function bolaDastur() {
  let bl = null; try { bl = JSON.parse(localStorage.getItem(labKalit()) || 'null') || (JSON.parse(localStorage.getItem(LAB_OYIN) || 'null') || {}).bl || null } catch (e) {}
  return bl ? blJsonDaraxt(bl) : (DARS.oyinlar || {})[DARS.oyinTayyor] || []
}
async function sahnaDarajaKeyingi(ek, o, lbs) {
  o.daraja++; o.yoqOld = (o.yoqOld || 0) + (o.h.yoqSoni || 0); chal('yulduz')
  const ob = ek.querySelector('.oyna'); ob.insertAdjacentHTML('beforeend', '<span class="gl daraja-otdi">' + (o.daraja + 1) + '-daraja!</span>')
  await KUT(1400); ob.querySelectorAll('.daraja-otdi').forEach((x) => x.remove())
  mdQayta(ek, darajaXarita(lbs[o.daraja])); darajaYoz(ek, o.daraja, lbs.length); o.h = await SAHNA.katak.boshla(ek, {})
}
// «Do‘stingiz o‘ynaydi»: natija egasining noutbukida (do'st qancha darajani yutdi, necha marta devor oldida to'xtadi; yo'li — labirintda oltin iz)
const LAB_DOST = () => (typeof K !== 'undefined' ? K : 'jr-') + 'dost'
function dostYoz(ek, o, lbs) {
  const n = o.yutdi ? lbs.length : o.daraja || 0, yoq = (o.yoqOld || 0) + (o.h.yoqSoni || 0), x = { n, jami: lbs.length, yoq }
  try { localStorage.setItem(LAB_DOST(), JSON.stringify(x)) } catch (e) {}
  dostKor(ek, x)
  if (o.yutdi || (o.daraja || 0) > 0 || (o.h && o.h.qadamlar > 0)) { /* do'st haqiqatan o'ynadi (kamida bir qadam) */ chekBelgi(ek, 'dost'); if (typeof blokQosh === 'function') blokQosh('BD', [{ dataset: { tur: 'w' } }]); const pg = TOP(ek.dataset.id).pog; if (pg && typeof pogQosh === 'function') pogQosh(pg) } // doska: «O‘ynab ko‘rildi» — shu pog'ona
}
// natija kartasi faqat natija bo'lganda qo'shiladi (yashirin bo'sh karta setka o'lchovini buzardi): BD — «Joyingizga qayting», B5 — sonlar ostida
function dostKor(ek, x) {
  if (!x) return
  let d = ek.querySelector('.dost-n'); const ch = ek.querySelector('.chap'); if (!d && !ch) return
  if (!d) { const o = ch.querySelector('.dost-o'); (o || ch).insertAdjacentHTML('beforeend', '<div class="gl dost-n">' + (o ? '<small>Joyingizga qayting</small>' : '') + '<b></b></div>'); d = ek.querySelector('.dost-n') }
  d.hidden = false; d.querySelector('b').textContent = 'Do‘stingiz o‘ynadi: ' + x.n + ' / ' + x.jami + ' daraja · ' + x.yoq + ' marta devor oldida to‘xtadi'
}

// ===== 11-dars (21.11, manba 011): o'zgaruvchi — ball sanash o'yini va oldindan aytish =====
// bosh.ball — o'yin (bosh.oyin) bog' maydonida: boshqaruv (to'rt strelka) tayyor va dasturda ko'rinmaydi (.bq-q qatori, bosilsa ochiladi); bola dasturchalari —
// when touching apple / gold apple (olma terilganda) va when ▶ clicked (o'yin boshida, birinchi bosishdan oldin). Sonlar — ek.__v (12-dars: bir nechta o'zgaruvchi): «▶ Boshlash» qayta bosilganda
// o'zgarmaydi (bosh.saqla; 1-bekatda set bloki hali yo'q — bola tuzata olmay qolmasin deb, har o'yin pog'ona sonidan boshlanadi — «Qurishdagi qarorlar» 2).
// bosh.v — pog'ona ochilgandagi son; bosh.kerak — yutganda ball shu bo'lishi kerak; bosh.erkin — ★ «O‘z o‘yiningiz» (set bor, ikkala olma turiga dasturcha, ball > 0).
// bosh.sonBashorat — oldindan aytish: dastur tayyor va o'zgarmaydi; oltita son kartasi (DARS.studiya[id].kartalar), «▶ Tekshirish».
const TUR_STR = { right: 'r', left: 'l', up: 'u', down: 'd' }
function turla(d) { return d.map((t) => { t.tur = blokTuri(t.el); if (t.tur === 'p' && !t.n) t.n = blokSon(t.el); t.ichki = turla(t.ichki || []); return t }) }
// 12-dars: bir nechta o'zgaruvchi — ek.__v { ball, jon, qadam }; blokning o'zgaruvchisi — Blockly maydoni VAR yoki HTML data-v (bo'lmasa ball)
function ozgNom(el) { const b = el && el.dataset && el.dataset.id && typeof blBlok === 'function' ? blBlok(el) : null; return (b && b.getField('VAR') ? b.getFieldValue('VAR') : (el && el.dataset && el.dataset.v)) || 'ball' }
function vOl(ek, n) { return (ek.__v || {})[n] || 0 }
function vQoy(ek, n, v) { (ek.__v = ek.__v || {})[n] = v }
// boshlang'ich sonlar: bosh.v — son (ball, 11-dars) yoki { jon: 3 } yoki «jon:3» (huk kartasi)
function vBosh(ek, v) { ek.__v = {}; if (typeof v === 'number') ek.__v.ball = v; else if (typeof v === 'string') v.split(',').forEach((x) => { const [n, s] = x.split(':'); if (n) ek.__v[n] = +s || 0 }); else Object.assign(ek.__v, v || {}); ek.querySelectorAll('.oyna .ball-k').forEach((k) => ballKor(ek, vOl(ek, k.dataset.v || 'ball'), null, null, k.dataset.v || 'ball')) }
const sonK = (v) => (v < 0 ? '−' + -v : String(v)) // manfiy son — minus belgisi bilan
function kapsula(ek, n) { return ek.querySelector('.oyna .ball-k[data-v="' + n + '"]') || (n === 'ball' ? ek.querySelector('.oyna .ball-k:not([data-v]), .oyna .bsh-k') : null) }
function ballKor(ek, v, plus, q, n = 'ball') {
  const kap = kapsula(ek, n), k = kap && kap.querySelector('b'); if (!k) return
  k.textContent = v == null ? '?' : sonK(v)
  if (plus == null) return
  kap.classList.remove('bump'); void kap.offsetWidth; kap.classList.add('bump'); setTimeout(() => kap.classList.remove('bump'), 220)
  chal('bos')
  // qahramon ustida kichik «+N» / «−N» uchadi
  const o = ek.querySelector('.oyna'); if (!o || !q || !plus) return
  const r = q.getBoundingClientRect(), j = o.getBoundingClientRect()
  o.insertAdjacentHTML('beforeend', '<span class="ball-uch" style="left:' + (r.left + r.width / 2 - j.left) + 'px;top:' + (r.top - j.top) + 'px">' + plus + '</span>')
  const u = o.querySelectorAll('.ball-uch'); setTimeout(() => u[u.length - 1] && u[u.length - 1].remove(), 950)
}
// 12-dars: sahnada faqat dasturda ishlatilgan o'zgaruvchilarning kapsulasi (.ball-q ichida ostma-ost)
function ozgKorinsin(ek) {
  const q = ek && ek.querySelector('.oyna .ball-q'); if (!q) return
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek), bor = new Set((q.dataset.doim || '').split(',').filter(Boolean))
  if (ws) ws.getAllBlocks(false).forEach((b) => { if (b.getField('VAR')) bor.add(b.getFieldValue('VAR')) })
  q.querySelectorAll('.ball-k[data-v]').forEach((k) => k.classList.toggle('yoq', !bor.has(k.dataset.v)))
}
// bitta blok (ijro paytida): set — qo'yadi, change — qo'shadi (yozuv «jon: 2»), if — o'zgaruvchi soni teng bo'lsa «ha», game over — o'yin tugadi
function ballBlok(ek, h, t) {
  if (t.tur === 'z' || t.tur === 'c') {
    const n = ozgNom(t.el), k = blokSon(t.el), v = t.tur === 'z' ? k : vOl(ek, n) + k
    vQoy(ek, n, v); ballKor(ek, v, t.tur === 'z' ? '' : (k < 0 ? '−' + -k : '+' + k), h && h.q, n)
    if (typeof blSanoq === 'function' && t.el.dataset.id) { blSanoq(t.el, n + ': ' + sonK(v)); ballSonRang(t.el) }
    return
  }
  if (t.tur === 'i') { const n = ozgNom(t.el); t.ha = vOl(ek, n) === blokSon(t.el); if (t.ha) ek.__ifOzg = n; if (typeof blShartBelgi === 'function' && t.el.dataset.id) blShartBelgi(t.el, t.ha); return }
  if (t.tur === 'g') { ek.__tugadi = true; return 'toxta' }
  if (h) return SAHNA.katak.bajar(h, t)
}
function ballSonRang(el) { const joy = el.closest && el.closest('.jr-bl'), s = joy && joy.querySelector('.bl-son[data-id="' + el.dataset.id + '"]'); if (s) s.classList.add('bl-ball') }
// qahramon turgan katakdagi olma (terilmagan bo'lsa) — 'apple' | 'gold' | ''; terilgani belgilanadi
function ballTegdi(o) {
  const h = o.h, c = (h.xr[h.y] || '')[h.x], kalit = h.x + ',' + h.y
  o.terildi = o.terildi || new Set()
  if ((c !== 'O' && c !== 'G') || o.terildi.has(kalit)) return ''
  o.terildi.add(kalit); return c === 'G' ? 'gold' : 'apple'
}
function ballOlmaSoni(h) { return h.xr.join('').split('').filter((c) => c === 'O' || c === 'G').length }
const dasturJsonKalit = () => (typeof K !== 'undefined' ? K : 'jr-') + 'dasturJson'
function ballTayyorla(ek) {
  const t = TOP(ek.dataset.id), b = t.bosh
  // 12-dars (DARS.dasturJson): dastur pog'onadan pog'onaga ichma-ich (if ichidagilari bilan) — Blockly'ning o'z saqlash shaklida
  if (b.prog === 'oldingi' && DARS.dasturJson) { let x = null; try { x = JSON.parse(localStorage.getItem(dasturJsonKalit()) || 'null') } catch (e) {} const ws = BL_WS.get(ek); if (x && ws) { ws.clear(); Blockly.serialization.workspaces.load(x, ws); ws.getAllBlocks(false).forEach(blBelgila); blTartib(ws); blMasshtab(ek, ws); blTartibKeyin(ws); sanoq(ek) } }
  vBosh(ek, b.v != null ? b.v : 0)
  ek.__tugadi = false
  ek.querySelectorAll('.ball-iz,.ball-uch,.oyin-tugadi').forEach((x) => x.remove())
  // boshqaruv qatori — dastur sarlavhasidan keyin, Blockly ish maydonidan oldin
  const bq = ek.querySelector('.dst .bq-q'), dsb = ek.querySelector('.dst .dsb'); if (bq && dsb && dsb.nextElementSibling !== bq) dsb.after(bq)
  if (bq) bq.classList.remove('ochiq')
  ballJavon(ek); ozgKorinsin(ek)
}
// javondagi yopiq bloklar (studiya[id].ochiq: { oila: nechtasi ochiq }) — oila almashganda ham (studiyaBosish)
function ballJavon(ek) { const oc = TOP(ek.dataset.id).ochiq, pl = ek.querySelector('.pl'), f = pl && ((pl.querySelector('small') || {}).className || '').replace('f-', ''); if (!oc || !pl || oc[f] == null) return; pl.querySelectorAll('.mbw').forEach((w, i) => w.classList.toggle('yopiq', i >= oc[f])) }
function ballBosish(e, ek, ildiz) {
  const bq = e.target.closest('.dst .bq-q'); if (bq) { if (!e.target.closest('.bq-och')) { bq.classList.toggle('ochiq'); chal('bos') } return true }
  const b = TOP(ek.dataset.id).bosh || {}
  if (b.sonBashorat) return sonBashBosish(e, ek, ildiz)
  return null
}
async function ballBoshla(ek) {
  const id = ek.dataset.id, t = TOP(id), b = t.bosh
  muammoOl(ek); urildiOl(ek); ek.querySelectorAll('.konfeti,.dv-pufak,.ball-iz,.oyin-tugadi').forEach((x) => x.remove())
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  const ds = blDasturchalar(ek), st = ds.filter((x) => x.tur === 'when_start')
  if (st.some((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, 'O‘yin boshida ball nechchi bo‘lsin? Shu blokning ostiga ulang'); muammo(ek, 'boshvoy', 'Boshlandi, lekin nima qilay?'); return }
  if (typeof blShartBosh === 'function' && blShartBosh(ek)) { chal('muammo'); ishora(ek, 'if ichiga blok qo‘ying — shart «ha» bo‘lsa, u bajariladi'); muammo(ek, 'boshvoy', 'Ichi bo‘sh-ku…'); return }
  if (!b.saqla) vBosh(ek, b.v != null ? b.v : 0)
  ek.__tugadi = false; ek.__ifOzg = ''
  ozgKorinsin(ek)
  const h = await SAHNA.katak.boshla(ek, b)
  h.yashirinKut = !!h.k.querySelector('.kt-yul.yashirin')
  const o = { h, bosish: 0, terildi: new Set(), jami: ballOlmaSoni(h), ball0: vOl(ek, 'ball'), set: false, teg: 0, manfiy: {} }
  OYIN.set(ek, o); ek.dataset.oyin = '1'
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-yz">' + (DARS.oyinYozuv || 'O‘yin: strelkalarni bosing') + '</span>')
  const tb = oyinTugma(ek); if (tb) tb.textContent = '■ To‘xtatish'
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek), yetim = ws ? blTepalar(ws).some((x) => !BL_HODISA.has(x.type)) : false
  ishora(ek, yetim ? 'Bu bloklar hech qachon ishlamaydi — tepasiga hodisa bloki qo‘ying' : '')
  // when ▶ clicked — o'yin boshida bir marta, birinchi bosishdan oldin
  if (st.length) {
    ek.dataset.yuryapti = '1'
    for (const x of st) { x.hodisa.classList.add('hozir'); await ijro(turla(x.daraxt), (n) => { if (n.tur === 'z' && ozgNom(n.el) === 'ball') o.set = true; return ballBlok(ek, h, n) }, { kut: 320 }); x.hodisa.classList.remove('hozir'); if (ek.__tugadi) break }
    delete ek.dataset.yuryapti
  }
  o.ball0 = vOl(ek, 'ball'); o.v0 = Object.assign({}, ek.__v)
  if (ek.__tugadi) ballTugadi(ek, o)
}
async function ballBos(ek, k, o) {
  const tur = TUR_STR[k]; if (!tur) return
  o.bosish++; muammoOl(ek)
  ek.dataset.yuryapti = '1'
  const s = ek.querySelector('.dst .bq-q .bq-s i[data-k="' + k + '"]'); if (s) { s.classList.add('hozir'); setTimeout(() => s.classList.remove('hozir'), 320) }
  await SAHNA.katak.bajar(o.h, { tur, el: document.createElement('span') })
  const kaktus = !!(o.h.urildi && o.h.urildi.kaktus); o.h.urildi = null // chetga urilish — «tuk», muammochasiz
  // bosish tartibi (12-dars): 1) yurish yoki kaktusga tegish → tegish dasturchasi; 2) istalgan tugma dasturchasi; 3) yulduz tekshiruvi
  if (kaktus) { o.teg++; await ballTegish(ek, o, 'cactus') }
  else { const tg = ballTegdi(o); if (tg) await ballTegish(ek, o, tg) }
  if (!ek.__tugadi) for (const x of blDasturchalar(ek).filter((d) => d.tur === 'when_key' && d.tugma === 'any')) { x.hodisa.classList.add('hozir'); await ijro(turla(x.daraxt), (n) => ballBlok(ek, o.h, n), { kut: 160 }); x.hodisa.classList.remove('hozir'); if (ek.__tugadi) break }
  delete ek.dataset.yuryapti
  if (OYIN.get(ek) !== o) return
  if (ek.__tugadi) return ballTugadi(ek, o)
  ballKuzat(ek, o)
  ballTekshir(ek, o)
}
async function ballTegish(ek, o, olma) {
  const b = TOP(ek.dataset.id).bosh || {}, d = blDasturchalar(ek).filter((x) => x.tur === 'when_touch' && x.olma === olma)
  if (olma === 'cactus' && (!d.length || d.every((x) => !x.bloklar.length))) { chal('muammo'); ishora(ek, 'Kaktusga tekkanda jon kamaysin — dasturchaga blok ulang'); muammo(ek, 'boshvoy', 'Tegdim — nima qilay?'); return }
  if (!d.length) {
    chal('muammo')
    if (olma === 'gold') { ishora(ek, DARS.oltinGap || 'Oltin olmaga o‘z dasturchasi kerak — hodisa blokida olma turini tanlang'); muammo(ek, 'boshvoy', 'Oltin olma-chi?') }
    else { ishora(ek, 'Olmaga tekkanda nima bo‘lsin? Buning uchun o‘z hodisa bloki bor'); muammo(ek, 'boshvoy', 'Olma terildi, ball-chi?') }
    return
  }
  if (d.every((x) => !x.bloklar.length)) { chal('muammo'); ishora(ek, 'Hodisa blokining ostiga O‘zgaruvchi oilasidan blok ulang'); muammo(ek, 'kamvoy', 'Tegdim, lekin nima qilay?'); return }
  const old = Object.assign({}, ek.__v)
  for (const x of d) { x.hodisa.classList.add('hozir'); await ijro(turla(x.daraxt), (n) => ballBlok(ek, o.h, n), { kut: 220 }); x.hodisa.classList.remove('hozir'); if (ek.__tugadi) return }
  // 12-dars: pog'ona sharti tegish paytida (o'yin davom etadi)
  if (olma === 'gold' && b.oltinJon && !(vOl(ek, 'jon') > (old.jon || 0))) { chal('muammo'); ishora(ek, 'Oltin olma jon bersin — uning dasturchasini tekshiring'); muammo(ek, 'kamvoy', 'Jon-chi?') }
  if (olma === 'cactus' && b.kaktusBall && vOl(ek, 'ball') === (old.ball || 0)) { chal('muammo'); ishora(ek, 'Kaktus jonni ham, 2 ballni ham olsin — kaktus dasturchasini tekshiring'); muammo(ek, 'kamvoy', 'Kaktus-chi?') }
}
const BOSH_HARF = (n) => n.charAt(0).toUpperCase() + n.slice(1)
// 12-dars: o'yin davomida — jon (qadam) 0 dan o'tdi (shart yo'q); qadam o'zgarmayapti (15 · 1)
function ballKuzat(ek, o) {
  const b = TOP(ek.dataset.id).bosh || {}
  for (const n of ['jon', 'qadam']) if (0 > vOl(ek, n) && !o.manfiy[n]) { o.manfiy[n] = true; chal('muammo'); ishora(ek, 'Jon N bo‘ldi, o‘yin esa davom etyapti. Jon 0 bo‘lganda o‘yin tugashi uchun shart kerak'.replace(/Jon/g, BOSH_HARF(n)).replace('N', sonK(vOl(ek, n)))); muammo(ek, 'kamvoy', n === 'qadam' ? 'Qadam tugadi-ku!' : 'Jon tugadi-ku!'); return }
  if (b.sinov && b.sinov.ozg === 'qadam' && o.bosish === 2 && vOl(ek, 'qadam') === ((o.v0 || {}).qadam || 0) && !o.qadamGap) { o.qadamGap = true; chal('muammo'); ishora(ek, 'Har bosishda qadam kamaysin: qaysi hodisa bloki har bosishda ishlaydi?'); muammo(ek, 'kamvoy', 'Qadam-chi?') }
}
// dasturda o'zgaruvchi qoidasi bormi: if <n> = 0 then ichida game over — jon uchun kaktus dasturchasida, qadam uchun istalgan tugma dasturchasida
function qoidaBor(ek, n) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (!ws) return false
  return ws.getBlocksByType('if_var', false).some((b) => { const r = b.getRootBlock(); return b.getFieldValue('VAR') === n && b.getFieldValue('N') === '0' && blZanjir(b.getInputTargetBlock('DO')).some((x) => x.type === 'game_over') && (n === 'qadam' ? r.type === 'when_key' && r.getFieldValue('KEY') === 'any' : r.type === 'when_touch' && r.getFieldValue('OLMA') === 'cactus') })
}
function dasturchaBlok(ek, olma, f) { return blDasturchalar(ek).filter((x) => x.tur === 'when_touch' && x.olma === olma).some((x) => x.bloklar.some((el) => f(el))) }
// game over: «O‘yin tugadi» taxtasi; sinov pog'onasida — shu lahzadagi son bilan baho; yutish pog'onasida — muammo emas
function ballTugadi(ek, o) {
  const id = ek.dataset.id, t = TOP(id), b = t.bosh || {}, s = b.sinov
  oyinToxtat(ek)
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-tugadi">O‘yin tugadi</span>')
  chal('tuk')
  if (s) {
    const v = vOl(ek, s.ozg)
    if (v === 0 && (!s.teg || o.teg === s.teg) && (!s.bosish || o.bosish === s.bosish)) return ballYutdi(ek, o, s.ozg === 'qadam' ? 'Shart ishladi: qadam 0 — o‘yin tugadi!' : 'Shart ishladi: jon 0 — o‘yin tugadi!', true)
    chal('muammo')
    if (v === 0) { ishora(ek, s.teg ? s.tegGap : s.bosishGap); muammo(ek, 'kamvoy', s.teg ? 'Kaktus kam oldi!' : 'Oz qoldi!'); return }
    ishora(ek, 'Jon N qoldi, o‘yin esa tugadi. Shart qachon «ha» deydi — sonni tekshiring'.replace('Jon', BOSH_HARF(s.ozg)).replace('N', sonK(v))); muammo(ek, 'ortiqvoy', 'Erta tugadi!'); return
  }
  ishora(ek, ek.__ifOzg === 'qadam' ? 'Qadam tugadi. Qisqaroq yo‘l toping. ▶ Boshlash — yana o‘ynang' : 'Jon tugadi. ▶ Boshlash — yana o‘ynang')
}
function ballTekshir(ek, o) {
  const h = o.h, t = TOP(ek.dataset.id), b = t.bosh
  if (o.terildi.size >= o.jami && h.yashirinKut) { h.yashirinKut = false; const y = h.k.querySelector('.kt-yul.yashirin'); if (y) y.classList.add('topildi'); chal('bos') }
  if (!h.yulduz || h.yashirinKut || h.x !== h.yulduz[0] || h.y !== h.yulduz[1]) return
  const v = vOl(ek, 'ball'), xato = (kim, gap, g) => { oyinToxtat(ek); chal('muammo'); ishora(ek, g); muammo(ek, kim, gap) }
  if (b.sinov) return xato('kamvoy', 'Oz qoldi!', b.sinov.bosishGap || b.sinov.tegGap || '') // sinov pog'onasida yulduzga yetish — yechim emas (o'yin aynan 0 da tugashi kerak)
  if (b.erkin) {
    const ds = blDasturchalar(ek), setBor = ds.some((x) => x.tur === 'when_start' && x.bloklar.some((el) => blokTuri(el) === 'z'))
    const turlar = new Set(ds.filter((x) => x.tur === 'when_touch' && x.bloklar.length).map((x) => x.olma))
    const yoq = !setBor ? 'O‘yin boshida ballni qo‘ying' : !turlar.has('gold') || !turlar.has('apple') ? 'Oltin olmaga ham dasturcha qo‘ying' : !(v > 0) ? 'Olmalar ball bersin — change blokidagi sonni tanlang' : ''
    if (yoq) return xato('kamvoy', 'Oz qoldi!', yoq)
  } else if (b.erkin3) {
    // 12-dars 15 · ★: o'yin boshida jon va qadam, ikkala qoida
    const setlar = new Set(blDasturchalar(ek).filter((x) => x.tur === 'when_start').flatMap((x) => x.bloklar.filter((el) => blokTuri(el) === 'z').map(ozgNom)))
    const yoq = !(setlar.has('jon') && setlar.has('qadam')) ? 'O‘yin boshida jon va qadamni qo‘ying' : !qoidaBor(ek, 'qadam') ? 'Qadam qoidasi kerak' : !qoidaBor(ek, 'jon') ? 'Jon qoidasi kerak' : ''
    if (yoq) return xato('kamvoy', 'Oz qoldi!', yoq)
  } else if (b.kerak != null && v !== b.kerak) {
    // gaplar manbadagi qolipda (N — ball, M — kerak, K — o'yin boshidagi son): matn darvozasi ularni aynan topadi
    const NM = (g) => g.replace('N', v).replace('M', b.kerak).replace('K', o.ball0)
    if (b.kerak > v) return xato('kamvoy', 'Ball kam!', o.set ? 'O‘yin boshida ball nechchi bo‘lishi kerak?' : NM('Ball N — M bo‘lishi kerak. Har olma necha ball?'))
    return xato('ortiqvoy', 'Ball ko‘p!', NM(o.set ? 'Ball N — M bo‘lishi kerak. Sonlarni tekshiring' : 'Ball N — M bo‘lishi kerak. O‘yin boshida ball K edi'))
  }
  // 12-dars: pog'ona shartlari (yutganda)
  if (b.oltinJon && !dasturchaBlok(ek, 'gold', (el) => blokTuri(el) === 'c' && ozgNom(el) === 'jon' && blokSon(el) > 0)) return xato('kamvoy', 'Jon-chi?', 'Oltin olma jon bersin — uning dasturchasini tekshiring')
  if (b.kaktusBall && !dasturchaBlok(ek, 'cactus', (el) => blokTuri(el) === 'c' && ozgNom(el) === 'ball' && blokSon(el) === -2)) return xato('kamvoy', 'Kaktus-chi?', 'Kaktus jonni ham, 2 ballni ham olsin — kaktus dasturchasini tekshiring')
  for (const n of b.qoida || []) if (!qoidaBor(ek, n)) return xato('kamvoy', 'Qoida-chi?', n === 'qadam' ? 'Qadam 0 bo‘lsa, o‘yin tugashi kerak: har bosishda ishlaydigan dasturchada shart bormi?' : 'Jon 0 bo‘lsa, o‘yin tugashi kerak: kaktus dasturchasida shart bormi?')
  ballYutdi(ek, o)
}
function ballYutdi(ek, o, gap, sinov) {
  const id = ek.dataset.id, t = TOP(id), b = t.bosh, g = t.gap || {}
  oyinToxtat(ek)
  ishora(ek, gap || (g.yetdi ? GAPT(g.yetdi) : 'Siz yutdingiz!')); konfeti(ek)
  const ball = vOl(ek, 'ball')
  // 10-qadam (bosh.olmaIz): ball terilgan olmadan ko'p bo'lsa — sahna ustida «Olma 3 ta — ball 6»
  if (b.olmaIz && ball !== o.terildi.size) ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl ball-iz">Olma ' + o.terildi.size + ' ta — ball <b>' + ball + '</b></span>')
  ek.__yutdi = (ek.__yutdi || 0) + 1
  // solo 10-qadam (bosh.soloSet): ikkinchi o'yindan keyin when ▶ clicked → set ball to 0 o'zi qo'shiladi
  if (b.soloSet && typeof SOLO !== 'undefined' && SOLO && ek.__yutdi === 2 && typeof blQosh === 'function') setTimeout(() => { if (!document.body.contains(ek)) return; blQosh(ek, 'f'); blQosh(ek, 'z', '0'); sanoq(ek); ishora(ek, 'O‘yin boshida ball 0 bo‘ladi. Yana o‘ynang') }, 1600)
  const ildiz = ek.parentNode && ek.parentNode.closest('#ust,#bol'); if (!ildiz || ildiz.id !== 'bol' || ek.dataset.oqish) return
  oxirgiSaqla(ek)
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek)
  if (DARS.dasturJson) { try { localStorage.setItem(dasturJsonKalit(), JSON.stringify(Blockly.serialization.workspaces.save(ws))) } catch (e) {} } else oyinDasturSaqla(blRoyxatMa(ek))
  // natija (DARS.natija harflari): 'o' — terilgan olmalar, 'B' — yakuniy ball (eng kattasi), 'W' — yutilgan o'yin (sinov emas), 'S' — dasturdagi shartlar, 'V' — ishlatilgan o'zgaruvchilar (eng kattasi)
  const kerak = DARS.natija.map((n) => n.blok || n.eng || '').join(''), bl = (tur, n) => Array.from({ length: Math.max(0, n) }, () => ({ dataset: { tur } }))
  const ozg = new Set(); if (ws) ws.getAllBlocks(false).forEach((x) => { if (x.getField('VAR')) ozg.add(x.getFieldValue('VAR')) })
  const q = [...(kerak.includes('o') ? bl('o', o.terildi.size) : []), ...(kerak.includes('B') ? bl('B', ball) : []), ...(kerak.includes('W') && !sinov ? bl('W', 1) : []), ...(kerak.includes('S') && ws ? bl('S', ws.getBlocksByType('if_var', false).length) : []), ...(kerak.includes('V') ? bl('V', ozg.size) : [])]
  if (typeof blokQosh === 'function') blokQosh(id, q)
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  setTimeout(() => bolaKeyingi(), 1400)
}
// ---- oldindan aytish (3-bekat): dastur when ▶ clicked ostida tayyor, o'zgarmaydi; karta tanlanadi, «▶ Tekshirish» ----
const sonBashTugma = (ek) => ek.querySelector('.hn .ishga') || ek.querySelector('.hn .asos') // ustozda — «▶ Tekshirish» qo'shilgan, bolada — asosiy tugma
function sonBashDastur(ek) { const d = blDasturchalar(ek).find((x) => x.tur === 'when_start'); return d ? turla(d.daraxt) : [] }
// dasturni bajarmasdan o'qish: har o'zgaruvchi blokidan keyingi ball (14-qadamda ustozning «Keyingi»si shu yozuvlarni birma-bir ko'rsatadi)
function sonBashIz(daraxt) { const r = []; let v = 0; for (const t of ijroTartibi(daraxt)) { if (t.tur === 'z') v = blokSon(t.el); if (t.tur === 'c') v += blokSon(t.el); if (t.tur === 'z' || t.tur === 'c') r.push([t.el, v]) } return { iz: r, v } }
function sonBashTayyorla(ek) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek)
  if (ws) ws.getAllBlocks(false).forEach((x) => { x.setMovable(false); x.setDeletable(false); x.setEditable(false) })
  ek.dataset.faqatOqish = '1'; ek.dataset.oqildi = '0'; ek.dataset.urinish = '0'
  ek.querySelectorAll('.bsh-q .sk').forEach((x) => x.classList.remove('tan', 'ok'))
  if (typeof blSanoqOl === 'function') blSanoqOl(ek)
  ek.__v = {}; ballKor(ek, null); delete ek.dataset.bayroq
  const ish = sonBashTugma(ek); if (ish) { if (ish.classList.contains('ishga')) ish.textContent = '▶ Tekshirish'; ish.classList.add('xira') }
  const g = TOP(ek.dataset.id).gap || {}
  const gb = g.boshla && GAPT(g.boshla); if (gb) ishora(ek, gb) // aks holda tasmadagi ishora («Dasturni o‘qing…»); xira tugma bosilsa — «Avval sonni tanlang»
}
function sonBashBosish(e, ek, ildiz) {
  const sk = e.target.closest('.bsh-q .sk')
  if (sk) { if (ek.dataset.yuryapti) return true; ek.querySelectorAll('.bsh-q .sk').forEach((x) => x.classList.toggle('tan', x === sk)); x0(ek); chal('bos'); ek.dataset.bayroq = 'son:' + sk.dataset.v; const ish = sonBashTugma(ek); if (ish) ish.classList.remove('xira'); ishora(ek, ''); return true }
  const tb = sonBashTugma(ek); if (tb && e.target.closest('.hn .ishga, .hn .asos') === tb) { sonBashTekshir(ek); return true }
  // 14-qadam (ustoz): «Keyingi» — avval har blok yonidagi yozuv birma-bir («ball: 0», «ball: 2»…), keyin odatdagidek keyingi qadam
  const solo = typeof SOLO !== 'undefined' && SOLO
  if (TOP(ek.dataset.id).oqiydi && ildiz.id === 'ust' && !solo && e.target.closest('.hn .asos')) {
    const { iz } = sonBashIz(sonBashDastur(ek)), n = +(ek.dataset.oqildi || 0)
    if (n < iz.length) { const [el, v] = iz[n]; blSanoq(el, 'ball: ' + v); ballSonRang(el); el.classList.add('yon'); chal('qadam'); ek.dataset.oqildi = n + 1; return true }
  }
  if (e.target.closest('.jr-bl, .pl, .rg')) return true // dastur o'zgarmaydi, javon yopiq
  return null
}
function x0(ek) { muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove()); ballKor(ek, null); ek.querySelectorAll('.bsh-q .sk').forEach((x) => x.classList.remove('ok')) }
async function sonBashTekshir(ek) {
  if (ek.dataset.yuryapti) return
  const sk = ek.querySelector('.bsh-q .sk.tan'); if (!sk) { chal('muammo'); ishora(ek, 'Avval sonni tanlang'); return }
  const id = ek.dataset.id, t = TOP(id), b = t.bosh, g = t.gap || {}
  x0(ek); if (typeof blSanoqOl === 'function') blSanoqOl(ek)
  ek.querySelectorAll('.jr-bl .mb.yon').forEach((x) => x.classList.remove('yon'))
  ek.dataset.yuryapti = '1'; ishora(ek, 'Dastur ishlayapti…')
  ek.__v = {}
  const d = blDasturchalar(ek).find((x) => x.tur === 'when_start')
  if (d) d.hodisa.classList.add('hozir')
  await ijro(sonBashDastur(ek), (n) => ballBlok(ek, null, n), { kut: 650 })
  if (d) d.hodisa.classList.remove('hozir')
  delete ek.dataset.yuryapti
  const v = vOl(ek, 'ball'), tanlandi = +sk.dataset.v, urinish = +(ek.dataset.urinish || 0) + 1
  ek.dataset.urinish = urinish
  if (v !== tanlandi) { chal('muammo'); ishora(ek, 'Ball N bo‘ldi. Dasturni qaytadan o‘qing: har blokdan keyin ball nechchi?'.replace('N', v)); muammo(ek, 'kamvoy', 'Boshqa son!'); return }
  sk.classList.add('ok'); ishora(ek, g.yetdi ? GAPT(g.yetdi) : 'Oldindan aytdingiz!'); konfeti(ek)
  const ildiz = ek.parentNode && ek.parentNode.closest('#ust,#bol'); if (!ildiz || ildiz.id !== 'bol' || ek.dataset.oqish) return
  oxirgiSaqla(ek)
  // natija: 'A' — birinchi urinishda oldindan aytgan pog'ona (pog'ona esa to'g'ri aytilganda hisoblanadi)
  if (typeof blokQosh === 'function') blokQosh(id, urinish === 1 ? [{ dataset: { tur: 'A' } }] : [])
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  if (urinish === 1 && b.pog && typeof bildir === 'function') bildir({ t: 'bildi', n: b.pog }) // LMS yutug'i «Oldindan bildi» (DARS.lms.yutuqlar: t 'bildi') — faqat birinchi urinish
  setTimeout(() => bolaKeyingi(), 1400)
}
// 17-qadam: bola natijasida kapsula — eng katta ball
function ballNatija(ek) { const k = ek.querySelector('.oyna .ball-k b'); if (!k || typeof blokJami !== 'function') return; const j = blokJami(); k.textContent = (j.eng && j.eng.B) || 0 }

// ===== 13-dars (21.11, manba 013): tasodifiy son — olma dasturi, savatlar, random qiymatlarini sanab chiqish, olma terish o'yini =====
// bosh.olmaDastur — dastur egasi olma: har go to — bitta olma tepadan katakka tushadi (qahramon o'z katagida); bosh.savat — [[x, y, g?]…] (g — 8 · ★ guruh,
// i-olma i-guruhga); bosh.olmaSoni — bir ishga tushirishda nechta olma; bosh.erkinOlma — ★ «O‘z o‘yiningiz» (savatsiz: daraxt va gulga tushmasin);
// studiya[id].tanlov — ko'rish ekranlarida random tanlovi oldindan (manba «Savollar» 8). Tekshiruv — random'ning HAMMA qiymati sanab chiqiladi + kamida
// 3 marta ishga tushirish va 2 xil joy («Sinov: N / 3»). bosh.oyin bilan — 3-bekat o'yini: «▶ Boshlash» da olma dasturi tekshiriladi, olma olinsa — qayta tushadi.
function tasodif(ek, a, b) { const t = TOP(ek.dataset.id).tanlov, i = +(ek.dataset.tn || 0); if (t && i < t.length) { ek.dataset.tn = i + 1; return t[i] } return a + Math.floor(Math.random() * (b - a + 1)) }
const OLMA_W = () => BL_MAYDON().w - 1, OLMA_H = () => BL_MAYDON().h - 1
// olma dasturi → olmalar: [{ el, X: { n } | { r: [a, b], blk }, Y }…] (repeat ochilgan)
function olmaDasturi(ek) {
  const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek), r = []; if (!ws) return r
  const sp = (b, nm) => { const x = b.getInputTargetBlock(nm); if (x && x.type === 'random_n') { const a = +x.getFieldValue('A'), c = +x.getFieldValue('B'); return { r: [Math.min(a, c), Math.max(a, c)], blk: x } } return { n: x ? +x.getFieldValue('N') : 0 } }
  const yur = (b) => { while (b) { if (b.type === 'go_to_r') r.push({ el: b.getSvgRoot(), X: sp(b, 'X'), Y: sp(b, 'Y') }); if (b.type === 'repeat') for (let i = 0; i < +b.getFieldValue('N'); i++) yur(b.getInputTargetBlock('DO')); b = b.getNextBlock() } }
  yur(blAsosiy(ws)); return r
}
const qiymatlar = (s) => (s.r ? Array.from({ length: s.r[1] - s.r[0] + 1 }, (_, i) => s.r[0] + i) : [s.n])
const kat = (a, b) => a[0] === b[0] && a[1] === b[1]
function olmaSavat(b, i) { const s = b.savat || []; return s.some((x) => x[2]) ? s.filter((x) => +x[2] === i + 1) : s }
// sanab chiqish: { tur: tayyor | bosh | randomYoq | kam | kop | chetMumkin | savatYoqMumkin | boshqaGuruh | boshSavat | bezak, … }
function olmaTahlil(ek, b) {
  const o = olmaDasturi(ek)
  if (!o.length) return { tur: 'bosh' }
  if (!o.some((x) => x.X.r || x.Y.r)) return { tur: 'randomYoq' }
  const kerak = b.olmaSoni || 1
  if (b.oyin && o.length > 1) return { tur: 'kop', oyin: true }
  if (o.length < kerak) return { tur: 'kam', n: kerak }
  if (o.length > kerak) return { tur: 'kop', n: kerak }
  for (const x of o) { for (const v of qiymatlar(x.X)) if (v < 0 || v > OLMA_W()) return { tur: 'chetMumkin', son: v, oq: 'X' }; for (const v of qiymatlar(x.Y)) if (v < 0 || v > OLMA_H()) return { tur: 'chetMumkin', son: v, oq: 'Y' } }
  if (b.erkinOlma) {
    const bez = DARS.bezak || {}, joy = new Set()
    for (const x of o) for (const X of qiymatlar(x.X)) for (const Y of qiymatlar(x.Y)) { joy.add(X + ',' + Y); for (const nom of ['daraxt', 'gul']) if ((bez[nom] || []).some((k) => kat(k, [X, Y]))) return { tur: 'bezak', k: [X, Y], nom } }
    return joy.size >= 2 ? { tur: 'tayyor' } : { tur: 'randomYoq' }
  }
  const hamma = b.savat || [], tush = []
  for (let i = 0; i < o.length; i++) {
    const S = olmaSavat(b, i), x = o[i]
    for (const X of qiymatlar(x.X)) for (const Y of qiymatlar(x.Y)) {
      tush.push([X, Y])
      if (S.some((s) => kat(s, [X, Y]))) continue
      if (hamma.some((s) => kat(s, [X, Y]))) return { tur: 'boshqaGuruh' }
      const sonX = x.X.r && !S.some((s) => s[0] === X), son = sonX || !x.Y.r ? X : Y
      return { tur: 'savatYoqMumkin', son, k: [X, Y] }
    }
  }
  const bosh = hamma.find((s) => !tush.some((t) => kat(t, s))); if (bosh) return { tur: 'boshSavat', k: [bosh[0], bosh[1]] }
  return { tur: 'tayyor' }
}
const sinovKalit = (ek) => olmaDasturi(ek).map((x) => (x.X.r ? 'r' + x.X.r.join('-') : x.X.n) + ',' + (x.Y.r ? 'r' + x.Y.r.join('-') : x.Y.n)).join('|')
// sanab topilgan muammo — muammocha (true qaytarsa — muammo bor)
function olmaXato(ek, t) {
  const M = {
    bosh: ['boshvoy', 'Bu yerda hech narsa yo‘q-ku…', 'Avval blokni bosing — u dasturga qo‘shiladi'],
    randomYoq: ['kamvoy', 'Yana o‘sha joy!', 'Son doim bir xil. Son o‘rniga random qo‘ying'],
    kam: ['kamvoy', 'Oz qoldi!', 'N ta olma tushishi kerak'.replace('N', t.n)],
    kop: ['ortiqvoy', 'Ko‘payib ketdi!', t.oyin ? 'O‘yinda bitta olma: dasturda bitta go to bo‘lsin' : 'N ta olma tushishi kerak'.replace('N', t.n)],
    chetMumkin: ['ortiqvoy', 'Savat yo‘q-ku!', t.oq === 'Y' ? 'random N ni ham tanlashi mumkin — maydonda Y 0 dan 4 gacha'.replace('N', t.son) : 'random N ni ham tanlashi mumkin — maydonda X 0 dan 6 gacha'.replace('N', t.son)],
    savatYoqMumkin: ['ortiqvoy', 'Savat yo‘q-ku!', 'random N ni ham tanlashi mumkin — olma (x, y) ga tushadi. random sonlarini tekshiring'.replace('N', t.son).replace('(x, y)', '(' + (t.k || []).join(', ') + ')')],
    boshqaGuruh: ['ortiqvoy', 'Savat yo‘q-ku!', '1-olma «1» savatlarga tushsin. Birinchi go to — 1-olma'],
    boshSavat: ['kamvoy', 'Bu savat bo‘sh qoladi!', '(x, y) dagi savatga olma tushmaydi. random sonlarini tekshiring'.replace('(x, y)', '(' + (t.k || []).join(', ') + ')')],
    bezak: ['kamvoy', t.nom === 'gul' ? 'Gulga tushadi!' : 'Daraxtga tushadi!', (t.nom === 'gul' ? 'random (x, y) ni ham tanlashi mumkin — u yerda gul' : 'random (x, y) ni ham tanlashi mumkin — u yerda daraxt').replace('(x, y)', '(' + (t.k || []).join(', ') + ')')],
  }[t.tur]
  if (!M) return false
  chal('muammo'); ishora(ek, M[2]); muammo(ek, M[0], M[1]); return true
}
// olma tushadi: katak (x, y) — maydon ichida; chet — tashqarida (chetda turtilib to'xtaydi)
function olmaChiz(ek, x, y, chet) {
  const k = ek.querySelector('.katak.maydon'), svg = k && k.querySelector('svg.kt'); if (!svg) return null
  const H = katakXarita(k.dataset.xarita).length, cx = Math.max(0, Math.min(OLMA_W(), x)) * KT + 50 + (x > OLMA_W() ? 46 : x < 0 ? -46 : 0), cy = (H - 1 - Math.max(0, Math.min(OLMA_H(), y))) * KT + 52 + (y > OLMA_H() ? -46 : 0)
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'kt-olma tushdi' + (chet ? ' chet' : '')); g.setAttribute('transform', 'translate(' + cx + ' ' + cy + ')'); g.innerHTML = '<g class="tsh">' + MD_OLMA + '</g>'
  svg.insertBefore(g, k.querySelector('.kt-q')); const t = g.firstChild
  if (t.animate) t.animate(chet ? [{ transform: 'translate(0px,-260px)' }, { transform: 'translate(0px,0px)' }, { transform: 'translate(10px,0px)' }, { transform: 'translate(-6px,0px)' }, { transform: 'translate(0px,0px)' }] : [{ transform: 'translate(0px,-260px)', opacity: 0 }, { transform: 'translate(0px,0px)', opacity: 1 }], { duration: 420, easing: 'ease-in' })
  return g
}
// oldingi ishga tushirishdagi olmalar — xira belgi (pog'ona davomida); hammasi = true — tozalash (o'yin)
function olmaTozala(ek, hammasi) { ek.querySelectorAll('.katak.maydon .kt-olma.tushdi').forEach((g) => { if (hammasi || g.classList.contains('chet')) g.remove(); else { g.classList.remove('tushdi'); g.classList.add('iz-olma') } }); if (hammasi) ek.querySelectorAll('.katak.maydon .kt-olma.iz-olma').forEach((g) => g.remove()) }
// bitta go to (ijro paytida): random'lar tanlaydi (blok yonida son), olma tushadi
async function olmaBajar(ek, h, t) {
  if (t.tur !== 'y') return
  const b = blBlok(t.el); if (!b) return
  const val = (nm) => { const x = b.getInputTargetBlock(nm); if (x && x.type === 'random_n') { const a = +x.getFieldValue('A'), c = +x.getFieldValue('B'), v = tasodif(ek, Math.min(a, c), Math.max(a, c)); if (typeof blSanoq === 'function') blSanoq(x.getSvgRoot(), v); return v } return x ? +x.getFieldValue('N') : 0 }
  const X = val('X'), Y = val('Y'), chet = X < 0 || X > OLMA_W() || Y < 0 || Y > OLMA_H()
  await KUT(260)
  const g = olmaChiz(ek, X, Y, chet)
  if (chet) { chal('tuk'); h.chet = { son: X > OLMA_W() || X < 0 ? X : Y, oq: X > OLMA_W() || X < 0 ? 'X' : 'Y' }; return 'toxta' }
  chal('qadam'); h.tushdi.push([X, Y]); h.gl.push(g)
}
function sinovYoz(ek) { const s = ek.querySelector('.dst .sinov-n'), n = (ek.__sinov || {}).n || 0; if (s) s.textContent = 'Sinov: ' + Math.min(n, 3) + ' / 3' }
function olmaTayyorla(ek) { ek.__sinov = null; delete ek.dataset.tn; olmaTozala(ek, true); sinovYoz(ek); { const ws = typeof BL_WS !== 'undefined' && BL_WS.get(ek); if (ws && typeof blKengKeyin === 'function') blKengKeyin(ek, ws) } /* tayyor go to random bilan keng — chizish tugagach masshtab */ const g = TOP(ek.dataset.id).gap || {}, gb = g.boshla && GAPT(g.boshla); if (gb) ishora(ek, gb) }
async function olmaIshga(ek) {
  if (ek.dataset.yuryapti) return
  maslahatOch(ek); if (typeof blTanlovOl === 'function') blTanlovOl(ek); urildiOl(ek); muammoOl(ek); ek.querySelectorAll('.konfeti').forEach((x) => x.remove())
  const id = ek.dataset.id, b = TOP(id).bosh, g = TOP(id).gap || {}
  if (!olmaDasturi(ek).length) return olmaXato(ek, { tur: 'bosh' })
  ek.dataset.yuryapti = '1'; ishora(ek, 'Dastur ishlayapti…')
  olmaTozala(ek, false)
  const h = { tushdi: [], gl: [], chet: null }
  await ijro(dasturDaraxti(ek), (t) => olmaBajar(ek, h, t), { kut: 300 })
  delete ek.dataset.yuryapti
  // avval shu safar ko'ringani (maydondan tashqari, savat yo'q), keyin sanab topilgani
  if (h.chet) { chal('muammo'); ishora(ek, h.chet.oq === 'Y' ? 'random N ni tanladi. Maydonda Y — 0 dan 4 gacha'.replace('N', h.chet.son) : 'random N ni tanladi. Maydonda X — 0 dan 6 gacha'.replace('N', h.chet.son)); muammo(ek, 'kamvoy', 'Maydon tugadi!'); return }
  const t = olmaTahlil(ek, b)
  if (['randomYoq', 'kam', 'kop'].includes(t.tur)) return olmaXato(ek, t)
  if (!b.erkinOlma) for (let i = 0; i < h.tushdi.length; i++) { const k = h.tushdi[i]; if (!(b.savat || []).some((s) => kat(s, k))) { chal('muammo'); ishora(ek, 'Olma (x, y) ga tushdi — u yerda savat yo‘q. random sonlarini tekshiring'.replace('(x, y)', '(' + k.join(', ') + ')')); muammo(ek, 'ortiqvoy', 'Savat yo‘q-ku!'); return } if (!olmaSavat(b, i).some((s) => kat(s, k))) return olmaXato(ek, { tur: 'boshqaGuruh' }) }
  if (olmaXato(ek, t)) return
  // sinov: dastur o'zgarsa — sanoq boshidan; uch marta va kamida 2 xil joy
  const kalit = sinovKalit(ek); if (!ek.__sinov || ek.__sinov.kalit !== kalit) ek.__sinov = { kalit, n: 0, joy: new Set(), olma: 0 }
  const s = ek.__sinov; s.n++; s.joy.add(h.tushdi.map((k) => k.join(',')).join('|')); s.olma += h.tushdi.length; sinovYoz(ek)
  h.gl.forEach((x) => x && x.classList.add('savatda'))
  if (3 > s.n) { ishora(ek, 'Yana ishga tushiring — olma qayerga tushadi?'); return }
  if (2 > s.joy.size) { ishora(ek, 'Olma yana o‘sha joyga tushdi — bu ham tasodif. Yana bir marta'); return }
  ishora(ek, g.yetdi ? GAPT(g.yetdi) : 'Har safar boshqa joy!'); konfeti(ek)
  olmaHisob(ek, b, { T: s.olma })
}
// natija: 'R' — dasturdagi random bloklari, 'T' — savatga tushgan olmalar, 'o' — o'yinda terilgan olmalar
function olmaHisob(ek, b, { T = 0, o = 0 } = {}) {
  const ildiz = ek.parentNode && ek.parentNode.closest('#ust,#bol'); if (!ildiz || ildiz.id !== 'bol' || ek.dataset.oqish) return
  oxirgiSaqla(ek)
  const ws = BL_WS.get(ek), R = ws ? ws.getBlocksByType('random_n', false).length : 0, bl = (tur, n) => Array.from({ length: n }, () => ({ dataset: { tur } }))
  if (typeof blokQosh === 'function') blokQosh(ek.dataset.id, [...bl('R', R), ...bl('T', T), ...bl('o', o)])
  if (b.pog && typeof pogQosh === 'function') pogQosh(b.pog)
  setTimeout(() => bolaKeyingi(), 1400)
}
// ---- 3-bekat: o'yin — qahramon strelkalar bilan (boshqaruv tayyor), olma dasturi olmani tushiradi; 5 ta olma — yutdi ----
async function olmaOyinBoshla(ek) {
  const id = ek.dataset.id, b = TOP(id).bosh
  muammoOl(ek); urildiOl(ek); ek.querySelectorAll('.konfeti,.dv-pufak').forEach((x) => x.remove())
  if (typeof blTanlovOl === 'function') blTanlovOl(ek)
  const t = olmaTahlil(ek, Object.assign({}, b, { oyin: true }))
  if (t.tur !== 'tayyor') return olmaXato(ek, t)
  olmaTozala(ek, true)
  const h = await SAHNA.katak.boshla(ek, b)
  const oy = { h, olma: null, g: null, terildi: 0, tushdi: 0 }
  OYIN.set(ek, oy); ek.dataset.oyin = '1'
  ek.querySelector('.oyna').insertAdjacentHTML('beforeend', '<span class="gl oyin-yz">O‘yin: strelkalarni bosing · Olma: <b>0 / 5</b></span>')
  const tb = oyinTugma(ek); if (tb) tb.textContent = '■ To‘xtatish'
  ishora(ek, '')
  await olmaTushir(ek, oy)
}
async function olmaTushir(ek, oy) {
  if (OYIN.get(ek) !== oy) return
  ek.dataset.yuryapti = '1'
  const h = { tushdi: [], gl: [] }
  await ijro(dasturDaraxti(ek), (t) => olmaBajar(ek, h, t), { kut: 200 })
  oy.olma = h.tushdi[0] || null; oy.g = h.gl[0] || null; oy.tushdi++
  delete ek.dataset.yuryapti
  if (oy.olma && oy.h.x === oy.olma[0] && katakXarita(oy.h.k.dataset.xarita).length - 1 - oy.h.y === oy.olma[1]) await olmaOl(ek, oy) // olma qahramon turgan katakka tushdi
}
async function olmaOyinBos(ek, k, oy) {
  const tur = TUR_STR[k]; if (!tur) return
  ek.dataset.yuryapti = '1'
  await SAHNA.katak.bajar(oy.h, { tur, el: document.createElement('span') }); oy.h.urildi = null
  delete ek.dataset.yuryapti
  const y = katakXarita(oy.h.k.dataset.xarita).length - 1 - oy.h.y
  if (oy.olma && oy.h.x === oy.olma[0] && y === oy.olma[1]) await olmaOl(ek, oy)
}
async function olmaOl(ek, oy) {
  if (oy.g) oy.g.remove(); oy.olma = null; oy.terildi++; chal('bos')
  const z = ek.querySelector('.oyin-yz b'); if (z) z.textContent = oy.terildi + ' / 5'
  if (oy.terildi >= 5) {
    const t = TOP(ek.dataset.id), g = t.gap || {}
    oyinToxtat(ek); ishora(ek, g.yetdi ? GAPT(g.yetdi) : 'Siz yutdingiz!'); konfeti(ek)
    return olmaHisob(ek, t.bosh, { T: oy.tushdi, o: oy.terildi })
  }
  await olmaTushir(ek, oy)
}
// ---- huk (2–4-qadam): kartada ikki o'yin × uch olma (pastki qator), kartaning o'zida ikki qator son ----
// karta: data-olma «5,5,5» (doim o'sha) yoki «1,5,3» (navbat bilan), data-tanlov «4,1,6|2,5,0» (dastur o'zi tanlaydi — oldindan berilgan)
async function hukOlma(ek, k, i) {
  if (ek.dataset.yuryapti) return
  const g = TOP(ek.dataset.id).gap || {}
  ek.dataset.yuryapti = '1'
  ek.querySelectorAll('.jk').forEach((x) => x.classList.toggle('sinov', x === k)); ek.querySelectorAll('.muam,.konfeti').forEach((x) => x.remove())
  k.classList.remove('n-ok', 'n-yoq'); k.querySelectorAll('.jn').forEach((x) => x.remove())
  const q = k.querySelector('.ho-q'); if (q) q.innerHTML = ''
  const yil = k.dataset.tanlov ? k.dataset.tanlov.split('|').map((s) => s.split(',').map(Number)) : [0, 1].map(() => k.dataset.olma.split(',').map(Number))
  for (let o = 0; o < 2; o++) {
    olmaTozala(ek, true)
    for (const x of yil[o]) { olmaChiz(ek, x, 0); chal('qadam'); await KUT(380) }
    if (q) q.insertAdjacentHTML('beforeend', '<span>' + (o + 1) + '-o‘yin: <b>' + yil[o].join(' · ') + '</b></span>')
    await KUT(420)
  }
  const ok = k.dataset.ok === '1'
  k.classList.remove('sinov'); k.classList.add(ok ? 'n-ok' : 'n-yoq')
  ;(k.querySelector('.jt') || k).insertAdjacentHTML('beforeend', '<small class="jn">' + (k.dataset.nat || '') + '</small>')
  if (ok) konfeti(ek)
  delete ek.dataset.yuryapti
  ek.dataset.huk = Math.max(+(ek.dataset.huk || 0), i + 1)
  const a = ek.querySelector('.hn .asos'); if (a && g.keyingi) a.textContent = g.keyingi
}

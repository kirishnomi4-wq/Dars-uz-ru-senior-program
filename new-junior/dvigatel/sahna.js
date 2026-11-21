// Sahna qolipi (dvigatel 4c, 19.11) — brauzerda ishlaydi; yigish.mjs uni ijrochi.js dan keyin, studiya.js dan oldin qo'shadi.
// Blok studiyada qahramon qayerda turadi, blokni qanday bajaradi va natija qanday baholanadi — sahna turiga qarab. Har tur bitta obyekt:
//   boshla(ek, bosh)     → h (holat). Qahramonni boshlang'ich joyiga qo'yadi (kerak bo'lsa kutadi — await).
//   bajar(h, tugun)      → undefined yoki 'toxta' (dastur shu blokda to'xtasin). Bitta blokning ishi: yuradi, sakraydi, gapiradi.
//   baho(h, bosh, bl)    → { tur: 'yetdi' | 'kam' | 'ortiq' | 'olmasiz' | 'aniqEmas', … } — yo'l topshirig'i (topshiriq turi 'yol') uchun.
// Studiya (studiya.js) baho bo'yicha gap, konfeti va muammochani chiqaradi — sahna faqat «nima bo'ldi»ni aytadi.
// Turlar: yol — 1-darsdagi zonachali to'g'ri yo'l; erkin — zonachasiz sahna (o'z sahnasi, ustoz namunasi);
//         katak — labirint (5a, 2-dars; 99-qaror): to'rt yo'nalish, devorga urilsa dastur to'xtaydi, kalit va eshik. Chizmasi — katak.js.
// Sahna turi topshiriq e'lonidan: bosh.erkin → erkin, bosh.sahna (bo'lsa) → o'sha, aks holda yol.
function sahnaTuri(b) { return b.erkin ? 'erkin' : (b.sahna || 'yol') }
// hamma sahnada bir xil: sakrash va gap
function sahnaUmumiy(h, t, mb) {
  if (t === 'j') { sakra(h.q); chal('sakra') }
  else { pufak(h.oyna, h.q, blokMatn(mb)); chal('bos') }
}
const SAHNA = {
  yol: {
    async boshla(ek, b) {
      const oyna = ek.querySelector('.oyna'), q = ek.querySelector(b.q || '.oyna .yol .q')
      const zonalar = ek.querySelectorAll('.oyna .yol .z').length - 1, yz = ek.querySelector('.oyna .yol .z.y'), yulduz = yz ? Array.from(yz.parentNode.querySelectorAll('.z')).indexOf(yz) : -1
      if (b.sana) yuzSon(ek, 0)
      ek.querySelectorAll('.yoy path').forEach((p) => p.classList.remove('otdi'))
      ek.querySelectorAll('.olma-z').forEach((o) => o.classList.remove('olindi'))
      const h = { ek, b, oyna, q, zonalar, yulduz, p: b.start != null ? b.start : b.at, qadamlar: 0, olmaOlindi: false }
      if (ATLAR(q) !== h.p) { atQoy(q, h.p); await KUT(250) }
      return h
    },
    bajar(h, tugun) {
      const { ek, b, q } = h, t = tugun.tur
      if (t === 'r' || t === 'l') {
        const yangi = h.p + (t === 'r' ? 1 : -1)
        if (yangi < 0 || yangi > h.zonalar) { h.p = yangi; silkit(q); chal('muammo') }
        else { const eski = h.p; h.p = yangi; kochir(q, h.p); chal('qadam'); if (t === 'r') { const yo = ek.querySelectorAll('.yoy path')[eski]; if (yo) yo.classList.add('otdi') } }
        h.qadamlar++; if (b.sana) yuzSon(ek, h.qadamlar)
        if (b.olma != null && h.p === b.olma && !h.olmaOlindi) { h.olmaOlindi = true; setTimeout(() => ek.querySelectorAll('.olma-z').forEach((o) => o.classList.add('olindi')), 380) }
      } else sahnaUmumiy(h, t, tugun.el)
    },
    baho(h, b, bl) {
      const olmaKerak = b.olma != null
      if (olmaKerak && !h.olmaOlindi) return { tur: 'olmasiz' }
      if (h.p === h.yulduz && b.aniq && bl.length !== b.aniq) return { tur: 'aniqEmas', n: bl.length, kerak: b.aniq }
      if (h.p === h.yulduz) return { tur: 'yetdi', olmaKerak }
      // yetmadi yoki o'tib ketdi — boshlang'ich joy va yulduzning tomoniga qarab (yulduz chapda ham bo'lishi mumkin)
      const bosh0 = b.start != null ? b.start : b.at, kam = bosh0 < h.yulduz ? h.p < h.yulduz : h.p > h.yulduz
      const teskari = kam && bl.some((mb) => blokTuri(mb) === (bosh0 < h.yulduz ? 'l' : 'r'))
      return kam ? { tur: 'kam', teskari } : { tur: 'ortiq' }
    },
  },
  erkin: {
    async boshla(ek, b) {
      const oyna = ek.querySelector('.oyna'), q = ek.querySelector(b.q || '.oyna .yol .q')
      if (b.sana) yuzSon(ek, 0)
      ek.querySelectorAll('.yoy path').forEach((p) => p.classList.remove('otdi'))
      ek.querySelectorAll('.olma-z').forEach((o) => o.classList.remove('olindi'))
      const h = { ek, b, oyna, q, zonalar: ek.querySelectorAll('.oyna .yol .z').length - 1, yulduz: -1, p: 0, qadamlar: 0, olmaOlindi: false }
      const yz = ek.querySelector('.oyna .yol .z.y'); if (yz) h.yulduz = Array.from(yz.parentNode.querySelectorAll('.z')).indexOf(yz)
      suril(q, 0)
      return h
    },
    bajar(h, tugun) {
      const { ek, b, q } = h, t = tugun.tur
      if (t === 'r' || t === 'l') {
        const yangi = h.p + (t === 'r' ? 1 : -1)
        h.p = Math.max(-4, Math.min(4, yangi)); suril(q, h.p); chal('qadam')
        h.qadamlar++; if (b.sana) yuzSon(ek, h.qadamlar)
        if (b.olma != null && h.p === b.olma && !h.olmaOlindi) { h.olmaOlindi = true; setTimeout(() => ek.querySelectorAll('.olma-z').forEach((o) => o.classList.add('olindi')), 380) }
      } else sahnaUmumiy(h, t, tugun.el)
    },
  },
  // Labirint: bir blok — bitta katak — bitta sakrash va tovush; o'tilgan kataklarda oltin iz. Devor, chet yoki yopiq eshik — qahramon joyida
  // turtilib silkinadi, «tuk», dastur shu blokda to'xtaydi ('toxta'). Kalit katagiga kirsa — olinadi (qahramon yonida yonadi); eshik kalit bilan ochiladi.
  katak: {
    async boshla(ek, b) {
      const k = ek.querySelector('.katak'), xr = katakXarita(k.dataset.xarita), s = katakTop(xr, 'S') || [0, xr.length - 1]
      const h = { ek, b, oyna: ek.querySelector('.oyna'), k, q: k.querySelector('.kt-q'), xr, x: s[0], y: s[1], yulduz: katakTop(xr, '*'), kalit: false, urildi: null, qadamlar: 0 }
      // 3-dars: maydon (devorsiz, X va Y) — o'tilgan kataklar, go to manzillari, olmalar
      // 7-dars: kostyum (har ishga tushirishda xotirjam), animatsiya (xursand → xotirjam juftlari), har qadamdan keyin animatsiya, belgi, tovushlar
      if (k.classList.contains('maydon')) Object.assign(h, { kos: 'xotirjam', anim: 0, qadamAnim: [], kosSoni: 0, kosNomlar: [], tovushlar: [], belgiXato: null })
      { const ay = ek.querySelector('.an-yz b'); if (ay && b && b.animatsiya) ay.textContent = '0 / ' + b.animatsiya }
      if (k.classList.contains('maydon')) Object.assign(h, { maydon: true, yol: [[h.x, h.y]], go: [], olma: mdTop(xr, 'O') })
      const kochdi = katakAsl(ek)
      if (kochdi) await KUT(250)
      return h
    },
    async bajar(h, tugun) {
      // 9-dars: shart maydonda ham (labirint maydon) — tekshiruv katak sahnasidagidek
      if (tugun.tur === 'a') return katakShart(h, tugun)
      if (h.maydon) return maydonBajar(h, tugun)
      const t = tugun.tur, d = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1] }[t]
      if (!d) { sahnaUmumiy(h, t, tugun.el); return }
      const nx = h.x + d[0], ny = h.y + d[1], c = (h.xr[ny] || '')[nx] || '#'
      if (c === '#' || (c === 'E' && !h.kalit)) { h.urildi = { eshik: c === 'E', el: tugun.el }; katakTurtil(h, d); chal('tuk'); return 'toxta' }
      if (c === 'E') { const e = h.k.querySelector('.kt-eshik[data-k="' + nx + ',' + ny + '"]'); if (e && !e.classList.contains('ochiq')) { e.classList.add('ochiq'); chal('bos'); await KUT(280) } }
      katakIz(h, h.x, h.y, nx, ny)
      h.x = nx; h.y = ny; katakSur(h.q, nx, ny, true); chal('qadam'); h.qadamlar++
      if (c === 'K' && !h.kalit) { h.kalit = true; setTimeout(() => h.k.classList.add('kalitli'), 380) }
    },
    baho(h, b) {
      if (h.maydon) return maydonBaho(h, b || {})
      if (h.urildi) return { tur: h.urildi.eshik ? 'eshik' : 'urildi' }
      // 8-dars 15 · ★: erkin sayr — kamida ikki shart har xil tomonga, kamida 4 qadam
      if (b && b.erkinSayr) { const ws = typeof BL_WS !== 'undefined' && BL_WS.get(h.ek), yon = new Set(ws ? ws.getBlocksByType('if_path', false).map((x) => x.getFieldValue('YON')) : []); return { tur: yon.size < 2 ? 'kamShart' : h.qadamlar < 4 ? 'kamYurdi' : 'tayyor' } }
      if (h.yulduz && h.x === h.yulduz[0] && h.y === h.yulduz[1]) return { tur: 'yetdi' }
      return { tur: 'kam' }
    },
  },
}
// --- katak sahnasining yordamchilari (brauzer) ---
const KT_YON = (x, y) => [x * KT + 50, y * KT + 52] // katak markazi (iz chizig'i)
// qahramonni katakka qo'yish; sakrab — yoy bo'ylab (bir sakrash)
// baland — yoy qancha baland (3-dars go to: uzoq manzilga bitta katta sakrash)
function katakSur(g, x, y, sakrab, baland = 0) {
  const eski = g.style.transform, yangi = katakJoy(x, y)
  g.style.transform = yangi
  if (!sakrab || !g.animate || !eski) return
  const m = eski.match(/-?[\d.]+/g).map(Number), n = yangi.match(/-?[\d.]+/g).map(Number)
  g.animate([{ transform: eski }, { transform: 'translate(' + (m[0] + n[0]) / 2 + 'px,' + ((m[1] + n[1]) / 2 - 26 - baland) + 'px)' }, { transform: yangi }], { duration: 520 + (baland ? 160 : 0), easing: 'ease-in-out' })
}
// devorga turtilish: o'sha tomonga bir oz, keyin silkinib joyiga
function katakTurtil(h, d) {
  const g = h.q, j = g.style.transform, m = j.match(/-?[\d.]+/g).map(Number), at = (k) => 'translate(' + (m[0] + d[0] * k) + 'px,' + (m[1] + d[1] * k) + 'px)'
  if (g.animate) g.animate([{ transform: j }, { transform: at(20) }, { transform: at(-7) }, { transform: at(4) }, { transform: j }], { duration: 440, easing: 'ease-out' })
}
// oltin iz: o'tilgan katak hoshiyasi va ikki katak markazini tutashtiruvchi nuqtali chiziq
// cls — chiziqqa qo'shimcha klass (3-dars go to: «kt-gl» — to'g'ri punktir)
function katakIz(h, x1, y1, x2, y2, cls) {
  const iz = h.k.querySelector('.kt-iz'); if (!iz) return
  ;[[x1, y1], [x2, y2]].forEach(([x, y]) => { const c = h.k.querySelector('.kt-c[data-k="' + x + ',' + y + '"]'); if (c) c.classList.add('iz') })
  const a = KT_YON(x1, y1), b = KT_YON(x2, y2), l = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  l.setAttribute('class', 'kt-il' + (cls ? ' ' + cls : '')); l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1])
  iz.appendChild(l)
}
// labirintni boshlang'ich holatga qaytarish (ekran ochilganda va har ishga tushirishda). true — qahramon joyidan ko'chdi
function katakAsl(ek) {
  const k = ek.querySelector('.katak'); if (!k) return false
  const xr = katakXarita(k.dataset.xarita), s = katakTop(xr, 'S') || [0, xr.length - 1], g = k.querySelector('.kt-q')
  k.classList.remove('kalitli')
  k.querySelectorAll('.kt-eshik.ochiq').forEach((e) => e.classList.remove('ochiq'))
  k.querySelectorAll('.kt-c.iz').forEach((c) => c.classList.remove('iz'))
  const iz = k.querySelector('.kt-iz'); if (iz) iz.innerHTML = ''
  if (k.classList.contains('maydon')) { k.querySelectorAll('.kt-olma.olindi,.kt-yul.topildi').forEach((x) => x.classList.remove('olindi', 'topildi')); k.querySelectorAll('.kt-c.yonk').forEach((c) => c.classList.remove('yonk')) }
  if (!g) return false
  if (g.getAnimations) g.getAnimations().forEach((a) => a.cancel())
  const joy = katakJoy(s[0], s[1]), kochdi = g.style.transform.replace(/\s/g, '') !== joy
  g.style.transform = joy
  if (k.classList.contains('maydon')) mdYorliqQoy(k, s[0], s[1])
  if (k.querySelector('.kt-q .kos')) kostyumKor(k, 'xotirjam') // 7-dars: har ishga tushirishda xotirjam
  return kochdi
}
// ===== 3-dars: maydon sahnasi (katak.js, maydonHtml) — devor yo'q; X o'ngga, Y tepaga; ichkarida katak tartibi (qator tepadan) =====
// go to (tur 'x') — aytilgan katakka bitta katta sakrash, eski katakdan yangisiga to'g'ri oltin punktir; move — bitta katak.
// Maydon chetidan chiqish — turtilib to'xtaydi (Kamvoy «Maydon tugadi!»). Olma — qahramon o'sha katakka tushganda olinadi;
// yashirin yulduz — qahramon yetib kelganda paydo bo'ladi; qahramon ostidagi yorliq «(x, y)» har qadamda yangilanadi.
function mdTop(xr, belgi) { const r = []; xr.forEach((q, y) => [...q].forEach((c, x) => { if (c === belgi) r.push([x, y]) })); return r }
const mdY = (xr, q) => xr.length - 1 - q // ichki qator → y
function mdYorliqQoy(k, x, q) { const t = k.querySelector('.kt-yr text'); if (t) t.textContent = mdYorliq(x, mdY(katakXarita(k.dataset.xarita), q)) }
async function maydonBajar(h, tugun) {
  const t = tugun.tur, H = h.xr.length, W = Math.max(...h.xr.map((r) => r.length))
  let nx, ny
  if (t === 'x') { const [X, Y] = blokXY(tugun.el); nx = Math.max(0, Math.min(W - 1, X)); ny = Math.max(0, Math.min(H - 1, H - 1 - Y)) }
  else {
    const d = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1] }[t]
    // 7-dars huk: 'w' — qahramon joyida silkinadi (kostyum o'zgarmaydi)
    if (t === 'w') { katakTurtil(h, [1, 0]); chal('bos'); await KUT(300); return }
    if (t === 'v') { kostyumAlmash(h, (typeof blokQiymat === 'function' && blokQiymat(tugun.el, 'KOS')) || 'xursand'); return }
    if (t === 'n') { tovushChal(h, (typeof blokQiymat === 'function' && blokQiymat(tugun.el, 'NOM')) || 'qadam'); return }
    if (!d) { sahnaUmumiy(h, t, tugun.el); return }
    nx = h.x + d[0]; ny = h.y + d[1]
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) { h.urildi = { chet: true, el: tugun.el }; katakTurtil(h, d); chal('tuk'); return 'toxta' }
  }
  // 9-dars: labirint maydon — buta va kalitsiz eshik devor (go to ham u yerga tusha olmaydi); eshik kalit bilan ochiladi va ochiq qoladi
  const c = (h.xr[ny] || '')[nx] || '.'
  // 12-dars: kaktus — devordek (o'tib bo'lmaydi); tegish — o'yin to'xtamaydi, studiya when touching cactus dasturchasini ishlatadi
  if (c === 'C') { h.urildi = { kaktus: true, el: tugun.el }; katakTurtil(h, [Math.sign(nx - h.x), Math.sign(ny - h.y)]); chal('tuk'); return 'toxta' }
  if (c === '#' || (c === 'E' && !h.kalit)) { h.urildi = { eshik: c === 'E', el: tugun.el }; katakTurtil(h, [Math.sign(nx - h.x), Math.sign(ny - h.y)]); chal('tuk'); return 'toxta' }
  if (c === 'E') { const e = h.k.querySelector('.kt-eshik[data-k="' + nx + ',' + ny + '"]'); if (e && !e.classList.contains('ochiq')) { e.classList.add('ochiq'); h.eshikOchildi = true; chal('bos'); await KUT(280) } }
  if (h.qadamAnim) belgiTekshir(h) // qahramon katakdan chiqmoqda — shu katakdagi belgi kostyumi
  const uzoq = Math.abs(nx - h.x) + Math.abs(ny - h.y)
  katakIz(h, h.x, h.y, nx, ny, t === 'x' ? 'kt-gl' : '')
  h.x = nx; h.y = ny; katakSur(h.q, nx, ny, true, t === 'x' ? 26 + Math.min(uzoq, 6) * 12 : 0); chal(t === 'x' ? 'sakra' : 'qadam'); h.qadamlar++
  if (t === 'x') h.go.push([nx, mdY(h.xr, ny)])
  h.yol.push([nx, ny])
  if (t !== 'x' && h.qadamAnim) { h.qadamAnim.push(false); h.animOxiri = 0; if ((h.b || {}).oxirida) animYozuv(h) }
  mdYorliqQoy(h.k, nx, ny)
  const o = h.k.querySelector('.kt-olma[data-k="' + nx + ',' + ny + '"]:not(.olindi)'); if (o) setTimeout(() => o.classList.add('olindi'), 380)
  if (c === 'K' && !h.kalit) { h.kalit = true; setTimeout(() => h.k.classList.add('kalitli'), 380) }
  if (h.yulduz && nx === h.yulduz[0] && ny === h.yulduz[1] && !h.yashirinKut) { const y = h.k.querySelector('.kt-yul.yashirin'); if (y) setTimeout(() => y.classList.add('topildi'), 380) }
}
// ===== 8-dars: shart «yo'l bormi» (labirint) =====
// tomondagi katak yo'lmi: labirintdan tashqari, buta (#) va yopiq eshik — devor. Tekshiruv qadam emas: sakrash ham, tovush ham yo'q;
// katak 0,35 soniya belgilanadi (yo'l — oltin hoshiya, devor — buta silkinadi), shart blokida «✓ ha» / «✕ yo‘q»
const YON_D = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }
async function katakShart(h, t) {
  const d = YON_D[t.yon] || [1, 0], nx = h.x + d[0], ny = h.y + d[1], c = (h.xr[ny] || '')[nx] || '#'
  t.ha = !(c === '#' || (c === 'E' && !h.kalit))
  // 9-dars: o'yinda «yo'q» sanog'i va kalitsiz eshik (Kamvoy «Kalit qani?» — o'yin to'xtamaydi; studiya.js)
  if (!t.ha) { h.yoqSoni = (h.yoqSoni || 0) + 1; if (c === 'E') h.eshikYoq = true }
  // belgi — vaqtinchalik ramka (statik chizma o'zgarmaydi): yo'l — oltin, devor — uzuq qizil; labirintdan tashqarida ko'rsatilmaydi
  const iz = h.k.querySelector('.kt-iz')
  if (iz && ny >= 0 && ny < h.xr.length && nx >= 0 && nx < Math.max(...h.xr.map((r) => r.length))) { const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); r.setAttribute('class', 'kt-shart ' + (t.ha ? 'ha' : 'yoq')); r.setAttribute('x', nx * KT + 6); r.setAttribute('y', ny * KT + 6); r.setAttribute('width', 88); r.setAttribute('height', 88); r.setAttribute('rx', 18); iz.appendChild(r); setTimeout(() => r.remove(), 350) }
  if (typeof blShartBelgi === 'function') blShartBelgi(t.el, t.ha)
}
// ===== 7-dars: kostyum va tovush =====
const TOVUSH_KUY = { qadam: 'qadam', sakrash: 'sakra', jiring: 'yulduz', tuk: 'tuk' }
function kostyumKor(k, nom) { k.querySelectorAll('.kt-q .kos').forEach((g) => { g.style.display = g.dataset.kos === nom ? '' : 'none' }) }
// kostyum almashadi (qahramon joyida qoladi, tovushsiz); xursand → xotirjam — bitta animatsiya, oxirgi qadamga yoziladi
function kostyumAlmash(h, nom) {
  if (nom !== h.kos) h.kosSoni++
  ;(h.kosNomlar = h.kosNomlar || []).push(nom)
  if (h.kos === 'xursand' && nom === 'xotirjam') { h.anim++; h.animOxiri = (h.animOxiri || 0) + 1; if (h.qadamAnim.length) h.qadamAnim[h.qadamAnim.length - 1] = true; animYozuv(h) }
  h.kos = nom; kostyumKor(h.k, nom)
}
// tovush: proyektorda (va solo'da) chalinadi; hamma ekranda qahramon ustida «♪ nom» belgisi (jim noutbukda ham ko'rinadi)
function tovushChal(h, nom) {
  chal(TOVUSH_KUY[nom] || 'qadam'); h.tovushlar.push(nom)
  if (typeof pufak === 'function') { pufak(h.oyna, h.q, '♪ ' + nom); const p = h.oyna.querySelector('.dv-pufak'); if (p) { p.classList.add('nota-p'); setTimeout(() => p.remove(), 700) } }
}
// belgili katakdan chiqayotganda (yoki dastur shu katakda tugasa) kostyum belgidagidek bo'lishi kerak; birinchi xato saqlanadi
function belgiTekshir(h) {
  const b = h.b || {}; if (!b.belgi || h.belgiXato) return
  const y = mdY(h.xr, h.y), bg = b.belgi.find(([x, c]) => x === h.x && c === y)
  if (bg && h.kos !== bg[2]) h.belgiXato = { katak: [h.x, y], kerak: bg[2] }
}
function animYozuv(h) { const b = h.b || {}, p = h.ek.querySelector('.an-yz b'); if (p && b.animatsiya) p.textContent = (b.oxirida ? h.animOxiri || 0 : h.anim) + ' / ' + b.animatsiya } // oxirida — faqat oxirgi qadamdan keyingilar
// baho (b — topshiriq e'loni): oldindan aytish (b.bashorat) · erkin yo'l (b.erkinYol — kamida shuncha har xil go to manzili) · yulduz, olmalar bilan
// (b.olmaShart: false — olma maydonda bor, olinadi, lekin tekshiruvga kirmaydi)
function maydonBaho(h, b) {
  const joy = [h.x, mdY(h.xr, h.y)], m = { maydon: true, joy, yulduzK: h.yulduz ? [h.yulduz[0], mdY(h.xr, h.yulduz[1])] : null }
  if (h.urildi) return { ...m, tur: 'chet' }
  // 7-dars: kostyum belgisi (oxirgi katak ham), oxirgi kostyum, animatsiya soni va har qadamdan keyin animatsiya
  if (h.qadamAnim) { belgiTekshir(h); if (h.belgiXato) return { ...m, tur: 'belgiKostyum', katak: h.belgiXato.katak, kerak: h.belgiXato.kerak } }
  if (b.bashorat) { const f = mdBayroq(h.ek); return { ...m, tur: f && f[0] === joy[0] && f[1] === joy[1] ? 'oldindan' : 'boshqaKatak' } }
  if (b.erkinYol) { const n = new Set(h.go.map(String)).size; return { ...m, tur: n >= b.erkinYol ? 'tayyor' : 'kamManzil', n } }
  // 5-dars: erkin rasm — ichida kamida ikki blokli takrorlash (dastur chetga urilmay tugadi)
  // 6-dars (KOD 2): erkinRasm.kerak — dasturda shu turdagi bloklar (masalan ['x', 'p']: go to ham, ichi bo'sh bo'lmagan repeat ham)
  if (b.erkinRasm && b.erkinRasm.kerak) { const tur = typeof bloklar === 'function' ? bloklar(h.ek).map(blokTuri) : [], ok = b.erkinRasm.kerak.every((t) => (t === 'p' ? typeof blIchkiKop === 'function' && blIchkiKop(h.ek, 1) : tur.indexOf(t) >= 0)); return { ...m, tur: ok ? 'tayyor' : 'kamOila', rasm: ok } }
  if (b.erkinRasm) { const ok = typeof blIchkiKop === 'function' && blIchkiKop(h.ek, 2); return { ...m, tur: ok ? 'tayyor' : 'kamIchki', rasm: ok } }
  // 5-dars: rasm topshirig'i — kulrang kataklar (.kt-c.md-rasm) hammasi oltin, iz kulrangdan chiqmasin; qaysi burchakdan boshlash ahamiyatsiz
  const rasm = Array.from(h.k.querySelectorAll('.kt-c.md-rasm')).map((c) => c.dataset.k)
  if (rasm.length) {
    // qolgan kataklardan qahramonga eng yaqini (bola keyingi qadamni shundan biladi); teng bo'lsa — maydondagi tartib (tepadan, chapdan)
    const otdi = h.yol.map(([x, q]) => x + ',' + q), chiq = otdi.find((k) => rasm.indexOf(k) < 0)
    const masofa = (k) => { const [x, q] = k.split(',').map(Number); return Math.abs(x - h.x) + Math.abs(q - h.y) }
    const kam = rasm.filter((k) => otdi.indexOf(k) < 0).reduce((e, k) => (e == null || masofa(k) < masofa(e) ? k : e), null)
    const xy = (k) => { const [x, q] = k.split(',').map(Number); return [x, mdY(h.xr, q)] }
    if (chiq) return { ...m, tur: 'rasmChiqdi', katak: xy(chiq) }
    if (kam) return { ...m, tur: 'rasmKam', katak: xy(kam) }
    return { ...m, tur: 'rasmTayyor', rasm: true }
  }
  const qoldi = h.olma.filter(([x, y]) => !h.yol.some(([a, c]) => a === x && c === y))
  if (qoldi.length && b.olmaShart !== false) return { ...m, tur: 'olmasiz', olma: [qoldi[0][0], mdY(h.xr, qoldi[0][1])] }
  if (h.yulduz && h.x === h.yulduz[0] && h.y === h.yulduz[1]) {
    if (b.kostyum && h.kos !== b.kostyum) return { ...m, tur: 'kostyumBoshqa', hozir: h.kos, kerak: b.kostyum }
    // bosh.oxirida (7-dars 11 · 1 «Yulduzda 3 marta»): faqat oxirgi qadamdan keyingi animatsiyalar sanaladi (audit 20.11)
    const an = b.oxirida ? h.animOxiri || 0 : h.anim
    if (b.animatsiya && an < b.animatsiya) return { ...m, tur: 'animKam', n: an, kerak: b.animatsiya }
    if (b.harQadam && h.qadamAnim.some((x) => !x)) return { ...m, tur: 'animQani' }
    return { ...m, tur: 'yetdi', olmaKerak: h.olma.length > 0 }
  }
  // 5-dars (b.otib): yulduz yo'lda qoldi — o'tib ketdi (Ortiqvoy); aks holda boshqa katak
  if (b.otib && h.yulduz && h.yol.some(([x, q]) => x === h.yulduz[0] && q === h.yulduz[1])) return { ...m, tur: 'otibKetdi' }
  return { ...m, tur: 'boshqa' }
}
// bayroqcha (oldindan aytish): ekranda bitta, manzili ek.dataset.bayroq «x,y» da; bosilgan katak — maydon koordinatasida
function mdBayroq(ek) { const v = ek && ek.dataset.bayroq; return v ? v.split(',').map(Number) : null }
function mdBayroqQoy(ek, x, y) {
  const k = ek.querySelector('.katak.maydon'); if (!k) return
  const xr = katakXarita(k.dataset.xarita), q = xr.length - 1 - y
  k.querySelectorAll('.md-bq.b-bola').forEach((b) => b.remove())
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'md-bq b-bola'); g.setAttribute('transform', 'translate(' + (x * KT + 50) + ' ' + (q * KT + 52) + ')'); g.innerHTML = MD_BAYROQ
  k.querySelector('.kt-iz').insertAdjacentElement('afterend', g)
  ek.dataset.bayroq = x + ',' + y
  if (g.animate) g.animate([{ opacity: 0, transform: g.getAttribute('transform') + ' translate(0 -30px)' }, { opacity: 1, transform: g.getAttribute('transform') }], { duration: 260 })
}
// bosilgan joy → maydon katagi [x, y] (maydondan tashqarida — null)
function mdBosilgan(e, ek) {
  const k = ek.querySelector('.katak.maydon'), svg = k && k.querySelector('svg.kt'); if (!svg || !e.target.closest('.katak.maydon')) return null
  const xr = katakXarita(k.dataset.xarita), H = xr.length, W = Math.max(...xr.map((r) => r.length))
  const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY
  const m = svg.getScreenCTM(); if (!m) return null
  const t = p.matrixTransform(m.inverse()), x = Math.floor(t.x / KT), q = Math.floor(t.y / KT)
  return x >= 0 && q >= 0 && x < W && q < H ? [x, H - 1 - q] : null
}

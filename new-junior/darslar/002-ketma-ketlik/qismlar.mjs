// 2-dars «Labirint» (Buyruqlar ketma-ketligi) — darsning o'z ekran bo'laklari (dvigatel 5b-2, 19.11). Manba: new-junior/manba/002-ketma-ketlik.md.
// yigish.mjs ulaydi: dvigatel/qismlar.mjs va katak.js dan keyin (rasmlar, bloklar, katakHtml), dars ekranlaridan oldin.
// Labirint xaritalari — manbadagi «Labirintlar» jadvali aynan (katak.js belgilari: '#' devor, '.' yo'l, 'S' start, '*' yulduz, 'K' kalit, 'E' eshik).
const X = {
  H: '##..*|##.##|S..##', N: '#..*|S.##', P1: '...*|.###|S###', P2: 'S.##|#.##|#..*', P3: '###.*|#...#|S.###', PY: '####.*|#....#|#.####|S.####',
  KN: '..E*|SK##', K1: '...E*|.####|SK###', K2: 'S..E*|.####|K####', KY: '...E*|.####|S.K##',
}
// huk dasturlari (2-qadam): bloklar bir xil — to'rtta move right, ikkita move up; faqat tartibi boshqa
const HUK = [['A', 'rrrruu', 'O‘ngga 4, tepaga 2'], ['B', 'uurrrr', 'Tepaga 2, o‘ngga 4'], ['C', 'rruurr', 'O‘ngga 2, tepaga 2, o‘ngga 2']]
const SONI = { A: 7, B: 3, C: 4 } // namuna (ustoz ekranida haqiqiy son yoziladi — qobiq.js, hisob)

// dasturni labirintda yurgizish (chizish uchun — Node'da va LMS'da brauzerda): o'tilgan kataklar, oxirgi joy, urilgan blok (1 dan), kalit
const KY_D = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1] }
function katakYur(xarita, dastur) {
  const xr = katakXarita(xarita); let [x, y] = katakTop(xr, 'S'), kalit = false, urildi = 0; const yol = [[x, y]]
  for (let i = 0; i < dastur.length; i++) {
    const d = KY_D[dastur[i]], nx = x + d[0], ny = y + d[1], c = (xr[ny] || '')[nx] || '#'
    if (c === '#' || (c === 'E' && !kalit)) { urildi = i + 1; break }
    x = nx; y = ny; yol.push([x, y]); if (c === 'K') kalit = true
  }
  return { yol, x, y, kalit, urildi }
}
// labirint (katak.js) + oldindan chizilgan holat: dastur — o'tilgan yo'l oltin iz bilan, qahramon oxirgi joyda (kalit olingan, eshik ochiq);
// raqam — yo'l kataklarida 1, 2, 3… (5-qadam: blok va katak bir xil raqam, data-r — studiya.js, raqamBosish)
function katakSahna(xarita, aktyor, { dastur = '', raqam = false } = {}) {
  let h = katakHtml(xarita, { aktyor })
  if (!dastur) return h
  const r = katakYur(xarita, dastur), [sx, sy] = r.yol[0]
  if (raqam) {
    const n = r.yol.slice(1).map(([x, y], i) => `<g class="kt-rq" data-r="${i + 1}" transform="translate(${x * KT + 50} ${y * KT + 52})"><circle r="19"/><text y="7.5">${i + 1}</text></g>`).join('')
    return h.replace('<g class="kt-q"', `<g class="kt-rqlar">${n}</g><g class="kt-q"`)
  }
  r.yol.forEach(([x, y]) => { h = h.replace(`class="kt-c" data-k="${x},${y}"`, `class="kt-c iz" data-k="${x},${y}"`) })
  const il = r.yol.slice(1).map(([x, y], i) => { const [a, b] = r.yol[i]; return `<line class="kt-il" x1="${a * KT + 50}" y1="${b * KT + 52}" x2="${x * KT + 50}" y2="${y * KT + 52}"/>` }).join('')
  h = h.replace('<g class="kt-iz"></g>', `<g class="kt-iz">${il}</g>`).replace(`style="transform:${katakJoy(sx, sy)}"`, `style="transform:${katakJoy(r.x, r.y)}"`)
  if (r.kalit) h = h.replace('<div class="katak"', '<div class="katak kalitli"')
  r.yol.forEach(([x, y]) => { h = h.replace(`class="kt-eshik" data-k="${x},${y}"`, `class="kt-eshik ochiq" data-k="${x},${y}"`) })
  return h
}
// labirintdagi qahramon: ustozda Coddy, bolada o'z qahramoni (oldindan chiziladi — malumot.mjs, har qahramon uchun)
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))

// kichik dastur (kartalarda, 5-qadamda, xulosada): har blok — .mb (huk sinovida ijrochi shularni yoqadi; turi data-tur da), yuqoridan pastga
// raqam — blok yonida raqam (data-r: 5-qadamda katak bilan birga yonadi); urildi — shu blokda to'xtadi (sariq hoshiya); nom — blok yozuvi bilan
// nom bilan raqamli (5-qadam): raqam blokning chap yonida, blok bilan bitta qatorda (.dk-q — data-r shu qatorda, yonganda ikkalasi birga)
const dk = (dastur, { raqam = false, urildi = 0, nom = false, cls = '' } = {}) => `<div class="dk${nom ? ' nomli' : ''} ${cls}">${[...dastur].map((t, i) => {
  const mb = `<span class="mb f-h${urildi === i + 1 ? ' urildi' : ''}" data-tur="${t}"${raqam && !nom ? ` data-r="${i + 1}"` : ''}>${raqam && !nom ? `<b class="dk-n">${i + 1}</b>` : ''}${IKON[t]}${nom ? `<span>${BL[t][1]}</span>` : ''}</span>`
  return raqam && nom ? `<div class="dk-q" data-r="${i + 1}"><b class="dk-n">${i + 1}</b>${mb}</div>` : mb
}).join('')}</div>`
// huk kartalari (2–4-qadam): harf, qisqa gap, kichik dastur; son — nechta bola tanlagani; nat — sinov natijasi (A, B — ✕ urildi, C — ✓ chiqdi)
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const dKartalar = ({ son, nat = {} } = {}) => `<div class="jv dkv">${HUK.map(([l, d, t]) => { const r = nat[l] ? katakYur(X.H, d) : null; return `<div class="jk ${PIK_R[l]}${nat[l] ? (r.urildi ? ' n-yoq' : ' n-ok') : ''}"><span class="jt"><span><b>${l}</b>${t}</span>${nat[l] ? `<small class="jn">${r.urildi ? '✕ devorga urildi' : '✓ chiqdi'}</small>` : ''}</span>${dk(d, { urildi: r ? r.urildi : 0 })}${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}${son[l]}</span>` : ''}</div>` }).join('')}</div>`

// bekatlar (reja tepaligi): rangi — reja ranglari (1-darsdagidek ko'k, binafsha, oltin); belgisi — yurish, lupa (xato), kalit
const LUPA = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2" fill="none" stroke="#fff" stroke-width="3"/><path d="M15.2 15.2L20.5 20.5" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></svg>'
const KALIT_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7.5" cy="12" r="4.6" fill="none" stroke="#fff" stroke-width="2.8"/><path d="M12 12h9.5M18 12v4M21 12v3" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/></svg>'
const BEKATLAR = [['h', 'Labirintda yuramiz', IKON.u], ['g', 'Xatoni topamiz', LUPA], ['y', 'Labirintdan chiqamiz', KALIT_OQ]]

// kichik labirint rasmi (zinapoya kartalari, reja kartasi): kataklar, devor, start, yulduz, kalit, eshik — chizma katak.js ranglarida
const miniKatak = (xarita, cls = 'mini') => {
  const xr = katakXarita(xarita), kq = Math.max(...xr.map((s) => s.length)), kr = xr.length, W = kq * 10, H = kr * 10
  let h = ''
  xr.forEach((row, y) => [...row].forEach((c, x) => {
    const X0 = x * 10, Y0 = y * 10
    if (c === '#') { h += `<rect x="${X0 + 0.6}" y="${Y0 + 0.6}" width="8.8" height="8.8" rx="3" fill="#3E8E4E"/>`; return }
    h += `<rect x="${X0 + 0.6}" y="${Y0 + 0.6}" width="8.8" height="8.8" rx="2" fill="${c === 'S' ? '#D6E8FA' : c === '*' ? '#F8E3A0' : '#F7EACB'}"/>`
    if (c === '*') h += `<path transform="translate(${X0 + 5} ${Y0 + 5.2}) scale(3.4)" d="${KT_YULDUZ}" fill="#F5B82E" stroke="#C98A0E" stroke-width=".08"/>`
    if (c === 'K') h += `<g transform="translate(${X0 + 5.4} ${Y0 + 5.2}) rotate(-24) scale(.17)">${KT_KALIT}</g>`
    if (c === 'E') h += `<rect x="${X0 + 1.6}" y="${Y0 + 1.6}" width="6.8" height="6.8" rx="1" fill="#B5793F" stroke="#7A4B22" stroke-width=".6"/>`
    if (c === 'S') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5}" r="2.2" fill="#2F8FF0"/>`
  }))
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#9AD57C" opacity=".55"/>${h}</svg>`
}
// uch zinapoya (8, 11, 15-qadam): [raqam, namuna son, rasm, nomi] — son ustoz ekranida haqiqiy songa almashadi (qobiq.js, hisob: pog'ona sanog'i)
const POG = {
  yur: [['1', 10, miniKatak(X.P1), 'Bitta burilish'], ['2', 8, miniKatak(X.P2), 'Pastga ham'], ['3', 5, miniKatak(X.P3), 'Ikki burilish'], ['★', 2, miniKatak(X.PY), 'Uch burilish']],
  xato: [['1', 11, miniKatak(X.P1), 'Ikki blok almashgan'], ['2', 8, miniKatak(X.P2), 'Pastga yo‘l'], ['3', 5, miniKatak(X.P3), 'Bitta blok joyida emas'], ['★', 2, miniKatak(X.PY), 'Ikki xato']],
  kalit: [['1', 9, miniKatak(X.K1), 'Kalit va eshik'], ['2', 6, miniKatak(X.K2), 'Kalit pastda'], ['★', 2, miniKatak(X.KY), 'Kalit uzoqda']],
}
// reja cho'qqisidagi karta va yakundagi keyingi dars
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · kalit, eshik va yulduz</small><div class="kd3-r lb2">${miniKatak(X.KN, 'kd-mk')}</div><b>Labirintdan chiqasiz</b></div>`
const XY_RASM = `<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#F4F8FD"/>${[1, 2, 3, 4].map((i) => `<path d="M${14 + i * 18} 6V54" stroke="#C8D6EA" stroke-width="1.4"/>`).join('')}${[1, 2].map((i) => `<path d="M14 ${54 - i * 16}H94" stroke="#C8D6EA" stroke-width="1.4"/>`).join('')}<path d="M14 54H96M14 54V4" stroke="#0D2137" stroke-width="2.4" stroke-linecap="round"/><text x="92" y="62" font-family="JetBrains Mono, monospace" font-weight="800" font-size="9" fill="#0D2137">X</text><text x="4" y="10" font-family="JetBrains Mono, monospace" font-weight="800" font-size="9" fill="#0D2137">Y</text><path transform="translate(68 22) scale(7)" d="${KT_YULDUZ}" fill="#F5B82E" stroke="#C98A0E" stroke-width=".08"/></svg>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${XY_RASM}</div><b>3 · X va Y</b></div>`
// natija (17, 18-qadam): qadam (to'rt yo'nalish bloklari) · tuzatilgan xato (2-bekat pog'onalari) · labirint (yulduzga yetgan har labirint)
// SINF_T — butun sinf (namuna; ustoz ekranida haqiqiy jami), BOLA_T — bolaning o'zi (namuna: hamma 11 labirint, 74 qadam)
const SINF_T = [['h', IKON.r, 'qadam', 812], ['g', LUPA, 'tuzatilgan xato', 43], ['y', YULDUZ_OQ, 'labirint', 121]]
const BOLA_T = [['h', IKON.r, 'qadam', 74], ['g', LUPA, 'tuzatilgan xato', 4], ['y', YULDUZ_OQ, 'labirint', 11]]

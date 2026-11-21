// 8-dars «Shart: agar … unda» — darsning o'z ekran bo'laklari (20.11). Manba: new-junior/manba/008-shart.md.
// Sahna — 2-darsdagi labirint (katak.js katakHtml: # — devor, . — yo'l, S — start, * — yulduz). Har topshiriqda ikki labirint, dastur bitta (egizak — studiya.js egizAlmash).
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))
// labirintlar — manba «Labirintlar» jadvali (yuqori qator — labirintning tepasi): [1-labirint, 2-labirint]
const LB = {
  H: ['#######|S..*###|#######', '#######|S....*#|#######'],
  N7: ['#######|###*..S|#######', '#######|*.....S|#######'],
  B1A: ['#S#|#.#|#*#|###|###|###', '#S#|#.#|#.#|#.#|#.#|#*#'],
  B1B: ['###|###|#*#|#.#|#.#|#S#', '#*#|#.#|#.#|#.#|#.#|#S#'],
  B1C: ['#######|##*####|##.####|S..####', '#######|#######|####*##|S....##'],
  B1Y: ['S#*####|.#.####|...####|#######', 'S####*#|.####.#|.####.#|......#'],
  N10: ['####*|###..|##..#|#..##|S.###', '######*|####...|##...##|S..####'],
  B2A: ['S..##|##.##|##..*|#####', 'S.#####|#..####|##..###|###...*'],
  B2B: ['*.###|#..##|##..#|###.S', '*.#####|#....##|####..S'],
  B2C: ['###.S|#...#|#.###|*.###', '######S|###....|*...###'],
  B2Y: ['#######|##...##|#..#..#|S.###.*', '##...##|#..#.##|..##..#|S####.*'],
  N14: ['######|###*.S|######', '######|*....S|######'],
  B3A: ['#######|S...*##|#######', '#######|S.....*|#######'],
  B3B: ['###*#|##..#|#..##|S.###', '####*#|###..#|###.##|S...##'],
  B3C: ['S####|..###|#...#|###.*', 'S..####|##....#|#####.*'],
}
const SAYR = '.#...#.|...#...|.#.S.#.|...#...|.#...#.' // Sayr bog'i — 15 · ★ va 16-qadam (bitta, yulduzsiz)
// tik labirintlar (balandligi enidan katta) yonma-yon, keng — ustma-ust
const tik = (x) => { const xr = katakXarita(x); return xr.length > Math.max(...xr.map((s) => s.length)) }
const kNom = (h, n) => h.replace('<div class="katak" data-z="sahna"', '<div class="katak" data-egiz="' + n + '" data-z="sahna"').replace(/(<div class="katak"[^>]*>)/, '$1<span class="egiz-n">' + n + '</span>')
const egiz = (id, aktyor) => `<div class="egiz${tik(LB[id][0]) ? ' yon' : ''}">${kNom(katakHtml(LB[id][0], { aktyor }), 1)}${kNom(katakHtml(LB[id][1], { aktyor }), 2)}</div>`
const sayr = (aktyor) => katakHtml(SAYR, { aktyor })
// tayyor dasturlar (HTML; blockly.js ichma-ich o'qiydi): [n, ichki] — takrorlash; ['a', yon, ichki] — shart
const dH = (d) => d.map((t) => (Array.isArray(t) ? (t[0] === 'a' ? (t[3] ? shart(t[1], t[2]).replace('<div class="c-blok"', '<div class="c-blok ' + t[3] + '"') : shart(t[1], t[2])) : `<div class="c-blok" data-n="${t[0]}">${mb('p', String(t[0]))}<div class="c-ich">${dH(t[1])}</div><span class="c-tub"></span></div>`) : mb(t))).join('')
const sanaD = (d) => d.reduce((a, t) => a + (Array.isArray(t) ? (t[3] ? 0 : 1 + (t[0] === 'a' ? t[2].length : sanaD(t[1]))) : 1), 0) // solo-faqat bloklar jonli darsdagi sanoqqa kirmaydi
const dstT = (d, yuz, chegara) => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span>${d.length ? `<div class="mbw">${dH(d)}</div>` : '<span class="bosh">Blokni shu yerga ulang</span>'}<small class="dsn">${chegara ? `${sanaD(d)} / ${chegara} ta blok` : `${sanaD(d)} ta blok`}</small></div>`
const TAYYOR = {
  P6: [[6, [['a', 'left', ['l']]]]],
  P7: [[6, [['a', 'right', ['r']], ['a', 'up', ['u'], 'solo-faqat']]]], // ikkinchi shart — faqat solo'da tayyor (jonli darsda ustoz qo'shadi)
  P8: [[2, [['a', 'left', ['l']]]]],
  B3A: [[7, [['a', 'up', ['r']]]]],
  B3B: [[8, [['a', 'right', ['r']], 'u']]],
  B3C: [[8, [['a', 'down', ['d']], ['a', 'right', ['d']]]]],
}

// huk (2–4-qadam): ikki labirint H. A — repeat 3 [→]; B — repeat 6 [→]; C — repeat 6 [if → [→]]
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const kb = (t, cls = '') => `<span class="mb f-h ${cls}" data-tur="${t}">${IKON[t]}</span>`
const kp = () => `<span class="mb f-b" data-tur="p">${IKON.p}</span>`
const ka = () => `<span class="mb f-a" data-tur="a">${IKON.a}</span>`
const HUK = [
  ['A', 'Sanab yuramiz', { daraxt: [{ t: 'p', n: 3, ichki: [{ t: 'r' }] }], nat: '✕ 2-labirintda yetmadi' }, () => `<div class="dk gor">${kp()}<b class="hk-x">3</b>${kb('r')}</div>`],
  ['B', 'Ko‘p yuramiz', { daraxt: [{ t: 'p', n: 6, ichki: [{ t: 'r' }] }], nat: '✕ devorga urildi' }, () => `<div class="dk gor">${kp()}<b class="hk-x">6</b>${kb('r')}</div>`],
  ['C', 'Yo‘l bo‘lsa yuramiz', { daraxt: [{ t: 'p', n: 6, ichki: [{ t: 'a', yon: 'right', ichki: [{ t: 'r' }] }] }], nat: '✓ ikkalasida yetdi' }, () => `<div class="dk gor">${kp()}<b class="hk-x">6</b>${ka()}<b class="hk-x">→</b>${kb('r')}</div>`],
]
const SONI = { A: 5, B: 3, C: 6 } // namuna (ustoz ekranida haqiqiy son)
const tKartalar = ({ son, nat = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}" data-daraxt='${JSON.stringify(d.daraxt)}' data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}${son[l]}</span>` : ''}</div>`).join('')}</div>`

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
const miniE = (id) => `<span class="mini-egiz">${miniKatak(LB[id][0])}${miniKatak(LB[id][1])}</span>`
// uch zinapoya (8, 11, 15-qadam): ikkala labirint, start va yulduz (iz va dastur yo'q)
const POG = {
  devor: [['1', 10, miniE('B1A'), 'Pastga'], ['2', 8, miniE('B1B'), 'Tepaga'], ['3', 5, miniE('B1C'), 'Burchak'], ['★', 2, miniE('B1Y'), 'Uch tomon']],
  ikki: [['1', 9, miniE('B2A'), 'Pastga zinapoya'], ['2', 7, miniE('B2B'), 'Chapga zinapoya'], ['3', 5, miniE('B2C'), 'Chapga va pastga'], ['★', 2, miniE('B2Y'), 'Tog‘']],
  xato: [['1', 9, miniE('B3A'), 'Qimirlamaydi'], ['2', 7, miniE('B3B'), 'Yulduzdan keyin'], ['3', 5, miniE('B3C'), 'Darrov urildi'], ['★', 2, miniKatak(SAYR), 'O‘z sayringiz']],
}
const LUPA = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2" fill="none" stroke="#fff" stroke-width="3"/><path d="M15.2 15.2L20.5 20.5" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></svg>'
// bekatlar: devorgacha · ikki shart · xatoni topamiz
const DEVOR_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h11" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/><path d="M10 7l5 5-5 5" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="17" y="4" width="4" height="16" rx="1.5" fill="#fff"/></svg>'
const BEKATLAR = [['h', 'Devorgacha', DEVOR_OQ], ['g', 'Ikki shart', IKON.a], ['y', 'Xatoni topamiz', typeof LUPA !== 'undefined' ? LUPA : IKON.a]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · o‘z sayringiz</small><div class="kd3-r lb2">${miniKatak(SAYR, 'kd-mk')}</div><b>Dasturini o‘qib berasiz</b></div>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${miniKatak('#####|S..*#|#####', 'kd-mk')}</div><b>9 · Labirint o‘yini</b></div>`
// natija (17, 18-qadam): ta shart qo'ydi · ta labirintdan o'tdi · ta xato tuzatdi
const SINF_T = [['h', IKON.a, 'ta shart qo‘ydi', 168], ['g', DEVOR_OQ, 'ta labirintdan o‘tdi', 196], ['y', BEKATLAR[2][2], 'ta xato tuzatdi', 31]]
const BOLA_T = [['h', IKON.a, 'ta shart qo‘ydi', 14], ['g', DEVOR_OQ, 'ta labirintdan o‘tdi', 16], ['y', BEKATLAR[2][2], 'ta xato tuzatdi', 3]]

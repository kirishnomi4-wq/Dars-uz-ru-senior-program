// 9-dars «Labirint o‘yini 1» — darsning o'z ekran bo'laklari (20.11). Manba: new-junior/manba/009-labirint-oyini-1.md («Labirintlar», «Topshiriqlar»).
// Sahna — bog' maydoni 7 × 5 (X va Y, (0, 0) pastki chap) butalar bilan: katak.js maydonHtml (m.devor, m.kalit, m.eshik).
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))
// labirintlar — manba jadvali, tepadan pastga (yuqori qator — y = 4): # buta, . yo'l, S start, * yulduz, K kalit, E eshik. Sinov: sinov/dvigatel/labirint.mjs
const LBS = {
  H: '###...*|#...#.#|#.#...#|#...#.#|S.#...#',
  HA: '###...*|#.....#|#.....#|#.....#|S.#...#',
  N: '#######|#######|##...*#|##.####|S..####',
  B1: '..#####|.#....#|.#.##.#|.######|S....*#',
  B2: '....*##|.##.###|.##.#..|.#..#.#|S..##..',
  B3: '#.#####|#.#####|#...###|#.#.###|S.#..*#',
  BY: '#......|#.####*|#.....#|#####.#|S.....#',
  R: '#######|#.....*|#.#####|#...###|S.#####',
  Q1: '###...*|###.###|#...###|#.#####|S.#####',
  Q2: '*######|.######|.....##|####.##|S....##',
  Q3: '.#...#*|.#.#.#.|...#...|#.##.#.|S.#...#',
  QY: '#...#..|#.#.#.#|..#...#|.####.*|S....##',
  KN: '#######|#K.E..*|##.####|##.####|S..####',
  K1: '#######|##.####|##..E.*|##.####|S.K####',
  D1: '##...#*|#K#.##.|#.#..E.|#.#.###|S...###',
}
// xarita satri → maydon e'loni (maydonHtml): (x, y) — y tepaga
const labM = (s) => {
  const r = s.split('|'), h = r.length, m = { w: r[0].length, h, start: [0, 0], devor: [] }
  r.forEach((q, i) => [...q].forEach((c, x) => { const y = h - 1 - i; if (c === '#') m.devor.push([x, y]); if (c === '*') m.yulduz = [x, y]; if (c === 'K') m.kalit = [x, y]; if (c === 'E') m.eshik = [x, y]; if (c === 'S') m.start = [x, y] }))
  return m
}
const lab = (id, aktyor, o = {}) => maydonHtml(labM(LBS[id]), { aktyor, ...o })

// kichik labirint (zinapoya, reja, keyingi dars) — 8-darsdagidek: start, devor, kalit, eshik, yulduz; yo'l va yechim chizilmaydi (audit saboqlari 1)
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
const miniL = (id, cls) => miniKatak(LBS[id], cls)

// klaviatura tugmasi va kichik bloklar (huk kartalari, yangi so'z, xulosa)
const tugmaK = (b, cls = '') => `<span class="kt-t ${cls}">${b}</span>`
const kb = (t, cls = '') => `<span class="mb f-h ${cls}" data-tur="${t}">${IKON[t]}</span>`
const ka = () => `<span class="mb f-a" data-tur="a">${IKON.a}</span>`
const ke = () => `<span class="mb f-e" data-tur="k">${IKON.k}</span>`
const BUTA_M = '<svg class="hk-buta" viewBox="0 0 100 100" aria-hidden="true"><rect x="4" y="5" width="92" height="90" rx="30" fill="#3E8E4E"/><circle cx="31" cy="34" r="15" fill="#4FA35D"/><circle cx="67" cy="38" r="14" fill="#4FA35D"/><circle cx="36" cy="68" r="14" fill="#47995A"/><circle cx="68" cy="70" r="13" fill="#47995A"/></svg>'

// huk (2–4-qadam): bir xil 11 bosish (7-si adashgan ↑) — A o'z labirinti (HA, uchta devor kam), B ↑ dasturchasisiz, C qoida bilan
const AVTO = '→↑→→↑→↑→↑↑→'
const HUK = [
  ['A', 'Devorlarni kamaytiramiz', { dastur: 'shartsiz', lb: 'HA', nat: '✕ baribir urildi' }, () => `<span class="hk-q">${BUTA_M}<b class="hk-z">−</b></span>`],
  ['B', 'Adashgan tugmani olib tashlaymiz', { dastur: 'tepasiz', nat: '✕ ↑ kerak joyda yurmadi' }, () => `<span class="hk-q">${tugmaK('↑', 'katta')}<b class="hk-z">✕</b></span>`],
  ['C', 'Yurishdan oldin tekshirsin', { dastur: 'qoida', nat: '✓ adashsa ham yutdi' }, () => `<span class="hk-q">${tugmaK('→', 'katta')}<b class="hk-z hk-s">yo‘l bormi?</b></span>`],
]
const SONI = { A: 3, B: 4, C: 7 } // namuna (ustoz ekranida haqiqiy son)
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const hKartalar = ({ son, nat = false, avto = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}"${avto ? ` data-avto="${AVTO}" data-dastur="${d.dastur}"${d.lb ? ` data-lb="${d.lb}"` : ''}` : ''} data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}${son[l]}</span>` : ''}</div>`).join('')}</div>`

// tayyor dasturlar (HTML; blockly.js dasturchalarga ajratadi, if ichidagilari bilan)
const YON_T = { right: 'r', left: 'l', up: 'u', down: 'd' }
const dasturcha = (y, qoida) => mb('k', y) + (qoida ? shart(y, [YON_T[y]]) : mb(YON_T[y]))
const dstL = (yonlar, qoida, yuz) => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span>${yonlar.length ? `<div class="mbw">${yonlar.map((y) => dasturcha(y, qoida)).join('')}</div>` : '<span class="bosh">Blokni shu yerga ulang</span>'}<small class="dsn">${yonlar.length} ta dasturcha\n${yonlar.length * (qoida ? 3 : 2)} / 16 ta blok</small></div>`
const TORT = ['right', 'left', 'up', 'down']

// uch zinapoya (8, 11, 15-qadam)
const POG = {
  bosh: [['1', 10, miniL('B1'), 'To‘g‘ri yo‘l'], ['2', 8, miniL('B2'), 'Tepaga'], ['3', 5, miniL('B3'), 'Pastga ham'], ['★', 2, miniL('BY'), 'Orqaga']],
  qoida: [['1', 9, miniL('Q1'), 'Qoida'], ['2', 7, miniL('Q2'), 'Ilon yo‘l'], ['3', 5, miniL('Q3'), 'Boshi berk yo‘llar'], ['★', 2, miniL('QY'), 'Qadam tovushi']],
  oyin: [['1', 8, miniL('K1'), 'Kalit va eshik'], ['2', 5, miniL('D1'), 'Labirint o‘yini'], ['★', 2, miniL('D1'), 'Startga qaytish']],
}
// bekatlar: boshqaruv · qoida · kalit va yulduz
const TORT_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l3 3.4H9zM12 21l-3-3.4h6zM3 12l3.4-3v6zM21 12l-3.4 3V9z" fill="#fff"/></svg>'
const KALIT_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="12" r="4.6" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M12.4 12H21M18 12v3.6M15.2 12v2.6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>'
const BEKATLAR = [['h', 'Boshqaruv', TORT_OQ], ['g', 'Qoida', IKON.a], ['y', 'Kalit va yulduz', KALIT_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · o‘z labirint o‘yiningiz</small><div class="kd3-r lb2">${miniL('D1', 'kd-mk')}</div><b>Qoidasini o‘qib berasiz</b></div>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${miniKatak('S..#..*|.#...#.|...#...', 'kd-mk')}</div><b>10 · Labirint o‘yini 2</b></div>`
// natija (17, 18-qadam): marta tugma bosdi · marta devor oldida to'xtadi · labirint yutdi
const TUGMA_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M8 12h7M12.5 9l3 3-3 3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const DEVOR_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h11" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/><path d="M10 7l5 5-5 5" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="17" y="4" width="4" height="16" rx="1.5" fill="#fff"/></svg>'
const SINF_T = [['h', TUGMA_OQ, 'marta tugma bosdi', 1240], ['g', DEVOR_OQ, 'marta devor oldida to‘xtadi', 96], ['y', YULDUZ_OQ, 'labirint yutdi', 112]]
const BOLA_T = [['h', TUGMA_OQ, 'marta tugma bosdi', 94], ['g', DEVOR_OQ, 'marta devor oldida to‘xtadi', 7], ['y', YULDUZ_OQ, 'labirint yutdi', 9]]
// chek-list (17-qadam bola natijasida; studiya.js labNatija to'ldiradi) — namunada bo'sh bandlar
const chekY = () => `<div class="gl chek-y">${['To‘rt strelka', 'Qoida', 'Kalit va eshik', 'Yulduz'].reduce((a, t) => a + `<span class="ch-r"><i></i>${t}</span>`, '<div class="chek"><small>O‘yiningizda:</small>') + '</div>'}</div>`

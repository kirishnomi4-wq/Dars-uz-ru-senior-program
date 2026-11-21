// 4-dars «Hodisalar» — darsning o'z ekran bo'laklari (20.11). Manba: new-junior/manba/004-hodisalar.md.
// Maydon — 3-darsdagi (katak.js maydonHtml): 7 × 5, (x, y), Y tepaga; bezak — uchta daraxt va gullar.
const MB = { w: 7, h: 5, daraxt: [[1, 1], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] }
const md = (m = {}) => ({ ...MB, start: [0, 0], ...m })
const maydon = (m, aktyor, o = {}) => maydonHtml(md(m), { aktyor, ...o })
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))

// klaviatura tugmasi (oq, strelka bilan) va to'rt strelka tugmasi
const tugmaK = (b, cls = '') => `<span class="kt-t ${cls}">${b}</span>`
const strelkalar = (cls = '') => `<span class="kt4 ${cls}">${tugmaK('↑', 'u')}${tugmaK('←', 'l')}${tugmaK('↓', 'd')}${tugmaK('→', 'r')}</span>`
// kichik dastur (huk A kartasi): ko'k katakchalar yuqoridan pastga
const dk = (dastur) => `<div class="dk">${[...dastur].map((t) => `<span class="mb f-h" data-tur="${t}">${IKON[t]}</span>`).join('')}</div>`

// huk (2–4-qadam, 4·10 A): yulduz har sinov boshida (4, 2) da va yurish paytida qochadi (data-qoch «N:x,y»): A — tayyor dastur 3-qadamdan keyin
// yulduz (2, 3) ga; B — o'sha dastur qayta, yulduz (5, 1) ga; C — o'yin, 2-bosishdan keyin (1, 4) ga — ustoz strelkalar bilan ortidan boradi
const HUK = [
  ['A', 'Tayyor dastur', { yulduz: '4,2', qoch: '3:2,3', dastur: 'rrrruu', nat: '✕ yulduz boshqa joyda' }, () => dk('rrrruu')],
  ['B', 'Ishga tushirni qayta bosamiz', { yulduz: '4,2', qoch: '3:5,1', dastur: 'rrrruu', nat: '✕ yana o‘sha yo‘l' }, () => `<span class="hk-play">${PLAY}</span>`],
  ['C', 'Strelka bosilganda yursin', { yulduz: '4,2', qoch: '2:1,4', oyin: '1', nat: '✓ yetib bordi' }, () => strelkalar()],
]
const SONI = { A: 5, B: 3, C: 6 } // namuna (ustoz ekranida haqiqiy son)
const HUK_M = { yulduz: [4, 2] }
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const hKartalar = ({ son, nat = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}" data-yulduz="${d.yulduz}" data-qoch="${d.qoch}"${d.dastur ? ` data-dastur="${d.dastur}"` : ''}${d.oyin ? ' data-oyin="1"' : ''} data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}${son[l]}</span>` : ''}</div>`).join('')}</div>`

// kichik maydon rasmi (zinapoya va reja kartalari) — 3-darsdagidek
const miniMaydon = (belgi = [], { yol = [], cls = 'mini' } = {}) => {
  const W = MB.w * 10, H = MB.h * 10, Y = (y) => (MB.h - 1 - y) * 10
  let h = ''
  for (let q = 0; q < MB.h; q++) for (let x = 0; x < MB.w; x++) h += `<rect x="${x * 10 + 0.6}" y="${q * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${(x + MB.h - 1 - q) % 2 ? '#F7EACB' : '#F3E3BE'}"/>`
  MB.daraxt.forEach(([x, y]) => { h += `<circle cx="${x * 10 + 3.6}" cy="${Y(y) + 3.6}" r="2.8" fill="#3E8E4E"/>` })
  if (yol.length > 1) h += `<polyline points="${yol.map(([x, y]) => `${x * 10 + 5},${Y(y) + 5}`).join(' ')}" fill="none" stroke="#E3B53A" stroke-width="1.6" stroke-dasharray="2.4 2" stroke-linecap="round"/>`
  belgi.forEach(([x, y, t]) => {
    const X0 = x * 10, Y0 = Y(y)
    if (t === 'y') h += `<path transform="translate(${X0 + 5} ${Y0 + 5.2}) scale(3.4)" d="${KT_YULDUZ}" fill="#F5B82E" stroke="#C98A0E" stroke-width=".08"/>`
    if (t === 'o') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5.4}" r="2.7" fill="#F0435A"/><path d="M${X0 + 5} ${Y0 + 2.8}l.7-1.2" stroke="#4CB050" stroke-width=".9"/>`
    if (t === 'q') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5}" r="2.4" fill="#2F8FF0"/>`
  })
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#9AD57C" opacity=".55"/>${h}</svg>`
}
// o'yin maydonlari (manba «Topshiriqlar» jadvali)
const OYIN_M = {
  P8: { olma: [[2, 1], [5, 3], [6, 0]], yulduz: [0, 4], yashirin: true },
  B3A: { olma: [[1, 2], [4, 4], [6, 2]], yulduz: [0, 4], yashirin: true },
  B3B: { olma: [[0, 4], [2, 0], [3, 3], [5, 2], [6, 4]], yulduz: [3, 1], yashirin: true },
  B3Y: { olma: [[2, 2], [5, 3], [1, 4]], yulduz: [6, 0], yashirin: true },
}
const ol = (m) => [...m.olma.map(([x, y]) => [x, y, 'o']), [...m.yulduz, 'y']]
// uch zinapoya (8, 11, 15-qadam)
const POG = {
  bir: [['1', 10, miniMaydon([[0, 0, 'q'], [4, 0, 'y']]), 'O‘ngga'], ['2', 8, miniMaydon([[5, 0, 'q'], [2, 0, 'y']]), 'Chapga'], ['3', 5, miniMaydon([[0, 0, 'q'], [3, 2, 'y']]), 'Ikki tugma'], ['★', 2, miniMaydon([[0, 0, 'q'], [6, 4, 'y']]), 'Ikki katak']],
  tort: [['1', 9, miniMaydon([[0, 0, 'q'], [4, 4, 'y']]), 'To‘rt strelka'], ['2', 7, miniMaydon([[0, 0, 'q'], [2, 3, 'o'], [5, 0, 'y']]), 'Olma, keyin yulduz'], ['3', 5, miniMaydon([[3, 2, 'q'], [1, 4, 'o'], [5, 4, 'o'], [3, 0, 'y']]), 'Ikki olma'], ['★', 2, miniMaydon([[0, 0, 'q'], [6, 4, 'y']], { yol: [[0, 0], [6, 0], [6, 4]] }), 'Boshiga qayt']],
  oyin: [['1', 8, miniMaydon([[0, 0, 'q'], ...ol(OYIN_M.B3A)]), 'Uch olma'], ['2', 5, miniMaydon([[0, 0, 'q'], ...ol(OYIN_M.B3B)]), 'Besh olma'], ['★', 2, miniMaydon([[0, 0, 'q'], ...ol(OYIN_M.B3Y)]), 'O‘z o‘yiningiz']],
}
// bekatlar (reja tepaligi): bitta tugma · to'rt tugma · o'yin
const TUGMA_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M8 12h7M12.5 9l3 3-3 3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const TORT_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l3 3.4H9zM12 21l-3-3.4h6zM3 12l3.4-3v6zM21 12l-3.4 3V9z" fill="#fff"/></svg>'
const OLMA_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#fff"/><path d="M12 8c-.4-2-1.8-3.4-1.8-3.4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>'
const BEKATLAR = [['h', 'Bitta tugma', TUGMA_OQ], ['g', 'To‘rt tugma', TORT_OQ], ['y', 'O‘yin', OLMA_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · o‘yin</small><div class="kd3-r lb2">${miniMaydon([[0, 0, 'q'], ...ol(OYIN_M.P8)], { cls: 'kd-mk' })}</div><b>Olma terish</b></div>`
// keyingi dars: takrorlash — bitta blok ichida ko'p qadam (kvadrat yo'l)
const TAKROR_RASM = `<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#F4F8FD"/><path d="M34 14h32v32H34z" fill="none" stroke="#E3B53A" stroke-width="3" stroke-dasharray="5 4" stroke-linejoin="round"/><path d="M28 50a22 22 0 1 1 8 6" fill="none" stroke="#2F8FF0" stroke-width="3" stroke-linecap="round"/><path d="M33 59l4-3-4-4" fill="none" stroke="#2F8FF0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${TAKROR_RASM}</div><b>5 · Takrorlash</b></div>`
// tayyor dasturchalar (to'rt strelka)
const TORT = [['k', 'right'], 'r', ['k', 'left'], 'l', ['k', 'up'], 'u', ['k', 'down'], 'd']
// natija (17, 18-qadam): marta tugma bosdi · olma terdi · marta yutdi
const SINF_T = [['h', TUGMA_OQ, 'marta tugma bosdi', 1460], ['g', OLMA_OQ, 'olma terdi', 156], ['y', YULDUZ_OQ, 'marta yutdi', 28]]
const BOLA_T = [['h', TUGMA_OQ, 'marta tugma bosdi', 126], ['g', OLMA_OQ, 'olma terdi', 14], ['y', YULDUZ_OQ, 'marta yutdi', 3]]

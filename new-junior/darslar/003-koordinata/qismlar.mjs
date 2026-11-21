// 3-dars «X va Y» (Koordinatalar) — darsning o'z ekran bo'laklari (20.11). Manba: new-junior/manba/003-koordinata.md («Maydon va manzillar»).
// yigish.mjs ulaydi: dvigatel/qismlar.mjs va katak.js dan keyin (rasmlar, bloklar, maydonHtml), dars ekranlaridan oldin.
// Hamma manzil (x, y) da: boshi pastki chap (0, 0), X o'ngga, Y tepaga. Maydon 7 × 5; bezak — uchta daraxt va gullar (devor emas).
const MB = { w: 7, h: 5, daraxt: [[1, 2], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] }
const md = (m = {}) => ({ ...MB, start: [0, 0], ...m })
// maydon (katak.js maydonHtml): m — start, yulduz, yashirin, olma; o — qahramon joyi, bantlar, izlar, bayroqcha, yorliq
const maydon = (m, aktyor, o = {}) => maydonHtml(md(m), { aktyor, ...o })
// maydondagi qahramon: ustozda Coddy, bolada o'z qahramoni (oldindan chiziladi — malumot.mjs, har qahramon uchun)
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))

// huk (2–4-qadam): yulduz (4, 2) da yashirin; uchta xat. A — daraxt yonidagi uchta katak yonadi, B — pastki qatordagi yettita, C — qahramon yuradi
// (o'ngga 4, tepaga 2: dastur rrrruu). nat — sinov natijasi kartaning o'zida (80-qaror)
const HUK = [
  ['A', 'Yulduz daraxt yonida', { yon: '2,2;4,2;5,1', nat: '✕ 3 ta katak' }],
  ['B', 'Yulduz pastki qatorda', { yon: '0,0;1,0;2,0;3,0;4,0;5,0;6,0', nat: '✕ 7 ta katak' }],
  ['C', 'Yulduz: o‘ngga 4, tepaga 2', { dastur: 'rrrruu', nat: '✓ bitta katak' }],
]
const SONI = { A: 7, B: 3, C: 4 } // namuna (ustoz ekranida haqiqiy son yoziladi — qobiq.js, hisob)
const HUK_M = { yulduz: [4, 2], yashirin: true }
const XAT = '<svg class="xt-i" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.4" fill="#FFF7E2" stroke="#C98A0E" stroke-width="1.6"/><path d="M3.4 6.4l8.6 6.6 8.6-6.6" fill="none" stroke="#C98A0E" stroke-width="1.6" stroke-linejoin="round"/></svg>'
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const xKartalar = ({ son, nat = false } = {}) => `<div class="jv dkv xkv">${HUK.map(([l, t, d]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}"${d.yon ? ` data-yon="${d.yon}"` : ''}${d.dastur ? ` data-dastur="${d.dastur}"` : ''} data-nat="${d.nat}"><span class="jt"><span><b>${l}</b>${XAT}<q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}${son[l]}</span>` : ''}</div>`).join('')}</div>`

// kichik maydon rasmi (zinapoya va reja kartalari): 7 × 5 kataklar; belgi — [[x, y, tur]…]: 'y' yulduz, 'o' olma, 'k' topiladigan katak, 'q' qahramon (start), 'b' bayroqcha
const miniMaydon = (belgi = [], { yol = [], cls = 'mini' } = {}) => {
  const W = MB.w * 10, H = MB.h * 10, Y = (y) => (MB.h - 1 - y) * 10
  let h = ''
  for (let q = 0; q < MB.h; q++) for (let x = 0; x < MB.w; x++) h += `<rect x="${x * 10 + 0.6}" y="${q * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${(x + MB.h - 1 - q) % 2 ? '#F7EACB' : '#F3E3BE'}"/>`
  MB.daraxt.forEach(([x, y]) => { h += `<circle cx="${x * 10 + 3.6}" cy="${Y(y) + 3.6}" r="2.8" fill="#3E8E4E"/>` })
  if (yol.length > 1) h += `<polyline points="${yol.map(([x, y]) => `${x * 10 + 5},${Y(y) + 5}`).join(' ')}" fill="none" stroke="#E3B53A" stroke-width="1.6" stroke-dasharray="2.4 2" stroke-linecap="round"/>`
  belgi.forEach(([x, y, t]) => {
    const X0 = x * 10, Y0 = Y(y)
    if (t === 'k') h += `<rect x="${X0 + 0.6}" y="${Y0 + 0.6}" width="8.8" height="8.8" rx="2" fill="#FBD266" stroke="#E3A81A" stroke-width=".9"/>`
    if (t === 'y') h += `<path transform="translate(${X0 + 5} ${Y0 + 5.2}) scale(3.4)" d="${KT_YULDUZ}" fill="#F5B82E" stroke="#C98A0E" stroke-width=".08"/>`
    if (t === 'o') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5.4}" r="2.7" fill="#F0435A"/><path d="M${X0 + 5} ${Y0 + 2.8}l.7-1.2" stroke="#4CB050" stroke-width=".9"/>`
    if (t === 'q') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5}" r="2.4" fill="#2F8FF0"/>`
    if (t === 'b') h += `<path d="M${X0 + 3.6} ${Y0 + 8.4}V${Y0 + 1.6}l4.2 1.5-4.2 1.6" fill="#FF4F28" stroke="#5A3B1E" stroke-width=".7" stroke-linejoin="round"/>`
  })
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#9AD57C" opacity=".55"/>${h}</svg>`
}
// uch zinapoya (8, 11, 15-qadam): [raqam, namuna son, rasm, nomi] — son ustoz ekranida haqiqiy songa almashadi (qobiq.js, hisob)
const POG = {
  top: [['1', 10, miniMaydon([[3, 0, 'k']]), 'Pastki qator'], ['2', 8, miniMaydon([[0, 2, 'k']]), 'Chap ustun'], ['3', 5, miniMaydon([[4, 3, 'k']]), 'Istalgan katak'], ['★', 2, miniMaydon([[2, 4, 'k'], [4, 2, 'k']]), 'Ikki o‘xshash manzil']],
  // doskada javob ko'rinmaydi (audit 20.11): yashirin yulduz va bayroqcha chizilmaydi — faqat qahramon joyi va ko'rinadigan olmalar
  bor: [['1', 9, miniMaydon([[0, 0, 'q']]), 'Bitta manzil'], ['2', 7, miniMaydon([[0, 0, 'q'], [2, 1, 'o']]), 'Ikki manzil'], ['3', 5, miniMaydon([[0, 0, 'q'], [1, 3, 'o'], [5, 1, 'o']]), 'Uch manzil'], ['★', 2, miniMaydon([[0, 0, 'q']], { yol: [[0, 0], [2, 4], [4, 0], [6, 4]] }), 'O‘z yo‘lingiz']],
  ayt: [['1', 9, miniMaydon([[1, 1, 'q']]), 'To‘rt blok'], ['2', 7, miniMaydon([[0, 0, 'q']]), 'Pastga ham'], ['3', 5, miniMaydon([[0, 0, 'q']]), 'go to bilan'], ['★', 2, miniMaydon([[0, 0, 'q']]), 'Ikki go to']],
}

// bekatlar (reja tepaligi): rangi — reja ranglari (ko'k, binafsha, oltin); belgisi — manzil yorlig'i, go to nishoni, bayroqcha
const XY_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v16h16" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="10" r="3" fill="#fff"/></svg>'
const BAYROQ_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V3" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/><path d="M7 3.6l12 4-12 4.2z" fill="#fff"/></svg>'
const BEKATLAR = [['h', 'Manzilni o‘qiymiz', XY_OQ], ['g', 'Manzilga boramiz', IKON.x], ['y', 'Oldindan aytamiz', BAYROQ_OQ]]
// reja cho'qqisidagi karta va yakundagi keyingi dars
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · o‘z yo‘lingiz</small><div class="kd3-r lb2">${miniMaydon([[0, 0, 'q']], { yol: [[0, 0], [2, 4], [4, 0], [6, 4]], cls: 'kd-mk' })}</div><b>Manzillarni o‘qib berasiz</b></div>`
const HODISA_RASM = `<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#F4F8FD"/>${[[40, 8, 'M50 26V14M45 19l5-5 5 5'], [40, 36, 'M50 42v12M45 49l5 5 5-5'], [12, 36, 'M28 48H16M21 43l-5 5 5 5'], [68, 36, 'M72 48h12M79 43l5 5-5 5']].map(([x, y, d]) => `<rect x="${x}" y="${y}" width="20" height="20" rx="4" fill="#fff" stroke="#9DB7DA" stroke-width="1.6"/><path d="${d}" fill="none" stroke="#0D2137" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</svg>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${HODISA_RASM}</div><b>4 · Hodisalar</b></div>`

// «oldindan ayting» dasturi (14, 15-qadam): HTML bloklar (o'zgarmaydi, Blockly'siz — studiya.js bashorat); sanoq — har blok yonida «X: 2» kabi yozuv,
// ustoz «Keyingi» bilan birma-bir yoqadi (data-r). dastur — [['r'], ['x', '2,3'], …], start — qahramon boshlang'ich joyi
const sanoqlar = (start, dastur) => { let [x, y] = start; return dastur.map(([t, m]) => { if (t === 'r') return 'X: ' + ++x; if (t === 'l') return 'X: ' + --x; if (t === 'u') return 'Y: ' + ++y; if (t === 'd') return 'Y: ' + --y; [x, y] = m.split(',').map(Number); return mdYorliq(x, y) }) }
const dstTayyor = (start, dastur, yuz, { sanoq = false } = {}) => { const s = sanoqlar(start, dastur); return `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span><div class="mbw">${dastur.map(([t, m], i) => { const h = mb(t, m); return sanoq ? `<div class="sq-q">${h}<b class="sq" data-r="${i + 1}">${s[i]}</b></div>` : h }).join('')}</div><small class="dsn">${dastur.length} ta blok</small></div>` }
// 14, 15-qadam dasturlari (manba «Topshiriqlar» jadvali; to'xtash joyini sinov o'zi sanaydi — sinov/dvigatel/maydon.mjs)
const BASH = {
  P8: { start: [1, 1], d: [['r'], ['r'], ['u']] },
  B3A: { start: [1, 1], d: [['r'], ['r'], ['u'], ['r']] },
  B3B: { start: [0, 0], d: [['u'], ['u'], ['r'], ['r'], ['r'], ['d'], ['r']] },
  B3C: { start: [0, 0], d: [['x', '2,3'], ['r'], ['d'], ['r'], ['d'], ['r']] },
  B3Y: { start: [0, 0], d: [['x', '5,4'], ['l'], ['l'], ['l'], ['d'], ['x', '1,0'], ['u'], ['u'], ['r']] },
}
// natija (17, 18-qadam): katak topdi · manzilga bordi · marta oldindan aytdi. SINF_T — butun sinf (namuna; ustozda haqiqiy jami), BOLA_T — bolaning o'zi
const SINF_T = [['h', XY_OQ, 'katak topdi', 64], ['g', IKON.x, 'manzilga bordi', 98], ['y', BAYROQ_OQ, 'marta oldindan aytdi', 41]]
const BOLA_T = [['h', XY_OQ, 'katak topdi', 5], ['g', IKON.x, 'manzilga bordi', 9], ['y', BAYROQ_OQ, 'marta oldindan aytdi', 4]]

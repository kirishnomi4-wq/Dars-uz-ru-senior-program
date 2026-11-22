// 14-dars «Xatoni topish» — darsning o'z ekran bo'laklari (21.11). Manba: new-junior/manba/014-xatoni-topish.md («Maydon, labirint va bloklar», «Topshiriqlar»).
// Maydon — 3–6-darsdagi bog' (katak.js maydonHtml): 7 × 5, (x, y), Y tepaga; ikki labirint — 8-dars (katakHtml, egizak); savatlar — 13-dars (m.savat).
// Rasm topshiriqlarining kulrang kataklari qo'lda yozilmaydi: tuzatilgan dastur yoliYur() bilan yuriladi (6-darsdagidek — rasm va yechim ajralmaydi).
const MB = { w: 7, h: 5, daraxt: [[1, 1], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] }
const md = (m = {}) => ({ ...MB, start: [0, 0], ...m })
const maydon = (m, aktyor, o = {}) => maydonHtml(md(m), { aktyor, ...o })
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))

// dastur yozuvi: 'r' — move; ['p', n, [...]] — repeat; ['x', X, Y] — go to; ['a', yon, [...]] — if path (8-dars)
const DY = { r: [1, 0], l: [-1, 0], u: [0, 1], d: [0, -1] }
const tekis = (d) => d.flatMap((t) => (Array.isArray(t) && t[0] === 'p' ? Array.from({ length: t[1] }, () => tekis(t[2])).flat() : [t]))
const yoliYur = (start, d) => { let [x, y] = start; const r = [[x, y]]; for (const t of tekis(d)) { if (Array.isArray(t)) { x = t[1]; y = t[2] } else { x += DY[t][0]; y += DY[t][1] } r.push([x, y]) } return r }
const kataklar = (start, d) => { const s = new Set(), r = []; for (const p of yoliYur(start, d)) { if (!s.has(String(p))) { s.add(String(p)); r.push(p) } } return r }
const cBlok = (atr, bosh, ichki) => `<div class="c-blok" ${atr}>${bosh}<div class="c-ich">${dHtml(ichki)}</div><span class="c-tub"></span></div>`
const dHtml = (d) => d.map((t) => (!Array.isArray(t) ? mb(t) : t[0] === 'x' ? mb('x', t[1] + ',' + t[2]) : t[0] === 'a' ? cBlok(`data-yon="${t[1]}"`, mb('a', t[1]), t[2]) : cBlok(`data-n="${t[1]}"`, mb('p', String(t[1])), t[2]))).join('')
const sanaBl = (d) => d.reduce((a, t) => a + (Array.isArray(t) && (t[0] === 'p' || t[0] === 'a') ? 1 + sanaBl(t[2]) : 1), 0)
const dstT = (d, yuz, chegara) => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span>${d.length ? `<div class="mbw">${dHtml(d)}</div>` : '<span class="bosh">Blokni shu yerga ulang</span>'}<small class="dsn">${chegara ? `${sanaBl(d)} / ${chegara} ta blok` : `${sanaBl(d)} ta blok`}</small></div>`

// rasmlar: tuzatilgan dastur → kulrang kataklar; xato — tayyor dastur (manba jadvali)
const RASM = {
  HUK: { start: [0, 0], d: [['p', 2, ['r']], ['p', 2, ['u']], ['p', 3, ['r']]], xato: [['p', 2, ['r']], ['p', 3, ['u']], ['p', 3, ['r']]] }, // «Tepalik»
  P7: { start: [2, 0], d: [['p', 3, ['r', 'u']]], xato: [['p', 3, ['u', 'r']]] }, // «Zinapoya»
  B2A: { start: [0, 0], d: [['p', 2, ['u']], ['p', 3, ['r']]], xato: [['p', 2, ['u']], 'u', ['p', 3, ['r']]] }, // «Ilmoq»
  B2B: { start: [0, 2], d: ['r', 'r', 'd', 'd', 'r', 'r'], xato: ['r', 'r', 'd', 'r', 'r'] }, // «Ilon»
  B2C: { start: [2, 0], d: [['p', 2, ['u']], ['p', 2, ['r']], ['p', 2, ['d']]], xato: [['p', 2, ['u']], ['p', 2, ['d']], ['p', 2, ['r']]] }, // «Darvoza»
  B2Y: { start: [0, 0], d: [['p', 3, ['u']], ['x', 3, 0], ['p', 4, ['u']], ['x', 5, 0], ['p', 3, ['u']]], xato: [['p', 3, ['u']], ['x', 2, 0], ['p', 4, ['u']], ['x', 5, 0], ['p', 3, ['u']]] }, // «Uch ustun»
}
const rasmM = (id) => ({ start: RASM[id].start, rasm: kataklar(RASM[id].start, RASM[id].d) })
// yulduz topshiriqlari (1-bekat) va topishmoq maydoni (15 · ★, 16-qadam)
const YOL = {
  B1A: { start: [0, 0], olma: [[4, 1]], yulduz: [4, 2], xato: [['p', 4, ['l']], ['p', 2, ['u']]] }, // «Burilish»
  B1B: { start: [5, 3], olma: [[5, 2], [5, 1]], yulduz: [5, 0], xato: [['p', 5, ['d']]] }, // «Pastga»
  B1C: { start: [0, 0], olma: [[6, 2], [4, 2], [2, 2]], yulduz: [1, 2], xato: [['x', 5, 2], ['p', 5, ['l']]] }, // «Qator»
  B1Y: { start: [6, 0], olma: [[3, 0]], yulduz: [0, 2], xato: [['p', 6, ['r']], ['p', 3, ['u']]] }, // «Ikki xato»
  B3Y: { start: [0, 0], olma: [[2, 2]], yulduz: [4, 2] }, // «Topishmoq»
}
const yolM = (id) => { const { xato, ...m } = YOL[id]; return m }

// 3 · 1 — ikki labirint (8-dars egizak): yuqori qator — labirintning tepasi
const LB = { B3A: ['#######|S...*##|#######', '###.*|##..#|#..##|S.###'] }
const tik = (x) => { const xr = katakXarita(x); return xr.length > Math.max(...xr.map((s) => s.length)) }
const kNom = (h, n) => h.replace('<div class="katak" data-z="sahna"', '<div class="katak" data-egiz="' + n + '" data-z="sahna"').replace(/(<div class="katak"[^>]*>)/, '$1<span class="egiz-n">' + n + '</span>')
const egiz = (id, aktyor) => `<div class="egiz${tik(LB[id][0]) || tik(LB[id][1]) ? ' yon' : ''}">${kNom(katakHtml(LB[id][0], { aktyor }), 1)}${kNom(katakHtml(LB[id][1], { aktyor }), 2)}</div>`
// 3 · 2 — o'yin «Olma terish» (4-dars): yulduz yashirin; to'rt tayyor dasturcha — ikkinchi when ↑ da xato (↓ bo'lishi kerak)
const OYIN_M = { B3B: { start: [0, 0], olma: [[2, 2], [5, 0]], yulduz: [3, 4], yashirin: true } }
const OYIN_D = [['k', 'right'], 'r', ['k', 'left'], 'l', ['k', 'up'], 'u', ['k', 'up'], 'd']
// 3 · 3 va 14-qadam — savatlar (13-dars olma dasturi): qahramon kuzatadi
const M13 = { P8: { savat: DARS.savatlar.P8, start: [0, 2] }, B3C: { savat: DARS.savatlar.B3C, start: [3, 0] } }
const OLMA_IK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8c-.6-2.4-2.6-3.6-2.6-3.6" fill="none" stroke="#6B4423" stroke-width="1.7" stroke-linecap="round"/><path d="M12.6 6.6c1.4-2.4 4.4-2.4 4.4-2.4-.4 2.4-2.6 3.2-4.4 2.4z" fill="#4CB050"/><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#F0435A"/></svg>'
const dstOlma = (r, chegara) => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz olma-ega">${OLMA_IK}</span><b>Olma dasturi</b></span><div class="mbw">${r.map((x) => mb(...x)).join('')}</div><small class="dsn">${r.length} / ${chegara} ta blok</small><small class="sinov-n">Sinov: 0 / 3</small></div>`

// huk (2–4-qadam): «Tepalik» — A oxirgi repeat 3→2, B birinchi repeat 2→3 (oddiy ishga tushirish), C — tayyor xatoli dastur «Bitta qadam» bilan
const dar = (d) => d.map((t) => (!Array.isArray(t) ? { t } : t[0] === 'p' ? { t: 'p', n: t[1], ichki: dar(t[2]) } : { t: 'x', x: t[1], y: t[2] }))
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const kb = (t, cls = '') => `<span class="mb f-h ${cls}" data-tur="${t}">${IKON[t]}</span>`
const kp = (cls = '') => `<span class="mb f-b ${cls}" data-tur="p">${IKON.p}</span>`
const HUK = [
  ['A', 'Oxirgi blokni tuzatamiz', { daraxt: dar([['p', 2, ['r']], ['p', 3, ['u']], ['p', 2, ['r']]]), nat: '✕ xato boshqa joyda', ok: '0' }, () => `<div class="dk gor hk-a">${kp()}<b class="hk-x">3</b>${kb('r')}<b class="hk-ok">→ 2</b></div>`],
  ['B', 'Har xil o‘zgartirib ko‘ramiz', { daraxt: dar([['p', 3, ['r']], ['p', 3, ['u']], ['p', 3, ['r']]]), nat: '✕ rasm battar', ok: '0' }, () => `<div class="dk gor hk-b">${kp()}<span class="hk-ro"><i>2</i><i class="on">3</i><i>4</i></span></div>`],
  ['C', 'Qadam-baqadam yuramiz', { daraxt: dar(RASM.HUK.xato), nat: '✓ 5-qadamda topildi', ok: '1', qadam: '520' }, () => `<span class="bq-r">Bitta qadam<small>5-qadam</small></span>`],
]
const SONI = { A: 3, B: 2, C: 9 } // namuna (ustoz ekranida haqiqiy son)
const tKartalar = ({ son, nat = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}" data-daraxt='${JSON.stringify(d.daraxt)}' data-ok="${d.ok}" data-nat="${d.nat}"${d.qadam ? ` data-qadam="${d.qadam}"` : ''}><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}${son[l]}</span>` : ''}</div>`).join('')}</div>`
// huk maydoni: kulrang «Tepalik» va xato dasturning oltin izi (rasmdan chiqqan), Coddy (5, 3) da; javobda — tuzatilgan iz, Coddy (5, 2)
const HUK_M = rasmM('HUK')
const hukMaydon = (javob = false) => { const iz = yoliYur(RASM.HUK.start, javob ? RASM.HUK.d : RASM.HUK.xato); return maydon(HUK_M, coddyK(), { joy: iz[iz.length - 1], izlar: iz }) }

// kichik maydon (zinapoya, reja, natija): kulrang rasm, olma, yulduz, savat, qahramon — dastur va iz yo'q (audit saboqlari)
const miniMaydon = (belgi = [], { rasm = [], savat = [], cls = 'mini' } = {}) => {
  const W = MB.w * 10, H = MB.h * 10, Y = (y) => (MB.h - 1 - y) * 10
  let h = ''
  for (let q = 0; q < MB.h; q++) for (let x = 0; x < MB.w; x++) { const y = MB.h - 1 - q, r = rasm.some(([a, c]) => a === x && c === y); h += `<rect x="${x * 10 + 0.6}" y="${q * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${r ? '#C9CDD3' : (x + y) % 2 ? '#F7EACB' : '#F3E3BE'}"/>` }
  MB.daraxt.forEach(([x, y]) => { h += `<circle cx="${x * 10 + 3.6}" cy="${Y(y) + 3.6}" r="2.8" fill="#3E8E4E"/>` })
  savat.forEach(([x, y]) => { h += `<path d="M${x * 10 + 1.6} ${Y(y) + 4}h6.8l-1 4.4h-4.8z" fill="#C9955A" stroke="#8A5A2E" stroke-width=".6"/>` })
  belgi.forEach(([x, y, t]) => {
    const X0 = x * 10, Y0 = Y(y)
    if (t === 'y') h += `<path transform="translate(${X0 + 5} ${Y0 + 5.2}) scale(3.4)" d="${KT_YULDUZ}" fill="#F5B82E" stroke="#C98A0E" stroke-width=".08"/>`
    if (t === 'o') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5.4}" r="2.7" fill="#F0435A"/><path d="M${X0 + 5} ${Y0 + 2.8}l.7-1.2" stroke="#4CB050" stroke-width=".9"/>`
    if (t === 'q') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5}" r="2.4" fill="#2F8FF0"/>`
  })
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#9AD57C" opacity=".55"/>${h}</svg>`
}
const miniR = (id) => miniMaydon([[...RASM[id].start, 'q']], { rasm: kataklar(RASM[id].start, RASM[id].d) })
const miniY = (id) => miniMaydon([[...YOL[id].start, 'q'], ...YOL[id].olma.map(([x, y]) => [x, y, 'o']), [...YOL[id].yulduz, 'y']])
// kichik labirint (3 · 1 kartasi): ikki labirint yonma-yon, faqat yo'l va yulduz
const miniLab = (id) => {
  const bir = (x, dx) => { const xr = katakXarita(x); let h = ''; xr.forEach((q, r) => [...q].forEach((c, k) => { h += `<rect x="${dx + k * 6 + 0.4}" y="${r * 6 + 0.4}" width="5.2" height="5.2" rx="1.2" fill="${c === '#' ? '#3E8E4E' : c === '*' ? '#F5B82E' : c === 'S' ? '#2F8FF0' : '#F7EACB'}"/>` })); return [h, Math.max(...xr.map((s) => s.length)) * 6, xr.length * 6] }
  const [a, w1, h1] = bir(LB[id][0], 0), [b, w2, h2] = bir(LB[id][1], 0)
  return `<svg class="mini mk" viewBox="-1 -1 ${w1 + w2 + 8} ${Math.max(h1, h2) + 2}" aria-hidden="true">${a}<g transform="translate(${w1 + 6} 0)">${b}</g></svg>`
}
const miniOyin = () => miniMaydon([[0, 0, 'q'], [2, 2, 'o'], [5, 0, 'o']])
const miniSavat = () => miniMaydon([[3, 0, 'q']], { savat: DARS.savatlar.B3C })
// uch zinapoya (8, 11, 15-qadam): doskada javob yo'q — nom rasmniki yoki maydonniki, xato turi aytilmaydi
const POG = {
  bir: [['1', 10, miniY('B1A'), 'Burilish'], ['2', 8, miniY('B1B'), 'Pastga'], ['3', 5, miniY('B1C'), 'Qator'], ['★', 2, miniY('B1Y'), 'Ikki xato']],
  ikki: [['1', 9, miniR('B2A'), 'Ilmoq'], ['2', 7, miniR('B2B'), 'Ilon'], ['3', 5, miniR('B2C'), 'Darvoza'], ['★', 2, miniR('B2Y'), 'Uch ustun']],
  uch: [['1', 8, miniLab('B3A'), 'Ikki labirint'], ['2', 6, miniOyin(), 'Olma terish'], ['3', 4, miniSavat(), 'Savatlar'], ['★', 2, miniY('B3Y'), 'Topishmoq']],
}
// bekatlar (reja tepaligi): to'xtagan joy · bitta qadam · yashirin xato
const TOX_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4.2" height="16" rx="1.4" fill="#fff"/><rect x="13.8" y="4" width="4.2" height="16" rx="1.4" fill="#fff"/></svg>'
const QADAM_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6l7 6-7 6z" fill="#fff"/><rect x="15" y="6" width="3.6" height="12" rx="1.2" fill="#fff"/></svg>'
const LUPA_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="5.6" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M14.4 14.4l5.2 5.2" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>'
const BEKATLAR = [['h', 'To‘xtagan joy', TOX_OQ], ['g', 'Bitta qadam', QADAM_OQ], ['y', 'Yashirin xato', LUPA_OQ]]
// dars oxirida — topishmoq (kichik maydonda yulduz, olma va xira iz)
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · topishmoq · Ustoz xatoni izlaydi</small><div class="kd3-r lb2">${miniMaydon([[0, 0, 'q'], [2, 2, 'o'], [4, 2, 'y']], { rasm: kataklar([0, 0], [['p', 2, ['u']], ['p', 4, ['r']]]), cls: 'kd-mk' })}</div><b>Topishmoq</b></div>`
// keyingi dars: 15 · Xakaton №1 — ikki qahramon va bitta o'yin maydoni
const XAKATON_RASM = `<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#F4F8FD"/><rect x="28" y="14" width="44" height="34" rx="5" fill="#9AD57C"/><circle cx="18" cy="30" r="9" fill="#2F8FF0"/><circle cx="82" cy="30" r="9" fill="#FF4F28"/><path transform="translate(50 31) scale(9)" d="${KT_YULDUZ}" fill="#F5B82E" stroke="#C98A0E" stroke-width=".08"/></svg>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${XAKATON_RASM}</div><b>15 · Xakaton №1</b></div>`
const otganDars = () => `<div class="otd"><small>O‘tgan darsda</small><div class="tf-l"><div class="tf"><div class="tf-r">${yigma([['m', '1-6']])}</div><div class="tf-t"><b>Tasodifiy son</b><span>Dastur o‘zi tanlaydigan son</span></div></div></div></div>`

// natija (17, 18-qadam): ta xato tuzatdi · marta «Bitta qadam» bosdi · pog‘ona bajardi
const SINF_T = [['h', LUPA_OQ, 'ta xato tuzatdi', 86], ['g', QADAM_OQ, 'marta «Bitta qadam» bosdi', 214], ['y', TOX_OQ, 'pog‘ona bajardi', 112]]
const BOLA_T = [['h', LUPA_OQ, 'ta xato tuzatdi', 7], ['g', QADAM_OQ, 'marta «Bitta qadam» bosdi', 18], ['y', TOX_OQ, 'pog‘ona bajardi', 9]]

// 11-dars «O‘zgaruvchi: ball» — darsning o'z ekran bo'laklari (21.11). Manba: new-junior/manba/011-ozgaruvchi-ball.md («Maydon, o'yin va bloklar», «Topshiriqlar»).
// Maydon — 4-darsdagi bog' (katak.js maydonHtml): 7 × 5, (x, y), Y tepaga; bezak — uchta daraxt va gullar; oltin olma — m.oltin. Sinov: sinov/dvigatel/ozgaruvchi.mjs
const MB = { w: 7, h: 5, daraxt: [[1, 1], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] }
const md = (m = {}) => ({ ...MB, start: [0, 0], ...m })
const maydon = (m, aktyor, o = {}) => maydonHtml(md(m), { aktyor, ...o })
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))
// sahnadagi ball (chap yuqorida, O'zgaruvchi rangida; studiya.js ballKor yangilaydi); ys — «O‘tgan o‘yindan qolgan ball» (2-bekat)
const ballK = (v = 0, { yashirin = false } = {}) => `<span class="gl ball-k${yashirin ? ' yashirin' : ''}" data-z="ball"><small>ball:</small><b>${v}</b></span>`
const qoldiYz = () => '<span class="gl ball-qy">O‘tgan o‘yindan qolgan ball</span>'

// o'yin maydonlari (manba «Topshiriqlar» jadvali): start · olmalar · oltin olma · yulduz (yashirin — hamma olma terilgach chiqadi)
const OYIN_M = {
  H: { olma: [[2, 0], [4, 0], [5, 2]] },
  P6: { olma: [[2, 0], [3, 2], [5, 2]], yulduz: [5, 0], yashirin: true },
  B1A: { olma: [[0, 2], [3, 1], [4, 0]], yulduz: [6, 0], yashirin: true },
  B1B: { olma: [[2, 1], [3, 4], [5, 2], [6, 0]], yulduz: [0, 3], yashirin: true },
  B1C: { start: [6, 4], olma: [[3, 2], [0, 0]], oltin: [[5, 0]], yulduz: [3, 4], yashirin: true },
  B1Y: { start: [3, 0], olma: [[0, 0], [0, 3], [5, 2], [6, 4]], oltin: [[3, 4]], yulduz: [2, 1], yashirin: true },
  B2A: { olma: [[1, 3], [3, 1], [5, 2], [6, 0]], yulduz: [4, 4], yashirin: true },
  B2B: { start: [6, 0], olma: [[4, 0], [2, 2], [0, 1]], yulduz: [3, 4], yashirin: true },
  B2C: { olma: [[3, 0], [5, 3]], oltin: [[2, 4]], yulduz: [6, 0], yashirin: true },
  B2Y: { olma: [[2, 1], [5, 2]], oltin: [[4, 4], [0, 3]], yulduz: [6, 0], yashirin: true },
}

// boshqaruv qatori (dastur tepasida; bosilsa to'rt dasturcha ochiladi — o'qish uchun, o'zgarmaydi)
const TORT = [['right', 'r', '→'], ['left', 'l', '←'], ['up', 'u', '↑'], ['down', 'd', '↓']]
const bqQ = () => `<div class="bq-q" role="button" data-z="boshqaruv"><b>Boshqaruv:</b><span class="bq-s">${TORT.map(([k, , s]) => `<i data-k="${k}">${s}</i>`).join('')}</span><span class="bq-o">▾</span><div class="bq-och">${TORT.map(([k, t]) => `<div class="bq-d">${mb('k', k)}${mb(t)}</div>`).join('')}<small>Boshqaruv tayyor — bloklar sanog‘iga kirmaydi</small></div></div>`
// dastur ustuni: boshqaruv qatori + bola dasturchalari (r — [t, m] ro'yxati, hodisa bloki yangi dasturcha boshlaydi); bq: false — boshqaruvsiz (3-bekat)
const dstB = (r, yuz, { bq = true } = {}) => {
  const n = r.filter((x) => ['q', 'f'].includes(typeof x === 'string' ? x : x[0])).length, bl = r.length
  return `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span>${bq ? bqQ() : ''}${bl ? yigma(r) : '<span class="bosh">Blokni shu yerga ulang</span>'}<small class="dsn">${n} ta dasturcha\n${bl} / 12 ta blok</small></div>`
}
// 3-bekat: tayyor dastur when ▶ clicked ostida (repeat — takror(n, ichki), C-blok); r — [t, m] yoki takror HTML
const dstT = (r, yuz) => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span><div class="mbw">${mb('f')}${r.map((x) => (typeof x === 'string' ? x : mb(...x))).join('')}</div><small class="dsn">1 ta dasturcha\n${1 + r.reduce((a, x) => a + (typeof x === 'string' ? (x.match(/class="mb /g) || []).length : 1), 0)} / 12 ta blok</small></div>`
// oldindan aytish sahnasi: katta kapsula «ball: ?», ostida oltita son kartasi; qahramon chapda
const bshSahna = (kartalar, aktyor) => `<div class="bsh" data-z="oldindan aytish"><span class="bsh-k"><small>ball:</small><b>?</b></span><div class="bsh-q">${kartalar.map((n) => `<span class="sk" role="button" data-v="${n}">${n}</span>`).join('')}</div><span class="bsh-qh">${aktyor}</span></div>`
const BASH = {
  P8: { d: [['z', 0], ['c', 2], ['c', 2], ['c', 1]], k: [2, 3, 4, 5, 6, 7] },
  B3A: { d: [['z', 3], ['c', 1], ['c', 5]], k: [3, 4, 5, 6, 8, 9] },
  B3B: { d: [['z', 0], () => takror('3', [['c', '2']])], k: [2, 3, 4, 5, 6, 8] },
  B3C: { d: [['z', 0], ['c', 5], ['z', 1], ['c', 1]], k: [0, 1, 2, 5, 6, 7] },
  B3Y: { d: [['z', 4], () => takror('2', [['c', '3'], ['c', '2']])], k: [9, 10, 11, 14, 15, 19] },
}
const bashDst = (id, yuz) => dstT(BASH[id].d.map((x) => (typeof x === 'function' ? x() : x)), yuz)
// kichik dastur rasmi (3-bekat zinapoyasi — faqat bloklar, son kartasi chizilmaydi): rangli qatorlar
const miniDastur = (d) => {
  const r = d.flatMap((x) => (typeof x === 'function' ? [] : [x])), takr = d.some((x) => typeof x === 'function')
  const qator = (c, i, w = 62, x = 14) => `<rect x="${x}" y="${6 + i * 9}" width="${w}" height="7" rx="2" fill="${c}"/>`
  let h = qator('#F08A24', 0, 54, 8), i = 1
  r.forEach(() => { h += qator('#A86B32', i++) })
  if (takr) { h += qator('#13A58A', i++, 58, 14); const ich = d.find((x) => typeof x === 'function'), n = (ich().match(/data-tur="c"/g) || []).length; for (let k = 0; k < n; k++) h += qator('#A86B32', i++, 48, 24) }
  return `<svg class="mini" viewBox="0 0 100 ${Math.max(44, 10 + i * 9)}" aria-hidden="true">${h}</svg>`
}

// kichik maydon rasmi (zinapoya va reja kartalari) — 4-darsdagidek; yulduz chizilmaydi (manba: «doskada son kartasi va yulduz chizilmaydi»)
const miniMaydon = (belgi = [], { cls = 'mini' } = {}) => {
  const W = MB.w * 10, H = MB.h * 10, Y = (y) => (MB.h - 1 - y) * 10
  let h = ''
  for (let q = 0; q < MB.h; q++) for (let x = 0; x < MB.w; x++) h += `<rect x="${x * 10 + 0.6}" y="${q * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${(x + MB.h - 1 - q) % 2 ? '#F7EACB' : '#F3E3BE'}"/>`
  MB.daraxt.forEach(([x, y]) => { h += `<circle cx="${x * 10 + 3.6}" cy="${Y(y) + 3.6}" r="2.8" fill="#3E8E4E"/>` })
  belgi.forEach(([x, y, t]) => {
    const X0 = x * 10, Y0 = Y(y)
    if (t === 'o' || t === 'g') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5.4}" r="2.7" fill="${t === 'g' ? '#F5B82E' : '#F0435A'}"${t === 'g' ? ' stroke="#C98A0E" stroke-width=".5"' : ''}/><path d="M${X0 + 5} ${Y0 + 2.8}l.7-1.2" stroke="#4CB050" stroke-width=".9"/>`
    if (t === 'q') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5}" r="2.4" fill="#2F8FF0"/>`
  })
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#9AD57C" opacity=".55"/>${h}</svg>`
}
const ol = (m) => [[...(m.start || [0, 0]), 'q'], ...m.olma.map(([x, y]) => [x, y, 'o']), ...(m.oltin || []).map(([x, y]) => [x, y, 'g'])]
// uch zinapoya (8, 11, 15-qadam)
const POG = {
  ball: [['1', 10, miniMaydon(ol(OYIN_M.B1A)), 'Uch olma'], ['2', 8, miniMaydon(ol(OYIN_M.B1B)), 'Ikki ball'], ['3', 5, miniMaydon(ol(OYIN_M.B1C)), 'Oltin olma'], ['★', 2, miniMaydon(ol(OYIN_M.B1Y)), 'Oltin — 10']],
  noldan: [['1', 9, miniMaydon(ol(OYIN_M.B2A)), 'Noldan'], ['2', 7, miniMaydon(ol(OYIN_M.B2B)), 'Sovg‘a'], ['3', 5, miniMaydon(ol(OYIN_M.B2C)), 'Uch va oltin'], ['★', 2, miniMaydon(ol(OYIN_M.B2Y)), 'O‘z o‘yiningiz']],
  aytish: [['1', 8, miniDastur(BASH.B3A.d), 'Uch blok'], ['2', 6, miniDastur(BASH.B3B.d), 'Takrorlash'], ['3', 4, miniDastur(BASH.B3C.d), 'Ikki set'], ['★', 2, miniDastur(BASH.B3Y.d), 'Ichida ikki blok']],
}

// huk (2–4-qadam): Coddy uch olma teradi (→→→→→↑↑): A — har olmada say "1"; B — birinchi olmadayoq say 1, 2, 3; C — change ball by 1 (kapsula faqat shu kartada)
const AVTO = '→→→→→↑↑'
const kq = (r) => `<span class="hk-d">${mb('q', 'apple')}${r.map((x) => mb(...x)).join('')}</span>`
const HUK = [
  ['A', 'Coddy «1» desin', { dastur: 'hukA', nat: '✕ doim 1', ok: '0' }, () => kq([['s', '1']])],
  ['B', 'Bir, ikki, uch desin', { dastur: 'hukB', nat: '✕ birdan 3', ok: '0' }, () => kq([['s', '1'], ['s', '2'], ['s', '3']])],
  ['C', 'Kompyuter sonni eslab qolsin', { dastur: 'hukC', nat: '✓ ball: 3', ok: '1', ball: true }, () => `${kq([['c', '1']])}<span class="hk-bk"><small>ball:</small><b>0</b></span>`],
]
const SONI = { A: 3, B: 4, C: 7 } // namuna (ustoz ekranida haqiqiy son)
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const hKartalar = ({ son, nat = false, avto = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}"${avto ? ` data-avto="${AVTO}" data-dastur="${d.dastur}" data-ok="${d.ok}"${d.ball ? ' data-ball="1"' : ''}` : ''} data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}<b>${son[l]}</b></span>` : ''}</div>`).join('')}</div>`

// 5-qadam: quti «ball» — son birma-bir o'zgaradi (studiya.js «raqam»: [data-r] yonadi; ko'rinadigan son — eng oxirgi yongani, uslub.css)
const QUTI = '<svg class="qt-r" viewBox="0 0 120 100" aria-hidden="true"><path d="M22 22h76l8 18H14z" fill="#7E4C1F"/><path d="M14 40h92v50a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z" fill="#C99464"/><path d="M14 40L3 24h40l13 16zM106 40l11-16H77L64 40z" fill="#D9AE7E" stroke="#A86B32" stroke-width="1.4" stroke-linejoin="round"/><path d="M14 40h92v8H14z" fill="#A86B32" opacity=".55"/></svg>'
const quti0 = () => `<span class="qt-k">${QUTI}<b>0</b></span>`
const quti = () => `<div class="qt" data-z="quti"><span class="qt-y">ball</span>${QUTI}<span class="qt-s"><b class="q0">0</b><b class="q1" data-r="2">1</b><b class="q3" data-r="3">3</b></span></div>`

// bekatlar: ball · noldan · oldindan aytamiz
const PLUS_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.6v14.8M4.6 12h14.8" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></svg>'
const NOL_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="12" rx="5.6" ry="7.6" fill="none" stroke="#fff" stroke-width="3"/></svg>'
const KARTA_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3.4" width="14" height="17.2" rx="2.6" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M10 9.4a2.2 2.2 0 1 1 3 2c-.8.4-1 1-1 1.8M12 16.4v.2" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>'
const BEKATLAR = [['h', 'Ball', PLUS_OQ], ['g', 'Noldan', NOL_OQ], ['y', 'Oldindan aytamiz', KARTA_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · olma terish o‘yini · ball sanaladi</small><div class="kd3-r lb2 kd-b">${miniMaydon(ol(OYIN_M.P6), { cls: 'kd-mk' })}<span class="kd-bk">ball: 7</span></div><b>O‘yiningiz ballni sanaydi</b></div>`
// keyingi dars: jon — uchta yurak
const YURAK = (x, f) => `<path transform="translate(${x} 18)" d="M0 6c-3-6-12-4-12 3 0 6 12 13 12 13s12-7 12-13c0-7-9-9-12-3z" fill="${f}" stroke="#C0392B" stroke-width="1.6"/>`
const JON_RASM = `<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#F4F8FD"/>${YURAK(24, '#F0435A')}${YURAK(50, '#F0435A')}${YURAK(76, '#F6C6C0')}<text x="50" y="57" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="10" fill="#7E4C1F">jon: 2</text></svg>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${JON_RASM}</div><b>12 · Jon va qadam</b></div>`
// o'tgan darsda (1-qadam): ikki labirint — daraja
const LAB_MINI = (s) => { const r = s.split('|'); let h = ''; r.forEach((q, y) => [...q].forEach((c, x) => { h += `<rect x="${x * 6 + 0.4}" y="${y * 6 + 0.4}" width="5.2" height="5.2" rx="1.4" fill="${c === '#' ? '#3E8E4E' : c === '*' ? '#F8E3A0' : c === 'S' ? '#D6E8FA' : '#F7EACB'}"/>` })); return `<svg class="lab-m" viewBox="-1 -1 ${r[0].length * 6 + 2} ${r.length * 6 + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${r[0].length * 6 + 2}" height="${r.length * 6 + 2}" rx="2" fill="#9AD57C" opacity=".55"/>${h}</svg>` }
const otganDars = () => `<div class="otd"><small>O‘tgan darsda</small><div class="tf-l"><div class="tf"><div class="tf-r"><span class="lab2">${LAB_MINI('##...#*|#K#.##.|#.#..E.|#.#.###|S...###')}${LAB_MINI('S..#..*|.#...#.|...#...')}</span></div><div class="tf-t"><b>Daraja</b><span>O‘yindagi bitta labirint</span></div></div></div></div>`

// natija (17, 18-qadam): ta olma terdi · eng katta ball · marta oldindan aytdi
const OLMA_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#fff"/><path d="M12 8c-.4-2-1.8-3.4-1.8-3.4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>'
const SINF_T = [['h', OLMA_OQ, 'ta olma terdi', 312], ['y', KARTA_OQ, 'marta oldindan aytdi', 41]]
const BOLA_T = [['h', OLMA_OQ, 'ta olma terdi', 26], ['g', PLUS_OQ, 'eng katta ball', 31], ['y', KARTA_OQ, 'marta oldindan aytdi', 3]]

// 5-dars «Takrorlash» — darsning o'z ekran bo'laklari (20.11). Manba: new-junior/manba/005-takrorlash.md.
// Maydon — 3–4-darsdagi (katak.js maydonHtml): 7 × 5, (x, y), Y tepaga; bezak — daraxt va gullar.
// Rasm topshiriqlarining kulrang kataklari qo'lda yozilmaydi: yechim dasturi shu yerdagi yoliYur() bilan yuriladi (bitta manba — rasm va yechim ajralmaydi).
const MB = { w: 7, h: 5, daraxt: [[1, 1], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] }
const md = (m = {}) => ({ ...MB, start: [0, 0], ...m })
const maydon = (m, aktyor, o = {}) => maydonHtml(md(m), { aktyor, ...o })
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))

// dastur yozuvi: ['r', ['p', 3, ['r', 'u']]] — 'p' — takrorlash (son, ichidagilar); yoliYur — o‘tilgan kataklar (start bilan)
const DY = { r: [1, 0], l: [-1, 0], u: [0, 1], d: [0, -1] }
const tekis = (d) => d.flatMap((t) => (Array.isArray(t) ? Array.from({ length: t[1] }, () => tekis(t[2])).flat() : [t]))
const yoliYur = (start, d) => { let [x, y] = start; const r = [[x, y]]; for (const t of tekis(d)) { x += DY[t][0]; y += DY[t][1]; r.push([x, y]) } return r }
const kataklar = (start, d) => { const s = new Set(), r = []; for (const p of yoliYur(start, d)) { if (!s.has(String(p))) { s.add(String(p)); r.push(p) } } return r }
// dastur ustuni (tayyor dastur, takrorlash bilan): HTML — blockly.js uni ichma-ich o'qiydi
const dHtml = (d) => d.map((t) => (Array.isArray(t) ? takror(String(t[1]), t[2]) : mb(t))).join('')
const dstT = (d, yuz, chegara) => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span>${d.length ? `<div class="mbw">${dHtml(d)}</div>` : '<span class="bosh">Blokni shu yerga ulang</span>'}<small class="dsn">${chegara ? `0 / ${chegara} ta blok` : `${tekis(d).length} ta blok`}</small></div>`
const sanaBl = (d) => d.reduce((a, t) => a + (Array.isArray(t) ? 1 + sanaBl(t[2]) : 1), 0)
// strelka yozuvi (uzun dastur — sarlavha ostida): 'drdr' → «↓ → ↓ →»
const STR = { r: '→', l: '←', u: '↑', d: '↓' }
const strelka = (s) => [...s].map((t) => STR[t]).join(' ')

// rasmlar (yechim → kulrang kataklar) va boshlanish joylari — manba «Topshiriqlar» jadvali
const KV = (n) => [['p', n, ['r']], ['p', n, ['u']], ['p', n, ['l']], ['p', n, ['d']]]
const RASM = {
  P7: { start: [2, 1], d: KV(3) },
  B2A: { start: [0, 0], d: KV(3) },
  B2B: { start: [2, 4], d: [['p', 3, ['r']], ['p', 3, ['d']], ['p', 3, ['l']], ['p', 3, ['u']]] },
  B2C: { start: [0, 0], d: [['p', 3, ['r']], ['p', 4, ['u']], ['p', 3, ['l']], ['p', 4, ['d']]] },
  B2Y: { start: [3, 0], d: [['p', 4, ['u']], ['p', 2, ['r']], ['p', 4, ['d']], ['p', 2, ['l']], ['p', 2, ['u']], ['p', 2, ['r']]] },
  P8: { start: [2, 0], d: [...'rururu'] },
  B3A: { start: [1, 4], d: [...'drdrdrdr'] },
  B3B: { start: [2, 0], d: [...'urdrurdr'] },
  B3C: { start: [1, 0], d: [...'rururdrd'] },
}
const rasmM = (id) => ({ start: RASM[id].start, rasm: kataklar(RASM[id].start, RASM[id].d) })

// huk (2–4-qadam): olmalar (1, 0)…(5, 0), yulduz (6, 0), dasturga 3 ta blok sig'adi. A — oltita move right dan uchtasi sig'adi; B — go to (6, 0); C — repeat 6
const HUK_M = { olma: [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0]], yulduz: [6, 0] }
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
// kichik blok (ko'k katakcha, ichida belgi — 2–4-darsdagi kichik dastur)
const kb = (t, cls = '') => `<span class="mb f-h ${cls}" data-tur="${t}">${IKON[t]}</span>`
const HUK = [
  ['A', 'Ko‘p blok qo‘yamiz', { dastur: 'rrr', nat: '✕ sig‘madi' }, () => `<div class="dk">${kb('r') + kb('r') + kb('r') + kb('r', 'hk-xira') + kb('r', 'hk-xira') + kb('r', 'hk-xira')}</div>`],
  ['B', 'go to bilan sakraymiz', { dastur: 'x6,0', nat: '✕ olmalar qoldi' }, () => `<div class="dk gor">${kb('x')}<b class="hk-x">6, 0</b></div>`],
  ['C', 'Bitta blok — 6 marta', { dastur: 'rrrrrr', nat: '✓ 2 ta blok' }, () => `<div class="dk gor">${kb('r')}<b class="hk-x">× 6</b></div>`],
]
const SONI = { A: 4, B: 6, C: 4 } // namuna (ustoz ekranida haqiqiy son)
const tKartalar = ({ son, nat = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}" data-dastur="${d.dastur}" data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}${son[l]}</span>` : ''}</div>`).join('')}</div>`

// kichik maydon rasmi (zinapoya va reja kartalari): kulrang rasm, olma, yulduz, qahramon
const miniMaydon = (belgi = [], { rasm = [], cls = 'mini' } = {}) => {
  const W = MB.w * 10, H = MB.h * 10, Y = (y) => (MB.h - 1 - y) * 10
  let h = ''
  for (let q = 0; q < MB.h; q++) for (let x = 0; x < MB.w; x++) { const y = MB.h - 1 - q, r = rasm.some(([a, c]) => a === x && c === y); h += `<rect x="${x * 10 + 0.6}" y="${q * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${r ? '#C9CDD3' : (x + y) % 2 ? '#F7EACB' : '#F3E3BE'}"/>` }
  MB.daraxt.forEach(([x, y]) => { h += `<circle cx="${x * 10 + 3.6}" cy="${Y(y) + 3.6}" r="2.8" fill="#3E8E4E"/>` })
  belgi.forEach(([x, y, t]) => {
    const X0 = x * 10, Y0 = Y(y)
    if (t === 'y') h += `<path transform="translate(${X0 + 5} ${Y0 + 5.2}) scale(3.4)" d="${KT_YULDUZ}" fill="#F5B82E" stroke="#C98A0E" stroke-width=".08"/>`
    if (t === 'o') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5.4}" r="2.7" fill="#F0435A"/><path d="M${X0 + 5} ${Y0 + 2.8}l.7-1.2" stroke="#4CB050" stroke-width=".9"/>`
    if (t === 'q') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5}" r="2.4" fill="#2F8FF0"/>`
  })
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#9AD57C" opacity=".55"/>${h}</svg>`
}
const miniR = (id) => miniMaydon([[...RASM[id].start, 'q']], { rasm: kataklar(RASM[id].start, RASM[id].d) })
// 1-bekat topshiriqlari (manba jadvali)
const UZUN = {
  B1A: { start: [0, 0], olma: [[1, 0], [2, 0], [3, 0], [4, 0]], yulduz: [5, 0] },
  B1B: { start: [3, 4], olma: [[3, 3], [3, 2], [3, 1]], yulduz: [3, 0] },
  B1C: { start: [0, 0], olma: [[5, 0]], yulduz: [5, 3] },
  B1Y: { start: [0, 0], olma: [[5, 0], [5, 2]], yulduz: [2, 2] },
  P6: { start: [0, 0], olma: [[0, 1], [0, 2]], yulduz: [0, 3] },
}
const miniU = (id) => miniMaydon([[...UZUN[id].start, 'q'], ...UZUN[id].olma.map(([x, y]) => [x, y, 'o']), [...UZUN[id].yulduz, 'y']])
// uch zinapoya (8, 11, 15-qadam): doskada javob yo'q — 1-bekatda topshiriq rasmi (olma, yulduz ko'rinadi), 2–3-bekatda kulrang rasm (bola ham ko'radi)
const POG = {
  uzun: [['1', 10, miniU('B1A'), 'O‘ngga'], ['2', 8, miniU('B1B'), 'Pastga'], ['3', 5, miniU('B1C'), 'Burchak'], ['★', 2, miniU('B1Y'), 'Ilon yo‘li']],
  kvadrat: [['1', 9, miniR('B2A'), 'Kvadrat'], ['2', 7, miniR('B2B'), 'Boshqa burchak'], ['3', 5, miniR('B2C'), 'Minora'], ['★', 2, miniR('B2Y'), 'Deraza']],
  zina: [['1', 9, miniR('B3A'), 'Zinapoya'], ['2', 7, miniR('B3B'), 'Toj'], ['3', 5, miniR('B3C'), 'Tog‘'], ['★', 2, miniMaydon([[0, 0, 'q']]), 'O‘z rasmingiz']],
}
// bekatlar (reja tepaligi): uzun yo'l · kvadrat · zinapoya
const YOL_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="2.5 3.2"/><path d="M15 15l5 4-5 4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 -4)"/></svg>'
const KVADRAT_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="1.5" fill="none" stroke="#fff" stroke-width="2.8"/></svg>'
const ZINA_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20h5v-5h5v-5h5V5h3" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/></svg>'
const BEKATLAR = [['h', 'Uzun yo‘l', YOL_OQ], ['g', 'Kvadrat', KVADRAT_OQ], ['y', 'Zinapoya', ZINA_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · o‘z rasmingiz</small><div class="kd3-r lb2">${miniMaydon([[0, 0, 'q']], { rasm: kataklar([0, 0], [['p', 3, ['r', 'r', 'u']]]), cls: 'kd-mk' })}</div><b>Dasturini o‘qib berasiz</b></div>`
// keyingi dars: amaliyot — uchta topshiriq kartasi
const AMAL_RASM = `<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#F4F8FD"/>${[12, 40, 68].map((x, i) => `<rect x="${x}" y="14" width="22" height="36" rx="4" fill="#fff" stroke="#9DB7DA" stroke-width="1.6"/><text x="${x + 11}" y="38" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="13" fill="#0D2137">${i + 1}</text>`).join('')}</svg>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${AMAL_RASM}</div><b>6 · Amaliyot</b></div>`
// natija (17, 18-qadam): rasm chizdi · ta repeat qo'ydi · ta blok tejadi
const SINF_T = [['h', KVADRAT_OQ, 'rasm chizdi', 64], ['g', IKON.p, 'ta repeat qo‘ydi', 210], ['y', ZINA_OQ, 'ta blok tejadi', 118]]
const BOLA_T = [['h', KVADRAT_OQ, 'rasm chizdi', 8], ['g', IKON.p, 'ta repeat qo‘ydi', 24], ['y', ZINA_OQ, 'ta blok tejadi', 10]]

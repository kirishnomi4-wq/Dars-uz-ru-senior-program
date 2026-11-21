// 6-dars «Amaliyot: harakat va takrorlash» — darsning o'z ekran bo'laklari (20.11). Manba: new-junior/manba/006-amaliyot.md.
// Maydon — 3–5-darsdagi (katak.js maydonHtml): 7 × 5, (x, y), Y tepaga; bezak — daraxt va gullar.
// Rasm topshiriqlarining kulrang kataklari qo'lda yozilmaydi: yechim dasturi shu yerdagi yoliYur() bilan yuriladi (bitta manba — rasm va yechim ajralmaydi).
const MB = { w: 7, h: 5, daraxt: [[1, 1], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] }
const md = (m = {}) => ({ ...MB, start: [0, 0], ...m })
const maydon = (m, aktyor, o = {}) => maydonHtml(md(m), { aktyor, ...o })
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))

// dastur yozuvi: ['r', ['p', 3, ['r', 'u']]] — 'p' — takrorlash (son, ichidagilar); yoliYur — o‘tilgan kataklar (start bilan)
const DY = { r: [1, 0], l: [-1, 0], u: [0, 1], d: [0, -1] }
const tekis = (d) => d.flatMap((t) => (Array.isArray(t) && t[0] === 'p' ? Array.from({ length: t[1] }, () => tekis(t[2])).flat() : [t]))
// go to (['x', X, Y]) — sakraydi: faqat qo'ngan katak yo'lga kiradi (dvigatel shunday — sahna.js h.yol)
const yoliYur = (start, d) => { let [x, y] = start; const r = [[x, y]]; for (const t of tekis(d)) { if (Array.isArray(t)) { x = t[1]; y = t[2] } else { x += DY[t][0]; y += DY[t][1] } r.push([x, y]) } return r }
const kataklar = (start, d) => { const s = new Set(), r = []; for (const p of yoliYur(start, d)) { if (!s.has(String(p))) { s.add(String(p)); r.push(p) } } return r }
// dastur ustuni (tayyor dastur, takrorlash bilan): HTML — blockly.js uni ichma-ich o'qiydi
const dHtml = (d) => d.map((t) => (Array.isArray(t) ? (t[0] === 'x' ? mb('x', t[1] + ',' + t[2]) : takror(String(t[1]), t[2])) : mb(t))).join('')
const dstT = (d, yuz, chegara) => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span>${d.length ? `<div class="mbw">${dHtml(d)}</div>` : '<span class="bosh">Blokni shu yerga ulang</span>'}<small class="dsn">${chegara ? `${sanaBl(d)} / ${chegara} ta blok` : `${tekis(d).length} ta blok`}</small></div>`
const sanaBl = (d) => d.reduce((a, t) => a + (Array.isArray(t) && t[0] === 'p' ? 1 + sanaBl(t[2]) : 1), 0)
// strelka yozuvi (uzun dastur — sarlavha ostida): 'drdr' → «↓ → ↓ →»
const STR = { r: '→', l: '←', u: '↑', d: '↓' }
const strelka = (s) => [...s].map((t) => STR[t]).join(' ')

// rasmlar (yechim → kulrang kataklar) — manba «Topshiriqlar» jadvali; kulrang kataklar yechimdan yuriladi
const RASM = {
  P7: { start: [2, 0], d: [...'uurr'] },
  B2A: { start: [0, 2], d: [['p', 6, ['r']]] },
  B2B: { start: [0, 0], d: [['p', 3, ['r']], ['p', 2, ['u']], ['p', 3, ['l']], ['p', 2, ['d']]] },
  B2C: { start: [2, 0], d: [...'urrurr'] },
  B2Y: { start: [2, 0], d: [...'uurddruurddr'] },
  B3B: { start: [0, 0], d: [['p', 3, ['r']], ['x', 0, 2], ['p', 3, ['r']]] },
}
const rasmM = (id) => ({ start: RASM[id].start, rasm: kataklar(RASM[id].start, RASM[id].d) })
// yulduz topshiriqlari (start, olmalar, yulduz)
const YOL = {
  B1A: { start: [0, 0], olma: [[0, 2]], yulduz: [2, 2] },
  B1B: { start: [0, 0], olma: [], yulduz: [6, 4] },
  B1C: { start: [0, 0], olma: [[2, 4], [3, 4]], yulduz: [4, 4] },
  B1Y: { start: [0, 0], olma: [[3, 0], [6, 2]], yulduz: [2, 4] },
  P8: { start: [0, 0], olma: [[3, 0]], yulduz: [3, 2] },
  B3A: { start: [0, 0], olma: [[3, 1], [3, 2], [3, 3]], yulduz: [3, 4] },
  B3C: { start: [0, 0], olma: [[5, 2], [5, 1]], yulduz: [5, 0] },
}
// tayyor dasturlar: 14-qadam (olma qoladi) va 15 · 3 (chetga urilish)
const TAYYOR = { P8: [['p', 2, ['u']], ['p', 3, ['r']]], B3C: [['p', 3, ['d']], ['x', 5, 3]] }

// huk (2–4-qadam): olmalar (1, 2)…(4, 2), yulduz (5, 2), dasturga 3 ta blok sig'adi. A — ikkita repeat (4 blok, sig'gan qismi R2[↑]);
// (audit 20.11: A kartasi ovozgacha javobni ochmaydi — to'rt blok oddiy; natija sinovda «✕ sig‘madi: 4 ta blok»); B — go to (5, 2): olmalar qoldi; C — go to (0, 2) va repeat 5 [→]
const HUK_M = { olma: [[1, 2], [2, 2], [3, 2], [4, 2]], yulduz: [5, 2] }
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const kb = (t, cls = '') => `<span class="mb f-h ${cls}" data-tur="${t}">${IKON[t]}</span>`
const kp = (cls = '') => `<span class="mb f-b ${cls}" data-tur="p">${IKON.p}</span>`
const HUK = [
  ['A', 'Ikkita repeat', { dastur: 'uu', nat: '✕ sig‘madi: 4 ta blok' }, () => `<div class="dk hk6"><span class="hk-q">${kp()}<b class="hk-x">2</b>${kb('u')}</span><span class="hk-q">${kp()}<b class="hk-x">5</b>${kb('r')}</span></div>`],
  ['B', 'go to bilan sakraymiz', { dastur: 'x5,2', nat: '✕ olmalar qoldi' }, () => `<div class="dk gor">${kb('x')}<b class="hk-x">5, 2</b></div>`],
  ['C', 'Sakrab, keyin takrorlaymiz', { dastur: 'x0,2rrrrr', nat: '✓ 3 ta blok' }, () => `<div class="dk hk6"><span class="hk-q">${kb('x')}<b class="hk-x">0, 2</b></span><span class="hk-q">${kp()}<b class="hk-x">5</b>${kb('r')}</span></div>`],
]
const SONI = { A: 6, B: 3, C: 5 } // namuna (ustoz ekranida haqiqiy son)
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
const miniY = (id) => miniMaydon([[...YOL[id].start, 'q'], ...YOL[id].olma.map(([x, y]) => [x, y, 'o']), [...YOL[id].yulduz, 'y']])
// uch zinapoya (8, 11, 15-qadam): doskada javob yo'q — bola ham ko'radigan narsa (start, olma, yulduz, kulrang rasm); 15 · 3 tayyor dasturi va ★ chizilmaydi
const POG = {
  yol: [['1', 10, miniY('B1A'), 'Burchak'], ['2', 8, miniY('B1B'), 'Eng uzoq katak'], ['3', 5, miniY('B1C'), 'Tepa qator'], ['★', 2, miniY('B1Y'), 'Uchta blok']],
  rasm: [['1', 9, miniR('B2A'), 'Chiziq'], ['2', 7, miniR('B2B'), 'Eshik'], ['3', 5, miniR('B2C'), 'Keng zinapoya'], ['★', 2, miniR('B2Y'), 'To‘lqin']],
  birga: [['1', 9, miniY('B3A'), 'Ustun'], ['2', 7, miniR('B3B'), 'Teng belgisi'], ['3', 5, miniY('B3C'), 'Xatoni toping'], ['★', 2, miniMaydon([[0, 0, 'q']]), 'O‘z rasmingiz']],
}
// bekatlar (reja tepaligi): yo'l · rasm · hammasi birga
const YOL_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="2.5 3.2"/><path d="M15 15l5 4-5 4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 -4)"/></svg>'
const KVADRAT_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="1.5" fill="none" stroke="#fff" stroke-width="2.8"/></svg>'
const ZINA_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20h5v-5h5v-5h5V5h3" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/></svg>'
const BIRGA_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="8" r="3.2" fill="#fff"/><rect x="13" y="4.8" width="6.4" height="6.4" rx="1.4" fill="#fff"/><path d="M5 19h14" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>'
const BEKATLAR = [['h', 'Yo‘l', YOL_OQ], ['g', 'Rasm', KVADRAT_OQ], ['y', 'Hammasi birga', BIRGA_OQ]]
// dars oxirida — o'z rasmi (namuna: zinapoya va minora — 15 · ★)
const NAMUNA_D = [['p', 2, ['r', 'r', 'u']], ['x', 5, 0], ['p', 3, ['u']]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · o‘z rasmingiz</small><div class="kd3-r lb2">${miniMaydon([[0, 0, 'q']], { rasm: kataklar([0, 0], NAMUNA_D), cls: 'kd-mk' })}</div><b>Dasturini o‘qib berasiz</b></div>`
// keyingi dars: kostyum va tovush — nota va ikki kostyum
const KOST_RASM = `<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#F4F8FD"/><circle cx="28" cy="34" r="14" fill="#2F8FF0"/><circle cx="56" cy="34" r="14" fill="#F08A24"/><path d="M80 18v22a5 5 0 1 1-3-4.6V22l10-3v14a5 5 0 1 1-3-4.6V18z" fill="#0D2137"/></svg>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${KOST_RASM}</div><b>7 · Kostyum va tovush</b></div>`
// natija (17, 18-qadam): pog'ona bajardi · ta go to qo'ydi · ta repeat qo'ydi
// ranglar: pog'ona — yutuq (y), go to — Harakat ko'k (h), repeat — 5-darsdagi Takrorlash kartasi rangi (g)
const SINF_T = [['y', YOL_OQ, 'pog‘ona bajardi', 96], ['h', IKON.x, 'ta go to qo‘ydi', 74], ['g', IKON.p, 'ta repeat qo‘ydi', 118]]
const BOLA_T = [['y', YOL_OQ, 'pog‘ona bajardi', 9], ['h', IKON.x, 'ta go to qo‘ydi', 6], ['g', IKON.p, 'ta repeat qo‘ydi', 10]]

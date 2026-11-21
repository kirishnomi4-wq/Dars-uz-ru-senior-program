// 7-dars «Kostyum, animatsiya va tovush» — darsning o'z ekran bo'laklari (20.11). Manba: new-junior/manba/007-kostyum-tovush.md.
// Maydon — 3–5-darsdagi (katak.js maydonHtml): 7 × 5, (x, y), Y tepaga; bezak — daraxt va gullar.
// Rasm topshiriqlarining kulrang kataklari qo'lda yozilmaydi: yechim dasturi shu yerdagi yoliYur() bilan yuriladi (bitta manba — rasm va yechim ajralmaydi).
const MB = { w: 7, h: 5, daraxt: [[1, 1], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] }
const md = (m = {}) => ({ ...MB, start: [0, 0], ...m })
const maydon = (m, aktyor, o = {}) => maydonHtml(md(m), { aktyor, ...o })
// kostyumlar (KOD 2): bolaning qahramoni — kayfiyatlari, Coddy — poza va yuz (manba «Maydon va bloklar» jadvali); yangi rasm chizilmaydi
const KOS = ['xotirjam', 'xursand', 'hayron', 'oylanadi']
const CODDY_KOS = { xotirjam: ['turadi', 'oddiy'], xursand: ['quvonadi', 'xursand'], hayron: ['turadi', 'hayron'], oylanadi: ['oylaydi', 'oylaydi'] }
const coddyKos = () => Object.fromEntries(KOS.map((k) => [k, robot({ pose: CODDY_KOS[k][0], yuz: CODDY_KOS[k][1] })]))
const qahKos = () => (globalThis.QAH === 'coddy' ? coddyKos() : Object.fromEntries(KOS.map((k) => [k, hero({ k: globalThis.QAH || 'momiq', mood: k })])))
// maydon: Coddy (ustoz) / qahramon (bola) — kostyumlari bilan
const maydonC = (m, o = {}) => maydon(m, '', { kostyum: coddyKos(), ...o })
const maydonQ = (m, o = {}) => maydon(m, '', { kostyum: qahKos(), ...o })
const KN = (k) => (k === 'oylanadi' ? 'o‘ylanadi' : k)
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

// topshiriqlar (manba «Topshiriqlar» jadvali): start, yulduz, belgilar (katakdagi kostyum nomi)
const T7 = {
  P6: { yulduz: [2, 0] },
  B1A: { yulduz: [3, 0], belgi: [[3, 0, 'xursand']] }, B1B: { yulduz: [0, 3], belgi: [[0, 3, 'hayron']] },
  B1C: { yulduz: [2, 2], belgi: [[2, 0, 'hayron'], [2, 2, 'xursand']] }, B1Y: { yulduz: [5, 2], belgi: [[0, 2, 'hayron'], [2, 2, 'oylanadi'], [5, 2, 'xursand']] },
  P7: { yulduz: [3, 0] }, B2A: { yulduz: [2, 0] }, B2B: { yulduz: [4, 0] }, B2C: { yulduz: [3, 3] }, B2Y: { yulduz: [6, 4] },
  P8: { yulduz: [5, 0] }, B3A: { yulduz: [4, 0] }, B3B: { yulduz: [3, 2] }, B3Y: { yulduz: [6, 4] }, P11: { yulduz: [6, 4] },
}
const TAYYOR = { B1A: ['r', 'r', 'r'] }
// animatsiya hisobi — sahna tepasida (sahna.js animYozuv)
const anYz = (n) => `<span class="gl an-yz">Animatsiya: <b>0 / ${n}</b></span>`

// huk (2–4-qadam): Coddy (3, 2), ikki kostyum. A — bir marta xursand, qotdi; B — joyida silkinadi; C — xotirjam ⇄ xursand olti marta
const HUK_M = { start: [3, 2], yulduz: null }
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const kb = (t, cls = '') => `<span class="mb f-h ${cls}" data-tur="${t}">${IKON[t]}</span>`
const kRasm = (k) => `<span class="kos-m">${robot({ pose: CODDY_KOS[k][0], yuz: CODDY_KOS[k][1] })}</span>`
const HUK = [
  ['A', 'Bitta kostyum qo‘yamiz', { dastur: 'cxu', ok: '0', nat: '✕ bir marta ko‘tardi' }, () => `<div class="dk gor">${kRasm('xursand')}</div>`],
  ['B', 'Coddy’ni silkitamiz', { dastur: 'www', ok: '0', nat: '✕ qo‘li qimirlamadi' }, () => `<div class="dk gor">${kRasm('xotirjam')}<b class="hk-x">↔</b></div>`],
  ['C', 'Kostyumlarni almashtiramiz', { dastur: 'cxucxocxucxocxucxo', ok: '1', nat: '✓ qo‘l silkitdi' }, () => `<div class="dk gor"><b class="hk-x">1 ⇄ 2</b></div>`],
]
const SONI = { A: 4, B: 3, C: 7 } // namuna (ustoz ekranida haqiqiy son)
const tKartalar = ({ son, nat = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}" data-dastur="${d.dastur}" data-ok="${d.ok}" data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}${son[l]}</span>` : ''}</div>`).join('')}</div>`
// ikki kostyum kartochkasi (2–4-qadam, Coddy yonida)
const ikkiKos = () => `<div class="gl kos2"><span>${kRasm('xotirjam')}<small>1-kostyum</small></span><span>${kRasm('xursand')}<small>2-kostyum</small></span></div>`

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
const miniT = (id) => miniMaydon([[...(T7[id].start || [0, 0]), 'q'], [...T7[id].yulduz, 'y']])
// uch zinapoya (8, 11, 15-qadam): bola ham ko'radigan narsa (start, yulduz)
const POG = {
  kos: [['1', 10, miniT('B1A'), 'Xursand'], ['2', 8, miniT('B1B'), 'Hayron'], ['3', 5, miniT('B1C'), 'Ikki kostyum'], ['★', 2, miniT('B1Y'), 'Uch belgi']],
  anim: [['1', 9, miniT('B2A'), 'Uch marta'], ['2', 7, miniT('B2B'), 'Har qadamda'], ['3', 5, miniT('B2C'), 'Tepaga, keyin o‘ngga'], ['★', 2, miniT('B2Y'), 'Uzoq yo‘l']],
  tovush: [['1', 9, miniT('B3A'), 'Qadam tovushi'], ['2', 6, miniT('B3B'), 'Yulduzda quvoning'], ['★', 2, miniT('B3Y'), 'O‘z qahramoningiz']],
}
// bekatlar (reja tepaligi): kostyum · animatsiya · tovush
const ANIM_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="8" height="12" rx="2" fill="none" stroke="#fff" stroke-width="2.4"/><rect x="13" y="6" width="8" height="12" rx="2" fill="#fff"/></svg>'
const BEKATLAR = [['h', 'Kostyum', IKON.v], ['g', 'Animatsiya', ANIM_OQ], ['y', 'Tovush', IKON.n]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · o‘yin</small><div class="kd3-r lb2"><span class="kd-q">${hero({ k: 'momiq', mood: 'xursand', lite: true })}<b class="kd-nota">♪</b></span></div><b>Ovozli qahramon</b></div>`
// keyingi dars: shart — yo'l bormi
const SHART_RASM = `<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#F4F8FD"/><rect x="58" y="12" width="10" height="40" rx="3" fill="#3E8E4E"/><circle cx="34" cy="32" r="10" fill="#2F8FF0"/><text x="80" y="38" font-size="18" font-weight="800" fill="#5B80A5" text-anchor="middle">?</text></svg>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${SHART_RASM}</div><b>8 · Shart</b></div>`
// natija (17, 18-qadam): marta kostyum almashtirdi · ta animatsiya tuzdi · marta tovush chaldi
const SINF_T = [['h', IKON.v, 'marta kostyum almashtirdi', 182], ['g', ANIM_OQ, 'ta animatsiya tuzdi', 41], ['y', IKON.n, 'marta tovush chaldi', 156]]
const BOLA_T = [['h', IKON.v, 'marta kostyum almashtirdi', 14], ['g', ANIM_OQ, 'ta animatsiya tuzdi', 3], ['y', IKON.n, 'marta tovush chaldi', 12]]

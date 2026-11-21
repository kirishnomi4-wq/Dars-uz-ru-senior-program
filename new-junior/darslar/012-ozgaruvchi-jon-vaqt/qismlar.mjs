// 12-dars «Jon va qadam» — darsning o'z ekran bo'laklari (21.11). Manba: new-junior/manba/012-ozgaruvchi-jon-vaqt.md («Maydon, o'yin va bloklar», «Topshiriqlar»).
// Maydon — 11-darsdagi bog' (katak.js maydonHtml): 7 × 5, (x, y), Y tepaga; kaktus — m.kaktus (devordek, tegsa — hodisa). Sinov: sinov/dvigatel/jon.mjs
const MB = { w: 7, h: 5, daraxt: [[1, 1], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] }
const md = (m = {}) => ({ ...MB, start: [0, 0], ...m })
const maydon = (m, aktyor, o = {}) => maydonHtml(md(m), { aktyor, ...o })
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))
// sahnadagi sonlar: chap yuqorida ostma-ost kapsulalar (studiya.js ozgKorinsin — faqat dasturda ishlatilgani); v — { ball: 0, jon: 3 } (ko'rinadiganlari), doim — doim ko'rinadi
const OZG = ['ball', 'jon', 'qadam']
const ozgQ = (v = {}, doim = '') => `<div class="gl ball-q" data-z="o‘zgaruvchilar"${doim ? ` data-doim="${doim}"` : ''}>${OZG.map((n) => `<span class="ball-k${n in v ? '' : ' yoq'}" data-v="${n}"><small>${n}:</small><b>${v[n] < 0 ? '−' + -v[n] : v[n] || 0}</b></span>`).join('')}</div>`
const tugadiT = () => '<span class="gl oyin-tugadi">O‘yin tugadi</span>'

// o'yin maydonlari (manba «Topshiriqlar»): start · olmalar · oltin olma · kaktuslar · yulduz (olmali o'yinda yashirin)
const OYIN_M = {
  HUK: { kaktus: [[2, 0]] },
  P6: { kaktus: [[0, 1], [3, 0]] },
  B1A: { kaktus: [[2, 0], [0, 2]] },
  B1B: { start: [3, 0], kaktus: [[2, 0], [4, 0], [3, 1]] },
  B1C: { kaktus: [[1, 0], [2, 1], [3, 0], [3, 2], [5, 1], [4, 4]], yulduz: [6, 0] },
  B1Y: { kaktus: [[1, 0], [0, 2], [2, 2], [2, 0], [4, 1], [4, 2], [3, 4], [5, 0], [6, 2]], yulduz: [6, 0] },
  P7: { olma: [[2, 0], [3, 2], [5, 2]], kaktus: [[1, 0], [3, 1], [4, 2], [6, 0]], yulduz: [6, 4], yashirin: true },
  B2A: { olma: [[0, 3], [3, 1], [5, 2]], kaktus: [[1, 0], [2, 1], [4, 1], [3, 3]], yulduz: [6, 0], yashirin: true },
  B2B: { start: [6, 0], olma: [[4, 0], [2, 2], [0, 1]], oltin: [[5, 2]], kaktus: [[3, 0], [3, 2], [0, 2]], yulduz: [3, 4], yashirin: true },
  B2C: { olma: [[2, 0], [0, 3], [3, 3]], kaktus: [[1, 0], [3, 1], [2, 2], [3, 4], [4, 2]], yulduz: [5, 2], yashirin: true },
  B2Y: { olma: [[2, 0], [2, 2], [4, 0], [4, 2], [3, 4]], kaktus: [[1, 0], [3, 0], [3, 1], [3, 2], [5, 0]], yulduz: [6, 0], yashirin: true },
  P8: { yulduz: [4, 0] },
  B3A: { yulduz: [6, 2] },
  B3B: { olma: [[2, 0], [3, 2], [5, 2]], kaktus: [[3, 0], [2, 2], [4, 1]], yulduz: [5, 0], yashirin: true },
  B3C: { start: [6, 0], olma: [[4, 0], [3, 2], [5, 2]], kaktus: [[5, 0], [3, 0], [4, 2], [2, 2], [3, 3]], yulduz: [0, 0], yashirin: true },
  B3Y: { olma: [[2, 0], [0, 3], [5, 2], [3, 4]], kaktus: [[3, 0], [3, 2], [4, 1], [2, 4], [1, 3]], yulduz: [6, 4], yashirin: true },
}

// boshqaruv qatori (11-darsdagi)
const TORT = [['right', 'r', '→'], ['left', 'l', '←'], ['up', 'u', '↑'], ['down', 'd', '↓']]
const bqQ = () => `<div class="bq-q" role="button" data-z="boshqaruv"><b>Boshqaruv:</b><span class="bq-s">${TORT.map(([k, , s]) => `<i data-k="${k}">${s}</i>`).join('')}</span><span class="bq-o">▾</span><div class="bq-och">${TORT.map(([k, t]) => `<div class="bq-d">${mb('k', k)}${mb(t)}</div>`).join('')}<small>Boshqaruv tayyor — bloklar sanog‘iga kirmaydi</small></div></div>`
// shart bloki ichidagilari bilan (C-blok): m — «jon:0»; cls — solo-faqat (jonli darsda ustoz o'zi qo'shadi)
const shartV = (m, ichki, cls = '') => `<div class="c-blok sv ${cls}">${mb('i', m)}<div class="c-ich">${ichki.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div><span class="c-tub"></span></div>`
// dastur ustuni: boshqaruv qatori + dasturchalar; r — [t, m, cls] yoki tayyor HTML (shartV); hodisa bloki yangi dasturcha
const dst12 = (r, yuz) => {
  const html = r.map((x) => (typeof x === 'string' ? x : mb(...x))).join(''), jon = (s) => (s.match(/class="mb /g) || []).length
  const n = r.filter((x) => typeof x !== 'string' && ['q', 'f', 'k'].includes(x[0]) && !(x[2] || '').includes('solo-faqat')).length
  const bl = r.filter((x) => !(typeof x === 'string' ? x : x[2] || '').includes('solo-faqat')).reduce((a, x) => a + (typeof x === 'string' ? jon(x) : 1), 0)
  return `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span>${bqQ()}${r.length ? `<div class="mbw">${html}</div>` : '<span class="bosh">Blokni shu yerga ulang</span>'}<small class="dsn">${n} ta dasturcha\n${bl} / 16 ta blok</small></div>`
}
const SF = 'solo-faqat'
const JQ = (cls = '') => [['q', 'cactus', cls], ['c', 'jon:-1', cls], shartV('jon:0', ['g'], cls)]
const TAYYOR3 = [['f'], ['z', 'ball:0'], ['z', 'jon:3'], ['q', 'apple'], ['c', 'ball:1'], ...JQ()] // 3-bekatning tayyor o'yini (9 blok)

// kichik maydon rasmi (zinapoya va reja kartalari): start, olmalar, oltin, kaktuslar (yashil); yulduz faqat bo'sh maydonda
const miniMaydon = (m, { cls = 'mini', yul = false } = {}) => {
  const W = MB.w * 10, H = MB.h * 10, Y = (y) => (MB.h - 1 - y) * 10, s = m.start || [0, 0]
  let h = ''
  for (let q = 0; q < MB.h; q++) for (let x = 0; x < MB.w; x++) h += `<rect x="${x * 10 + 0.6}" y="${q * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${(x + MB.h - 1 - q) % 2 ? '#F7EACB' : '#F3E3BE'}"/>`
  MB.daraxt.forEach(([x, y]) => { h += `<circle cx="${x * 10 + 3.6}" cy="${Y(y) + 3.6}" r="2.8" fill="#3E8E4E"/>` })
  ;(m.kaktus || []).forEach(([x, y]) => { h += `<rect x="${x * 10 + 3.6}" y="${Y(y) + 1.6}" width="2.8" height="6.8" rx="1.4" fill="#3FA65A"/><path d="M${x * 10 + 3.6} ${Y(y) + 4.6}h-1.4v-2M${x * 10 + 6.4} ${Y(y) + 3.6}h1.4v-1.6" stroke="#3FA65A" stroke-width="1.2" fill="none" stroke-linecap="round"/>` })
  ;[...(m.olma || []).map((p) => [...p, '#F0435A']), ...(m.oltin || []).map((p) => [...p, '#F5B82E'])].forEach(([x, y, c]) => { h += `<circle cx="${x * 10 + 5}" cy="${Y(y) + 5.4}" r="2.7" fill="${c}"/>` })
  if (yul && m.yulduz) h += `<path transform="translate(${m.yulduz[0] * 10 + 5} ${Y(m.yulduz[1]) + 5.2}) scale(3.4)" d="${KT_YULDUZ}" fill="#F5B82E" stroke="#C98A0E" stroke-width=".08"/>`
  h += `<circle cx="${s[0] * 10 + 5}" cy="${Y(s[1]) + 5}" r="2.4" fill="#2F8FF0"/>`
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#9AD57C" opacity=".55"/>${h}</svg>`
}
const mm = (id, o) => miniMaydon(OYIN_M[id], o)
// uch zinapoya (8, 11, 15-qadam)
const POG = {
  jon: [['1', 10, mm('B1A'), 'Uch jon'], ['2', 8, mm('B1B'), 'Achchiq kaktus'], ['3', 5, mm('B1C'), 'Ehtiyot bo‘ling'], ['★', 2, mm('B1Y'), 'Bitta jon']],
  ikki: [['1', 9, mm('B2A'), 'Ikki o‘zgaruvchi'], ['2', 7, mm('B2B'), 'Jon sovg‘asi'], ['3', 5, mm('B2C'), 'Qimmat kaktus'], ['★', 2, mm('B2Y'), 'Toza o‘yin']],
  qadam: [['1', 8, mm('B3A', { yul: true }), 'Besh qadam'], ['2', 6, mm('B3B'), 'Qisqa yo‘l'], ['3', 4, mm('B3C'), 'Hammasi birga'], ['★', 2, mm('B3Y'), 'O‘z o‘yiningiz']],
}

// huk (2–4-qadam): Coddy'da 3 ta jon; →→→→→ — A tegsa tugaydi, B jon kamayadi (−1 gacha), C kamaytiradi va tekshiradi
const AVTO = '→→→→→'
const kq = (r) => `<span class="hk-d">${mb('q', 'cactus')}${r.map((x) => (typeof x === 'string' ? x : mb(...x))).join('')}</span>`
const HUK = [
  ['A', 'Tegsa — o‘yin tugasin', { dastur: 'hukA', nat: '✕ jon 3 — tugadi', ok: '0' }, () => kq([['g']])],
  ['B', 'Jonni kamaytiramiz', { dastur: 'hukB', nat: '✕ jon −1', ok: '0' }, () => kq([['c', 'jon:-1']])],
  ['C', 'Kamaytiramiz va tekshiramiz', { dastur: 'hukC', nat: '✓ jon 0 — tugadi', ok: '1' }, () => kq([['c', 'jon:-1'], shartV('jon:0', ['g'])])],
]
const SONI = { A: 3, B: 4, C: 7 } // namuna (ustoz ekranida haqiqiy son)
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const hKartalar = ({ son, nat = false, avto = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}"${avto ? ` data-avto="${AVTO}" data-dastur="${d.dastur}" data-ok="${d.ok}" data-v0="jon:3"` : ''} data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}<b>${son[l]}</b></span>` : ''}</div>`).join('')}</div>`

// 5-qadam: jon — uchta yurakcha; 2-bosishda bittasi xira, 3-bosishda hammasi xira va «O‘yin tugadi» (studiya.js «raqam», uslub.css)
const YURAK = '<svg viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21S1.5 14.2 1.5 7.2C1.5 3.8 4 1.4 7 1.4c2.1 0 3.8 1.1 5 2.9 1.2-1.8 2.9-2.9 5-2.9 3 0 5.5 2.4 5.5 5.8C22.5 14.2 12 21 12 21z" fill="#F0435A" stroke="#C0392B" stroke-width="1.4"/></svg>'
const jonRasm = () => `<div class="jr" data-z="jon"><span class="jr-k"><small>jon:</small><b class="q0">3</b><b class="q1" data-r="2">2</b><b class="q3" data-r="3">0</b></span><span class="jr-y"><i class="y1" data-r="3">${YURAK}</i><i class="y2" data-r="3">${YURAK}</i><i class="y3" data-r="2">${YURAK}</i></span><span class="jr-t" data-r="3">O‘yin tugadi</span></div>`
const yurak3 = () => `<span class="jr-m">${YURAK}${YURAK}${YURAK}</span>`

// bekatlar: jon · ball va jon · qadam
const YURAK_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5S3 14.6 3 8.6C3 5.7 5.2 3.6 7.8 3.6c1.8 0 3.2.9 4.2 2.5 1-1.6 2.4-2.5 4.2-2.5C18.8 3.6 21 5.7 21 8.6c0 6-9 11.9-9 11.9z" fill="#fff"/></svg>'
const IKKI_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.6v8.8M2.6 9h8.8" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/><path d="M14 16h7.4" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/></svg>'
const QADAM_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="8" cy="15" rx="3.2" ry="4.6" fill="#fff"/><ellipse cx="16" cy="8.4" rx="3.2" ry="4.6" fill="#fff"/></svg>'
const BEKATLAR = [['h', 'Jon', YURAK_OQ], ['g', 'Ball va jon', IKKI_OQ], ['y', 'Qadam', QADAM_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · o‘yiningiz · ball, jon va qadam bilan</small><div class="kd3-r lb2 kd-b">${mm('B3Y', { cls: 'kd-mk' })}<span class="kd-bk3"><i>ball: 20</i><i class="j">jon: 3</i><i class="q">qadam: 5</i></span></div><b>Uch o‘zgaruvchi</b></div>`
// keyingi dars: tasodifiy son — zar
const ZAR_RASM = '<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#F4F8FD"/><rect x="30" y="10" width="40" height="40" rx="8" fill="#fff" stroke="#0D2137" stroke-width="2.4" transform="rotate(-10 50 30)"/><g fill="#0D2137" transform="rotate(-10 50 30)"><circle cx="40" cy="20" r="3.4"/><circle cx="50" cy="30" r="3.4"/><circle cx="60" cy="40" r="3.4"/></g><text x="50" y="60" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="8" fill="#5A6474">? ? ?</text></svg>'
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${ZAR_RASM}</div><b>13 · Tasodifiy son</b></div>`
// o'tgan darsda (1-qadam): kapsula «ball: 3» — o'zgaruvchi
const otganDars = () => `<div class="otd"><small>O‘tgan darsda</small><div class="tf-l"><div class="tf"><div class="tf-r"><span class="kd-bk">ball: 3</span></div><div class="tf-t"><b>O‘zgaruvchi</b><span>Kompyuter eslab qoladigan son</span></div></div></div></div>`

// natija (17, 18-qadam): ta o‘yin yutdi · ta shart qo‘ydi · ta o‘zgaruvchi ishlatdi
const YUTDI_OQ = YULDUZ_OQ
const SHART_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21v-7l-6-6M12 14l6-6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6.5h5v-5M21 6.5h-5v-5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const SINF_T = [['y', YUTDI_OQ, 'ta o‘yin yutdi', 96], ['g', SHART_OQ, 'ta shart qo‘ydi', 27]]
const BOLA_T = [['y', YUTDI_OQ, 'ta o‘yin yutdi', 8], ['g', SHART_OQ, 'ta shart qo‘ydi', 2], ['h', IKKI_OQ, 'ta o‘zgaruvchi ishlatdi', 3]]

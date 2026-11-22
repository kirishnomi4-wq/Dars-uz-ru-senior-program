// 16-dars «Klonlar» — darsning o'z ekran bo'laklari (21.11). Manba: new-junior/manba/016-klonlar.md («Maydon, dushman va bloklar», «Topshiriqlar»).
// Maydon — 3-darsdagi maydon (katak.js maydonHtml: 7 × 5, (x, y), Y tepaga), «Kosmos» rangida (uslub.css .kosmos); bezaksiz. Asl dushman va
// nusxalar — dvigatel chizadi (klon.js, DARS.klonSvg). Sinov: sinov/dvigatel/klon.mjs
const MB = { w: 7, h: 5, daraxt: [], gul: [] }
const md = (m = {}) => ({ ...MB, start: [3, 0], ...m })
const maydon = (m, aktyor, o = {}) => maydonHtml(md(m), { aktyor, ...o }).replace('class="katak maydon', 'class="katak maydon kosmos')
// maydon asl va nusxalar bilan (statik ekranlar: kirish, savol, javob, xulosa, natija) — dvigateldagi .kt-asl / .kt-klon bilan bir xil chizma
const dushG = (x, y, cls) => `<g class="${cls}" style="transform:${katakJoy(x, MB.h - 1 - y)}">${dushman(DUSH_R).replace('<svg ', '<svg x="4" y="18" width="72" height="62" ')}</g>`
const maydonK = (m, aktyor, { asl = [3, 4], nus = [] } = {}) => maydon(m, aktyor).replace('<g class="kt-q"', (asl ? dushG(asl[0], asl[1], 'kt-asl') : '') + nus.map(([x, y]) => dushG(x, y, 'kt-klon')).join('') + '<g class="kt-q"')
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))
const DUSH_R = '#8B5CF6'
DARS.klonSvg = dushman(DUSH_R) // klon.js: asl va nusxalar rasmi
const DUSH = (cls = '') => `<span class="dsh ${cls}">${dushman(DUSH_R)}</span>`
// dastur ustuni: «Dushman dasturi» (tasmada dushman), dastur (dasturchalar), «n / N ta blok»; oyin — tepada «Boshqaruv» qatori (← →, tayyor)
const IKKI = [['left', 'l', '←'], ['right', 'r', '→']]
const bqQ = () => `<div class="bq-q" role="button" data-z="boshqaruv"><b>Boshqaruv:</b><span class="bq-s">${IKKI.map(([k, , s]) => `<i data-k="${k}">${s}</i>`).join('')}</span><span class="bq-o">▾</span><div class="bq-och">${IKKI.map(([k, t]) => `<div class="bq-d">${mb('k', k)}${mb(t)}</div>`).join('')}<small>Boshqaruv tayyor — bloklar sanog‘iga kirmaydi</small></div></div>`
// tayyor dastur: r — [t, m, ichki?] yoki HTML; ichki — takrorlash (C-blok)
const tk = (n, ichki) => `<div class="c-blok" data-n="${n}">${mb('p', String(n))}<div class="c-ich">${ichki.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div><span class="c-tub"></span></div>`
const sana = (r) => r.reduce((a, x) => a + (typeof x === 'string' ? (x.match(/class="mb /g) || []).length : 1), 0)
const dstK = (r, chegara, { oyin = false } = {}) => { const html = r.map((x) => (typeof x === 'string' ? x : mb(...x))).join(''), n = r.filter((x) => Array.isArray(x) && ['f', 'H', 'k', 'q'].includes(x[0])).length; return `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz dsh-ega">${dushman(DUSH_R)}</span><b>Dushman dasturi</b></span>${oyin ? bqQ() : ''}${r.length ? `<div class="mbw">${html}</div>` : '<span class="bosh">Blokni shu yerga ulang</span>'}<small class="dsn">${n} ta dasturcha\n${sana(r)} / ${chegara} ta blok</small></div>` }
// tayyor bo'laklar (manba «Topshiriqlar»): ▶[C] — asl; K[…] — nusxa
const ASL = (...ichki) => [['f'], ...ichki]
const NUSXA = (...ichki) => [['H'], ...ichki]
const TUSH = () => tk(4, ['d'])
const GOR = (a = 0, b = 6) => ['y', `r${a}-${b},4`]

// kichik kosmos maydoni (zinapoya, reja, huk kartasi): asl (tepada), nusxa tushadigan joylar (xira), qahramon
const miniKosmos = ({ asl = [3, 4], tush = [], qah = [3, 0] } = {}, cls = 'mini') => {
  const W = MB.w * 10, H = MB.h * 10, Y = (y) => (MB.h - 1 - y) * 10
  let h = ''
  for (let q = 0; q < MB.h; q++) for (let x = 0; x < MB.w; x++) h += `<rect x="${x * 10 + 0.6}" y="${q * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${(x + q) % 2 ? '#243B6B' : '#1E3360'}"/>`
  ;[[1, 3], [5, 2], [0, 1], [6, 4], [4, 1]].forEach(([x, y]) => { h += `<circle cx="${x * 10 + 7}" cy="${Y(y) + 2.6}" r=".7" fill="#fff" opacity=".8"/>` })
  tush.forEach(([x, y]) => { h += `<ellipse cx="${x * 10 + 5}" cy="${Y(y) + 5.6}" rx="3.4" ry="2.4" fill="${DUSH_R}" opacity=".55"/>` })
  h += `<ellipse cx="${asl[0] * 10 + 5}" cy="${Y(asl[1]) + 5.4}" rx="3.8" ry="2.8" fill="${DUSH_R}"/><circle cx="${asl[0] * 10 + 3.6}" cy="${Y(asl[1]) + 5}" r=".9" fill="#fff"/><circle cx="${asl[0] * 10 + 6.4}" cy="${Y(asl[1]) + 5}" r=".9" fill="#fff"/>`
  if (qah) h += `<circle cx="${qah[0] * 10 + 5}" cy="${Y(qah[1]) + 5}" r="2.6" fill="#FF9F43"/>`
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#0F1E3D"/>${h}</svg>`
}
const qatorY0 = (xs) => xs.map((x) => [x, 0])
// uch zinapoya (8, 11, 15-qadam): nom — rasmniki, javob aytilmaydi
const POG = {
  bir: [['1', 9, miniKosmos({ tush: [[3, 0]], qah: [0, 0] }), 'Bitta nusxa'], ['2', 7, miniKosmos({ asl: [5, 4], tush: [[5, 0]], qah: [1, 0] }), 'Yerga'], ['3', 5, miniKosmos({ asl: [2, 4], tush: [[2, 0], [2, 1]], qah: [5, 0] }), 'Ikki nusxa'], ['★', 2, miniKosmos({ tush: [[1, 0]], qah: [5, 0] }), 'Boshqa ustun']],
  kop: [['1', 9, miniKosmos({ tush: qatorY0([0, 2, 3, 5, 6]), qah: null }), 'Beshta'], ['2', 7, miniKosmos({ tush: qatorY0([1, 4, 6, 2]), qah: null }), 'Har xil ustun'], ['3', 5, miniKosmos({ tush: qatorY0([0, 1, 2, 3]), qah: [6, 0] }), 'Chap yarmi'], ['★', 2, miniKosmos({ tush: [...qatorY0([0, 1, 2, 3, 4, 5, 6]), [2, 2], [5, 3], [1, 1]], qah: null }), 'Yomg‘ir']],
  oyin: [['1', 8, miniKosmos({ tush: [[1, 2], [4, 3], [5, 1]] }), 'Tozalang'], ['2', 6, miniKosmos({ tush: [[0, 3], [2, 2], [4, 1], [6, 3], [5, 2]] }), 'Sakkizta'], ['3', 4, miniKosmos({ tush: [[1, 2], [3, 3], [5, 1]] }), 'Tor yo‘l'], ['★', 2, miniKosmos({ tush: [[2, 3], [4, 2]] }), 'O‘z o‘yiningiz']],
}

// huk (2–4-qadam): uch karta — A bitta dushman besh marta, B beshta dushman (har birida o'z dasturi), C nusxalar (klon.js klonHuk, data-klon)
const HUK = [
  ['A', 'Bittasini besh marta tushiramiz', { klon: { asl: [['p', 5, [['x', 'r', 4], ['p', 4, ['d']]]]] }, nat: '✕ bittadan tushadi', ok: '0' }, () => `<span class="hk-rs">${DUSH()}<span class="hk-ay">↻ 5</span></span><span class="hk-sn">1 ta dastur · 5 ta blok</span>`],
  ['B', 'Beshta dushman chizamiz', { klon: { kop: 5, nusxa: [['p', 4, ['d']]] }, nat: '✕ beshta bir xil dastur', ok: '0' }, () => `<span class="hk-rs hk-b">${DUSH()}${DUSH()}${DUSH()}${DUSH()}${DUSH()}</span><span class="hk-sn">5 ta dastur · 20 ta blok</span>`],
  ['C', 'Dushmandan nusxa olamiz', { klon: { asl: [['p', 5, ['C']]], nusxa: [['x', 'r', 4], ['p', 4, ['d']]] }, nat: '✓ bitta dastur, beshta dushman', ok: '1' }, () => `<span class="hk-rs hk-c">${DUSH()}${DUSH('dsh-x')}${DUSH('dsh-x')}</span><span class="hk-sn">1 ta dastur · 7 ta blok</span>`],
]
const SONI = { A: 3, B: 5, C: 6 }
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const hKartalar = ({ son, nat = false, avto = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}"${avto ? ` data-klon='${JSON.stringify(d.klon)}' data-ok="${d.ok}"` : ''} data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}<b>${son[l]}</b></span>` : ''}</div>`).join('')}</div>`

// yangi so'z (5-qadam): uch bo'lak birma-bir — asl · create clone (nusxa paydo) · nusxalar tushdi
const klonSoz = () => `<div class="xs">
  <div class="xs-b" data-r="1"><span class="xs-d">${DUSH()}</span><b>Asl</b></div>
  <div class="xs-b" data-r="2"><span class="xs-d">${mb('C')}<span class="xs-n">${DUSH()}${DUSH('nus')}<em>nusxa</em></span></span><b>Nusxa</b></div>
  <div class="xs-b" data-r="3"><span class="xs-d">${miniKosmos({ tush: qatorY0([1, 3, 5]), qah: null }, 'xs-mk')}</span><b>Bitta dastur — ko‘p nusxa</b></div>
</div>`

// bekatlar (reja tepaligi): bitta nusxa · ko'p nusxa · o'yin
const BIR_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.4" y="3.6" width="12" height="12" rx="2.6" fill="none" stroke="#fff" stroke-width="2.4"/><rect x="3.6" y="8.4" width="12" height="12" rx="2.6" fill="#fff"/></svg>'
const KOP_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="3" fill="#fff"/><circle cx="17" cy="9" r="3" fill="#fff"/><circle cx="9" cy="17" r="3" fill="#fff"/><circle cx="18" cy="19" r="2.4" fill="#fff"/></svg>'
const OYIN_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" fill="#fff"/></svg>'
const BEKATLAR = [['h', 'Bitta nusxa', BIR_OQ], ['g', 'Ko‘p nusxa', KOP_OQ], ['y', 'O‘yin', OYIN_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · dushman yomg‘iri</small><div class="kd3-r lb2">${miniKosmos({ tush: [[1, 3], [4, 2], [5, 4], [2, 1]] }, 'kd-mk')}</div><b>Dushmanlardan qochamiz</b></div>`
const RAKETA_RASM = `<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#0F1E3D"/><g transform="translate(40 10) scale(1.3)">${RAKETA.replace(/<\/?svg[^>]*>/g, '')}</g></svg>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${RAKETA_RASM}</div><b>17 · Kosmik o‘yin 1</b></div>`
// kirish: «O‘tgan darsda» — xakaton (rul va xarita)
const RUL = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6" fill="none" stroke="#FF4F28" stroke-width="2.6"/><circle cx="12" cy="12" r="2.4" fill="#FF4F28"/><path d="M12 14.4v6M9.8 11.2 3.8 9.6M14.2 11.2l6-1.6" stroke="#FF4F28" stroke-width="2.4" stroke-linecap="round"/></svg>'
const otganDars = () => `<div class="otd"><small>O‘tgan darsda</small><div class="tf-l"><div class="tf"><div class="tf-r"><span class="otd-ik">${RUL}</span></div><div class="tf-t"><b>Xakaton</b><span>Birga, oz vaqtda bitta narsa yasash</span></div></div></div></div>`

// natija (17, 18-qadam)
// sonlar kartaning boshida, gap — 13–14-darsdagidek uchinchi shaxsda (bola ham, sinf ham bitta kalit bilan — natijaSon)
const SINF_T = [['h', BIR_OQ, 'ta nusxa yasadi', 612], ['g', OYIN_OQ, 'ta o‘yin yutdi', 31], ['y', KOP_OQ, 'pog‘ona bajardi', 118]]
const BOLA_T = [['h', BIR_OQ, 'ta nusxa yasadi', 46], ['g', OYIN_OQ, 'ta o‘yin yutdi', 3], ['y', KOP_OQ, 'pog‘ona bajardi', 9]]

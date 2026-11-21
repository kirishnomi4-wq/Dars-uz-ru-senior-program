// 13-dars «Tasodifiy son» — darsning o'z ekran bo'laklari (21.11). Manba: new-junior/manba/013-tasodifiy-son.md («Maydon, savatlar va bloklar», «Topshiriqlar»).
// Maydon — 3–6-darsdagi bog' (katak.js maydonHtml): 7 × 5, (x, y), Y tepaga; savatlar — m.savat ([x, y, guruh?]); tushgan olmalar — dvigatel chizadi.
const MB = { w: 7, h: 5, daraxt: [[1, 1], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] }
const md = (m = {}) => ({ ...MB, start: [0, 0], ...m })
const maydon = (m, aktyor, o = {}) => maydonHtml(md(m), { aktyor, ...o })
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))
const SV = DARS.savatlar
// har ekranning maydoni: savatlar va qahramon katagi (manba jadvali)
const M13 = {
  HUK: { start: [3, 0] }, P6: { savat: SV.P6, start: [6, 2] },
  B1A: { savat: SV.B1A, start: [3, 0] }, B1B: { savat: SV.B1B, start: [0, 2] }, B1C: { savat: SV.B1C, start: [5, 2] }, B1Y: { savat: SV.B1Y, start: [3, 2] },
  P7: { savat: SV.P7, start: [1, 0] }, B2A: { savat: SV.B2A, start: [3, 2] }, B2B: { savat: SV.B2B, start: [0, 2] }, B2C: { savat: SV.B2C, start: [0, 0] }, B2Y: { savat: SV.B2Y, start: [1, 2] },
  P8: { savat: SV.P8, start: [3, 2] }, B3A: { savat: SV.B3A, start: [4, 4] }, B3B: { savat: SV.B3B, start: [3, 2] }, B3C: { savat: SV.B3C, start: [3, 0] }, B3Y: { start: [3, 2] }, P11: { start: [3, 2] },
}
// dastur ustuni: «Olma dasturi» (tasmada olma), dastur, «n / N ta blok», «Sinov: 0 / 3»; qah — 3-bekat: tepada «Qahramon» qatori (to'rt strelka, tayyor)
const OLMA_IK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8c-.6-2.4-2.6-3.6-2.6-3.6" fill="none" stroke="#6B4423" stroke-width="1.7" stroke-linecap="round"/><path d="M12.6 6.6c1.4-2.4 4.4-2.4 4.4-2.4-.4 2.4-2.6 3.2-4.4 2.4z" fill="#4CB050"/><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#F0435A"/></svg>'
const TORT = [['right', 'r', '→'], ['left', 'l', '←'], ['up', 'u', '↑'], ['down', 'd', '↓']]
const qahQ = () => `<div class="bq-q" role="button" data-z="qahramon"><b>Qahramon:</b><span class="bq-s">${TORT.map(([k, , s]) => `<i data-k="${k}">${s}</i>`).join('')}</span><span class="bq-o">▾</span><div class="bq-och">${TORT.map(([k, t]) => `<div class="bq-d">${mb('k', k)}${mb(t)}</div>`).join('')}<small>Qahramon tayyor — o‘zgartirilmaydi</small></div></div>`
const dst13 = (r, chegara, { qah = false, sinov = true } = {}) => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz olma-ega">${OLMA_IK}</span><b>Olma dasturi</b></span>${qah ? qahQ() : ''}${r.length ? `<div class="mbw">${r.map((x) => (typeof x === 'string' ? x : mb(...x))).join('')}</div>` : '<span class="bosh">Blokni shu yerga ulang</span>'}<small class="dsn">${r.filter((x) => !(x[2] || '').includes('solo-faqat')).reduce((a, x) => a + (typeof x === 'string' ? (x.match(/class="mb /g) || []).length : String(x[1] || '').split('r').length), 0)} / ${chegara} ta blok</small>${sinov ? '<small class="sinov-n">Sinov: 0 / 3</small>' : ''}</div>`
// kichik maydon (zinapoya, reja): savatlar (jigarrang kvadratcha), qahramon; dastur va sonlar yo'q (audit saboqlari)
const miniMaydon = (m, { cls = 'mini' } = {}) => {
  const W = MB.w * 10, H = MB.h * 10, Y = (y) => (MB.h - 1 - y) * 10, s = m.start || [0, 0]
  let h = ''
  for (let q = 0; q < MB.h; q++) for (let x = 0; x < MB.w; x++) h += `<rect x="${x * 10 + 0.6}" y="${q * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${(x + MB.h - 1 - q) % 2 ? '#F7EACB' : '#F3E3BE'}"/>`
  MB.daraxt.forEach(([x, y]) => { h += `<circle cx="${x * 10 + 3.6}" cy="${Y(y) + 3.6}" r="2.8" fill="#3E8E4E"/>` })
  ;(m.savat || []).forEach(([x, y]) => { h += `<path d="M${x * 10 + 1.6} ${Y(y) + 4}h6.8l-1 4.4h-4.8z" fill="#C9955A" stroke="#8A5A2E" stroke-width=".6"/>` })
  ;(m.olma || []).forEach(([x, y]) => { h += `<circle cx="${x * 10 + 5}" cy="${Y(y) + 4.6}" r="2.4" fill="#F0435A"/>` })
  h += `<circle cx="${s[0] * 10 + 5}" cy="${Y(s[1]) + 5}" r="2.4" fill="#2F8FF0"/>`
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#9AD57C" opacity=".55"/>${h}</svg>`
}
const mm = (id, o) => miniMaydon(M13[id], o)
const POG = {
  bir: [['1', 10, mm('B1A'), 'Butun qator'], ['2', 8, mm('B1B'), 'Uchta savat'], ['3', 5, mm('B1C'), 'Ustun'], ['★', 2, mm('B1Y'), 'Ikki olma']],
  ikki: [['1', 9, mm('B2A'), 'Kichik kvadrat'], ['2', 7, mm('B2B'), 'To‘rtburchak'], ['3', 5, mm('B2C'), 'Katta to‘rtburchak'], ['★', 2, mm('B2Y'), 'Olma yomg‘iri']],
  oyin: [['1', 8, mm('B3A'), 'Bog‘ o‘rtasi'], ['2', 6, mm('B3B'), 'Tepa qator'], ['3', 4, mm('B3C'), 'Chap ustun'], ['★', 2, mm('B3Y'), 'O‘z o‘yiningiz']],
}
// huk (2–4-qadam): pastki qator, Coddy (3, 0); har kartada ikki o'yin × uch olma — kartaning o'zida ikki qator son
const HUK = [
  ['A', 'Boshqa son qo‘yamiz', { olma: '5,5,5', nat: '✕ ikki o‘yin bir xil', ok: '0' }, () => `<span class="hk-d">${mb('y', '5,0')}</span>`],
  ['B', 'Navbat bilan uch joy', { olma: '1,5,3', nat: '✕ yana bir xil', ok: '0' }, () => `<span class="hk-d">${mb('y', '1,0')}${mb('y', '5,0')}${mb('y', '3,0')}</span><small class="hk-n">1-olma · 2-olma · 3-olma</small>`],
  ['C', 'Dastur o‘zi tanlasin', { tanlov: '4,1,6|2,5,0', nat: '✓ har o‘yin boshqacha', ok: '1' }, () => `<span class="hk-d">${mb('y', 'r0-6,0')}</span>`],
]
const SONI = { A: 3, B: 4, C: 7 }
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const hKartalar = ({ son, nat = false, avto = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}"${avto ? `${d.olma ? ` data-olma="${d.olma}"` : ''}${d.tanlov ? ` data-tanlov="${d.tanlov}"` : ''} data-ok="${d.ok}"` : ''} data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}<span class="ho-q">${nat ? (l === 'C' ? '<span>1-o‘yin: <b>4 · 1 · 6</b></span><span>2-o‘yin: <b>2 · 5 · 0</b></span>' : l === 'A' ? '<span>1-o‘yin: <b>5 · 5 · 5</b></span><span>2-o‘yin: <b>5 · 5 · 5</b></span>' : '<span>1-o‘yin: <b>1 · 5 · 3</b></span><span>2-o‘yin: <b>1 · 5 · 3</b></span>') : ''}</span></div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}<b>${son[l]}</b></span>` : ''}</div>`).join('')}</div>`
// tushgan olmalar (statik rasm: javob, xulosa, natija) — xira belgi yoki olma
const OLMA_SVG = (x, y, iz) => `<g class="kt-olma${iz ? ' iz-olma' : ''}" transform="translate(${x * 100 + 50} ${(4 - y) * 100 + 52})">${MD_OLMA}</g>`
const olmaliMaydon = (m, aktyor, olmalar, o = {}) => maydon(m, aktyor, o).replace('<g class="kt-q"', olmalar.map(([x, y, iz]) => OLMA_SVG(x, y, iz)).join('') + '<g class="kt-q"')
// 5-qadam: zar va random 1 to 6 — son birma-bir (studiya.js «raqam»: [data-r]; ko'rinadigani — eng oxirgi yongan)
const ZAR = (n) => { const N = { 1: [[12, 12]], 2: [[7, 7], [17, 17]], 3: [[7, 7], [12, 12], [17, 17]], 4: [[7, 7], [17, 7], [7, 17], [17, 17]], 5: [[7, 7], [17, 7], [12, 12], [7, 17], [17, 17]], 6: [[7, 6], [17, 6], [7, 12], [17, 12], [7, 18], [17, 18]] }[n] || []; return `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="#fff" stroke="#0D2137" stroke-width="1.4"/>${N.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#0D2137"/>`).join('')}</svg>` }
const zarRasm = () => `<div class="zr" data-z="zar"><span class="zr-z"><i class="q0">${ZAR(0)}</i><i class="q1" data-r="2">${ZAR(4)}</i><i class="q3" data-r="3">${ZAR(2)}</i></span><span class="zr-b">${mb('m', '1-6')}<b class="zr-s q1" data-r="2">4</b><b class="zr-s q3" data-r="3">2</b></span></div>`

// bekatlar: bitta son · ikki son · o'yin
const ZAR_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.4" y="3.4" width="17.2" height="17.2" rx="4" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="12" cy="12" r="2" fill="#fff"/></svg>'
const IKKI_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="6" width="9" height="9" rx="2.4" fill="none" stroke="#fff" stroke-width="2"/><rect x="13" y="9" width="9" height="9" rx="2.4" fill="none" stroke="#fff" stroke-width="2"/><circle cx="6.5" cy="10.5" r="1.4" fill="#fff"/><circle cx="17.5" cy="13.5" r="1.4" fill="#fff"/></svg>'
const OLMA_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#fff"/><path d="M12 8c-.4-2-1.8-3.4-1.8-3.4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>'
const BEKATLAR = [['h', 'Bitta son', ZAR_OQ], ['g', 'Ikki son', IKKI_OQ], ['y', 'O‘yin', OLMA_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · o‘z o‘yiningiz · Dasturini o‘qib berasiz</small><div class="kd3-r lb2">${miniMaydon({ ...M13.B3A, olma: [[3, 1], [5, 2], [4, 0]] }, { cls: 'kd-mk' })}</div><b>O‘z o‘yiningiz</b></div>`
const LUPA = '<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#F4F8FD"/><rect x="14" y="12" width="40" height="11" rx="3" fill="#2F8FF0"/><rect x="14" y="26" width="40" height="11" rx="3" fill="#FF4F28"/><rect x="14" y="40" width="40" height="11" rx="3" fill="#2F8FF0"/><circle cx="70" cy="30" r="13" fill="none" stroke="#0D2137" stroke-width="3.4"/><path d="M79 40l10 10" stroke="#0D2137" stroke-width="4" stroke-linecap="round"/></svg>'
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${LUPA}</div><b>14 · Xatoni topish</b></div>`
const otganDars = () => `<div class="otd"><small>O‘tgan darsda</small><div class="tf-l"><div class="tf"><div class="tf-r">${yigma([['c', 'jon:-1']])}</div><div class="tf-t"><b>Jon</b><span>Tugasa, o‘yin tugaydi</span></div></div></div></div>`

// natija (17, 18-qadam): ta random qo‘ydi · ta olma tushirdi · ta olma terdi
const SINF_T = [['h', ZAR_OQ, 'ta random qo‘ydi', 168], ['g', OLMA_OQ, 'ta olma tushirdi', 512], ['y', YULDUZ_OQ, 'ta olma terdi', 140]]
const BOLA_T = [['h', ZAR_OQ, 'ta random qo‘ydi', 14], ['g', OLMA_OQ, 'ta olma tushirdi', 41], ['y', YULDUZ_OQ, 'ta olma terdi', 20]]

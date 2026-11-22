// 15-dars «Xakaton №1» — darsning o'z ekran bo'laklari (21.11). Manba: new-junior/manba/015-xakaton-1.md («Maydon, o'yinlar va qismlar»).
// «Olma terish» — 11–12-darsdagi bog' (katak.js maydonHtml): 7 × 5, (x, y), Y tepaga; kaktus — m.kaktus; oltin olma — faqat ★ tanlansa (studiya.js xkMaydon).
// «Labirint» — 9–10-darsdagi D1 (katakHtml), 2-daraja — bola yasaydi (10-dars asboblari, DARS.palQosh.L). Sinov: sinov/dvigatel/xakaton.mjs
const MB = { w: 7, h: 5, daraxt: [[1, 1], [4, 3], [6, 1]], gul: [[0, 4], [2, 3], [5, 4], [6, 3]] }
const md = (m = {}) => ({ ...MB, start: [0, 0], ...m })
const maydon = (m, aktyor, o = {}) => maydonHtml(md(m), { aktyor, ...o })
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))
// «Olma terish» maydoni: olmalar, kaktuslar, yulduz (olmalar terilgach ochiladi); oltin olma (5, 2) — ★ tanlansa
const OLMA_M = { olma: [[2, 2], [5, 0], [3, 4]], kaktus: [[4, 1], [1, 3]], yulduz: [6, 4], yashirin: true }
const OLTIN_JOY = [5, 2]
DARS.xakaton.olma.oltin = OLTIN_JOY // xakaton.js: ★ «Oltin olma» tanlansa — shu katakka (maydon to'liq qayta chiziladi)
DARS.xakaton.olma.maydon = md(OLMA_M)
// sahnadagi sonlar (12-darsdagi kapsulalar): faqat dasturda ishlatilgani ko'rinadi (studiya.js ozgKorinsin)
const OZG = ['ball', 'jon', 'qadam']
const ozgQ = (v = {}) => `<div class="gl ball-q" data-z="o‘zgaruvchilar">${OZG.map((n) => `<span class="ball-k${n in v ? '' : ' yoq'}" data-v="${n}"><small>${n}:</small><b>${v[n] || 0}</b></span>`).join('')}</div>`
const ballK = (v = 0, { yashirin = false } = {}) => `<span class="gl ball-k${yashirin ? ' yashirin' : ''}" data-z="ball"><small>ball:</small><b>${v}</b></span>`
const labM = (aktyor, o = {}) => maydonHtml(mdXaritaM(DARS.labirintlar.D1), { aktyor, ...o })

// rollar: rul (haydovchi) va xarita (xaritachi) — odam qiyofasi yo'q
const RUL = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="12" cy="12" r="2.4" fill="currentColor"/><path d="M12 14.4v6M9.8 11.2 3.8 9.6M14.2 11.2l6-1.6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
const XARITA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.2 8.6 4l6.8 2.4L21 4.2v13.6l-5.6 2.2-6.8-2.4L3 19.8z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M8.6 4v13.6M15.4 6.4V20" stroke="currentColor" stroke-width="2"/><path d="M11 11.6l1.6 1.6 2.6-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
const AYLANMA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12a7 7 0 0 1-12.2 4.7M5 12a7 7 0 0 1 12.2-4.7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M17.8 3.4v4.4h-4.4M6.2 20.6v-4.4h4.4" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const NOUT_K = '<svg viewBox="0 0 40 30" aria-hidden="true"><rect x="6" y="3" width="28" height="18" rx="2.4" fill="#E8F1FC" stroke="#0D2137" stroke-width="2.2"/><path d="M2 25h36" stroke="#0D2137" stroke-width="2.8" stroke-linecap="round"/></svg>'
const SICH = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.6" y="3" width="10.8" height="18" rx="5.4" fill="#fff" stroke="#0D2137" stroke-width="2"/><path d="M12 3v6" stroke="#0D2137" stroke-width="2"/></svg>'
const rol = (ik, cls) => `<span class="xk-ik ${cls}">${ik}</span>`

// huk (2–4-qadam): uch karta — ikki do'stning birga ishlash usuli; sahna — «Olma terish» (yulduz ko'rinadi), kartalar o'z dasturi bilan o'zi o'ynaladi
const hukM = () => ({ olma: OLMA_M.olma, kaktus: OLMA_M.kaktus, yulduz: OLMA_M.yulduz })
const kd = (r) => `<span class="hk-d">${r.map((x) => mb(...x)).join('')}</span>`
const HUK = [
  ['A', 'Ikkalamiz birga bosamiz', { dastur: 'hukA', avto: '→↑', nat: '✕ ikkalamiz bir ishni qildik', ok: '0', yoq: true }, () => `<span class="hk-rs hk-a">${SICH}<span class="hk-k1">${KURSOR}</span><span class="hk-k2">${KURSOR}</span></span>`],
  ['B', 'Alohida-alohida yasaymiz', { dastur: 'hukB1,hukB2', avto: '→→↑↑,→→', nat: '✕ ikki yarim o‘yin', ok: '0', ball: '2' }, () => `<span class="hk-rs hk-b">${NOUT_K}${NOUT_K}</span>`],
  ['C', 'Ishni bo‘lamiz, navbat bilan', { dastur: 'hukC', avto: '↑↑→→↑↑→→→↓↓↓↓→↑↑↑↑', nat: '✓ bitta to‘liq o‘yin', ok: '1', ball: '1' }, () => `<span class="hk-rs hk-c">${rol(RUL, 'k-rul')}${rol(XARITA, 'k-xar')}</span>`],
]
const SONI = { A: 4, B: 3, C: 7 } // namuna (ustoz ekranida haqiqiy son)
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const hKartalar = ({ son, nat = false, avto = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}"${avto ? ` data-avto="${d.avto}" data-dastur="${d.dastur}" data-ok="${d.ok}"${d.ball ? ` data-ball="${d.ball}"` : ''}${d.yoq ? ' data-yoq="1"' : ''}` : ''} data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}<b>${son[l]}</b></span>` : ''}</div>`).join('')}</div>`

// yangi so'z (5-qadam): uch bo'lak birma-bir — juftlik (rul va xarita) · ro'yxat (uch band ✓) · tayyor o'yin («Tayyor!»)
const xkSoz = () => `<div class="xs">
  <div class="xs-b" data-r="1"><span class="xs-r">${rol(RUL, 'k-rul')}${rol(XARITA, 'k-xar')}</span><b>Juftlik</b></div>
  <div class="xs-b" data-r="2"><span class="xs-l"><small>O‘yiningizda:</small><i>✓ To‘rt strelka</i><i>✓ Ball</i><i>✓ Jon</i></span><b>Ro‘yxat</b></div>
  <div class="xs-b" data-r="3"><span class="xs-o">${miniMaydon([[6, 4, 'q'], [6, 4, 'y']], { cls: 'xs-mk' })}<em>Tayyor!</em></span><b>O‘yin</b></div>
</div>`
// qoida (7-qadam): uch qator — rul · xarita · aylanma strelka
const qoidaQator = () => `<div class="xyl">${[[1, RUL, 'k-rul', '<b>Haydovchi</b> — Bloklarni qo‘yadi'], [2, XARITA, 'k-xar', '<b>Xaritachi</b> — Kartani o‘qiydi, kuzatadi'], [3, AYLANMA, 'k-ay', '<b>Qism tayyor</b> — o‘ynaymiz, keyin almashamiz']].map(([r, ik, c, t]) => `<div class="xq" data-r="${r}"><span class="hq">${rol(ik, c)}<span>${t}</span></span></div>`).join('')}<small class="solo-iz" hidden>Bugun siz bir o‘zingiz: haydovchi ham, xaritachi ham — siz. Avval kartani o‘qing, keyin yasang.</small></div>`

// kichik maydon (doskalar, reja, tanlash kartasi): olma, kaktus, yulduz, qahramon — dastur yo'q
const miniMaydon = (belgi = [], { cls = 'mini', kaktus = [] } = {}) => {
  const W = MB.w * 10, H = MB.h * 10, Y = (y) => (MB.h - 1 - y) * 10
  let h = ''
  for (let q = 0; q < MB.h; q++) for (let x = 0; x < MB.w; x++) { const y = MB.h - 1 - q; h += `<rect x="${x * 10 + 0.6}" y="${q * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${(x + y) % 2 ? '#F7EACB' : '#F3E3BE'}"/>` }
  MB.daraxt.forEach(([x, y]) => { h += `<circle cx="${x * 10 + 3.6}" cy="${Y(y) + 3.6}" r="2.8" fill="#3E8E4E"/>` })
  kaktus.forEach(([x, y]) => { h += `<rect x="${x * 10 + 3.6}" y="${Y(y) + 1.8}" width="2.8" height="6.6" rx="1.4" fill="#3F9B4C"/><path d="M${x * 10 + 3.6} ${Y(y) + 5}h-1.4v-1.8M${x * 10 + 6.4} ${Y(y) + 4.4}h1.4v-1.8" stroke="#3F9B4C" stroke-width="1.2" fill="none"/>` })
  belgi.forEach(([x, y, t]) => {
    const X0 = x * 10, Y0 = Y(y)
    if (t === 'y') h += `<path transform="translate(${X0 + 5} ${Y0 + 5.2}) scale(3.4)" d="${KT_YULDUZ}" fill="#F5B82E" stroke="#C98A0E" stroke-width=".08"/>`
    if (t === 'o') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5.4}" r="2.7" fill="#F0435A"/><path d="M${X0 + 5} ${Y0 + 2.8}l.7-1.2" stroke="#4CB050" stroke-width=".9"/>`
    if (t === 'q') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5}" r="2.4" fill="#2F8FF0"/>`
  })
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#9AD57C" opacity=".55"/>${h}</svg>`
}
const miniOlma = (cls) => miniMaydon([[0, 0, 'q'], ...OLMA_M.olma.map(([x, y]) => [x, y, 'o']), [...OLMA_M.yulduz, 'y']], { cls, kaktus: OLMA_M.kaktus })
// kichik labirint (D1): yo'l, devor, kalit, eshik, yulduz
const miniLab = (cls = 'mini') => {
  const xr = katakXarita(DARS.labirintlar.D1); let h = ''
  xr.forEach((q, r) => [...q].forEach((c, k) => { h += `<rect x="${k * 10 + 0.6}" y="${r * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${c === '#' ? '#3E8E4E' : c === '*' ? '#F5B82E' : c === 'S' ? '#2F8FF0' : c === 'K' ? '#E7CA66' : c === 'E' ? '#B5793F' : '#F7EACB'}"/>` }))
  return `<svg class="${cls} mk" viewBox="-1 -1 ${xr[0].length * 10 + 2} ${xr.length * 10 + 2}" aria-hidden="true">${h}</svg>`
}

// bekatlar (reja tepaligi): tanlaymiz · yasaymiz · sinaymiz
const TAN_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.4" y="5" width="7.6" height="14" rx="1.8" fill="#fff"/><rect x="13" y="5" width="7.6" height="14" rx="1.8" fill="none" stroke="#fff" stroke-width="2"/></svg>'
const YAS_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="12" width="7" height="7" rx="1.6" fill="#fff"/><rect x="13" y="12" width="7" height="7" rx="1.6" fill="#fff"/><rect x="8.5" y="4" width="7" height="7" rx="1.6" fill="#fff"/></svg>'
const SIN_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" fill="#fff"/></svg>'
const BEKATLAR = [['h', 'Tanlaymiz', TAN_OQ], ['g', 'Yasaymiz', YAS_OQ], ['y', 'Sinaymiz', SIN_OQ]]
// dars oxirida — do'stlar o'ynaydi (kichik maydon, olmalar va yulduz)
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · do‘stlar o‘ynaydi</small><div class="kd3-r lb2">${miniOlma('kd-mk')}</div><b>O‘yiningiz</b></div>`
// keyingi dars: 16 · Klonlar — bitta qahramondan ko'p nusxa
const KLON_RASM = `<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#F4F8FD"/>${[18, 40, 62, 84].map((x, i) => `<circle cx="${x}" cy="34" r="${9 - i}" fill="#2F8FF0" opacity="${1 - i * 0.2}"/>`).join('')}</svg>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${KLON_RASM}</div><b>16 · Klonlar</b></div>`
// kirish: «O‘tgan darsda» — «Bitta qadam» tugmasi rasmi
const otganDars = () => `<div class="otd"><small>O‘tgan darsda</small><div class="tf-l"><div class="tf"><div class="tf-r"><span class="qd-t bq-r">Bitta qadam</span></div><div class="tf-t"><b>Xato</b><span>Topiladigan narsa</span></div></div></div></div>`

// juftlik (8-qadam): ikki karta — «O‘yin shu noutbukda» · «O‘yin do‘stimning noutbukida»; doskada — bitta noutbuk va ikki stul
const STUL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v10h10V3M5 13h14v3H5zM7 16v5M17 16v5" fill="none" stroke="#0D2137" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const STRELKA_K = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const juftRasm = () => `<div class="jf-r">${NOUT_K}<span class="jf-s">${STUL}${STUL}</span></div>`
const juftKartalar = () => `<div class="jf-k"><span class="jf-o" data-j="oyin" role="button"><span class="jf-i">${NOUT_K}${rol(RUL, 'k-rul')}</span><b>O‘yin shu noutbukda</b></span><span class="jf-o" data-j="ikki" role="button"><span class="jf-i">${rol(STRELKA_K, 'k-st')}</span><b>O‘yin do‘stimning noutbukida</b></span></div>`

// o'yin tanlash (9-qadam): ikki karta — kichik maydon rasmi (o'zi o'ynamaydi)
const oyinKartalar = () => `<div class="xk-ok"><span class="xk-o" data-o="olma" role="button">${miniOlma('xk-mk')}<b>Olma terish</b></span><span class="xk-o" data-o="lab" role="button">${miniLab('xk-mk')}<b>Labirint</b></span></div>`

// natija (17, 18-qadam): sinf — ta o‘yin yasaldi · ta qism · do'stlar o'ynadi
const OYIN_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" fill="#fff"/></svg>'
const QISM_OQ = YAS_OQ
const DOST_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3.4" fill="#fff"/><circle cx="16.4" cy="8" r="3.4" fill="#fff"/><path d="M2 20c.6-4 3-6 6-6s5.4 2 6 6zM11 20c.5-3.4 2.6-5.6 5.4-5.6S21.4 16.6 22 20z" fill="#fff"/></svg>'
const SINF_T = [['h', OYIN_OQ, 'ta o‘yin yasaldi', 7], ['g', QISM_OQ, 'ta qism', 18], ['y', DOST_OQ, 'marta o‘ynab ko‘rildi', 9]]

// «Labirint» asboblari (10-dars; javon o'rnida — studiya.js yasashBosish): rg da «Labirint» tugmasi — yasash qismlarida (studiya.js xkBosh)
const BUTA_I = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="4" y="5" width="92" height="90" rx="30" fill="#3E8E4E"/><circle cx="31" cy="34" r="15" fill="#4FA35D"/><circle cx="67" cy="38" r="14" fill="#4FA35D"/><circle cx="36" cy="68" r="14" fill="#47995A"/><circle cx="68" cy="70" r="13" fill="#47995A"/></svg>'
const KALIT_I = `<svg viewBox="-24 -16 50 32" aria-hidden="true"><g transform="rotate(-24) scale(1.2)">${KT_KALIT}</g></svg>`
const ESHIK_I = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="12" y="8" width="76" height="84" rx="8" fill="#B5793F" stroke="#7A4B22" stroke-width="5"/><path d="M31 10V90M50 10V90M69 10V90" stroke="#8E5A2B" stroke-width="5"/><rect x="38" y="40" width="24" height="22" rx="5" fill="#E7CA66" stroke="#7A4B22" stroke-width="3"/></svg>'
const YULDUZ_I = `<svg viewBox="-1.1 -1.1 2.2 2.2" aria-hidden="true"><path d="${KT_YULDUZ}" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07"/></svg>`
const ASBOBLAR = `<small class="f-L">Labirint</small><div class="asb-l">${[['devor', 'Devor', BUTA_I], ['kalit', 'Kalit', KALIT_I], ['eshik', 'Eshik', ESHIK_I], ['yulduz', 'Yulduz', YULDUZ_I]].map(([a, t, i], n) => `<span class="asb${n ? '' : ' on'}" data-t="${a}" role="button"><i>${i}</i><b>${t}</b></span>`).join('')}</div>`
DARS.palQosh = { L: ASBOBLAR } // studiya.js: oila almashganda «Labirint» javoni (brauzerga DARS bilan o'tadi)
const RD_L = '<span class="rd f-L on"><i>' + BUTA_I + '</i><small>Labirint</small></span>'

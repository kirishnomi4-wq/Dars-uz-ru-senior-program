// 10-dars «Labirint o‘yini 2» — darsning o'z ekran bo'laklari (20.11). Manba: new-junior/manba/010-labirint-oyini-2.md («Labirintlar», «Maydon, o'yin va labirint yasash»).
// Sahna — 9-darsdagi bog' maydoni butalar bilan (katak.js maydonHtml, mdXaritaM); labirintlar — DARS.labirintlar.
const coddyK = () => robot({ pose: 'turadi', yuz: 'xursand' })
const qahK = () => (globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))
const LBS = DARS.labirintlar
const lab = (id, aktyor, o = {}) => maydonHtml(mdXaritaM(LBS[id]), { aktyor, ...o })
const darajaYz = (i, n, r) => `<span class="gl daraja-yz"${r ? ` data-r="${r}"` : ''}>Daraja: <b>${i} / ${n}</b></span>`

// kichik labirint (9-darsdagidek): start, devor, kalit, eshik, yulduz
const miniKatak = (xarita, cls = 'mini') => {
  const xr = katakXarita(xarita), kq = Math.max(...xr.map((s) => s.length)), kr = xr.length, W = kq * 10, H = kr * 10
  let h = ''
  xr.forEach((row, y) => [...row].forEach((c, x) => {
    const X0 = x * 10, Y0 = y * 10
    if (c === '#') { h += `<rect x="${X0 + 0.6}" y="${Y0 + 0.6}" width="8.8" height="8.8" rx="3" fill="#3E8E4E"/>`; return }
    h += `<rect x="${X0 + 0.6}" y="${Y0 + 0.6}" width="8.8" height="8.8" rx="2" fill="${c === 'S' ? '#D6E8FA' : c === '*' ? '#F8E3A0' : '#F7EACB'}"/>`
    if (c === '*') h += `<path transform="translate(${X0 + 5} ${Y0 + 5.2}) scale(3.4)" d="${KT_YULDUZ}" fill="#F5B82E" stroke="#C98A0E" stroke-width=".08"/>`
    if (c === 'K') h += `<g transform="translate(${X0 + 5.4} ${Y0 + 5.2}) rotate(-24) scale(.17)">${KT_KALIT}</g>`
    if (c === 'E') h += `<rect x="${X0 + 1.6}" y="${Y0 + 1.6}" width="6.8" height="6.8" rx="1" fill="#B5793F" stroke="#7A4B22" stroke-width=".6"/>`
    if (c === 'S') h += `<circle cx="${X0 + 5}" cy="${Y0 + 5}" r="2.2" fill="#2F8FF0"/>`
  }))
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#9AD57C" opacity=".55"/>${h}</svg>`
}
const miniL = (id, cls) => miniKatak(LBS[id], cls)

// kichik bloklar va tugmalar
const tugmaK = (b, cls = '') => `<span class="kt-t ${cls}">${b}</span>`
const kb = (t, cls = '') => `<span class="mb f-h ${cls}" data-tur="${t}">${IKON[t]}</span>`
const ka = () => `<span class="mb f-a" data-tur="a">${IKON.a}</span>`
const ke = () => `<span class="mb f-e" data-tur="k">${IKON.k}</span>`
const YON_T = { right: 'r', left: 'l', up: 'u', down: 'd' }, TORT = ['right', 'left', 'up', 'down']
const dasturcha = (y) => mb('k', y) + shart(y, [YON_T[y]])
// tayyor dastur (Coddy'ning o'yini — to'rt strelka, har birida qoida)
const dstQ = (yuz) => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span><div class="mbw">${TORT.map(dasturcha).join('')}</div><small class="dsn">4 ta dasturcha\n12 / 16 ta blok</small></div>`

// «Labirint» asboblari (javon o'rnida; studiya.js yasashBosish) — rg da birinchi oila «Labirint», javondagi to'rt katta tugma
const BUTA_I = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="4" y="5" width="92" height="90" rx="30" fill="#3E8E4E"/><circle cx="31" cy="34" r="15" fill="#4FA35D"/><circle cx="67" cy="38" r="14" fill="#4FA35D"/><circle cx="36" cy="68" r="14" fill="#47995A"/><circle cx="68" cy="70" r="13" fill="#47995A"/></svg>'
const KALIT_I = `<svg viewBox="-24 -16 50 32" aria-hidden="true"><g transform="rotate(-24) scale(1.2)">${KT_KALIT}</g></svg>`
const ESHIK_I = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="12" y="8" width="76" height="84" rx="8" fill="#B5793F" stroke="#7A4B22" stroke-width="5"/><path d="M31 10V90M50 10V90M69 10V90" stroke="#8E5A2B" stroke-width="5"/><rect x="38" y="40" width="24" height="22" rx="5" fill="#E7CA66" stroke="#7A4B22" stroke-width="3"/></svg>'
const YULDUZ_I = `<svg viewBox="-1.1 -1.1 2.2 2.2" aria-hidden="true"><path d="${KT_YULDUZ}" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07"/></svg>`
const ASBOBLAR = `<small class="f-L">Labirint</small><div class="asb-l">${[['devor', 'Devor', BUTA_I], ['kalit', 'Kalit', KALIT_I], ['eshik', 'Eshik', ESHIK_I], ['yulduz', 'Yulduz', YULDUZ_I]].map(([a, t, i], n) => `<span class="asb${n ? '' : ' on'}" data-t="${a}" role="button"><i>${i}</i><b>${t}</b></span>`).join('')}</div>`
DARS.palQosh = { L: ASBOBLAR } // studiya.js: oila almashganda «Labirint» javoni (brauzerga DARS bilan o'tadi)
const RD_L = '<span class="rd f-L on"><i>' + BUTA_I + '</i><small>Labirint</small></span>'
// studiya (labirint yasash): rg boshida «Labirint» (tanlangan), javon — asboblar
const stYasash = (o) => studiya({ aktiv: 'e', dunyo: null, ...o }).replace('<div class="rg" data-z="ranglar">', '<div class="rg" data-z="ranglar">' + RD_L).replace(/class="rd f-e on\s*"/, 'class="rd f-e"').replace(/<div class="pl" data-z="bloklar">[\s\S]*?<\/div><div class="dst"/, '<div class="pl" data-z="bloklar">' + ASBOBLAR + '</div><div class="dst"')

// huk (2–4-qadam): A — yangi o'yin (labirint Z, dastur bo'sh); B — D1 o'zgartirildi (D1-B, «Daraja: 1 / 1»); C — D1 → Z, o'sha dastur (Z da bir «yo'q»)
const HUK = [
  ['A', 'Yangi o‘yin ochamiz', { avto: '→', dastur: 'bosh', lbs: 'Z', nat: '✕ boshqaruv va qoida yo‘q' }, () => `<span class="hk-q hk-bosh"><span class="hk-st"></span></span>`],
  ['B', 'Labirintni o‘zgartiramiz', { avto: '→↑↑↑↓→→→→→↑↑', dastur: 'qoida', lbs: 'D1B', nat: '✕ labirint baribir bitta' }, () => `<span class="hk-q">${miniL('D1', 'hk-mk')}<b class="hk-z">✎</b></span>`],
  ['C', 'Ikkinchi labirint qo‘shamiz', { avto: '→↑↑↑↓↓↓→→↑↑→→→↑↑|→→→→→↑↑→↑↑→', dastur: 'qoida', lbs: 'D1,Z', nat: '✓ ikki labirint, dastur o‘sha' }, () => `<span class="hk-q">${miniL('D1', 'hk-mk')}<b class="hk-z hk-s">→</b>${miniL('Z', 'hk-mk')}</span>`],
]
const SONI = { A: 2, B: 7, C: 5 }
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const hKartalar = ({ son, nat = false, avto = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}"${avto ? ` data-avto="${d.avto}" data-dastur="${d.dastur}" data-lbs="${d.lbs}"` : ''} data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}${son[l]}</span>` : ''}</div>`).join('')}</div>`

// zinapoyalar (8, 11, 15-qadam): shartning belgisi va soni — labirint rasmi yo'q (har bolaniki boshqa; audit saboqlari 1)
const belgi = (i, n = '') => `<span class="pg-belgi"><i>${i}</i>${n !== '' ? `<b>${n}</b>` : ''}</span>`
const YOL_I = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V12h8V4h8" fill="none" stroke="#C98A0E" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 2.4"/></svg>'
const BUR_I = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V14h6V8h6V3" fill="none" stroke="#2F8FF0" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const BERK_I = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h12" stroke="#5B6676" stroke-width="2.6" stroke-linecap="round"/><rect x="17" y="5" width="4" height="14" rx="1.5" fill="#3E8E4E"/></svg>'
const IKKI_I = `<span class="pg-ikki">${miniL('D1', 'hk-mk')}${miniL('U2', 'hk-mk')}</span>`
const POG = {
  bosh: [['1', 10, belgi(BUTA_I, 6), 'Devorlar · 6'], ['2', 8, belgi(YOL_I, 14), 'Uzun yo‘l · 14'], ['3', 5, belgi(BUR_I, 5), 'Burilishlar · 5'], ['★', 2, belgi(BERK_I, 2), 'Boshi berk yo‘llar · 2']],
  kalit: [['1', 9, belgi(KALIT_I + ESHIK_I), 'Kalit va eshik'], ['2', 6, belgi(KALIT_I + BERK_I), 'Kalit chetda'], ['★', 2, belgi(YOL_I, 20), 'Uzun daraja · 20']],
  ikki: [['1', 7, IKKI_I, 'Ikki daraja'], ['★', 3, belgi(YULDUZ_I), 'Adashmasdan']],
}
// bekatlar: o'z labirintingiz · kalit va eshik · ikki daraja
const TORT_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="2.4" fill="#fff"/><rect x="13" y="13" width="8" height="8" rx="2.4" fill="#fff"/><rect x="13" y="3" width="8" height="8" rx="2.4" fill="none" stroke="#fff" stroke-width="2"/><rect x="3" y="13" width="8" height="8" rx="2.4" fill="none" stroke="#fff" stroke-width="2"/></svg>'
const KALIT_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="12" r="4.6" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M12.4 12H21M18 12v3.6M15.2 12v2.6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>'
const IKKI_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="6" width="9" height="12" rx="2" fill="#fff"/><rect x="13" y="6" width="9" height="12" rx="2" fill="none" stroke="#fff" stroke-width="2"/></svg>'
const BEKATLAR = [['h', 'O‘z labirintingiz', TORT_OQ], ['g', 'Kalit va eshik', KALIT_OQ], ['y', 'Ikki daraja', IKKI_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · ikki darajali o‘yin</small><div class="kd3-r lb2">${IKKI_I}</div><b>Do‘stingiz o‘ynaydi</b></div>`
const BALL_I = '<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#F4F8FD"/><text x="50" y="42" text-anchor="middle" font-family="monospace" font-weight="800" font-size="28" fill="#0D2137">ball 3</text></svg>'
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${BALL_I}</div><b>11 · O‘zgaruvchi: ball</b></div>`
// natija (17, 18-qadam)
const TUGMA_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="#fff"/></svg>'
const DOST_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3.4" fill="#fff"/><circle cx="16.5" cy="8" r="3.4" fill="#fff"/><path d="M2 20c.6-4 3-6 6-6s5.4 2 6 6M10 20c.6-4 3-6 6.5-6s5.4 2 5.5 6" fill="#fff"/></svg>'
const SINF_T = [['h', TORT_OQ, 'ta labirint yasaldi', 14], ['g', DOST_OQ, 'ta o‘yinni do‘st o‘ynadi', 12], ['y', YULDUZ_OQ, 'daraja yutildi', 52]]
const BOLA_T = [['h', BUTA_I, 'ta devor qo‘ydi', 14], ['g', YOL_I, 'qadam — labirintingiz yo‘li', 20], ['y', YULDUZ_OQ, 'daraja yutdi', 4]]
const chekY = () => `<div class="gl chek-y">${DARS.chek.reduce((a, [, t]) => a + `<span class="ch-r"><i></i>${t}</span>`, '<div class="chek"><small>O‘yiningizda:</small>') + '</div>'}</div>`
const IKKI_NOUT = '<svg class="ikki-nout" viewBox="0 0 200 90" aria-hidden="true"><g fill="none" stroke="#0D2137" stroke-width="3"><rect x="10" y="20" width="62" height="40" rx="5" fill="#fff"/><path d="M4 66h74"/><rect x="128" y="20" width="62" height="40" rx="5" fill="#fff"/><path d="M122 66h74"/></g><path d="M86 34h28M106 26l8 8-8 8M114 54H86M94 46l-8 8 8 8" fill="none" stroke="#FF4F28" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'

// 17-dars «Kosmik o‘yin 1: raketa va o‘q» — darsning o'z ekran bo'laklari (21.11). Manba: new-junior/manba/017-kosmik-oyin-1.md («Maydon, personajlar va bloklar», «Topshiriqlar»).
// Maydon — 16-darsdagi «Kosmos» (katak.js maydonHtml, 7 × 5, Y tepaga). Raketa — maydon qahramoni (.kt-q, rasmi raketa, oynachasida qahramon); o'q nusxalari,
// nishonlar va bayroqlar — dvigatel chizadi (kosmik.js; rasmlar — DARS.klonSvg, DARS.ksNishon, DARS.ksBayroq). Sinov: sinov/dvigatel/raketa.mjs
const MB = { w: 7, h: 5, daraxt: [], gul: [] }
const md = (m = {}) => ({ ...MB, start: [3, 0], ...m })
// raketa: qahramon (yoki Coddy) — oynachada
const raketa = (yuz) => `<svg viewBox="0 0 80 88" aria-hidden="true"><path d="M40 3c14 11 19 28 19 44v22H21V47C21 31 26 14 40 3z" fill="#F4F6FB"/><path d="M21 50L7 67v10l14-7zM59 50l14 17v10l-14-7z" fill="#FF4F28"/><path d="M28 69h24l-4 8H32z" fill="#0D2137"/><path d="M33 77h14l-7 10z" fill="#FFC93C"/><circle cx="40" cy="37" r="14" fill="#3FA2FF" stroke="#0D2137" stroke-width="3"/>${yuz.replace('<svg ', '<svg x="29" y="25" width="22" height="24" ')}</svg>`
const coddyK = () => raketa(robot({ pose: 'turadi', yuz: 'xursand' }))
const qahK = () => raketa(globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))
const OQ_SVG = '<svg viewBox="0 0 24 20" aria-hidden="true"><rect x="9.2" y="1" width="5.6" height="15" rx="2.8" fill="#FFC93C"/><rect x="10.7" y="3" width="2.6" height="9.5" rx="1.3" fill="#FFF6D6"/><path d="M9.6 16h4.8L12 19.6z" fill="#FF8A3C"/></svg>'
const NISHON_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.4" fill="#8B97AD"/><circle cx="7.6" cy="8.6" r="2.3" fill="#6E7A91"/><circle cx="16" cy="16.2" r="1.9" fill="#6E7A91"/><circle cx="17" cy="7.4" r="1.2" fill="#6E7A91"/><path d="M12 6.6l1.7 3.4 3.7.5-2.7 2.6.7 3.7-3.4-1.8-3.4 1.8.7-3.7-2.7-2.6 3.7-.5z" fill="#F5B82E"/></svg>'
const BAYROQ_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 22V3" stroke="#E7ECF5" stroke-width="2.2" stroke-linecap="round"/><path d="M8 3.6h11l-3 4.2 3 4.2H8z" fill="#FF4F28"/></svg>'
DARS.klonSvg = OQ_SVG // klon.js: o'q nusxalari rasmi
DARS.ksNishon = NISHON_SVG.replace('<svg ', '<svg x="12" y="14" width="56" height="56" ')
DARS.ksBayroq = BAYROQ_SVG.replace('<svg ', '<svg x="18" y="10" width="50" height="50" ')
const OQ = (cls = '') => `<span class="oqr ${cls}">${OQ_SVG}</span>` // oqr — o'q rasmi; «oq» shablon.html dagi uchayotgan o'q (absolute, animatsiya) bilan to'qnashardi (22.11)
const NISHON = (cls = '') => `<span class="nsh ${cls}">${NISHON_SVG}</span>`
const RAK = (yuz = robot({ pose: 'turadi', yuz: 'xursand' }), cls = '') => `<span class="rak ${cls}">${raketa(yuz)}</span>`
DARS.perRasm = { raketa: `<span class="rak">${raketa('<svg></svg>')}</span>`, oq: OQ() }
// maydon: nishonlar, bayroqlar va (statik ekranlar uchun) uchayotgan o'qlar — dvigateldagi .ks-n / .ks-b / .kt-klon bilan bir xil chizma
const gK = (cls, x, y, ic) => `<g class="${cls}" data-k="${x},${y}" style="transform:${katakJoy(x, MB.h - 1 - y)}">${ic}</g>`
const maydon = (m, aktyor, { nishon = [], bayroq = [], oq = [], urildi = [] } = {}) => maydonHtml(md(m), { aktyor }).replace('class="katak maydon', 'class="katak maydon kosmos')
  .replace('<g class="kt-q"', bayroq.map(([x, y]) => gK('ks-b', x, y, DARS.ksBayroq)).join('') + nishon.map(([x, y]) => gK('ks-n' + (urildi.some(([a, c]) => a === x && c === y) ? ' urildi' : ''), x, y, DARS.ksNishon)).join('') + oq.map(([x, y]) => `<g class="kt-klon" style="transform:${katakJoy(x, MB.h - 1 - y)}">${OQ_SVG.replace('<svg ', '<svg x="4" y="18" width="72" height="62" ')}</g>`).join('') + '<g class="kt-q"')

// dastur ustuni: personaj kartalari («Raketa» · «O‘q») — dvigatel ham shunday chizadi (kosmik.js perKartalar); sarlavha — tanlangan personaj dasturi
const PER = [['raketa', 'Raketa'], ['oq', 'O‘q']]
const perQ = (cur = 'raketa', ochiq = ['raketa', 'oq']) => `<div class="per-q">${PER.map(([id, nom]) => `<span class="per-k${id === cur ? ' on' : ''}${ochiq.includes(id) ? '' : ' qulf'}" data-p="${id}" role="button"><i>${DARS.perRasm[id]}</i><b>${nom}</b></span>`).join('')}</div>`
const tk = (n, ichki) => `<div class="c-blok" data-n="${n}">${mb('p', String(n))}<div class="c-ich">${ichki.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div><span class="c-tub"></span></div>`
const sana = (r) => r.reduce((a, x) => a + (typeof x === 'string' ? (x.match(/class="mb /g) || []).length : 1), 0)
const dstP = (r, chegara, { cur = 'raketa', ochiq } = {}) => { const html = r.map((x) => (typeof x === 'string' ? x : mb(...x))).join(''), n = r.filter((x) => Array.isArray(x) && ['f', 'H', 'k', 'q'].includes(x[0])).length; return `<div class="dst" data-z="dastur"><span class="dsb"><b>${cur === 'oq' ? 'O‘q' : 'Raketa'} dasturi</b></span>${perQ(cur, ochiq)}${r.length ? `<div class="mbw">${html}</div>` : '<span class="bosh">Blokni shu yerga ulang</span>'}<small class="dsn">${n} ta dasturcha\n${sana(r)} / ${chegara} ta blok</small></div>` }

// kichik kosmos maydoni (zinapoya, reja): raketa (pastda), nishonlar, bayroqlar, o'q izi
const miniKosmos = ({ rak = [3, 0], nishon = [], bayroq = [], iz = [] } = {}, cls = 'mini') => {
  const W = MB.w * 10, H = MB.h * 10, Y = (y) => (MB.h - 1 - y) * 10
  let h = ''
  for (let q = 0; q < MB.h; q++) for (let x = 0; x < MB.w; x++) h += `<rect x="${x * 10 + 0.6}" y="${q * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${(x + q) % 2 ? '#243B6B' : '#1E3360'}"/>`
  ;[[1, 3], [5, 2], [0, 1], [6, 4], [4, 1]].forEach(([x, y]) => { h += `<circle cx="${x * 10 + 7}" cy="${Y(y) + 2.6}" r=".7" fill="#fff" opacity=".8"/>` })
  iz.forEach(([x, a, b]) => { h += `<path d="M${x * 10 + 5} ${Y(a) + 3}V${Y(b) + 7}" stroke="#FFC93C" stroke-width="1.6" stroke-dasharray="1.6 1.8" stroke-linecap="round"/>` })
  bayroq.forEach(([x, y]) => { h += `<path d="M${x * 10 + 3.4} ${Y(y) + 8.4}V${Y(y) + 1.6}" stroke="#E7ECF5" stroke-width="1"/><path d="M${x * 10 + 3.8} ${Y(y) + 1.8}h4.4l-1.2 1.6 1.2 1.6h-4.4z" fill="#FF4F28"/>` })
  nishon.forEach(([x, y]) => { h += `<circle cx="${x * 10 + 5}" cy="${Y(y) + 5}" r="3.6" fill="#8B97AD"/><circle cx="${x * 10 + 5}" cy="${Y(y) + 5}" r="1.4" fill="#F5B82E"/>` })
  if (rak) h += `<path d="M${rak[0] * 10 + 5} ${Y(rak[1]) + 1}c2.2 1.8 2.8 4.2 2.8 6.6v1.6h-5.6v-1.6c0-2.4.6-4.8 2.8-6.6z" fill="#F4F6FB"/><circle cx="${rak[0] * 10 + 5}" cy="${Y(rak[1]) + 5}" r="1.2" fill="#3FA2FF"/>`
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#0F1E3D"/>${h}</svg>`
}
// uch zinapoya (8, 11, 15-qadam): nom — rasmniki, javob aytilmaydi
const POG = {
  rak: [['1', 9, miniKosmos({ rak: [1, 0], bayroq: [[5, 0]] }), 'O‘ngga'], ['2', 7, miniKosmos({ rak: [3, 0], bayroq: [[0, 0], [6, 0]] }), 'Ikki tomonga'], ['3', 5, miniKosmos({ rak: [0, 0], bayroq: [[3, 0]] }), 'Startga'], ['★', 2, miniKosmos({ rak: [3, 0] }), 'Qadam tovushi']],
  oq: [['1', 9, miniKosmos({ iz: [[3, 1, 1]] }), 'Otish'], ['2', 7, miniKosmos({ iz: [[3, 1, 4]] }), 'Uchish'], ['3', 5, miniKosmos({ iz: [[3, 1, 3]] }), 'O‘chish'], ['★', 2, miniKosmos({ iz: [[3, 1, 4], [1, 1, 4]] }), 'Otish tovushi']],
  nishon: [['1', 8, miniKosmos({ nishon: [[1, 4], [4, 3], [6, 4]] }), 'Uch nishon'], ['2', 6, miniKosmos({ nishon: [[0, 2], [3, 2], [6, 2]] }), 'Pastda nishon'], ['3', 4, miniKosmos({ nishon: [0, 1, 2, 3, 4, 5, 6].map((x) => [x, 4]) }), 'Qator'], ['★', 2, miniKosmos({ nishon: [] }), 'O‘z nishonlaringiz']],
}

// huk (2–4-qadam): uch karta — A raketaning o'zi uchadi, B bitta o'q (nusxasiz), C o'q nusxalari (kosmik.js kosmikHuk, data-kosmik)
const HUK = [
  ['A', 'Raketaning o‘zi uchsin', { nat: '✕ raketa ketib qoldi', ok: '0' }, () => `<span class="hk-rs">${RAK()}<span class="hk-ay">↑</span></span><span class="hk-sn">raketa nishonga uchadi</span>`],
  ['B', 'Bitta o‘q chizamiz', { nat: '✕ bir marta otildi', ok: '0' }, () => `<span class="hk-rs">${OQ()}</span><span class="hk-sn">bitta o‘q — bitta otish</span>`],
  ['C', 'O‘qdan nusxa olamiz', { nat: '✓ har safar yangi o‘q', ok: '1' }, () => `<span class="hk-rs hk-c">${OQ()}${OQ('oq-x')}${OQ('oq-x')}</span><span class="hk-sn">har space — yangi nusxa</span>`],
]
const SONI = { A: 4, B: 3, C: 7 }
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const hKartalar = ({ son, nat = false, avto = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}"${avto ? ` data-kosmik="${l}" data-ok="${d.ok}"` : ''} data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}<b>${son[l]}</b></span>` : ''}</div>`).join('')}</div>`

// yangi so'z (5-qadam): uch bo'lak birma-bir — raketa va uning dasturi · o'q va uning dasturi · ikkalasi bitta o'yinda
const perSoz = () => `<div class="xs">
  <div class="xs-b" data-r="1"><span class="xs-d">${RAK()}${mb('k', 'right')}</span><b>Raketa dasturi</b></div>
  <div class="xs-b" data-r="2"><span class="xs-d">${OQ('oq-k')}${mb('k', 'space')}</span><b>O‘q dasturi</b></div>
  <div class="xs-b" data-r="3"><span class="xs-d">${miniKosmos({ nishon: [[1, 4], [5, 4]], iz: [[3, 1, 3]] }, 'xs-mk')}</span><b>Har personajning o‘z dasturi</b></div>
</div>`

// bekatlar (reja tepaligi): raketa · o'q · nishonlar
const RAK_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c3.4 2.8 4.6 6.8 4.6 10.6V17H7.4v-4.4C7.4 8.8 8.6 4.8 12 2z" fill="#fff"/><path d="M7.4 13L4 17.6V20l3.4-1.6zM16.6 13l3.4 4.6V20l-3.4-1.6z" fill="#fff"/></svg>'
const OQ_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9.6" y="2" width="4.8" height="14" rx="2.4" fill="#fff"/><path d="M9.8 18h4.4L12 22z" fill="#fff"/></svg>'
const NISHON_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="12" cy="12" r="3.4" fill="#fff"/></svg>'
const BEKATLAR = [['h', 'Raketa', RAK_OQ], ['g', 'O‘q', OQ_OQ], ['y', 'Nishonlar', NISHON_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · kosmik o‘yin</small><div class="kd3-r lb2">${miniKosmos({ nishon: [[1, 4], [5, 3]], iz: [[3, 1, 3]] }, 'kd-mk')}</div><b>Raketa nishonlarni uradi</b></div>`
const DUSH_RASM = '<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#0F1E3D"/><g transform="translate(26 10) scale(2)"><ellipse cx="12" cy="11.5" rx="10" ry="7.4" fill="#8B5CF6"/><circle cx="8.4" cy="10.6" r="2.6" fill="#fff"/><circle cx="15.6" cy="10.6" r="2.6" fill="#fff"/></g></svg>'
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${DUSH_RASM}</div><b>18 · Kosmik o‘yin 2</b></div>`
// kirish: «O‘tgan darsda» — create clone of myself (klon)
const otganDars = () => `<div class="otd"><small>O‘tgan darsda</small><div class="tf-l"><div class="tf"><div class="tf-r">${mb('C')}</div><div class="tf-t"><b>Klon</b><span>Dastur ishlab turganda yasalgan nusxa</span></div></div></div></div>`

// natija (17, 18-qadam): sonlar kartaning boshida (natijaSon)
const SINF_T = [['h', OQ_OQ, 'ta o‘q otdi', 846], ['g', NISHON_OQ, 'ta nishon urdi', 412], ['y', RAK_OQ, 'pog‘ona bajardi', 121]]
const BOLA_T = [['h', OQ_OQ, 'ta o‘q otdi', 64], ['g', NISHON_OQ, 'ta nishon urdi', 31], ['y', RAK_OQ, 'pog‘ona bajardi', 9]]

// 18-dars «Kosmik o‘yin 2: dushman, ball va jon» — darsning o'z ekran bo'laklari (21.11). Manba: new-junior/manba/018-kosmik-oyin-2.md («Maydon, personajlar va bloklar», «Topshiriqlar»).
// 17-dars qismlarining davomi: «Kosmos» maydoni, raketa (oynachasida qahramon), o'q, personaj kartalari — endi uchta («Dushman» — 16-darsdagi binafsha dushman).
// Sahnadagi sonlar — 12-darsdagi kapsulalar («ball: 0», «jon: 3»). Dushman va o'q nusxalari — dvigatel chizadi (kosmik.js). Sinov: sinov/dvigatel/kosmik2.mjs
const MB = { w: 7, h: 5, daraxt: [], gul: [] }
const md = (m = {}) => ({ ...MB, start: [3, 0], ...m })
const raketa = (yuz) => `<svg viewBox="0 0 80 88" aria-hidden="true"><path d="M40 3c14 11 19 28 19 44v22H21V47C21 31 26 14 40 3z" fill="#F4F6FB"/><path d="M21 50L7 67v10l14-7zM59 50l14 17v10l-14-7z" fill="#FF4F28"/><path d="M28 69h24l-4 8H32z" fill="#0D2137"/><path d="M33 77h14l-7 10z" fill="#FFC93C"/><circle cx="40" cy="37" r="14" fill="#3FA2FF" stroke="#0D2137" stroke-width="3"/>${yuz.replace('<svg ', '<svg x="29" y="25" width="22" height="24" ')}</svg>`
const coddyK = () => raketa(robot({ pose: 'turadi', yuz: 'xursand' }))
const qahK = () => raketa(globalThis.QAH === 'coddy' ? robot({ pose: 'turadi', yuz: 'xursand' }) : hero({ k: globalThis.QAH || 'momiq', mood: 'xursand' }))
const OQ_SVG = '<svg viewBox="0 0 24 20" aria-hidden="true"><rect x="9.2" y="1" width="5.6" height="15" rx="2.8" fill="#FFC93C"/><rect x="10.7" y="3" width="2.6" height="9.5" rx="1.3" fill="#FFF6D6"/><path d="M9.6 16h4.8L12 19.6z" fill="#FF8A3C"/></svg>'
const DUSH_R = '#8B5CF6'
const DUSH_SVG = dushman(DUSH_R)
DARS.klonSvg = OQ_SVG // klon.js: o'q nusxalari rasmi
DARS.dushSvg = DUSH_SVG // kosmik.js: dushman (asl va nusxalar)
const OQ = (cls = '') => `<span class="oqr ${cls}">${OQ_SVG}</span>` // oqr — o'q rasmi; «oq» shablon.html dagi uchayotgan o'q (absolute, animatsiya) bilan to'qnashardi (22.11)
const DUSH = (cls = '') => `<span class="dsh ${cls}">${DUSH_SVG}</span>`
const RAK = (yuz = robot({ pose: 'turadi', yuz: 'xursand' }), cls = '') => `<span class="rak ${cls}">${raketa(yuz)}</span>`
DARS.perRasm = { raketa: `<span class="rak">${raketa('<svg></svg>')}</span>`, oq: OQ(), dushman: DUSH() }
// maydon: dushman (asli tepada, nusxalari), o'qlar — dvigateldagi .kt-asl / .kt-klon bilan bir xil chizma
const kG = (cls, x, y, svg) => `<g class="${cls}" style="transform:${katakJoy(x, MB.h - 1 - y)}">${svg.replace('<svg ', '<svg x="4" y="18" width="72" height="62" ')}</g>`
const maydon = (m, aktyor, { asl = null, dush = [], oq = [] } = {}) => maydonHtml(md(m), { aktyor }).replace('class="katak maydon', 'class="katak maydon kosmos')
  .replace('<g class="kt-q"', (asl ? kG('kt-asl ks-d', asl[0], asl[1], DUSH_SVG) : '') + dush.map(([x, y]) => kG('kt-klon ks-d', x, y, DUSH_SVG)).join('') + oq.map(([x, y]) => kG('kt-klon', x, y, OQ_SVG)).join('') + '<g class="kt-q"')
// sahnadagi sonlar (12-dars kapsulalari): ball, jon — dasturda ishlatilgani ko'rinadi (studiya.js ozgKorinsin)
const OZG = ['ball', 'jon']
const ozgQ = (v = {}, doim = '') => `<div class="gl ball-q" data-z="o‘zgaruvchilar"${doim ? ` data-doim="${doim}"` : ''}>${OZG.map((n) => `<span class="ball-k${n in v ? '' : ' yoq'}" data-v="${n}"><small>${n}:</small><b>${v[n] || 0}</b></span>`).join('')}</div>`
const sanoqK = (n = 0) => `<span class="gl kl-son">Dushman: ${n}</span>`
const tugadiT = () => '<span class="gl oyin-tugadi">O‘yin tugadi</span>'

// dastur ustuni: uch personaj kartasi
const PER = [['raketa', 'Raketa'], ['oq', 'O‘q'], ['dushman', 'Dushman']]
const perQ = (cur = 'dushman') => `<div class="per-q per-3">${PER.map(([id, nom]) => `<span class="per-k${id === cur ? ' on' : ''}" data-p="${id}" role="button"><i>${DARS.perRasm[id]}</i><b>${nom}</b></span>`).join('')}</div>`
const dstP = (chegara, { cur = 'dushman' } = {}) => `<div class="dst" data-z="dastur"><span class="dsb"><b>${{ raketa: 'Raketa', oq: 'O‘q', dushman: 'Dushman' }[cur]} dasturi</b></span>${perQ(cur)}<span class="bosh">Blokni shu yerga ulang</span><small class="dsn">0 ta dasturcha\n0 / ${chegara} ta blok</small></div>`

// kichik kosmos maydoni (zinapoya, reja): raketa, dushmanlar (tepada · tushish izi), o'q izi, kapsula
const miniKosmos = ({ rak = [3, 0], dush = [], iz = [], oq = [], son = '' } = {}, cls = 'mini') => {
  const W = MB.w * 10, H = MB.h * 10, Y = (y) => (MB.h - 1 - y) * 10
  let h = ''
  for (let q = 0; q < MB.h; q++) for (let x = 0; x < MB.w; x++) h += `<rect x="${x * 10 + 0.6}" y="${q * 10 + 0.6}" width="8.8" height="8.8" rx="2" fill="${(x + q) % 2 ? '#243B6B' : '#1E3360'}"/>`
  ;[[1, 3], [5, 2], [0, 1], [6, 4], [4, 1]].forEach(([x, y]) => { h += `<circle cx="${x * 10 + 7}" cy="${Y(y) + 2.6}" r=".7" fill="#fff" opacity=".8"/>` })
  iz.forEach(([x, a, b]) => { h += `<path d="M${x * 10 + 5} ${Y(a) + 5}V${Y(b) + 5}" stroke="${DUSH_R}" stroke-width="1.4" stroke-dasharray="1.4 1.8" stroke-linecap="round" opacity=".7"/>` })
  oq.forEach(([x, a, b]) => { h += `<path d="M${x * 10 + 5} ${Y(a) + 3}V${Y(b) + 7}" stroke="#FFC93C" stroke-width="1.6" stroke-dasharray="1.6 1.8" stroke-linecap="round"/>` })
  dush.forEach(([x, y]) => { h += `<ellipse cx="${x * 10 + 5}" cy="${Y(y) + 5.4}" rx="3.8" ry="2.8" fill="${DUSH_R}"/><circle cx="${x * 10 + 3.6}" cy="${Y(y) + 5}" r=".9" fill="#fff"/><circle cx="${x * 10 + 6.4}" cy="${Y(y) + 5}" r=".9" fill="#fff"/>` })
  if (rak) h += `<path d="M${rak[0] * 10 + 5} ${Y(rak[1]) + 1}c2.2 1.8 2.8 4.2 2.8 6.6v1.6h-5.6v-1.6c0-2.4.6-4.8 2.8-6.6z" fill="#F4F6FB"/><circle cx="${rak[0] * 10 + 5}" cy="${Y(rak[1]) + 5}" r="1.2" fill="#3FA2FF"/>`
  if (son) h += `<rect x="1" y="1" width="${son.length * 3.4 + 4}" height="7" rx="3.5" fill="#fff"/><text x="3" y="6.4" font-size="5.4" font-weight="800" fill="#0D2137" font-family="sans-serif">${son}</text>`
  return `<svg class="${cls} mk" viewBox="-1 -1 ${W + 2} ${H + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${W + 2}" height="${H + 2}" rx="3" fill="#0F1E3D"/>${h}</svg>`
}
// uch zinapoya (8, 11, 15-qadam): nom — rasmniki, javob aytilmaydi
const POG = {
  dush: [['1', 9, miniKosmos({ dush: [[3, 4]], iz: [[3, 4, 1]] }), 'Bitta dushman'], ['2', 7, miniKosmos({ dush: [[3, 4], [3, 2]], iz: [[3, 4, 1]] }), 'Beshta'], ['3', 5, miniKosmos({ dush: [[1, 3], [4, 2], [6, 3]], iz: [[1, 4, 1], [4, 4, 1], [6, 4, 1]] }), 'Har xil ustun'], ['★', 2, miniKosmos({ dush: [[3, 3]], oq: [[3, 1, 2]] }), 'O‘q uradi']],
  ball: [['1', 9, miniKosmos({ dush: [[2, 3]], oq: [[2, 1, 2]], son: 'ball: 1' }), 'Ball'], ['2', 7, miniKosmos({ son: 'ball: 0' }), 'Boshidan 0'], ['3', 5, miniKosmos({ dush: [[4, 3]], oq: [[4, 1, 2]], son: 'ball: 2' }), 'Har dushman — 2 ball'], ['★', 2, miniKosmos({ dush: [[1, 3], [5, 2]], son: 'ball: 8' }), 'Rekord']],
  jon: [['1', 8, miniKosmos({ dush: [[3, 1]], son: 'jon: 2' }), 'Jon'], ['2', 6, miniKosmos({ dush: [[3, 1]], son: 'jon: 0' }), 'O‘yin tugaydi'], ['3', 4, miniKosmos({ dush: [[1, 3], [5, 2]], oq: [[1, 1, 2]], son: 'ball: 3' }), 'To‘liq o‘yin'], ['★', 2, miniKosmos({ dush: [[0, 4], [2, 3], [4, 4], [6, 2]] }), 'O‘z o‘yiningiz']],
}

// huk (2–4-qadam): uch karta — A doskada sanaymiz, B har dushmanga ball bloki, C o'q tegsa — ball +1 (kosmik.js kosmikHuk2, data-kosmik2)
const HUK = [
  ['A', 'Doskada o‘zimiz sanaymiz', { nat: '✕ o‘yin bilmaydi', ok: '0' }, () => `<span class="hk-rs"><span class="hk-dsk">I I I</span></span><span class="hk-sn">ustoz doskada sanaydi</span>`],
  ['B', 'Har dushmanga ball bloki', { nat: '✕ dushman ko‘p — blok ham ko‘p', ok: '0' }, () => `<span class="hk-rs hk-b">${DUSH()}${DUSH()}${DUSH()}${DUSH()}${DUSH()}</span><span class="hk-sn">5 ta dastur · 10 ta blok</span>`],
  ['C', 'O‘q tegsa — ball +1', { nat: '✓ bitta blok — har dushman +1', ok: '1' }, () => `<span class="hk-rs hk-c">${OQ()}<span class="hk-bk"><small>ball:</small> +1</span></span><span class="hk-sn">1 ta blok — hamma dushmanga</span>`],
]
const SONI = { A: 2, B: 4, C: 8 }
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const hKartalar = ({ son, nat = false, avto = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}"${avto ? ` data-kosmik2="${l}" data-ok="${d.ok}"` : ''} data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}<b>${son[l]}</b></span>` : ''}</div>`).join('')}</div>`

// eslaymiz (5-qadam): uch bo'lak birma-bir — klon · o'zgaruvchi · shart
const eslaymiz = () => `<div class="xs">
  <div class="xs-b" data-r="1"><span class="xs-d xs-r">${DUSH()}${DUSH('nus')}${DUSH('nus')}</span><b>Klon — dushmanlar</b></div>
  <div class="xs-b" data-r="2"><span class="xs-d">${ozgQ({ ball: 0, jon: 3 }).replace('class="gl ball-q"', 'class="ball-q xs-q"')}</span><b>O‘zgaruvchi — ball va jon</b></div>
  <div class="xs-b" data-r="3"><span class="xs-d">${mb('i', 'jon:0')}<span class="xs-tg">O‘yin tugadi</span></span><b>Shart — o‘yin tugaydi</b></div>
</div>`

// bekatlar (reja tepaligi): dushman · ball · jon
const DUSH_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="13" rx="9" ry="6.6" fill="#fff"/><circle cx="8.8" cy="12.2" r="2" fill="#0F1E3D"/><circle cx="15.2" cy="12.2" r="2" fill="#0F1E3D"/><path d="M7 7.4L5 4M17 7.4l2-3.4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>'
const BALL_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.1l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9z" fill="#fff"/></svg>'
const JON_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.6s-7.6-4.6-7.6-10.2A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.6 2.8c0 5.6-7.6 10.2-7.6 10.2z" fill="#fff"/></svg>'
const BEKATLAR = [['h', 'Dushman', DUSH_OQ], ['g', 'Ball', BALL_OQ], ['y', 'Jon', JON_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · to‘liq o‘yin</small><div class="kd3-r lb2">${miniKosmos({ dush: [[1, 3], [5, 2]], oq: [[1, 1, 2]], son: 'ball: 3' }, 'kd-mk')}</div><b>Dushman, ball va jon</b></div>`
const KOD_RASM = '<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#0D2137"/><text x="12" y="26" font-size="13" font-weight="700" fill="#FFC93C" font-family="monospace">ball++</text><text x="12" y="46" font-size="13" font-weight="700" fill="#8FD3FF" font-family="monospace">if (jon)</text></svg>'
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${KOD_RASM}</div><b>19 · Bloklar ortidagi kod</b></div>`
// kirish: «O‘tgan darsda» — personaj (raketa va o'q)
const otganDars = () => `<div class="otd"><small>O‘tgan darsda</small><div class="tf-l"><div class="tf"><div class="tf-r">${RAK()}</div><div class="tf-t"><b>Personaj</b><span>O‘yindagi har bir qatnashchi: o‘z rasmi va o‘z dasturi bor</span></div></div></div></div>`

// natija (17, 18-qadam): sonlar kartaning boshida (natijaSon)
const SINF_T = [['h', DUSH_OQ, 'ta dushman urdi', 318], ['g', BALL_OQ, 'ta o‘yin yutdi', 41], ['y', JON_OQ, 'pog‘ona bajardi', 117]]
const BOLA_T = [['h', DUSH_OQ, 'ta dushman urdi', 27], ['g', BALL_OQ, 'ta o‘yin yutdi', 4], ['y', JON_OQ, 'pog‘ona bajardi', 9]]

// 23-dars «Demo Day №1» — darsning o'z ekran bo'laklari (22.11). Manba: new-junior/manba/023-demo-day-1.md. 18–22-dars qismlarining davomi.
// 18-dars qismlarining davomi: «Kosmos» maydoni, raketa (oynachasida qahramon), o'q, dushman, uch personaj kartasi, kapsulalar.
// Yangisi — kod: statik kod qutisi (kodK — kod.js dagi .kodp ko'rinishida), zinapoya uchun kod rasmi (kodRasm). Kod oynasining o'zini dvigatel chizadi (kod.js).
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
// statik kod qatorlari (huk, javob, yangi so'z, xulosa): [[chuqurlik, html, xira?]…] — kod.js qatorlari bilan bir xil belgilar (<em> funksiya, <u> kalit so'z, <s> satr, <b class="kn"> son)
const kq = (h, d = 0, cls = '') => `<div class="kq${cls ? ' ' + cls : ''}" style="--d:${d}"><code>${h}</code></div>`
const kodK = (qatorlar, cls = '') => `<div class="kodk ${cls}">${qatorlar.join('')}</div>`
const K = { mr: '<em>moveRight</em>();', onR: '<em>onKey</em>(<s>"right"</s>, () =&gt; {', yop: '});' }
// zinapoya va reja uchun kichik kod rasmi: qator uzunliklari (rangli chiziqlar), belgilangan qator, son kapsulasi
const kodRasm = ({ q = [[0, 30, 'f'], [1, 22, 'f'], [0, 8, 'x']], yon = -1, son = -1 } = {}, cls = 'mini') => {
  const R = { f: '#FFC93C', k: '#8FD3FF', x: '#5B6B85', s: '#A6E3A1' }
  let h = ''
  q.forEach(([d, w, t], i) => { const y = 6 + i * 9; if (i === yon) h += `<rect x="2" y="${y - 3}" width="66" height="8" rx="2" fill="#FF6B4A" opacity=".35"/>`; h += `<rect x="${6 + d * 6}" y="${y}" width="${w}" height="3" rx="1.5" fill="${R[t] || R.f}"/>`; if (i === son) h += `<rect x="${8 + d * 6 + w}" y="${y - 2.2}" width="9" height="7" rx="3.5" fill="#fff"/>` })
  return `<svg class="${cls} mk" viewBox="0 0 70 ${10 + q.length * 9}" aria-hidden="true"><rect x="0" y="0" width="70" height="${10 + q.length * 9}" rx="4" fill="#0F1E3D"/>${h}</svg>`
}

// ---- loyiha kartasi (21-darsdan; 23-dars faqat o'qiydi): xulosa «Mening o‘yinim» (bola ekranida .kc-mini — kod.js kartaChiz to'ldiradi) ----
const kartaG = (k) => ((DARS.kartaGap || {})[k] || '')
const kartaQ = (nom, v, bor = true) => `<span class="kx-q${bor ? ' ok' : ''}"><small>${nom}</small><b>${bor ? v : '?'}</b></span>`

// Demo Day qoidalari (3-qadam) va uy yo'riqnomasi (9–10-qadam): qatorlar
const qoQator = (n, nom, iz) => `<div class="ty-q"><i>${n}</i><span><b>${nom}</b><small>${iz}</small></span></div>`
const qoidaKarta = () => `<div class="tq-t">${qoQator(1, 'Mehmon o‘ynaydi', 'strelkalar — raketa, probel — o‘q')}${qoQator(2, 'Bola aytib beradi', 'nechta dushman, qanday yutiladi')}${qoQator(3, 'Savolga javob beradi', 'eng qiyin joyi qaysi edi')}</div>`
// «Blok studiya → Scratch» jadvali: uchta blok (hodisa, klon, o'zgaruvchi)
const SCRATCH_J = [['when ▶ clicked', 'when green flag clicked'], ['create clone of myself', 'create clone of myself'], ['change ball by 1', 'change score by 1']]
const uyKarta = () => `<div class="tq-t uy-t">${qoQator(1, 'Scratch saytiga kiring', 'ota-onangizdan ruxsat so‘rang: scratch.mit.edu')}${qoQator(2, 'Yangi loyiha oching', 'bloklar tanish')}${qoQator(3, 'O‘yiningizni o‘zingiz yasang', 'karta bo‘yicha')}</div><div class="uy-j"><small>Blok studiya → Scratch</small>${SCRATCH_J.map(([a, b]) => `<span class="uy-q"><code>${a}</code><i>→</i><code>${b}</code></span>`).join('')}</div>`

// bekatlar (reja tepaligi): tayyorlanamiz · ko'rsatamiz · uyga olib ketamiz
const BALL_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.1l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9z" fill="#fff"/></svg>'
const JON_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.6s-7.6-4.6-7.6-10.2A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.6 2.8c0 5.6-7.6 10.2-7.6 10.2z" fill="#fff"/></svg>'
const TAYYOR_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const KORSAT_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.4 10-6.4S22 12 22 12s-3.6 6.4-10 6.4S2 12 2 12z" fill="#fff"/><circle cx="12" cy="12" r="3.4" fill="#0F1E3D"/></svg>'
const UY_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5L12 4l9 7.5V20H3z" fill="#fff"/><rect x="9.5" y="13" width="5" height="7" fill="#0F1E3D"/></svg>'
const BEKATLAR = [['h', 'Tayyorlanamiz', TAYYOR_OQ], ['g', 'Ko‘rsatamiz', KORSAT_OQ], ['y', 'Uyga olib ketamiz', UY_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · uy yo‘riqnomasi</small><div class="kd3-r lb2">${miniKosmos({ dush: [[1, 3], [5, 2]], oq: [[1, 1, 2]], son: 'ball: 3' }, 'kd-mk')}</div><b>Uyda davom eting</b></div>`
const AI_RASM = '<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#0F1E3D"/><rect x="26" y="14" width="48" height="36" rx="10" fill="#E6ECF5"/><circle cx="40" cy="30" r="5" fill="#0F1E3D"/><circle cx="60" cy="30" r="5" fill="#0F1E3D"/><path d="M42 41h16" stroke="#0F1E3D" stroke-width="3" stroke-linecap="round"/><path d="M50 14V8" stroke="#E6ECF5" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="7" r="3" fill="#FFC93C"/></svg>'
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${AI_RASM}</div><b>24 · Sun‘iy intellekt (AI) nima</b></div>`
// kirish: «O‘tgan darsda» — taqdimot
const otganDars = () => `<div class="otd"><small>O‘tgan darsda</small><div class="tf-l"><div class="tf"><div class="tf-r otd-k">${kartaQ('Dushmanlar', 5)}${kartaQ('Jon', 3)}</div><div class="tf-t"><b>Taqdimot</b><span>Mening o‘yinim, qanday yutiladi, eng qiyin joyi</span></div></div></div></div>`

// zinapoyalar: 1-bekat (oxirgi sinov — bitta pog'ona), 2-bekat (mehmon), 3-bekat (yo'riqnoma — bitta pog'ona)
const POG = {
  sinov: [['1', 9, miniKosmos({ dush: [[1, 3], [5, 2]], oq: [[1, 1, 2]], son: 'ball: 4' }), 'Oxirgi sinov']],
  mehmon: [['1', 9, miniKosmos({ rak: [2, 0], dush: [[4, 3]], son: 'ball: 2' }), 'Mehmon o‘ynadi'], ['★', 4, miniKosmos({ dush: [[1, 3], [5, 2]], oq: [[1, 1, 2]], son: 'ball: 6' }), 'Mehmon yutdi']],
  yoriq: [['1', 9, kodRasm({ q: [[0, 30, 'f'], [0, 22, 'k'], [0, 26, 'f']] }), 'Yo‘riqnoma']],
}

// natija (11, 12-qadam): sonlar kartaning boshida (natijaSon)
const SINF_T = [['h', BALL_OQ, 'ta o‘yin tugadi', 28], ['g', KORSAT_OQ, 'ta mehmon yutdi', 17], ['y', JON_OQ, 'pog‘ona bajardi', 56]]
const BOLA_T = [['h', BALL_OQ, 'ta o‘yin tugadi', 1], ['g', KORSAT_OQ, 'ta mehmon yutdi', 1], ['y', JON_OQ, 'pog‘ona bajardi', 4]]

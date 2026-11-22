// 19-dars «Bloklar ortidagi kod» — darsning o'z ekran bo'laklari (22.11). Manba: new-junior/manba/019-bloklar-ortidagi-kod.md («Studiya: Kodini ko'rsat va kod», «Topshiriqlar»).
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

// huk (2–4-qadam): uch karta — dasturni yozuv bilan: A «o‘ngga yur», B «→», C moveRight(); (kod.js kodHuk, data-kodh, data-yoz)
const HUK = [
  ['A', 'o‘ngga yur', { nat: '✕ kompyuter bu so‘zni bilmaydi', ok: '0', yoz: 'o‘ngga yur' }, () => `<span class="hk-rs">${kodK([kq('o‘ngga yur')], 'hk-kod')}</span><span class="hk-sn">o‘zbekcha gap</span>`],
  ['B', '→', { nat: '✕ belgi — buyruq emas', ok: '0', yoz: '→' }, () => `<span class="hk-rs">${kodK([kq('→')], 'hk-kod')}</span><span class="hk-sn">strelka belgisi</span>`],
  ['C', 'moveRight();', { nat: '✓ raketa yurdi', ok: '1', yoz: 'moveRight();' }, () => `<span class="hk-rs">${kodK([kq(K.mr)], 'hk-kod')}</span><span class="hk-sn">JavaScript qatori</span>`],
]
const SONI = { A: 3, B: 2, C: 9 }
const PIK_R = { A: 'c1', B: 'c2', C: 'c3' }
const hKartalar = ({ son, nat = false, avto = false } = {}) => `<div class="jv dkv hkv">${HUK.map(([l, t, d, rasm]) => `<div class="jk ${PIK_R[l]}${nat ? (l === 'C' ? ' n-ok' : ' n-yoq') : ''}"${avto ? ` data-kodh="${l}" data-yoz="${d.yoz}" data-ok="${d.ok}"` : ''} data-nat="${d.nat}"><span class="jt"><span><b>${l}</b><q>${t}</q></span>${nat ? `<small class="jn">${d.nat}</small>` : ''}</span><div class="hk-r">${rasm()}</div>${son ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}<b>${son[l]}</b></span>` : ''}</div>`).join('')}</div>`

// yangi so'z (5-qadam): uch bo'lak birma-bir — blok · qator · bitta dastur ikki ko'rinishda
const kodSoz = () => `<div class="xs">
  <div class="xs-b" data-r="1"><span class="xs-d">${mb('r')}</span><b>Blok</b></div>
  <div class="xs-b" data-r="2"><span class="xs-d">${kodK([kq(K.mr)], 'xs-kod')}</span><b>Qator</b></div>
  <div class="xs-b" data-r="3"><span class="xs-d xs-ikki"><span class="xs-bl">${mb('k', 'right')}${mb('r')}</span>${kodK([kq(K.onR), kq(K.mr, 1), kq(K.yop, 0, 'xira-q')], 'xs-kod')}</span><b>Bitta dastur — ikki ko‘rinish</b></div>
</div>`

// bekatlar (reja tepaligi): blok va qator · kodda son · kodni o'qiymiz
const BLOK_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h5l1.4 1.6h5.2L16 7h5v10H3z" fill="#fff"/></svg>'
const SON_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="6" fill="#fff"/><text x="12" y="16" text-anchor="middle" font-size="9" font-weight="800" fill="#0F1E3D" font-family="monospace">5</text></svg>'
const KOZ_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.4 10-6.4S22 12 22 12s-3.6 6.4-10 6.4S2 12 2 12z" fill="#fff"/><circle cx="12" cy="12" r="3.4" fill="#0F1E3D"/></svg>'
const BEKATLAR = [['h', 'Blok va qator', BLOK_OQ], ['g', 'Kodda son', SON_OQ], ['y', 'Kodni o‘qiymiz', KOZ_OQ]]
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida · kodni o‘qiysiz</small><div class="kd3-r lb2">${kodRasm({ q: [[0, 26, 'k'], [1, 20, 'f'], [1, 24, 'f'], [0, 6, 'x']], yon: 2 }, 'kd-mk')}</div><b>Bloklar ortida — kod</b></div>`
const TEST_RASM = '<svg class="kd-xy" viewBox="0 0 100 64" aria-hidden="true"><rect x="0" y="0" width="100" height="64" rx="6" fill="#FFFFFF" stroke="#D6DCE6" stroke-width="2"/><circle cx="18" cy="20" r="6" fill="#3FAE6A"/><path d="M15 20l2.2 2.2 4-4.4" stroke="#fff" stroke-width="1.8" fill="none"/><rect x="30" y="17" width="54" height="6" rx="3" fill="#C9D3E3"/><circle cx="18" cy="42" r="6" fill="#D6DCE6"/><rect x="30" y="39" width="44" height="6" rx="3" fill="#C9D3E3"/></svg>'
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb2">${TEST_RASM}</div><b>20 · Takrorlash va test</b></div>`
// kirish: «O‘tgan darsda» — kosmik o'yin tayyor (uch personaj)
const otganDars = () => `<div class="otd"><small>O‘tgan darsda</small><div class="tf-l"><div class="tf"><div class="tf-r otd-3">${RAK()}${OQ('oq-k')}${DUSH()}</div><div class="tf-t"><b>Kosmik o‘yin</b><span>Kosmik o‘yin tayyor bo‘ldi</span></div></div></div></div>`

// uch zinapoya (8, 11, 15-qadam): nom — rasmniki, javob aytilmaydi
const POG = {
  kod: [['1', 9, kodRasm({ q: [[0, 30, 'k'], [1, 18, 'f'], [0, 6, 'x']] }), 'Kodni oching'], ['2', 7, kodRasm({ q: [[0, 30, 'k'], [1, 18, 'f'], [1, 22, 'f'], [0, 6, 'x']], yon: 2 }), 'Qaysi qator?'], ['3', 5, kodRasm({ q: [[0, 26, 'k'], [1, 20, 'f'], [0, 6, 'x']], yon: 1 }), 'Qaysi blok?'], ['★', 2, kodRasm({ q: [[0, 30, 'k'], [1, 18, 'f'], [1, 26, 's'], [0, 6, 'x']], yon: 2 }), 'Yangi qator']],
  son: [['1', 9, miniKosmos({ dush: [[0, 4], [2, 3], [4, 4], [6, 3]] }), 'Ko‘p dushman'], ['2', 7, miniKosmos({ dush: [[2, 3]], oq: [[2, 1, 2]], son: 'ball: 2' }), 'Ikki ball'], ['3', 5, miniKosmos({ son: 'jon: 5' }), 'Ko‘proq jon'], ['★', 2, kodRasm({ q: [[0, 30, 'k'], [1, 22, 'f'], [1, 20, 'f'], [0, 6, 'x']], son: 1 }), 'O‘z sonlaringiz']],
  oqi: [['1', 8, kodRasm({ q: [[0, 20, 'f'], [0, 22, 'f'], [0, 22, 'f'], [0, 16, 'f']] }), 'Ikki qadam'], ['2', 6, kodRasm({ q: [[0, 20, 'f'], [0, 30, 'k'], [1, 22, 'f'], [0, 6, 'x']] }), 'Takrorlash'], ['3', 4, kodRasm({ q: [[0, 20, 'f'], [0, 30, 'k'], [1, 20, 'f'], [0, 6, 'x'], [0, 16, 'f']] }), 'Orqaga'], ['★', 2, miniKosmos({ rak: [0, 0], son: '★ (5, 1)' }), 'Nishonga']],
}

// natija (17, 18-qadam): sonlar kartaning boshida (natijaSon)
const SINF_T = [['h', BLOK_OQ, 'ta qatorni topdi', 96], ['g', SON_OQ, 'ta sonni o‘zgartirdi', 58], ['y', KOZ_OQ, 'pog‘ona bajardi', 117]]
const BOLA_T = [['h', BLOK_OQ, 'ta qatorni topdi', 7], ['g', SON_OQ, 'ta sonni o‘zgartirdi', 4], ['y', KOZ_OQ, 'pog‘ona bajardi', 9]]

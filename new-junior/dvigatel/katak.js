// Katak sahnasi (labirint) — chizma (dvigatel 5a, 19.11; KONSEPSIYA 99-qaror: tepadan qaralgan bog'). Faqat satr qaytaradi, DOM'ga tegmaydi.
// yigish.mjs bu faylni IKKI joyga qo'shadi: chizuvchiga (ekranlar oldindan chiziladi) va brauzer skriptiga (sahna.js katak markazlarini shu yerdan oladi;
// sinov ham labirintni shu funksiya bilan chizadi). Ikki joyda ham bitta fayl — labirint manbasi bitta.
// Xarita — qatorlar ro'yxati, tepadan pastga: '#' buta (devor), '.' yo'lka, 'S' start, '*' yulduz, 'K' kalit, 'E' eshik (kalitsiz yopiq).
// Butun labirint bitta SVG (viewBox — katak 100 birlik): oynaga o'zi sig'adi, o'lchash kerak emas. url(#…) havola ishlatilmaydi — ustoz va
// bola oynasi yonma-yon ochilganda bir xil nom ikki marta bo'ladi va yashirin oynadagi gradient yo'qolishi mumkin.
// Qahramon — .kt-q guruhi (sahna.js uni transform bilan katakdan katakka suradi); uning ichida kalit belgisi (kalit olinganda ko'rinadi).
const KT = 100, KT_CHET = 22
function katakXarita(x) { return Array.isArray(x) ? x : String(x || '').split('|') }
function katakTop(xr, belgi) { for (let y = 0; y < xr.length; y++) { const x = xr[y].indexOf(belgi); if (x >= 0) return [x, y] } return null }
// qahramon katak markazidan: oyog'i markazdan biroz pastda, boshi tepadagi katakka biroz chiqadi
function katakJoy(x, y) { return 'translate(' + (x * KT + 10) + 'px,' + (y * KT - 14) + 'px)' }
const KT_YULDUZ = 'M0,-1 L.29,-.4 .95,-.31 .48,.15 .59,.81 0,.5 -.59,.81 -.48,.15 -.95,-.31 -.29,-.4Z'
const KT_KALIT = '<g class="kt-kb"><circle cx="-9" cy="0" r="9" fill="#F5B82E" stroke="#B9800C" stroke-width="3"/><circle cx="-9" cy="0" r="3.4" fill="#FBF0D2"/><path d="M0 -3.2H20V3.2H0Z M12 3.2V10H17V3.2Z" fill="#F5B82E" stroke="#B9800C" stroke-width="2.4" stroke-linejoin="round"/></g>'
// buta (devor), kalit va eshik chizmasi — katak labirinti va maydon (9-dars) uchun bitta manba; x, y — ichki katak (qator tepadan)
const ktButa = (X, Y) => '<g transform="translate(' + X + ' ' + Y + ')"><rect x="4" y="5" width="92" height="90" rx="30" fill="#3E8E4E"/>'
  + '<circle cx="31" cy="34" r="15" fill="#4FA35D"/><circle cx="67" cy="38" r="14" fill="#4FA35D"/><circle cx="36" cy="68" r="14" fill="#47995A"/><circle cx="68" cy="70" r="13" fill="#47995A"/>'
  + '<circle cx="30" cy="27" r="7" fill="#8CD48F" opacity=".6"/><path d="M14 80Q50 98 86 80" fill="none" stroke="#2E6E3C" stroke-width="5" stroke-linecap="round" opacity=".45"/></g>'
const ktKalit = (x, y) => '<g class="kt-kalit" data-k="' + x + ',' + y + '" transform="translate(' + (x * KT + 52) + ' ' + (y * KT + 54) + ') rotate(-24) scale(1.5)">' + KT_KALIT + '</g>'
const ktEshik = (x, y) => '<g class="kt-eshik" data-k="' + x + ',' + y + '" transform="translate(' + x * KT + ' ' + y * KT + ')"><g class="kt-ev"><rect x="8" y="10" width="84" height="80" rx="8" fill="#B5793F" stroke="#7A4B22" stroke-width="4"/>'
  + '<path d="M29 12V88M50 12V88M71 12V88" stroke="#8E5A2B" stroke-width="5"/><rect x="38" y="40" width="24" height="22" rx="5" fill="#E7CA66" stroke="#7A4B22" stroke-width="3"/><path d="M43 41V35A7 7 0 0 1 57 35V41" fill="none" stroke="#7A4B22" stroke-width="3.4"/><circle cx="50" cy="50" r="3.2" fill="#7A4B22"/></g></g>'
function katakHtml(xarita, o) {
  o = o || {}
  const xr = katakXarita(xarita), kr = xr.length, kq = Math.max(...xr.map((s) => s.length))
  const s = katakTop(xr, 'S') || [0, kr - 1]
  const W = kq * KT, H = kr * KT, c = (x, y) => (xr[y] || '')[x] || '#'
  let yol = '', buta = '', narsa = ''
  for (let y = 0; y < kr; y++) for (let x = 0; x < kq; x++) {
    const b = c(x, y), X = x * KT, Y = y * KT
    if (b === '#') { buta += ktButa(X, Y); continue }
    const fon = b === 'S' ? '#D6E8FA' : b === '*' ? '#F8E3A0' : '#F7EACB'
    yol += '<rect class="kt-c" data-k="' + x + ',' + y + '" x="' + (X + 4) + '" y="' + (Y + 4) + '" width="92" height="92" rx="18" fill="' + fon + '"/>'
      + '<ellipse cx="' + (X + 26) + '" cy="' + (Y + 30) + '" rx="4" ry="2.8" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 70) + '" cy="' + (Y + 66) + '" rx="4.4" ry="3" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 50) + '" cy="' + (Y + 52) + '" rx="3" ry="2" fill="#C9AE78" opacity=".3"/>'
    if (b === '*') narsa += '<g class="kt-yul" transform="translate(' + (X + 50) + ' ' + (Y + 52) + ') scale(30)"><path d="' + KT_YULDUZ + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07" stroke-linejoin="round"/></g>'
    if (b === 'K') narsa += ktKalit(x, y)
    if (b === 'E') narsa += ktEshik(x, y)
  }
  return '<div class="katak" data-z="sahna" data-xarita="' + xr.join('|') + '">'
    + '<svg class="kt" viewBox="' + (-KT_CHET) + ' ' + (-KT_CHET) + ' ' + (W + 2 * KT_CHET) + ' ' + (H + 2 * KT_CHET) + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
    + '<rect x="' + (-KT_CHET / 2) + '" y="' + (-KT_CHET / 2) + '" width="' + (W + KT_CHET) + '" height="' + (H + KT_CHET) + '" rx="26" fill="#9AD57C" opacity=".55"/>'
    + yol + '<g class="kt-iz"></g>' + narsa + '<g class="kt-butalar">' + buta + '</g>'
    // qahramon o'z SVG'si bilan (sinfi saqlanadi — nafas, ko'z qisish harakati); o'lchami uslubda: .katak .kt-q > svg
    + '<g class="kt-q" style="transform:' + katakJoy(s[0], s[1]) + '">' + (o.aktyor || '').replace('<svg ', '<svg x="0" y="0" width="80" height="88" ')
    + '<g class="kt-qk" transform="translate(70 66) rotate(-24) scale(1.05)">' + KT_KALIT + '</g></g>'
    + '</svg></div>'
}

// ===== Maydon (3-dars, 20.11; manba 003-koordinata «Maydon va manzillar») — katak sahnasining devorsiz turi, X va Y o'qlari bilan =====
// Koordinata (x, y): boshi pastki chap katak (0, 0), X o'ngga, Y TEPAGA. Ichkarida (data-k, sahna.js) — katak.js tartibi: ustun va qator (tepadan pastga);
// aylantirish: qator = bo'y - 1 - y. Xarita belgilari: '.' yo'lka, 'S' start, '*' yulduz, 'O' olma — devor yo'q, maydondan tashqari — chet.
// m = { w, h, start: [x, y], yulduz: [x, y] | null, yashirin, olma: [[x, y]…], daraxt: [[x, y]…], gul: [[x, y]…], belgi: [[x, y, kostyum]…] (7-dars) } — hammasi (x, y) da.
// o.kostyum (7-dars) — { xotirjam: svg, xursand: svg, … }: qahramonning hamma kostyumi oldindan chiziladi, faqat bittasi ko'rinadi (sahna.js kostyumKor)
function mdKostyumlar(ks) { return Object.keys(ks).map((n, i) => '<g class="kos" data-kos="' + n + '"' + (i ? ' style="display:none"' : '') + '>' + ks[n].replace('<svg ', '<svg x="0" y="0" width="80" height="88" ') + '</g>').join('') }
// o = { aktyor, joy: [x, y] (qahramon startda bo'lmasa), yorliqsiz, yorliqR (yorliq shu raqamda yonadi), izlar (move yo'li — katakma-katak), goIz (go to manzillari), bant: [{ ust: x, r } | { qat: y, r } | { kes: [x, y], r }], bayroq: [x, y], yon: [[x, y]…], izlar: [[x, y]…] }
//   bant — o'qqacha yonadigan ustun/qator, kesishgan katak yoki butun o'q ({ oqX: true } / { oqY: true }); r bo'lsa — data-r (studiya.js «raqam» ishi
//          birma-bir yoqadi), bo'lmasa doim ko'rinadi. O'q soni ham shu bant bilan birga oltin bo'ladi (eng kichik r). yon — huk kartasi yoqqan kataklar
const MD_CH = 74, MD_TEPA = 62, MD_ONG = 96 // chapda Y sonlari, pastda X sonlari, tepada «Y ↑», o'ngda «X →»
const mdQ = (m, y) => m.h - 1 - y // y → ichki qator
function maydonXarita(m) {
  const r = Array.from({ length: m.h }, () => Array(m.w).fill('.'))
  ;(m.olma || []).forEach(([x, y]) => { r[mdQ(m, y)][x] = 'O' })
  ;(m.oltin || []).forEach(([x, y]) => { r[mdQ(m, y)][x] = 'G' }) // 11-dars: oltin olma
  ;(m.kaktus || []).forEach(([x, y]) => { r[mdQ(m, y)][x] = 'C' }) // 12-dars: kaktus (o'tib bo'lmaydi, tegsa — hodisa)
  ;(m.devor || []).forEach(([x, y]) => { r[mdQ(m, y)][x] = '#' }) // 9-dars: labirint maydonda — devor, kalit, eshik
  if (m.kalit) r[mdQ(m, m.kalit[1])][m.kalit[0]] = 'K'
  if (m.eshik) r[mdQ(m, m.eshik[1])][m.eshik[0]] = 'E'
  if (m.yulduz) r[mdQ(m, m.yulduz[1])][m.yulduz[0]] = '*'
  if (m.start) r[mdQ(m, m.start[1])][m.start[0]] = 'S'
  return r.map((q) => q.join('')).join('|')
}
// 10-dars: xarita satri (tepadan pastga, '#' '.' 'S' '*' 'K' 'E') → maydon e'loni (maydonHtml) — labirint yasash va darajalar brauzerda qayta chiziladi
function mdXaritaM(s) {
  const r = katakXarita(s), h = r.length, m = { w: Math.max(...r.map((q) => q.length)), h, start: [0, 0], devor: [], labirint: true }
  r.forEach((q, i) => [...q].forEach((c, x) => { const y = h - 1 - i; if (c === '#') m.devor.push([x, y]); if (c === '*') m.yulduz = [x, y]; if (c === 'K') m.kalit = [x, y]; if (c === 'E') m.eshik = [x, y]; if (c === 'S') m.start = [x, y] }))
  return m
}
const MD_DARAXT = '<ellipse cx="0" cy="34" rx="30" ry="9" fill="#2E6E3C" opacity=".22"/><rect x="-6" y="6" width="12" height="28" rx="5" fill="#8A5A2E"/>'
  + '<circle cx="0" cy="-10" r="27" fill="#3E8E4E"/><circle cx="-15" cy="2" r="17" fill="#47995A"/><circle cx="15" cy="0" r="18" fill="#4FA35D"/><circle cx="-8" cy="-22" r="10" fill="#8CD48F" opacity=".55"/>'
const MD_GUL = (c) => '<circle r="5.5" fill="' + c + '"/><circle cx="-7" cy="0" r="5" fill="' + c + '"/><circle cx="7" cy="0" r="5" fill="' + c + '"/><circle cx="0" cy="-7" r="5" fill="' + c + '"/><circle cx="0" cy="7" r="5" fill="' + c + '"/><circle r="3.6" fill="#FFE08A"/>'
const MD_OLMA = '<g transform="translate(-24 -26) scale(2.1)"><path d="M12 8c-.6-2.4-2.6-3.6-2.6-3.6" fill="none" stroke="#6B4423" stroke-width="1.7" stroke-linecap="round"/><path d="M12.6 6.6c1.4-2.4 4.4-2.4 4.4-2.4-.4 2.4-2.6 3.2-4.4 2.4z" fill="#4CB050"/><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#F0435A"/><ellipse cx="8.6" cy="11.8" rx="1.3" ry="2.1" fill="#fff" opacity=".5"/></g>'
// 11-dars: oltin olma — o'sha olma, oltin rangda, yaltirash bilan (oddiy olmadek teriladi: .kt-olma)
const MD_OLMA_G = MD_OLMA.replace('fill="#F0435A"', 'fill="#F5B82E" stroke="#C98A0E" stroke-width=".7"').replace('</g>', '<path d="M17.6 3.2l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" fill="#FFF6C9"/></g>')
// 12-dars: kaktus — yashil, ikki qo'li, tikanlari; tuvakda
const MD_KAKTUS = '<g class="kt-kak-r"><ellipse cx="0" cy="38" rx="24" ry="6" fill="#2E6E3C" opacity=".22"/><path d="M-15 24h30l-4 14h-22z" fill="#C46A3A"/><rect x="-17" y="20" width="34" height="7" rx="2.5" fill="#D98250"/>'
  + '<rect x="-9" y="-30" width="18" height="52" rx="9" fill="#3FA65A"/><path d="M-9 2h-8a7 7 0 0 1-7-7v-12" stroke="#3FA65A" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M9 -6h8a7 7 0 0 0 7-7v-10" stroke="#3FA65A" stroke-width="9" fill="none" stroke-linecap="round"/>'
  + '<path d="M-3 -22l-4-2M3 -12l4-2M-3 -2l-4-2M3 8l4-2M-3 14l-4-2M-24 -14l-4-1M24 -18l4-1" stroke="#1F6B33" stroke-width="2" stroke-linecap="round"/><path d="M-2 -26v44" stroke="#5CC478" stroke-width="3" stroke-linecap="round" opacity=".55"/></g>'
// 13-dars: savat — yerda kichik to'qima savat (olma tushishi kerak bo'lgan katak); g — guruh raqami (8 · ★: «1», «2»)
const MD_SAVAT = '<g class="kt-savat-r"><ellipse cx="0" cy="30" rx="30" ry="7" fill="#6B4A2B" opacity=".18"/><path d="M-30 4h60l-7 26h-46z" fill="#C9955A" stroke="#8A5A2E" stroke-width="2.4" stroke-linejoin="round"/><path d="M-27 13h54M-25 21h50M-14 5l-3 24M0 5v24M14 5l3 24" stroke="#8A5A2E" stroke-width="1.6" opacity=".55"/><path d="M-24 4c4-14 44-14 48 0" fill="none" stroke="#8A5A2E" stroke-width="3" stroke-linecap="round"/></g>'
const MD_BAYROQ = '<g class="kt-bayroq"><path d="M-10 34V-36" stroke="#5A3B1E" stroke-width="5" stroke-linecap="round"/><path d="M-8 -36L30 -24L-8 -10Z" fill="#FF4F28" stroke="#C7381A" stroke-width="2.4" stroke-linejoin="round"/><ellipse cx="-10" cy="35" rx="10" ry="3.6" fill="#5A3B1E" opacity=".3"/></g>'
const mdYorliq = (x, y) => '(' + x + ', ' + y + ')'
function maydonHtml(m, o) {
  o = o || {}
  const W = m.w * KT, H = m.h * KT, s = m.start || [0, 0]
  let yol = '', bezak = '', narsa = '', bant = ''
  // 9-dars (m.devor): labirint maydon — butalar devor, qolgan kataklar 2- va 8-darsdagi toshli yo'lka (start — ko'kish, yulduz — oltin)
  const lab = !!(m.labirint || (m.devor && m.devor.length)), dv = (x, y) => (m.devor || []).some(([a, c]) => a === x && c === y)
  let buta = ''
  for (let q = 0; q < m.h; q++) for (let x = 0; x < m.w; x++) {
    const X = x * KT, Y = q * KT, y = m.h - 1 - q
    if (lab && dv(x, y)) { buta += ktButa(X, Y); continue }
    const fon = lab ? (x === s[0] && y === s[1] ? '#D6E8FA' : m.yulduz && x === m.yulduz[0] && y === m.yulduz[1] ? '#F8E3A0' : '#F7EACB') : (x + y) % 2 ? '#F7EACB' : '#F3E3BE', rs = (m.rasm || []).some(([a, c]) => a === x && c === y)
    yol += '<rect class="kt-c' + (rs ? ' md-rasm' : '') + '" data-k="' + x + ',' + q + '" x="' + (X + 4) + '" y="' + (Y + 4) + '" width="92" height="92" rx="18" fill="' + fon + '"/>'
    if (lab) yol += '<ellipse cx="' + (X + 26) + '" cy="' + (Y + 30) + '" rx="4" ry="2.8" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 70) + '" cy="' + (Y + 66) + '" rx="4.4" ry="3" fill="#C9AE78" opacity=".35"/><ellipse cx="' + (X + 50) + '" cy="' + (Y + 52) + '" rx="3" ry="2" fill="#C9AE78" opacity=".3"/>'
  }
  if (m.kalit) narsa += ktKalit(m.kalit[0], mdQ(m, m.kalit[1]))
  if (m.eshik) narsa += ktEshik(m.eshik[0], mdQ(m, m.eshik[1]))
  ;(m.gul || []).forEach(([x, y], i) => { bezak += '<g transform="translate(' + (x * KT + 78) + ' ' + (mdQ(m, y) * KT + 80) + ') scale(.9)">' + MD_GUL(['#F07AA8', '#FFFFFF', '#B58CF5'][i % 3]) + '</g>' })
  // 7-dars: kostyum belgisi — katakda kostyum nomi (qahramon shu katakdan shu kostyumda chiqishi kerak)
  ;(m.belgi || []).forEach(([x, y, nom]) => { bezak += '<g class="md-belgi" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 84) + ')"><rect x="-40" y="-13" width="80" height="26" rx="13"/><text y="6">' + (nom === 'oylanadi' ? 'o‘ylanadi' : nom) + '</text></g>' })
  ;(m.daraxt || []).forEach(([x, y]) => { bezak += '<g class="md-d" transform="translate(' + (x * KT + 30) + ' ' + (mdQ(m, y) * KT + 34) + ') scale(.78)">' + MD_DARAXT + '</g>' })
  ;(m.savat || []).forEach(([x, y, g]) => { bezak += '<g class="kt-savat" data-k="' + x + ',' + mdQ(m, y) + '" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 56) + ')">' + MD_SAVAT + (g ? '<g class="kt-sg" transform="translate(26 -30)"><circle r="13"/><text y="6">' + g + '</text></g>' : '') + '</g>' })
  ;(m.kaktus || []).forEach(([x, y]) => { narsa += '<g class="kt-kaktus" data-k="' + x + ',' + mdQ(m, y) + '" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 48) + ')">' + MD_KAKTUS + '</g>' })
  ;(m.oltin || []).forEach(([x, y]) => { narsa += '<g class="kt-olma oltin" data-k="' + x + ',' + mdQ(m, y) + '" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 52) + ')">' + MD_OLMA_G + '</g>' })
  ;(m.olma || []).forEach(([x, y]) => { narsa += '<g class="kt-olma" data-k="' + x + ',' + mdQ(m, y) + '" transform="translate(' + (x * KT + 50) + ' ' + (mdQ(m, y) * KT + 52) + ')">' + MD_OLMA + '</g>' })
  if (m.yulduz) narsa += '<g class="kt-yul' + (m.yashirin ? ' yashirin' : '') + '" transform="translate(' + (m.yulduz[0] * KT + 50) + ' ' + (mdQ(m, m.yulduz[1]) * KT + 52) + ') scale(30)"><path d="' + KT_YULDUZ + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07" stroke-linejoin="round"/></g>'
  ;(o.yon || []).forEach(([x, y]) => { narsa += '<rect class="md-yon" x="' + (x * KT + 6) + '" y="' + (mdQ(m, y) * KT + 6) + '" width="88" height="88" rx="16"/>' })
  if (o.bayroq) narsa += '<g class="md-bq" transform="translate(' + (o.bayroq[0] * KT + 50) + ' ' + (mdQ(m, o.bayroq[1]) * KT + 52) + ')">' + MD_BAYROQ + '</g>'
  // o'qqacha yonadigan bantlar: ustun — katakdan pastdagi X soniga, qator — katakdan chapdagi Y soniga
  const nR = { x: {}, y: {} }, nQoy = (o2, i, r) => { if (r == null) r = 0; if (nR[o2][i] == null || r < nR[o2][i]) nR[o2][i] = r }
  ;(o.bant || []).forEach((b) => {
    const r = b.r != null ? ' data-r="' + b.r + '"' : ''
    if (b.oqX) { bant += '<rect class="md-bant md-oqb"' + r + ' x="-8" y="' + (H + 14) + '" width="' + (W + 16) + '" height="52" rx="26"/>'; for (let i = 0; i < m.w; i++) nQoy('x', i, b.r) }
    if (b.oqY) { bant += '<rect class="md-bant md-oqb"' + r + ' x="-62" y="-8" width="52" height="' + (H + 16) + '" rx="26"/>'; for (let i = 0; i < m.h; i++) nQoy('y', i, b.r) }
    if (b.ust != null) nQoy('x', b.ust, b.r)
    if (b.qat != null) nQoy('y', b.qat, b.r)
    if (b.ust != null) { const q0 = b.dan != null ? mdQ(m, b.dan) : 0; bant += '<rect class="md-bant"' + r + ' x="' + (b.ust * KT + 14) + '" y="' + (q0 * KT + 14) + '" width="72" height="' + (H - q0 * KT + 40) + '" rx="36"/>' }
    if (b.qat != null) { const x1 = b.gacha != null ? b.gacha : m.w - 1; bant += '<rect class="md-bant"' + r + ' x="' + (-52) + '" y="' + (mdQ(m, b.qat) * KT + 14) + '" width="' + (x1 * KT + 86 + 52) + '" height="72" rx="36"/>' }
    // kes.yur (4-dars, 5-qadam) — raqam yonganda qahramon shu katakka bir sakraydi (studiya.js raqamBosish); yorlig'ini qahramon o'zi ko'rsatadi
    if (b.kes && b.yur) bant += '<g class="md-kes"' + r + ' data-yur="' + b.kes[0] + ',' + b.kes[1] + '" transform="translate(' + (b.kes[0] * KT + 50) + ' ' + (mdQ(m, b.kes[1]) * KT + 52) + ')"><rect x="-46" y="-46" width="92" height="92" rx="18"/></g>'
    else if (b.kes) bant += '<g class="md-kes"' + r + ' transform="translate(' + (b.kes[0] * KT + 50) + ' ' + (mdQ(m, b.kes[1]) * KT + 52) + ')"><rect x="-46" y="-46" width="92" height="92" rx="18"/>' + (b.yulduz ? '<path transform="scale(30)" d="' + KT_YULDUZ + '" fill="#F5B82E" stroke="#C98A0E" stroke-width=".07"/>' : '') + '<g class="md-kt" transform="translate(0 ' + (b.past ? 60 : -58) + ')"><rect x="-46" y="-17" width="92" height="34" rx="17"/><text y="9">' + mdYorliq(b.kes[0], b.kes[1]) + '</text></g></g>'
  })
  // o'qlar: X sonlari pastda (har ustun ro'parasida), Y sonlari chapda; «X →» o'ngda, «Y ↑» tepada. Sonlar ham data-n bilan (bant yoqqanda oltin bo'ladi)
  let oq = '<g class="md-oq">'
  for (let x = 0; x < m.w; x++) oq += '<text class="md-n md-nx' + (nR.x[x] === 0 ? ' on' : '') + '"' + (nR.x[x] ? ' data-r="' + nR.x[x] + '"' : '') + ' data-x="' + x + '" x="' + (x * KT + 50) + '" y="' + (H + 50) + '">' + x + '</text>'
  for (let y = 0; y < m.h; y++) oq += '<text class="md-n md-ny' + (nR.y[y] === 0 ? ' on' : '') + '"' + (nR.y[y] ? ' data-r="' + nR.y[y] + '"' : '') + ' data-y="' + y + '" x="' + (-36) + '" y="' + (mdQ(m, y) * KT + 64) + '">' + y + '</text>'
  oq += '<text class="md-ax" x="' + (W + 22) + '" y="' + (H + 50) + '">X →</text><text class="md-ax" x="' + (-36) + '" y="' + (-24) + '">Y ↑</text></g>'
  // oldindan chizilgan yo'l: izlar — move yo'li (katakma-katak, nuqtali; kataklar hoshiyali), goIz — go to manzillari (to'g'ri punktir)
  let iz = ''
  const chiz = (p, cls) => p.slice(1).forEach(([x, y], i) => { const [a, b] = p[i]; iz += '<line class="kt-il' + cls + '" x1="' + (a * KT + 50) + '" y1="' + (mdQ(m, b) * KT + 52) + '" x2="' + (x * KT + 50) + '" y2="' + (mdQ(m, y) * KT + 52) + '"/>' })
  if (o.izlar) { chiz(o.izlar, ''); o.izlar.forEach(([x, y]) => { yol = yol.replace('class="kt-c" data-k="' + x + ',' + mdQ(m, y) + '"', 'class="kt-c iz" data-k="' + x + ',' + mdQ(m, y) + '"') }) }
  if (o.goIz) chiz(o.goIz, ' kt-gl')
  const q = o.joy || s
  return '<div class="katak maydon" data-z="sahna" data-xarita="' + maydonXarita(m) + '" data-start="' + s.join(',') + '">'
    + '<svg class="kt" viewBox="' + (-MD_CH) + ' ' + (-MD_TEPA) + ' ' + (W + MD_CH + MD_ONG) + ' ' + (H + MD_TEPA + 74) + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
    + '<rect x="-11" y="-11" width="' + (W + 22) + '" height="' + (H + 22) + '" rx="26" fill="#9AD57C" opacity=".55"/>'
    + yol + bant + bezak + '<g class="kt-iz">' + iz + '</g>' + narsa + (buta ? '<g class="kt-butalar">' + buta + '</g>' : '') + oq
    + '<g class="kt-q" style="transform:' + katakJoy(q[0], mdQ(m, q[1])) + '">' + (o.kostyum ? mdKostyumlar(o.kostyum) : (o.aktyor || '').replace('<svg ', '<svg x="0" y="0" width="80" height="88" '))
    + (o.yorliqsiz ? '' : '<g class="kt-yr" transform="translate(40 101)"' + (o.yorliqR ? ' data-r="' + o.yorliqR + '"' : '') + '><rect x="-38" y="-15" width="76" height="30" rx="15"/><text y="7">' + mdYorliq(q[0], q[1]) + '</text></g>')
    + (m.kalit ? '<g class="kt-qk" transform="translate(70 66) rotate(-24) scale(1.05)">' + KT_KALIT + '</g>' : '')
    + '</g></svg></div>'
}

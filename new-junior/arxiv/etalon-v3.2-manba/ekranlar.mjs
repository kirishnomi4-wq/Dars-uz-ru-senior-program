
// ===== v3: mozaika bloklar, Scratch tartibidagi studiya =====
const IKON = {
  r: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h13M12 6l6 6-6 6" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  l: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H7M12 6l-6 6 6 6" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  j: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19C6 6 18 6 20 19" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M15 16l5 4 2-6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  s: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7l-5 4v-4H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill="#fff"/></svg>',
}
const BL = { r: ['h', 'move right'], l: ['h', 'move left'], j: ['h', 'jump'], s: ['g', 'say'] }
// mb('r') · mb('s','Salom!') · mb('r','', 'yon')
const mb = (t, matn = 'Salom!', cls = '') => { const [f, nom] = BL[t]; return `<span class="mb f-${f} ${cls}">${IKON[t]}<span>${nom}</span>${t === 's' ? `<span class="inp">${matn}</span>` : ''}</span>` }
const yigma = (arr) => `<div class="mbw">${arr.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div>`
const OILA = { h: ['Harakat', 'r'], g: ['Gap', 's'] }
const rang = (f, cls = '') => `<span class="rd f-${f} ${cls}"><i>${IKON[OILA[f][1]]}</i><small>${OILA[f][0]}</small></span>`
const ranglar = (aktiv, holat = {}) => `<div class="rg" data-z="ranglar">${rang('h', (aktiv === 'h' ? 'on ' : '') + (holat.h || ''))}${rang('g', (aktiv === 'g' ? 'on ' : '') + (holat.g || ''))}</div>`
const PAL = { h: ['r', 'l', 'j'], g: [['s', 'Salom!']] }
const palitra = (f, ochiq = PAL[f].length) => `<div class="pl" data-z="bloklar"><small class="f-${f}">${OILA[f][0]}</small>${PAL[f].map((b, i) => `<div class="mbw${i >= ochiq ? ' yopiq' : ''}">${typeof b === 'string' ? mb(b) : mb(...b)}</div>`).join('')}</div>`
const dastur = (arr, yuz, iz = '') => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span>${arr.length ? yigma(arr) : '<span class="bosh">Blokni shu yerga ulang</span>'}${iz || `<small class="dsn">${arr.length} ta blok</small>`}</div>`
const momiqYuz = () => hero({ k: 'momiq', lite: true })
const coddyYuz = () => bust('xursand')
const ust = (tag, h, iz = '') => `<div class="ust" data-z="sarlavha"><span class="tag">${tag}</span><h3 class="sar">${h}</h3>${iz ? `<span class="iz">${iz}</span>` : ''}</div>`
const studiya = ({ tag, h, iz, aktiv = 'h', holat, ochiq, prog, yuz, sahna, extra = '' }) => `${ust(tag, h, iz)}${ranglar(aktiv, holat)}${palitra(aktiv, ochiq)}${dastur(prog, yuz)}<div class="oyna">${world('hovli')}${sahna}</div>${extra}`
const fB = ({ mas = '', hint = '', label = `${PLAY}Ishga tushir`, chap } = {}) => `<footer class="hn">${chap || `<span class="mas ${mas}">${LAMP}Maslahat</span>`}<span class="hint">${hint}</span><span class="asos">${label}</span></footer>`
const fU = (hint, label) => `<footer class="hn"><span class="orq">‹ Orqaga</span><span class="hint">${hint}</span><span class="asos">${label}</span></footer>`
// v3.2 (F-1116-01): kirishda butun kurs emas — Blok studiya modulida yasaladigan o'yinlar
const ichSvg = (svg, x, y, w, h) => svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `)
const OLMA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8c-.6-2.4-2.6-3.6-2.6-3.6" fill="none" stroke="#6B4423" stroke-width="1.7" stroke-linecap="round"/><path d="M12.6 6.6c1.4-2.4 4.4-2.4 4.4-2.4-.4 2.4-2.6 3.2-4.4 2.4z" fill="#4CB050"/><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#F0435A"/><ellipse cx="8.6" cy="11.8" rx="1.3" ry="2.1" fill="#fff" opacity=".5"/></svg>'
const RAKETA = '<svg viewBox="0 0 24 34" aria-hidden="true"><path d="M12 1c4.6 3.8 6.2 9.4 6.2 14.6V23H5.8v-7.4C5.8 10.4 7.4 4.8 12 1z" fill="#F4F6FB"/><circle cx="12" cy="11.5" r="3" fill="#3FA2FF" stroke="#0D2137" stroke-width="1.2"/><path d="M5.8 16.5L1.6 23v3.4l4.2-2.2zM18.2 16.5l4.2 6.5v3.4l-4.2-2.2z" fill="#FF4F28"/><path d="M8.4 23h7.2l-1.5 3.4H9.9z" fill="#0D2137"/><path d="M10 26.4h4l-2 6.4z" fill="#FFC93C"/></svg>'
const dushman = (c) => `<svg viewBox="0 0 24 20" aria-hidden="true"><path d="M6 5L4 1.6M18 5l2-3.4" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="12" cy="11.5" rx="10" ry="7.4" fill="${c}"/><circle cx="8.4" cy="10.6" r="2.6" fill="#fff"/><circle cx="15.6" cy="10.6" r="2.6" fill="#fff"/><circle cx="8.9" cy="11" r="1.2" fill="#0D2137"/><circle cx="16.1" cy="11" r="1.2" fill="#0D2137"/></svg>`
const BALL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C"/></svg>'
// labirint: 120x96 maydon, ikki devor; qahramon yo'l bo'ylab yulduzga boradi
const labirint = () => `<svg class="lbs" viewBox="0 0 120 96" aria-hidden="true"><rect x="2" y="2" width="116" height="92" rx="8" fill="#F4FBEF" stroke="#2E7D4F" stroke-width="4"/><path class="lb-d" d="M40 34V94M80 2V62"/><path class="lb-iz" d="M20 80V16H60V80H100V22"/><g transform="translate(89 6) scale(.92)"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C" stroke="#E8A90C" stroke-width="1.2" stroke-linejoin="round"/></g><g class="lb-q">${ichSvg(hero({ k: 'katak', mood: 'xursand', lite: true }), -11, -13, 22, 24)}</g></svg>`
const oyinlar = () => `<div class="kurs">
  <div class="gl kr"><div class="kr-r lb">${labirint()}</div><b>Labirint</b><small>2-dars</small></div>
  <div class="gl kr"><div class="kr-r ol">${world('hovli', true)}<i class="olma o1">${OLMA}</i><i class="olma o2">${OLMA}</i><i class="olma o3">${OLMA}</i><span class="savat">${hero({ k: 'jele', mood: 'xursand', lite: true })}</span><span class="ball">${BALL}3</span></div><b>Olma terish</b><small>11-dars</small></div>
  <div class="gl kr"><div class="kr-r ks">${world('kosmos', true)}<i class="dush d1">${dushman('#9A7BFF')}</i><i class="dush d2">${dushman('#38C793')}</i><i class="dush d3">${dushman('#FF7A59')}</i><span class="raketa"><i class="oq"></i><i class="oq o2"></i>${RAKETA}</span></div><b>Kosmik o‘yin</b><small>17-dars</small></div>
</div>`

// v3.2 (F-1116-04): sinf doskasida pog'onalar — zinapoya. Har pog'ona: raqam, kichik rasm, bir qator topshiriq, nechta bola
const ODAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.6" r="4.2" fill="currentColor"/><path d="M3.6 21.4c.7-4.8 4.2-7.6 8.4-7.6s7.7 2.8 8.4 7.6z" fill="currentColor"/></svg>'
const miniYol = ({ q, y, yo = [], n = 6 }) => {
  const X = (i) => 9 + i * (82 / (n - 1)), Y = 36
  const yoy = yo.map(([a, b, c = '#FF4F28']) => { const xa = X(a), xb = X(b), h = Math.abs(b - a) > 1 ? 6 : 16, d = b > a ? 1 : -1; return `<path d="M${xa} ${Y - 4} Q${(xa + xb) / 2} ${h} ${xb} ${Y - 5}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="3.2 3"/><path d="M${xb - 3 * d} ${Y - 10}L${xb + 0.6 * d} ${Y - 4.4}L${xb + 3.4 * d} ${Y - 11}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` }).join('')
  return `<svg class="mini" viewBox="0 0 100 44" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<ellipse cx="${X(i)}" cy="${Y + 2}" rx="6.2" ry="2.8" fill="${i === y ? '#F3D36E' : i === q ? '#CFE0F6' : '#FFFDF7'}" stroke="${i === y ? '#C79F33' : i === q ? '#9DB7DA' : '#C8B892'}" stroke-width="1.1"/>`).join('')}${yoy}<g transform="translate(${X(y) - 6.5} ${Y - 15}) scale(.54)"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C" stroke="#E8A90C" stroke-width="1.4" stroke-linejoin="round"/></g>${ichSvg(hero({ k: 'momiq', mood: 'xursand', lite: true }), X(q) - 8, Y - 17, 16, 18)}</svg>`
}
const bloklar9 = () => `<svg class="mini" viewBox="0 0 100 44" aria-hidden="true">${Array.from({ length: 9 }, (_, i) => `<rect x="${6 + i * 10}" y="${i < 6 ? 14 : 14}" width="8.4" height="14" rx="2" fill="${i < 6 ? '#2F8FF0' : '#7DBBFA'}"/><path d="M${8.4 + i * 10} 21h3.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`).join('')}<text x="50" y="41" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="9" fill="#0D2137">6 + 3</text></svg>`
const POGONA = [
  ['1', 4, miniYol({ q: 0, y: 3, yo: [[0, 5]] }), 'Yulduzda to‘xta'],
  ['2', 4, miniYol({ q: 3, y: 1, yo: [[3, 1, '#E8A90C']] }), 'Yulduz orqada'],
  ['3', 3, miniYol({ q: 0, y: 3, yo: [[0, 4, '#2F8FF0'], [4, 3, '#2F8FF0']] }), '<span class="mbk">move left</span> ham'],
  ['★', 3, bloklar9(), 'Roppa-rosa 9 blok'],
]
const zina = () => {
  const cx = (i) => 16 + i * 22.5, cy = (i) => 91.3 - i * 5.5
  const yoy = [0, 1, 2].map((i) => `<path d="M${(cx(i) + 5).toFixed(1)} ${(cy(i) - 1.5).toFixed(1)} Q${((cx(i) + cx(i + 1)) / 2).toFixed(1)} ${(Math.min(cy(i), cy(i + 1)) - 15).toFixed(1)} ${(cx(i + 1) - 5).toFixed(1)} ${(cy(i + 1) - 1.5).toFixed(1)}"/>`).join('')
  return POGONA.map(([n, son, rasm, matn], i) => `<div class="gl pg-k${n === '★' ? ' yd' : ''}" style="--i:${i}" data-z="pog‘ona"><div class="pg-t"><span class="pg-n">${n}</span><span class="pg-s" aria-label="${son} bola">${ODAM}<b>${son}</b></span></div>${rasm}<span class="pg-m">${matn}</span></div>`).join('')
    + `<svg class="zina-yoy" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${yoy}</svg>`
    + POGONA.map(([n], i) => `<span class="z pg-z${n === '★' ? ' y' : ''}" style="--i:${i}">${n === '★' ? YUL : `<b>${n}</b>`}</span>`).join('')
}

// v3.2 (38-qaror): tepada faqat dars nomi — bekat chizig'i yo'q; qayerdaligimizni reja xaritasi har bekat boshida ko'rsatadi
const bosh = () => `<header class="hb"><span class="hl"><i></i>1-dars · Tanishuv</span></header>`
const NOUT = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="1.6" fill="none" stroke="#0D2137" stroke-width="2"/><path d="M2 19h20" stroke="#0D2137" stroke-width="2.2" stroke-linecap="round"/></svg>'
const O = (n, cls = '') => `<span class="O ${cls}">${n}</span>`

const QAYSI = (javob, gap = 'Noutbukda bitta javobni tanlang.') => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Savol', 'Coddy‘ni <em>yulduzga</em> qanday olib boramiz?', gap)}</div>${javob}${yol('p1', coddyQ('', 'oylaydi', 'savol'))}</div>`
const JAVOBLAR = [['A', '«YUR!» deb baqiramiz'], ['B', 'Sichqoncha bilan sudraymiz'], ['C', 'Unga buyruq beramiz']]
const E = {
  P1: { rol: 'p', b: 0, t: 't1', nom: 'Kirish', fid: 'F-1116-01', izoh: 'v3.2: sarlavha bir qatorda. Kartalarda butun kurs emas — Blok studiya modulida yasaladigan o‘yinlar: labirint (2-dars), olma terish (11-dars), kosmik o‘yin (17-dars); har biri o‘zi o‘ynab turadi. Coddy bugun nima qilishimizni aytadi: «meni yurgizishni o‘rganasiz» (javobni — buyruqni — oldindan aytmaydi, u hukda ochiladi).',
    body: () => `<div class="chap">${matn('Kursning birinchi darsi', 'Bloklardan <em>o‘yin</em> yasaymiz', 'Salom! Men Coddy. Bugun meni yurgizishni o‘rganasiz.')}${oyinlar()}</div><div class="oyna">${world('hovli')}${yol('p3b', coddyQ('', 'salom', 'xursand'))}</div>`,
    foot: () => fU('Kirdi: 12 / 14', 'Keyingi ›') },
  P2: { rol: 'p', b: 0, t: 't2', nom: 'Savol · A yo‘l', fid: 'F-1116-02', ov: 0, izoh: '<b>A yo‘l:</b> javob kartalari katta ekranda ham turadi. To‘g‘ri javob endi «Unga buyruq <b>beramiz</b>» — v3.1 dagi «yozamiz» keyingi ekrandagi «biz buyruqni yozmaymiz — bloklarni ulaymiz» bilan zid edi. Savol ikki qatorda (faqat huk savoli ikki qatorgacha).',
    body: () => QAYSI(kartalar(JAVOBLAR, 'gl a-r')),
    foot: () => fU('Javob berdi: 9 / 14', 'Javoblarni ochish') },
  P2B: { rol: 'p', b: 0, t: 't2', nom: 'Savol · B yo‘l', fid: 'F-1116-02', ov: 0, izoh: '<b>B yo‘l:</b> javob kartalari katta ekranda yo‘q — savol va Coddy qoladi, o‘ngda «Javob — noutbukda». Kim qaysi javobni tanlagani ustoz panelida (pastki qator): ustoz o‘qib beradi, keyin sinf sinab ko‘radi.',
    body: () => QAYSI(`<span class="gl yrl a-nb">${NOUT}Javob — noutbukda</span>`),
    foot: () => fU('Javob berdi: 9 / 14 · A 3 · B 2 · C 4', 'Sinab ko‘ramiz ›') },
  P2N: { rol: 'b', b: 0, t: 't2', nom: 'Savol (noutbukda)', fid: 'F-1116-02', izoh: 'Ikkala yo‘lda ham bola javobni shu yerda tanlaydi. Tugma yo‘q — kartani bosishning o‘zi javob; bosgach «Katta ekranga qarang».',
    body: () => QAYSI(kartalar(JAVOBLAR, 'gl a-r'), 'Qaysi biri ishlaydi deb o‘ylaysiz?'),
    foot: () => fJim('Bittasini bosing') },
  P3: { rol: 'p', b: 0, t: 't1', nom: 'Dasturlash nima?', yangi: 1, fid: 'F-1115-01 · 05', izoh: 'O‘zgarmadi (javobda belgilanmagan). Dasturchi buyruqni yozadi (bir qator haqiqiy kod — o‘qish shart emas), biz esa bloklarni ulaymiz: bloklar mozaikadek ulanib tushadi va Coddy yuradi. Savol yo‘q.',
    body: () => `<div class="chap">${matn('Yangi so‘z', '<em>Blokli</em> dasturlash', 'Biz buyruqni yozmaymiz — bloklarni ulaymiz.')}<div class="ikki"><div class="kod"><small>Dasturchi yozadi</small><code>coddy.move("right")<br>coddy.move("right")</code></div><span class="ar2">=</span><div class="biz"><small>Biz ulaymiz</small>${yigma(['r', 'r'])}</div></div><p class="izq">Scratch’da millionlab bolalar o‘yinni shunday yasaydi.</p></div><div class="oyna">${world('hovli')}<div class="gl tush">${yigma(['r', ['r', '', 'yangi'], ['r', '', 'tushadi']])}</div>${yol('p3b', coddyQ('yur'))}</div>`,
    foot: () => fU('Ustozga: «Dasturlash — buyruq berish» deb ayting', 'Keyingi ›') },
  P4: { rol: 'p', b: 0, t: 't1', nom: 'Reja', fid: 'F-1116-03', izoh: 'v3.2: sarlavha — savol, bir qatorda: «Bugun nima qilamiz?». Ostidagi uch qator — javobi (uchalasi ham ish).',
    body: () => `<div class="chap">${matn('Bugungi reja', 'Bugun nima <em>qilamiz</em>?', '')}<ol class="rj"><li class="hozir"><i>1</i><span><b>Yurgizamiz</b>bloklar bilan birinchi dastur</span></li><li><i>2</i><span><b>Gapirtiramiz</b>qahramon salom beradi</span></li><li><i>3</i><span><b>O‘z sahnamiz</b>o‘zingiz yaratasiz</span></li></ol></div><div class="oyna">${world('hovli')}<div class="qq"><span class="m1">${hero({ k: 'momiq', mood: 'xursand' })}</span><span class="m2">${robot({ pose: 'salom', yuz: 'xursand' })}</span><span class="m3">${hero({ k: 'nihol', mood: 'xursand' })}</span></div></div>`,
    foot: () => fU('Ustozga: rejani o‘qib bering', 'Boshladik ›') },
  B1: { rol: 'b', b: 1, t: 't3', nom: 'Ranglar', yangi: 1, fid: 'F-1115-02', izoh: 'Qabul qilingan. Studiya bilan tanishuvda har bola rang doirachalarini o‘zi bosadi: ko‘k — Harakat (bosildi ✓), binafsha — Gap (miltillaydi). Qolgan joy xira. Tanlashning o‘zi — harakat, asosiy tugma yo‘q.',
    body: () => `${studiya({ tag: 'Blok studiya', h: 'Har rang — bitta <em>oila</em>', aktiv: 'h', holat: { h: 'ok', g: 'puls' }, prog: [], yuz: momiqYuz(), sahna: yol('b2', momiqQ()) })}<div class="xira"></div><div class="ishora">${O('☝')}Rangli doirachalarni bosing</div>`,
    foot: () => fJim('Ikkala rangni bosing · 1 / 2') },
  B2: { rol: 'b', b: 1, t: 't3', nom: 'Studiya', fid: 'F-1115-05 · 07', izoh: 'Qabul qilingan. v3.2: maslahat so‘zi — «qadam» (bitta blok — bitta qadam).',
    body: () => studiya({ tag: 'Mashq · 1-pog‘ona', h: 'Qahramoningizni <em>yulduzga</em> olib&nbsp;boring.', aktiv: 'h', ochiq: 1, prog: ['r', 'r', 'r'], yuz: momiqYuz(), sahna: yol('b2', momiqQ()) }),
    foot: () => fB({ hint: 'Qadamlarni sanang: yulduzgacha nechta?' }) },
  B3: { rol: 'b', b: 1, t: 't3', nom: 'Xato', fid: 'F-1116-05', izoh: 'v3.2: pufakda faqat Kamvoy gapi — «Oz qoldi!», kichik va uchi Kamvoy’ga qaragan. Maslahat matni («Qadamlarni sanang») pufakda emas — yonib turgan «Maslahat» tugmasida.',
    body: () => studiya({ tag: 'Mashq · 1-pog‘ona', h: 'Qahramoningizni <em>yulduzga</em> olib&nbsp;boring.', aktiv: 'h', ochiq: 1, prog: ['r', 'r'], yuz: momiqYuz(), sahna: `${yol('b2', momiqQ('at2', 'hayron'))}<div class="muam"><span class="mk">${hero({ k: 'kamvoy', mood: 'hayron' })}</span><span class="gl pufak"><b>Oz qoldi!</b></span></div>` }),
    foot: () => fB({ mas: 'yon', hint: 'Maslahat yondi' }) },
  B4: { rol: 'b', b: 1, t: 't3', nom: 'Yetib bordi', izoh: 'Qabul qilingan. Qahramon yulduzda, bajarilgan bloklar yonib turibdi. Ekran o‘zi o‘tmaydi: bola «Keyingi pog‘ona»ni o‘zi bosadi.',
    body: () => studiya({ tag: 'Mashq · 1-pog‘ona', h: 'Yetib bordi! <em>Birinchi</em> dasturingiz.', aktiv: 'h', ochiq: 1, prog: [['r', '', 'yon'], ['r', '', 'yon'], ['r', '', 'yon']], yuz: momiqYuz(), sahna: `<div class="konfeti">${Array.from({ length: 16 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 5) * 0.12}s;--r:${(i * 47) % 360}deg" class="k${i % 4}"></i>`).join('')}</div>${yol('b2', momiqQ('at3', 'xursand'))}` }),
    foot: () => fB({ chap: `<span class="mas">${QAYTA}Qayta ko‘rish</span>`, label: 'Keyingi pog‘ona ›' }) },
  P6: { rol: 'p', b: 1, t: 't3', nom: 'Coddy sanaydi', yangi: 1, fid: 'F-1115-03', izoh: 'Qabul qilingan. Ustoz ishga tushiradi, Coddy bloklarni sanab yulduzdan o‘tib ketadi — keyin tushuntiradi va bitta blokni chiqaradi.',
    body: () => studiya({ tag: 'Ko‘ramiz', h: 'Coddy yulduzni <em>ko‘rmaydi</em>.', iz: 'U bloklarni sanaydi: 4 ta blok — 4 qadam.', aktiv: 'h', ochiq: 1, prog: [['r', '', 'yon'], ['r', '', 'yon'], ['r', '', 'yon'], ['r', '', 'yon hozir']], yuz: coddyYuz(), sahna: `${yol('p5', coddyQ('at4', 'turadi', 'son').replace('>3</text>', '>4</text>'), 4, 3)}<span class="gl yrl y-tox">«To‘xta! Men shu yerdaman!»</span>` }),
    foot: () => fU('Ustozga: oxirgi blokni dasturdan chiqaring', 'Keyingi ›') },
  P5: { rol: 'p', b: 1, t: 't1', nom: 'Sinf doskasi', fid: 'F-1116-04', izoh: 'v3.2: bolalar pog‘onalarni o‘zi bajarayotganda (7-sahna). Pog‘onalar — zinapoya: 1 → 2 → 3 → ★ tepaga ko‘tariladi va zonachalar yoyi bilan ulangan. Har pog‘onada: kichik rasm (qahramon, yulduz, qaysi tomonga), bir qator topshiriq, hozir shu pog‘onada nechta bola. Chapda — uch pog‘onani tugatganlar soni. Faqat son, ism yo‘q.',
    body: () => `<div class="chap">${matn('Mashq · bolalar ishlayapti', 'Endi <em>o‘zingiz</em>!', 'Qiynalsangiz — «Maslahat»ni bosing.')}<div class="tugatdi"><small>Uch pog‘onani tugatdi</small><b>3 <i>/ 14</i></b><div class="yulduzlar">${Array.from({ length: 14 }, (_, i) => `<i class="${i < 3 ? 'on' : ''}">${STAR}</i>`).join('')}</div></div></div><div class="oyna">${world('hovli')}${zina()}</div>`,
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P7: { rol: 'p', b: 2, t: 't3', nom: 'say bloki', yangi: 1, fid: 'F-1115-02 · 03 · 04', izoh: 'Qabul qilingan. Binafsha oila — «Gap». Ustoz yozuvni «2 qadam yur» qiladi: Coddy yurmaydi, faqat aytadi — «nima qilishini blok hal qiladi».',
    body: () => studiya({ tag: 'Yangi blok · say', h: '<em>Yurmadi</em> — faqat aytdi.', iz: 'Nima qilishini blok hal qiladi, yozuv emas.', aktiv: 'g', holat: { h: 'ok' }, prog: [['s', '2 qadam yur', 'yon']], yuz: coddyYuz(), sahna: `<div class="cdy2">${robot({ pose: 'tushuntiradi', yuz: 'xursand' })}</div><span class="gl gap-p">2 qadam yur</span>` }),
    foot: () => fU('Ustozga: «say — ayt. Binafsha — gap oilasi»', 'Keyingi ›') },
  P8: { rol: 'p', b: 4, t: 't1', nom: 'Yakun', fid: 'F-1115-08', izoh: 'Qabul qilingan. v3.2: sarlavha bir qatorda va «yozdingiz» emas — «tuzdingiz» (biz yozmaymiz, bloklarni ulaymiz).',
    body: () => `<div class="chap">${matn('Yakun', 'Siz <em>dastur</em> tuzdingiz!', 'Uchala bekatdan o‘tdik. Keyingi darsda — labirint!')}<div class="tm"><div class="tr"><span class="ti u">!</span><span><b>Dasturlash</b>Kompyuterga buyruq berish</span></div><div class="tr"><span class="ti b">${IKON.r}</span><span><b>Blok</b>Bitta buyruq · rangi — oilasi</span></div><div class="tr"><span class="ti d"><i></i><i></i><i></i></span><span><b>Dastur</b>Buyruqlar ro‘yxati</span></div></div></div><div class="oyna">${world('hovli')}${qahramonlar()}<div class="gl kd2 a-tr"><small>Keyingi dars</small><b>2 · Labirint</b></div></div>`,
    foot: () => fU('Ustozga: «Noutbukingizga qarang» deb ayting', 'Darsni yakunlash') },
  B5: { rol: 'b', b: 4, t: 't1', nom: 'O‘z ma’lumoti', yangi: 1, fid: 'F-1115-08 · 07', izoh: 'Qabul qilingan. v3.2: sarlavha bir qatorda. Bola bugun qaysi blokni necha marta ishlatganini ko‘radi — blok nomi va rangi bilan. Faqat o‘z noutbukida.',
    body: () => `<div class="chap">${matn('Sizning natijangiz', 'Bugun <em>uddaladingiz</em>!', '')}<div class="stat"><div>${yigma(['r'])}<b>× 14</b></div><div>${yigma(['l'])}<b>× 3</b></div><div>${yigma(['j'])}<b>× 2</b></div><div>${yigma([['s', 'Men Zippiman!']])}<b>× 5</b></div></div><div class="sahna-ok">✓ O‘z sahnangizni yasadingiz</div></div><div class="oyna">${world('kosmos')}<div class="qq"><span class="m2">${hero({ k: 'yulduz', mood: 'xursand', mv: 'sakraydi' })}</span></div><div class="gl kd2 a-tr"><small>Zippi</small><b>Keyingi darsda kutadi</b></div></div>`,
    foot: () => fJim('Dars tugadi') },
}
const P2TANLOV = `<div class="p2-tanlov"><p><b>P2: qaysi yo‘l?</b> «mentor panelda» degan gapingizni ikki xil tushunish mumkin edi — ikkalasini yasadim. Bittasini tanlang.</p><div class="tanlov" data-q="P2 yo‘li"><button type="button" data-v="A · kartalar katta ekranda ham">A · kartalar katta ekranda ham</button><button type="button" data-v="B · kartalar faqat noutbukda">B · kartalar faqat noutbukda</button><input type="text" placeholder="Izoh (ixtiyoriy)" aria-label="P2 yo‘li izohi"></div></div>`
const LAHZA = [
  ['1', 'Kirish', 'Birinchi dars: bloklardan nima yasaymiz.', ['P1']],
  ['2', 'Savol va «Dasturlash nima?»', 'Darsdagi yagona savol — ikki yo‘l (A yoki B), keyin dasturlash va blokli dasturlash.', ['P2', 'P2B', 'P2N', 'P3'], P2TANLOV],
  ['3', 'Reja', 'Bugun nima qilamiz: uch bekat.', ['P4']],
  ['4', 'Blok studiya', 'Ranglar (bola o‘zi bosadi), birinchi dastur, xato, muvaffaqiyat.', ['B1', 'B2', 'B3', 'B4']],
  ['5', 'Ko‘ramiz, keyin o‘zingiz', 'Ustoz ko‘rsatadi va tushuntiradi; keyin bolalar pog‘onalarni o‘zi bajaradi — katta ekranda sinf doskasi.', ['P6', 'P5', 'P7']],
  ['6', 'Yakun', 'Katta ekranda — so‘zlar; bola noutbukida — o‘z ma’lumoti.', ['P8', 'B5']],
]
const ekran = (id) => { const e = E[id]; return `<figure class="${e.rol === 'p' ? 'pr' : 'bo'}" data-id="${id}"><div class="ekran hy ${e.t} e-${id}" role="img" aria-label="${id} ${e.nom}" tabindex="0">${bosh(e.b)}<main class="hm">${e.body()}</main>${e.foot()}</div><figcaption><span class="eid">${id}</span><b>${e.rol === 'p' ? 'Proyektor' : 'Bola noutbuki'} · ${e.nom}${e.fid ? ` <span class="fid">${e.fid}</span>` : ''}</b><span class="fiz">${e.izoh}</span></figcaption>${e.ov === 0 ? '' : `<div class="ov" role="group" aria-label="${id} bo‘yicha javob"><button type="button" data-v="qabul">Qabul</button><button type="button" data-v="boshqa">Boshqa g‘oya</button><input type="text" placeholder="Izoh (ixtiyoriy)" aria-label="${id} izohi"></div>`}</figure>` }
const lahzalar = LAHZA.map(([n, nom, iz, ids, qosh = '']) => `<section class="lahza" aria-label="${nom}"><div class="l-bosh"><span class="l-n">${n}</span><div><h3>${nom}</h3><p>${iz}</p></div></div><div class="l-ekranlar">${ids.map(ekran).join('')}</div>${qosh}</section>`).join('\n')
const MOZ = `<div class="ekran hy t3 e-MZ namuna-st" role="img" aria-label="Mozaika bloklar">${bosh(1)}<main class="hm">${studiya({ tag: 'Yigma ko‘rinish', h: 'Bloklar <em>ulanadi</em>', iz: 'Sudrab olib boring — «chiq» etib ulanadi. Yoki bosing — oxiriga o‘zi ulanadi.', aktiv: 'h', prog: ['r', 'r', 'l'], yuz: momiqYuz(), sahna: yol('b2', momiqQ()) })}<div class="sudra">${yigma([['j', '', 'qol']])}</div></main>${fB({ hint: 'Qo‘yib yuboring — «chiq» etib ulanadi' })}</div>`

let t = readFileSync(V + '/shablon6.html', 'utf8').replace('{{HARAKAT}}', HARAKAT).replace('{{MAKET}}', MAKET).replace('{{LAHZALAR}}', lahzalar).replace('{{MOZAIKA}}', MOZ)
t = t.replaceAll('"Source Serif 4",Georgia,serif', 'var(--f-sar)').replaceAll('"Source Serif 4",serif', 'var(--f-sar)').replaceAll('"Manrope",sans-serif', 'var(--f-matn)')
t = t.replaceAll('<div class="chap">', '<div class="chap" data-z="matn">').replace(/<div class="oyna([^"]*)">/g, '<div class="oyna$1" data-z="sahna">').replace(/<div class="gl pan">/g, '<div class="gl pan" data-z="sarlavha paneli">')
t = t.replace(/<svg (class="(?:hero|robot|world))/g, '<svg xmlns="http://www.w3.org/2000/svg" $1')
if (/\{\{/.test(t)) { console.error('QOLDI', t.match(/\{\{[^}]*\}\}/g)); process.exit(1) }
writeFileSync(OUT, t); console.log('ok', (t.length / 1024).toFixed(0) + 'KB')

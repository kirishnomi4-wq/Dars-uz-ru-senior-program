// Umumiy ekran qismlari (dvigatel 1b, 19.11): bloklar, palitra, studiya, dastur tasmasi, sarlavha, Coddy gapi, footer, kutish, taxta,
// joy kartasi, shartlar, sinf natijasi va h.k. Avval etalon/ekranlar.mjs ichida 1-dars ekranlari bilan aralash edi — mazmuni o'zgarmagan.
// 3c (19.11): 1-darsning o'z bo'laklari (kurs o'yinlari, pog'onalar, huk javoblari, bekatlar, dars oxiri, keyingi dars, sahna shartlari, sinf
// natijasi namunasi) — darslar/001-tanishuv/qismlar.mjs da; sarlavha va huk savoli — DARS dan. Bu yerda faqat kursga umumiy qismlar qoldi
// (qahramonlar, dunyolar, ranglar, bloklar, shablonlar). yigish.mjs: bosh → dars e'loni → shu fayl → dars qismlari → dars ekranlari.

// ===== v3: mozaika bloklar, Scratch tartibidagi studiya =====
const IKON = {
  r: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h13M12 6l6 6-6 6" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  l: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H7M12 6l-6 6 6 6" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  u: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V7M6 12l6-6 6 6" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  d: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v13M6 12l6 6 6-6" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  j: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19C6 6 18 6 20 19" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M15 16l5 4 2-6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  s: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7l-5 4v-4H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill="#fff"/></svg>',
  // 5-dars: takrorlash — aylana strelka
  p: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/><path d="M18.6 3.4v4.2h-4.2" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/><path d="M5.4 20.6v-4.2h4.2" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  // 4-dars: hodisa — klaviatura tugmasi (strelka bilan)
  k: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="3" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M7 12h8.5M12.5 9l3 3-3 3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  // 3-dars: go to — manzil belgisi (nishon: doira va markaz)
  // 8-dars: shart — ayri yo'l (savol belgisi bilan tarmoq)
  a: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21v-7l-6-6M12 14l6-6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6.5h5v-5M21 6.5h-5v-5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  // 7-dars: kostyum — futbolka; tovush — nota
  v: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.2 3.5 3 6.6l2.2 4.1 2.6-1.1V20h8.4V9.6l2.6 1.1L21 6.6l-5.2-3.1c-.7 1.5-2.1 2.4-3.8 2.4s-3.1-.9-3.8-2.4z" fill="#fff"/></svg>',
  n: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17.5V5.2l11-2.2v12.3" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/><circle cx="6.3" cy="17.6" r="3" fill="#fff"/><circle cx="17.3" cy="15.4" r="3" fill="#fff"/></svg>',
  // 11-dars: olmaga tekkanda — barmoq tegishi (nuqta va uch chiziq); «▶ Boshlash» bosilganda — uchburchak; set — «=», change — «+»
  q: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="14" r="4.4" fill="#fff"/><path d="M12 2.6v3.6M4.6 5.6l2.4 2.6M19.4 5.6 17 8.2" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>',
  f: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.6v14.8L19.4 12z" fill="#fff" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  z: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9h14M5 15h14" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/></svg>',
  c: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.6v14.8M4.6 12h14.8" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></svg>',
  // 12-dars: o'zgaruvchi sharti — «=» belgili ayri yo'l; game over — to'xtash belgisi (sakkizburchak)
  i: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21v-7l-6-6M12 14l6-6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 3.6h6M3 7h6" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
  g: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3z" fill="#fff"/><path d="M8.6 12h6.8" stroke="#F08A24" stroke-width="2.8" stroke-linecap="round"/></svg>',
  // 13-dars: random — zar (uch nuqta)
  m: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.4" y="3.4" width="17.2" height="17.2" rx="4" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="8.2" cy="8.2" r="1.8" fill="#fff"/><circle cx="12" cy="12" r="1.8" fill="#fff"/><circle cx="15.8" cy="15.8" r="1.8" fill="#fff"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.4" fill="none" stroke="#fff" stroke-width="2.8"/><circle cx="12" cy="12" r="2.6" fill="#fff"/><path d="M12 1.6v4M12 18.4v4M1.6 12h4M18.4 12h4" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>',
}
const BL = { r: ['h', 'move right'], l: ['h', 'move left'], u: ['h', 'move up'], d: ['h', 'move down'], j: ['h', 'jump'], s: ['g', 'say'], x: ['h', 'go to'], k: ['e', 'when'], p: ['b', 'repeat'], v: ['v', 'switch costume to'], n: ['t', 'play sound'], a: ['a', 'if path'], q: ['e', 'when touching'], f: ['e', 'when ▶ clicked'], z: ['o', 'set'], c: ['o', 'change'], i: ['a', 'if'], g: ['e', 'game over'], y: ['h', 'go to'], m: ['o', 'random'] }
// mb('r') · mb('s','Salom!') · mb('r','', 'yon') · mb('x', '4,2') — go to manzili (3-dars; sonlar oq kapsulada, data-x / data-y — blockly.js, blokXY)
const mbXY = (m) => { const [x = 0, y = 0] = String(m === 'Salom!' ? '0,0' : m).split(','); return [+x || 0, +y || 0] }
// 4-dars: mb('k', 'right') — hodisa bloki, tugma oq kapsulada (data-tugma — blockly.js, blokTugma)
const TUGMA_K = { right: '→', left: '←', up: '↑', down: '↓', space: 'space', any: 'any' } // any — 12-dars
// 5-dars: mb('p', '3') — takrorlash sarlavhasi (data-n); ichidagi bloklar bilan — takror('3', ichki HTML), dvigatel/qismlar.mjs
// 7-dars: mb('v', 'xursand') — kostyum, mb('n', 'qadam') — tovush; qiymat oq kapsulada (data-q — blockly.js, blokQiymat)
const KOS_NOM = { xotirjam: 'xotirjam', xursand: 'xursand', hayron: 'hayron', oylanadi: 'o‘ylanadi' }
// 8-dars: mb('a', 'right') — shart sarlavhasi (data-yon), tomon oq kapsulada; ichidagi bloklar bilan — shart('right', ichki)
// 11-dars: mb('q', 'gold') — olmaga tekkanda (data-q: apple | gold); mb('f') — «▶ Boshlash» bosilganda; mb('z', 0) — set ball to 0, mb('c', 1) — change ball by 1 (data-n)
const OLMA_NOM = { apple: 'apple', gold: 'gold apple', cactus: 'cactus' }
const mb = (t, matn = 'Salom!', cls = '') => { const [f, nom] = BL[t]; if (t === 'q') { const q = OLMA_NOM[matn] ? matn : 'apple'; return `<span class="mb f-${f} ${cls}" data-tur="q" data-q="${q}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${OLMA_NOM[q]}</i></span></span>` } // 13-dars: mb('y', '0,0') — go to son katakli (katak «rA-B» bo'lsa — ichida random oval), mb('m', '1-10') — random bloki
  const rndI = (sp) => { const [a, c] = sp.slice(1).split('-'); return `<span class="mrnd">random <i>${a}</i> to <i>${c}</i></span>` }
  if (t === 'y') { const [x0 = '0', y0 = '0'] = String(matn === 'Salom!' ? '0,0' : matn).split(','); return `<span class="mb f-${f} ${cls}" data-tur="y" data-x="${x0}" data-y="${y0}">${IKON.x}<span>${nom}</span><span class="xy">x: ${/^r/.test(x0) ? rndI(x0) : `<i>${x0}</i>`} y: ${/^r/.test(y0) ? rndI(y0) : `<i>${y0}</i>`}</span></span>` }
  if (t === 'm') { const [a = '1', c = '10'] = String(matn === 'Salom!' ? '1-10' : matn).split('-'); return `<span class="mb f-${f} mb-oval ${cls}" data-tur="m" data-ra="${a}" data-rb="${c}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${a}</i> to <i>${c}</i></span></span>` }
  if (t === 'f' || t === 'g') return `<span class="mb f-${f} ${cls}" data-tur="${t}">${IKON[t]}<span>${nom}</span></span>`; if (t === 'z' || t === 'c' || t === 'i') { const s0 = String(matn), [v0, n0] = s0.indexOf(':') >= 0 ? s0.split(':') : ['', s0], n = /^-?\d+$/.test(n0) ? n0 : t === 'c' ? '1' : '0', vr = v0 || (typeof DARS !== 'undefined' && DARS.ozgaruvchi && DARS.ozgaruvchi[0]) || 'ball', nk = +n < 0 ? '−' + -n : n; return `<span class="mb f-${f} ${cls}" data-tur="${t}"${v0 ? ` data-v="${v0}"` : ''} data-n="${n}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${vr}</i> ${t === 'z' ? 'to' : t === 'c' ? 'by' : '='} <i>${nk}</i>${t === 'i' ? ' then' : ''}</span></span>` } if (t === 'a') { const y = TUGMA_K[matn] && matn !== 'space' ? matn : 'right'; return `<span class="mb f-${f} ${cls}" data-yon="${y}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${TUGMA_K[y]}</i> then</span></span>` } if (t === 'v' || t === 'n') { const q = matn === 'Salom!' ? (t === 'v' ? 'xursand' : 'qadam') : matn; return `<span class="mb f-${f} ${cls}" data-q="${q}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${KOS_NOM[q] || q}</i></span></span>` } if (t === 'p') { const n = /^\d+$/.test(String(matn)) ? matn : '3'; return `<span class="mb f-${f} ${cls}" data-n="${n}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${n}</i></span></span>` } if (t === 'k') { const k = TUGMA_K[matn] ? matn : 'right'; return `<span class="mb f-${f} ${cls}" data-tugma="${k}">${IKON[t]}<span>${nom}</span><span class="xy"><i>${TUGMA_K[k]}</i> key pressed</span></span>` } if (t === 'x') { const [x, y] = mbXY(matn); return `<span class="mb f-${f} ${cls}" data-x="${x}" data-y="${y}">${IKON[t]}<span>${nom}</span><span class="xy">x: <i>${x}</i> y: <i>${y}</i></span></span>` } return `<span class="mb f-${f} ${cls}">${IKON[t]}<span>${nom}</span>${t === 's' ? `<span class="inp">${matn}</span>` : ''}</span>` }
const yigma = (arr) => `<div class="mbw">${arr.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div>`
const OILA = { h: ['Harakat', 'r'], g: ['Gap', 's'], e: ['Hodisa', 'k'], b: ['Takrorlash', 'p'], v: ['Ko‘rinish', 'v'], t: ['Tovush', 'n'], a: ['Shart', 'a'], o: ['O‘zgaruvchi', 'c'] }
// takrorlash bloki ichidagilari bilan (tayyor dastur HTML'i): ichki — [t | [t, m]…]; blockly.js uni ichma-ich o'qiydi (.c-blok)
const shart = (yon, ichki) => `<div class="c-blok" data-yon="${yon}">${mb('a', yon)}<div class="c-ich">${ichki.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div><span class="c-tub"></span></div>`
const takror = (n, ichki) => `<div class="c-blok" data-n="${n}">${mb('p', String(n))}<div class="c-ich">${ichki.map((x) => (typeof x === 'string' ? mb(x) : mb(...x))).join('')}</div><span class="c-tub"></span></div>`
const rang = (f, cls = '') => `<span class="rd f-${f} ${cls}"><i>${IKON[OILA[f][1]]}</i><small>${OILA[f][0]}</small></span>`
// 5a: javondagi oilalar va bloklar — dars e'lonidan (DARS.javon; 2-darsda faqat Harakat: r, l, u, d), bo'lmasa 1-darsdagi to'plam
const PAL = DARS.javon || { h: ['r', 'l', 'j'], g: [['s', 'Salom!']] }
const ranglar = (aktiv, holat = {}) => `<div class="rg" data-z="ranglar">${Object.keys(PAL).map((f) => rang(f, (aktiv === f ? 'on ' : '') + (holat[f] || ''))).join('')}</div>`
const palitra = (f, ochiq = PAL[f].length) => `<div class="pl" data-z="bloklar"><small class="f-${f}">${OILA[f][0]}</small>${PAL[f].map((b, i) => `<div class="mbw${i >= ochiq ? ' yopiq' : ''}">${typeof b === 'string' ? mb(b) : mb(...b)}</div>`).join('')}</div>`
const dastur = (arr, yuz, iz = '') => `<div class="dst" data-z="dastur"><span class="dsb"><span class="dyz">${yuz}</span><b>Dastur</b></span>${arr.length ? yigma(arr) : '<span class="bosh">Blokni shu yerga ulang</span>'}${iz || `<small class="dsn">${arr.length} ta blok</small>`}</div>`
const momiqYuz = () => (globalThis.QAH === 'coddy' ? bust('xursand') : hero({ k: globalThis.QAH || 'momiq', lite: true }))
const coddyYuz = () => bust('xursand')
const ust = (tag, h, iz = '') => `<div class="ust" data-z="sarlavha"><span class="tag">${tag}</span><h3 class="sar">${h}</h3>${iz ? `<span class="iz">${iz}</span>` : ''}</div>`
// dunyo: null — manzarasiz (labirint butun oynani egallaydi, 99-qaror)
// dst — dastur ustunining o'zi (3-dars «oldindan ayting»: tayyor dastur sanoq yozuvlari bilan); berilmasa — dastur(prog, yuz)
const studiya = ({ tag, h, iz, aktiv = 'h', holat, ochiq, prog, yuz, sahna, extra = '', dunyo = 'hovli', dst }) => `${ust(tag, h, iz)}${ranglar(aktiv, holat)}${palitra(aktiv, ochiq)}${dst || dastur(prog, yuz)}<div class="oyna">${dunyo ? world(dunyo) : ''}${sahna}</div>${extra}`
const fB = ({ mas = '', hint = '', label = `${PLAY}Ishga tushir`, chap } = {}) => `<footer class="hn">${chap || `<span class="mas ${mas}">${LAMP}Maslahat</span>`}<span class="hint">${hint}</span><span class="asos">${label}</span></footer>`
const fU = (hint, label) => `<footer class="hn"><span class="orq">‹ Orqaga</span><span class="hint">${hint}</span><span class="asos">${label}</span></footer>`
// v3.2 (F-1116-01): kirishda butun kurs emas — Blok studiya modulida yasaladigan o'yinlar (rasmlari; kartalari — dars qismlarida, oyinlar)
const ichSvg = (svg, x, y, w, h) => svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `)
const OLMA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8c-.6-2.4-2.6-3.6-2.6-3.6" fill="none" stroke="#6B4423" stroke-width="1.7" stroke-linecap="round"/><path d="M12.6 6.6c1.4-2.4 4.4-2.4 4.4-2.4-.4 2.4-2.6 3.2-4.4 2.4z" fill="#4CB050"/><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#F0435A"/><ellipse cx="8.6" cy="11.8" rx="1.3" ry="2.1" fill="#fff" opacity=".5"/></svg>'
const RAKETA = '<svg viewBox="0 0 24 34" aria-hidden="true"><path d="M12 1c4.6 3.8 6.2 9.4 6.2 14.6V23H5.8v-7.4C5.8 10.4 7.4 4.8 12 1z" fill="#F4F6FB"/><circle cx="12" cy="11.5" r="3" fill="#3FA2FF" stroke="#0D2137" stroke-width="1.2"/><path d="M5.8 16.5L1.6 23v3.4l4.2-2.2zM18.2 16.5l4.2 6.5v3.4l-4.2-2.2z" fill="#FF4F28"/><path d="M8.4 23h7.2l-1.5 3.4H9.9z" fill="#0D2137"/><path d="M10 26.4h4l-2 6.4z" fill="#FFC93C"/></svg>'
const dushman = (c) => `<svg viewBox="0 0 24 20" aria-hidden="true"><path d="M6 5L4 1.6M18 5l2-3.4" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="12" cy="11.5" rx="10" ry="7.4" fill="${c}"/><circle cx="8.4" cy="10.6" r="2.6" fill="#fff"/><circle cx="15.6" cy="10.6" r="2.6" fill="#fff"/><circle cx="8.9" cy="11" r="1.2" fill="#0D2137"/><circle cx="16.1" cy="11" r="1.2" fill="#0D2137"/></svg>`
const BALL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C"/></svg>'
// labirint: 120x96 maydon, ikki devor; qahramon yo'l bo'ylab yulduzga boradi
const labirint = () => `<svg class="lbs" viewBox="0 0 200 96" aria-hidden="true"><rect x="2" y="2" width="196" height="92" rx="8" fill="#F4FBEF" stroke="#2E7D4F" stroke-width="4"/><path class="lb-d" d="M40 34V94M80 2V62M120 34V94M160 2V62"/><path class="lb-iz" d="M20 80V16H60V80H100V16H140V80H180V30"/><g transform="translate(169 6) scale(.92)"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C" stroke="#E8A90C" stroke-width="1.2" stroke-linejoin="round"/></g><g class="lb-q">${ichSvg(hero({ k: 'katak', mood: 'xursand', lite: true }), -11, -13, 22, 24)}</g></svg>`

// v3.2 (F-1116-04): sinf doskasida pog'onalar — zinapoya. Har pog'ona: raqam, kichik rasm, bir qator topshiriq, nechta bola
const ODAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.6" r="4.2" fill="currentColor"/><path d="M3.6 21.4c.7-4.8 4.2-7.6 8.4-7.6s7.7 2.8 8.4 7.6z" fill="currentColor"/></svg>'
const miniYol = ({ q, y, yo = [], n = 6 }) => {
  const X = (i) => 9 + i * (82 / (n - 1)), Y = 36
  const yoy = yo.map(([a, b, c = '#FF4F28']) => { const xa = X(a), xb = X(b), h = Math.abs(b - a) > 1 ? 6 : 16, d = b > a ? 1 : -1; return `<path d="M${xa} ${Y - 4} Q${(xa + xb) / 2} ${h} ${xb} ${Y - 5}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="3.2 3"/><path d="M${xb - 3 * d} ${Y - 10}L${xb + 0.6 * d} ${Y - 4.4}L${xb + 3.4 * d} ${Y - 11}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` }).join('')
  return `<svg class="mini" viewBox="0 0 100 44" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<ellipse cx="${X(i)}" cy="${Y + 2}" rx="6.2" ry="2.8" fill="${i === y ? '#F3D36E' : i === q ? '#CFE0F6' : '#FFFDF7'}" stroke="${i === y ? '#C79F33' : i === q ? '#9DB7DA' : '#C8B892'}" stroke-width="1.1"/>`).join('')}${yoy}<g transform="translate(${X(y) - 6.5} ${Y - 15}) scale(.54)"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C" stroke="#E8A90C" stroke-width="1.4" stroke-linejoin="round"/></g>${ichSvg(hero({ k: 'momiq', mood: 'xursand', lite: true }), X(q) - 8, Y - 17, 16, 18)}</svg>`
}
const bloklar9 = () => `<svg class="mini" viewBox="0 0 100 44" aria-hidden="true">${Array.from({ length: 9 }, (_, i) => `<rect x="${6 + i * 10}" y="${i < 6 ? 14 : 14}" width="8.4" height="14" rx="2" fill="${i < 6 ? '#2F8FF0' : '#7DBBFA'}"/><path d="M${8.4 + i * 10} 21h3.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`).join('')}<text x="50" y="41" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="9" fill="#0D2137">6 + 3</text></svg>`
// 5b-2: zinapoya ro'yxati (P) berilishi mumkin — bir darsda bir necha zinapoya (2-darsda uchta); berilmasa — dars qismlaridagi POGONA
const zina = (P = POGONA) => {
  const cx = (i) => 16 + i * 22.5, cy = (i) => 91.3 - i * 5.5
  const yoy = Array.from({ length: P.length - 1 }, (_, i) => i).map((i) => `<path d="M${(cx(i) + 5).toFixed(1)} ${(cy(i) - 1.5).toFixed(1)} Q${((cx(i) + cx(i + 1)) / 2).toFixed(1)} ${(Math.min(cy(i), cy(i + 1)) - 15).toFixed(1)} ${(cx(i + 1) - 5).toFixed(1)} ${(cy(i + 1) - 1.5).toFixed(1)}"/>`).join('')
  return P.map(([n, son, rasm, matn], i) => `<div class="gl pg-k${n === '★' ? ' yd' : ''}" style="--i:${i}" data-z="pog‘ona"><div class="pg-t"><span class="pg-n">${n}</span><span class="pg-s" aria-label="${son} bola">${ODAM}<b>${son}</b></span></div>${rasm}<span class="pg-m">${matn}</span></div>`).join('')
    + `<svg class="zina-yoy" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${yoy}</svg>`
    + P.map(([n], i) => `<span class="z pg-z${n === '★' ? ' y' : ''}" style="--i:${i}">${n === '★' ? YUL : `<b>${n}</b>`}</span>`).join('')
}

// v3.2 (38-qaror): tepada faqat dars nomi — bekat chizig'i yo'q; qayerdaligimizni reja xaritasi har bekat boshida ko'rsatadi
const bosh = () => `<header class="hb"><span class="hl"><i></i>${DARS.raqam}-dars · ${DARS.nom}</span></header>`
const NOUT = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="1.6" fill="none" stroke="#0D2137" stroke-width="2"/><path d="M2 19h20" stroke="#0D2137" stroke-width="2.2" stroke-linecap="round"/></svg>'
const O = (n, cls = '') => `<span class="O ${cls}">${n}</span>`

// v3.3 (F-1116-08): javob kartalari rasmli — rang + belgi (karnay, sichqoncha ko'rsatkichi, buyruq strelkasi)
const PIK = {
  A: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.4v5.2h3.3l7.4 4.4V5L6.3 9.4z" fill="#fff"/><path d="M16.6 9c.9.8 1.4 1.9 1.4 3s-.5 2.2-1.4 3M19 6.6c1.6 1.4 2.5 3.3 2.5 5.4s-.9 4-2.5 5.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
  B: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 3.2l12.2 7.4-5.4 1.5 3.3 6-2.7 1.5-3.3-6-4.1 3.9z" fill="#fff" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  C: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h12.5M11.5 6.5L17 12l-5.5 5.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}
// v3.4 (F-1116-11): «uch taxmin — uch sinov»: kartada nechta bola tanlagani (son) va sinov natijasi (✕ qimirlamadi / ✓ ishladi)
const kartalarR = (arr, cls = '', { son = {}, nat = {}, sin = '' } = {}) => `<div class="jv rasmli ${cls}">` + arr.map(([l, t]) => `<div class="jk ${SH[l]}${nat[l] ? (nat[l] === 'ok' ? ' n-ok' : ' n-yoq') : ''}${sin === l ? ' sinov' : ''}"><span class="jr ${SH[l]}">${PIK[l]}${son[l] != null ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}${son[l]}</span>` : ''}</span><span class="jt"><span><b>${l}</b>${t}</span>${nat[l] ? `<small class="jn">${nat[l] === 'ok' ? '✓ ishladi' : '✕ qimirlamadi'}</small>` : ''}</span></div>`).join('') + '</div>'
// v4.1 (F-1116-15): savol — o'rgatish ekrani, ikki ustunda: chapda yuqoridan pastga savol → Coddy gapi → javob kartalari; o'ngda faqat sahna (sinov shu yerda bo'ladi)
const QAYSI = (javob, gap = 'Noutbukda bitta javobni tanlang.', { tag = 'Savol', h = DARS.savol, aktyor = coddyQ('', 'oylaydi', 'savol'), chapOst = '', sahna = '' } = {}) => `<div class="chap">${matn(tag, h, gap)}${javob}${chapOst}</div><div class="oyna">${world('hovli')}${sahna}${yol('p3b', aktyor)}</div>`

// v3.3 (F-1116-09/10): reja — yo'l xaritasi. Coddy start zonachasida, uch bekat (rangi — oilasi), orasida sakrash yoylari; o'tilgani oltin.
// Xarita darsda to'rt marta chiqadi (38-qaror): reja, 2-bekat boshi, 3-bekat boshi, yakun.
const YULDUZ_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#fff"/></svg>'
const xarita = ({ otdi = 0, joy = 0, pose = 'salom', yuz = 'xursand' } = {}) => {
  const cx = (i) => 12.5 + i * 25
  const yoy = [0, 1, 2].map((i) => `<path class="${i < otdi ? 'otdi' : ''}" d="M${cx(i) + 6} 64 Q${cx(i) + 12.5} -12 ${cx(i + 1) - 6} 64"/>`).join('')
  const bekat = BEKATLAR.map(([f, nom, ik], i) => { const n = i + 1, h = n <= otdi ? 'otdi' : n === otdi + 1 ? 'hozir' : ''; return `<div class="bk bk-${f} ${h}" style="--i:${n}">${joy === n ? '' : `<span class="bk-i">${ik}</span>`}<span class="bk-z"></span><span class="bk-l">${h === 'otdi' ? '<i>✓</i>' : `<i>${n}</i>`}${nom}</span></div>` }).join('')
  return `<div class="xr"><svg class="xr-yoy" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${yoy}</svg><div class="bk bk-s" style="--i:0"><span class="bk-z"></span></div>${bekat}<div class="xr-q" style="--i:${joy}">${robot({ pose, yuz })}</div></div>`
}
// 16.11 (boshliq tanlovi, C «Tepalik»): reja — pastdan yuqoriga ko'tariladigan yo'l; cho'qqida — dars oxiridagi natija.
// otdi — o'tilgan bekatlar soni (yoyi oltin, belgisi ✓); joy — Coddy turgan joy (0 — start, 1…3 — bekat); cho — cho'qqidagi karta.
const TP = [[30, 8], [50, 22], [70, 36]]
const TP_IZ = ['M13 90 Q20 72 28 84', 'M32 82 Q40 58 48 70', 'M52 66 Q60 44 68 56', 'M72 52 Q78 40 82 46']
const tepalik = ({ otdi = 0, joy = 0, pose = 'salom', yuz = 'xursand' } = {}) => {
  const q = (cls = '') => `<span class="tp-q aktyor ${cls}">${robot({ pose, yuz })}</span>`
  const iz = `<svg class="tp-iz" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${TP_IZ.map((d, i) => `<path class="${i < otdi || (i === 3 && otdi >= 3) ? 'otdi' : ''}" d="${d}"/>`).join('')}</svg>`
  const start = `<div class="tp-st tp-s tp-start">${joy === 0 ? q('katta') : ''}<span class="tp-pl"></span></div>`
  const bekat = BEKATLAR.map(([f, nom, ik], i) => { const n = i + 1, h = n <= otdi ? 'otdi' : n === otdi + 1 ? 'hozir' : ''; return `<div class="tp-st tp-${f} ${h}" style="left:${TP[i][0]}%;bottom:${TP[i][1]}%">${joy === n ? q() : `<i>${ik}</i>`}<span class="tp-pl"></span><b><em>${h === 'otdi' ? '✓' : n}</em>${nom}</b></div>` }).join('')
  return iz + start + bekat
}
const KONFETI = () => `<div class="konfeti">${Array.from({ length: 18 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 6) * 0.15}s;--r:${(i * 47) % 360}deg" class="k${i % 4}"></i>`).join('')}</div>`

// ===== v4 (16.11 tun): darsning hali chizilmagan ekranlari — kutish, qahramon tanlash, YUR!, xulosa, «Men robotman», ism va rang,
// say yozuvi, ustozning sahnasi, o'z sahnangiz (doska, joy, studiya), galereya. Hammasi o'sha to'rt shablonda.
const fKid = (hint, label) => `<footer class="hn"><span class="hint">${hint}</span><span class="asos">${label}</span></footer>`
const aktyorQ = (svg, cls = '') => `<div class="q aktyor ${cls}">${svg}</div>`
// Kutish shabloni (t4): butun ekran hovli (kechqurun yoki kunduz), tepada o'rtada bitta yozuv, qahramon yo'l qatlamida
const kutish = ({ kech = true, uq = '↑', h, sub = '', aktyor, dunyo = 'hovli', extra = '' }) => `<div class="oyna to${kech ? ' kech' : ''}">${world(dunyo)}${kech ? '<div class="parda"></div>' : ''}<div class="gl qarang" data-z="yozuv">${uq ? `<span class="uq">${uq}</span>` : ''}<b>${h}</b>${sub ? `<span>${sub}</span>` : ''}</div>${extra}${aktyor}</div>`
const yolchaYakka = (aktyor, cls = 'yk') => `<div class="yol c1 ${cls}">${aktyor}<span class="z z0 s"></span></div>`
const QAHRAMONLAR = ['momiq', 'jele', 'katak', 'yulduz', 'nihol']
const QNOM = { momiq: 'Momiq', jele: 'Jele', katak: 'Katak', yulduz: 'Zippi', nihol: 'Nihol' }
// sinf taxtasi: Coddy (ustoz) + 14 o'rin; tanlaganlar qahramoni ismsiz, qolgani bo'sh zonacha
const taxta = (son) => {
  const orin = Array.from({ length: 14 }, (_, i) => i < son ? `<span class="tx-o"><span class="aktyor tx-q">${hero({ k: QAHRAMONLAR[(i * 3) % 5], mood: 'xursand', lite: true })}</span><i class="z"></i></span>` : '<span class="tx-o bosh"><i class="z"></i></span>')
  return `<div class="taxta"><span class="tx-o tx-u"><span class="aktyor tx-q c">${robot({ pose: 'salom', yuz: 'xursand', lite: true })}</span><i class="z s"></i><small>Ustoz</small></span>${orin.join('')}</div>`
}
const tanlovQator = (tanlangan) => `<div class="tq">${QAHRAMONLAR.map((k) => `<span class="tq-o${k === tanlangan ? ' on' : ''}"><span class="aktyor tq-q">${hero({ k, mood: 'xursand', mv: k === tanlangan ? 'sakraydi' : undefined })}</span><i class="z${k === tanlangan ? ' y' : ''}"></i><small>${QNOM[k]}</small></span>`).join('')}</div>`
const olchagich = (foiz) => `<div class="olch" role="img" aria-label="Sinf ovozi ${foiz} foiz"><small>Sinf ovozi</small><span class="olch-b"><i style="width:${foiz}%"></i></span></div>`
const YURPUF = `<div class="yurp" aria-hidden="true">${[[18, 0], [42, .5], [66, 1], [30, 1.4], [56, 1.9]].map(([x, d]) => `<span style="--x:${x}%;--d:${d}s">YUR!</span>`).join('')}</div>`
const BUYRUQ = (t) => `<div class="buy"><span class="buy-b">${yigma([t])}</span></div>`
const RANGLAR8 = ['#FF7A59', '#F5B82E', '#38C793', '#3FA2FF', '#8B5CF6', '#FF5FA2', '#0D2137', '#A7ABB4']
const JOYLAR = [['hovli', 'Hovli'], ['kosmos', 'Kosmos'], ['suv', 'Suv osti']]
const joyKarta = (k, nom, { on = false, son, qq = [] } = {}) => `<div class="gl jy${on ? ' on' : ''}"><div class="jy-r">${world(k, true)}${qq.length ? `<span class="jy-qq">${qq.map((h) => `<i>${hero({ k: h, mood: 'xursand', lite: true })}</i>`).join('')}</span>` : ''}</div><b>${nom}</b>${son != null ? `<span class="pg-s jy-s" aria-label="${son} bola">${ODAM}<b>${son}</b></span>` : ''}</div>`
const SHIK = { jump: IKON.j, joy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" fill="#fff"/><circle cx="12" cy="9.5" r="2.6" fill="#38C793"/></svg>', blok: IKON.r, gap: IKON.s }
const shartlar = (bajarildi = {}, qisqa = false) => `<div class="sh-l">${SHART.map(([k, t, q]) => `<span class="sh-r sh-${k}${bajarildi[k] ? ' ok' : ''}"><i>${SHIK[k]}</i>${qisqa ? q : t}${bajarildi[k] ? '<b>✓</b>' : ''}</span>`).join('')}</div>`
const zippiQ = (pose = 'xursand', mv) => `<div class="q kichik aktyor">${hero({ k: globalThis.QAH || 'yulduz', mood: pose, mv })}</div>`
const KURSOR = '<span class="kursor-q" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6.2 3.2l12.2 7.4-5.4 1.5 3.3 6-2.7 1.5-3.3-6-4.1 3.9z" fill="#0D2137" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg></span>'
const yulduzlar14 = (n) => `<div class="yulduzlar">${Array.from({ length: 14 }, (_, i) => `<i class="${i < n ? 'on' : ''}">${ODAM}</i>`).join('')}</div>`
// olma yo'lning o'zida: zonachasi ustida (yol(...) qatoriga grid elementi bo'lib qo'shiladi)
const yolOlma = (cls, aktyor, n, star, olma) => yol(cls, aktyor, n, star).replace(/<\/div>$/, `<span class="olma-z" style="grid-column:${olma + 1}">${OLMA}</span></div>`)
const sinfNatija = (T = SINF_T) => `<div class="sn">${T.map(([f, ik, nom, son]) => `<div class="sn-t sn-${f}" data-k="${nom}"><i>${ik}</i><span><b>${son}</b><small>${nom}</small></span></div>`).join('')}</div>`

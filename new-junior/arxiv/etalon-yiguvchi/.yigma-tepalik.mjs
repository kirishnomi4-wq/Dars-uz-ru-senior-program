// Etalon v3.4 (F-1116-11…13: uch taxmin — uch sinov, vaqt so'zi, bo'sh joy mazmun bilan — quti cho'zilmaydi).
import { hero, robot, world } from '../src/chizma/dvigatel.js'
import { readFileSync, writeFileSync } from 'node:fs'
const V = new URL('.', import.meta.url).pathname.replace(/\/$/, '')
const OUT = process.argv[2] || V + '/etalon.html'
const HARAKAT = readFileSync(V + '/../src/chizma/harakat.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
const MAKET = readFileSync(V + '/maket.css', 'utf8').split('\n').slice(0, 101).join('\n')

const OYOQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="8" cy="15" rx="3.6" ry="5.4" fill="#fff"/><ellipse cx="16" cy="9" rx="3.6" ry="5.4" fill="#fff"/></svg>'
const YUL = '<svg class="yul" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C" stroke="#E8A90C" stroke-width="1.2" stroke-linejoin="round"/><path d="M9.3 8.6l1.2-2.4" stroke="#fff6cf" stroke-width="1.4" stroke-linecap="round"/></svg>'
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="#fff"/></svg>'
const QALAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.6L15.6 5a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" fill="#E7CA66"/><path d="M4 20l1.2-4.6 3.4 3.4z" fill="#0D2137"/></svg>'
const LAMP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" fill="#E7CA66"/><rect x="9" y="17.5" width="6" height="2.2" rx="1" fill="#0D2137"/></svg>'
const QAYTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 1 0 2.1-5" fill="none" stroke="#0D2137" stroke-width="2.4" stroke-linecap="round"/><path d="M4 4v4.5h4.5" fill="none" stroke="#0D2137" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>'
const blk = (cls = '') => `<span class="blk ${cls}">${OYOQ}1 qadam yur</span>`

const bust = (yuz = 'xursand') => robot({ pose: 'salom', yuz, lite: true }).replace('viewBox="0 0 260 240"', 'viewBox="50 -12 160 160"')
const cg = (gap, yuz) => `<div class="cg"><span class="av">${bust(yuz)}</span><p><small>Coddy</small>${gap}</p></div>`
const matn = (tag, h, gap, extra = '', yuz) => `${tag ? `<span class="tag">${tag}</span>` : ''}<h3 class="sar">${h}</h3>${gap ? cg(gap, yuz) : ''}${extra}`
const daftar = (t) => `<span class="daf">${QALAM}<span>Daftarga yozing: <b>${t}</b></span></span>`
const mis = () => `<div class="mis"><div>${blk('yonadi')}<span class="ar">→</span><b>1 qadam</b></div><div>${blk()}${blk()}<span class="ar">→</span><b>2 qadam</b></div></div>`
// v3.1 (F-1115-10): yo'l — zonachalar (0 = start) va ular orasida sakrash yoylari; o'tilgan yoy oltin
const zona = (i, star, at) => `<span class="z z${i}${i === 0 ? ' s' : ''}${i === star ? ' y' : ''}">${i ? `<b>${i}</b>` : ''}${i === star && at !== star ? YUL : ''}</span>`
const yoylar = (n, at) => { const C = n + 1, cx = (i) => ((i + 0.5) / C) * 100; return `<svg class="yoy" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<path class="${i < at ? 'otdi' : ''}" d="M${(cx(i) + 2.5).toFixed(1)} 9.5 Q${((cx(i) + cx(i + 1)) / 2).toFixed(1)} -6 ${(cx(i + 1) - 2.5).toFixed(1)} 9.5"/>`).join('')}</svg>` }
const yol = (cls, aktyor, n = 3, star = 3) => { const at = +((aktyor.match(/\bat(\d)\b/) || [])[1] || 0); return `<div class="yol c${n + 1} ${cls}">${aktyor}${yoylar(n, at)}${Array.from({ length: n + 1 }, (_, i) => zona(i, star, at)).join('')}</div>` }
const coddyQ = (cls = '', pose = 'korsatadi', yuz = 'xursand') => `<div class="q ${cls}">${robot({ pose, yuz })}</div>`
const momiqQ = (cls = '', mood = 'xursand', mv) => globalThis.QAH === 'coddy' ? `<div class="q ${cls}">${robot({ pose: 'turadi', yuz: 'xursand' })}</div>` : `<div class="q kichik ${cls}">${hero({ k: globalThis.QAH || 'momiq', mood, mv })}</div>`
const SH = { A: 'c1', B: 'c2', C: 'c3' }
const kartalar = (arr, cls = '') => `<div class="jv ${cls}">` + arr.map(([l, t, extra = '', k = '']) => `<div class="jk ${SH[l]} ${k}"><i class="sh ${SH[l]}"></i><span class="jt"><b>${l}</b>${t}</span>${extra}</div>`).join('') + '</div>'
const bar = (n, foiz) => `<span class="son">${n}</span><span class="bar"><i style="width:${foiz}%"></i></span>`
const TERM = [['u', 'Buyruq', 'Kompyuterga aytiladigan aniq ish'], ['b', 'Blok', 'Bitta buyruq'], ['d', 'Dastur', 'Buyruqlar ro‘yxati']]
const terminlar = () => '<div class="tm">' + TERM.map(([k, n, t]) => `<div class="tr"><span class="ti ${k}">${k === 'u' ? '!' : k === 'b' ? OYOQ : '<i></i><i></i><i></i>'}</span><span><b>${n}</b>${t}</span></div>`).join('') + '</div>'
const natija = (cls = '') => `<div class="nt ${cls}"><small>Sinfimiz bugun</small><div class="ns"><span><b>210</b>qadam</span><span><b>54</b>gap</span><span><b>8</b>sahna</span></div><div class="kd"><small>Keyingi dars</small><b>2 · Labirint</b></div></div>`
const qahramonlar = () => `<div class="qq"><span class="m1">${hero({ k: 'momiq', mood: 'xursand' })}</span><span class="m2">${robot({ pose: 'quvonadi' })}</span><span class="m3">${hero({ k: 'katak', mood: 'xursand' })}</span></div>`

const fUstoz = (hint, soat, label) => `<footer class="hn"><span class="orq">‹ Orqaga</span><span class="hint">${hint}</span><span class="soat">${soat}</span><span class="asos">${label}</span></footer>`
const fBola = ({ mas = '', blok = 3, label = `${PLAY}Ishga tushir`, chap } = {}) => `<footer class="hn dastur">${chap || `<span class="mas ${mas}">${LAMP}Maslahat</span>`}<span class="yz">${hero({ k: 'momiq', lite: true })}</span><span class="pr">${Array.from({ length: blok }, () => blk()).join('')}</span><span class="sanoq">${blok} ta blok</span><span class="asos">${label}</span></footer>`
const fJim = (t) => `<footer class="hn jim"><span class="hint">${t}</span></footer>`



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
const momiqYuz = () => (globalThis.QAH === 'coddy' ? bust('xursand') : hero({ k: globalThis.QAH || 'momiq', lite: true }))
const coddyYuz = () => bust('xursand')
const ust = (tag, h, iz = '') => `<div class="ust" data-z="sarlavha"><span class="tag">${tag}</span><h3 class="sar">${h}</h3>${iz ? `<span class="iz">${iz}</span>` : ''}</div>`
const studiya = ({ tag, h, iz, aktiv = 'h', holat, ochiq, prog, yuz, sahna, extra = '', dunyo = 'hovli' }) => `${ust(tag, h, iz)}${ranglar(aktiv, holat)}${palitra(aktiv, ochiq)}${dastur(prog, yuz)}<div class="oyna">${world(dunyo)}${sahna}</div>${extra}`
const fB = ({ mas = '', hint = '', label = `${PLAY}Ishga tushir`, chap } = {}) => `<footer class="hn">${chap || `<span class="mas ${mas}">${LAMP}Maslahat</span>`}<span class="hint">${hint}</span><span class="asos">${label}</span></footer>`
const fU = (hint, label) => `<footer class="hn"><span class="orq">‹ Orqaga</span><span class="hint">${hint}</span><span class="asos">${label}</span></footer>`
// v3.2 (F-1116-01): kirishda butun kurs emas — Blok studiya modulida yasaladigan o'yinlar
const ichSvg = (svg, x, y, w, h) => svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `)
const OLMA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8c-.6-2.4-2.6-3.6-2.6-3.6" fill="none" stroke="#6B4423" stroke-width="1.7" stroke-linecap="round"/><path d="M12.6 6.6c1.4-2.4 4.4-2.4 4.4-2.4-.4 2.4-2.6 3.2-4.4 2.4z" fill="#4CB050"/><path d="M12 8.4c-1.6-1.2-7-1.6-7.8 3.8-.6 4.4 2.6 8.8 5.2 8.8 1.2 0 1.6-.6 2.6-.6s1.4.6 2.6.6c2.6 0 5.8-4.4 5.2-8.8-.8-5.4-6.2-5-7.8-3.8z" fill="#F0435A"/><ellipse cx="8.6" cy="11.8" rx="1.3" ry="2.1" fill="#fff" opacity=".5"/></svg>'
const RAKETA = '<svg viewBox="0 0 24 34" aria-hidden="true"><path d="M12 1c4.6 3.8 6.2 9.4 6.2 14.6V23H5.8v-7.4C5.8 10.4 7.4 4.8 12 1z" fill="#F4F6FB"/><circle cx="12" cy="11.5" r="3" fill="#3FA2FF" stroke="#0D2137" stroke-width="1.2"/><path d="M5.8 16.5L1.6 23v3.4l4.2-2.2zM18.2 16.5l4.2 6.5v3.4l-4.2-2.2z" fill="#FF4F28"/><path d="M8.4 23h7.2l-1.5 3.4H9.9z" fill="#0D2137"/><path d="M10 26.4h4l-2 6.4z" fill="#FFC93C"/></svg>'
const dushman = (c) => `<svg viewBox="0 0 24 20" aria-hidden="true"><path d="M6 5L4 1.6M18 5l2-3.4" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="12" cy="11.5" rx="10" ry="7.4" fill="${c}"/><circle cx="8.4" cy="10.6" r="2.6" fill="#fff"/><circle cx="15.6" cy="10.6" r="2.6" fill="#fff"/><circle cx="8.9" cy="11" r="1.2" fill="#0D2137"/><circle cx="16.1" cy="11" r="1.2" fill="#0D2137"/></svg>`
const BALL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C"/></svg>'
// labirint: 120x96 maydon, ikki devor; qahramon yo'l bo'ylab yulduzga boradi
const labirint = () => `<svg class="lbs" viewBox="0 0 200 96" aria-hidden="true"><rect x="2" y="2" width="196" height="92" rx="8" fill="#F4FBEF" stroke="#2E7D4F" stroke-width="4"/><path class="lb-d" d="M40 34V94M80 2V62M120 34V94M160 2V62"/><path class="lb-iz" d="M20 80V16H60V80H100V16H140V80H180V30"/><g transform="translate(169 6) scale(.92)"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C" stroke="#E8A90C" stroke-width="1.2" stroke-linejoin="round"/></g><g class="lb-q">${ichSvg(hero({ k: 'katak', mood: 'xursand', lite: true }), -11, -13, 22, 24)}</g></svg>`
const oyinlar = () => `<div class="kurs">
  <div class="gl kr"><div class="kr-r lb">${labirint()}</div><div class="kr-t"><b>Labirint</b><small>2-darsda</small></div></div>
  <div class="gl kr"><div class="kr-r ol">${world('hovli', true)}<i class="olma o1">${OLMA}</i><i class="olma o2">${OLMA}</i><i class="olma o3">${OLMA}</i><span class="savat">${hero({ k: 'jele', mood: 'xursand', lite: true })}</span><span class="ball">${BALL}3</span></div><div class="kr-t"><b>Olma yig‘amiz</b><small>11-darsda</small></div></div>
  <div class="gl kr"><div class="kr-r ks">${world('kosmos', true)}<i class="dush d1">${dushman('#9A7BFF')}</i><i class="dush d2">${dushman('#38C793')}</i><i class="dush d3">${dushman('#FF7A59')}</i><span class="raketa"><i class="oq"></i><i class="oq o2"></i>${RAKETA}</span></div><div class="kr-t"><b>Kosmik o‘yin</b><small>17-darsda</small></div></div>
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
  ['1', 4, miniYol({ q: 0, y: 3, yo: [[0, 5]] }), 'Yulduzda to‘xtang'],
  ['2', 4, miniYol({ q: 3, y: 1, yo: [[3, 1, '#E8A90C']] }), 'Orqaga qayting'],
  ['3', 3, miniYol({ q: 0, y: 3, yo: [[0, 4, '#2F8FF0'], [4, 3, '#2F8FF0']] }), 'O‘ngga va chapga'],
  ['★', 3, bloklar9(), 'Aniq 9 ta blok'],
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

// v3.3 (F-1116-08): javob kartalari rasmli — rang + belgi (karnay, sichqoncha ko'rsatkichi, buyruq strelkasi)
const PIK = {
  A: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.4v5.2h3.3l7.4 4.4V5L6.3 9.4z" fill="#fff"/><path d="M16.6 9c.9.8 1.4 1.9 1.4 3s-.5 2.2-1.4 3M19 6.6c1.6 1.4 2.5 3.3 2.5 5.4s-.9 4-2.5 5.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
  B: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 3.2l12.2 7.4-5.4 1.5 3.3 6-2.7 1.5-3.3-6-4.1 3.9z" fill="#fff" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  C: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h12.5M11.5 6.5L17 12l-5.5 5.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}
// v3.4 (F-1116-11): «uch taxmin — uch sinov»: kartada nechta bola tanlagani (son) va sinov natijasi (✕ qimirlamadi / ✓ ishladi)
const kartalarR = (arr, cls = '', { son = {}, nat = {}, sin = '' } = {}) => `<div class="jv rasmli ${cls}">` + arr.map(([l, t]) => `<div class="jk ${SH[l]}${nat[l] ? (nat[l] === 'ok' ? ' n-ok' : ' n-yoq') : ''}${sin === l ? ' sinov' : ''}"><span class="jr ${SH[l]}">${PIK[l]}${son[l] != null ? `<span class="jr-s" aria-label="${son[l]} bola">${ODAM}${son[l]}</span>` : ''}</span><span class="jt"><span><b>${l}</b>${t}</span>${nat[l] ? `<small class="jn">${nat[l] === 'ok' ? '✓ ishladi' : '✕ qimirlamadi'}</small>` : ''}</span></div>`).join('') + '</div>'
// v4.1 (F-1116-15): savol — o'rgatish ekrani, ikki ustunda: chapda yuqoridan pastga savol → Coddy gapi → javob kartalari; o'ngda faqat sahna (sinov shu yerda bo'ladi)
const QAYSI = (javob, gap = 'Noutbukda bitta javobni tanlang.', { tag = 'Savol', h = 'Coddy‘ni <em>yulduzga</em> qanday olib boramiz?', aktyor = coddyQ('', 'oylaydi', 'savol'), chapOst = '', sahna = '' } = {}) => `<div class="chap">${matn(tag, h, gap)}${javob}${chapOst}</div><div class="oyna">${world('hovli')}${sahna}${yol('p3b', aktyor)}</div>`
const SONI = { A: 3, B: 7, C: 4 }
const JAVOBLAR = [['A', '«YUR!» deb aytamiz'], ['B', 'Sichqoncha bilan ko‘chiramiz'], ['C', 'Unga buyruq beramiz']]

// v3.3 (F-1116-09/10): reja — yo'l xaritasi. Coddy start zonachasida, uch bekat (rangi — oilasi), orasida sakrash yoylari; o'tilgani oltin.
// Xarita darsda to'rt marta chiqadi (38-qaror): reja, 2-bekat boshi, 3-bekat boshi, yakun.
const YULDUZ_OQ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#fff"/></svg>'
const BEKATLAR = [['h', 'Harakatlantirish', IKON.r], ['g', 'Gapirtirish', IKON.s], ['y', 'Sahna yaratish', YULDUZ_OQ]]
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
const darsOxiri = () => `<div class="gl kd3" data-z="dars oxirida"><small>Dars oxirida</small><div class="kd3-r">${world('kosmos', true)}<span class="kd3-q">${hero({ k: 'yulduz', mood: 'xursand', mv: 'sakraydi', lite: true })}</span><span class="kd3-p">Bu — mening sahnam!</span></div><b>O‘z sahnangiz</b></div>`
const keyingiDars = () => `<div class="gl kd3" data-z="keyingi dars"><small>Keyingi dars</small><div class="kd3-r lb">${labirint()}</div><b>2 · Labirint</b></div>`
const KONFETI = () => `<div class="konfeti">${Array.from({ length: 18 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 6) * 0.15}s;--r:${(i * 47) % 360}deg" class="k${i % 4}"></i>`).join('')}</div>`

const E = {
  P1: { rol: 'p', b: 0, t: 't1', nom: 'Kirish', fid: 'F-1116-01 · 07 · 12', izoh: 'v3.4: vaqt so‘z bilan aytiladi — sarlavha «Keyin — bloklardan o‘yin», Coddy «Bugun esa meni yurgizishni o‘rganasiz». Bola 1-darsda o‘yin yasaymiz deb o‘ylamaydi: o‘yinlar keyingi darslarda (2, 11, 17), bugun — Coddy’ni yurgizish. v3.3 dan: o‘yinlar uch qator — rasm, nomi, darsi, bola nima yasashi.',
    body: () => `<div class="chap">${matn('', 'Bugun birinchi <em>dasturingizni</em> tuzasiz!', 'Salom! Men Coddy. Bugun birga dasturlashni o‘rganamiz!')}<small class="kr-bosh">Blokli dasturlash modulimizda</small>${oyinlar()}</div><div class="oyna">${world('hovli')}${yol('p3b', coddyQ('', 'salom', 'xursand'))}</div>`,
    foot: () => fU('Kirdi: 12 / 14', 'Keyingi ›') },
  P2: { rol: 'p', b: 0, t: 't1', nom: 'Savol · uch taxmin', fid: 'F-1116-11', izoh: 'v3.4: «uch taxmin — uch sinov». Javoblar ochilgan lahza (2-qadam): har kartada nechta bola tanlagani — faqat son. Endi sinf ularni birma-bir sinaydi: «YUR!» deymiz, sudraymiz, buyruq beramiz; natija shu kartaning o‘zida chiqadi (keyingi ekran). 1-qadamda (bolalar tanlayotganda) son yo‘q.',
    body: () => QAYSI(kartalarR(JAVOBLAR, 'ch', { son: SONI }), 'Qaysi biri ishlaydi? Sinab ko‘ramiz.'),
    foot: () => fU('Javob berdi: 14 / 14', 'Sinab ko‘ramiz ›') },
  P2C: { rol: 'p', b: 0, t: 't1', nom: 'Savol · sinovdan keyin', fid: 'F-1116-11', izoh: 'v3.4: uch sinovdan keyin (5-qadam). A va B — «✕ qimirlamadi», xiralashgan; C — «✓ ishladi», oltin. Coddy buyruq bilan oltin yoylar bo‘ylab yulduzga sakrab o‘tdi. Har bola o‘z taxmini sinovdan o‘tganini ko‘rdi; «4 bola topdi» — C kartasidagi son.',
    body: () => QAYSI(kartalarR(JAVOBLAR, 'ch', { son: SONI, nat: { A: 'yoq', B: 'yoq', C: 'ok' } }), '«YUR!» ham buyruq, lekin men faqat blokni tushunaman.', { tag: 'Javob', h: 'Coddy faqat <em>blokni</em> tushunadi', aktyor: coddyQ('at3', 'quvonadi', 'xursand') }),
    foot: () => fU('', 'Keyingi ›') },
  P2N: { rol: 'b', b: 0, t: 't1', nom: 'Savol (noutbukda)', fid: 'F-1116-08', izoh: 'v3.3: rasmli kartalar — 9 yoshli bola yozuvni o‘qimasdan ham rasmdan taniydi. Tugma yo‘q — kartani bosishning o‘zi javob; bosgach «Katta ekranga qarang».',
    body: () => QAYSI(kartalarR(JAVOBLAR, 'ch'), 'Qaysi biri ishlaydi deb o‘ylaysiz?'),
    foot: () => fJim('Birini tanlang') },
  P3: { rol: 'p', b: 0, t: 't1', nom: 'Dasturlash nima?', fid: 'F-1115-01 · 05', izoh: 'Qabul qilingan. v3.4: cho‘zilgan qutilar olib tashlandi (kod qutisining 35% ida mazmun bor edi). Endi kod tepada, bloklar pastda — ikkalasi ustunning to‘liq kengligida va kattaroq; qutilar mazmuniga teng. Ikki qator va ikki blok — v3.2 dagidek.',
    body: () => `<div class="chap">${matn('Yangi so‘z', '<em>Dasturlash</em> nima?', 'Dasturlash — kompyuterga buyruq berish.')}<div class="ikki tik"><div class="kod"><small>Dasturchi yozadi</small><code>coddy.move("right")<br>coddy.move("right")</code></div><span class="ar2">=</span><div class="biz"><small>Biz ulaymiz</small>${yigma(['r', 'r'])}</div></div><p class="izq">Ikkalasi bir xil. Biz bloklardan foydalanamiz.</p></div><div class="oyna">${world('hovli')}${yol('p3b', coddyQ('at2', 'turadi', 'xursand'))}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P4: { rol: 'p', b: 0, t: 't2', nom: 'Reja — yo‘l xaritasi', fid: 'F-1116-09', izoh: 'v3.3: reja — yo‘l. Coddy start zonachasida; uch bekat — rangi o‘sha oilaning rangi (ko‘k Yurgizamiz, binafsha Gapirtiramiz, oltin O‘z sahnangiz), orasida sakrash yoylari; navbatdagi bekat miltillaydi. Tepada o‘ngda — dars oxirida nima bo‘lishi.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Bugungi reja', 'Bugun nima <em>o‘rganamiz</em>?', '')}</div>${darsOxiri()}${tepalik({ otdi: 0, joy: 0 })}</div>`,
    foot: () => fU('', 'Boshladik ›') },
  P4B: { rol: 'p', b: 2, t: 't2', nom: 'Xarita · 2-bekat boshi', fid: 'F-1116-09', izoh: 'v3.3: o‘sha xarita har bekat boshida qaytadi (bu — 10-sahna boshi). 1-bekat o‘tildi: yoyi oltin, yonida ✓; Coddy 1-bekatga sakrab o‘tgan; navbatdagi — Gapirtiramiz. Dars yo‘l bo‘ylab borayotgani shundan seziladi.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Bugungi reja · 2-bekat', 'Endi qahramonimiz <em>gapiradi</em>!', '')}</div>${darsOxiri()}${tepalik({ otdi: 1, joy: 1 })}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  B1: { rol: 'b', b: 1, t: 't3', nom: 'Ranglar', fid: 'F-1115-02', izoh: 'Qabul qilingan.',
    body: () => `${studiya({ tag: 'Blok studiya', h: 'Ko‘k blok <em>yurgizadi</em>, binafsha blok gapirtiradi', aktiv: 'h', holat: { h: 'ok', g: 'puls' }, prog: [], yuz: momiqYuz(), sahna: yol('b2', momiqQ()) })}<div class="xira"></div><div class="ishora">${O('👈')}Ko‘k doirachani bosing</div>`,
    foot: () => fJim('Ikkala rangni bosing · 1 / 2') },
  B2: { rol: 'b', b: 1, t: 't3', nom: 'Studiya', fid: 'F-1115-05 · 07', izoh: 'Qabul qilingan.',
    body: () => studiya({ tag: 'Mashq · 1-pog‘ona', h: 'Qahramoningizni <em>yulduzga</em> olib&nbsp;boring.', aktiv: 'h', ochiq: 1, prog: ['r', 'r', 'r'], yuz: momiqYuz(), sahna: yol('b2', momiqQ(), 4, 3) }),
    foot: () => fB({ hint: 'Qadamlarni sanang: yulduzgacha nechta?' }) },
  B3: { rol: 'b', b: 1, t: 't3', nom: 'Xato', fid: 'F-1116-05', izoh: 'Qabul qilingan.',
    body: () => studiya({ tag: 'Mashq · 1-pog‘ona', h: 'Qahramoningizni <em>yulduzga</em> olib&nbsp;boring.', aktiv: 'h', ochiq: 1, prog: ['r', 'r'], yuz: momiqYuz(), sahna: `${yol('b2', momiqQ('at2', 'hayron'))}<div class="muam"><span class="mk">${hero({ k: 'kamvoy', mood: 'hayron' })}</span><span class="gl pufak"><b>Oz qoldi!</b></span></div>` }),
    foot: () => fB({ mas: 'yon', hint: 'Maslahat yondi' }) },
  B4: { rol: 'b', b: 1, t: 't3', nom: 'Yetib bordi', izoh: 'Qabul qilingan.',
    body: () => studiya({ tag: 'Mashq · 1-pog‘ona', h: 'Yetib bordi! <em>Birinchi</em> dasturingiz.', aktiv: 'h', ochiq: 1, prog: [['r', '', 'yon'], ['r', '', 'yon'], ['r', '', 'yon']], yuz: momiqYuz(), sahna: `<div class="konfeti">${Array.from({ length: 16 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 5) * 0.12}s;--r:${(i * 47) % 360}deg" class="k${i % 4}"></i>`).join('')}</div>${yol('b2', momiqQ('at3', 'xursand'))}` }),
    foot: () => fB({ chap: `<span class="mas">${QAYTA}Qayta ko‘rish</span>`, label: 'Keyingi pog‘ona ›' }) },
  P6: { rol: 'p', b: 1, t: 't3', nom: 'Coddy sanaydi', fid: 'F-1115-03', izoh: 'Qabul qilingan.',
    body: () => studiya({ tag: 'Ko‘ramiz', h: '4 ta blok — <em>4 qadam</em>', iz: 'Bizga 3 qadam kerak edi — bitta blok ortiqcha.', aktiv: 'h', ochiq: 1, prog: [['r', '', 'yon'], ['r', '', 'yon'], ['r', '', 'yon'], ['r', '', 'yon hozir']], yuz: coddyYuz(), sahna: `${yol('p5', coddyQ('at4', 'turadi', 'son').replace('>3</text>', '>4</text>'), 4, 3)}<span class="gl yrl y-tox">«To‘xta! Men shu yerdaman!»</span>` }),
    foot: () => fU('Endi bolalar o‘z noutbukida ortiqcha blokni olib tashlaydi', 'Keyingi ›') },
  P5: { rol: 'p', b: 1, t: 't1', nom: 'Sinf doskasi', fid: 'F-1116-04', izoh: 'Qabul qilingan («ancha yaxshilanibti»). v3.4: «Uch pog‘onani tugatdi» kartasi cho‘zilmaydi — mazmun kattalashdi: 14 ta yulduzcha ikki qatorda (bola tugatgan sari yonadi), son katta, ostida yulduz nimani bildirishi.',
    body: () => `<div class="chap">${matn('Mashq', 'Endi <em>o‘zingiz</em>!', 'Qiynalsangiz — «Maslahat»ni bosing.')}<div class="tugatdi"><small>Uch pog‘onani tugatdi</small><b>3<i> / 14</i></b><div class="yulduzlar">${Array.from({ length: 14 }, (_, i) => `<i class="${i < 3 ? 'on' : ''}">${ODAM}</i>`).join('')}</div><span class="tg-iz">Har belgi — uch pog‘onani tugatgan bitta bola</span></div></div><div class="oyna">${world('hovli')}${zina()}</div>`,
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  P7: { rol: 'p', b: 2, t: 't3', nom: 'say bloki', fid: 'F-1115-02 · 03 · 04', izoh: 'Qabul qilingan.',
    body: () => studiya({ tag: 'Yangi blok · say — ayt', h: 'Gapirdi, lekin <em>yurmadi</em>', iz: 'say faqat gapiradi, yurgizmaydi.', aktiv: 'g', holat: { h: 'ok' }, prog: [['s', '2 qadam yur', 'yon']], yuz: coddyYuz(), sahna: `<div class="cdy2">${robot({ pose: 'tushuntiradi', yuz: 'xursand' })}</div><span class="gl gap-p">2 qadam yur</span>` }),
    foot: () => fU('', 'Keyingi ›') },
  P8: { rol: 'p', b: 4, t: 't2', nom: 'Yakun — yo‘l oxiri', fid: 'F-1116-10', izoh: 'v3.3: o‘sha xarita — darsning oxiri. Uchala yoy oltin, uchala bekatda ✓, Coddy oxirgi bekatda quvonadi, konfeti. Tepada: «Siz dastur tuzdingiz!» va bugungi uchta so‘z; o‘ngda — keyingi dars (labirint). P4 bilan bitta yo‘lning boshi va oxiri.',
    body: () => `<div class="oyna to">${world('hovli')}${KONFETI()}<div class="gl pan">${matn('Yakun', 'Siz <em>dastur</em> tuzdingiz!', '')}<div class="tm ix"><div class="tr"><span class="ti u">!</span><span><b>Dasturlash</b>Kompyuterga buyruq berish</span></div><div class="tr"><span class="ti b">${IKON.r}</span><span><b>Blok</b>Bitta buyruq</span></div><div class="tr"><span class="ti d"><i></i><i></i><i></i></span><span><b>Dastur</b>Ketma-ket buyruqlar</span></div></div></div>${keyingiDars()}${tepalik({ otdi: 3, joy: 3, pose: 'quvonadi' })}</div>`,
    foot: () => fU('Ustozga: «Noutbukingizga qarang» deb ayting', 'Darsni yakunlash') },
  B5: { rol: 'b', b: 4, t: 't1', nom: 'O‘z ma’lumoti', fid: 'F-1115-08 · 07', izoh: 'Qabul qilingan. v3.3: faqat o‘lcham — bloklar kattalashib, chap ustundagi bo‘sh joyni to‘ldirdi.',
    body: () => `<div class="chap">${matn('Sizning natijangiz', 'Birinchi <em>dasturingiz</em> tayyor!', 'Qahramoningizni harakatlantirdingiz, gapirtirdingiz va o‘z sahnangizni yaratdingiz.')}<small class="st-s">Ishlatgan bloklaringiz</small><div class="stat"><div>${yigma(['r'])}<b>× 14</b></div><div>${yigma(['l'])}<b>× 3</b></div><div>${yigma(['j'])}<b>× 2</b></div><div>${yigma([['s', 'Men Zippiman!']])}<b>× 5</b></div></div></div><div class="oyna">${world('kosmos')}<div class="qq"><span class="m2">${hero({ k: globalThis.QAH || 'yulduz', mood: 'xursand', mv: 'sakraydi' })}</span></div><div class="gl kd2 a-tr"><small>Zippi</small><b>Keyingi darsda labirintda ko‘rishamiz!</b></div></div>`,
    foot: () => fJim('Dars tugadi') },
}

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
const SHART = [['joy', 'Joy tanlang', 'Joy'], ['blok', 'Kamida 2 ta harakat bloki', '2 ta harakat'], ['gap', 'O‘zingiz yozgan gap', 'O‘z gapingiz'], ['jump', '★ Qo‘shimcha: jump', '★ jump']]
const SHIK = { jump: IKON.j, joy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" fill="#fff"/><circle cx="12" cy="9.5" r="2.6" fill="#38C793"/></svg>', blok: IKON.r, gap: IKON.s }
const shartlar = (bajarildi = {}, qisqa = false) => `<div class="sh-l">${SHART.map(([k, t, q]) => `<span class="sh-r sh-${k}${bajarildi[k] ? ' ok' : ''}"><i>${SHIK[k]}</i>${qisqa ? q : t}${bajarildi[k] ? '<b>✓</b>' : ''}</span>`).join('')}</div>`
const zippiQ = (pose = 'xursand', mv) => `<div class="q kichik aktyor">${hero({ k: globalThis.QAH || 'yulduz', mood: pose, mv })}</div>`

Object.assign(E, {
  B0: { rol: 'b', b: 0, t: 't4', nom: 'Darsga kirish', fid: 'v4', izoh: 'v4 (yangi): bola darsga kirganda — kunduzgi hovli, «Salom, Aziz!» (ism tizimdan), «Kursning birinchi darsi». Bitta tugma — «Tayyorman», o‘ng pastda. Bosgach — «Katta ekranga qarang» (keyingi ekran).',
    body: () => kutish({ kech: false, uq: '', h: 'Salom, <em>Aziz</em>!', sub: 'Kursning birinchi darsi', aktyor: yolchaYakka(coddyQ('', 'salom', 'xursand')) }),
    foot: () => fKid('Tayyor bo‘lsangiz — tugmani bosing', 'Tayyorman') },
  BK: { rol: 'b', b: 0, t: 't4', nom: 'Ustoz ekraniga qarang', fid: 'v4', izoh: 'v4 (yangi): bola noutbukida eng ko‘p chiqadigan ekran — ustoz katta ekranda ko‘rsatayotganda. Kechki hovli, tepadan nur, bitta yozuv; qahramon yo‘l qatlamida tepaga qarab turadi. Tugma yo‘q — ataylab tinch. Ostidagi kichik gap vaziyatga qarab: «Zo‘r!», «Javobingiz qabul qilindi», «Tayyor!».',
    body: () => kutish({ h: 'Ustoz ekraniga qarang', sub: 'Ustozni tinglang', aktyor: yolchaYakka(momiqQ('', 'xursand')) }),
    foot: () => fJim('') },
  P2S: { rol: 'p', b: 0, t: 't1', nom: 'Savol · 1-sinov', fid: 'v4 · F-1116-11', izoh: 'v4 (yangi): hukning 3-qadami — A taxminni sinaymiz. A kartasi «sinalyapti» (chegarasi miltillaydi), kartalar ostida sinf ovozi o‘lchagichi (bolalar «YUR!» deydi va noutbukda «YUR!»ni bosadi — o‘lchagich to‘ladi), «YUR!» pufaklari ko‘tariladi va Coddy’ni yopmaydi. Coddy qimirlamaydi — keyin A kartasida «✕ qimirlamadi».',
    body: () => QAYSI(kartalarR(JAVOBLAR, 'ch', { son: SONI, sin: 'A' }), '«YUR!» deng va tugmani bosing!', { tag: '1-sinov · A', h: 'Hammamiz birga: <em>YUR!</em>', chapOst: olchagich(64), sahna: YURPUF }),
    foot: () => fU('«YUR!» dedi: 9 bola', 'Keyingi ›') },
  BY: { rol: 'b', b: 0, t: 't4', nom: 'YUR! tugmasi', fid: 'v4', izoh: 'v4 (yangi): 1-sinov paytida bola noutbukida butun ekranga bitta katta «YUR!» tugmasi. Bosganda titraydi — Coddy baribir qimirlamaydi (javobni sinov ko‘rsatadi). Bu yerda tugma — ekranning o‘zi, shuning uchun pastki tasmada asosiy tugma yo‘q.',
    body: () => kutish({ kech: false, uq: '', h: 'Bosing va «<em>YUR!</em>» deng!', sub: 'Butun sinf birga', extra: '<button type="button" class="yur-b" tabindex="-1">YUR!</button>', aktyor: yol('p1', coddyQ('', 'oylaydi', 'savol')) }),
    foot: () => fJim('Bir marta bosing — ovozingiz sinfga qo‘shiladi') },
  P4T: { rol: 'p', b: 0, t: 't2', nom: 'Sinf taxtasi', fid: 'v4', izoh: 'v4 (yangi): 4-sahnaning 3-qadami — bolalar qahramon tanlayotganda katta ekranda. Birinchi o‘rinda Coddy («Ustoz»), keyin 14 o‘rin: tanlaganlarning qahramoni zonachasida paydo bo‘ladi (ismsiz), bo‘shlari punktir. Faqat son.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Qahramon tanlash', 'Qahramoningizni <em>tanlang</em>', 'Coddy — ustozniki. Siz o‘z qahramoningizga buyruq berasiz.')}</div><div class="gl kd2 a-tr tx-son"><small>Tanladi</small><b>9 <i>/ 14</i></b></div>${taxta(9)}</div>`,
    foot: () => fU('Tanladi: 9 / 14', 'Keyingi ›') },
  BQ: { rol: 'b', b: 0, t: 't2', nom: 'Qahramon tanlash', fid: 'v4', izoh: 'v4 (yangi): beshta qahramon zonachalarda turadi; sichqoncha ustiga borgani sakraydi va zonachasi oltin bo‘ladi. Tanlashning o‘zi — harakat, tugma yo‘q; bosgach «Katta ekranga qarang», ostida «Tayyor!».',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Qahramon', 'Qahramoningizni <em>tanlang</em>', 'Birini tanlang — bugun unga buyruq berasiz.')}</div>${tanlovQator('momiq')}</div>`,
    foot: () => fJim('Birini tanlang') },
  P9: { rol: 'p', b: 1, t: 't1', nom: 'Xulosa: blok va dastur', fid: 'v4', izoh: 'v4 (yangi): 8-sahna. Ikki so‘zning ta’rifi darsda shu yerda bir marta: «Blok — bitta buyruq», «Dastur — buyruqlar ro‘yxati». O‘ngda uchta katta blok ustma-ust — birin-ketin yonadi (hozir 2-si), har birida Coddy bir qadam sakraydi.',
    body: () => `<div class="chap">${matn('Xulosa', 'Blok va <em>dastur</em>', 'Bugungi ikki so‘z — eslab qoling.')}<div class="tf-l"><div class="tf"><div class="tf-r">${yigma(['r'])}</div><div class="tf-t"><b>Blok</b><span>Bitta buyruq</span></div></div><div class="tf"><div class="tf-r">${yigma([['r', '', 'yon'], ['r', '', 'yon hozir'], 'r'])}</div><div class="tf-t"><b>Dastur</b><span>Ketma-ket buyruqlar</span></div></div></div></div><div class="oyna">${world('hovli')}${yol('p3b', coddyQ('at2', 'turadi', 'xursand'))}</div>`,
    foot: () => fU('', 'Keyingi ›') },
  P10: { rol: 'p', b: 1, t: 't1', nom: 'O‘yin: Men robotman', fid: 'v4', izoh: 'v4 (yangi): 9-sahna, harakatli o‘yin. Ustoz — robot, bolalar inglizcha buyruq beradi. O‘ngda faqat bor uchta buyruq (ko‘k bloklar) va chizib tashlangan «run!», «fly!» — «Boshqa buyruq yo‘q». Bola noutbukida — «Katta ekranga qarang» turidagi «Hozir o‘yin».',
    body: () => `<div class="chap">${matn('O‘yin', 'Men — <em>robotman</em>!', 'Menga faqat shu buyruqlarni bering!')}<div class="tf-l">${[['r', 'Bir qadam o‘ngga'], ['l', 'Bir qadam chapga'], ['j', 'Sakraydi']].map(([b, m]) => `<div class="tf qt"><div class="tf-r">${yigma([b])}</div><div class="tf-t"><span>${m}</span></div></div>`).join('')}<div class="buy yoq"><small>Boshqa buyruqni bilmayman</small></div></div></div><div class="oyna">${world('hovli')}${yol('p3b', coddyQ('', 'korsatadi', 'xursand'))}</div>`,
    foot: () => fU('O‘yin: siz — robot, bolalar buyruq beradi', 'Keyingi ›') },
  B6: { rol: 'b', b: 2, t: 't1', nom: 'Ism va rang', fid: 'v4', izoh: 'v4 (yangi): 11-sahna. Bola qahramoniga ism qo‘yadi (12 harfgacha yoki «Tasodifiy ism») va sakkiz rangdan birini tanlaydi; o‘ngda qahramon ism belgisi bilan. Ism faqat shu noutbukda. Tugma ism yozilgach yonadi.',
    body: () => `<div class="chap">${matn('Qahramoningiz', 'Qahramoningizga <em>ism</em> qo‘ying', 'Rangini ham o‘zingiz tanlang.')}<div class="ism-k"><small>Ism</small><span class="ism-i">Momiq<i class="kursor"></i>${QALAM}</span><span class="ism-t">🎲 Ism tanlab ber</span><span class="ism-s">5 / 12 harf</span></div><div class="rng-k"><small>Rang</small><div class="rng">${RANGLAR8.map((c, i) => `<i style="--c:${c}" class="${i === 4 ? 'on' : ''}"></i>`).join('')}</div></div></div><div class="oyna">${world('hovli')}<span class="gl yrl ism-tag">Momiq</span>${yol('b1', momiqQ('', 'xursand'), 0)}</div>`,
    foot: () => fKid('Tayyor bo‘lsa — tugmani bosing', 'Tayyor!') },
  B7: { rol: 'b', b: 2, t: 't3', nom: 'Gapirtiramiz', fid: 'v4', izoh: 'v4 (yangi): 12-sahnaning 1-pog‘onasi. Binafsha «Gap» oilasi ochiq; dasturdagi `say` blokining yozuvi bosildi — yozish maydoni ochiq (qalam belgisi, 30 harfgacha). Bola ism yozadi va ishga tushiradi: qahramon shuni aytadi.',
    body: () => studiya({ tag: 'Mashq · 1-pog‘ona', h: 'Qahramoningizga <em>gap</em> yozing', aktiv: 'g', holat: { h: 'ok' }, prog: [['s', 'Men Momiqman!', 'tahrir']], yuz: momiqYuz(), sahna: `${yol('b2', momiqQ('', 'xursand'))}`, extra: '<span class="tahrir-iz">✎ Yozing · 13 / 30</span>' }),
    foot: () => fB({ hint: 'Binafsha blokdagi yozuvni bosing va o‘zingiz yozing' }) },
  P11: { rol: 'p', b: 3, t: 't3', nom: 'Ustozning sahnasi', fid: 'v4', izoh: 'v4 (yangi): 13-sahna. Ustoz Kosmosni tanlagan; ko‘k oilada yangi blok — `jump` (bir marta miltillaydi). Dasturda yurish, gap va sakrash: Coddy kosmosda yuradi, gapiradi, sakraydi. «Siznikisi boshqacha bo‘lsin». Etalonda gap qisqa («Mening kosmosim!»): uzun gap tor dastur ustuniga sig‘maydi — Blockly’da blok kengayadi va ish maydoni suriladi (ochiq savol).',
    body: () => studiya({ tag: 'Ko‘ramiz · ustozning sahnasi', h: 'Coddy <em>kosmosda</em>', iz: 'Yangi blok — jump: u ham ko‘k, demak harakat.', aktiv: 'h', ochiq: 3, prog: [['r', '', 'yon'], ['s', 'Mening kosmosim!', 'yon'], ['j', '', 'yon hozir'], 'r'], yuz: coddyYuz(), dunyo: 'kosmos', sahna: `<div class="cdy3 aktyor">${robot({ pose: 'quvonadi', yuz: 'xursand' })}</div><span class="gl gap-p k3">Mening kosmosim!</span>` }).replace('<div class="mbw"><span class="mb f-h ">' + IKON.j, '<div class="mbw yangi-j"><span class="mb f-h ">' + IKON.j),
    foot: () => fU('Ustozga: «Siznikisi boshqacha bo‘lsin» deb ayting', 'Keyingi ›') },
  P12: { rol: 'p', b: 3, t: 't1', nom: 'Sinf doskasi: o‘z sahnangiz', fid: 'v4', izoh: 'v4 (yangi): 14-sahna. Chapda uchta shart (belgisi bilan) va «Sahnasi tayyor»; o‘ngda uchta joy — har birida uni tanlaganlarning qahramonlari (ismsiz) va soni. Bu tanlov, yutuq emas. «Bu yerda xato yo‘q».',
    body: () => `<div class="chap">${matn('Mashq', 'O‘z <em>sahnangizni</em> yarating!', 'Endi navbat sizda! Qahramoningiz uchun kichik dastur tuzing.')}${shartlar()}<div class="tugatdi kichik"><small>Sahnasi tayyor</small><b>8<i> / 14</i></b><div class="yulduzlar">${Array.from({ length: 14 }, (_, i) => `<i class="${i < 8 ? 'on' : ''}">${ODAM}</i>`).join('')}</div></div></div><div class="oyna">${world('hovli')}<div class="jy-q">${joyKarta('hovli', 'Hovli', { son: 3, qq: ['momiq', 'nihol', 'katak'] })}${joyKarta('kosmos', 'Kosmos', { son: 7, qq: ['yulduz', 'jele', 'momiq'] })}${joyKarta('suv', 'Suv osti', { son: 4, qq: ['jele', 'katak', 'nihol'] })}</div></div>`,
    foot: () => fU('Sahnasi tayyor: 8 / 14 · yordam kerak: 1', 'Keyingi ›') },
  B8A: { rol: 'b', b: 3, t: 't1', nom: 'Joy tanlang', fid: 'v4', izoh: 'v4 (yangi): 14-sahnaning boshi. Uchta joy — rasm va nomi bilan; tanlangani (Kosmos) halqa bilan, o‘ngda o‘sha joy qahramon bilan. Tanlashning o‘zi — harakat, tugma yo‘q; keyin studiya o‘sha joyda ochiladi.',
    body: () => `<div class="chap">${matn('O‘z sahnangiz', 'Joy <em>tanlang</em>', 'Qahramoningiz shu joyda o‘ynaydi.')}<div class="jy-t">${JOYLAR.map(([k, n]) => joyKarta(k, n, { on: k === 'kosmos' })).join('')}</div></div><div class="oyna">${world('kosmos')}${yolchaYakka(zippiQ('xursand', 'sakraydi'))}</div>`,
    foot: () => fJim('Birini tanlang') },
  B8: { rol: 'b', b: 3, t: 't3', nom: 'O‘z sahnangiz', fid: 'v4', izoh: 'v4 (yangi): 14-sahna, bolaning o‘z sahnasi. Kosmos, ikkala oila va to‘rttala blok ochiq. Tepada uch shart — bajarilgani yashil ✓ oladi («Salom!» o‘zgartirilmasa gap hisobga olinmaydi). Uchalasi bajarilib, dastur ishga tushgach: «Sahna tayyor!».',
    body: () => studiya({ tag: 'O‘z sahnangiz', h: 'O‘z <em>sahnangizni</em> yarating!', iz: shartlar({ joy: 1, blok: 1, gap: 1, jump: 1 }, true), aktiv: 'g', holat: { h: 'ok' }, prog: ['r', ['s', 'Men Zippiman!'], 'j', 'r', ['s', 'Mening sahnam!']], yuz: hero({ k: globalThis.QAH || 'yulduz', lite: true }), dunyo: 'kosmos', sahna: `${yolchaYakka(zippiQ('xursand', 'sakraydi'))}<span class="gl gap-p k3">Mening sahnam!</span><span class="gl yrl tayyor">✓ Sahna tayyor!</span>` }),
    foot: () => fB({ hint: 'Yana o‘zgartirsangiz bo‘ladi' }) },
  P13: { rol: 'p', b: 3, t: 't2', nom: 'Ko‘rgazma', fid: 'v4 · F-1116-18', izoh: 'v4 (yangi): 15-sahna. Katta ekranda bolalarning ishi ko‘rsatilmaydi (bola ismi va yozgan gapi proyektorga chiqmaydi) — faqat chaqiruv: turing va ikki do‘stingizning sahnasini ko‘ring. Coddy quvonadi.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Ko‘rgazma', 'Do‘stingizning <em>sahnasi</em>', 'Yoningizdagi do‘stingizning sahnasini ko‘ring.')}</div>${yolchaYakka(coddyQ('', 'quvonadi', 'xursand'), 'yk mid')}</div>`,
    foot: () => fU('Keyin 2–3 bola ko‘rsatadi. So‘rang: «Qahramoni nima qildi?»', 'Keyingi ›') },
  B9: { rol: 'b', b: 3, t: 't4', nom: 'Ko‘rgazma: mening sahnam', fid: 'v4', izoh: 'v4 (yangi): bola noutbukida uning sahnasi butun ekranda o‘zi takror-takror o‘ynaydi; bloklar ko‘rinmaydi, qahramon yirik; pastda bolaning ismi va qahramonining ismi. Do‘stlari kelib ko‘radi. Tugma yo‘q.',
    body: () => `<div class="oyna to">${world('kosmos')}<span class="gl gap-p k3 g9">Men Zippiman!</span><span class="gl yrl g9-n">Aziz · Zippi</span>${yolchaYakka(zippiQ('xursand', 'sakraydi'), 'yk mid katta')}</div>`,
    foot: () => fJim('Sahnangiz qayta-qayta o‘ynaydi') },
})

const KURSOR = '<span class="kursor-q" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6.2 3.2l12.2 7.4-5.4 1.5 3.3 6-2.7 1.5-3.3-6-4.1 3.9z" fill="#0D2137" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg></span>'
const yulduzlar14 = (n) => `<div class="yulduzlar">${Array.from({ length: 14 }, (_, i) => `<i class="${i < n ? 'on' : ''}">${ODAM}</i>`).join('')}</div>`
Object.assign(E, {
  P2B: { rol: 'p', b: 0, t: 't1', nom: 'Savol · 2-sinov', fid: 'F-1116-19', izoh: 'Yangi: B taxminni sinaymiz. Bir bola chiqib, Coddy’ni sichqoncha bilan sudraydi — Coddy qimirlamaydi. A kartasida allaqachon «✕ qimirlamadi».',
    body: () => QAYSI(kartalarR(JAVOBLAR, 'ch', { son: SONI, sin: 'B', nat: { A: 'yoq' } }), 'Meni sichqoncha bilan ko‘chirib ko‘ring!', { tag: '2-sinov · B', h: 'Sichqoncha bilan <em>ko‘chiramiz</em>', sahna: KURSOR }),
    foot: () => fU('Ustozga: bir bolani chiqarib, Coddy’ni sichqoncha bilan ko‘chirtiring', 'Keyingi ›') },
  P2K: { rol: 'p', b: 0, t: 't1', nom: 'Savol · 3-sinov', fid: 'F-1116-19', izoh: 'Yangi: C taxminni sinaymiz. Ustoz «move right» blokini uch marta bosadi — har bosishda Coddy bir zonachaga sakraydi (hozir 2-sida). Blok chap ustunda, kartalar ostida.',
    body: () => QAYSI(kartalarR(JAVOBLAR, 'ch', { son: SONI, sin: 'C', nat: { A: 'yoq', B: 'yoq' } }), 'Bitta buyruq — bitta qadam!', { tag: '3-sinov · C', h: 'Unga <em>buyruq</em> beramiz', aktyor: coddyQ('at2', 'turadi', 'xursand'), chapOst: `<div class="tf qt sin3"><div class="tf-r">${yigma([['r', '', 'yon']])}</div><div class="tf-t"><span>Ustoz 3 marta bosadi</span></div></div>` }),
    foot: () => fU('', 'Keyingi ›') },
  P4I: { rol: 'p', b: 2, t: 't2', nom: 'Sinf taxtasi: ism', fid: 'F-1116-19', izoh: 'Yangi: bolalar qahramoniga ism berayotganda katta ekranda — sinf taxtasi va son. Ismlar proyektorga chiqmaydi.',
    body: () => `<div class="oyna to">${world('hovli')}<div class="gl pan">${matn('Qahramoningiz', 'Qahramoningizga <em>ism</em> qo‘ying', 'Rangini ham o‘zingiz tanlang.')}</div><div class="gl kd2 a-tr tx-son"><small>Ism berdi</small><b>9 <i>/ 14</i></b></div>${taxta(14)}</div>`,
    foot: () => fU('Ism berdi: 9 / 14', 'Keyingi ›') },
  P5A: { rol: 'p', b: 1, t: 't1', nom: 'Sinf doskasi: birinchi dastur', fid: 'F-1116-19', izoh: 'Yangi: bolalar birinchi dasturini yasayotganda katta ekranda — topshiriq va nechta bola yulduzga yetgani.',
    body: () => `<div class="chap">${matn('Mashq', 'Endi <em>o‘zingiz</em>!', 'Qahramoningizni yulduzga olib boring.')}<div class="tugatdi"><small>Yulduzga yetdi</small><b>6<i> / 14</i></b>${yulduzlar14(6)}<span class="tg-iz">Har belgi — yulduzga yetgan bitta bola</span></div></div><div class="oyna">${world('hovli')}${yol('p3b', momiqQ('', 'xursand'))}</div>`,
    foot: () => fU('Yordam so‘radi: 1 ta noutbuk', 'Keyingi ›') },
  B2P: { rol: 'b', b: 1, t: 't3', nom: 'Studiya · 2-pog‘ona', fid: 'F-1116-19', izoh: 'Yangi: 2-pog‘ona — yulduz orqada qoldi, yangi blok move left.',
    body: () => studiya({ tag: 'Mashq · 2-pog‘ona', h: 'Yulduz <em>orqada</em> qoldi', aktiv: 'h', ochiq: 2, prog: ['l', 'l'], yuz: momiqYuz(), sahna: yol('b2', momiqQ('at3'), 3, 1) }),
    foot: () => fB({ hint: 'Qahramon qaysi tomonga yurishi kerak?' }) },
})
Object.assign(E, {
  B3X: { rol: 'b', b: 1, t: 't3', nom: 'Xatoni tuzating', fid: 'F-1116-22', izoh: 'Yangi: ustoz 4 ta blok bilan ko‘rsatgach, bola noutbukida o‘sha xato — qahramon yulduzdan o‘tib ketgan. Bola ortiqcha blokni bosib olib tashlaydi va qayta ishga tushiradi (xatoni o‘zi tuzatadi).',
    body: () => studiya({ tag: 'Mashq · xatoni tuzating', h: 'Bir qadam <em>ortiqcha</em>!', aktiv: 'h', ochiq: 1, prog: ['r', 'r', 'r', 'r'], yuz: momiqYuz(), sahna: yol('b2', momiqQ('at4', 'hayron'), 4, 3) }),
    foot: () => fB({ hint: 'Ortiqcha blokni bosing — u dasturdan chiqadi' }) },
  B3Y: { rol: 'b', b: 1, t: 't3', nom: 'Xato tuzatildi', fid: 'F-1116-22', izoh: 'Yangi: 3 ta blok qoldi — qahramon yulduzda to‘xtadi.',
    body: () => studiya({ tag: 'Mashq · xatoni tuzating', h: 'To‘g‘ri! <em>3 ta blok</em> — 3 qadam', aktiv: 'h', ochiq: 1, prog: [['r', '', 'yon'], ['r', '', 'yon'], ['r', '', 'yon']], yuz: momiqYuz(), sahna: `${KONFETI()}${yol('b2', momiqQ('at3', 'xursand'), 4, 3)}` }),
    foot: () => fJim('Xatoni o‘zingiz tuzatdingiz!') },
})
Object.assign(E, {
  P7A: { rol: 'p', b: 2, t: 't3', nom: 'say bloki · ishga tushirishdan oldin', fid: 'F-1116-23', izoh: 'Yangi: natija oldindan aytilmaydi. Avval say blokiga «2 qadam yur» yozilgani ko‘rinadi, Coddy jim; ustoz ishga tushiradi — keyingi ekranda natija.',
    body: () => studiya({ tag: 'Yangi blok · say — ayt', h: 'say blokiga «<em>2 qadam yur</em>» yozdik', aktiv: 'g', holat: { h: 'ok' }, prog: [['s', '2 qadam yur']], yuz: coddyYuz(), sahna: `<div class="cdy2">${robot({ pose: 'salom', yuz: 'xursand' })}</div>` }),
    foot: () => fU('', 'Keyingi ›') },
})
const LAHZA = [
  ['1', 'Kirish', 'Birinchi dars: bloklardan nima yasaymiz. Bola noutbukida — kirish va eng ko‘p chiqadigan «Katta ekranga qarang».', ['P1', 'B0', 'BK']],
  ['2', 'Savol: uch taxmin, uch sinov', 'Darsdagi yagona savol. Javoblar ochiladi, sinf birma-bir sinaydi — natija kartaning o‘zida.', ['P2', 'P2N', 'P2S', 'BY', 'P2B', 'P2K', 'P2C']],
  ['3', 'Dasturlash nima?', 'Dasturchi yozadi, biz bloklarni ulaymiz.', ['P3']],
  ['4', 'Reja va qahramon', 'Bugun nima qilamiz — yo‘l xaritasi; har bola qahramon tanlaydi, katta ekranda sinf taxtasi.', ['P4', 'P4T', 'BQ']],
  ['5', 'Blok studiya', 'Ranglar (bola o‘zi bosadi), birinchi dastur, xato, muvaffaqiyat.', ['P5A', 'B1', 'B2', 'B3', 'B4']],
  ['6', 'Ko‘ramiz, keyin o‘zingiz', 'Ustoz ko‘rsatadi, bolalar pog‘onalarni o‘zi bajaradi, keyin xulosa: blok va dastur.', ['P6', 'B3X', 'B3Y', 'P5', 'B2P', 'P9']],
  ['7', 'O‘yin va 2-bekat: gapirtiramiz', '«Men robotman» o‘yini; xarita qaytadi; say bloki; ism va rang; bola qahramonini gapirtiradi.', ['P10', 'P4B', 'P7A', 'P7', 'P4I', 'B6', 'B7']],
  ['8', '3-bekat: o‘z sahnangiz', 'Ustozning sahnasi; bolalar joy tanlab o‘z sahnasini yasaydi; galereya.', ['P11', 'P12', 'B8A', 'B8', 'P13', 'B9']],
  ['9', 'Yakun', 'O‘sha xarita — yo‘l oxiri; bola noutbukida — o‘z ma’lumoti.', ['P8', 'B5']],
]
const ekran = (id) => { const e = E[id]; return `<figure class="${e.rol === 'p' ? 'pr' : 'bo'}" data-id="${id}"><div class="ekran hy ${e.t} e-${id}" role="img" aria-label="${id} ${e.nom}" tabindex="0">${bosh(e.b)}<main class="hm">${e.body()}</main>${e.foot()}</div><figcaption><span class="eid">${id}</span><b>${e.rol === 'p' ? 'Proyektor' : 'Bola noutbuki'} · ${e.nom}${e.fid ? ` <span class="fid">${e.fid}</span>` : ''}</b><span class="fiz">${e.izoh}</span></figcaption>${e.ov === 0 ? '' : `<div class="ov" role="group" aria-label="${id} bo‘yicha javob"><button type="button" data-v="qabul">Qabul</button><button type="button" data-v="boshqa">Boshqa g‘oya</button><input type="text" placeholder="Izoh (ixtiyoriy)" aria-label="${id} izohi"></div>`}</figure>` }
const lahzalar = LAHZA.map(([n, nom, iz, ids, qosh = '']) => `<section class="lahza" aria-label="${nom}"><div class="l-bosh"><span class="l-n">${n}</span><div><h3>${nom}</h3><p>${iz}</p></div></div><div class="l-ekranlar">${ids.map(ekran).join('')}</div>${qosh}</section>`).join('\n')
const MOZ = `<div class="ekran hy t3 e-MZ namuna-st" role="img" aria-label="Mozaika bloklar">${bosh(1)}<main class="hm">${studiya({ tag: 'Yigma ko‘rinish', h: 'Bloklar <em>ulanadi</em>', iz: 'Sudrab olib boring — «chiq» etib ulanadi. Yoki bosing — oxiriga o‘zi ulanadi.', aktiv: 'h', prog: ['r', 'r', 'l'], yuz: momiqYuz(), sahna: yol('b2', momiqQ()) })}<div class="sudra">${yigma([['j', '', 'qol']])}</div></main>${fB({ hint: 'Qo‘yib yuboring — «chiq» etib ulanadi' })}</div>`

let t = readFileSync(V + '/shablon.html', 'utf8').replace('{{HARAKAT}}', HARAKAT).replace('{{MAKET}}', MAKET).replace('{{LAHZALAR}}', lahzalar).replace('{{MOZAIKA}}', MOZ)
t = t.replaceAll('"Source Serif 4",Georgia,serif', 'var(--f-sar)').replaceAll('"Source Serif 4",serif', 'var(--f-sar)').replaceAll('"Manrope",sans-serif', 'var(--f-matn)')
t = t.replaceAll('<div class="chap">', '<div class="chap" data-z="matn">').replace(/<div class="oyna([^"]*)">/g, '<div class="oyna$1" data-z="sahna">').replace(/<div class="gl pan">/g, '<div class="gl pan" data-z="sarlavha paneli">')
t = t.replace(/<svg (class="(?:hero|robot|world))/g, '<svg xmlns="http://www.w3.org/2000/svg" $1')
if (/\{\{/.test(t)) { console.error('QOLDI', t.match(/\{\{[^}]*\}\}/g)); process.exit(1) }
writeFileSync(OUT, t); console.log('ok', (t.length / 1024).toFixed(0) + 'KB')


// ===== Tepalik — reja ekrani rasmlari (16.11, boshliq tanlagan ko'rinish) =====
// bosh.mjs + ekranlar.mjs dan keyin ulanadi: node new-junior/etalon/tepalik-yig.mjs → new-junior/arxiv/tepalik-rasmlar-2026-11-16.html
const ekranT = (id, body, foot, extra = '') => `<div class="ekran hy ${E[id].t} e-${id}" role="img" aria-label="${E[id].nom}">${bosh(E[id].b)}<main class="hm">${body}</main>${foot}${extra}</div>`
const DARSDA = [
  ['P4', 'Reja', 'Dars boshida: Coddy startda, uch bekat tepalikka ko‘tariladi, navbatdagi bekat miltillaydi. Cho‘qqida — dars oxirida nima bo‘lishi.'],
  ['P4B', '2-bekat boshi', 'Birinchi bekat o‘tildi: ✓ belgisi, yoyi oltin. Coddy birinchi pog‘onada.'],
  ['P8', 'Yakun', 'Hamma bekat ✓, Coddy cho‘qqida quvonadi; yo‘l keyingi darsga — Labirintga olib boradi.'],
]
const OBH = [['quyosh', 'Quyoshli', '+18°'], ['bulut', 'Bulutli', '+12°'], ['yomgir', 'Yomg‘irli', '+9°'], ['qor', 'Qorli', '−2°']]
const TOMCHI_T = Array.from({ length: 34 }, (_, i) => `<i style="left:${(i * 29 + 7) % 100}%;top:${(i * 47) % 70 - 10}%;--d:${((i * 0.137) % 0.9).toFixed(2)}s"></i>`).join('')
const obBody = (k) => {
  let b = E.P4.body()
  if (k === 'qor') b = b.replace(/<svg[^>]*class="world"[\s\S]*?<\/svg>/, world('qor'))
  return b.replace(/(<svg[^>]*class="world"[\s\S]*?<\/svg>)/, '$1<div class="ob ob-' + k + '" aria-hidden="true">' + (k === 'yomgir' ? TOMCHI_T : '') + '</div>')
}
const kadr = (n, nom, izoh, ekran) => `<figure class="tr-f"><button type="button" class="tr-kadr" aria-label="${nom} — to‘liq ekranda ochish">${ekran}</button><figcaption><span class="tr-n">${n}</span><b>${nom}</b><span>${izoh}</span></figcaption></figure>`
const TR_CSS = `
/* Sahifa: tepalik rasmlari — bitta ustun, har ekran to'liq kenglikda; bosilsa to'liq ekranda ochiladi (rasmga olish uchun) */
:root{--tr-bg:#F3F1EC;--tr-fg:#0D2137;--tr-muted:#5B6270;--tr-line:#E0DCD2;--tr-chip:#E8EEF7;--tr-accent:#E2431F}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--tr-bg:#0F1724;--tr-fg:#EEF1F6;--tr-muted:#A3ACBA;--tr-line:#253244;--tr-chip:#1C2A3F;--tr-accent:#FF7A59;color-scheme:dark}}
:root[data-theme="dark"]{--tr-bg:#0F1724;--tr-fg:#EEF1F6;--tr-muted:#A3ACBA;--tr-line:#253244;--tr-chip:#1C2A3F;--tr-accent:#FF7A59;color-scheme:dark}
html,body{background:var(--tr-bg)!important;color:var(--tr-fg)}
.tr-sahifa{max-width:1180px;margin:0 auto;padding-block:28px 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));font-family:var(--f-matn);display:flex;flex-direction:column;gap:36px}
.tr-bosh{display:flex;flex-direction:column;gap:10px;max-width:68ch}
.tr-bosh small{font:700 12px/1 var(--f-kod);letter-spacing:.08em;text-transform:uppercase;color:var(--tr-muted)}
.tr-bosh h1{margin:0;font:700 clamp(26px,4vw,40px)/1.1 var(--f-sar);color:var(--tr-fg);text-wrap:balance}
.tr-bosh h1 em{font-style:normal;color:var(--tr-accent)}
.tr-bosh p{margin:0;font-size:16px;line-height:1.55;color:var(--tr-muted)}
.tr-bolim{display:flex;flex-direction:column;gap:22px}
.tr-bolim > h2{margin:0;font:700 22px/1.2 var(--f-sar);color:var(--tr-fg)}
.tr-f{margin:0;display:flex;flex-direction:column;gap:10px}
.tr-kadr{all:unset;display:block;cursor:zoom-in;border-radius:12px}
.tr-kadr:focus-visible{outline:3px solid #3FA2FF;outline-offset:4px}
.tr-kadr .ekran{max-width:100%;box-shadow:0 18px 44px -24px rgba(13,33,55,.55);border-color:var(--tr-line)}
.tr-f figcaption{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.tr-n{font:700 12px/1 var(--f-kod);padding:5px 8px;border-radius:999px;background:var(--tr-chip);color:var(--tr-muted)}
.tr-f figcaption b{font:700 18px/1.2 var(--f-sar);color:var(--tr-fg)}
.tr-f figcaption span:last-child{flex-basis:100%;font-size:15px;line-height:1.5;color:var(--tr-muted)}
.tr-kadr:fullscreen{display:grid;place-items:center;background:#0B1220;cursor:zoom-out;border-radius:0}
.tr-kadr:fullscreen .ekran{width:min(100vw,calc(100vh * 16 / 9));border:0;border-radius:0;box-shadow:none}
/* ob-havo qatlamlari */
.ekran .hb{position:relative}
.ob-pill{position:absolute;right:3cqw;top:50%;transform:translateY(-50%);font:700 1.1cqw/1 var(--f-kod);letter-spacing:.04em;color:#0D2137;background:#fff;border:.1cqw solid #E4E0D6;border-radius:999px;padding:.45cqw .9cqw}
.ob{position:absolute;inset:0;z-index:1;pointer-events:none}
.ob-quyosh{background:radial-gradient(40% 50% at 92% 4%,rgba(255,214,90,.35),transparent 70%)}
.ob-bulut{background:radial-gradient(22% 14% at 18% 16%,rgba(255,255,255,.9),transparent 70%),radial-gradient(26% 16% at 52% 10%,rgba(240,244,250,.95),transparent 70%),radial-gradient(30% 18% at 86% 12%,rgba(236,240,247,.98),transparent 70%),linear-gradient(180deg,rgba(124,140,162,.55),rgba(124,140,162,.18) 55%,rgba(60,70,90,.08))}
.ob-yomgir{overflow:hidden;background:linear-gradient(180deg,rgba(70,86,112,.55),rgba(70,86,112,.25) 60%,rgba(40,50,70,.12))}
.ob-yomgir i{position:absolute;width:.18cqw;height:1.5cqw;border-radius:.2cqw;background:linear-gradient(rgba(225,236,252,0),rgba(225,236,252,.9));transform:rotate(12deg);animation:tomchi .9s linear var(--d) infinite}
@keyframes tomchi{from{translate:0 0}to{translate:-4cqw 30cqw}}
.ob-qor{background:radial-gradient(circle,#fff 0 .22cqw,transparent .26cqw) 0 0/4.2cqw 4.6cqw,radial-gradient(circle,rgba(255,255,255,.85) 0 .16cqw,transparent .2cqw) 1.8cqw 2.2cqw/3.1cqw 3.4cqw;animation:qor 7s linear infinite}
@keyframes qor{to{background-position:1.4cqw 18.4cqw,.2cqw 15.8cqw}}
@media (prefers-reduced-motion:reduce){.ob-yomgir i,.ob-qor{animation:none}}
.oyna:has(.ob-qor) .tp-iz path:not(.otdi){stroke:#7F9CC4}
`
const sahifaT = `<title>Tepalik reja rasmlari</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${t.match(/<link rel="stylesheet" href="https:\/\/fonts[^>]+>/)[0]}
${t.slice(t.indexOf('<style>'), t.indexOf('</style>') + 8)}
<style>${TR_CSS}</style>
<main class="tr-sahifa">
  <header class="tr-bosh"><small>1-dars · Tanishuv · ustoz ekrani</small><h1>Tepalik — <em>reja ekrani</em></h1>
  <p>Boshliq tanlagan ko‘rinish: yo‘l pastdan yuqoriga ko‘tariladi, cho‘qqida — dars oxiridagi natija. Rasmni bosing — to‘liq ekranda ochiladi; yana bossangiz yoki Esc — qaytadi.</p></header>
  <section class="tr-bolim" aria-label="Darsda"><h2>Darsda — uch holat</h2>
  ${DARSDA.map(([id, nom, iz], i) => kadr(i + 1, nom, iz, ekranT(id, E[id].body(), E[id].foot()))).join('\n  ')}</section>
  <section class="tr-bolim" aria-label="Ob-havo bilan"><h2>Ob-havo bilan — to‘rt holat</h2>
  ${OBH.map(([k, nom, gr], i) => kadr(i + 4, 'Reja · ' + nom, 'Toshkentdagi ob-havoga qarab sahna o‘zi moslashadi (taklif).', ekranT('P4', obBody(k), E.P4.foot()).replace('</header>', `<span class="ob-pill">Toshkent · ${gr} · ${nom.toLowerCase()}</span></header>`))).join('\n  ')}</section>
</main>
<script>
document.querySelectorAll('.tr-kadr').forEach((k) => k.addEventListener('click', () => {
  try {
    if (document.fullscreenElement) { document.exitFullscreen() } else if (k.requestFullscreen) { const p = k.requestFullscreen(); if (p && p.catch) p.catch(() => {}) }
  } catch (e) {}
}))
</script>`
const CHIQ_T = V + '/../arxiv/tepalik-rasmlar-2026-11-16.html'
writeFileSync(CHIQ_T, sahifaT)
console.log('tepalik ok', (sahifaT.length / 1024).toFixed(0) + 'KB →', CHIQ_T)

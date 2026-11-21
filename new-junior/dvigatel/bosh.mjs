// Chizma yordamchilari (dvigatel; asli — etalon v3.4, F-1116-11…13). Toza chizish kodi: demo'da Node'da, LMS'da brauzerda yuriladi.
// 2d (19.11): fayl o'qish, V, OUT (etalon.html yo'li), HARAKAT va MAKET bu yerdan olib tashlandi — uslub endi yigish.mjs da (uslub()).
// 3e (19.11): etalon davridan qolgan, hech qayerda ishlatilmaydigan 11 yordamchi olib tashlandi (OYOQ, STAR, blk, daftar, mis, bar, TERM, terminlar,
// natija, fUstoz, fBola) — ular satr yoki funksiya edi, yuklanishda chizmasdi. Eski holi: arxiv/zaxira-2026-11-19-dvigatel-1a-oldin.tar.gz → etalon/bosh.mjs.
import { hero, robot, world } from '../src/chizma/dvigatel.js'

const YUL = '<svg class="yul" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#FFC93C" stroke="#E8A90C" stroke-width="1.2" stroke-linejoin="round"/><path d="M9.3 8.6l1.2-2.4" stroke="#fff6cf" stroke-width="1.4" stroke-linecap="round"/></svg>'
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="#fff"/></svg>'
const QALAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.6L15.6 5a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" fill="#E7CA66"/><path d="M4 20l1.2-4.6 3.4 3.4z" fill="#0D2137"/></svg>'
const LAMP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" fill="#E7CA66"/><rect x="9" y="17.5" width="6" height="2.2" rx="1" fill="#0D2137"/></svg>'
const QAYTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 1 0 2.1-5" fill="none" stroke="#0D2137" stroke-width="2.4" stroke-linecap="round"/><path d="M4 4v4.5h4.5" fill="none" stroke="#0D2137" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'

const bust = (yuz = 'xursand') => robot({ pose: 'salom', yuz, lite: true }).replace('viewBox="0 0 260 240"', 'viewBox="50 -12 160 160"')
const cg = (gap, yuz) => `<div class="cg"><span class="av">${bust(yuz)}</span><p><small>Coddy</small>${gap}</p></div>`
const matn = (tag, h, gap, extra = '', yuz) => `${tag ? `<span class="tag">${tag}</span>` : ''}<h3 class="sar">${h}</h3>${gap ? cg(gap, yuz) : ''}${extra}`
// v3.1 (F-1115-10): yo'l — zonachalar (0 = start) va ular orasida sakrash yoylari; o'tilgan yoy oltin
const zona = (i, star, at) => `<span class="z z${i}${i === 0 ? ' s' : ''}${i === star ? ' y' : ''}">${i ? `<b>${i}</b>` : ''}${i === star && at !== star ? YUL : ''}</span>`
const yoylar = (n, at) => { const C = n + 1, cx = (i) => ((i + 0.5) / C) * 100; return `<svg class="yoy" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<path class="${i < at ? 'otdi' : ''}" d="M${(cx(i) + 2.5).toFixed(1)} 9.5 Q${((cx(i) + cx(i + 1)) / 2).toFixed(1)} -6 ${(cx(i + 1) - 2.5).toFixed(1)} 9.5"/>`).join('')}</svg>` }
const yol = (cls, aktyor, n = 3, star = 3) => { const at = +((aktyor.match(/\bat(\d)\b/) || [])[1] || 0); return `<div class="yol c${n + 1} ${cls}">${aktyor}${yoylar(n, at)}${Array.from({ length: n + 1 }, (_, i) => zona(i, star, at)).join('')}</div>` }
const coddyQ = (cls = '', pose = 'korsatadi', yuz = 'xursand') => `<div class="q ${cls}">${robot({ pose, yuz })}</div>`
const momiqQ = (cls = '', mood = 'xursand', mv) => globalThis.QAH === 'coddy' ? `<div class="q ${cls}">${robot({ pose: 'turadi', yuz: 'xursand' })}</div>` : `<div class="q kichik ${cls}">${hero({ k: globalThis.QAH || 'momiq', mood, mv })}</div>`
const SH = { A: 'c1', B: 'c2', C: 'c3' }
const kartalar = (arr, cls = '') => `<div class="jv ${cls}">` + arr.map(([l, t, extra = '', k = '']) => `<div class="jk ${SH[l]} ${k}"><i class="sh ${SH[l]}"></i><span class="jt"><b>${l}</b>${t}</span>${extra}</div>`).join('') + '</div>'
const qahramonlar = () => `<div class="qq"><span class="m1">${hero({ k: 'momiq', mood: 'xursand' })}</span><span class="m2">${robot({ pose: 'quvonadi' })}</span><span class="m3">${hero({ k: 'katak', mood: 'xursand' })}</span></div>`

const fJim = (t) => `<footer class="hn jim"><span class="hint">${t}</span></footer>`


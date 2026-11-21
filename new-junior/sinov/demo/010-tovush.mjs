// 10-dars «Labirint o‘yini 2» — tovush sinovi (20.11; 9-dars usulida): AudioContext soxtasi notalarni yozadi. Ustoz ekranida: labirint yasashda katak bosilsa —
// «bos» (520 Hz), yo'l yo'q — muammo (262 Hz); o'yinda har yurish — qadam (330 Hz); daraja yutilsa — yulduz ohangi, keyingi daraja; jonli darsda bola noutbuki jim;
// solo'da chalinadi; «Ovoz» o'chiq — jim.
// Ishlatish (lokal server 5340 yoniq, demo-010 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/010-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-010.html', X = 'd10tov-' + Date.now()
const SOXTA = () => {
  window.__nota = []
  class Soxta {
    constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {} }
    resume() {}
    createOscillator() { const o = { type: '', frequency: {}, connect: (g) => g, start() {}, stop() {} }; setTimeout(() => window.__nota.push(o.frequency.value), 0); return o }
    createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect: (d) => d } }
  }
  window.AudioContext = Soxta; window.webkitAudioContext = Soxta
}
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const oyna = async (n, w, h) => { const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); await p.addInitScript(SOXTA); p.on('pageerror', (e) => xato.push(n + ': ' + e.message)); return p }
let ok = 0, jami = 0
const tek = (nom, s) => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom) }
const nota = (p) => p.evaluate(() => window.__nota.slice()), tozala = (p) => p.evaluate(() => { window.__nota = [] }), bor = (n, f) => n.filter((x) => x === f).length
const gacha = async (p, f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await gacha(p, () => !document.querySelector('#ilova .ekran')?.dataset.yuryapti, null, 8000); await p.waitForTimeout(80) } await p.waitForTimeout(300) }
const katak = async (p, x, y) => { const pt = await p.evaluate(([x, y]) => { const k = document.querySelector('#ilova .katak.maydon'), svg = k.querySelector('svg.kt'), q = svg.createSVGPoint(); q.x = x * KT + 50; q.y = (4 - y) * KT + 50; const r = q.matrixTransform(svg.getScreenCTM()); return [r.x, r.y] }, [x, y]); await p.mouse.click(pt[0], pt[1]); await p.waitForTimeout(150) }
const u = await oyna('ustoz', 1600, 900), o = await oyna('bola', 1440, 810)
await o.goto(U + '?rol=varaq'); await o.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`); await u.waitForTimeout(1500)
await u.evaluate(() => { try { localStorage.removeItem('jr-ovoz') } catch (e) {} })
// P6 (7-qadam): labirint yasash
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1500); await tozala(u)
await katak(u, 3, 0); let n = await nota(u); tek('7 · katak bosildi — «bos» (520 Hz)', bor(n, 520) === 1)
await katak(u, 3, 0); await katak(u, 5, 4); await katak(u, 6, 3); await tozala(u); await katak(u, 6, 3); await katak(u, 6, 3); n = await nota(u); tek('7 · yo‘l yopildi — muammo ohangi (262 Hz)', bor(n, 262) === 1)
// P8 (14-qadam): ikki daraja — qadamlar, daraja yutilganda yulduz ohangi
await u.selectOption('select[data-a=sakra]', '13'); await u.waitForTimeout(1500); await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tozala(u)
await bos(u, '→'); n = await nota(u); tek('14 · → — bir qadam (330 Hz)', bor(n, 330) === 1)
await tozala(u); await bos(u, '↑↑↑↓↓↓→→↑↑→→→↑↑'); await u.waitForTimeout(300); n = await nota(u); tek('14 · 1-daraja yutildi — yulduz ohangi', [660, 880, 1100, 1320].every((f) => bor(n, f) >= 1))
// bola: jonli dars — yasashda jim
await u.selectOption('select[data-a=sakra]', '7'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'B1A'); await o.waitForTimeout(800); await tozala(o)
await katak(o, 3, 0); tek('8 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), devor qo‘yildi', (await nota(o)).length === 0 && (await o.evaluate(() => document.querySelector('#bol .katak').dataset.xarita.split('|')[4][3])) === '#')
// «Ovoz» o'chiq
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1500); await tozala(u); await katak(u, 2, 1)
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true })
// solo: chalinadi
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr010-solo', '7:0') })
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1800); await tozala(s)
await katak(s, 3, 0); n = await nota(s); tek('solo B1A: katak bosildi — bola noutbukida chalinadi (520 Hz)', bor(n, 520) === 1)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

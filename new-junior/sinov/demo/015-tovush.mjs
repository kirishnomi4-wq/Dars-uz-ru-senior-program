// 15-dars «Xakaton №1» — tovush sinovi (21.11; 14-dars usulida): AudioContext soxtasi notalarni yozadi. Ustoz ekranida (13-qadam): kaktusga tegish — «tuk»,
// −2 da jon 0 dan o'tdi — muammo (262 Hz); yutdi — yulduz ohangi; jonli darsda bola noutbuki jim; «Ovoz» o'chiq — jim; solo'da chalinadi.
// Ishlatish (lokal server 5340 yoniq, demo-015 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/015-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-015.html', X = 'd15tov' + Date.now().toString(36)
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
const tinch = (p) => gacha(p, () => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, 15000)
const ishga = async (p, s) => { await p.click(s); await p.waitForTimeout(400); await tinch(p); await p.waitForTimeout(300) }
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p) } await p.waitForTimeout(400) }
const u = await oyna('ustoz', 1600, 900), o = await oyna('bola', 1440, 810)
await o.goto(U + '?rol=varaq'); await o.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`); await u.waitForTimeout(1500)
await u.evaluate(() => { try { localStorage.removeItem('jr-ovoz') } catch (e) {} })
// 13-qadam (P8): kaktusga ikki tegish — «tuk» (150) va jon −1 — muammo (262); yutish — yulduz ohangi
await u.selectOption('select[data-a=sakra]', '12'); await u.waitForTimeout(1500)
await ishga(u, '#ust .hn .ishga'); await tozala(u); await bos(u, '→→→→↑↑'); let n = await nota(u)
tek('13 · kaktus — «tuk», jon 0 dan o‘tdi — muammo (262 Hz)', bor(n, 150) >= 1 && bor(n, 262) >= 1)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await ishga(u, '#ust .hn .ishga'); await tozala(u); await bos(u, '↑↓→→→→→↑↑←←←↑↑→→→→'); n = await nota(u)
tek('13 · yutdi — yulduz ohangi', [660, 880, 1100, 1320].every((f) => bor(n, f) >= 1))
// bola: jonli dars — jim (11-qadam, dastur bo'sh — Bo'shvoy)
await u.selectOption('select[data-a=sakra]', '10'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'BXO'); await o.waitForTimeout(800)
await tozala(o); await ishga(o, '#bol .hn .asos')
tek('11 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), muammocha chiqdi', (await nota(o)).length === 0 && !!(await o.$('#bol .dv-muam')))
// «Ovoz» o'chiq
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '12'); await u.waitForTimeout(1500); await ishga(u, '#ust .hn .ishga'); await tozala(u); await bos(u, '→→→→↑↑')
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true })
// solo: chalinadi (11-qadam — Labirint, dastur bo'sh)
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr015-xk', JSON.stringify({ oyin: 'lab', qism: ['qoida', 'daraja2', 'tovush'], tanladi: 1 })); localStorage.setItem('demo-jr015-solo', '10:0') })
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1800); await tozala(s); await ishga(s, (await s.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)')
n = await nota(s); tek('solo BXL: dastur bo‘sh — muammo chalinadi', bor(n, 262) >= 1)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

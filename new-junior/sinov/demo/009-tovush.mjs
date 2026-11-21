// 9-dars «Labirint o‘yini 1» — tovush sinovi (20.11; 4-dars usulida): AudioContext soxtasi notalarni yozadi. Ustoz ekranida: har yurish — qadam (330 Hz);
// shart «yo‘q» — tovushsiz (tekshiruv qadam emas — 8-dars); shartsiz urilish — «tuk» (150, 110 Hz) va muammocha (262 Hz); yutganda yulduz ohangi;
// 11 · ★ play sound (if ichida) — qahramon yurganda chalinadi; jonli darsda bola noutbuki jim; solo'da chalinadi; «Ovoz» o'chiq — jim.
// Ishlatish (lokal server 5340 yoniq, demo-009 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/009-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-009.html', X = 'd9tov-' + Date.now()
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
const nota = (p) => p.evaluate(() => window.__nota.slice())
const tozala = (p) => p.evaluate(() => { window.__nota = [] })
const bor = (n, f) => n.filter((x) => x === f).length
const gacha = async (p, f, arg, ms = 15000) => { try { await p.waitForFunction(f, arg, { timeout: ms }); return true } catch { return false } }
const KEY = { '→': 'ArrowRight', '←': 'ArrowLeft', '↑': 'ArrowUp', '↓': 'ArrowDown' }
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await gacha(p, () => !document.querySelector('#ilova .ekran')?.dataset.yuryapti, null, 8000); await p.waitForTimeout(80) } await p.waitForTimeout(300) }
const u = await oyna('ustoz', 1600, 900), o = await oyna('bola', 1440, 810)
await o.goto(U + '?rol=varaq'); await o.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`); await u.waitForTimeout(1500)
await u.evaluate(() => { try { localStorage.removeItem('jr-ovoz') } catch (e) {} })
// P8 (14-qadam): to'rt dasturcha qoida bilan — startda ↑ «yo'q» (jim); → (qadam); kalitsiz eshik — «yo'q» + Kamvoy (muammo ohangi)
await u.selectOption('select[data-a=sakra]', '13'); await u.waitForTimeout(1200); await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tozala(u)
await bos(u, '↑'); let n = await nota(u); tek('14 · startda ↑ — shart «yo‘q»: tovushsiz (' + n.length + ' nota)', n.length === 0)
await tozala(u); await bos(u, '→→'); n = await nota(u); tek('14 · → ×2 — ikki qadam (330 Hz)', bor(n, 330) === 2)
await tozala(u); await bos(u, '↑↑↑→'); n = await nota(u); tek('14 · kalitsiz eshik — «yo‘q», Kamvoy: muammo ohangi (262 Hz), «tuk» yo‘q', bor(n, 262) === 1 && !bor(n, 150))
await tozala(u); await bos(u, '←→→→→→'); n = await nota(u); tek('14 · yulduzga yetdi — yulduz ohangi (660…1320 Hz)', [660, 880, 1100, 1320].every((f) => bor(n, f) >= 1))
// P7 (10-qadam): tayyor shartsiz dasturchalar — →↑↑→: devorga urildi — «tuk» (150 + 110 Hz) va muammo
await u.selectOption('select[data-a=sakra]', '9'); await u.waitForTimeout(1200); await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tozala(u)
await bos(u, '→↑↑→'); n = await nota(u); tek('10 · shartsiz → devorga — «tuk» (150 + 110 Hz) va muammo ohangi', bor(n, 150) === 1 && bor(n, 110) === 1 && bor(n, 262) === 1)
// bola: jonli dars — jim
await u.selectOption('select[data-a=sakra]', '7'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'B1A'); await o.waitForTimeout(500)
await o.evaluate(() => { const ek = document.querySelector('#bol .ekran'); blQosh(ek, 'k', 'right'); blQosh(ek, 'r'); sanoq(ek) }); await o.click('#bol .hn .asos'); await o.waitForTimeout(400); await tozala(o)
await bos(o, '→→'); tek('8 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), qahramon yurdi', (await nota(o)).length === 0 && (await o.$eval('#bol .kt-yr text', (e) => e.textContent)) === '(2, 0)')
// «Ovoz» o'chiq — ustoz ham jim
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '9'); await u.waitForTimeout(1200); await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tozala(u)
await bos(u, '→↑'); tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
// solo, 11 · ★: play sound if ichida — yurganda «♪ qadam» (330) + qadam (330), «yo‘q» bo'lganda jim
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr009-solo', '10:3') })
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1500)
const sid = await s.evaluate(() => document.querySelector('#ilova .ekran')?.dataset.id)
await s.evaluate(() => { DARS.oyinlar.__t = DARS.oyinlar.qoida.map(([k, d]) => [k, k === 'up' ? [{ ...d[0], ichki: [...d[0].ichki, { t: 'n', m: 'qadam' }] }] : d]); labQur(document.querySelector('#bol .ekran'), '__t') }); await s.waitForTimeout(500)
await s.click('#bol .hn .ishga'); await s.waitForTimeout(400); await tozala(s)
await bos(s, '↑'); n = await nota(s); tek('solo ' + sid + ': ↑ — yurdi va tovush (if ichida) — qadam ×2 (330 Hz)', sid === 'B2Y' && bor(n, 330) === 2)
await tozala(s); await bos(s, '←'); n = await nota(s); tek('solo: ← — «yo‘q», qahramon turdi — jim', n.length === 0)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

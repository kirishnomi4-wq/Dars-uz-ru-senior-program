// 2-dars «Labirint» — tovush sinovi (dvigatel 5b-3, 19.11; 1-dars sinovi sinov/demo/tovush.mjs usulida): AudioContext soxtasi notalarni
// chastotasi bilan yozadi. Ustoz ekranida: devorga urilish «tuk» (150 va 110 Hz), har katakka qadam (330 Hz), yulduz (660…1320 Hz), huk sinovlari,
// raqamlar; jonli darsda bola noutbuki jim (dastur ishlasa ham); solo'da bola noutbukida chalinadi; «Ovoz» o'chirilsa ustoz ham jim.
// Ishlatish (lokal server 5340 yoniq, demo-002 yig'ilgan): node new-junior/sinov/demo/002-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-002.html', X = 'd2tov-' + Date.now()
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
const tugadi = (p, r) => gacha(p, (r) => { const e = document.querySelector(r + ' .ekran'); return e && !e.dataset.yuryapti }, r, 20000)
const BLOK = { r: 'move right', l: 'move left', u: 'move up', d: 'move down' }
const qosh = async (p, r, d) => { for (const t of d) { await p.locator(r + ' .pl .mbw:not(.yopiq) .mb', { hasText: BLOK[t] }).first().click(); await p.waitForTimeout(90) } }
const u = await oyna('ustoz', 1600, 900), o = await oyna('bola', 1440, 810)
await o.goto(U + '?rol=varaq'); await o.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`); await u.waitForTimeout(1500)
await u.evaluate(() => { try { localStorage.removeItem('jr-ovoz') } catch (e) {} })
// huk: A — 2 qadam, 3-blokda «tuk»
await u.selectOption('select[data-a=sakra]', '2'); await tozala(u); await u.waitForTimeout(700)
await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 1); await u.waitForTimeout(200)
let n = await nota(u)
tek('3 · huk A: 2 qadam (330 Hz) va «tuk» (150 + 110 Hz) — ' + n.length + ' nota', bor(n, 330) === 2 && bor(n, 150) === 1 && bor(n, 110) === 1)
// huk C — yulduz
await u.click('#ust .hn .asos'); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 2); await tozala(u)
await u.click('#ust .hn .asos'); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 3); await u.waitForTimeout(300)
n = await nota(u); tek('3 · huk C: 6 qadam va yulduz ohangi (660…1320 Hz), «tuk» yo‘q', bor(n, 330) === 6 && [660, 880, 1100, 1320].every((f) => bor(n, f) >= 1) && !bor(n, 150))
// raqamlar
await u.selectOption('select[data-a=sakra]', '4'); await u.waitForTimeout(900); await tozala(u)
await u.click('#ust .hn .asos'); await u.waitForTimeout(150); n = await nota(u)
tek('5 · raqam yonganda qisqa qadam ovozi', bor(n, 330) === 1)
// ustoz xato dasturi: P7 — 3 qadam, 4-blokda tuk, keyin muammo ohangi
await u.selectOption('select[data-a=sakra]', '9'); await u.waitForTimeout(1000); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tugadi(u, '#ust'); await u.waitForTimeout(200)
n = await nota(u); tek('10 · ustoz P7: 3 qadam, «tuk», muammocha ohangi (330 + 262 Hz)', bor(n, 330) === 4 && bor(n, 150) === 1 && bor(n, 262) === 1)
// bola: jonli dars — jim
await u.selectOption('select[data-a=sakra]', '7'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'B2'); await o.waitForTimeout(500); await tozala(o)
await qosh(o, '#bol', 'uurrr'); await o.click('#bol .hn .asos'); await o.waitForTimeout(300); await tugadi(o, '#bol')
tek('8 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), lekin dastur ishladi', (await nota(o)).length === 0 && /Yetib bordi/.test(await o.$eval('#bol .hn .hint', (e) => e.textContent)))
// «Ovoz» o'chiq — ustoz ham jim
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '9'); await u.waitForTimeout(1000); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tugadi(u, '#ust')
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
// solo: bola noutbukida chalinadi
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr002-solo', '7:0') })
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1200); await tozala(s)
await qosh(s, '#ilova', 'urr'); await s.click('#ilova .hn .ishga'); await s.waitForTimeout(300); await tugadi(s, '#bol'); await s.waitForTimeout(200)
n = await nota(s); tek('solo B2: bola noutbukida chalinadi — 1 qadam va «tuk» (' + n.length + ' nota)', bor(n, 330) >= 1 && bor(n, 150) === 1)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

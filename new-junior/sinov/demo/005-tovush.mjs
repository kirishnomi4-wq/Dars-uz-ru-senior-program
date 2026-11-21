// 5-dars «Takrorlash» — tovush sinovi (20.11; 2–4-dars usulida): ustoz ekranida takrorlash ichidagi har qadam — qadam (330 Hz), oxirida yulduz;
// rasm tayyor — yulduz ohangi; jonli darsda bola noutbuki jim; solo'da chalinadi; «Ovoz» o'chiq — jim.
// Ishlatish (lokal server 5340 yoniq, demo-005 yig'ilgan): node new-junior/sinov/demo/005-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-005.html', X = 'd5tov-' + Date.now()
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
const qur = (p, r, s) => p.evaluate(({ r, s }) => { const d = [...s.matchAll(/p(\d+)\[([rlud]+)\]|[rlud]/g)].map((m) => (m[1] ? { t: 'p', m: m[1], ichki: [...m[2]].map((t) => ({ t })) } : { t: m[0] })); const ek = document.querySelector(r + ' .ekran'); blQur(ek, d); sanoq(ek) }, { r, s })
// P6 (7-qadam): repeat 3 [↑] — 3 qadam va yulduz
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1000); await qur(u, '#ust', 'p3[u]'); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tugadi(u, '#ust'); await u.waitForTimeout(300)
let n = await nota(u); tek('7 · repeat 3 — 3 qadam (330 Hz) va yulduz ohangi — ' + n.length + ' nota', bor(n, 330) === 3 && [660, 880, 1100, 1320].every((f) => bor(n, f) >= 1))
// P7 (10-qadam): kvadrat — 12 qadam, rasm tayyor
await u.selectOption('select[data-a=sakra]', '9'); await u.waitForTimeout(1000); await qur(u, '#ust', 'p3[r] p3[u] p3[l] p3[d]'); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tugadi(u, '#ust'); await u.waitForTimeout(300)
n = await nota(u); tek('10 · kvadrat — 12 qadam, «Rasm tayyor!» ohangi', bor(n, 330) === 12 && bor(n, 1320) >= 1)
// bola: jonli dars — jim
await u.selectOption('select[data-a=sakra]', '7'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'B1A'); await o.waitForTimeout(500)
await qur(o, '#bol', 'p5[r]'); await tozala(o); await o.click('#bol .hn .asos'); await o.waitForTimeout(300); await tugadi(o, '#bol')
tek('8 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), dastur ishladi', (await nota(o)).length === 0 && /Yetib bordi/.test(await o.$eval('#bol .hn .hint', (e) => e.textContent)))
// ovoz o'chiq
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1000); await qur(u, '#ust', 'p3[u]'); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tugadi(u, '#ust')
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
// solo
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr005-solo', '7:0') })
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1200); await qur(s, '#bol', 'p2[r]'); await tozala(s)
await s.click('#ilova .hn .ishga'); await s.waitForTimeout(300); await tugadi(s, '#bol'); await s.waitForTimeout(300)
n = await nota(s); tek('solo B1A: bola noutbukida chalinadi — 2 qadam (' + n.length + ' nota)', bor(n, 330) >= 2)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

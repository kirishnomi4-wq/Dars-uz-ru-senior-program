// 8-dars «Shart» — tovush sinovi (20.11): shart tekshiruvi tovushsiz (qadam emas), har move — qadam (330 Hz), ikki labirintda yulduz ohangi;
// devorga urilish — «tuk»; jonli darsda bola noutbuki jim; «Ovoz» o'chiq — jim.
// Ishlatish (lokal server 5340 yoniq, demo-008 yig'ilgan): node new-junior/sinov/demo/008-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-008.html', X = 'd8tov-' + Date.now()
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
const blq = (d) => d.map((b) => (Array.isArray(b) ? (b[0] === 'p' ? { t: 'p', m: String(b[1]), ichki: blq(b[2]) } : { t: 'a', m: b[1], ichki: blq(b[2]) }) : { t: b }))
const qur = (p, r, d) => p.evaluate(({ r, d }) => { const ek = document.querySelector(r + ' .ekran'); blQur(ek, d); sanoq(ek) }, { r, d: blq(d) })
const tugadi2 = (p, r) => p.waitForFunction((r) => !document.querySelector(r + ' .ekran').dataset.yuryapti, r, { timeout: 60000 })
// 7-qadam: repeat 6 [if ← [←]] — 1-labirintda 3 qadam, 2-labirintda 6 qadam (330 Hz), tekshiruv tovushsiz
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1000); await qur(u, '#ust', [['p', 6, [['a', 'left', ['l']]]]]); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tugadi2(u, '#ust'); await u.waitForTimeout(400)
let n = await nota(u); tek('7 · ikki labirint — 3 + 6 = 9 qadam (330 Hz), shart tovushsiz — ' + bor(n, 330) + ' qadam', bor(n, 330) === 9)
// devorga urilish — tuk
await qur(u, '#ust', [['p', 6, ['l']]]); await tozala(u); await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tugadi2(u, '#ust'); await u.waitForTimeout(300)
// 3 qadam (330 Hz) + tuk (150, 110 Hz) + muammo ohangi (330, 262 Hz) = 7 nota
n = await nota(u); tek('7 · repeat 6 [←] — 3 qadam, «tuk» va muammo ohangi (' + n.length + ' nota)', bor(n, 330) === 4 && bor(n, 150) === 1 && bor(n, 262) === 1 && n.length === 7)
// bola: jonli dars — jim
await u.selectOption('select[data-a=sakra]', '7'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'B1A'); await o.waitForTimeout(500)
await qur(o, '#bol', [['p', 5, [['a', 'down', ['d']]]]]); await tozala(o); await o.click('#bol .hn .asos'); await o.waitForTimeout(300); await tugadi2(o, '#bol')
tek('8 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), dastur ishladi', (await nota(o)).length === 0 && /Ikkalasida yetdi/.test(await o.$eval('#bol .hn .hint', (e) => e.textContent)))
// ovoz o'chiq
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1000); await qur(u, '#ust', [['p', 6, [['a', 'left', ['l']]]]]); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tugadi2(u, '#ust')
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

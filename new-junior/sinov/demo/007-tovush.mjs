// 7-dars «Kostyum va tovush» — tovush sinovi (20.11; 2–6-dars usulida): ustoz ekranida 14-qadam o'yinda → — qadam tovushi (330 Hz) va «♪ qadam»;
// space — jiring (yulduz ohangi); kostyum bloki tovushsiz; jonli darsda bola noutbuki jim, lekin «♪» belgisi ko'rinadi; solo'da chalinadi; «Ovoz» o'chiq — jim.
// Ishlatish (lokal server 5340 yoniq, demo-007 yig'ilgan): node new-junior/sinov/demo/007-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-007.html', X = 'd7tov-' + Date.now()
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
const tuz = (p, r, ds) => p.evaluate(({ r, ds }) => { const ek = document.querySelector(r + ' .ekran'); blYukla(ek, ds.flatMap(([k, ...b]) => [{ t: 'k', m: k }, ...b.map((x) => (x.includes(':') ? { t: x[0], m: x.slice(2) } : { t: x }))])); sanoq(ek) }, { r, ds })
const qur = (p, r, d) => p.evaluate(({ r, d }) => { const ek = document.querySelector(r + ' .ekran'); blQur(ek, d); sanoq(ek) }, { r, d })
// 7-qadam: kostyum bloki tovushsiz — faqat qadam (330 Hz) va yulduz
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1000); await qur(u, '#ust', [{ t: 'r' }, { t: 'r' }, { t: 'v', m: 'xursand' }]); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tugadi(u, '#ust'); await u.waitForTimeout(300)
let n = await nota(u); tek('7 · → → xursand — 2 qadam (330 Hz), kostyum tovushsiz — ' + n.length + ' nota', bor(n, 330) === 2)
// 14-qadam: o'yin — → (qadam tovushi + qadam) va space (jiring)
await u.selectOption('select[data-a=sakra]', '13'); await u.waitForTimeout(1000); await tuz(u, '#ust', [['right', 'r', 'n:qadam'], ['space', 'v:xursand', 'n:jiring']]); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(350)
for (let k = 0; k < 5; k++) { await u.keyboard.press('ArrowRight'); await u.waitForTimeout(700) }
n = await nota(u); tek('14 · → besh marta: qadam va qadam tovushi — 330 Hz kamida 10 (' + bor(n, 330) + ')', bor(n, 330) >= 10)
await tozala(u); await u.keyboard.press(' '); await u.waitForTimeout(1200); n = await nota(u)
tek('14 · space — jiring (yulduz ohangi) — ' + n.length + ' nota', [660, 880, 1100, 1320].some((f) => bor(n, f) >= 1))
// bola: jonli dars — jim, lekin «♪» ko'rinadi
await u.selectOption('select[data-a=sakra]', '14'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'B3A'); await o.waitForTimeout(500)
await tuz(o, '#bol', [['right', 'r', 'n:qadam']]); await tozala(o); await o.click('#bol .hn .asos'); await o.waitForTimeout(300); await o.keyboard.press('ArrowRight'); await o.waitForTimeout(150)
const not = await o.evaluate(() => (document.querySelector('#bol .dv-pufak.nota-p') || {}).textContent || ''); await o.waitForTimeout(800)
tek('15 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), «♪ qadam» ko‘rindi', (await nota(o)).length === 0 && not === '♪ qadam', not)
// ovoz o'chiq
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1000); await qur(u, '#ust', [{ t: 'r' }, { t: 'r' }]); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tugadi(u, '#ust')
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

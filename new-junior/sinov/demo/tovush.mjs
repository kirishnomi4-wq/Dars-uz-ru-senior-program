// Tovush sinovi (18.11, qaror 3A): ustoz ekranida chalinadi · jonli darsda bola noutbuki jim · «Ovoz» tugmasi o'chiradi.
// AudioContext soxtasi notalarni sanaydi (eshitib tekshirib bo'lmaydi). Ishlatish (lokal server 5340 yoniq): node new-junior/sinov/demo/tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo.html', X = 'tovush-' + Date.now()
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
const tek = (nom, shart) => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom) }
const nota = (p) => p.evaluate(() => window.__nota.length)
const tozala = (p) => p.evaluate(() => { window.__nota = [] })
const u = await oyna('ustoz', 1600, 900), o = await oyna('bola', 1440, 810)
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`)
await o.evaluate(() => localStorage.clear()); await o.reload(); await o.fill('#ei', 'Sinov'); await o.click('#ef button'); await u.waitForTimeout(1500)
await u.evaluate(() => { try { localStorage.removeItem('jr-ovoz') } catch (e) {} })
// ustoz: «Coddy sanaydi» — 4 ta blok, ishga tushiradi
await u.selectOption('select[data-a=sakra]', '11'); await u.waitForTimeout(1200); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(4000)
const n1 = await nota(u)
tek('ustoz ekranida dastur ishlaganda tovush chalindi (' + n1 + ' nota)', n1 >= 4)
tek('«Ovoz yoqiq» tugmasi panelda', (await u.$eval('[data-a=ovoz]', (e) => e.textContent)) === 'Ovoz yoqiq')
// bola: jonli dars — birinchi dastur, yulduzga yetadi — jim
await u.selectOption('select[data-a=sakra]', '10'); await u.waitForTimeout(1500); await tozala(o)
for (let i = 0; i < 3; i++) { await o.click('#bol .pl .mbw:not(.yopiq) .mb >> nth=0'); await o.waitForTimeout(120) }
await o.click('#bol .hn .asos'); await o.waitForTimeout(4200)
tek('jonli darsda bola noutbuki jim (' + (await nota(o)) + ' nota), lekin dastur ishladi', (await nota(o)) === 0 && (await o.$eval('#bol .ekran', (e) => e.dataset.id)) === 'B4')
// «Ovoz» o'chirildi — ustoz ham jim; qayta yoqildi — chaladi
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
tek('tugma bosildi → «Ovoz o‘chiq»', (await u.$eval('[data-a=ovoz]', (e) => e.textContent)) === 'Ovoz o‘chiq')
await u.selectOption('select[data-a=sakra]', '11'); await u.waitForTimeout(1200); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(4000)
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)) + ' nota)', (await nota(u)) === 0)
await u.reload(); await u.waitForTimeout(1200)
tek('o‘chiq holat sahifa yangilanganda ham qoladi', (await u.$eval('[data-a=ovoz]', (e) => e.textContent)) === 'Ovoz o‘chiq')
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(300)
tek('qayta yoqildi → «Ovoz yoqiq» va qisqa tovush', (await u.$eval('[data-a=ovoz]', (e) => e.textContent)) === 'Ovoz yoqiq' && (await nota(u)) >= 1)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()

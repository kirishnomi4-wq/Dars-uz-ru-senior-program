// 19-dars «Bloklar ortidagi kod» — tovush sinovi (22.11; 17–18-dars usulida): AudioContext soxtasi notalarni yozadi. Ustoz ekranida: 3-qadam — kod sinovi
// (A: raketa joyida — muammo 262 Hz; C: qator yonadi, raketa yurdi — qadam); jonli darsda bola noutbuki jim; «Ovoz» o'chiq — jim;
// solo'da chalinadi (B1B: noto'g'ri qator — muammo; uchala qator topildi — yulduz ohangi; koddagi son — bosish tovushi).
// Ishlatish (lokal server 5340 yoniq, demo-019 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/019-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-019.html', X = 'd19tov' + Date.now().toString(36)
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
const u = await oyna('ustoz', 1600, 900), o = await oyna('bola', 1440, 810)
await o.goto(U + '?rol=varaq'); await o.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`); await u.waitForTimeout(1500)
await u.evaluate(() => { try { localStorage.removeItem('jr-ovoz') } catch (e) {} })
// 3-qadam (P2S): A — «o‘ngga yur» — kompyuter tushunmadi (muammo), C — qator yonadi, raketa yurdi
const jn = (n) => gacha(u, (n) => document.querySelectorAll('#ust .jk .jn').length >= n && !document.querySelector('#ust .ekran').dataset.yuryapti, n, 60000)
await u.selectOption('select[data-a=sakra]', '2'); await u.waitForTimeout(1500); await tozala(u)
await u.click('#ust .hn .asos'); await jn(1); await u.waitForTimeout(300)
tek('3 · A — kompyuter so‘zni tushunmadi — muammo (262 Hz)', bor(await nota(u), 262) >= 1)
await u.click('#ust .hn .asos'); await jn(2); await u.waitForTimeout(300); await tozala(u)
await u.click('#ust .hn .asos'); await jn(3); await u.waitForTimeout(300)
const n2 = await nota(u); tek('3 · C — raketa yurdi — qadam tovushi, muammo yo‘q', n2.length > 0 && bor(n2, 262) === 0)
// bola: jonli dars — jim (8-qadam, B1A: kodni ochadi, karta bosadi)
await u.selectOption('select[data-a=sakra]', '7'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'B1A'); await o.waitForTimeout(1000)
await tozala(o); await o.click('#bol .hn .kod-t'); await o.waitForTimeout(500); await o.click('#bol .per-k[data-p="oq"]'); await o.waitForTimeout(600)
tek('8 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), kod ochildi', (await nota(o)).length === 0 && (await o.evaluate(() => document.querySelector('#bol .ekran').classList.contains('kod-och'))))
// «Ovoz» o'chiq
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '2'); await u.waitForTimeout(1500); await tozala(u)
await u.click('#ust .hn .asos'); await u.waitForTimeout(4500)
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true })
// solo: chalinadi
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr019-solo', '7:1') })
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1800); await tozala(s)
const nishon = () => s.evaluate(() => document.querySelector('#ilova .ekran').__kod.nishon)
const bos = async (idd) => { await s.locator('#ilova .kodp .kq[data-b="' + idd + '"]').click(); await s.waitForTimeout(900) }
let n = await nishon(); const yomon = await s.evaluate((n) => [...document.querySelectorAll('#ilova .kodp .kq[data-b]')].find((x) => x.dataset.b !== n).dataset.b, n)
await bos(yomon); tek('solo B1B: noto‘g‘ri qator — muammo chalinadi (262 Hz)', bor(await nota(s), 262) >= 1)
await tozala(s)
for (let i = 0; i < 3; i++) { n = await nishon(); if (!n) break; await bos(n) }
await s.waitForTimeout(800); const nn = await nota(s); tek('solo B1B: uchala qator topildi — yulduz ohangi', [660, 880, 1100, 1320].every((f) => bor(nn, f) >= 1))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

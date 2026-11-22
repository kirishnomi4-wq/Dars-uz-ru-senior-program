// 14-dars «Xatoni topish» — tovush sinovi (21.11; 13-dars usulida): AudioContext soxtasi notalarni yozadi. Ustoz ekranida: rasmdan chiqdi — muammo (262 Hz),
// «Bitta qadam» bilan chiqdi — muammo; «Rasm tayyor!» — yulduz ohangi; jonli darsda bola noutbuki jim; «Ovoz» o'chiq — jim; solo'da chalinadi.
// Ishlatish (lokal server 5340 yoniq, demo-014 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/014-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-014.html', X = 'd14tov' + Date.now().toString(36)
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
const u = await oyna('ustoz', 1600, 900), o = await oyna('bola', 1440, 810)
await o.goto(U + '?rol=varaq'); await o.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`); await u.waitForTimeout(1500)
await u.evaluate(() => { try { localStorage.removeItem('jr-ovoz') } catch (e) {} })
// 10-qadam (P7): ▶ — rasmdan chiqdi; «Bitta qadam» — chiqdi; joy almashtirib ▶ — «Rasm tayyor!»
await u.selectOption('select[data-a=sakra]', '9'); await u.waitForTimeout(1500); await tozala(u)
await ishga(u, '#ust .hn .ishga'); let n = await nota(u)
tek('10 · ▶ — rasmdan chiqdi: muammo (262 Hz)', bor(n, 262) >= 1)
await tozala(u); await u.click('#ust .hn .bq-t'); await u.waitForTimeout(1500); await tinch(u); await u.waitForTimeout(300); n = await nota(u)
tek('10 · «Bitta qadam» — 1-qadamda chiqdi: muammo (262 Hz)', bor(n, 262) >= 1)
await u.evaluate(() => { const ek = document.querySelector('#ust .ekran'), ws = BL_WS.get(ek), r = ws.getAllBlocks(true).filter((x) => x.type.startsWith('move')); blAlmashtir(ws, r[0], r[1]); sanoq(ek) }); await u.waitForTimeout(300)
await tozala(u); await ishga(u, '#ust .hn .ishga'); n = await nota(u)
tek('10 · «Rasm tayyor!» — yulduz ohangi', [660, 880, 1100, 1320].every((f) => bor(n, f) >= 1))
// bola: jonli dars — jim
await u.selectOption('select[data-a=sakra]', '7'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'B1A'); await o.waitForTimeout(800)
await tozala(o); await ishga(o, '#bol .hn .asos')
tek('8 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), muammocha chiqdi', (await nota(o)).length === 0 && !!(await o.$('#bol .dv-muam')))
// «Ovoz» o'chiq
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '9'); await u.waitForTimeout(1500); await tozala(u); await ishga(u, '#ust .hn .ishga')
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true })
// solo: chalinadi
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr014-solo', '7:0') })
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1800); await tozala(s); await ishga(s, (await s.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)')
n = await nota(s); tek('solo B1A: chet — bola noutbukida «tuk» va muammo chalinadi', bor(n, 262) >= 1 && bor(n, 150) >= 1)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

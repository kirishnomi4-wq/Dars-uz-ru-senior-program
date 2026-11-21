// 13-dars «Tasodifiy son» — tovush sinovi (21.11; 11–12-dars usulida): AudioContext soxtasi notalarni yozadi. Ustoz ekranida: olma tushdi — qadam (330 Hz);
// maydondan tashqari — «tuk» va muammo (262 Hz); «Har safar boshqa joy!» — yulduz ohangi; jonli darsda bola noutbuki jim; solo'da chalinadi; «Ovoz» o'chiq — jim.
// Ishlatish (lokal server 5340 yoniq, demo-013 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/013-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-013.html', X = 'd13tov-' + Date.now()
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
const tinch = (p) => gacha(p, () => !document.querySelector('#ilova .ekran')?.dataset.yuryapti, null, 8000)
const bos = async (p, s) => { for (const c of s) { await p.keyboard.press(KEY[c]); await p.waitForTimeout(40); await tinch(p); await p.waitForTimeout(80) } await p.waitForTimeout(300) }
const dastur = (p, d) => p.evaluate((d) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  let o = null; for (const [t, m] of d) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else x.moveTo(new Blockly.utils.Coordinate(0, 0)); o = x }
  ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, d).then(() => p.waitForTimeout(300))
const O1 = [['y', 'r1-5,0']]
const u = await oyna('ustoz', 1600, 900), o = await oyna('bola', 1440, 810)
await o.goto(U + '?rol=varaq'); await o.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`); await u.waitForTimeout(1500)
await u.evaluate(() => { try { localStorage.removeItem('jr-ovoz') } catch (e) {} })
// P6 (7-qadam): tanlov 8 — tashqari; keyin 4, 2, 5 (1 to 5)
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1500); await dastur(u, [['y', 'r1-10,0']]); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tinch(u); await u.waitForTimeout(300); let n = await nota(u)
tek('7 · «8» — maydondan tashqari: «tuk» (150 Hz) va muammo (262 Hz)', bor(n, 262) >= 1 && bor(n, 150) >= 1)
await dastur(u, O1); await tozala(u); await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tinch(u); await u.waitForTimeout(300); n = await nota(u)
tek('7 · olma savatga tushdi — qadam (330 Hz)', bor(n, 330) === 1 && bor(n, 262) === 0)
await tozala(u); for (let i = 0; i < 2; i++) { await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tinch(u) } await u.waitForTimeout(300); n = await nota(u)
tek('7 · uchinchi sinov — «Har safar boshqa joy!»: yulduz ohangi', [660, 880, 1100, 1320].every((f) => bor(n, f) >= 1))
// bola: jonli dars — jim
await u.selectOption('select[data-a=sakra]', '7'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'B1A'); await o.waitForTimeout(800)
await dastur(o, [['y', 'r0-6,2']]); await tozala(o); await o.click('#bol .hn .asos'); await o.waitForTimeout(400); await tinch(o)
tek('8 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), olma tushdi', (await nota(o)).length === 0 && (await o.$$('#bol .kt-olma.tushdi')).length === 1)
// «Ovoz» o'chiq
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1500); await dastur(u, O1); await tozala(u); await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tinch(u)
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true })
// solo: chalinadi
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr013-solo', '7:0') })
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1800); await dastur(s, [['y', 'r0-6,2']]); await tozala(s); await s.click((await s.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)'); await s.waitForTimeout(400); await tinch(s)
n = await nota(s); tek('solo B1A: olma tushdi — bola noutbukida chalinadi (330 Hz)', bor(n, 330) === 1)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

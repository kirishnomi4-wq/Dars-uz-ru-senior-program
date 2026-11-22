// 17-dars «Kosmik o‘yin 1» — tovush sinovi (21.11; 16-dars usulida): AudioContext soxtasi notalarni yozadi. Ustoz ekranida: 10-qadam — o'q turib qoldi
// (muammo, 262 Hz); 14-qadam — o'yin yutildi (yulduz ohangi); jonli darsda bola noutbuki jim; «Ovoz» o'chiq — jim; solo'da chalinadi (B1A — Bo'shvoy).
// Ishlatish (lokal server 5340 yoniq, demo-017 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/017-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-017.html', X = 'd17tov' + Date.now().toString(36)
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
const qur = (p, r, g) => p.evaluate(({ r, g }) => { const ek = document.querySelector(r + ' .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek) }, { r, g }).then(() => p.waitForTimeout(400))
const OQ = [[['k', 'space'], ['C']], [['H'], ['p', '4', [['u']]], ['D']]]
const u = await oyna('ustoz', 1600, 900), o = await oyna('bola', 1440, 810)
await o.goto(U + '?rol=varaq'); await o.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`); await u.waitForTimeout(1500)
await u.evaluate(() => { try { localStorage.removeItem('jr-ovoz') } catch (e) {} })
// 10-qadam (P8): o'q turib qoldi — muammo
await u.selectOption('select[data-a=sakra]', '9'); await u.waitForTimeout(1500)
await qur(u, '#ust', { oq: [OQ[0]] }); await tozala(u); await u.click('#ust .hn .ishga'); await u.waitForTimeout(700); await u.keyboard.press(' '); await u.waitForTimeout(1200); let n = await nota(u)
tek('10 · o‘q turib qoldi — muammo (262 Hz)', bor(n, 262) >= 1)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300)
// 14-qadam (P10): o'yin yutildi — yulduz ohangi
await u.selectOption('select[data-a=sakra]', '13'); await u.waitForTimeout(1500); await tozala(u)
await u.evaluate(() => { const ek = document.querySelector('#ust .ekran'); ek.querySelectorAll('.ks-n').forEach((e, i) => { if (i) e.remove() }) }) // bitta nishon (1, 4) qoldi
await u.evaluate(() => { const b = TOP('P10').bosh; b.kosmik = { ...b.kosmik, nishon: [[1, 4]] } })
await u.click('#ust .hn .ishga'); await u.waitForTimeout(700)
for (const k of ['ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowLeft', ' ']) { await u.keyboard.press(k); await u.waitForTimeout(700) }
await u.waitForTimeout(2600); n = await nota(u)
tek('14 · «Siz yutdingiz!» — yulduz ohangi', [660, 880, 1100, 1320].every((f) => bor(n, f) >= 1))
// bola: jonli dars — jim (8-qadam, B1A: dastur bo'sh — Bo'shvoy)
await u.selectOption('select[data-a=sakra]', '7'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'B1A'); await o.waitForTimeout(800)
await tozala(o); await o.click('#bol .hn .asos'); await o.waitForTimeout(700); await o.keyboard.press('ArrowRight'); await o.waitForTimeout(600)
tek('8 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), muammocha chiqdi', (await nota(o)).length === 0 && !!(await o.$('#bol .dv-muam')))
// «Ovoz» o'chiq
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '9'); await u.waitForTimeout(1500); await qur(u, '#ust', { oq: [OQ[0]] }); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(700); await u.keyboard.press(' '); await u.waitForTimeout(1200)
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true })
// solo: chalinadi
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr017-solo', '7:0') })
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1800); await tozala(s)
await s.click((await s.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)'); await s.waitForTimeout(700); await s.keyboard.press('ArrowRight'); await s.waitForTimeout(800)
n = await nota(s); tek('solo B1A: dastur bo‘sh — muammo chalinadi', bor(n, 262) >= 1)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

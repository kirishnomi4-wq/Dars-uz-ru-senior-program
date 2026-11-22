// 21-dars «Shaxsiy o‘yin 1» — tovush sinovi (22.11; 17–20-dars usulida): AudioContext soxtasi notalarni yozadi. Ustoz ekranida: 12-qadam — dushman tegdi (tuk, 110 Hz), jon 0 — «O‘yin tugadi»;
// jonli darsda bola noutbuki jim (karta tanlash, «Karta tayyor»); «Ovoz» o'chiq — jim; solo'da chalinadi (K1: to'liq bo'lmagan karta — muammo 262 Hz; karta tayyor — yulduz ohangi).
// Ishlatish (lokal server 5340 yoniq, demo-020 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/021-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-021.html', X = 'd21tov' + Date.now().toString(36)
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
const qur = (p, r, g) => p.evaluate(({ r, g }) => { const ek = document.querySelector(r + ' .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek); if (typeof kodPersonaj === 'function') kodPersonaj(ek) }, { r, g }).then(() => p.waitForTimeout(400))
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]]
const RJ = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]
const u = await oyna('ustoz', 1600, 900), o = await oyna('bola', 1440, 810)
await o.goto(U + '?rol=varaq'); await o.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`); await u.waitForTimeout(1500)
await u.evaluate(() => { try { localStorage.removeItem('jr-ovoz') } catch (e) {} })
// 11-qadam (P10): raketa jon qoidasi bilan, dushmanlar raketa ostiga (3-ustun) — tegdi (tuk), jon 0 — «O‘yin tugadi»
await u.selectOption('select[data-a=sakra]', '11'); await u.waitForTimeout(1500)
await qur(u, '#ust', { raketa: [...RPR, ...RJ], dushman: [[['f'], ['p', '3', [['C']]]], [['H'], ['y', '3,4'], ['p', '4', [['d']]], ['D']]] }); await tozala(u)
await u.click('#ust .hn .ishga'); await gacha(u, () => !!document.querySelector('#ust .oyin-tugadi'), null, 25000); await u.waitForTimeout(400)
const n = await nota(u)
tek('12 · dushman tegdi — tuk (110 Hz); jon 0 — «O‘yin tugadi»', bor(n, 110) >= 3 && !!(await u.$('#ust .oyin-tugadi')))
// bola: jonli dars — jim (7-qadam, K1: karta tanlaydi, «Karta tayyor»)
await u.selectOption('select[data-a=sakra]', '6'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'K1'); await o.waitForTimeout(1000)
await tozala(o)
for (const [g, v] of [['kim', 'oilam'], ['dush', 5], ['ball', 2], ['jon', 3]]) { await o.click('#bol .kc-o[data-g="' + g + '"][data-v="' + v + '"]'); await o.waitForTimeout(200) }
await o.click('#bol .hn .asos'); await o.waitForTimeout(900)
tek('7 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), karta tayyor — keyingi ekran', (await nota(o)).length === 0 && (await o.evaluate(() => document.querySelector('#ilova .ekran')?.dataset.id)) !== 'K1')
// «Ovoz» o'chiq
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '11'); await u.waitForTimeout(1500)
await qur(u, '#ust', { raketa: [...RPR, ...RJ], dushman: [[['f'], ['p', '3', [['C']]]], [['H'], ['y', '3,4'], ['p', '4', [['d']]], ['D']]] }); await tozala(u)
await u.click('#ust .hn .ishga'); await gacha(u, () => !!document.querySelector('#ust .oyin-tugadi'), null, 25000); await u.waitForTimeout(400)
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true })
// solo: chalinadi — to'liq bo'lmagan karta (muammo), keyin to'liq karta (yulduz ohangi)
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr021-solo', '6:0') })
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1800); await tozala(s)
await s.click('#ilova .hn .asos'); await s.waitForTimeout(700)
tek('solo K1: karta bo‘sh — muammo chalinadi (262 Hz)', bor(await nota(s), 262) >= 1)
for (const [g, v] of [['kim', 'oilam'], ['dush', 5], ['ball', 2], ['jon', 3]]) { await s.click('#ilova .kc-o[data-g="' + g + '"][data-v="' + v + '"]'); await s.waitForTimeout(200) }
await tozala(s); await s.click('#ilova .hn .asos'); await s.waitForTimeout(900)
const nn = await nota(s); tek('solo K1: karta tayyor — yulduz ohangi', [660, 880, 1100, 1320].every((f) => bor(nn, f) >= 1))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

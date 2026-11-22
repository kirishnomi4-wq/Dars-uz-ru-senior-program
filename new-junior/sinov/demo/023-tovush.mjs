// 23-dars «Demo Day №1» — tovush sinovi (22.11; 17–22-dars usulida): AudioContext soxtasi notalarni yozadi. Ustoz ekranida: 6-qadam — dushman raketaga tegdi (tuk, 110 Hz), jon 0 — «O‘yin tugadi»;
// jonli darsda bola noutbuki jim (yo'riqnoma kartasi, «Yo‘riqnoma tayyor»); «Ovoz» o'chiq — jim; solo'da chalinadi (yo'riqnoma kartasi tayyor — yulduz ohangi).
// Ishlatish (lokal server 5340 yoniq, demo-022 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/023-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-023.html', X = 'd23tov' + Date.now().toString(36)
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
const TEGISH = { raketa: [...RPR, ...RJ], dushman: [[['f'], ['p', '3', [['C']]]], [['H'], ['x', '3,4'], ['p', '4', [['d']]], ['D']]] }
const KARTA = JSON.stringify({ kim: 'oilam', dush: 5, ball: 2, jon: 3 })
const u = await oyna('ustoz', 1600, 900), o = await oyna('bola', 1440, 810)
await o.goto(U + '?rol=varaq'); await o.evaluate((k) => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr021-karta', k) }, KARTA)
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`); await u.waitForTimeout(1500)
await u.evaluate(() => { try { localStorage.removeItem('jr-ovoz') } catch (e) {} })
// 6-qadam (P8): raketa jon qoidasi bilan, dushmanlar raketa ostiga (3-ustun) — tegdi (tuk), jon 0 — «O‘yin tugadi»
await u.selectOption('select[data-a=sakra]', '5'); await u.waitForTimeout(1500)
await qur(u, '#ust', TEGISH); await tozala(u)
await u.click('#ust .hn .ishga'); await gacha(u, () => !!document.querySelector('#ust .oyin-tugadi'), null, 25000); await u.waitForTimeout(400)
const n = await nota(u)
tek('6 · dushman tegdi — tuk (110 Hz); jon 0 — «O‘yin tugadi»', bor(n, 110) >= 3 && !!(await u.$('#ust .oyin-tugadi')))
// bola: jonli dars — jim (10-qadam, Y1: yo'riqnoma kartasi, «Yo‘riqnoma tayyor»)
await u.selectOption('select[data-a=sakra]', '9'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'Y1'); await o.waitForTimeout(1000)
await tozala(o); await o.click('#bol .hn .asos'); await o.waitForTimeout(900)
tek('10 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), «Yo‘riqnoma tayyor» — keyingi ekran', (await nota(o)).length === 0 && (await o.evaluate(() => document.querySelector('#ilova .ekran')?.dataset.id)) !== 'Y1')
// «Ovoz» o'chiq
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '5'); await u.waitForTimeout(1500)
await qur(u, '#ust', TEGISH); await tozala(u)
await u.click('#ust .hn .ishga'); await gacha(u, () => !!document.querySelector('#ust .oyin-tugadi'), null, 25000); await u.waitForTimeout(400)
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true })
// solo: chalinadi — yo'riqnoma kartasi tayyor (yulduz ohangi)
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate((k) => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr023-solo', '9:0'); localStorage.setItem('demo-jr021-karta', k) }, KARTA)
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1800); await tozala(s)
await s.click('#ilova .hn .asos'); await s.waitForTimeout(900)
const nn = await nota(s); tek('solo Y1: yo‘riqnoma kartasi tayyor — yulduz ohangi', [660, 880, 1100, 1320].every((f) => bor(nn, f) >= 1))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

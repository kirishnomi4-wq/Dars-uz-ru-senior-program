// 18-dars «Kosmik o‘yin 2» — tovush sinovi (22.11; 17-dars usulida): AudioContext soxtasi notalarni yozadi. Ustoz ekranida: 7-qadam — dushman dasturi
// bo'sh (muammo, 262 Hz); 14-qadam — dushman raketaga tegdi (tuk, 110 Hz) va jon 0 — «O‘yin tugadi»; jonli darsda bola noutbuki jim; «Ovoz» o'chiq — jim;
// solo'da chalinadi (B1A — Bo'shvoy; pog'ona yutildi — yulduz ohangi).
// Ishlatish (lokal server 5340 yoniq, demo-018 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/018-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-018.html', X = 'd18tov' + Date.now().toString(36)
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
const qur = (p, r, g) => p.evaluate(({ r, g }) => { const ek = document.querySelector(r + ' .ekran'), s = ek.__per; for (const id of Object.keys(g)) { klonQur(ek, g[id]); s.json[id] = perSave(ek) } perLoad(ek, s.json[s.cur]); perKartalar(ek); if (typeof kosmikOzg === 'function') kosmikOzg(ek) }, { r, g }).then(() => p.waitForTimeout(400))
const RPR = [[['k', 'right'], ['r']], [['k', 'left'], ['l']]]
const DK = [['H'], ['y', 'r0-6,4'], ['p', '4', [['d']]], ['D']]
const RJ = [[['f'], ['z', 'ball:0'], ['z', 'jon:3']], [['q', 'enemy'], ['c', 'jon:-1'], ['i', 'jon:0', [['g']]]]]
const u = await oyna('ustoz', 1600, 900), o = await oyna('bola', 1440, 810)
await o.goto(U + '?rol=varaq'); await o.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`); await u.waitForTimeout(1500)
await u.evaluate(() => { try { localStorage.removeItem('jr-ovoz') } catch (e) {} })
// 7-qadam (P7): dushman dasturi bo'sh — muammo
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1500); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(3500); let n = await nota(u)
tek('7 · dushman dasturi bo‘sh — muammo (262 Hz)', bor(n, 262) >= 1)
if (await u.$('#ust .ekran[data-oyin]')) { await u.click('#ust .hn .ishga'); await u.waitForTimeout(300) }
// 14-qadam (P10): raketa jon qoidasi bilan, bitta dushman 3-ustunga (raketa ostida) — tegdi (tuk), jon 3 → … ; uchta dushman — jon 0, «O‘yin tugadi»
await u.selectOption('select[data-a=sakra]', '13'); await u.waitForTimeout(1500)
await qur(u, '#ust', { raketa: [...RPR, ...RJ], dushman: [[['f'], ['p', '3', [['C']]]], [['H'], ['y', '3,4'], ['p', '4', [['d']]], ['D']]] }); await tozala(u)
await u.click('#ust .hn .ishga'); await gacha(u, () => !!document.querySelector('#ust .oyin-tugadi'), null, 20000); await u.waitForTimeout(400); n = await nota(u)
tek('14 · dushman tegdi — tuk (110 Hz); jon 0 — «O‘yin tugadi»', bor(n, 110) >= 3 && !!(await u.$('#ust .oyin-tugadi')))
// bola: jonli dars — jim (8-qadam, B1A: ▶ yo'q — Bo'shvoy)
await u.selectOption('select[data-a=sakra]', '7'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'B1A'); await o.waitForTimeout(800)
await tozala(o); await o.click('#bol .hn .ishga, #bol .hn .asos'); await gacha(o, () => !!document.querySelector('#bol .dv-muam'), null, 12000); await o.waitForTimeout(300)
tek('8 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), muammocha chiqdi', (await nota(o)).length === 0 && !!(await o.$('#bol .dv-muam')))
// «Ovoz» o'chiq
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1500); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(3500)
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true })
// solo: chalinadi — muammo, keyin pog'ona yutildi (yulduz)
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr018-solo', '7:0') })
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1800); await tozala(s)
const tg = async () => s.click((await s.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)')
await tg(); await gacha(s, () => !!document.querySelector('#ilova .dv-muam'), null, 12000); await s.waitForTimeout(400)
n = await nota(s); tek('solo B1A: ▶ yo‘q — muammo chalinadi', bor(n, 262) >= 1)
await qur(s, '#ilova', { dushman: [[['f'], ['C']], [['H'], ['y', '0,4'], ['p', '4', [['d']]], ['D']]] }); await tozala(s)
await tg(); await gacha(s, () => /Siz yutdingiz/.test(document.querySelector('#ilova .hn .hint')?.textContent), null, 15000); await s.waitForTimeout(500)
n = await nota(s); tek('solo B1A: pog‘ona yutildi — yulduz ohangi', [660, 880, 1100, 1320].every((f) => bor(n, f) >= 1))
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

// 11-dars «O‘zgaruvchi: ball» — tovush sinovi (21.11; 9–10-dars usulida): AudioContext soxtasi notalarni yozadi. Ustoz ekranida: o'yinda har yurish —
// qadam (330 Hz); olma terilib ball o'zgarganda — «bos» (520 Hz); yutganda — yulduz ohangi; muammochada — 262 Hz; 3-bekatda har o'zgaruvchi bloki — «bos»;
// jonli darsda bola noutbuki jim; solo'da chalinadi; «Ovoz» o'chiq — jim.
// Ishlatish (lokal server 5340 yoniq, demo-011 yig'ilgan):  nice -n 19 taskset -c 0-3 node new-junior/sinov/demo/011-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-011.html', X = 'd11tov-' + Date.now()
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
const dastur = (p, x) => p.evaluate((x) => { const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear(); for (const [t, m] of x) blQosh(ek, t, m); sanoq(ek) }, x).then(() => p.waitForTimeout(250))
const O1 = [['q', 'apple'], ['c', '1']]
const u = await oyna('ustoz', 1600, 900), o = await oyna('bola', 1440, 810)
await o.goto(U + '?rol=varaq'); await o.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq') })
await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`); await u.waitForTimeout(1500)
await u.evaluate(() => { try { localStorage.removeItem('jr-ovoz') } catch (e) {} })
// P6 (7-qadam): o'yin
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1500); await dastur(u, O1)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tinch(u); await tozala(u)
await bos(u, '→'); let n = await nota(u); tek('7 · → — bir qadam (330 Hz), ball o‘zgarmadi', bor(n, 330) === 1 && bor(n, 520) === 0)
await tozala(u); await bos(u, '→'); n = await nota(u); tek('7 · olma terildi — qadam va «bos» (520 Hz, ball +1)', bor(n, 330) === 1 && bor(n, 520) === 1)
await tozala(u); await bos(u, '→↑↑→→↓↓'); await u.waitForTimeout(300); n = await nota(u); tek('7 · yutdi — yulduz ohangi', [660, 880, 1100, 1320].every((f) => bor(n, f) >= 1))
// muammocha: dasturchasiz — 262 Hz
await dastur(u, []); await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tinch(u); await tozala(u); await bos(u, '→→'); n = await nota(u)
tek('7 · olma terildi, dasturcha yo‘q — muammo ohangi (262 Hz)', bor(n, 262) === 1)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(200)
// P8 (14-qadam): oldindan aytish — har o'zgaruvchi bloki «bos»
await u.selectOption('select[data-a=sakra]', '13'); await u.waitForTimeout(1500); await u.click('#ust .bsh-q .sk[data-v="5"]'); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tinch(u); await u.waitForTimeout(300); n = await nota(u)
tek('14 · «▶ Tekshirish» — to‘rt blok, to‘rt «bos» (520 Hz), keyin yulduz ohangi', bor(n, 520) >= 4 && [660, 880, 1100, 1320].every((f) => bor(n, f) >= 1))
// bola: jonli dars — jim
await u.selectOption('select[data-a=sakra]', '7'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'B1A'); await o.waitForTimeout(800)
await dastur(o, O1); await o.click('#bol .hn .asos'); await o.waitForTimeout(400); await tinch(o); await tozala(o); await bos(o, '↑↑')
tek('8 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), ball 1', (await nota(o)).length === 0 && (await o.$eval('#bol .ball-k b', (e) => e.textContent)) === '1')
// «Ovoz» o'chiq
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1500); await dastur(u, O1); await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tinch(u); await tozala(u); await bos(u, '→→')
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true })
// solo: chalinadi
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr011-solo', '7:0') })
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1800); await dastur(s, O1); await s.click((await s.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)'); await s.waitForTimeout(400); await tinch(s); await tozala(s)
await bos(s, '↑'); n = await nota(s); tek('solo B1A: yurish — bola noutbukida chalinadi (330 Hz)', bor(n, 330) === 1)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

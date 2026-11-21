// 3-dars «X va Y» — tovush sinovi (20.11; 2-dars sinovi usulida): AudioContext soxtasi notalarni chastotasi bilan yozadi. Ustoz ekranida: huk A —
// uchta katak yonadi (har biri qadam 330 Hz), C — 6 qadam va yulduz (660…1320 Hz); go to — sakrash (392 + 523 Hz); maydon chetida «tuk» (150, 110 Hz);
// jonli darsda bola noutbuki jim (katak bossa ham); solo'da bola noutbukida chalinadi; «Ovoz» o'chirilsa ustoz ham jim.
// Ishlatish (lokal server 5340 yoniq, demo-003 yig'ilgan): node new-junior/sinov/demo/003-tovush.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-003.html', X = 'd3tov-' + Date.now()
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
const katak = async (p, r, x, y) => { const c = await p.evaluate(({ r, x, y }) => { const k = document.querySelector(r + ' .katak.maydon'), n = k.dataset.xarita.split('|').length, e = k.querySelector('.kt-c[data-k="' + x + ',' + (n - 1 - y) + '"]').getBoundingClientRect(); return [e.left + e.width / 2, e.top + e.height / 2] }, { r, x, y }); await p.mouse.click(c[0], c[1]); await p.waitForTimeout(300) }
const BL = { x: 'go to', l: 'move left' }
const qosh2 = async (p, r, d) => { for (const t of d) { await p.locator(r + ' .pl .mbw:not(.yopiq) .mb', { hasText: BL[t] }).first().click(); await p.waitForTimeout(90) } }
// huk: A — uchta katak yonadi, «tuk» yo'q
await u.selectOption('select[data-a=sakra]', '2'); await tozala(u); await u.waitForTimeout(700)
await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 1 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 20000); await u.waitForTimeout(200)
let n = await nota(u)
tek('3 · huk A: uchta katak — 3 qisqa ovoz (330 Hz), «tuk» yo‘q — ' + n.length + ' nota', bor(n, 330) === 3 && !bor(n, 150))
await u.click('#ust .hn .asos'); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 2 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 20000); await tozala(u)
await u.click('#ust .hn .asos'); await gacha(u, () => document.querySelectorAll('#ust .jk .jn').length >= 3 && !document.querySelector('#ust .ekran').dataset.yuryapti, null, 20000); await u.waitForTimeout(300)
n = await nota(u); tek('3 · huk C: 6 qadam va yulduz ohangi (660…1320 Hz)', bor(n, 330) === 6 && [660, 880, 1100, 1320].every((f) => bor(n, f) >= 1) && !bor(n, 150))
// go to — bitta sakrash ovozi (P7, 10-qadam)
await u.selectOption('select[data-a=sakra]', '9'); await u.waitForTimeout(1000); await qosh2(u, '#ust', 'x'); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tugadi(u, '#ust'); await u.waitForTimeout(200)
n = await nota(u); tek('10 · go to — sakrash (392 + 523 Hz), qadam ovozi yo‘q', bor(n, 392) === 1 && bor(n, 523) >= 1 && !bor(n, 150))
// maydon cheti — «tuk» (P11, 16-qadam: move left (0, 0) dan)
await u.selectOption('select[data-a=sakra]', '15'); await u.waitForTimeout(1000); await qosh2(u, '#ust', 'l'); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tugadi(u, '#ust'); await u.waitForTimeout(200)
n = await nota(u); tek('16 · maydon chetida «tuk» (150 + 110 Hz) va muammocha ohangi', bor(n, 150) === 1 && bor(n, 110) === 1 && bor(n, 262) === 1)
// bola: jonli dars — jim (katakni bosganda ham)
await u.selectOption('select[data-a=sakra]', '7'); await gacha(o, () => document.querySelector('#ilova .ekran')?.dataset.id === 'B1A'); await o.waitForTimeout(500); await tozala(o)
await katak(o, '#bol', 3, 0); await o.waitForTimeout(500)
tek('8 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), lekin katak topildi', (await nota(o)).length === 0 && /Topdingiz/.test(await o.$eval('#bol .hn .hint', (e) => e.textContent)))
// «Ovoz» o'chiq — ustoz ham jim
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
await u.selectOption('select[data-a=sakra]', '9'); await u.waitForTimeout(1000); await qosh2(u, '#ust', 'x'); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(300); await tugadi(u, '#ust')
tek('ovoz o‘chiq — ustoz ham jim (' + (await nota(u)).length + ' nota)', (await nota(u)).length === 0)
await u.click('.ustoz-tasma [data-a=ovoz]', { force: true }); await u.waitForTimeout(200)
// solo: bola noutbukida chalinadi
const s = await oyna('solo', 1440, 810)
await s.goto(U + '?rol=varaq'); await s.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'momiq'); localStorage.setItem('demo-jr003-solo', '7:0') })
await s.goto(U + '?rol=solo'); await s.waitForTimeout(1200); await tozala(s)
await katak(s, '#bol', 0, 3); await s.waitForTimeout(500)
n = await nota(s); tek('solo B1A: bola noutbukida chalinadi — sakrash va muammocha (' + n.length + ' nota)', bor(n, 392) === 1 && bor(n, 262) === 1)
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()
process.exit(ok === jami ? 0 : 1)

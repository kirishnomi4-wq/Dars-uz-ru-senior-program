// Solo sinovi (18.11, qaror 4A/5A): bola darsni ustozsiz o'zi o'tadi — boshidan «Dars tugadi»gacha.
// Tekshiradi: ekranlar tartibi · sinf sonlari yo'q · «ustoz»li gaplar bolaga moslangan · tovush (bola noutbukida) · yangilansa — o'sha joydan.
// Ishlatish (lokal server 5340 yoniq): node new-junior/sinov/demo/solo.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = process.env.SOLO_URL || 'http://localhost:5340/demo.html?rol=solo'
const KUTILGAN = ['B0', 'P1', 'P2N', 'BY', 'P2B', 'P2K', 'P2C', 'P3', 'P4', 'BQ', 'B1', 'B2', 'B4', 'P6', 'B3X', 'B3Y', 'B2P', 'B2Q', 'B2Y', 'P9', 'P4B', 'P7A', 'P7', 'B6', 'B7', 'P11', 'B8A', 'B8', 'B9', 'P8', 'B5']
const SOXTA = () => { window.__nota = 0; class S { constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {} } resume() {} createOscillator() { window.__nota++; return { frequency: {}, connect: (g) => g, start() {}, stop() {} } } createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect: (d) => d } } } window.AudioContext = S }
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
await p.addInitScript(SOXTA); p.on('pageerror', (e) => xato.push(e.message))
let ok = 0, jami = 0
const tek = (nom, shart) => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom) }
const kut = (ms) => p.waitForTimeout(ms)
const id = () => p.evaluate(() => { const e = document.querySelector('#ilova .ekran'); return e ? e.dataset.id : '' })
const matn = (s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const bos = (s) => p.click(s)
await p.goto(U); await p.evaluate(() => localStorage.clear()); await p.reload()
if (await p.$('#ei')) { await p.fill('#ei', 'Lola'); await p.click('#ef button') }
await kut(1200)
const yol = [], sonlar = [], ustozGap = []
for (let qadam = 0; qadam < 45; qadam++) {
  const x = await id(); if (!x) break
  if (yol[yol.length - 1] !== x) yol.push(x)
  const hint = await matn('#ilova .hn .hint'); if (/^(Kirdi|Javob berdi|Tanladi|Ism berdi|Sahnasi tayyor|Yordam so|«YUR!» dedi)/.test(hint)) sonlar.push(x + ': ' + hint) // sinf yozuvlari («Ikkala rangni bosing · 1 / 2» — bolaning o'z hisobi, sanalmaydi)
  const t = await matn('#ilova .ekran'); if (/Ustoz (3 marta|keyingisini)|sinfga qo‘shiladi|bolalarda topshiriq/i.test(t)) ustozGap.push(x)
  if (x === 'B5') break
  if (x === 'B0' || x === 'B6') { await bos('#bol .hn .asos'); await kut(700); continue }
  if (x === 'P2N') { await bos('#bol .jk >> nth=2'); await kut(1100); continue }
  if (x === 'BY') { await bos('#bol .yur-b'); await kut(500); tek('BY: solo javobi — «Coddy qimirlamadi»', (await matn('#bol .hn .hint')).includes('qimirlamadi')); await kut(2300); continue }
  if (x === 'P2K') { tek('P2K: «Ustoz 3 marta bosadi» yo‘q — «Blokni bosing · 0 / 3»', !(await matn('#ust .ekran')).includes('Ustoz 3 marta') && (await matn('#ust .ekran')).includes('Blokni bosing')); for (let i = 0; i < 3; i++) { await bos('#ust .sin3'); await kut(350) } }
  if (x === 'BQ') { await bos('#bol .tq-o >> nth=1'); await kut(1200); continue }
  if (x === 'B1') { await bos('#bol .rg .rd.f-h'); await kut(200); await bos('#bol .rg .rd.f-g'); await kut(300) }
  if (x === 'B2') { for (let i = 0; i < 3; i++) { await bos('#bol .pl .mbw:not(.yopiq) .mb >> nth=0'); await kut(120) } await p.evaluate(() => { window.__nota = 0 }); await bos('#bol .hn .ishga'); await kut(5200); tek('B2: dastur → «Yetib bordi» → B4 (o‘zi)', (await id()) === 'B4'); tek('solo’da bola noutbukida tovush chiqdi (' + (await p.evaluate(() => window.__nota)) + ' nota)', (await p.evaluate(() => window.__nota)) >= 3); continue }
  if (x === 'B4') tek('B4: «Ustoz keyingisini ko‘rsatadi» yo‘q', !(await matn('#bol .hn .hint')).includes('Ustoz'))
  if (x === 'P6') { await bos('#ust .hn .ishga'); await kut(5600); tek('P6: ishga tushirgach B3X o‘zi ochildi', (await id()) === 'B3X'); continue }
  if (x === 'B3X') { await bos('#bol .dst .mb >> nth=3'); await kut(200); await bos('#bol .bl-x'); await kut(200); await bos('#bol .hn .ishga'); await kut(4500); tek('B3X: ortiqcha blok olib tashlandi → B3Y', (await id()) === 'B3Y'); continue }
  if (x === 'B8A') { await bos('#bol .jy >> nth=1'); await kut(900); continue }
  // qolganlari — «Keyingi ›» (ustoz ekranida .asos, bola ekranida .k-solo)
  const k = (await p.$('#bol .k-solo')) ? '#bol .k-solo' : '#ust .hn .asos'
  if (!(await p.$(k))) { console.log('  «Keyingi» topilmadi: ' + x); break }
  await bos(k); await kut(700)
}
tek('ekranlar tartibi to‘g‘ri (' + yol.length + ' ekran): ' + yol.join(' '), yol.join(' ') === KUTILGAN.join(' '))
tek('sinf sonlari ko‘rinmadi' + (sonlar.length ? ' — ' + sonlar.join(' | ') : ''), sonlar.length === 0)
tek('«ustoz»li gaplar bolaga moslangan' + (ustozGap.length ? ' — ' + ustozGap.join(' ') : ''), ustozGap.length === 0)
tek('oxiri: B5 «Dars tugadi»', (await id()) === 'B5')
// yangilansa — o'sha joydan
await p.reload(); await kut(1500)
tek('sahifa yangilandi → yana B5 (qolgan joyidan)', (await id()) === 'B5')
await p.click('#ilova .ekran', { position: { x: 5, y: 5 } }).catch(() => {})
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()

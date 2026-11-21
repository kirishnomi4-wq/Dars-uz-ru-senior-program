// 1-darsni (1–15-sahna) yonma-yon rejimda boshidan oxirigacha bosib o'tadi, topshiriqlarni bajaradi. 1–7-sahna tez o'tiladi, 8–15-sahna suratga olinadi.
// 7-versiya oqimi: huk (savol → ovoz → baqirish → sudrash → javob), birinchi dastur yulduzgacha, pog'onada «Keyingi pog'ona», 11-sahnada ustoz namunasi, yakunda sinf natijasi.
import { chromium } from 'playwright-core'
const [url, out] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const p = await b.newPage({ viewport: { width: 1500, height: 800 } })
const errs = []
p.on('pageerror', (e) => errs.push('XATO ' + String(e).slice(0, 260)))
p.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('404')) errs.push('KONSOL ' + m.text().slice(0, 220)) })
p.on('crash', () => errs.push('SAHIFA QULADI'))
await p.goto(url, { waitUntil: 'load' }); await p.waitForSelector('.d1-juft', { timeout: 30000 }); await p.waitForTimeout(900)
const S = '.d1-juft section:nth-child(1) .d1-ekran', P = '.d1-juft section:nth-child(2) .d1-ekran'
let n = 0
const holat = async () => (await p.locator('.d1-ss-bosh b').innerText()).slice(0, 34) + ' | ' + (await p.locator('.d1-ustoz-matn').innerText()).replace(/\n/g, ' ').slice(0, 60)
const shot = async (nom) => { n++; await p.locator('.d1-juft').screenshot({ path: `${out}-${String(n).padStart(2, '0')}-${nom}.png` }); console.log(String(n).padStart(2), nom.padEnd(15), '|', await holat()) }
const bos = (sel) => p.locator(sel).first().click({ force: true, timeout: 7000 })
const k = async (m = 1) => { for (let i = 0; i < m; i++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(380) } }
const kut = (ms) => p.waitForTimeout(ms)
const blok = (qayerda, i) => bos(`${qayerda} .d1-bloklar .d1-blok:nth-child(${i})`)
const ishga = (qayerda) => bos(`${qayerda} .d1-dastur .d1-ishga`)
const keyingi = (qayerda) => bos(`${qayerda} .d1-ong-qator .d1-ishga`)
const yoz = async (qayerda, matn) => { await bos(`${qayerda} .d1-de-matn`); await kut(150); await p.locator(`${qayerda} .d1-de-kirit`).fill(matn); await p.keyboard.press('Enter'); await kut(250) }
try {
  // 1–7-sahna: tez
  await bos(`${P} .d1-ishga`); await k(1); await bos(`${P} .d1-jkarta:nth-child(2)`); await k(2)
  for (let i = 0; i < 3; i++) { await bos(`${P} .d1-yur`); await kut(150) }
  await k(1); const q = await p.locator(`${S} .d1-sudra`).boundingBox()
  await p.mouse.move(q.x + q.width / 2, q.y + q.height / 2); await p.mouse.down(); await p.mouse.move(q.x + q.width / 2 + 120, q.y + q.height / 2, { steps: 6 }); await p.mouse.up(); await kut(600)
  await k(4); await kut(700); await bos(`${P} .d1-tonka-tugma:nth-of-type(3)`); await kut(500)
  await k(1); await blok(S, 1); await ishga(S); await kut(1500)
  await k(1); for (let i = 0; i < 3; i++) await blok(P, 1); await ishga(P); await kut(3200)
  await k(5); await kut(300)                                   // 5-sahna oxirigacha
  await k(1)                                                   // 6-sahna: tayyor dasturni tuzatadi, keyingi pog'ona
  await bos(`${P} .d1-dastur-ichi .d1-blok`); await bos(`${P} .d1-dastur-ichi .d1-blok`); await ishga(P); await kut(3900); await keyingi(P); await kut(500)
  await k(2); await kut(400)                                   // 7-sahna (2 qadam)
  await k(1); await kut(900); await shot('8-oyin')
  await k(1); await kut(1300); await shot('9-xarita')
  await k(1); await blok(S, 2); await ishga(S); await kut(1000); await shot('9a-de')
  await kut(1200); await k(1); await kut(700); await shot('9b-savol'); await bos(`${P} .d1-jkarta:nth-child(1)`); await kut(6500)
  await k(1); await kut(1700); await shot('9c-minora')
  await k(1); await ishga(S); await kut(900); await shot('9d-aytdi'); await kut(1400)
  await k(1); await kut(700); await shot('9e-xulosa')
  await k(1); await kut(900); await shot('10-ism'); await bos(`${P} .d1-ism-tas`); await bos(`${P} .d1-ranglar button:nth-child(6)`); await kut(400); await shot('10-ism-tanladi')
  await bos(`${P} .d1-tasma .d1-ishga`); await kut(9000); await shot('10-surat')
  await k(1); await kut(600); await yoz(S, 'Men Coddyman!'); await ishga(S); await kut(2200); await shot('11a-namuna')
  await k(1); await kut(600); await blok(P, 3); await yoz(P, 'Men Zippiman'); await ishga(P); await kut(900); await shot('11-ism-aytdi'); await kut(1200)
  await keyingi(P); await kut(500); for (let i = 0; i < 3; i++) await blok(P, 1); await blok(P, 3); await ishga(P); await kut(4700); await shot('11-yulduz')
  await k(1); await kut(700); await shot('11-juft')
  await k(1); await kut(1300); await shot('12-xarita')
  await k(1); await kut(700); await shot('12-joy'); await bos(`${S} .d1-joy-qator button:nth-child(2)`); await kut(500)
  await blok(S, 1); await blok(S, 3); await blok(S, 4); await ishga(S); await kut(3300); await shot('12-kosmos')
  await k(1); await kut(700); await shot('13-joy'); await bos(`${P} .d1-joy-qator button:nth-child(3)`); await kut(600)
  await blok(P, 1); await blok(P, 3); await blok(P, 4); await blok(P, 1); await kut(300); await shot('13-shart-salom'); await yoz(P, 'Men suvdaman!'); await ishga(P); await kut(5600); await shot('13-tayyor')
  await k(1); await kut(3600); await shot('14-galereya')
  await k(1); await kut(1300); await shot('15-xarita')
  await k(1); await kut(2200); await shot('15a-sinf-bugun')
  await k(1); await kut(1500); await shot('15b-labirint')
} catch (e) { console.log('TO`XTADI:', String(e).split('\n')[0].slice(0, 130)); await p.screenshot({ path: `${out}-toxtadi.png` }).catch(() => {}); console.log('   holat:', await holat().catch(() => '?')) }
console.log(errs.length ? [...new Set(errs)].slice(0, 6).join('\n') : 'xato topilmadi')
await b.close()

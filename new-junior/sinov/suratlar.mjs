// 1-darsning HAR sahna va HAR qadamini yonma-yon rejimda suratga oladi (proyektor + bola noutbuki bitta suratda).
// Ko'z bilan ko'rik uchun: har surat ochib ko'riladi. Buyruq: node new-junior/sinov/suratlar.mjs "http://localhost:5340/?rol=yonma#/dars/1" <papka>
// 7-versiya oqimi: huk (savol → ovoz → baqirish → sudrash → javob), birinchi dastur yulduzgacha, pog'onalarda «Keyingi pog'ona», sinf doskasi, yakunda sinf natijasi.
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
const [url, out] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const p = await b.newPage({ viewport: { width: 1800, height: 900 } })
const errs = []
p.on('pageerror', (e) => errs.push('XATO ' + String(e).slice(0, 260)))
p.on('crash', () => console.log('   SAHIFA QULADI (crash)'))
p.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('404')) errs.push('KONSOL ' + m.text().slice(0, 220)) })
await p.goto(url, { waitUntil: 'load' }); await p.waitForSelector('.d1-juft', { timeout: 30000 }); await p.waitForTimeout(1200)
const S = '.d1-juft section:nth-child(1) .d1-ekran', P = '.d1-juft section:nth-child(2) .d1-ekran'
let n = 0
const shot = async (nom) => { n++; await p.locator('.d1-juft').screenshot({ path: `${out}/${String(n).padStart(2, '0')}-${nom}.png` }); console.log(String(n).padStart(2), nom) }
const bos = (sel) => p.locator(sel).first().click({ force: true, timeout: 7000 })
const k = async (m = 1) => { for (let i = 0; i < m; i++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(380) } }
const kut = (ms) => p.waitForTimeout(ms)
const blok = (qayerda, i) => bos(`${qayerda} .d1-bloklar .d1-blok:nth-child(${i})`)
const ishga = (qayerda) => bos(`${qayerda} .d1-dastur .d1-ishga`)
const keyingi = (qayerda) => bos(`${qayerda} .d1-ong-qator .d1-ishga`)
const necha = async (qayerda, i, marta) => { for (let j = 0; j < marta; j++) { await blok(qayerda, i); await kut(60) } }
const yoz = async (qayerda, matn, nth = 0) => { await p.locator(`${qayerda} .d1-de-matn`).nth(nth).click({ force: true }); await kut(150); await p.locator(`${qayerda} .d1-de-kirit`).fill(matn); await p.keyboard.press('Enter'); await kut(250) }
const qadam = async (nom, f) => { try { await f() } catch (e) { console.log('   TO`XTADI', nom, String(e).split('\n')[0].slice(0, 120)); await shot(nom + '-TOXTADI').catch(() => {}) } }

await qadam('1', async () => { await shot('1-kirish'); await bos(`${P} .d1-ishga`); await kut(2500); await shot('1-kirdi') })
await qadam('2', async () => {
  await k(); await kut(1000); await shot('2a-savol'); await bos(`${P} .d1-jkarta:nth-child(2)`); await kut(8500); await shot('2a-javob-berdi')
  await k(); await kut(2000); await shot('2b-ovozlar')
  await k(); await kut(500); for (let i = 0; i < 6; i++) { await bos(`${P} .d1-yur`); await kut(200) } await shot('2c-baqirish')
  await kut(8000); await shot('2c-tola')
  await k(); await kut(900); await shot('2d-sudra')
  const q = await p.locator(`${S} .d1-sudra`).boundingBox()
  await p.mouse.move(q.x + q.width / 2, q.y + q.height / 2); await p.mouse.down(); await p.mouse.move(q.x + q.width / 2 + 260, q.y + q.height / 2 - 60, { steps: 10 }); await kut(150); await shot('2d-tortilmoqda')
  await p.mouse.up(); await kut(1100); await shot('2d-qimirlamadi')
  await k(); await kut(1000); await shot('2e-javob-1'); await kut(2600); await shot('2e-javob-2')
})
await qadam('3', async () => {
  await k(); await kut(3600); await shot('3a-reja')
  await k(); await kut(3300); await shot('3b-natija'); await kut(2700); await shot('3b-natija-2')
  await k(); await kut(900); await shot('3c-tanlov'); await p.locator(`${P} .d1-tonka-tugma`).nth(1).hover({ force: true }); await kut(500); await shot('3c-ustida')
  await bos(`${P} .d1-tonka-tugma:nth-of-type(3)`); await kut(9500); await shot('3c-sinf-toldi')
})
await qadam('4', async () => {
  await k(); await kut(900); await shot('4a-bloklar'); await blok(S, 1); await kut(600); await shot('4a-dastur'); await ishga(S); await kut(1700); await shot('4a-yurdi')
  await k(); await kut(900); await shot('4b-navbat'); await necha(P, 1, 2); await ishga(P); await kut(2700); await shot('4b-kam')
  await blok(P, 1); await ishga(P); await kut(3300); await shot('4b-yetdi'); await kut(7000); await shot('4b-doska')
})
await qadam('5', async () => {
  await k(); await kut(900); await shot('5a-savol'); await bos(`${P} .d1-jkarta:nth-child(3)`); await kut(7500); await shot('5a-javob-berdi')
  await k(); await kut(2200); await shot('5b-minora')
  await k(); await kut(400); await ishga(S); await kut(4300); await shot('5c-otib-ketdi')
  await k(); await kut(1200); await shot('5d-kormaydi')
  await k(); await kut(500); await bos(`${S} .d1-dastur-ichi .d1-blok`); await kut(300); await ishga(S); await kut(3600); await shot('5e-tuzatildi')
})
await qadam('6', async () => {
  await k(); await kut(900); await shot('6-pog1'); await ishga(P); await kut(5600); await shot('6-pog1-ortiq')
  await bos(`${P} .d1-muammo-tugma button`); await kut(200); await bos(`${P} .d1-muammo-tugma button`); await kut(300); await shot('6-pog1-maslahat')
  await bos(`${P} .d1-dastur-ichi .d1-blok`); await kut(150); await bos(`${P} .d1-dastur-ichi .d1-blok`); await kut(150); await ishga(P); await kut(3800); await shot('6-pog1-yetdi')
  await keyingi(P); await kut(700); await shot('6-pog2'); await necha(P, 2, 2); await ishga(P); await kut(2500); await shot('6-pog2-yetdi')
  await keyingi(P); await kut(700); await shot('6-pog3'); await necha(P, 1, 4); await blok(P, 2); await ishga(P); await kut(4400); await shot('6-pog3-yetdi')
  await keyingi(P); await kut(700); await necha(P, 1, 6); await necha(P, 2, 3); await kut(300); await shot('6-yulduzcha-9blok'); await ishga(P); await kut(7400); await shot('6-yulduzcha-yetdi')
  await keyingi(P); await kut(900); await shot('6-erkin')
})
await qadam('7', async () => { await k(); await kut(2100); await shot('7a-blok'); await k(); await kut(2600); await shot('7b-dastur') })
await qadam('8', async () => { await k(); await kut(1000); await shot('8-oyin') })
await qadam('9', async () => {
  await k(); await kut(1400); await shot('9-xarita')
  await k(); await kut(700); await shot('9a-yangi-blok'); await blok(S, 2); await ishga(S); await kut(1000); await shot('9a-salom'); await kut(1400)
  await k(); await kut(800); await shot('9b-savol'); await bos(`${P} .d1-jkarta:nth-child(1)`); await kut(6800)
  await k(); await kut(1900); await shot('9c-minora')
  await k(); await kut(300); await ishga(S); await kut(900); await shot('9d-aytdi'); await kut(1600); await shot('9d-izoh')
  await k(); await kut(800); await shot('9e-xulosa')
})
await qadam('10', async () => {
  await k(); await kut(1000); await shot('10-ism'); await bos(`${P} .d1-ism-tas`); await bos(`${P} .d1-ranglar button:nth-child(6)`); await kut(400); await shot('10-tanladi')
  await bos(`${P} .d1-tasma .d1-ishga`); await kut(10500); await shot('10-sinf-rangli')
})
await qadam('11', async () => {
  await k(); await kut(900); await shot('11a-ustoz'); await yoz(S, 'Men Coddyman!'); await ishga(S); await kut(1000); await shot('11a-aytdi'); await kut(1200)
  await k(); await kut(900); await shot('11-pog1'); await blok(P, 3); await kut(300); await p.locator(`${P} .d1-de-matn`).click({ force: true }); await kut(300); await shot('11-yozmoqda')
  await p.locator(`${P} .d1-de-kirit`).fill('Men Zippiman'); await p.keyboard.press('Enter'); await kut(300); await ishga(P); await kut(1000); await shot('11-ism-aytdi'); await kut(1600); await shot('11-pog1-yetdi')
  await keyingi(P); await kut(600); await necha(P, 1, 3); await blok(P, 3); await ishga(P); await kut(4800); await shot('11-pog2-yetdi')
  await keyingi(P); await kut(600); await blok(P, 3); await blok(P, 3); await ishga(P); await kut(4200); await shot('11-pog3-birxil')
  await kut(9000); await shot('11-doska')
  await k(); await kut(800); await shot('11-juft')
})
await qadam('12', async () => {
  await k(); await kut(1400); await shot('12-xarita')
  await k(); await kut(900); await shot('12-joy'); await bos(`${S} .d1-joy-qator button:nth-child(2)`); await kut(700); await shot('12-kosmos-bosh')
  await blok(S, 1); await blok(S, 3); await blok(S, 4); await ishga(S); await kut(1500); await shot('12-gapiryapti'); await kut(1500); await shot('12-sakrayapti')
})
await qadam('13', async () => {
  await k(); await kut(900); await shot('13-joy'); await bos(`${P} .d1-joy-qator button:nth-child(3)`); await kut(800); await shot('13-bosh')
  await blok(P, 1); await blok(P, 2); await blok(P, 3); await blok(P, 3); await blok(P, 4); await blok(P, 1); await blok(P, 4); await kut(300); await shot('13-7blok-salom')
  await yoz(P, 'Men suv ostidaman!'); await kut(200); await shot('13-ozgap')
  await ishga(P); await kut(9500); await shot('13-tayyor'); await kut(12000); await shot('13-doska')
})
await qadam('14', async () => { await k(); await kut(2900); await shot('14-galereya') }) // 2,9 soniyada qahramon gapirayotgan bo'ladi
await qadam('15', async () => { await k(); await kut(1400); await shot('15-xarita'); await k(); await kut(2200); await shot('15a-sinf-bugun'); await k(); await kut(1600); await shot('15b-labirint') })
console.log(errs.length ? [...new Set(errs)].slice(0, 8).join('\n') : 'xato topilmadi')
await b.close()

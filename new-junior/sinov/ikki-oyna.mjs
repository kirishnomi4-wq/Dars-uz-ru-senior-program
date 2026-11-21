// Bitta brauzerda ikki alohida oyna (proyektor va bola noutbuki) bir-biriga ergashadimi? 1–4-sahna, 7-versiya oqimi.
import { chromium } from 'playwright-core'
const [asos] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } })
const errs = []
const u = await ctx.newPage(), o = await ctx.newPage()
for (const [p, n] of [[u, 'ustoz'], [o, 'bola']]) p.on('pageerror', (e) => errs.push(n + ' XATO ' + String(e).slice(0, 200)))
await u.goto(asos + '/?rol=ustoz&yangi=1#/dars/1'); await u.waitForSelector('.d1-ustoz'); await u.waitForTimeout(500)
await o.goto(asos + '/?rol=bola#/dars/1'); await o.waitForSelector('.d1-ekran'); await o.waitForTimeout(900)
const bolada = async () => (await o.locator('.d1-ekran').innerText()).replace(/\n/g, ' | ').slice(0, 60)
const ustozda = async () => (await u.locator('.d1-ustoz-matn').innerText()).replace(/\n/g, ' ')
const keyingi = async (n = 1) => { await u.bringToFront(); for (let i = 0; i < n; i++) { await u.keyboard.press('ArrowRight'); await u.waitForTimeout(350) } }
const bos = (sel) => o.locator(sel).first().click({ force: true, timeout: 5000 })
try {
  await bos('.d1-ishga'); await o.waitForTimeout(500); console.log('1) kirish → ustoz:', await ustozda())
  await keyingi(1); console.log('2) huk, savol → bola:', await bolada()); await bos('.d1-jkarta'); await o.waitForTimeout(500); console.log('   javobdan keyin → bola:', await bolada()); await u.waitForTimeout(300); console.log('   ustoz:', await ustozda())
  await keyingi(2); console.log('3) baqiramiz → bola:', await bolada()); for (let i = 0; i < 3; i++) { await bos('.d1-yur'); await o.waitForTimeout(150) } await u.waitForTimeout(600); console.log('   ustoz:', await ustozda())
  await keyingi(1); console.log('4) sudraymiz → ustoz:', await ustozda(), '| bola:', await bolada())
  await keyingi(2); console.log('5) reja → bola:', await bolada())
  await keyingi(2); await bos('.d1-tonka-tugma'); await o.waitForTimeout(500); console.log('6) tanlov → bola:', await bolada())
  await keyingi(1); console.log('7) studiya tanishuvi → bola:', await bolada())
  await keyingi(1); for (let i = 0; i < 3; i++) await bos('.d1-bloklar .d1-blok'); await bos('.d1-ishga'); await o.waitForTimeout(3200); console.log('8) navbat → bola:', await bolada()); await u.waitForTimeout(300); console.log('   ustoz:', await ustozda())
} catch (e) { console.log('TO`XTADI:', String(e).split('\n')[0]) }
console.log(errs.length ? errs.join('\n') : 'xato topilmadi')
await b.close()

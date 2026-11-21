// Blockly sinovini o'lchaydi: yuklanish vaqti (oddiy va 4× sekin protsessor), xato, bosib qo'shish, sudrab ulash,
// yozuvni o'zgartirish, ishga tushirish natijasi, «Kodini ko'rsat», xotira. Suratlar <papka> ga.
// Ishlatish (loyiha ildizidan): node new-junior/sinov/blockly/olchov.mjs <papka>
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
import { mkdirSync } from 'node:fs'
const out = process.argv[2] || '/tmp/blockly-olchov'
mkdirSync(out, { recursive: true })
const URL = 'file://' + new globalThis.URL('index.html', import.meta.url).pathname
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const natija = {}
const yukla = async (sekin) => {
  const ctx = await b.newContext({ viewport: { width: 1500, height: 900 } })
  const p = await ctx.newPage()
  const err = []; p.on('pageerror', (e) => err.push(String(e).slice(0, 200))); p.on('console', (m) => { if (m.type() === 'error') err.push(m.text().slice(0, 200)) })
  if (sekin) { const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }) }
  const t0 = Date.now(); await p.goto(URL, { waitUntil: 'load' }); await p.waitForFunction(() => window.__tayyor != null, null, { timeout: 60000 })
  const r = await p.evaluate(() => ({ tayyor: Math.round(window.__tayyor), js: performance.getEntriesByType('resource').filter((e) => /blockly/.test(e.name)).reduce((s, e) => s + (e.transferSize || e.encodedBodySize || 0), 0), xotira: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null }))
  r.yuklashMs = Date.now() - t0; r.xato = err
  return { p, ctx, r }
}
// 1) oddiy protsessor
const { p, ctx, r } = await yukla(false)
natija.oddiy = r
await p.waitForTimeout(800); await p.screenshot({ path: out + '/1-bosh.png' })
// javondagi bloklar (flyout) joylashuvi
const javon = async () => p.evaluate(() => { const fl = window.__ws.getToolbox().getFlyout(); return fl.getWorkspace().getTopBlocks(false).map((bl) => { const r = bl.getSvgRoot().getBoundingClientRect(); return { type: bl.type, x: r.left + 30, y: r.top + r.height / 2, w: r.width, h: r.height } }) })
const stek = async () => p.evaluate(() => { const t = window.__ws.getTopBlocks(true); const s = []; let b = t[0]; while (b) { s.push(b.type); b = b.getNextBlock() } return { stek: s, tepalar: t.length } })
let j = await javon(); natija.javon = j.map((x) => `${x.type} ${Math.round(x.w)}×${Math.round(x.h)}`)
// 2) bosib qo'shish: move right ni uch marta bosish
const mr = j.find((x) => x.type === 'move_right')
for (let i = 0; i < 3; i++) { await p.mouse.click(mr.x, mr.y); await p.waitForTimeout(250) }
natija.bosibQoshish = await stek()
await p.screenshot({ path: out + '/2-bosib-3.png' })
// 3) sudrab ulash: move left ni dastur oxiriga olib borish
const ml = j.find((x) => x.type === 'move_left')
const oxir = await p.evaluate(() => { const t = window.__ws.getTopBlocks(true)[0]; let b = t; while (b.getNextBlock()) b = b.getNextBlock(); const r = b.getSvgRoot().getBoundingClientRect(); return { x: r.left + 20, y: r.bottom + 6 } })
await p.mouse.move(ml.x, ml.y); await p.mouse.down(); await p.mouse.move(ml.x + 40, ml.y + 10, { steps: 6 }); await p.mouse.move(oxir.x + 6, oxir.y + 10, { steps: 18 }); await p.waitForTimeout(150); await p.mouse.up(); await p.waitForTimeout(400)
natija.sudrab = await stek()
await p.screenshot({ path: out + '/3-sudrab.png' })
// 4) ishga tushirish: 3 o'ngga + 1 chapga → 2-zonacha, «Oz qoldi!»
await p.click('#ishga'); await p.waitForFunction(() => window.__natija != null, null, { timeout: 20000 }); natija.ishga1 = await p.evaluate(() => window.__natija)
await p.screenshot({ path: out + '/4-ishga-oz-qoldi.png' })
// 5) chapga blokni olib tashlab (oxirgi blokni o'chirish), qayta ishga tushirish → yulduzda
await p.evaluate(() => { window.__natija = null; const t = window.__ws.getTopBlocks(true)[0]; let b = t; while (b.getNextBlock()) b = b.getNextBlock(); b.dispose(true) })
await p.click('#ishga'); await p.waitForFunction(() => window.__natija != null, null, { timeout: 20000 }); natija.ishga2 = await p.evaluate(() => window.__natija)
await p.screenshot({ path: out + '/5-yetib-bordi.png' })
// 6) Gap oilasi: say blokini bosib qo'shish va yozuvini o'zgartirish
await p.evaluate(() => window.__ws.getToolbox().selectItemByPosition(1)); await p.waitForTimeout(400)
j = await javon(); const sy = j.find((x) => x.type === 'say'); await p.mouse.click(sy.x - 10, sy.y); await p.waitForTimeout(300)
const maydon = await p.evaluate(() => { const t = window.__ws.getTopBlocks(true)[0]; let b = t; while (b.getNextBlock()) b = b.getNextBlock(); const f = b.getField('TEXT'); const r = f.getSvgRoot().getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } })
await p.mouse.click(maydon.x, maydon.y); await p.waitForTimeout(300); await p.keyboard.press('Control+A'); await p.keyboard.type('Men Momiqman!'); await p.keyboard.press('Enter'); await p.waitForTimeout(300)
natija.yozuv = await p.evaluate(() => { const t = window.__ws.getTopBlocks(true)[0]; let b = t; while (b.getNextBlock()) b = b.getNextBlock(); return b.getFieldValue('TEXT') })
await p.evaluate(() => { window.__natija = null }); await p.click('#ishga'); await p.waitForFunction(() => window.__natija != null, null, { timeout: 20000 })
await p.screenshot({ path: out + '/6-say.png' })
// 7) Kodini ko'rsat
await p.click('#kodb'); await p.waitForTimeout(300); natija.kod = await p.textContent('.kod')
await p.screenshot({ path: out + '/7-kod.png' })
natija.xotira2 = await p.evaluate(() => performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null)
// 8) DOM: rang doirachalari va bloklar o'lchami
natija.dom = await p.evaluate(() => ({ kategoriya: [...document.querySelectorAll('.jr-kat-label')].map((e) => e.textContent), blokBalandligi: Math.round(window.__ws.getTopBlocks(true)[0].getSvgRoot().getBoundingClientRect().height) }))
await ctx.close()
// 9) 4× sekin protsessor (zaif sinf noutbuki taxmini): yuklanish va 5 ta bosib qo'shish vaqti
const s = await yukla(true)
natija.sekin = s.r
const js = await (async () => { const pp = s.p; const jj = await pp.evaluate(() => { const fl = window.__ws.getToolbox().getFlyout(); const bl = fl.getWorkspace().getTopBlocks(false)[0]; const r = bl.getSvgRoot().getBoundingClientRect(); return { x: r.left + 30, y: r.top + r.height / 2 } }); const t0 = Date.now(); for (let i = 0; i < 5; i++) { await pp.mouse.click(jj.x, jj.y); await pp.waitForTimeout(50) } return Date.now() - t0 })()
natija.sekinBosish5 = js
await s.ctx.close(); await b.close()
console.log(JSON.stringify(natija, null, 2))

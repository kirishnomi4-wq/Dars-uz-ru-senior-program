// Tanlangan qismni 2× aniqlikda suratga oladi (kichik yozuv va rasmlarni ko'rish uchun).
// Ishlatish: node new-junior/sinov/etalon/yaqin.mjs <chiqish-papka> ".e-P2 .jv=p2-kartalar" [".e-P5 .oyna=p5" ...]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
import { mkdirSync } from 'node:fs'
const [, , out, ...juft] = process.argv
mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const p = await b.newPage({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
await p.goto('file://' + new URL('../../etalon/etalon.html', import.meta.url).pathname); await p.waitForTimeout(1500)
for (const j of juft) { const [sel, nom] = j.split('='); const e = await p.$(sel); if (!e) { console.error('topilmadi:', sel); continue } await e.screenshot({ path: `${out}/${nom}.png` }) }
await b.close(); console.log('ok')

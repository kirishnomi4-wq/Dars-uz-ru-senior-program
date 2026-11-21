// Etalonning har ekranini alohida PNG qiladi (ko'z bilan ko'rik uchun).
// Ishlatish: node new-junior/sinov/etalon/suratlar.mjs <chiqish-papka> [sahifa.html]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
import { mkdirSync } from 'node:fs'
const out = process.argv[2], file = process.argv[3] || new URL('../../etalon/etalon.html', import.meta.url).pathname
if (!out) { console.error('chiqish papkasini bering'); process.exit(1) }
mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const p = await b.newPage({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: 1 })
await p.goto('file://' + file); await p.waitForTimeout(1500)
const els = await p.$$('.wrap .ekran, .mz-ramka .ekran')
for (let i = 0; i < els.length; i++) { const id = await els[i].getAttribute('aria-label'); await els[i].screenshot({ path: `${out}/${String(i).padStart(2, '0')}-${id.split(' ')[0]}.png` }) }
console.log(els.length, 'surat →', out); await b.close()

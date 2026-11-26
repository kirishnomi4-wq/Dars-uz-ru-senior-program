// 17-dars bola yakuni (25.11, K1): ro'yxat «O‘yiningizda:» — bola 3-bekat o'yinida belgilagan bandlar yakunda ✓.
// 1) bo'sh holat — hamma band ✓ siz; 2) 3-bekat ekranida dvigatel belgilaydi (kosmikChekChiz — o'yindagi kabi) → yakunda o'sha bandlar ✓;
// 3) ustoz ekranida belgilansa — bolaning ro'yxati o'zgarmaydi; 4) xabar kartasi ro'yxatni yopmaydi. Surat: --surat <fayl>
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const U = 'http://localhost:5340/demo-017.html', si = process.argv.indexOf('--surat'), SUR = si > 0 ? process.argv[si + 1] : null
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
const p = await (await b.newContext({ viewport: { width: 1440, height: 810 } })).newPage()
p.on('pageerror', (e) => xato.push(e.message))
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || iz === '' ? '' : '  — ' + iz)) }
const bor = (id) => p.evaluate((id) => { const S = window.__jrSinov ? window.__jrSinov.SOLO_R : SOLO_R; for (const q of Object.keys(S).map(Number)) { const i = S[q].indexOf(id); if (i >= 0) { if (window.__jrSinov) return window.__jrSinov.bor(q, i); qadam = q; ichki = i; chiz(); return } } }, id).then(() => p.waitForTimeout(1500))
const holat = () => p.evaluate(() => [...document.querySelectorAll('#ilova .chek-y .ch-r')].map((r) => r.dataset.ch + (r.classList.contains('ok') && r.querySelector('i').textContent === '✓' ? '+' : '-')).join(' '))
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=solo&xona=chek17'); await p.waitForTimeout(900)
await bor('B5'); tek('1) bo‘sh: to‘rt band, hammasi ✓ siz', (await holat()) === 'yuradi- otildi- ochdi- hamma-', await holat())
await bor('B3A')
tek('2a) 3-bekat ekranida ro‘yxat bor', !!(await p.$('#ilova .pl .chek')))
await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); kosmikChekChiz(ek, { yuradi: true, otildi: true }) })
await bor('B3B'); await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); kosmikChekChiz(ek, { ochdi: true }) })
await bor('B5'); tek('2b) yakunda belgilangan uch band ✓, «hamma» — yo‘q', (await holat()) === 'yuradi+ otildi+ ochdi+ hamma-', await holat())
// 4) xabar kartasi ro'yxatni yopmaydi (kesishmaydi)
const kes = await p.evaluate(() => { const a = document.querySelector('#ilova .chek-y').getBoundingClientRect(), c = document.querySelector('#ilova .oyna > .gl.kd2.a-tr').getBoundingClientRect(); return Math.min(a.right, c.right) > Math.max(a.left, c.left) && Math.min(a.bottom, c.bottom) > Math.max(a.top, c.top) })
tek('4) xabar kartasi ro‘yxatni yopmaydi', !kes)
if (SUR) await p.screenshot({ path: SUR })
// 3) ustoz ekranida belgilash bolaning ro'yxatiga yozilmaydi (alohida oyna)
await p.goto(U + '?rol=varaq'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('demo-ism', 'Aziz'); localStorage.setItem('demo-qah', 'nihol') })
await p.goto(U + '?rol=ustoz&yangi=1&xona=chek17u'); await p.waitForTimeout(900)
await p.evaluate(() => { const Q = window.__jrSinov ? window.__jrSinov.QADAM : QADAM, q = Q.findIndex((x) => x[1] === 'P10'); if (window.__jrSinov) return window.__jrSinov.bor(q, 0); qadam = q; ichki = 0; chiz() }); await p.waitForTimeout(1500)
const yozdi = await p.evaluate(() => { const ek = document.querySelector('#ilova .ekran'); if (!ek || ek.dataset.id !== 'P10' || !ek.querySelector('.pl')) return 'ekran: ' + (ek && ek.dataset.id); kosmikChekChiz(ek, { yuradi: true }); return 'ok:' + Object.keys(localStorage).filter((k) => /ksChek/.test(k)).join(',') })
tek('3) ustoz ekranida (P10, ro‘yxatli) belgilash bolaning ro‘yxatiga yozilmaydi', yozdi === 'ok:', yozdi)
tek('konsolda xato yo‘q', !xato.length, xato.join('; '))
console.log(`NATIJA: ${ok}/${jami}`)
await b.close()
process.exit(ok === jami ? 0 : 1)

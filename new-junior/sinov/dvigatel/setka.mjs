// Setka darvozasi har dars uchun (dvigatel 5b-2, 19.11): demo sahifasidagi ekranlardan etalon shaklidagi sahifa yig'iladi (.wrap .ekran, aria-label)
// va o'sha qat'iy setka tekshiruvi (sinov/etalon/setka-tekshiruv.mjs) yuritiladi. Qo'shimcha — labirintli ekranlar (99-qaror): labirint butun oynani
// egallaydi, «pastki 40% — yo'l qatlami» qoidasi unga qo'llanmaydi, lekin hech qanday panel yoki matn qahramonni (.kt-q) yopmaydi.
// Diqqat: setka-tekshiruv ikki qatorli sarlavha ruxsatini 1-dars ekran nomlari bo'yicha beradi (P1, P2, P2N, P2S, P2C … — 2-darsda ham huk va javob
// ekranlari shu nomda); ro'yxatda yo'q ekranda ikki qatorli sarlavha «sarlavha 2 qator» bo'lib chiqadi.
// 21.11 (13-dars): ichidan oshish — tanlov kartasi (.jk) ichidagi bloklar karta chetidan chiqmaydi, «Boshqaruv/Qahramon» qatori (.bq-q) ichidan oshmaydi
// (ikkalasi ham ko'z bilan topilgan edi: huk C kartasidagi go to + random, 11–13-darsda ▾ qirqilgan).
// Ishlatish (loyiha ildizidan, demo yig'ilgan): node new-junior/sinov/dvigatel/setka.mjs <dars-papkasi>
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const NJ = new URL('../../', import.meta.url).pathname
const dars = process.argv[2]
if (!dars) { console.error('Ishlatish: node new-junior/sinov/dvigatel/setka.mjs <dars-papkasi>'); process.exit(2) }
const demo = +dars.slice(0, 3) === 1 ? 'demo.html' : 'demo-' + dars.slice(0, 3) + '.html'
const h = readFileSync(NJ + 'public/' + demo, 'utf8')
const bosh = h.slice(0, h.indexOf('</head>')), q = h.match(/\nconst EKRANLAR = (\{.*\});\n/)
if (!q) { console.error(demo + ': EKRANLAR topilmadi'); process.exit(2) }
const EK = JSON.parse(q[1])
const sahifa = bosh + '<style>body{display:block;overflow:auto;height:auto}.wrap{max-width:1280px;margin:20px auto;display:flex;flex-direction:column;gap:30px}</style></head><body><div class="wrap">'
  // demodagidek: har ekran .sahna-q ichida (16:9 o'lcham shu o'ramdan), kengligi etalon sahifasidagidek 1280 px
  + Object.entries(EK).map(([id, x]) => '<div class="sahna-q" style="width:1280px">' + x.replace('class="ekran hy', 'role="img" aria-label="' + id + '" class="ekran hy') + '</div>').join('\n') + '</div></body></html>'
const F = NJ + 'sinov/dvigatel/.setka-' + dars + '.html'
writeFileSync(F, sahifa)
let kod = 0
try { process.stdout.write(execFileSync(process.execPath, [NJ + 'sinov/etalon/setka-tekshiruv.mjs', F], { encoding: 'utf8' })) } catch (e) { process.stdout.write(e.stdout || ''); kod = 1 }
// labirint: qahramonni hech narsa yopmaydi
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } })
await p.goto('file://' + F); await p.waitForTimeout(1500); await p.evaluate(() => document.fonts.ready)
const r = await p.evaluate(() => {
  const out = [], R = (e) => e.getBoundingClientRect(), kes = (a, c) => Math.max(0, Math.min(a.right, c.right) - Math.max(a.left, c.left)) * Math.max(0, Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top))
  let soni = 0
  document.querySelectorAll('.wrap .ekran').forEach((ek) => {
    const q = ek.querySelector('.katak .kt-q svg'); if (!q) return
    soni++
    const qr = R(q), id = ek.getAttribute('aria-label')
    ek.querySelectorAll('.oyna .gl, .oyna .jv, .oyna .pan').forEach((pn) => { const k = kes(R(pn), qr); if (k > qr.width * qr.height * 0.03) out.push(`${id}: «${(pn.className + '').slice(0, 18)}» labirintdagi qahramonni yopdi (${Math.round(100 * k / (qr.width * qr.height))}%)`) })
  })
  let ich = 0
  document.querySelectorAll('.wrap .ekran').forEach((ek) => {
    const id = ek.getAttribute('aria-label')
    ek.querySelectorAll('.jk').forEach((k, i) => { const kr = R(k); k.querySelectorAll('.mb').forEach((m) => { ich++; const mr = R(m); if (mr.width && (mr.left < kr.left - 1 || mr.right > kr.right + 1)) out.push(`${id}: ${i + 1}-karta — blok karta chetidan chiqdi (${Math.round(Math.max(kr.left - mr.left, mr.right - kr.right))} px)`) }) })
    ek.querySelectorAll('.bq-q').forEach((b) => { ich++; if (b.scrollWidth > b.clientWidth + 1) out.push(`${id}: «${b.textContent.trim().slice(0, 12)}» qatori ichidan ${b.scrollWidth - b.clientWidth} px oshdi`) })
  })
  out.ich = ich
  return { out, soni, ich: out.ich }
})
await b.close()
console.log(`labirintli ekran: ${r.soni}; ichidan oshish tekshirildi: ${r.ich} element`, r.out.length ? '\n  ' + r.out.join('\n  ') : '— qahramon ochiq, hech narsa oshmadi')
process.exit(kod || r.out.length ? 1 : 0)

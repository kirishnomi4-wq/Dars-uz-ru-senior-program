// Setka darvozasi har dars uchun (dvigatel 5b-2, 19.11): demo sahifasidagi ekranlardan etalon shaklidagi sahifa yig'iladi (.wrap .ekran, aria-label)
// va o'sha qat'iy setka tekshiruvi (sinov/etalon/setka-tekshiruv.mjs) yuritiladi. Qo'shimcha — labirintli ekranlar (99-qaror): labirint butun oynani
// egallaydi, «pastki 40% — yo'l qatlami» qoidasi unga qo'llanmaydi, lekin hech qanday panel yoki matn qahramonni (.kt-q) yopmaydi.
// Diqqat: setka-tekshiruv ikki qatorli sarlavha ruxsatini 1-dars ekran nomlari bo'yicha beradi (P1, P2, P2N, P2S, P2C … — 2-darsda ham huk va javob
// ekranlari shu nomda); ro'yxatda yo'q ekranda ikki qatorli sarlavha «sarlavha 2 qator» bo'lib chiqadi.
// 21.11 (13-dars): ichidan oshish — tanlov kartasi (.jk) ichidagi bloklar karta chetidan chiqmaydi, «Boshqaruv/Qahramon» qatori (.bq-q) ichidan oshmaydi
// (ikkalasi ham ko'z bilan topilgan edi: huk C kartasidagi go to + random, 11–13-darsda ▾ qirqilgan).
// 21.11 (F-1121, Safari): blok o'z qutisidan chiqmaydi — har .mb / .c-blok eng yaqin ko'rinadigan qutisi (fon, soya yoki hoshiyali ota) ichida,
// to'rt tomondan ham (eski .jk tekshiruvi shunga kirdi; 1-ekran «O'tgan darsda» kartasidagi oshish shu bilan topildi). Studiyaning statik
// dastur ro'yxati (.dst) o'tkaziladi — jonli darsda uning o'rnida Blockly. Sahifaga dvigatel/kichik.js qo'shiladi (demodagidek).
// --webkit — ichki tekshiruvlar Safari dvigatelida (Playwright WebKit; kutubxonalari — sinov/OQI.md); etalon setkasi faqat Chrome'da.
// Ishlatish (loyiha ildizidan, demo yig'ilgan): node new-junior/sinov/dvigatel/setka.mjs <dars-papkasi> [--webkit]
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { chromium, webkit } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const NJ = new URL('../../', import.meta.url).pathname
const dars = process.argv[2], WK = process.argv.includes('--webkit')
if (!dars) { console.error('Ishlatish: node new-junior/sinov/dvigatel/setka.mjs <dars-papkasi>'); process.exit(2) }
const demo = +dars.slice(0, 3) === 1 ? 'demo.html' : 'demo-' + dars.slice(0, 3) + '.html'
const h = readFileSync(NJ + 'public/' + demo, 'utf8')
const bosh = h.slice(0, h.indexOf('</head>')), q = h.match(/\nconst EKRANLAR = (\{.*\});\n/)
if (!q) { console.error(demo + ': EKRANLAR topilmadi'); process.exit(2) }
const EK = JSON.parse(q[1])
const sahifa = bosh + '<style>body{display:block;overflow:auto;height:auto}.wrap{max-width:1280px;margin:20px auto;display:flex;flex-direction:column;gap:30px}</style></head><body><div class="wrap">'
  // demodagidek: har ekran .sahna-q ichida (16:9 o'lcham shu o'ramdan), kengligi etalon sahifasidagidek 1280 px
  + Object.entries(EK).map(([id, x]) => '<div class="sahna-q" style="width:1280px">' + x.replace('class="ekran hy', 'role="img" aria-label="' + id + '" class="ekran hy') + '</div>').join('\n') + '</div><script>' + readFileSync(NJ + 'dvigatel/kichik.js', 'utf8') + '</script></body></html>'
const F = NJ + 'sinov/dvigatel/.setka-' + dars + '.html'
writeFileSync(F, sahifa)
let kod = 0
if (!WK) try { process.stdout.write(execFileSync(process.execPath, [NJ + 'sinov/etalon/setka-tekshiruv.mjs', F], { encoding: 'utf8' })) } catch (e) { process.stdout.write(e.stdout || ''); kod = 1 }
// labirint: qahramonni hech narsa yopmaydi
if (WK) process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = '1'
const b = WK ? await webkit.launch() : await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
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
    const quti = (el) => { for (let a = el.parentElement; a && a !== ek; a = a.parentElement) { const s = getComputedStyle(a); if ((s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') || s.backgroundImage !== 'none' || s.boxShadow !== 'none' || parseFloat(s.borderTopWidth) > 0) return a } return ek }
    const kor = new Set()
    ek.querySelectorAll('.mb, .c-blok').forEach((m) => {
      if (m.parentElement.closest('.mb') || m.closest('.dst')) return
      const mr = R(m); if (!mr.width || !mr.height) return
      ich++
      const qt = quti(m), qr = R(qt), osh = Math.max(qr.left - mr.left, mr.right - qr.right, qr.top - mr.top, mr.bottom - qr.bottom)
      const nom = (qt.className + '').split(' ')[0]
      if (osh > 1.5 && !kor.has(nom)) { kor.add(nom); out.push(`${id}: blok «${m.textContent.trim().replace(/\s+/g, ' ').slice(0, 20)}» o'z qutisidan («${nom}») ${Math.round(osh)} px chiqdi`) }
    })
    ek.querySelectorAll('.bq-q').forEach((b) => { ich++; if (b.scrollWidth > b.clientWidth + 1) out.push(`${id}: «${b.textContent.trim().slice(0, 12)}» qatori ichidan ${b.scrollWidth - b.clientWidth} px oshdi`) })
  })
  out.ich = ich
  return { out, soni, ich: out.ich }
})
await b.close()
console.log((WK ? '[WebKit] ' : '') + `labirintli ekran: ${r.soni}; ichidan oshish tekshirildi: ${r.ich} element`, r.out.length ? '\n  ' + r.out.join('\n  ') : '— qahramon ochiq, hech narsa oshmadi')
process.exit(kod || r.out.length ? 1 : 0)

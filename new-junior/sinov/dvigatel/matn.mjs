// Matn darvozasi (dvigatel 5b-2, 19.11): dars manbasidagi qo'shtirnoq ichidagi gaplar («…») demo sahifasida AYNAN bormi.
// Manba qoidasi: «Qo'shtirnoq ichidagi gaplar ekranda aynan shunday chiqadi» — ekranlarda, ustoz varag'ida (tayanch gaplar — «Siz» ustuni) yoki
// dvigatelning umumiy gaplarida (muammocha, ishora). Sahifa matni teglarsiz olinadi (sarlavhadagi <em> kabi belgilar gapni bo'lmasin).
// Tekshirilmaydigan maydonlar — ekranga chiqmaydi: «O'z so'zi bilan» (ustoz o'zi aytadi), «Bola qiladi», «Tekshiruv», «Sahna» (tushuntirish);
// «Pasport», «So'zlar», «LMS…» (server nomlari), «Qarorlar», «Tekshirilmagan joylar», «Dvigatelga kerak…» bo'limlari ham. Qolgani — hammasi.
// Oddiy apostrofli (') gap — manba izohidagi so'z («noto'g'ri» deyilmaydi), ekran gapi emas: ekrandagi matnda tutuq belgisi doim ‘ ’.
// Ikki daraja: AYNAN — gap sahifada harfma-harf; KARTA — ekranda karta shaklida (sarlavha va izoh alohida: «Dastur — ketma-ket buyruqlar» →
// «Dastur» + «Ketma-ket buyruqlar»; «Uch pog‘onani tugatdi 4 / 14» → yozuv + son): bo'sh joy, «—», «·» va harf kattaligi hisobga olinmaydi,
// rasmlar (svg) olib tashlanadi. KARTA darajasidagilar ro'yxatda ko'rsatiladi (ko'z bilan tekshirish uchun), xato hisoblanmaydi.
// Ishlatish (loyiha ildizidan, demo yig'ilgan): node new-junior/sinov/dvigatel/matn.mjs <dars-papkasi>   (masalan: 002-ketma-ketlik)
// Natija: topilmagan har gap — manbadagi qatori bilan; hammasi topilsa kod 0.
import { readFileSync } from 'node:fs'
const NJ = new URL('../../', import.meta.url).pathname
const dars = process.argv[2]
if (!dars) { console.error('Ishlatish: node new-junior/sinov/dvigatel/matn.mjs <dars-papkasi>'); process.exit(2) }
const raqam = +dars.slice(0, 3), demo = raqam === 1 ? 'demo.html' : 'demo-' + dars.slice(0, 3) + '.html'
const manba = readFileSync(NJ + 'manba/' + dars + '.md', 'utf8').split('\n')
const xom = readFileSync(NJ + 'public/' + demo, 'utf8')
  .replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\"/g, '"').replace(/\\n/g, ' ')
const sahifa = xom
  .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ')
const SKIP_MAYDON = /^\s*- \*\*(O'z so'zi bilan|Bola qiladi|Tekshiruv|Sahna):\*\*/
const SKIP_BOLIM = /^## (Pasport|So'zlar|LMS|Qarorlar|Tekshirilmagan joylar|Dvigatelga kerak|Savollar|Moslash|Qurishdagi qarorlar|Audit saboqlari)/ // 20.11 (9-dars): savollar, moslash va qurishdagi qarorlar ham meta
const ixcham = (t) => t.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/[\s—·]+/g, '').toLowerCase()
const kartaSahifa = ixcham(xom)
// «…» gaplari: ichma-ich qo'shtirnoq ham bo'ladi («Noutbukda «Tayyorman» tugmasini bosing.») — tashqisi olinadi
function gaplar(q) {
  const out = []; let d = 0, s = -1
  for (let i = 0; i < q.length; i++) { if (q[i] === '«') { if (d === 0) s = i + 1; d++ } else if (q[i] === '»' && d > 0) { d--; if (d === 0) out.push(q.slice(s, i)) } }
  return out
}
let bolim = '', skipBolim = false, jami = 0
const yoq = [], karta = []
manba.forEach((q, i) => {
  if (/^## /.test(q)) { bolim = q.slice(3); skipBolim = SKIP_BOLIM.test(q) }
  if (skipBolim || SKIP_MAYDON.test(q) || /^>/.test(q)) return
  for (const g of gaplar(q)) {
    const t = g.replace(/\s+/g, ' ').trim(); if (!t || t.includes("'")) continue
    jami++
    if (sahifa.includes(t)) continue
    // N — namuna o'rni (manbada «Yordam so‘radi: N ta noutbuk»): sahifada istalgan son
    if (/\bN\b/.test(t) && new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\bN\b/g, '\\d+')).test(sahifa)) continue
    if (kartaSahifa.includes(ixcham(t))) { karta.push(`  ${String(i + 1).padStart(3)}: «${t}»`); continue }
    yoq.push(`  ${String(i + 1).padStart(3)}: «${t}»   [${bolim}]`)
  }
})
console.log(`${dars}: manbadagi gaplar ${jami}, ${demo} da topildi ${jami - yoq.length} (aynan ${jami - yoq.length - karta.length}, karta shaklida ${karta.length})` + (karta.length ? `\nKARTA SHAKLIDA (ko'z bilan):\n` + karta.join('\n') : '') + (yoq.length ? `\nTOPILMADI (${yoq.length}):\n` + yoq.join('\n') : ' — HAMMASI BOR'))
process.exit(yoq.length ? 1 : 0)

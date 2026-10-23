// RU testlar: data/ru/testlar-*.json (q, v, h, why, kod?) + data/testlar.json (t, rasm, kod, kodTil) → data/testlar.ru.json
// Ishlatish: node vositalar/ru-testlar.mjs — tekshiradi: savol soni, 4 variant/4 hint, o'zbekcha qoldiq; t/rasm uz'dan olinadi (o'zgarmaydi).
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UZ = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/testlar.json'), 'utf8'));
const RU = {};
for (const f of fs.readdirSync(path.join(ROOT, 'data/ru')).filter(f => /^testlar-\d+\.json$/.test(f)))
  Object.assign(RU, JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ru', f), 'utf8')));
const UZ_IZ = /\b\w*(o'|g'|o‘|g‘)\w*|\b(va|bilan|uchun|qaysi|nima|bo'ladi|kerak|emas|yo'q|ta)\b/i
const KOD_MATN = /^[\s\S]*$/ // kod variantlari (SQL, findOne…) qoldiq-tekshiruvdan o'tmaydi — pastda alohida
let xato = 0; const ayt = m => { xato++; console.log('✗', m) }
const chiq = { _izoh: UZ._izoh + ' · RU: data/ru/testlar-*.json dan yig\'ilgan (vositalar/ru-testlar.mjs); t/rasm uz bilan bir xil.' }
for (const [id, savollar] of Object.entries(UZ)) {
  if (id === '_izoh') continue
  const r = RU[id]; if (!r) { ayt(`${id}: tarjima yo'q`); continue }
  if (r.length !== savollar.length) ayt(`${id}: savol ${r.length} ≠ ${savollar.length}`)
  chiq[id] = savollar.map((u, i) => {
    const t = r[i] || {}
    if (t.v?.length !== 4 || t.h?.length !== 4) ayt(`${id}.${i + 1}: v/h soni`)
    const kodmi = s => /[(){};=@'_\/]|^\d|SELECT|INSERT|UPDATE|DELETE|^[a-zA-Z.]+$/.test(s)
    ;[t.q, ...(t.v || []).filter(x => !kodmi(x)), ...(t.h || []).filter(x => !/^@|^\w+\(/.test(x)), t.why].forEach(s => {
      const m = (s || '').replace(/'[^']*'|«[A-Za-z' ]+»|\b(Chorvoq|Toshkent|Koptok|Mishka|Sichqoncha|Ruchka|tog_sayyoh|futbol_fan|rasm_chizar|mahsulot-tavsifi|kun\.uz|coddycmp\.uz|coddycamp\.uz)\b/g, '').match(UZ_IZ)
      if (m) ayt(`${id}.${i + 1}: o'zbekcha qoldiq? «${m[0]}» — ${s.slice(0, 60)}`)
    })
    const o = { ...u, q: t.q, v: t.v, h: t.h, why: t.why }
    if (t.kod) o.kod = t.kod
    return o
  })
}
for (const id of Object.keys(RU)) if (!UZ[id]) ayt(`${id}: uz'da yo'q`)
fs.writeFileSync(path.join(ROOT, 'data/testlar.ru.json'), JSON.stringify(chiq, null, 1) + '\n')
const n = Object.values(chiq).filter(Array.isArray).flat().length
console.log(`${Object.keys(chiq).length - 1} test · ${n} savol · xato: ${xato}`)
process.exit(xato ? 1 : 0)

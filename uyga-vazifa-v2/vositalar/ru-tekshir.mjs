// RU tarjima tekshiruvi: data/ru/*.json ↔ src/hw-qa2/data.js (uz). Ishlatish: node vositalar/ru-tekshir.mjs
// Tekshiradi: karta yo'qligi/ortiqchaligi · qadam/mentor soni · `kod` bo'laklari aynan · lotin-o'zbekcha qoldiq (o', g', sh-so'zlar).
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { MODULLAR } = await import(path.join(ROOT, '../src/hw-qa2/data.js'));
const RU = {};
for (const f of fs.readdirSync(path.join(ROOT, 'data/ru')).filter(f => /^m[\d-]+\.json$/.test(f)))
  Object.assign(RU, JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ru', f), 'utf8')));
// kod ichidagi '…' matn (masalan it('…') nomi) tarjima qilinishi mumkin — solishtirishda e'tiborsiz
const kod = s => (s.match(/`[^`]*`/g) || []).map(k => k.replace(/'[^']*'/g, "'…'")).sort().join(' ')
const UZ_IZ = /\b\w*(o'|g'|o‘|g‘)\w*|\b(va|bilan|uchun|qiling|yozing|bo'lsin|ham|emas)\b/i
let xato = 0, n = 0, yoq = []
const ayt = (id, m) => { xato++; console.log('✗', id, m) }
for (const mo of MODULLAR) for (const d of mo.darslar) {
  if (d.pm) continue
  const r = RU[d.id]; if (!r) { yoq.push(d.id); continue }
  n++
  const uq = d.oquvchiga?.qadamlar || [], um = d.mentor || []
  if (r.qadamlar.length !== uq.length) ayt(d.id, `qadam ${r.qadamlar.length} ≠ ${uq.length}`)
  if (r.mentor.length !== um.length) ayt(d.id, `mentor ${r.mentor.length} ≠ ${um.length}`)
  if (!!r.kirish !== !!d.oquvchiga?.kirish) ayt(d.id, 'kirish bor/yo\'q farqi')
  const juft = [[d.oquvchiga?.kirish || '', r.kirish], ...uq.map((q, i) => [q, r.qadamlar[i] || '']), ...um.map((q, i) => [q, r.mentor[i] || ''])]
  juft.forEach(([u, ru], i) => {
    if (kod(u) !== kod(ru)) ayt(d.id, `#${i} kod farqi:\n    uz: ${kod(u)}\n    ru: ${kod(ru)}`)
    const qoldiq = ru.replace(/`[^`]*`/g, '').match(UZ_IZ)
    if (qoldiq) ayt(d.id, `#${i} o'zbekcha qoldiq? «${qoldiq[0]}»`)
  })
}
const ortiqcha = Object.keys(RU).filter(id => !MODULLAR.some(m => m.darslar.some(d => d.id === id)))
console.log(`\nTekshirildi: ${n} karta · xato: ${xato} · tarjima qilinmagan: ${yoq.length}${yoq.length ? ' (' + yoq.join(' ') + ')' : ''}${ortiqcha.length ? ' · ortiqcha: ' + ortiqcha.join(' ') : ''}`)
process.exit(xato ? 1 : 0)

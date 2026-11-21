// LMS (CRM) uchun dars yig'masi — 18.11.2026; 19.11: 2d — demo bilan bitta yig'uvchidan, 3d — dars nomi va yutuqlar dars e'lonidan (DARS.lms).
// Ishlatish (loyiha ildizidan):  node new-junior/lms/yig.mjs [dars-papkasi]   (standart: 001-tanishuv)
//   Chiqish: new-junior/lms/chiqish/junior-<dars-papkasi>.jsx — bitta fayl, tepasida faqat `import … from "react"`.
//   Muhit: JR_API=http://127.0.0.1:3101 — lokal server (sinov uchun); bo'sh — prod https://dars-api.coddycamp.uz
//
// Demo (dvigatel/yig.mjs → public/demo.html) bilan bir xil fayllardan — dvigatel/yigish.mjs. demo.html o'qilmaydi, hech narsa kesilmaydi
// va matn qidirib almashtirilmaydi (2d dan oldin skript demo.html dan kesilib, rol/aloqa/ism/kalit langar bilan almashtirilardi):
//   1) ekranlar: chizuvchi() — demo Node'da yuritadigan o'sha kod brauzerda yuriladi (demo.html dagi 3,6 MB tayyor SVG o'rniga)
//   2) dars mantig'i: skript({ demo: false }) — studiya + qobiq; KIRISH (rol, kalit, ism) — Dars.jsx dan, aloqa — lms/aloqa.js (sinfAloqa)
//   3) uslub: uslub() — dars uslubi + qobiq uslubi (demo.html dagi ikki <style> bilan bir xil) va shrift havolasi
import { writeFileSync, mkdirSync, rmSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { build } from 'esbuild'
import { chizuvchi, skript, uslub } from '../dvigatel/yigish.mjs'

const L = new URL('.', import.meta.url).pathname // new-junior/lms/
const DV = new URL('../dvigatel/', import.meta.url).pathname
const CHIQISH = L + 'chiqish/'
const DARS_P = process.argv[2] || '001-tanishuv'
const toxta = (m) => { console.error('✖ ' + m); process.exit(1) }
const J = JSON.stringify

// ---------- 1) ekran chizuvchisi — brauzerda yuriladi (Dars.jsx import qiladi: ../dvigatel/.yigma-lms.mjs)
const genMatn = chizuvchi(DARS_P) +
  '\nexport const D = { EKRANLAR, QADAM, VARAQ, EKRANLAR_Q, EKRANLAR_U, PAL_HTML, PAL_B1, QAH_SVG, ODAM_SVG: ODAM, MUAM_SVG, DUNYO_HTML, QAHRAMONLAR, QNOM, JOYLAR: JOYLAR.map(([k]) => k), DARS }\n'
if (/process\.|node:fs|import\.meta/.test(genMatn)) toxta('chizuvchida Node narsasi qoldi (process / node:fs / import.meta) — u brauzerda yuriladi')
const GEN = DV + '.yigma-lms.mjs' // dvigatel/ ichida: bosh.mjs dagi '../src/chizma/dvigatel.js' importi o'sha joydan topilsin
writeFileSync(GEN, genMatn)
const { D } = await import(GEN + '?t=' + Date.now()) // Node'da bir marta yuritib tekshiramiz
// ichki nomlar takrorlanmasin: har SVG o'z raqamini olgan bo'lishi kerak (bitta chizmaning ichida bir nom bir necha marta ishlatiladi)
const uidlar = (s) => new Set(s.match(/\b[hrz]\d+_/g) || [])
const jamiUid = Object.values(D.EKRANLAR).map((x) => uidlar(x).size).reduce((a, b) => a + b, 0)
if (uidlar(Object.values(D.EKRANLAR).join('')).size !== jamiUid) toxta('ekranlar orasida bir xil SVG ichki nomi')
// dars nomi va versiyasi — e'londan (server ro'yxatidagi lesson_id bilan bir xil bo'lishi shart)
const L_DARS = D.DARS && D.DARS.lms
if (!L_DARS || !L_DARS.id || !L_DARS.versiya || !L_DARS.kalit) toxta('dars e\'lonida lms { id, versiya, kalit } yo\'q')
const LESSON_ID = L_DARS.id, LESSON_VERSION = L_DARS.versiya
console.log('✔ chizuvchi: ' + Object.keys(D.EKRANLAR).length + ' ekran, ' + D.QADAM.length + ' qadam, ' + jamiUid + ' SVG ichki nomi takrorsiz')

// ---------- 2) dars mantig'i: studiya + qobiq; kirish va aloqa — LMS'dan
const ish = skript({ demo: false })
for (const s of ['/__sinf', '/api/sinf', 'BroadcastChannel', 'EventSource', 'aloqaDemo']) if (ish.includes(s)) toxta('mantiq: demo aloqasi kirib qolgan — ' + s)
if (/'demo-[a-z]+'/.test(ish)) toxta('mantiq: saqlov kaliti K siz yozilgan (\'demo-…\')')
if (/location\.search\s*=/.test(ish.replace(/onclick="location\.search=[^"]*"/g, ''))) toxta('mantiq: kutilmagan location.search')
const ishModul = `// AVTO: new-junior/lms/yig.mjs — dvigatel/yigish.mjs skript({ demo: false }) dan. Qo'lda tahrirlanmaydi.
/* eslint-disable */
export function ishga(D, A, OPT) {
const { EKRANLAR, QADAM, VARAQ, EKRANLAR_Q, EKRANLAR_U, PAL_HTML, PAL_B1, QAH_SVG, ODAM_SVG, MUAM_SVG, DUNYO_HTML, QAHRAMONLAR, QNOM, JOYLAR, DARS } = D
// kirish (qobiq.js ning KIRISH obyekti): rol, saqlov kaliti (sinf bo'yicha), ism — Dars.jsx dan; aloqa — lms/aloqa.js (CRM ko'rigida bo'sh)
const KIRISH = { rol: OPT.solo ? 'solo' : OPT.rol, k: OPT.k, ism: OPT.ism, aloqa: A }
${ish}
}
`
writeFileSync(L + '.ish.gen.js', ishModul)

// ---------- 3) uslub — demo.html dagi ikki <style> bloki bilan bir xil matn
const { DARS_CSS, QOBIQ_CSS, SHRIFT } = uslub(DARS_P)
const CSS = DARS_CSS + '\n\n' + QOBIQ_CSS
const SHRIFT_URL = (SHRIFT.match(/href="(https:\/\/fonts\.googleapis\.com[^"]+)"/) || [])[1]
if (!SHRIFT_URL) toxta('shrift havolasi topilmadi')
writeFileSync(L + '.uslub.gen.js', '// AVTO: new-junior/lms/yig.mjs\nexport const CSS = ' + J(CSS) + '\nexport const SHRIFT = ' + J(SHRIFT_URL.replace(/&amp;/g, '&')) + '\n')

// ---------- 4) bitta .jsx
// Blockly (vendor, UMD) — loyiha ildizida "type": "module", shuning uchun esbuild uni CommonJS deb tanimaydi.
// Fayl o'zgarmaydi: yig'ishda modulga o'raladi (module.exports → export default; javascript_compressed ichidagi require → yadro).
const blocklyUMD = { name: 'blockly-umd', setup(b) {
  b.onLoad({ filter: /vendor\/blockly-[^/]+\/(blockly_compressed|en|javascript_compressed)\.js$/ }, (a) => {
    const asl = readFileSync(a.path, 'utf8'), yadro = a.path.endsWith('javascript_compressed.js')
    return { loader: 'js', resolveDir: a.path.replace(/\/[^/]+$/, ''), contents:
      (yadro ? "import __yadro from './blockly_compressed.js';\n" : '') +
      'var module = { exports: {} }, exports = module.exports, define = undefined;\n' +
      (yadro ? 'var require = function () { return __yadro };\n' : '') + asl + '\nexport default module.exports;\n' }
  })
} }
mkdirSync(CHIQISH, { recursive: true })
const r = await build({
  entryPoints: [L + 'Dars.jsx'], bundle: true, format: 'esm', write: false, jsx: 'preserve', charset: 'utf8',
  target: ['chrome79'], external: ['react'], plugins: [blocklyUMD], legalComments: 'none',
  // 2d: chizuvchida fayl o'qish va import.meta yo'q — fs o'rnini bosuvchi va import.meta.url ta'rifi kerak emas
  define: { __JR_API__: J(process.env.JR_API || ''), __JR_LESSON_ID__: J(LESSON_ID), __JR_LESSON_VERSION__: J(LESSON_VERSION) },
  logLevel: 'warning',
})
let chiq = r.outputFiles[0].text
const reactImport = chiq.match(/^import[^\n]*from "react";$/gm) || []
if (/^import(?![^\n]*from "react";)/m.test(chiq)) toxta('react dan boshqa import qoldi')
if (/react-dom/.test(chiq)) toxta('react-dom importi (CRM K03 rad etadi)')
if (/import\.meta|node:fs/.test(chiq)) toxta('yig\'mada import.meta yoki node:fs qoldi')
const sha = createHash('sha1').update(chiq).digest('hex').slice(0, 8)
chiq = `// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG. Junior · ${D.DARS.raqam}-dars «${D.DARS.nom}» (${LESSON_ID}, ${LESSON_VERSION})
//  Manba: new-junior/dvigatel (yigish.mjs — demo bilan bir xil) + new-junior/lms/{Dars.jsx, aloqa.js}. Qayta yig'ish: node new-junior/lms/yig.mjs
//  Server: ${process.env.JR_API || 'https://dars-api.coddycamp.uz'} · yig'ma ${sha}
//  Ichida: Blockly 13.4.0 — Copyright Google LLC, Apache License 2.0 (https://www.apache.org/licenses/LICENSE-2.0)
// ============================================================
` + chiq
const NOM = CHIQISH + 'junior-' + DARS_P + '.jsx'
writeFileSync(NOM, chiq)
rmSync(GEN, { force: true })
console.log('✔ ' + NOM.replace(L + '../../', '') + ' — ' + (chiq.length / 1024).toFixed(0) + ' KB, react importi: ' + reactImport.length + ', server: ' + (process.env.JR_API || 'prod'))

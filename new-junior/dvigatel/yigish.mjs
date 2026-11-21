// Bitta yig'uvchi — ikki chiqish (dvigatel 2d, 19.11). Demo (dvigatel/yig.mjs → public/demo.html) va LMS (lms/yig.mjs → chiqish/*.jsx)
// uchala bo'lakni shu yerdan oladi — bir xil fayllardan, hech narsa kesilmaydi va matn qidirib almashtirilmaydi:
//   chizuvchi(dars)  — ekranlarni chizadigan kod (bosh → dars e'loni → qismlar → dars qismlari → dars ekranlari → dars qadamlari → malumot). Demo uni Node'da yuritib natijani
//                      demo.html ga yozadi; LMS esa kodning o'zini brauzerga qo'yadi (3,6 MB tayyor SVG o'rniga). Tartib muhim: SVG ichki raqamlari
//                      chizilish tartibiga bog'liq — ikkala chiqishda bir xil.
//   skript({ demo }) — brauzer skripti: tovush + blockly + ijrochi + sahna + studiya, demo bo'lsa aloqa-demo (aloqa va KIRISH), keyin qobiq.
//                      LMS'da KIRISH va aloqani lms/yig.mjs beradi (Dars.jsx dan: rol, ism, kalit; aloqa — lms/aloqa.js).
//   uslub()          — dars uslubi (shablon.html dagi <style>, HARAKAT va MAKET bilan), qobiq uslubi (qobiq.css) va shrift havolasi.
import { readFileSync } from 'node:fs'

const DV = new URL('.', import.meta.url).pathname // .../new-junior/dvigatel/
const oqi = (f) => readFileSync(f, 'utf8')
const izohsiz = (s) => s.replace(/^(\/\/[^\n]*\n)+/, '').replace(/\n$/, '') // tepadagi // izoh qatorlari va oxirgi bo'sh qator

export const darsPapka = (dars) => DV + '../darslar/' + dars + '/'

export function chizuvchi(dars = '001-tanishuv') {
  const DP = darsPapka(dars)
  // 3a: dars e'loni (DARS) bosh.mjs dan keyin — faqat ma'lumot, chizmaydi (SVG ichki raqamlari o'zgarmaydi); keyingi fayllar undan foydalana oladi
  // 3c: darsning o'z ekran bo'laklari (DP qismlar.mjs) — umumiy qismlardan keyin; ular ham faqat chaqirilganda chiziladi
  // 5a: katak.js (labirint chizmasi, faqat satr) — chizuvchida ham, brauzer skriptida ham bitta fayl; hech narsa chizmaydi, tartibga ta'sir qilmaydi
  return [DV + 'bosh.mjs', DP + 'dars.mjs', DV + 'qismlar.mjs', DV + 'katak.js', DP + 'qismlar.mjs', DP + 'ekranlar.mjs', DP + 'qadamlar.mjs', DV + 'malumot.mjs'].map(oqi).join('\n')
}

export function skript({ demo }) {
  // 4b: ijrochi.js (dastur daraxti va bajarish), 4c: sahna.js (sahna qolipi) — blockly.js dan keyin, studiya.js dan oldin
  const q = [oqi(DV + 'tovush.js') + '\n' + oqi(DV + 'blockly.js') + '\n' + oqi(DV + 'ijrochi.js') + '\n' + oqi(DV + 'katak.js') + '\n' + oqi(DV + 'sahna.js') + '\n' + oqi(DV + 'studiya.js')]
  if (demo) q.push(izohsiz(oqi(DV + 'aloqa-demo.js')))
  q.push(izohsiz(oqi(DV + 'qobiq.js')))
  return q.join('\n')
}

export function uslub(dars = '001-tanishuv') {
  // harakat.css — qahramonlar harakati (izohsiz); maket.css — ekran setkasi (birinchi 101 qator). Avval bosh.mjs da edi.
  const HARAKAT = oqi(DV + '../src/chizma/harakat.css').replace(/\/\*[\s\S]*?\*\//g, '')
  const MAKET = oqi(DV + 'maket.css').split('\n').slice(0, 101).join('\n')
  const shrift = (s) => s.replaceAll('"Source Serif 4",Georgia,serif', 'var(--f-sar)').replaceAll('"Source Serif 4",serif', 'var(--f-sar)').replaceAll('"Manrope",sans-serif', 'var(--f-matn)')
  const t = shrift(oqi(DV + 'shablon.html').replace('{{HARAKAT}}', HARAKAT).replace('{{MAKET}}', MAKET))
  const a = t.indexOf('<style>'), b = t.indexOf('</style>')
  // 3e: darsning ekranlarga xos uslubi (darslar/<dars>/uslub.css) — «dars» qismi dars uslubi oxiriga, «qobiq» qismi qobiq uslubi oxiriga
  const du = shrift(oqi(darsPapka(dars) + 'uslub.css')), dI = du.indexOf('/* == dars == */\n'), qI = du.indexOf('/* == qobiq == */\n')
  if (dI < 0 || qI < dI) throw new Error(dars + '/uslub.css: «== dars ==» va «== qobiq ==» bo\'limlari kerak')
  const darsQism = du.slice(dI + 17, qI), qobiqQism = du.slice(qI + 18)
  const DARS_CSS = t.slice(a + 7, b) + darsQism, QOBIQ_CSS = oqi(DV + 'qobiq.css') + qobiqQism
  const SHRIFT = t.match(/<link rel="stylesheet" href="https:\/\/fonts[^>]+>/)[0]
  if (a < 0 || b < a || /\{\{/.test(DARS_CSS)) throw new Error('shablon.html: uslub topilmadi yoki {{…}} qoldi')
  for (const [n, c] of [['dars', DARS_CSS], ['qobiq', QOBIQ_CSS]]) if (c.includes('`')) throw new Error(n + ' uslubida backtik') // CSS izohiga backtik yozilmaydi (loyiha qoidasi)
  return { DARS_CSS, QOBIQ_CSS, SHRIFT }
}

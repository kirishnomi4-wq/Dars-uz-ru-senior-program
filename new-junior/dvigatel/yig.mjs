// Demo sahifasini yig'adi → new-junior/public/demo.html
// Ishlatish (loyiha ildizidan): node new-junior/dvigatel/yig.mjs [dars-papkasi]   (standart: 001-tanishuv)
// Bo'laklar — yigish.mjs dan (LMS ham o'shalardan: lms/yig.mjs). Chizuvchi bitta skript bo'lib ulanadi — tartib muhim (SVG ichki raqamlari):
//   bosh.mjs → qismlar.mjs → darslar/<dars>/ekranlar.mjs (E) → darslar/<dars>/qadamlar.mjs (QADAM, VARAQ) → malumot.mjs → sahifa.mjs (qolip, yozadi)
// 19.11: 1a (etalon/ dan ko'chdi), 1b (demo.mjs, ekranlar.mjs bo'lindi) — demo.html baytma-bayt o'zgarmagan.
// 2b: etalon sahifasi chizilmaydi (farq faqat SVG ichki raqamlarida). 2d: bitta yig'uvchi — yigish.mjs.
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { chizuvchi } from './yigish.mjs'
const D = new URL('.', import.meta.url).pathname
const DARS = process.argv[2] || '001-tanishuv'
writeFileSync(D + '.yigma-demo.mjs', chizuvchi(DARS) + '\n' + readFileSync(D + 'sahifa.mjs', 'utf8'))
execFileSync(process.execPath, [D + '.yigma-demo.mjs', DARS], { stdio: 'inherit' })

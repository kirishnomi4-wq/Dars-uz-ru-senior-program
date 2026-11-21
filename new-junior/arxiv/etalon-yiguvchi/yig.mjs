// Etalon sahifasini yig'adi: bosh.mjs (yordamchilar) + ekranlar.mjs (ekranlar) → bitta skript → etalon.html
// Ishlatish (loyiha ildizidan): node new-junior/etalon/yig.mjs            → new-junior/etalon/etalon.html
//                               node new-junior/etalon/yig.mjs <chiqish.html>
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const D = new URL('.', import.meta.url).pathname
writeFileSync(D + '.yigma.mjs', readFileSync(D + 'bosh.mjs', 'utf8') + '\n' + readFileSync(D + 'ekranlar.mjs', 'utf8'))
execFileSync(process.execPath, [D + '.yigma.mjs', ...process.argv.slice(2)], { stdio: 'inherit' })

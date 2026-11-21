// Tepalik rasmlari: bosh.mjs + ekranlar.mjs + tepalik-rasmlar.mjs → new-junior/arxiv/tepalik-rasmlar-2026-11-16.html
// Ishlatish (loyiha ildizidan): node new-junior/etalon/reja-yig.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const D = new URL('.', import.meta.url).pathname
writeFileSync(D + '.yigma-tepalik.mjs', ['bosh.mjs', 'ekranlar.mjs', 'tepalik-rasmlar.mjs'].map((f) => readFileSync(D + f, 'utf8')).join('\n'))
execFileSync(process.execPath, [D + '.yigma-tepalik.mjs'], { stdio: 'inherit' })

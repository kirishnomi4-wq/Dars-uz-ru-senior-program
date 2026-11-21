// Reja ekrani to'rt ko'rinishi: bosh.mjs + ekranlar.mjs + reja-variantlar.mjs → new-junior/arxiv/reja-variantlar-2026-11-16.html
// Ishlatish (loyiha ildizidan): node new-junior/etalon/reja-yig.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const D = new URL('.', import.meta.url).pathname
writeFileSync(D + '.yigma-reja.mjs', ['bosh.mjs', 'ekranlar.mjs', 'reja-variantlar.mjs'].map((f) => readFileSync(D + f, 'utf8')).join('\n'))
execFileSync(process.execPath, [D + '.yigma-reja.mjs'], { stdio: 'inherit' })

// LMS yig'masi: ustoz + 3 bola (alohida brauzer oynalari) va CRM ko'rigi (visitMode: preview) — hammasi CRM sahifasi uslubi bilan (&crm=1). 18.11.
// Talab — lms-toliq.mjs dagi kabi (stek 3101/3998, vite 5340, yig'ma JR_API=http://127.0.0.1:3101).
//   node new-junior/lms/sinov/lms-sinf.mjs [suratlar-papkasi]
import { readFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const ILDIZ = '/home/kali/Desktop/internetLesson', U = 'http://localhost:5340/lms/sinov/index.html', SUR = process.argv[2] || ''
if (SUR) mkdirSync(SUR, { recursive: true })
const env = Object.fromEntries(readFileSync(ILDIZ + '/server/.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]))
const B = env.DATABASE_URL.replace(':5433/', ':5432/').replace(/\/dars_dev$/, '/dars_test')
execFileSync('psql', [B, '-qAtc', "set search_path=junior_sinov; do $$ declare t text; begin for t in select tablename from pg_tables where schemaname = 'junior_sinov' and tablename not in ('lesson_catalog', 'app_config', 'schema_migrations', 'lesson_lms_map') loop execute 'truncate ' || quote_ident(t) || ' cascade'; end loop; end $$"], { stdio: 'ignore' })
const tok = (...a) => execFileSync(process.execPath, ['--env-file=.env', 'tools/mint-token.mjs', ...a], { cwd: ILDIZ + '/server', encoding: 'utf8' }).trim().split('\n').pop()

const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }), xato = []
let ok = 0, jami = 0
const tek = (nom, shart) => { jami++; if (shart) ok++; console.log((shart ? '✓ ' : '✗ ') + nom) }
const oyna = async (n, w, h) => { const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); p.on('pageerror', (e) => xato.push(n + ': ' + e.message)); p.on('console', (m) => m.type() === 'error' && xato.push(n + ' konsol: ' + m.text())); return p }
const matn = (p, s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
const sur = async (p, nom) => { if (SUR) await p.screenshot({ path: SUR + '/' + nom + '.png' }) }

// CRM ko'rigi: token yo'q → ikkala oyna yonma-yon, tarmoqqa chiqmaydi
const k = await oyna('korik', 1600, 900)
const sorovlar = []; k.on('request', (r) => { if (/3101|dars-api/.test(r.url())) sorovlar.push(r.url()) })
await k.goto(U + '?preview=1&crm=1'); await k.waitForSelector('#ust .ekran', { timeout: 15000 }); await k.waitForTimeout(1200)
tek('K1 · ko‘rik: ustoz va o‘quvchi oynasi yonma-yon', (await k.$$('.yonma #ust .ekran')).length === 1 && (await k.$$('.yonma #bol .ekran')).length === 1)
tek('K2 · ko‘rik serverga so‘rov yubormaydi', sorovlar.length === 0)
await sur(k, '0-korik')
await k.context().close()

// sinf: ustoz + 3 bola
const u = await oyna('ustoz', 1600, 900)
await u.goto(U + '?crm=1&t=' + tok('--role', 'mentor', '--sub', '145', '--name', 'Test Ustoz', '--gid', '861')); await u.waitForSelector('#ust .ekran', { timeout: 15000 })
const ismlar = ['Ali Valiyev', 'Lola Karimova', 'Bekzod Soliyev'], bolalar = []
for (let i = 0; i < 3; i++) {
  const o = await oyna('bola' + (i + 1), 1440, 810)
  await o.goto(U + '?crm=1&t=' + tok('--role', 'student', '--sub', String(34174 + i), '--name', ismlar[i], '--crm', String(17226 + i)))
  bolalar.push(o)
}
for (const o of bolalar) await o.waitForSelector('#bol .ekran', { timeout: 15000 })
await u.waitForTimeout(3500)
// CRM sahifasi uslubi bilan (&crm=1): dars o'z qobig'ida — o'rtada, o'z foni (18.11)
const joy = (p, sel) => p.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(), q = document.getElementById('ilova'); return { yuqori: Math.round(r.top), past: Math.round(innerHeight - r.bottom), fon: getComputedStyle(q).backgroundColor } }, sel)
const ju = await joy(u, '#ust .sahna-q'), jb = await joy(bolalar[0], '#bol .sahna-q')
tek('Q1 · ustoz oynasi CRM sahifasida o‘rtada, fon qaymoq (' + JSON.stringify(ju) + ')', Math.abs(ju.yuqori - ju.past) <= 2 && ju.fon === 'rgb(246, 244, 239)')
tek('Q2 · bola oynasi CRM sahifasida o‘rtada, fon qaymoq (' + JSON.stringify(jb) + ')', Math.abs(jb.yuqori - jb.past) <= 2 && jb.fon === 'rgb(246, 244, 239)')
tek('S1 · ustozda «Kirdi: 3»', (await matn(u, '#ust .hn .hint')) === 'Kirdi: 3')
await sur(u, '1-ustoz-kirish'); await sur(bolalar[1], '1-bola2-kirish')
// qadamga ergashish
for (const o of bolalar) await o.click('#bol .asos').catch(() => {})
await u.selectOption('select[data-a=sakra]', '8'); await u.waitForTimeout(2500)
const idlar = await Promise.all(bolalar.map((o) => o.$eval('#bol .ekran', (e) => e.dataset.id)))
tek('S2 · uchala bola qahramon tanlash ekranida (BQ): ' + idlar.join(' '), idlar.every((x) => x === 'BQ'))
for (let i = 0; i < 3; i++) { await bolalar[i].click('#bol .tq-o >> nth=' + i); await bolalar[i].waitForTimeout(200) }
await u.waitForTimeout(3500)
tek('S3 · ustozda «Tanladi: 3 / 3»', (await matn(u, '#ust .hn .hint')) === 'Tanladi: 3 / 3')
tek('S4 · taxtada 3 ta haqiqiy qahramon', (await u.$$('#ust .taxta .tx-o:not(.bosh):not(.tx-u)')).length === 3)
await sur(u, '2-ustoz-taxta'); await sur(bolalar[2], '2-bola3')
// bitta bola sahifani yangilasa — sinfda qoladi, qayta sanalmaydi
await bolalar[0].reload(); await bolalar[0].waitForSelector('#bol .ekran', { timeout: 15000 }); await u.waitForTimeout(3500)
tek('S5 · bola sahifani yangiladi → yana darsda, ustozda hanuz «Tanladi: 3 / 3»', (await matn(u, '#ust .hn .hint')) === 'Tanladi: 3 / 3')
const ism2 = await bolalar[1].evaluate(() => Object.keys(localStorage).filter((x) => x.endsWith(':ism')).map((x) => localStorage.getItem(x)))
tek('S6 · bolaning ismi LMS’dan, faqat ism: ' + ism2.join(','), ism2.length === 1 && ism2[0] === 'Lola')
console.log(`\nNATIJA: ${ok} / ${jami}`); console.log('XATO:', xato.length ? xato : 'yo‘q'); await b.close()

// LMS solo sinovi (18.11, qaror 4A/5A): demo solo sinovi (sinov/demo/solo.mjs — o'sha bandlar) LMS orqali + LMS'ning o'zi:
// «Dars hali boshlanmadi» → «Ustozni kutaman» / «O'zim o'taman» · kutayotgan bola ustoz kirgach sinfga o'tadi ·
// solo urinish oxirgi ekranda tugatiladi (24/25), «yulduz» yutug'i · natija soxta LMS'ga (mode: solo) · qayta kirsa — «Bu dars tugagan».
// Talab — lms-toliq.mjs dagi kabi (stek 3101/3998, vite 5340, yig'ma JR_API=http://127.0.0.1:3101). node new-junior/lms/sinov/lms-solo.mjs
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const ILDIZ = '/home/kali/Desktop/internetLesson'
const env = Object.fromEntries(readFileSync(ILDIZ + '/server/.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]))
const B = env.DATABASE_URL.replace(':5433/', ':5432/').replace(/\/dars_dev$/, '/dars_test')
execFileSync('psql', [B, '-qAtc', "set search_path=junior_sinov; do $$ declare t text; begin for t in select tablename from pg_tables where schemaname = 'junior_sinov' and tablename not in ('lesson_catalog', 'app_config', 'schema_migrations', 'lesson_lms_map') loop execute 'truncate ' || quote_ident(t) || ' cascade'; end loop; end $$"], { stdio: 'ignore' })
const tok = (...a) => execFileSync(process.execPath, ['--env-file=.env', 'tools/mint-token.mjs', ...a], { cwd: ILDIZ + '/server', encoding: 'utf8' }).trim().split('\n').pop()
const SOLO = tok('--role', 'student', '--sub', '34174', '--name', 'Lola Karimova', '--crm', '17226')
const KUTAR = tok('--role', 'student', '--sub', '34175', '--name', 'Ali Valiyev', '--crm', '17227')
const USTOZ = tok('--role', 'mentor', '--sub', '145', '--name', 'Test Ustoz', '--gid', '861')

let s = readFileSync(ILDIZ + '/new-junior/sinov/demo/solo.mjs', 'utf8')
const almash = (eski, yangi) => { if (s.split(eski).length !== 2) { console.error('langar: ' + eski.slice(0, 60)); process.exit(1) } s = s.replace(eski, () => yangi) }
almash("await p.goto(U); await p.evaluate(() => localStorage.clear()); await p.reload()\nif (await p.$('#ei')) { await p.fill('#ei', 'Lola'); await p.click('#ef button') }\nawait kut(1200)",
  `await p.goto('http://localhost:5340/lms/sinov/index.html?crm=1&t=${SOLO}'); await kut(3000)
tek('L1 · ustoz yo‘q → «Dars hali boshlanmadi», ikki tugma', (await matn('.eshik h1')) === 'Dars hali boshlanmadi' && (await matn('.eshik button')) === 'Ustozni kutaman' && (await matn('.eshik .jr-ikkinchi')) === 'O‘zim o‘taman')
// ikkinchi bola — kutadi; ustoz kirgach sinfga o'zi o'tadi
const k2 = await (await b.newContext({ viewport: { width: 1200, height: 700 } })).newPage(); k2.on('pageerror', (e) => xato.push('kutar: ' + e.message))
await k2.goto('http://localhost:5340/lms/sinov/index.html?crm=1&t=${KUTAR}'); await k2.waitForTimeout(3000)
await k2.click('.eshik button:not(.jr-ikkinchi)'); await k2.waitForTimeout(300)
tek('L2 · «Ustozni kutaman» → «Ustozni kutyapmiz»', (await k2.$eval('.eshik h1', (e) => e.textContent)) === 'Ustozni kutyapmiz')
await p.click('.eshik .jr-ikkinchi'); await kut(1500)
tek('L3 · «O‘zim o‘taman» → dars ochildi, ism LMS’dan', (await id()) === 'B0' && (await matn('#bol .ekran')).includes('Lola'))`)
almash("// yangilansa — o'sha joydan\nawait p.reload(); await kut(1500)\ntek('sahifa yangilandi → yana B5 (qolgan joyidan)', (await id()) === 'B5')",
  `await kut(2500)
const { readFileSync: oqi } = await import('node:fs')
const PG = await import('${ILDIZ}/server/node_modules/pg/esm/index.mjs')
const db = new PG.default.Pool({ connectionString: '${B}', options: '-c search_path=junior_sinov' })
const q = async (sql) => (await db.query(sql)).rows
const [at] = await q("select a.id, a.kind, a.status, a.reached_end, sp.screen, sp.total from attempts a left join student_progress sp on sp.attempt_id = a.id where a.subject_id = 34174 and a.lesson_id = 'junior-001-tanishuv-v1' order by a.started_at desc limit 1")
tek('L4 · solo urinish tugatildi (' + (at && [at.kind, at.status, at.screen + '/' + at.total].join(' ')) + ')', !!at && at.kind === 'solo' && at.reached_end === true && at.screen === 24 && at.total === 25)
const ach = at ? (await q("select achievement_id from achievement_events where attempt_id = '" + at.id + "'")).map((r) => r.achievement_id).join(',') : ''
tek('L5 · «yulduz» yutug‘i yozildi → ' + ach, ach.includes('yulduz'))
// ustoz kirishidan OLDIN: tugatgan bola qayta kirsa — «Bu dars tugagan» (jonli dars boshlangach server uni jonli darsga kiritadi — bu to'g'ri)
await p.reload(); await kut(3000)
tek('L8 · tugatgan bola qayta kirsa — «Bu dars tugagan»', (await matn('.eshik h1')) === 'Bu dars tugagan')
// kutayotgan bola: ustoz kiradi — sinfga o'zi o'tadi
const u = await (await b.newContext({ viewport: { width: 1600, height: 900 } })).newPage()
await u.goto('http://localhost:5340/lms/sinov/index.html?crm=1&t=${USTOZ}'); await u.waitForSelector('#ust .ekran', { timeout: 15000 })
await k2.waitForSelector('#bol .ekran', { timeout: 20000 }).catch(() => {})
tek('L6 · kutgan bola ustoz kirgach sinfga o‘zi o‘tdi', (await k2.$$('#bol .ekran')).length === 1)
let nat = []
for (let i = 0; i < 10 && !nat.length; i++) { await kut(1500); nat = await (await fetch('http://127.0.0.1:3998/_debug/results', { headers: { Authorization: 'Bearer ${env.CODDYCAMP_RESULTS_API_TOKEN}' } })).json().then((j) => (Array.isArray(j) ? j : []).map((r) => r.payload).filter((x) => x && x.lesson_id === 'junior-001-tanishuv-v1' && x.mode === 'solo')).catch(() => []) }
const st = nat.length ? nat[nat.length - 1].students[0] : null
tek('L7 · solo natija soxta LMS’ga yetdi: bola ' + (st && st.student_id) + ', completed=' + (st && st.completed), !!st && st.student_id === 34174 && st.completed === true)
await db.end()`)
const F = ILDIZ + '/new-junior/lms/sinov/.lms-solo.gen.mjs'
writeFileSync(F, s)
try { execFileSync(process.execPath, [F], { stdio: 'inherit' }) } finally { rmSync(F, { force: true }) }

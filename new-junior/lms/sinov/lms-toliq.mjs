// LMS yig'masining to'liq sinovi (18.11): demo sinovidagi 35 band (sinov/demo/toliq-dars.mjs — o'sha bandlar, o'zgarishsiz)
// + LMS'ning o'zi: bola ustozdan oldin kirsa kutadi · ustoz kirgach o'zi ochiladi · ism LMS'dan · natija (oxirgi qadam),
// yutuqlar (yulduz, sahna) · «Darsni yakunlash» sessiyani yopadi · natija LMS'ga (soxta) yetib boradi.
// Talab: lokal stek (server 3101 + soxta LMS 3998, baza dars_test/junior_sinov), vite 5340, yig'ma JR_API=http://127.0.0.1:3101.
//   node new-junior/lms/sinov/lms-toliq.mjs
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const ILDIZ = '/home/kali/Desktop/internetLesson'
const tok = (...a) => execFileSync(process.execPath, ['--env-file=.env', 'tools/mint-token.mjs', ...a], { cwd: ILDIZ + '/server', encoding: 'utf8' }).trim().split('\n').pop()
// sinov bo'limini tozalash (faqat junior_sinov: dars ro'yxati va sozlama qoladi) — har yurish yangi sinf, yangi urinish
{
  const env = Object.fromEntries(readFileSync(ILDIZ + '/server/.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]))
  const B = env.DATABASE_URL.replace(':5433/', ':5432/').replace(/\/dars_dev$/, '/dars_test')
  execFileSync('psql', [B, '-qAtc', "set search_path=junior_sinov; do $$ declare t text; begin for t in select tablename from pg_tables where schemaname = 'junior_sinov' and tablename not in ('lesson_catalog', 'app_config', 'schema_migrations', 'lesson_lms_map') loop execute 'truncate ' || quote_ident(t) || ' cascade'; end loop; end $$"], { stdio: ['ignore', 'ignore', 'ignore'] })
}
const USTOZ = tok('--role', 'mentor', '--sub', '145', '--name', 'Test Ustoz', '--gid', '861')
const BOLA = tok('--role', 'student', '--sub', '34174', '--name', 'Sinov Testov', '--crm', '17226')

let s = readFileSync(ILDIZ + '/new-junior/sinov/demo/toliq-dars.mjs', 'utf8')
const almash = (eski, yangi) => { if (s.split(eski).length !== 2) { console.error('langar: ' + eski.slice(0, 60)); process.exit(1) } s = s.replace(eski, () => yangi) }
almash("const U = 'http://localhost:5340/demo.html', X = 'sinov4-' + Date.now()", "const U = 'http://localhost:5340/lms/sinov/index.html'")
// LMS orqali aloqa so'rov bilan (bola ~0,9 s, ustoz ~1,5 s) — kutishlar uzaytiriladi
almash('const kut = (ms) => u.waitForTimeout(ms)', 'const kut = (ms) => u.waitForTimeout(Math.round(ms * 1.3) + 1600)')
almash("await u.goto(`${U}?rol=ustoz&yangi=1&xona=${X}`); await o.goto(`${U}?rol=bola&xona=${X}`)\nawait o.evaluate(() => localStorage.clear()); await o.reload()\nawait o.fill('#ei', 'Sinov'); await o.click('#ef button'); await kut(1500)",
  `await o.goto(U + '?t=${BOLA}'); await o.waitForTimeout(2500)
tek('L1 · bola ustozdan oldin kirdi → «Dars hali boshlanmadi»', (await matn(o, '.eshik h1')) === 'Dars hali boshlanmadi')
await u.goto(U + '?t=${USTOZ}'); await u.waitForSelector('#ust .ekran', { timeout: 15000 })
await o.waitForSelector('#bol .ekran', { timeout: 15000 }).catch(() => {}); await kut(1500)
tek('L2 · ustoz kirgach bola darsga o‘zi kirdi (eshik yo‘q, ism so‘ralmadi)', (await o.$$('#bol .ekran')).length === 1 && (await o.$$('#ei')).length === 0)
tek('L3 · ism LMS’dan: «Sinov»', (await matn(o, '#bol .ekran')).includes('Sinov') || (await o.evaluate(() => Object.keys(localStorage).some((k) => k.endsWith(':ism') && localStorage.getItem(k) === 'Sinov'))))`)
almash("console.log(`\\nNATIJA: ${ok} / ${jami}`)", `await kut(2500)
const { readFileSync } = await import('node:fs')
const PG = await import('${ILDIZ}/server/node_modules/pg/esm/index.mjs')
const env = Object.fromEntries(readFileSync('${ILDIZ}/server/.env', 'utf8').split('\\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]))
const db = new PG.default.Pool({ connectionString: env.DATABASE_URL.replace(':5433/', ':5432/').replace(/\\/dars_dev$/, '/dars_test'), options: '-c search_path=junior_sinov' })
const q = async (sql) => (await db.query(sql)).rows
const [at] = await q("select a.id, a.reached_end, a.kind, sp.screen, sp.total from attempts a left join student_progress sp on sp.attempt_id = a.id where a.lesson_id = 'junior-001-tanishuv-v1' and a.kind <> 'solo' order by a.started_at desc limit 1")
tek('L4 · urinish: jonli, oxirgi qadamga yetdi (' + (at && at.screen) + ' / ' + (at && at.total) + ')', !!at && at.reached_end === true && at.screen === 24 && at.total === 25)
const ach = at ? (await q("select achievement_id from achievement_events where attempt_id = '" + at.id + "' order by 1")).map((r) => r.achievement_id).join(',') : ''
tek('L5 · yutuqlar: sahna, yulduz → ' + ach, ach === 'sahna,yulduz')
const [ses] = await q("select ls.status, s.end_reason from live_sessions ls join lms_sessions s on s.pin = ls.pin where ls.lesson_id = 'junior-001-tanishuv-v1' order by ls.created_at desc limit 1")
tek('L6 · «Darsni yakunlash» → sessiya yopildi (' + (ses && ses.status) + ', ' + (ses && ses.end_reason) + ')', !!ses && ses.status === 'ended' && ses.end_reason === 'mentor')
const [xb] = await q("select count(*)::int as n, count(distinct kim)::int as k from junior_xabarlar where pin = (select pin from live_sessions where lesson_id = 'junior-001-tanishuv-v1' order by created_at desc limit 1)")
tek('L7 · sinf xabarlari serverda: ' + xb.n + ' ta, ' + xb.k + ' ta yuboruvchi (ustoz + bola)', xb.n > 20 && xb.k === 2)
let nat = []
for (let i = 0; i < 10 && !nat.length; i++) { await o.waitForTimeout(1500); nat = await (await fetch('http://127.0.0.1:3998/_debug/results', { headers: { Authorization: 'Bearer ' + env.CODDYCAMP_RESULTS_API_TOKEN } })).json().then((j) => (Array.isArray(j) ? j : [])).catch(() => []) }
const bu = nat.map((r) => r.payload).filter((p) => p && p.lesson_id === 'junior-001-tanishuv-v1')
const st = bu.length ? bu[bu.length - 1].students[0] : null
tek('L8 · natija soxta LMS’ga yetdi: bola 34174, completed=' + (st && st.completed) + ', ' + (st && st.duration_sec) + ' s', !!st && st.student_id === 34174 && st.completed === true)
await db.end()
console.log(\`\\nNATIJA: \${ok} / \${jami}\`)`)
const F = ILDIZ + '/new-junior/lms/sinov/.lms-toliq.gen.mjs'
writeFileSync(F, s)
try { execFileSync(process.execPath, [F], { stdio: 'inherit' }) } finally { rmSync(F, { force: true }) }

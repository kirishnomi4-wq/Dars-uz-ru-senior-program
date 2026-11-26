// LMS yig'masining har dars uchun sinovi (26.11) — 1-modulning 23 darsi LMS orqali: ko'rik, kirish, solo, ustoz bilan butun dars, yakun, natija.
// Talab — lms-toliq.mjs dagi kabi (stek 3101/3998, baza dars_test/junior_sinov — 23 dars katalogda, vite 5340, yig'ma JR_API=http://127.0.0.1:3101).
//   node new-junior/lms/sinov/lms-har-dars.mjs <dars-papkasi> [<dars-papkasi> …]   (bo'sh — darslar/ dagi hammasi)
// Har qadamda bola ekrani CRM ko'rigidagi (aloqasiz, yonma-yon — o'sha qobiq mantig'i) bola ekrani bilan solishtiriladi.
import { readFileSync, readdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const ILDIZ = '/home/kali/Desktop/internetLesson', U = 'http://localhost:5340/lms/sinov/index.html'
const env = Object.fromEntries(readFileSync(ILDIZ + '/server/.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]))
const B = env.DATABASE_URL.replace(':5433/', ':5432/').replace(/\/dars_dev$/, '/dars_test')
const tok = (...a) => execFileSync(process.execPath, ['--env-file=.env', 'tools/mint-token.mjs', ...a], { cwd: ILDIZ + '/server', encoding: 'utf8' }).trim().split('\n').pop()
const PG = await import(ILDIZ + '/server/node_modules/pg/esm/index.mjs')
const db = new PG.default.Pool({ connectionString: B, options: '-c search_path=junior_sinov' })
const q = async (sql, p = []) => (await db.query(sql, p)).rows
const DARSLAR = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(ILDIZ + '/new-junior/darslar').filter((d) => /^\d{3}-/.test(d))
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
let umumOk = 0, umumJami = 0; const yiqildi = []

for (const DP of DARSLAR) {
  const LID = (readFileSync(ILDIZ + '/new-junior/darslar/' + DP + '/dars.mjs', 'utf8').match(/id: '(junior-[^']+)'/) || [])[1]
  let ok = 0, jami = 0; const xato = []
  const tek = (nom, s, iz = '') => { jami++; if (s) ok++; else console.log('✗ ' + DP + ' · ' + nom + (iz ? '  — ' + iz : '')) }
  const oyna = async (n, w = 1440, h = 810) => {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage()
    p.on('pageerror', (e) => xato.push(n + ': ' + e.message))
    p.on('console', (m) => { if (m.type() === 'error' && !/favicon\.ico/.test(JSON.stringify(m.location()))) xato.push(n + ' konsol: ' + m.text()) })
    return p
  }
  const id = (p, s) => p.$eval(s + ' .ekran', (e) => e.dataset.id).catch(() => '')
  const matn = (p, s) => p.$eval(s, (e) => e.textContent.trim()).catch(() => '')
  const qahTanla = async (p) => { if (await p.$('#bol .tq-o')) { await p.click('#bol .tq-o >> nth=0'); await p.waitForTimeout(700) } }
  // sinov bo'limi tozalanadi (dars ro'yxati, sozlama, migratsiya qoladi)
  execFileSync('psql', [B, '-qAtc', "set search_path=junior_sinov; do $$ declare t text; begin for t in select tablename from pg_tables where schemaname = 'junior_sinov' and tablename not in ('lesson_catalog', 'app_config', 'schema_migrations', 'lesson_lms_map') loop execute 'truncate ' || quote_ident(t) || ' cascade'; end loop; end $$"], { stdio: 'ignore' })
  const [kat] = await q('select active, jsonb_array_length(achievements) as y from lesson_catalog where lesson_id = $1', [LID])
  tek('D0 · dars server ro‘yxatida, faol, 2 yutuq (' + LID + ')', !!kat && kat.active && kat.y === 2)

  // 1) CRM ko'rigi: aloqasiz, ikkala oyna; har qadamdagi bola ekrani — andoza
  const k = await oyna('korik', 1600, 900), sorov = []
  k.on('request', (r) => { if (/3101|dars-api/.test(r.url())) sorov.push(r.url()) })
  await k.goto(U + '?preview=1&crm=1&d=' + DP); await k.waitForSelector('#ust .ekran', { timeout: 30000 }); await k.waitForTimeout(800)
  tek('K1 · ko‘rik: ustoz va o‘quvchi oynasi yonma-yon', (await k.$$('.yonma #ust .ekran')).length === 1 && (await k.$$('.yonma #bol .ekran')).length === 1)
  await qahTanla(k)
  const N = await k.$$eval('select[data-a=sakra] option', (o) => o.length)
  const andoza = []
  for (let i = 0; i < N; i++) { await k.selectOption('select[data-a=sakra]', String(i)); await k.waitForTimeout(250); andoza.push(await id(k, '#bol')) }
  tek('K2 · ko‘rik serverga so‘rov yubormaydi', sorov.length === 0, sorov[0])
  tek('K3 · ko‘rikda bola ekranlari bor (' + new Set(andoza).size + ' xil)', andoza.every(Boolean) && new Set(andoza).size >= 3, andoza.join(' '))
  await k.context().close()

  // 2) solo: ustoz yo'q — «Dars hali boshlanmadi» → «O‘zim o‘taman» → dars ochiladi
  const s = await oyna('solo')
  await s.goto(U + '?crm=1&d=' + DP + '&t=' + tok('--role', 'student', '--sub', '34175', '--name', 'Ali Valiyev', '--crm', '17227')); await s.waitForSelector('.eshik h1', { timeout: 30000 }); await s.waitForTimeout(1500)
  tek('S1 · ustoz yo‘q → «Dars hali boshlanmadi», «O‘zim o‘taman»', (await matn(s, '.eshik h1')) === 'Dars hali boshlanmadi' && (await matn(s, '.eshik .jr-ikkinchi')) === 'O‘zim o‘taman')
  await s.click('.eshik .jr-ikkinchi'); await s.waitForSelector('#bol .ekran, #ust .ekran', { timeout: 15000 }).catch(() => {}); await s.waitForTimeout(1500)
  tek('S2 · solo ochildi, ism LMS’dan', ((await s.$$('#bol .ekran, #ust .ekran')).length === 1) && (await s.evaluate(() => Object.keys(localStorage).some((x) => x.endsWith(':ism') && localStorage.getItem(x) === 'Ali'))))
  const [sa] = await q("select kind from attempts where subject_id = 34175 and lesson_id = $1 order by started_at desc limit 1", [LID])
  tek('S3 · solo urinish serverda', !!sa && sa.kind === 'solo', JSON.stringify(sa))
  await s.context().close()

  // 3) jonli: bola ustozdan oldin kiradi, ustoz kirgach o'zi ochiladi; ustoz darsni boshidan oxirigacha yuradi
  const o = await oyna('bola')
  await o.goto(U + '?crm=1&d=' + DP + '&t=' + tok('--role', 'student', '--sub', '34174', '--name', 'Sinov Testov', '--crm', '17226')); await o.waitForSelector('.eshik h1', { timeout: 30000 }); await o.waitForTimeout(1500)
  tek('L1 · bola ustozdan oldin → «Dars hali boshlanmadi»', (await matn(o, '.eshik h1')) === 'Dars hali boshlanmadi')
  const u = await oyna('ustoz', 1600, 900)
  await u.goto(U + '?crm=1&d=' + DP + '&t=' + tok('--role', 'mentor', '--sub', '145', '--name', 'Test Ustoz', '--gid', '861')); await u.waitForSelector('#ust .ekran', { timeout: 30000 })
  await o.waitForSelector('#bol .ekran', { timeout: 20000 }).catch(() => {}); await o.waitForTimeout(1200)
  tek('L2 · ustoz kirgach bola darsga o‘zi kirdi (ism so‘ralmadi)', (await o.$$('#bol .ekran')).length === 1 && (await o.$$('#ei')).length === 0)
  tek('L3 · ism LMS’dan: «Sinov»', await o.evaluate(() => Object.keys(localStorage).some((x) => x.endsWith(':ism') && localStorage.getItem(x) === 'Sinov')))
  tek('L4 · ustozda qadamlar soni ko‘rikdagidek (' + N + ')', (await u.$$eval('select[data-a=sakra] option', (x) => x.length)) === N)
  await qahTanla(o)
  const farq = []
  for (let i = 1; i < N; i++) {
    await u.selectOption('select[data-a=sakra]', String(i))
    const kut = andoza[i]
    await o.waitForFunction((k) => (document.querySelector('#bol .ekran') || {}).dataset?.id === k, kut, { timeout: 8000 }).catch(() => {})
    const bor = await id(o, '#bol'); if (bor !== kut) farq.push((i + 1) + ': ' + bor + ' ≠ ' + kut)
  }
  tek('L5 · ustoz ' + N + ' qadamni yurdi — har qadamda bola ekrani ko‘rikdagidek', farq.length === 0, farq.slice(0, 4).join(' · '))
  await o.waitForTimeout(2500)
  await u.click('#ust .hn .asos'); await u.waitForTimeout(2500)
  tek('L6 · «Darsni yakunlash» — ustozda «Dars tugadi»', (await u.$$('#ust .tugadi-k')).length === 1)
  const [at] = await q("select a.reached_end, sp.screen, sp.total from attempts a left join student_progress sp on sp.attempt_id = a.id where a.subject_id = 34174 and a.lesson_id = $1 and a.kind <> 'solo' order by a.started_at desc limit 1", [LID])
  tek('L7 · bola urinishi oxirgi qadamga yetdi (' + (at && at.screen + ' / ' + at.total) + ')', !!at && at.reached_end === true && at.screen === N - 1 && at.total === N)
  let ses = null
  for (let i = 0; i < 8 && !(ses && ses.status === 'ended'); i++) { [ses] = await q("select ls.status, s.end_reason from live_sessions ls join lms_sessions s on s.pin = ls.pin where ls.lesson_id = $1 order by ls.created_at desc limit 1", [LID]); if (!(ses && ses.status === 'ended')) await u.waitForTimeout(1000) }
  tek('L8 · sessiya yopildi (' + (ses && ses.status + ', ' + ses.end_reason) + ')', !!ses && ses.status === 'ended' && ses.end_reason === 'mentor')
  let st = null
  for (let i = 0; i < 12 && !st; i++) {
    await u.waitForTimeout(1500)
    const nat = await (await fetch('http://127.0.0.1:3998/_debug/results', { headers: { Authorization: 'Bearer ' + env.CODDYCAMP_RESULTS_API_TOKEN } })).json().then((j) => (Array.isArray(j) ? j : [])).catch(() => [])
    const bu = nat.map((r) => r.payload).filter((p) => p && p.lesson_id === LID && p.mode !== 'solo')
    st = bu.length ? (bu[bu.length - 1].students || []).find((x) => x.student_id === 34174) : null
  }
  tek('L9 · natija soxta LMS’ga yetdi: bola 34174, completed=' + (st && st.completed), !!st && st.completed === true)
  tek('X · sahifa va konsol xatosi yo‘q', xato.length === 0, xato.slice(0, 3).join(' | '))
  await u.context().close(); await o.context().close()
  console.log((ok === jami ? '✓ ' : '✗ ') + DP + ' — ' + ok + ' / ' + jami + ' (' + N + ' qadam)')
  umumOk += ok; umumJami += jami; if (ok !== jami) yiqildi.push(DP)
}
console.log('\nNATIJA: ' + umumOk + ' / ' + umumJami + (yiqildi.length ? ' · yiqildi: ' + yiqildi.join(', ') : ' · ' + DARSLAR.length + ' dars toza'))
await db.end(); await b.close()

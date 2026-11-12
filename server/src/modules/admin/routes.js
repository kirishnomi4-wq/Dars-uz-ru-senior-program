// Admin — kuzatuv (basic auth, ADMIN_USER/ADMIN_PASSWORD). O'chiq bo'lsa 404 (yo'l borligi ham bilinmaydi).
//   GET  /admin                       — kichik HTML sahifa (overview'ni chizadi)
//   GET  /admin/api/overview          — faol sessiyalar, navbat statuslari, oxirgi hodisalar/xatolar
//   GET  /admin/api/results?status=&schema=1|2&processing=&event_type= — hodisalar ro'yxati (payload'siz), 100 tagacha (S6: v2 filtrlari)
//   GET  /admin/api/results/:id       — bitta hodisa (payload + javob)
//   POST /admin/api/results/:id/requeue — manual_review/retry_wait → pending
//   POST /admin/api/results/rebuild    — F-1106-01: manual_review hodisalarni manbadan YANGI kod bilan qayta yig'ish
//        body { event_ids: [..1-100], dry: true (sukut — faqat ko'rsatadi), suffix?: 'r1', include_payload?: false }
//        S6: v2 id (lr_/ap_/ar_) — o'sha id bilan qayta yig'iladi (suffix qo'llanmaydi), processed_at saqlanadi
//   GET  /admin/api/sessions?status=live|ended&limit= — LMS sessiyalari (dars, guruh, mentor, o'quvchi soni, ekran, natija) — sinov-dalili
//   GET  /admin/api/sessions/:id      — bitta sessiya: ishtirokchilar (rol, subject_id, javoblar soni, oxirigacha yetdimi), natija-hodisa
// Shaxsiy ma'lumot: ismlar ko'rsatilmaydi, faqat sonlar va ID'lar.
import { timingSafeEqual } from 'node:crypto';
import { notFound } from '../../lib/errors.js';

function safeEq(a, b) {
  const x = Buffer.from(String(a)); const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function adminRoutes(app) {
  const { config } = app;
  if (!config.adminEnabled) return;

  app.addHook('onRequest', async (req, reply) => {
    const h = req.headers.authorization || '';
    let ok = false;
    if (h.startsWith('Basic ')) {
      const [u, ...rest] = Buffer.from(h.slice(6), 'base64').toString('utf8').split(':');
      ok = safeEq(u, config.adminUser) && safeEq(rest.join(':'), config.adminPassword);
    }
    if (!ok) {
      reply.header('www-authenticate', 'Basic realm="dars-api admin", charset="UTF-8"');
      reply.code(401).send({ error: 'unauthorized', message: 'Admin kirishi kerak.' });
    }
  });

  app.get('/api/overview', { config: { rateLimit: false } }, async () => {
    const [sessions, queue, recent, errors] = await Promise.all([
      app.db.query(`select count(*) filter (where mode = 'live') as live, count(*) filter (where mode = 'solo') as solo from lms_sessions where status = 'live'`),
      app.db.query(`select status, count(*)::int as n from result_events group by status`),
      app.db.query(`select event_id, mode, schema_version, event_type, status, processing_status, students_count, send_attempts, last_http_status, updated_at from result_events order by updated_at desc limit 20`),
      app.db.query(`select event_id, status, processing_status, last_http_status, last_error, updated_at from result_events where status in ('manual_review', 'retry_wait') or processing_status in ('failed', 'review') order by updated_at desc limit 20`),
    ]);
    // S6 (25 §7): v2 qo'llash holati (School API ichida) — yetkazilgan v2 hodisalar bo'yicha
    const v2 = await app.db.query(`select coalesce(processing_status, 'none') as p, count(*)::int as n from result_events where schema_version = 2 group by 1`);
    const players = await app.db.query(`select count(*)::int as n from live_players lp join live_sessions ls on ls.pin = lp.pin where ls.status = 'live'`);
    return {
      version: app.appVersion,
      env: config.env,
      now: new Date().toISOString(),
      active_sessions: { live: Number(sessions.rows[0].live), solo: Number(sessions.rows[0].solo), players_online: players.rows[0].n },
      queue: Object.fromEntries(queue.rows.map((r) => [r.status, r.n])),
      v2_processing: Object.fromEntries(v2.rows.map((r) => [r.p, r.n])),
      recent: recent.rows,
      attention: errors.rows,
    };
  });

  app.get('/api/results', {
    config: { rateLimit: false },
    schema: { querystring: { type: 'object', additionalProperties: false, properties: {
      status: { type: 'string', enum: ['pending', 'retry_wait', 'delivered', 'manual_review', 'skipped'] },
      schema: { type: 'string', enum: ['1', '2'] }, // S6: v1 guruh/solo yoki v2 (lr_/ap_/ar_)
      processing: { type: 'string', enum: ['queued', 'applied', 'failed', 'review'] },
      event_type: { type: 'string', enum: ['lesson_result', 'arena_participation', 'arena_result'] },
    } } },
  }, async (req) => {
    const { status = null, schema = null, processing = null, event_type: eventType = null } = req.query;
    const { rows } = await app.db.query(
      `select event_id, mode, schema_version, event_type, student_id::text as student_id, lesson_id, status, processing_status, processing_next_at, processing_checked_at,
              students_count, send_attempts, next_try_at, last_http_status, last_request_id, last_error, occurred_at, delivered_at, created_at, updated_at
         from result_events
        where ($1::text is null or status = $1) and ($2::int is null or schema_version = $2) and ($3::text is null or processing_status = $3) and ($4::text is null or event_type = $4)
        order by updated_at desc limit 100`,
      [status, schema === null ? null : Number(schema), processing, eventType],
    );
    return rows;
  });

  app.get('/api/results/:id', { config: { rateLimit: false } }, async (req) => {
    const { rows } = await app.db.query('select * from result_events where event_id = $1', [req.params.id]);
    if (!rows[0]) throw notFound('Hodisa topilmadi.');
    return rows[0];
  });

  // LMS §13-20: yuborilgan hodisani School API tomonida tasdiqlash (GET lesson-results/{event_id}, natija-token bilan, serverdan)
  app.get('/api/results/:id/verify', { config: { rateLimit: false } }, async (req) => {
    const { rows } = await app.db.query('select event_id, status, last_http_status from result_events where event_id = $1', [req.params.id]);
    if (!rows[0]) throw notFound('Hodisa topilmadi.');
    if (!app.schoolApi) return { event_id: rows[0].event_id, local: rows[0], remote: null, note: "LMS-ko'prik o'chiq" };
    const r = await app.schoolApi.getLessonResult(rows[0].event_id);
    req.log.info({ eventId: rows[0].event_id, status: r.status, requestId: r.requestId }, 'admin: School API tekshiruvi');
    return { event_id: rows[0].event_id, local: rows[0], remote: { status: r.status, found: r.status === 200, data: r.status === 200 ? r.body?.data ?? null : null, message: r.status !== 200 ? r.body?.message ?? null : null } };
  });

  app.post('/api/results/:id/requeue', { config: { rateLimit: false } }, async (req) => {
    const ok = await app.results.requeue(req.params.id);
    if (!ok) throw notFound('Hodisa topilmadi yoki allaqachon yetkazilgan.');
    req.log.info({ eventId: req.params.id }, 'admin: natija qayta navbatga');
    setTimeout(() => app.results.runOnce().catch(() => {}), 50);
    return { ok: true };
  });

  // F-1106-01: requeue eski payload'ni yuboradi (yana 422). Bu yerda hodisa manbadan qayta yig'iladi; eski holat
  // result_event_revisions'ga ko'chadi. dry sukut bo'yicha true — haqiqiy almashtirish faqat `"dry": false` bilan.
  app.post('/api/results/rebuild', {
    config: { rateLimit: false },
    schema: { body: { type: 'object', additionalProperties: false, required: ['event_ids'], properties: {
      event_ids: { type: 'array', minItems: 1, maxItems: 100, uniqueItems: true, items: { type: 'string', minLength: 1, maxLength: 128, pattern: '^[A-Za-z0-9][A-Za-z0-9._:@-]*$' } },
      dry: { type: 'boolean', default: true },
      suffix: { type: 'string', pattern: '^r[1-9][0-9]?$' },
      include_payload: { type: 'boolean', default: false },
    } } },
  }, async (req) => {
    if (!app.results?.rebuild) throw notFound("LMS-ko'prik o'chiq — natija-navbat yo'q.");
    const { event_ids: ids, dry, suffix = null, include_payload: withPayload } = req.body;
    const results = await app.results.rebuild(ids, { dry, suffix });
    const count = (a) => results.filter((r) => r.action === a).length;
    req.log.info({ dry, suffix, n: ids.length, send: count('send'), skip: count('skip'), error: count('error') }, 'admin: natija qayta yig\'ish');
    return {
      dry, suffix,
      totals: { events: results.length, send: count('send'), skip: count('skip'), error: count('error'),
        students: results.reduce((n, r) => n + (r.students_after || 0), 0), correct_changes: results.reduce((n, r) => n + (r.correct_changes?.length || 0), 0) },
      results: results.map(({ payload, ...r }) => (withPayload && dry ? { ...r, payload } : r)),
    };
  });

  // ---- Sessiyalar (LMS §13 sinov-dalili: kim ochdi, kim qo'shildi, natija ketdimi) — ismlar YO'Q
  app.get('/api/sessions', {
    config: { rateLimit: false },
    schema: { querystring: { type: 'object', additionalProperties: false, properties: {
      status: { type: 'string', enum: ['live', 'ended'] }, limit: { type: 'string', pattern: '^[1-9][0-9]{0,2}$' } } } },
  }, async (req) => {
    const { status } = req.query;
    const limit = Math.min(200, Number(req.query.limit) || 50); // querystring satr keladi (coerce yo'q) — o'zimiz o'giramiz
    const { rows } = await app.db.query(
      `select s.id, s.pin, s.mode, s.lesson_id, lc.title_uz, s.gid::int as gid, s.teacher_id::int as teacher_id, s.status, s.end_reason, s.started_at, s.finished_at,
              ls.cur_screen, ls.max_screen, ls.status as live_status, ls.updated_at as live_updated_at,
              (select count(*)::int from lms_participants p where p.session_id = s.id and p.role = 'student') as students,
              (select count(*)::int from live_players lp where lp.pin = s.pin) as players,
              (select count(*)::int from live_answers a where a.pin = s.pin and a.screen_idx < 100) as answers,
              (select string_agg(r.status, ',') from result_events r where r.session_id = s.id) as result_status
         from lms_sessions s
         join live_sessions ls on ls.pin = s.pin
         left join lesson_catalog lc on lc.lesson_id = s.lesson_id
        where ($1::text is null or s.status = $1)
        order by s.started_at desc limit $2`,
      [status ?? null, limit],
    );
    return rows;
  });

  app.get('/api/sessions/:id', {
    config: { rateLimit: false },
    schema: { params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] } },
  }, async (req) => {
    const { rows } = await app.db.query(
      `select s.id, s.pin, s.mode, s.lesson_id, s.lesson_version, s.gid::int as gid, s.teacher_id::int as teacher_id, s.status, s.end_reason, s.started_at, s.finished_at,
              lc.title_uz, ls.cur_screen, ls.max_screen, ls.status as live_status, ls.quiz_state, ls.updated_at as live_updated_at,
              ls.quiz_first_q_at as arena_started_at, ls.quiz_done_at as arena_finished_at, ls.quiz_end_reason as arena_end_reason, ls.quiz_max_q + 1 as arena_questions_shown
         from lms_sessions s join live_sessions ls on ls.pin = s.pin left join lesson_catalog lc on lc.lesson_id = s.lesson_id
        where s.id = $1`, [req.params.id]);
    const session = rows[0];
    if (!session) throw notFound('Sessiya topilmadi');
    const { rows: participants } = await app.db.query(
      `select p.role, p.subject_id::int as subject_id, p.crm_id::int as crm_id, p.joined_at, p.attempt_id, a.status as attempt_status, a.finish_reason, a.reached_end,
              (select count(*)::int from live_answers x where x.player_id = p.player_id and x.screen_idx < 100) as answers,
              (select count(*)::int from live_answers x where x.player_id = p.player_id and x.screen_idx < 100 and x.correct) as correct,
              (select count(*)::int from answer_attempts t where t.player_id = p.player_id) as attempts,
              (select count(*)::int from achievement_events e where e.attempt_id = p.attempt_id) as achievements,
              a.lesson_version, a.version_source,
              (select count(*)::int from screen_views v where v.attempt_id = p.attempt_id) as screen_views,
              (select count(*)::int from screen_views v where v.attempt_id = p.attempt_id and v.by_student) as screen_views_by_student,
              (select count(*)::int from practice_attempts pa where pa.attempt_id = p.attempt_id) as practice_attempts,
              (select ap.source from arena_participants ap where ap.pin = s.pin and ap.player_id = p.player_id) as arena_participation
         from lms_participants p left join attempts a on a.id = p.attempt_id join lms_sessions s on s.id = p.session_id
        where p.session_id = $1 order by p.role desc, p.joined_at`, [req.params.id]);
    const { rows: events } = await app.db.query(
      `select event_id, schema_version, event_type, student_id::text as student_id, status, processing_status, students_count, send_attempts, last_http_status, last_error, delivered_at, updated_at
         from result_events where session_id = $1 order by created_at`, [req.params.id]);
    const { rows: [{ pin_players }] } = await app.db.query('select count(*)::int as pin_players from live_players where pin = $1', [session.pin]);
    return { session, participants, pin_players, results: events };
  });

  // ---- S9 (Shahzoda 04 §1.2): doimiy savol kaliti + reviziya — reliz skripti (scripts/savol-kalitlari.mjs) yuklaydi.
  //   PUT /admin/api/question-keys  { rows: [{ lesson_key, lesson_version, question_id, question_key, revision, kind, order_no?, text_uz?, text_ru? }] } — upsert, 1–500 qator
  //   GET /admin/api/question-keys?lesson_key=&lesson_version=
  const QK_ROW = { type: 'object', additionalProperties: false, required: ['lesson_key', 'lesson_version', 'question_id', 'question_key', 'revision', 'kind'], properties: {
    lesson_key: { type: 'string', minLength: 1, maxLength: 96, pattern: '^[a-z0-9][a-z0-9-]*$' },
    lesson_version: { type: 'string', minLength: 1, maxLength: 32 },
    question_id: { type: 'string', minLength: 1, maxLength: 64 },
    question_key: { type: 'string', minLength: 3, maxLength: 170 },
    revision: { type: 'string', pattern: '^[0-9a-f]{12}$' },
    kind: { type: 'string', enum: ['test', 'arena', 'practice'] },
    order_no: { type: ['integer', 'null'], minimum: 1, maximum: 999 },
    text_uz: { type: ['string', 'null'], maxLength: 600 },
    text_ru: { type: ['string', 'null'], maxLength: 600 },
  } };
  app.put('/api/question-keys', {
    bodyLimit: 1024 * 1024,
    config: { rateLimit: false },
    schema: { body: { type: 'object', additionalProperties: false, required: ['rows'], properties: { rows: { type: 'array', minItems: 1, maxItems: 500, items: QK_ROW } } } },
  }, async (req, reply) => {
    const bad = req.body.rows.filter((r) => r.question_key !== `${r.lesson_key}:${r.question_id}`).map((r) => r.question_key);
    if (bad.length) return reply.code(400).send({ error: 'validation_failed', message: 'question_key = lesson_key:question_id bo\'lishi kerak', details: bad.slice(0, 10) });
    const { rows: [{ n }] } = await app.db.query(
      `with x as (select * from jsonb_to_recordset($1::jsonb) as t(lesson_key text, lesson_version text, question_id text, question_key text, revision text, kind text, order_no int, text_uz text, text_ru text)),
            up as (insert into question_keys (lesson_key, lesson_version, question_id, question_key, revision, kind, order_no, text_uz, text_ru)
                   select lesson_key, lesson_version, question_id, question_key, revision, kind, order_no, text_uz, text_ru from x
                   on conflict (lesson_key, lesson_version, question_id) do update set question_key = excluded.question_key, revision = excluded.revision,
                     kind = excluded.kind, order_no = excluded.order_no, text_uz = excluded.text_uz, text_ru = excluded.text_ru, updated_at = now()
                   returning 1)
       select count(*)::int as n from up`,
      [JSON.stringify(req.body.rows)],
    );
    req.log.info({ rows: n }, 'admin: savol kalitlari yuklandi');
    return { upserted: n };
  });
  app.get('/api/question-keys', {
    config: { rateLimit: false },
    schema: { querystring: { type: 'object', additionalProperties: false, properties: { lesson_key: { type: 'string', maxLength: 96 }, lesson_version: { type: 'string', maxLength: 32 } } } },
  }, async (req) => {
    const { rows } = await app.db.query(
      `select lesson_key, lesson_version, question_id, question_key, revision, kind, order_no, text_uz, text_ru, updated_at from question_keys
        where ($1::text is null or lesson_key = $1) and ($2::text is null or lesson_version = $2) order by lesson_key, lesson_version, kind desc, order_no limit 2000`,
      [req.query.lesson_key ?? null, req.query.lesson_version ?? null],
    );
    return rows;
  });

  // F-1112-01 (0018): dars × til → LMS qatori, Class, Learn testi (scripts/lms-xarita.mjs to'ldiradi; reestrdan, relizda yangilanadi)
  //   PUT /admin/api/lesson-map  { rows: [{ lesson_key, lang, lms_question_id, class_id?, learn_id?, lesson_version?, uploaded_on? }] } — upsert
  //   GET /admin/api/lesson-map?lesson_key=
  const LM_ROW = { type: 'object', additionalProperties: false, required: ['lesson_key', 'lang', 'lms_question_id'], properties: {
    lesson_key: { type: 'string', minLength: 1, maxLength: 96, pattern: '^[a-z0-9][a-z0-9-]*$' },
    lang: { type: 'string', enum: ['uz', 'ru'] },
    lms_question_id: { type: 'integer', minimum: 1 },
    class_id: { type: ['integer', 'null'], minimum: 1 },
    learn_id: { type: ['integer', 'null'], minimum: 1 },
    lesson_version: { type: ['string', 'null'], maxLength: 32 },
    uploaded_on: { type: ['string', 'null'], pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
  } };
  app.put('/api/lesson-map', {
    bodyLimit: 1024 * 1024,
    config: { rateLimit: false },
    schema: { body: { type: 'object', additionalProperties: false, required: ['rows'], properties: { rows: { type: 'array', minItems: 1, maxItems: 1000, items: LM_ROW } } } },
  }, async (req) => {
    const { rows: [{ n }] } = await app.db.query(
      `with x as (select * from jsonb_to_recordset($1::jsonb) as t(lesson_key text, lang text, lms_question_id bigint, class_id bigint, learn_id bigint, lesson_version text, uploaded_on date)),
            up as (insert into lesson_lms_map (lesson_key, lang, lms_question_id, class_id, learn_id, lesson_version, uploaded_on)
                   select lesson_key, lang, lms_question_id, class_id, learn_id, lesson_version, uploaded_on from x
                   on conflict (lesson_key, lang) do update set lms_question_id = excluded.lms_question_id, class_id = excluded.class_id,
                     learn_id = excluded.learn_id, lesson_version = excluded.lesson_version, uploaded_on = excluded.uploaded_on, updated_at = now()
                   returning 1)
       select count(*)::int as n from up`,
      [JSON.stringify(req.body.rows)],
    );
    req.log.info({ rows: n }, 'admin: dars → LMS xaritasi yuklandi');
    return { upserted: n };
  });
  app.get('/api/lesson-map', {
    config: { rateLimit: false },
    schema: { querystring: { type: 'object', additionalProperties: false, properties: { lesson_key: { type: 'string', maxLength: 96 } } } },
  }, async (req) => {
    const { rows } = await app.db.query(
      `select lesson_key, lang, lms_question_id, class_id, learn_id, lesson_version, uploaded_on::text as uploaded_on, updated_at from lesson_lms_map
        where ($1::text is null or lesson_key = $1) order by lesson_key, lang limit 2000`,
      [req.query.lesson_key ?? null],
    );
    return rows;
  });

  app.get('/', { config: { rateLimit: false } }, async (req, reply) => {
    reply.type('text/html; charset=utf-8');
    return ADMIN_HTML;
  });
}

const ADMIN_HTML = `<!doctype html><html lang="uz"><head><meta charset="utf-8"><title>dars-api · admin</title>
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<style>body{font:14px/1.45 system-ui,sans-serif;margin:0;background:#f6f4ef;color:#0e0e10}main{max-width:1100px;margin:0 auto;padding:20px}
h1{font-size:18px;margin:0 0 12px}h2{font-size:14px;margin:18px 0 6px;color:#5a5a60;text-transform:uppercase;letter-spacing:.06em}
.cards{display:flex;gap:10px;flex-wrap:wrap}.card{background:#fff;border-radius:12px;padding:12px 16px;min-width:140px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.card b{display:block;font-size:24px}table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden}
th,td{padding:8px 10px;text-align:left;border-bottom:1px solid #eee;font-size:13px}th{background:#faf9f6;color:#5a5a60}
.st-delivered{color:#1f7a4d}.st-manual_review{color:#c0392b;font-weight:700}.st-retry_wait{color:#b7791f}.st-pending{color:#5a5a60}
button{background:#ff4f28;color:#fff;border:0;border-radius:99px;padding:4px 10px;font-weight:700;cursor:pointer}small{color:#a7a6a2}</style></head>
<body><main><h1>dars-api · kuzatuv <small id="meta"></small></h1>
<div class="cards" id="cards"></div>
<h2>Sessiyalar (oxirgi 30)</h2><table><thead><tr><th>vaqt</th><th>rejim</th><th>dars</th><th>guruh</th><th>mentor</th><th>o'quvchi</th><th>javob</th><th>ekran</th><th>holat</th><th>natija</th><th></th></tr></thead><tbody id="ses"></tbody></table>
<pre id="sesd" style="display:none;background:#fff;border-radius:12px;padding:12px;font-size:12px;overflow:auto"></pre>
<h2>E'tibor kerak</h2><table><thead><tr><th>event_id</th><th>status</th><th>HTTP</th><th>xato</th><th>vaqt</th><th></th></tr></thead><tbody id="att"></tbody></table>
<h2>Oxirgi hodisalar</h2><table><thead><tr><th>event_id</th><th>rejim</th><th>status</th><th>o'quvchi</th><th>urinish</th><th>HTTP</th><th>vaqt</th></tr></thead><tbody id="rec"></tbody></table>
<script>
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function load(){const r=await fetch('api/overview');if(!r.ok){document.body.innerHTML='<main>401 — kirish kerak</main>';return}const d=await r.json();
document.getElementById('meta').textContent=d.version+' · '+d.env+' · '+new Date(d.now).toLocaleTimeString();
const q=d.queue||{};document.getElementById('cards').innerHTML=[['Jonli sessiya',d.active_sessions.live],['Solo',d.active_sessions.solo],["Onlayn o'quvchi",d.active_sessions.players_online],['Navbat',(q.pending||0)+(q.retry_wait||0)],['Yetkazildi',q.delivered||0],['manual_review',q.manual_review||0],['v2 qo\\'llanmoqda',(d.v2_processing||{}).queued||0],['v2 qo\\'llandi',(d.v2_processing||{}).applied||0],['v2 failed/review',((d.v2_processing||{}).failed||0)+((d.v2_processing||{}).review||0)]].map(([k,v])=>'<div class="card">'+esc(k)+'<b>'+esc(v)+'</b></div>').join('');
document.getElementById('att').innerHTML=d.attention.map(e=>'<tr><td><code>'+esc(e.event_id)+'</code></td><td class="st-'+esc(e.status)+'">'+esc(e.status)+'</td><td>'+esc(e.last_http_status)+'</td><td>'+esc(e.last_error)+'</td><td>'+new Date(e.updated_at).toLocaleString()+'</td><td><button onclick="requeue(\\''+esc(e.event_id)+'\\')">qayta yubor</button></td></tr>').join('')||'<tr><td colspan="6"><small>hammasi joyida</small></td></tr>';
document.getElementById('rec').innerHTML=d.recent.map(e=>'<tr><td><code>'+esc(e.event_id)+'</code></td><td>'+esc(e.schema_version===2?('v2 '+(e.event_type||'')):e.mode)+'</td><td class="st-'+esc(e.status)+'">'+esc(e.status)+(e.processing_status?' <small>'+esc(e.processing_status)+'</small>':'')+'</td><td>'+esc(e.students_count)+'</td><td>'+esc(e.send_attempts)+'</td><td>'+esc(e.last_http_status)+'</td><td>'+new Date(e.updated_at).toLocaleString()+'</td></tr>').join('')||'<tr><td colspan="7"><small>hali hodisa yo\\'q</small></td></tr>';}
async function requeue(id){await fetch('api/results/'+encodeURIComponent(id)+'/requeue',{method:'POST'});setTimeout(load,800)}
async function loadSessions(){const r=await fetch('api/sessions?limit=30');if(!r.ok)return;const rows=await r.json();
document.getElementById('ses').innerHTML=rows.map(s=>'<tr><td>'+esc(new Date(s.started_at).toLocaleString())+'</td><td>'+esc(s.mode)+'</td><td>'+esc(s.title_uz||s.lesson_id)+' <small>'+esc(s.pin)+'</small></td><td>'+esc(s.gid??'')+'</td><td>'+esc(s.teacher_id??'')+'</td><td>'+esc(s.students)+(s.players>s.students?' <small>(+'+esc(s.players-s.students)+' PIN)</small>':'')+'</td><td>'+esc(s.answers)+'</td><td>'+esc(s.cur_screen??'')+'/'+esc(s.max_screen??'')+'</td><td class="st-'+esc(s.status)+'">'+esc(s.status)+(s.end_reason?' <small>'+esc(s.end_reason)+'</small>':'')+'</td><td>'+esc(s.result_status||'—')+'</td><td><button onclick="detail(&quot;'+esc(s.id)+'&quot;)">batafsil</button></td></tr>').join('')||'<tr><td colspan="11"><small>sessiya yo‘q</small></td></tr>';}
async function detail(id){const r=await fetch('api/sessions/'+id);const d=await r.json();const el=document.getElementById('sesd');el.style.display='block';el.textContent=JSON.stringify(d,null,2);el.scrollIntoView({behavior:'smooth'})}
load();loadSessions();setInterval(()=>{load();loadSessions()},10000);
</script></main></body></html>`;

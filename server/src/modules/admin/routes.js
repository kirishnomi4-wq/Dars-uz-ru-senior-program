// Admin — kuzatuv (basic auth, ADMIN_USER/ADMIN_PASSWORD). O'chiq bo'lsa 404 (yo'l borligi ham bilinmaydi).
//   GET  /admin                       — kichik HTML sahifa (overview'ni chizadi)
//   GET  /admin/api/overview          — faol sessiyalar, navbat statuslari, oxirgi hodisalar/xatolar
//   GET  /admin/api/results?status=   — hodisalar ro'yxati (payload'siz), 100 tagacha
//   GET  /admin/api/results/:id       — bitta hodisa (payload + javob)
//   POST /admin/api/results/:id/requeue — manual_review/retry_wait → pending
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
      app.db.query(`select event_id, mode, status, students_count, send_attempts, last_http_status, updated_at from result_events order by updated_at desc limit 20`),
      app.db.query(`select event_id, status, last_http_status, last_error, updated_at from result_events where status in ('manual_review', 'retry_wait') order by updated_at desc limit 20`),
    ]);
    const players = await app.db.query(`select count(*)::int as n from live_players lp join live_sessions ls on ls.pin = lp.pin where ls.status = 'live'`);
    return {
      version: app.appVersion,
      env: config.env,
      now: new Date().toISOString(),
      active_sessions: { live: Number(sessions.rows[0].live), solo: Number(sessions.rows[0].solo), players_online: players.rows[0].n },
      queue: Object.fromEntries(queue.rows.map((r) => [r.status, r.n])),
      recent: recent.rows,
      attention: errors.rows,
    };
  });

  app.get('/api/results', {
    config: { rateLimit: false },
    schema: { querystring: { type: 'object', additionalProperties: false, properties: { status: { type: 'string', enum: ['pending', 'retry_wait', 'delivered', 'manual_review'] } } } },
  }, async (req) => {
    const { status } = req.query;
    const { rows } = await app.db.query(
      `select event_id, mode, lesson_id, status, students_count, send_attempts, next_try_at, last_http_status, last_request_id, last_error, delivered_at, created_at, updated_at
         from result_events ${status ? 'where status = $1' : ''} order by updated_at desc limit 100`,
      status ? [status] : [],
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
<h2>E'tibor kerak</h2><table><thead><tr><th>event_id</th><th>status</th><th>HTTP</th><th>xato</th><th>vaqt</th><th></th></tr></thead><tbody id="att"></tbody></table>
<h2>Oxirgi hodisalar</h2><table><thead><tr><th>event_id</th><th>rejim</th><th>status</th><th>o'quvchi</th><th>urinish</th><th>HTTP</th><th>vaqt</th></tr></thead><tbody id="rec"></tbody></table>
<script>
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function load(){const r=await fetch('api/overview');if(!r.ok){document.body.innerHTML='<main>401 — kirish kerak</main>';return}const d=await r.json();
document.getElementById('meta').textContent=d.version+' · '+d.env+' · '+new Date(d.now).toLocaleTimeString();
const q=d.queue||{};document.getElementById('cards').innerHTML=[['Jonli sessiya',d.active_sessions.live],['Solo',d.active_sessions.solo],["Onlayn o'quvchi",d.active_sessions.players_online],['Navbat',(q.pending||0)+(q.retry_wait||0)],['Yetkazildi',q.delivered||0],['manual_review',q.manual_review||0]].map(([k,v])=>'<div class="card">'+esc(k)+'<b>'+esc(v)+'</b></div>').join('');
document.getElementById('att').innerHTML=d.attention.map(e=>'<tr><td><code>'+esc(e.event_id)+'</code></td><td class="st-'+esc(e.status)+'">'+esc(e.status)+'</td><td>'+esc(e.last_http_status)+'</td><td>'+esc(e.last_error)+'</td><td>'+new Date(e.updated_at).toLocaleString()+'</td><td><button onclick="requeue(\\''+esc(e.event_id)+'\\')">qayta yubor</button></td></tr>').join('')||'<tr><td colspan="6"><small>hammasi joyida</small></td></tr>';
document.getElementById('rec').innerHTML=d.recent.map(e=>'<tr><td><code>'+esc(e.event_id)+'</code></td><td>'+esc(e.mode)+'</td><td class="st-'+esc(e.status)+'">'+esc(e.status)+'</td><td>'+esc(e.students_count)+'</td><td>'+esc(e.send_attempts)+'</td><td>'+esc(e.last_http_status)+'</td><td>'+new Date(e.updated_at).toLocaleString()+'</td></tr>').join('')||'<tr><td colspan="7"><small>hali hodisa yo\\'q</small></td></tr>';}
async function requeue(id){await fetch('api/results/'+encodeURIComponent(id)+'/requeue',{method:'POST'});setTimeout(load,800)}
load();setInterval(load,10000);
</script></main></body></html>`;

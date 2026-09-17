#!/usr/bin/env node
// fake-school-api — Coddy Camp School API o'rnida LOKAL sinov uchun (dev/E2E). Prod kodida soxta yo'l yo'q:
// dev .env da CODDYCAMP_SCHOOL_API_URL=http://127.0.0.1:3999 qilinadi, xolos.
//   node tools/fake-school-api.mjs            (port 3999)
//   FAKE_GROUPS='{"34174":[861]}' node tools/fake-school-api.mjs
// Endpointlar:
//   GET  /api/v1/lms/students/:id/integration-context  → guruhlar (FAKE_GROUPS), noma'lum → 404
//   POST /api/v1/integrations/dars-platform/lesson-results → 201 (yoki 200 duplicate) — 4-bosqich uchun
import { createServer } from 'node:http';

const PORT = Number(process.env.FAKE_PORT || 3999);
const GROUPS = JSON.parse(process.env.FAKE_GROUPS || '{"34174":[861],"34175":[861],"34176":[862],"34177":[861,862],"34178":[]}');
const seenEvents = new Map(); // event_id → payload (idempotentlik)

const json = (res, status, body) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); };

const server = createServer(async (req, res) => {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer sapi_')) return json(res, 401, { message: 'Unauthenticated' });
  const url = new URL(req.url, 'http://x');

  let m = /^\/api\/v1\/lms\/students\/(\d+)\/integration-context$/.exec(url.pathname);
  if (req.method === 'GET' && m) {
    // 900000+ — sinov uchun «toza tarixli» o'quvchilar: LMS'da bor, guruhsiz (solo yo'li)
    const groups = GROUPS[m[1]] ?? (Number(m[1]) >= 900000 ? [] : undefined);
    if (groups === undefined) return json(res, 404, { message: 'Student not found' });
    const subscriptions = groups.map((gid, i) => ({ id: 900 + i, status: 'active', active: true, group: { id: gid, name: `G-${gid}`, status: 'active' } }));
    console.log(`[fake-school] context ${m[1]} → [${groups.join(',')}]`);
    return json(res, 200, { data: { student: { id: Number(m[1]), active: true }, subscriptions } });
  }

  if (req.method === 'POST' && url.pathname === '/api/v1/integrations/dars-platform/lesson-results') {
    let body = '';
    for await (const chunk of req) body += chunk;
    if (Buffer.byteLength(body, 'utf8') > 1_000_000) return json(res, 413, { message: 'Payload too large (1 MB)' });
    let p; try { p = JSON.parse(body); } catch { return json(res, 422, { message: 'Invalid JSON' }); }
    // F-0917-02: haqiqiy School API (Laravel `required`) bo'sh massivni «yo'q» deb hisoblaydi — soxta API ham AYNAN shunday rad etadi,
    // aks holda bu xato-sinf lokal sinovda hech qachon tutilmaydi (pilotda 1–2 o'quvchi doim top_N olgan, 09-15 gacha sezilmagan).
    const emptyBadges = (Array.isArray(p.students) ? p.students : []).findIndex((s) => !Array.isArray(s?.badges) || !s.badges.length);
    if (emptyBadges >= 0) {
      const msg = `The students.${emptyBadges}.badges field is required.`;
      console.log(`[fake-school] 422 ${p.event_id}: ${msg}`);
      return json(res, 422, { message: msg, errors: { [`students.${emptyBadges}.badges`]: [msg] } });
    }
    const prev = seenEvents.get(p.event_id);
    if (prev && prev !== body) return json(res, 409, { message: 'event_id reused with different payload' });
    seenEvents.set(p.event_id, body);
    const students = Array.isArray(p.students) ? p.students : [];
    const withDetails = students.filter((s) => Array.isArray(s.questions)).length;
    console.log(`[fake-school] result ${p.event_id} (${p.mode}) students=${students.length}${withDetails ? ` details=${withDetails} (q=${students.reduce((n, s) => n + (s.questions?.length || 0), 0)}, ach=${students.reduce((n, s) => n + (s.achievements?.length || 0), 0)})` : ''}${prev ? ' duplicate' : ''}`);
    return json(res, prev ? 200 : 201, { data: {
      event_id: p.event_id, accepted: true, duplicate: !!prev,
      students_received: students.length, students_accepted: students.length, students_rejected: 0, rejected_students: [], reward_status: 'pending_policy',
    } });
  }

  // GET lesson-results/{event_id} — LMS §8/§13-20: faqat shu klient yuborgan hodisa, aks holda 404
  let g = /^\/api\/v1\/integrations\/dars-platform\/lesson-results\/([^/]+)$/.exec(url.pathname);
  if (req.method === 'GET' && g) {
    const id = decodeURIComponent(g[1]);
    const raw = seenEvents.get(id);
    if (!raw) return json(res, 404, { message: 'Not found' });
    const p = JSON.parse(raw);
    return json(res, 200, { data: {
      event_id: id, lesson_id: p.lesson_id, lesson_title: p.lesson_title, mode: p.mode,
      group_id: p.group_id ?? null, teacher_id: p.teacher_id ?? null, started_at: p.started_at, finished_at: p.finished_at,
      total_questions: p.total_questions, received_at: new Date().toISOString(), reward_status: 'pending_policy',
      students_received: p.students.length, students_accepted: p.students.length, students_rejected: 0,
      students: p.students.map((s) => ({ ...s, crm_student_id: null, lms_student_id: s.id_type === 'lms' ? s.student_id : null })), rejected_students: [],
    } });
  }

  // Sinov uchun: qabul qilingan natijalar ro'yxati (haqiqiy School API'da yo'q)
  if (req.method === 'GET' && url.pathname === '/_debug/results') {
    return json(res, 200, [...seenEvents.entries()].map(([id, body]) => ({ event_id: id, payload: JSON.parse(body) })));
  }
  json(res, 404, { message: 'Not found' });
});

server.listen(PORT, '127.0.0.1', () => console.log(`fake-school-api: http://127.0.0.1:${PORT}  guruhlar: ${JSON.stringify(GROUPS)}`));

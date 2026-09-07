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
    let p; try { p = JSON.parse(body); } catch { return json(res, 422, { message: 'Invalid JSON' }); }
    const prev = seenEvents.get(p.event_id);
    if (prev && prev !== body) return json(res, 409, { message: 'event_id reused with different payload' });
    seenEvents.set(p.event_id, body);
    const students = Array.isArray(p.students) ? p.students : [];
    console.log(`[fake-school] result ${p.event_id} (${p.mode}) students=${students.length}${prev ? ' duplicate' : ''}`);
    return json(res, prev ? 200 : 201, { data: {
      event_id: p.event_id, accepted: true, duplicate: !!prev,
      students_received: students.length, students_accepted: students.length, students_rejected: 0, rejected_students: [], reward_status: 'pending_policy',
    } });
  }

  // Sinov uchun: qabul qilingan natijalar ro'yxati (haqiqiy School API'da yo'q)
  if (req.method === 'GET' && url.pathname === '/_debug/results') {
    return json(res, 200, [...seenEvents.entries()].map(([id, body]) => ({ event_id: id, payload: JSON.parse(body) })));
  }
  json(res, 404, { message: 'Not found' });
});

server.listen(PORT, '127.0.0.1', () => console.log(`fake-school-api: http://127.0.0.1:${PORT}  guruhlar: ${JSON.stringify(GROUPS)}`));

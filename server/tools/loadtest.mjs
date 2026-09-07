#!/usr/bin/env node
// loadtest — jonli-API yuklama-sinovi (autocannon). Sinfni simulyatsiya qiladi: N o'quvchi 2,5 s polling +
// javob-portlashlari (arena: hamma bir vaqtda bosadi). Natija: so'rov/s, p50/p95/p99, xato soni.
//   node tools/loadtest.mjs                      (API http://127.0.0.1:3001, 10 guruh × 30 o'quvchi)
//   API=http://127.0.0.1:3001 GROUPS=10 STUDENTS=30 SECONDS=20 node tools/loadtest.mjs
// Server .env: LIVE_MENTOR_CODE kerak (MENTOR_CODE env bilan uzatiladi, default MENTOR-DEV).
import autocannon from 'autocannon';

const API = process.env.API || 'http://127.0.0.1:3001';
const GROUPS = Number(process.env.GROUPS || 10);
const STUDENTS = Number(process.env.STUDENTS || 30);
const SECONDS = Number(process.env.SECONDS || 20);
const MENTOR_CODE = process.env.MENTOR_CODE || 'MENTOR-DEV';
const LESSON = 'internet-01-v18';

const j = (r) => r.json();
const post = (p, body) => fetch(`${API}/api/v1/live/rpc/${p}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

console.log(`API ${API} · ${GROUPS} guruh × ${STUDENTS} o'quvchi · ${SECONDS} s`);
const h = await (await fetch(`${API}/api/v1/health`)).json();
console.log(`health: ${h.status} · ${h.version}`);

// 1) Sessiyalar va o'yinchilar (haqiqiy SQL yo'li bilan)
const sessions = [];
for (let g = 0; g < GROUPS; g++) {
  const r = await post('create_session', { p_lesson_id: LESSON, p_mentor_code: MENTOR_CODE });
  if (!r.ok) { console.error('create_session', r.status, await r.text()); process.exit(1); }
  const s = (await j(r))[0];
  const players = [];
  for (let i = 0; i < STUDENTS; i++) {
    const p = (await j(await post('join_session', { p_pin: s.pin, p_nickname: `O'quvchi ${g}-${i}` })))[0];
    players.push(p);
  }
  sessions.push({ ...s, players });
}
await post('set_quiz_keys', { p_lesson_id: LESSON, p_mentor_code: MENTOR_CODE, p_keys: { s4: 1, s9: 2, 'quiz-0': 0, 'quiz-1': 1 } });
console.log(`tayyor: ${sessions.length} sessiya, ${sessions.length * STUDENTS} o'yinchi`);

function fmt(res) {
  const l = res.latency, r = res.requests;
  return `req/s ${Math.round(r.average)} (jami ${r.total}) · kechikish p50 ${l.p50} ms · p95 ${l.p97_5 ?? l.p95} ms · p99 ${l.p99} ms · max ${l.max} ms · xato ${res.errors} · 2xx ${res['2xx']} · 304 ${res['3xx'] ?? 0} · non2xx ${res.non2xx}`;
}
const run = (opts) => new Promise((resolve, reject) => { autocannon(opts, (err, res) => (err ? reject(err) : resolve(res))); });

// 2) POLLING: har o'quvchi 2,5 s da 1 GET → ulanishlar = o'quvchilar; autocannon maksimal tezlikda uradi,
//    shuning uchun overallRate bilan haqiqiy sur'atga cheklaymiz: N/2.5 so'rov/s
const totalStudents = GROUPS * STUDENTS;
const pollRate = Math.ceil(totalStudents / 2.5);
const pollRequests = sessions.map((s) => ({ method: 'GET', path: `/api/v1/live/session/${s.pin}` }));
console.log(`\n[1] polling — ${totalStudents} o'quvchi, ${pollRate} so'rov/s (haqiqiy sur'at), ${SECONDS} s`);
console.log('    ' + fmt(await run({ url: API, connections: Math.min(totalStudents, 200), duration: SECONDS, overallRate: pollRate, requests: pollRequests })));

// 3) POLLING maksimal — chegarani bilish uchun (sur'atsiz)
console.log(`\n[2] polling MAKSIMAL — 100 ulanish, cheklovsiz, 10 s (server chegarasi)`);
console.log('    ' + fmt(await run({ url: API, connections: 100, duration: 10, requests: pollRequests })));

// 4) JAVOB-PORTLASH: hamma o'quvchi 3 s ichida arena-savoliga javob beradi (har biri 1 marta → keyingilari false)
const answerReqs = [];
for (const s of sessions) for (const p of s.players) {
  answerReqs.push({ method: 'POST', path: '/api/v1/live/rpc/submit_answer', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ p_pin: s.pin, p_player_id: p.player_id, p_token: p.token, p_screen: 100, p_question_id: 'quiz-0', p_picked: 0, p_correct: false, p_elapsed_ms: 1200 }) });
}
console.log(`\n[3] javob-portlash — ${answerReqs.length} javob, 100 parallel ulanish, ${answerReqs.length} ta so'rov`);
console.log('    ' + fmt(await run({ url: API, connections: 100, amount: answerReqs.length, requests: answerReqs })));

// 5) ARALASH: polling + mentor o'qishlari (players/answers har 6 s) + heartbeat
const mixed = [
  ...pollRequests,
  ...sessions.map((s) => ({ method: 'GET', path: `/api/v1/live/players/${s.pin}` })),
  ...sessions.map((s) => ({ method: 'GET', path: `/api/v1/live/answers/${s.pin}?range=arena` })),
  ...sessions.map((s) => ({ method: 'POST', path: '/api/v1/live/rpc/session_heartbeat', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ p_pin: s.pin, p_token: s.token }) })),
];
console.log(`\n[4] aralash (polling + mentor-statistika + heartbeat) — ${pollRate + GROUPS * 2} so'rov/s, ${SECONDS} s`);
console.log('    ' + fmt(await run({ url: API, connections: 150, duration: SECONDS, overallRate: pollRate + GROUPS * 2, requests: mixed })));

// tozalash: sessiyalarni yopamiz
for (const s of sessions) await post('end_session', { p_pin: s.pin, p_token: s.token });
console.log('\nsessiyalar yopildi');

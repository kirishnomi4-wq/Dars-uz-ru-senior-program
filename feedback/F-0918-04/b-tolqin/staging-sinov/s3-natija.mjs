// S3 natijasi — FAQAT O'QISH (GET): agent-arch bo'yicha eng yangi solo sessiya va natija.
// Ishlatish (server/ ichidan): node --env-file=.env.deploy.staging <bu-fayl> https://staging-dars-api.coddycamp.uz [dan-ISO-vaqt]
const URL0 = process.argv[2]; const SINCE = process.argv[3] || '2026-09-19T00:00:00Z'; const LESSON = 'agent-arch-06-04-v18';
const AUTH = { authorization: 'Basic ' + Buffer.from(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASSWORD}`).toString('base64') };
const get = async (p) => { const r = await fetch(URL0 + p, { headers: AUTH }); if (!r.ok) throw new Error(`${p} → ${r.status}`); return r.json(); };
const ses = (await get('/admin/api/sessions?limit=200')).filter((s) => s.lesson_id === LESSON && s.started_at >= SINCE);
console.log(`sessiyalar (${SINCE} dan): ${ses.length}`);
for (const s of ses) {
  console.log(`\n■ ${s.mode} · ${s.status} · ${s.started_at} · o'quvchi ${s.students} · javob ${s.answers} · natija ${s.result_status || '—'}`);
  const d = await get(`/admin/api/sessions/${s.id}`);
  for (const p of d.participants || []) console.log(`   ${p.role} ${p.subject_id} · urinish ${p.attempt_status || '—'} ${p.finish_reason || ''} · oxiriga yetdi ${p.reached_end} · javoblar ${p.answers}`);
  const ans = d.answers || d.live_answers || [];
  if (ans.length) for (const a of ans) console.log(`   javob: ekran ${a.screen_idx} · ${a.question_id} · tanlov ${a.picked} · ${a.correct ? 'TO\'G\'RI' : 'XATO'}`);
}
const res = (await get('/admin/api/results')).filter((r) => r.lesson_id === LESSON && r.created_at >= SINCE);
for (const r of res) {
  const d = await get(`/admin/api/results/${encodeURIComponent(r.event_id)}`);
  for (const st of d.payload?.students || []) console.log(`\n★ natija ${r.mode} · ${r.status} · o'quvchi ${st.student_id}: ${st.correct_answers}/${st.total_questions} · tugallandi ${st.completed} · nishonlar ${(st.badges || []).join(',') || '—'}`);
}
if (!res.length) console.log('\n★ yangi natija-hodisa hali yo\'q (solo urinish tugashi / sweeper kutilmoqda)');

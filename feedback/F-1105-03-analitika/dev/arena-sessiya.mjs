#!/usr/bin/env node
// F-1112-03 (12.11.2026) — FAQAT O'QISH: berilgan oraliqdagi JONLI sessiyalar arenasi — har o'quvchining arena javoblari
// (savol tartibi, to'g'rimi, vaqt, qachon), arena boshlangan/yopilgan vaqti va sababi, nishonlar, o'rin.
// Manba: admin API (sessiyalar, v1 natija hodisasi — nishonlar) + jonli API /live/players, /live/answers?range=arena (podium manbai).
// Ism faqat «Ism F.» ko'rinishida terminalga chiqadi (fayl/jurnalga yozilmaydi).
//   Ishlatish (foydalanuvchi `!`):
//   cd /home/kali/Desktop/internetLesson/server && node --env-file=.env.deploy.prod ../feedback/F-1105-03-analitika/dev/arena-sessiya.mjs https://dars-api.coddycamp.uz 2026-11-11T13:30:00Z 2026-11-11T15:30:00Z pg-crud
const [BASE0, FROM0, TO0, LESSON] = process.argv.slice(2); // LESSON (ixtiyoriy) — lesson_id qismi, masalan pg-crud
const BASE = (BASE0 || '').replace(/\/+$/, ''); const FROM = new Date(FROM0); const TO = new Date(TO0);
if (!/^https?:\/\//.test(BASE) || Number.isNaN(FROM.getTime()) || Number.isNaN(TO.getTime())) { console.error('Ishlatish: node … arena-sessiya.mjs <https://…> <dan ISO> <gacha ISO>'); process.exit(2); }
const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
if (!ADMIN_USER || !ADMIN_PASSWORD) { console.error('ADMIN_USER / ADMIN_PASSWORD env-faylda yo\'q'); process.exit(2); }
const H = { authorization: 'Basic ' + Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString('base64') };
const get = async (p) => { const r = await fetch(BASE + p, { headers: H }); if (!r.ok) throw new Error(`${p} → HTTP ${r.status}`); return r.json(); };
const hm = (t) => (t ? new Date(t).toISOString().slice(11, 19) + 'Z' : '—');

const all = (await get('/admin/api/sessions?limit=200')).filter((s) => new Date(s.started_at) >= FROM && new Date(s.started_at) <= TO && (!LESSON || String(s.lesson_id).includes(LESSON)));
const list = all.filter((s) => s.mode === 'live');
// Shu oraliqdagi SOLO sessiyalar (jonli darsdan oldin/keyin uyda kirganlar): o'quvchi id, boshlangan vaqt, javoblar soni, urinish holati
for (const s of all.filter((x) => x.mode !== 'live')) {
  const d = await get(`/admin/api/sessions/${s.id}`);
  for (const p of (d.participants || []).filter((x) => x.role === 'student')) console.log(`solo ${s.lesson_id} · ${hm(s.started_at)} → ${hm(s.finished_at)} · o'quvchi ${p.subject_id} · test javoblari ${p.answers} (to'g'ri ${p.correct}) · urinish ${p.attempt_status}/${p.finish_reason || '—'}`);
}
console.log(`jonli sessiyalar ${FROM.toISOString()} … ${TO.toISOString()}: ${list.length}`);
for (const s of list) {
  const d = await get(`/admin/api/sessions/${s.id}`);
  const ss = d.session || {};
  const studs = (d.participants || []).filter((p) => p.role === 'student');
  console.log(`\n== ${s.lesson_id} · boshlandi ${hm(s.started_at)} · o'quvchi ${studs.length} (PIN bilan ${d.pin_players}) · arena: ${hm(ss.arena_started_at)} → ${hm(ss.arena_finished_at)} · ko'rsatilgan savol ${ss.arena_questions ?? '—'} · yopilish ${ss.arena_end_reason || '—'}`);
  // Arena javoblari — jonli API (podium shu manbadan chiziladi): o'yinchilar + javoblar (screen 100+N = N-savol), answered_at tartibida
  const pin = ss.pin || s.pin;
  const pl = await (await fetch(`${BASE}/api/v1/live/players/${pin}`)).json().catch(() => []);
  const aw = await (await fetch(`${BASE}/api/v1/live/answers/${pin}?range=arena`)).json().catch(() => []);
  const nom = (n) => String(n || '').split(/\s+/).map((w, i) => (i ? w.slice(0, 1) + '.' : w)).join(' '); // ism + familiya bosh harfi
  for (const p of Array.isArray(pl) ? pl : []) {
    const my = (Array.isArray(aw) ? aw : []).filter((x) => x.player_id === p.id);
    if (!my.length) continue;
    const ok = my.filter((x) => x.correct).length, tot = my.reduce((t, x) => t + (x.elapsed_ms || 0), 0);
    console.log(`   ${nom(p.nickname).padEnd(18)} arena ${ok}/${my.length} · ${(tot / 1000).toFixed(1)}s · ${my.map((x) => `${x.screen_idx - 100 + 1}:${x.correct ? '✓' : '✗'}${(x.elapsed_ms / 1000).toFixed(1)}`).join(' ')}`);
  }
  // Dars testlari (ball ekranlari, screen < 100) — har o'yinchi: ekran:✓/✗ (podiumdagi nuqtalar shu)
  const lw = await (await fetch(`${BASE}/api/v1/live/answers/${pin}?range=lesson`)).json().catch(() => []);
  for (const p of Array.isArray(pl) ? pl : []) {
    const my = (Array.isArray(lw) ? lw : []).filter((x) => x.player_id === p.id);
    console.log(`   test · ${nom(p.nickname).padEnd(18)} ${my.filter((x) => x.correct).length}/${my.length} · ${my.map((x) => `s${x.screen_idx}:${x.correct ? '✓' : '✗'}`).join(' ')} · kirgan ${hm(p.joined_at)}`);
  }
  for (const p of studs) console.log(`   ishtirokchi ${p.subject_id} · kirgan ${hm(p.joined_at)} · test ${p.answers} (to'g'ri ${p.correct}) · urinish ${p.attempt_status}/${p.finish_reason || '—'}`);
  // Nishonlar — v1 natija hodisasi (student_id bo'yicha; arena_top_N, all_correct, first_try …)
  for (const e of (d.results || []).filter((x) => String(x.event_id || '').startsWith('sess_'))) {
    const ev = await get(`/admin/api/results/${encodeURIComponent(e.event_id)}`);
    const py = typeof ev.payload === 'string' ? JSON.parse(ev.payload) : ev.payload;
    console.log(`   hodisa ${ev.event_id} · ${ev.status}`);
    for (const st of (py && py.students) || []) console.log(`      o'quvchi ${st.student_id} · test ${st.correct_answers}/${st.answered} · rank ${st.rank ?? '—'} · nishonlar [${(st.badges || []).join(', ')}] · yutuqlar ${(st.achievements || []).length}`);
  }
}

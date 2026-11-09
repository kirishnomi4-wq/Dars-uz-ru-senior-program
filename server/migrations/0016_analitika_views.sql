-- 0016_analitika_views — F-1105-03 S10/S11 (2026-11-09): Shahzoda konnektori uchun O'QISH view'lari (26-reja S11, 08 §3/§5).
-- Qoidalar: ism, kontakt, o'quvchi yozgan matn va savol matni YO'Q — faqat id, son, vaqt (UTC, timestamptz). Guruh — jonli sessiya
-- guruhi (uydagi urinishda null: guruh School API kontekstida, bizda saqlanmaydi). Savol kaliti = <dars kodi -vN siz>:<question_id>,
-- reviziya — question_keys (reliz skripti savol-kalitlari.mjs to'ldiradi; bo'lmasa null).
-- Faqat o'qish roli bu migratsiyada YO'Q (prod DB egasi — Kristina): `server/docs/analitika-rol.sql` qo'lda bajariladi.

create or replace view v_attempts_base as
select a.id as attempt_id, a.subject_id as student_id, p.crm_id, a.lesson_id, regexp_replace(a.lesson_id, '-v[0-9]+$', '') as lesson_key,
       a.lesson_version, a.version_source, a.kind as mode, a.session_id, case when s.mode = 'live' then s.gid end as group_id,
       case when s.mode = 'live' then s.teacher_id end as teacher_id, p.player_id, s.pin,
       a.started_at as opened_at, a.status, a.finish_reason, a.finished_at, a.reached_end, a.reached_end_at,
       row_number() over (partition by a.subject_id, a.lesson_id order by a.started_at, a.id) as attempt_no
  from attempts a
  join lms_participants p on p.attempt_id = a.id and p.role = 'student'
  join lms_sessions s on s.id = a.session_id;

create or replace view v_lesson_results as
select b.*,
       sp.screen + 1 as screens_reached, sp.total as screens_total, sp.updated_at as last_progress_at,
       (select count(*)::int from live_answers x where x.pin = b.pin and x.player_id = b.player_id and x.screen_idx < 100) as tests_answered,
       (select count(*)::int from live_answers x where x.pin = b.pin and x.player_id = b.player_id and x.screen_idx < 100 and x.correct) as tests_correct,
       (select count(distinct pa.screen_idx)::int from practice_attempts pa where pa.attempt_id = b.attempt_id) as practice_screens,
       (select count(*)::int from screen_views v where v.attempt_id = b.attempt_id and v.by_student) as screens_by_student,
       exists (select 1 from arena_participants ap where ap.attempt_id = b.attempt_id) as arena_participated,
       r.event_id as lesson_result_event_id, r.status as lesson_result_status, r.processing_status as lesson_result_processing,
       (r.payload->'result'->>'completed')::boolean as lesson_result_completed, r.payload->'result'->>'trigger' as lesson_result_trigger
  from v_attempts_base b
  left join student_progress sp on sp.attempt_id = b.attempt_id
  left join result_events r on r.attempt_id = b.attempt_id and r.schema_version = 2 and r.event_type = 'lesson_result';

create or replace view v_question_attempts as
select b.attempt_id, b.student_id, b.crm_id, b.lesson_id, b.lesson_key, b.lesson_version, b.mode, b.group_id,
       t.question_id, b.lesson_key || ':' || t.question_id as question_key, qk.revision,
       case when t.screen_idx >= 100 then 'arena' else 'test' end as kind,
       t.screen_idx, t.attempt_no, t.picked, t.correct, t.elapsed_ms, t.texts->>'lang' as lang, t.answered_at
  from answer_attempts t
  join v_attempts_base b on b.pin = t.pin and b.player_id = t.player_id
  left join question_keys qk on qk.lesson_key = b.lesson_key and qk.lesson_version = b.lesson_version and qk.question_id = t.question_id
 where t.screen_idx < 500;

create or replace view v_practice as
select b.attempt_id, b.student_id, b.crm_id, b.lesson_id, b.lesson_key, b.lesson_version, b.mode, b.group_id,
       pa.screen_id, b.lesson_key || ':' || pa.screen_id as question_key, pa.screen_idx, pa.attempt_no, pa.checked, pa.correct, pa.at
  from practice_attempts pa
  join v_attempts_base b on b.attempt_id = pa.attempt_id;

-- active_sec_est: ekranda turgan vaqt, 5 daqiqada qirqilgan (haqiqiy faol vaqt o'lchanmaydi — faqat baho, F-1102-02 §5.4)
create or replace view v_screen_views as
select b.attempt_id, b.student_id, b.crm_id, b.lesson_id, b.lesson_key, b.lesson_version, b.mode, b.group_id,
       v.screen_idx, v.screen_id, v.by_student, v.opened_at, v.closed_at,
       least(300, greatest(0, extract(epoch from (coalesce(v.closed_at, sp.updated_at, v.opened_at) - v.opened_at))))::int as active_sec_est
  from screen_views v
  join v_attempts_base b on b.attempt_id = v.attempt_id
  left join student_progress sp on sp.attempt_id = v.attempt_id;

create or replace view v_arena as
select b.attempt_id, b.student_id, b.crm_id, b.lesson_id, b.lesson_key, b.lesson_version, b.session_id, b.group_id, b.teacher_id,
       ls.quiz_first_q_at as arena_started_at, ls.quiz_done_at as arena_finished_at,
       case when ls.quiz_first_q_at is null then 'not_started' else ls.quiz_end_reason end as end_reason,
       greatest(0, ls.quiz_max_q + 1) as questions_shown,
       ap.source as participation_source, ap.first_shown_at,
       (ap.pin is not null or exists (select 1 from live_answers x where x.pin = b.pin and x.player_id = b.player_id and x.screen_idx between 100 and 499)) as participated,
       (select count(*)::int from live_answers x where x.pin = b.pin and x.player_id = b.player_id and x.screen_idx between 100 and 499) as answered,
       (select count(*)::int from live_answers x where x.pin = b.pin and x.player_id = b.player_id and x.screen_idx between 100 and 499 and x.correct) as correct_answers,
       r.event_id as arena_result_event_id, (r.payload->'result'->>'place')::int as place
  from v_attempts_base b
  join live_sessions ls on ls.pin = b.pin
  left join arena_participants ap on ap.pin = b.pin and ap.player_id = b.player_id
  left join result_events r on r.attempt_id = b.attempt_id and r.schema_version = 2 and r.event_type = 'arena_result'
 where b.mode = 'live';

-- To'liq o'rin: HAMMA o'yinchi (PIN bilan kirganlar ham — podium bilan bir xil), to'g'ri ↓, umumiy vaqt ↑; kamida bitta to'g'ri bo'lsa
create or replace view v_arena_full_place as
with st as (
  select x.pin, x.player_id, count(*) filter (where x.correct)::int as correct_answers, count(*)::int as answered,
         sum(x.elapsed_ms)::bigint as total_ms, round(avg(x.elapsed_ms))::int as avg_ms
    from live_answers x where x.screen_idx between 100 and 499 group by x.pin, x.player_id
), rk as (
  select st.*, case when st.correct_answers > 0 then rank() over (partition by st.pin order by st.correct_answers desc, st.total_ms asc) end as full_place,
         count(*) filter (where st.correct_answers > 0) over (partition by st.pin) as ranked_players,
         count(*) over (partition by st.pin) as answering_players
    from st
)
select s.id as session_id, s.lesson_id, regexp_replace(s.lesson_id, '-v[0-9]+$', '') as lesson_key, s.lesson_version, s.gid as group_id,
       p.subject_id as student_id, p.crm_id, (p.player_id is null) as pin_only,
       rk.answered, rk.correct_answers, rk.avg_ms, rk.full_place, rk.ranked_players, rk.answering_players
  from rk
  join lms_sessions s on s.pin = rk.pin and s.mode = 'live'
  left join lms_participants p on p.player_id = rk.player_id and p.role = 'student';

-- Ko'p xato qilingan savollar: kamida 5 o'quvchi xato qilgan (birinchi javob bo'yicha)
create or replace view v_wrong_answers_top as
with first_try as (
  select distinct on (q.attempt_id, q.question_id) q.* from v_question_attempts q order by q.attempt_id, q.question_id, q.attempt_no
)
select lesson_key, lesson_version, question_id, question_key, max(revision) as revision, kind,
       count(distinct student_id)::int as students, count(distinct student_id) filter (where correct = false)::int as wrong_students,
       round(100.0 * count(distinct student_id) filter (where correct = false) / nullif(count(distinct student_id), 0), 1) as wrong_pct,
       mode() within group (order by picked) filter (where correct = false) as top_wrong_option
  from first_try
 group by lesson_key, lesson_version, question_id, question_key, kind
having count(distinct student_id) filter (where correct = false) >= 5;

create or replace view v_sessions as
select s.id as session_id, s.mode, s.lesson_id, regexp_replace(s.lesson_id, '-v[0-9]+$', '') as lesson_key, s.lesson_version,
       s.gid as group_id, s.teacher_id, s.status, s.end_reason, s.started_at, s.finished_at,
       (select count(*)::int from lms_participants p where p.session_id = s.id and p.role = 'student') as students_lms,
       (select count(*)::int from live_players lp where lp.pin = s.pin) as players_total,
       greatest(0, (select count(*)::int from live_players lp where lp.pin = s.pin)
                 - (select count(*)::int from lms_participants p where p.session_id = s.id and p.role = 'student' and p.player_id is not null)) as players_pin_only,
       ls.quiz_first_q_at as arena_started_at, ls.quiz_done_at as arena_finished_at, ls.quiz_end_reason as arena_end_reason
  from lms_sessions s
  join live_sessions ls on ls.pin = s.pin;

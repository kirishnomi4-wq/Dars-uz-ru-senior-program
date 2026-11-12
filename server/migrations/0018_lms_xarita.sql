-- 0018_lms_xarita — F-1112-01 (12.11.2026): Shahzodaning 05.11 qo'shimchalari (03-OTVETY §3–§6) — 0016 da qolib ketganlar.
--  1) lesson_lms_map — dars × til → LMS qatori (student_questions.id: masalan 14085 uz / 14086 ru), Class (student_lessons.id),
--     Learn testi, joriy versiya va u LMS'ga yuklangan kun. Manba: LMS_REESTR.json + QUIZ_LEARN.csv
--     (scripts/lms-xarita.mjs → PUT /admin/api/lesson-map).
--  2) attempts.lang — urinish tili. Dars join/restart'da yuboradi; eski urinishda — birinchi javob matnining tilidan, bo'lmasa null.
--  3) View'lar qayta yaratiladi: har o'quvchi-view'da lang + lms_question_id (§5.1), class_id/learn_id (§5.2);
--     to'liq o'rin — server qoidasi bilan bir xil (to'g'ri ↓, vaqt ↑, kim oldin kirgan ↑; teng o'rin yo'q, §6);
--     yangi: v_skipped (§3б), v_practice_wrong_top (§3в, ≥5 o'quvchi), v_lessons (reestr, §4/§5.2), v_quiz_learn (§5.3).
--  Faqat o'qish roli (analitika_ro) bazada bo'lsa — ruxsatlar qayta beriladi (view qayta yaratilganda ruxsat yo'qoladi).

create table if not exists lesson_lms_map (
  lesson_key      text not null check (lesson_key ~ '^[a-z0-9][a-z0-9-]*$'),
  lang            text not null check (lang in ('uz', 'ru')),
  lms_question_id bigint not null,
  class_id        bigint,
  learn_id        bigint,
  lesson_version  text,
  uploaded_on     date,
  updated_at      timestamptz not null default now(),
  primary key (lesson_key, lang)
);

alter table attempts add column if not exists lang text check (lang is null or lang in ('uz', 'ru'));

drop view if exists v_lesson_results, v_question_attempts, v_practice, v_screen_views, v_arena, v_arena_full_place,
  v_wrong_answers_top, v_sessions, v_attempts_base cascade;

-- Ichki (konnektorga berilmaydi). lang_source: 'lesson' — dars o'zi aytgan, 'answer' — birinchi javob matnidan, null — noma'lum.
create view v_attempts_base as
select a.id as attempt_id, a.subject_id as student_id, p.crm_id, a.lesson_id, regexp_replace(a.lesson_id, '-v[0-9]+$', '') as lesson_key,
       a.lesson_version, a.version_source, a.kind as mode, a.session_id, case when s.mode = 'live' then s.gid end as group_id,
       case when s.mode = 'live' then s.teacher_id end as teacher_id, p.player_id, s.pin,
       a.started_at as opened_at, a.status, a.finish_reason, a.finished_at, a.reached_end, a.reached_end_at,
       row_number() over (partition by a.subject_id, a.lesson_id order by a.started_at, a.id) as attempt_no,
       coalesce(a.lang, al.lang) as lang,
       case when a.lang is not null then 'lesson' when al.lang is not null then 'answer' end as lang_source,
       m.lms_question_id, m.class_id, m.learn_id
  from attempts a
  join lms_participants p on p.attempt_id = a.id and p.role = 'student'
  join lms_sessions s on s.id = a.session_id
  left join lateral (
    select t.texts->>'lang' as lang from answer_attempts t
     where t.player_id = p.player_id and t.pin = s.pin and t.texts->>'lang' in ('uz', 'ru')
     order by t.answered_at, t.id limit 1
  ) al on a.lang is null
  left join lesson_lms_map m on m.lesson_key = regexp_replace(a.lesson_id, '-v[0-9]+$', '') and m.lang = coalesce(a.lang, al.lang);

create view v_lesson_results as
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

-- lang — javob matnining tili; attempt_lang — urinish tili (lms_question_id shundan).
create view v_question_attempts as
select b.attempt_id, b.student_id, b.crm_id, b.lesson_id, b.lesson_key, b.lesson_version, b.mode, b.group_id,
       t.question_id, b.lesson_key || ':' || t.question_id as question_key, qk.revision,
       case when t.screen_idx >= 100 then 'arena' else 'test' end as kind,
       t.screen_idx, t.attempt_no, t.picked, t.correct, t.elapsed_ms, t.texts->>'lang' as lang, t.answered_at,
       b.lang as attempt_lang, b.lms_question_id, b.learn_id
  from answer_attempts t
  join v_attempts_base b on b.pin = t.pin and b.player_id = t.player_id
  left join question_keys qk on qk.lesson_key = b.lesson_key and qk.lesson_version = b.lesson_version and qk.question_id = t.question_id
 where t.screen_idx < 500;

-- Har «Tekshirish»/«Bajardim» — alohida qator (attempt_no). O'quvchi yozgan matn bu yerda YO'Q (faqat v_practice_wrong_top, ≥5).
create view v_practice as
select b.attempt_id, b.student_id, b.crm_id, b.lesson_id, b.lesson_key, b.lesson_version, b.mode, b.group_id,
       pa.screen_id, b.lesson_key || ':' || pa.screen_id as question_key, pa.screen_idx, pa.attempt_no, pa.checked, pa.correct, pa.at,
       b.lang, b.lms_question_id, b.learn_id
  from practice_attempts pa
  join v_attempts_base b on b.attempt_id = pa.attempt_id;

-- active_sec_est: ekranda turgan vaqt, 5 daqiqada qirqilgan (haqiqiy faol vaqt o'lchanmaydi — faqat baho, F-1102-02 §5.4)
create view v_screen_views as
select b.attempt_id, b.student_id, b.crm_id, b.lesson_id, b.lesson_key, b.lesson_version, b.mode, b.group_id,
       v.screen_idx, v.screen_id, v.by_student, v.opened_at, v.closed_at,
       least(300, greatest(0, extract(epoch from (coalesce(v.closed_at, sp.updated_at, v.opened_at) - v.opened_at))))::int as active_sec_est,
       b.lang, b.lms_question_id
  from screen_views v
  join v_attempts_base b on b.attempt_id = v.attempt_id
  left join student_progress sp on sp.attempt_id = v.attempt_id;

create view v_arena as
select b.attempt_id, b.student_id, b.crm_id, b.lesson_id, b.lesson_key, b.lesson_version, b.session_id, b.group_id, b.teacher_id,
       ls.quiz_first_q_at as arena_started_at, ls.quiz_done_at as arena_finished_at,
       case when ls.quiz_first_q_at is null then 'not_started' else ls.quiz_end_reason end as end_reason,
       greatest(0, ls.quiz_max_q + 1) as questions_shown,
       ap.source as participation_source, ap.first_shown_at,
       (ap.pin is not null or exists (select 1 from live_answers x where x.pin = b.pin and x.player_id = b.player_id and x.screen_idx between 100 and 499)) as participated,
       (select count(*)::int from live_answers x where x.pin = b.pin and x.player_id = b.player_id and x.screen_idx between 100 and 499) as answered,
       (select count(*)::int from live_answers x where x.pin = b.pin and x.player_id = b.player_id and x.screen_idx between 100 and 499 and x.correct) as correct_answers,
       r.event_id as arena_result_event_id, (r.payload->'result'->>'place')::int as place,
       b.lang, b.lms_question_id, b.learn_id
  from v_attempts_base b
  join live_sessions ls on ls.pin = b.pin
  left join arena_participants ap on ap.pin = b.pin and ap.player_id = b.player_id
  left join result_events r on r.attempt_id = b.attempt_id and r.schema_version = 2 and r.event_type = 'arena_result'
 where b.mode = 'live';

-- To'liq o'rin: HAMMA o'yinchi (PIN bilan kirganlar ham — podium bilan bir xil). Qoida server assignRanks bilan bir xil:
-- kamida bitta to'g'ri javob; to'g'ri ↓, umumiy vaqt ↑, kim oldin kirgan ↑, player id — teng o'rin bo'lmaydi.
create view v_arena_full_place as
with st as (
  select x.pin, x.player_id, count(*) filter (where x.correct)::int as correct_answers, count(*)::int as answered,
         sum(x.elapsed_ms)::bigint as total_ms, round(avg(x.elapsed_ms))::int as avg_ms
    from live_answers x where x.screen_idx between 100 and 499 group by x.pin, x.player_id
), rk as (
  select st.*,
         case when st.correct_answers > 0 then row_number() over (partition by st.pin order by st.correct_answers desc, st.total_ms asc, lp.joined_at asc, st.player_id::text asc) end as full_place,
         count(*) filter (where st.correct_answers > 0) over (partition by st.pin) as ranked_players,
         count(*) over (partition by st.pin) as answering_players
    from st
    join live_players lp on lp.id = st.player_id
)
select s.id as session_id, s.lesson_id, regexp_replace(s.lesson_id, '-v[0-9]+$', '') as lesson_key, s.lesson_version, s.gid as group_id,
       p.subject_id as student_id, p.crm_id, (p.player_id is null) as pin_only,
       rk.answered, rk.correct_answers, rk.avg_ms, rk.full_place, rk.ranked_players, rk.answering_players,
       b.lang, b.lms_question_id
  from rk
  join lms_sessions s on s.pin = rk.pin and s.mode = 'live'
  left join lms_participants p on p.player_id = rk.player_id and p.role = 'student'
  left join v_attempts_base b on b.attempt_id = p.attempt_id;

-- Ko'p xato qilingan savollar: kamida 5 o'quvchi xato qilgan (birinchi javob bo'yicha)
create view v_wrong_answers_top as
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

create view v_sessions as
select s.id as session_id, s.mode, s.lesson_id, regexp_replace(s.lesson_id, '-v[0-9]+$', '') as lesson_key, s.lesson_version,
       s.gid as group_id, s.teacher_id, s.status, s.end_reason, s.started_at, s.finished_at,
       (select count(*)::int from lms_participants p where p.session_id = s.id and p.role = 'student') as students_lms,
       (select count(*)::int from live_players lp where lp.pin = s.pin) as players_total,
       greatest(0, (select count(*)::int from live_players lp where lp.pin = s.pin)
                 - (select count(*)::int from lms_participants p where p.session_id = s.id and p.role = 'student' and p.player_id is not null)) as players_pin_only,
       ls.quiz_first_q_at as arena_started_at, ls.quiz_done_at as arena_finished_at, ls.quiz_end_reason as arena_end_reason,
       mu.lms_question_id as lms_question_id_uz, mr.lms_question_id as lms_question_id_ru,
       coalesce(mu.class_id, mr.class_id) as class_id, coalesce(mu.learn_id, mr.learn_id) as learn_id
  from lms_sessions s
  join live_sessions ls on ls.pin = s.pin
  left join lesson_lms_map mu on mu.lesson_key = regexp_replace(s.lesson_id, '-v[0-9]+$', '') and mu.lang = 'uz'
  left join lesson_lms_map mr on mr.lesson_key = regexp_replace(s.lesson_id, '-v[0-9]+$', '') and mr.lang = 'ru';

-- O'tkazib yuborilgan topshiriqlar (§3б): oxirgi ekranga YETGAN urinishda javobsiz qolgan test savollari va amaliyot ekranlari.
-- Oxiriga yetmagan urinishdagi javobsiz topshiriq «o'tkazilgan» emas, «yetib bormagan» — buni v_lesson_results.screens_reached ko'rsatadi.
-- Ro'yxat question_keys dan (test — savol kalitlari, practice — amaliyot ro'yxati); versiyasi noma'lum urinish bu yerga kirmaydi.
create view v_skipped as
select b.attempt_id, b.student_id, b.crm_id, b.lesson_id, b.lesson_key, b.lesson_version, b.mode, b.group_id,
       qk.question_id, qk.question_key, qk.revision, qk.kind, b.lang, b.lms_question_id
  from v_attempts_base b
  join question_keys qk on qk.lesson_key = b.lesson_key and qk.lesson_version = b.lesson_version and qk.kind in ('test', 'practice')
 where b.reached_end
   and not exists (select 1 from live_answers x where x.pin = b.pin and x.player_id = b.player_id and x.question_id = qk.question_id)
   and not exists (select 1 from answer_attempts t where t.pin = b.pin and t.player_id = b.player_id and t.question_id = qk.question_id)
   and not exists (select 1 from practice_attempts pa where pa.attempt_id = b.attempt_id and pa.screen_id = qk.question_id);

-- Amaliyotdagi takror xato javob (§3в, 07 §3.3): bir topshiriqda kamida 5 o'quvchi AYNAN bir xil noto'g'ri yozgan matn.
-- Yakka o'quvchi matni konnektorga chiqmaydi. Solishtirish: kichik harf, bo'shliqlar bittaga.
create view v_practice_wrong_top as
with w as (
  select b.lesson_key, b.lesson_version, pa.screen_id, b.student_id,
         left(lower(btrim(regexp_replace(pa.text, '\s+', ' ', 'g'))), 300) as answer
    from practice_attempts pa
    join v_attempts_base b on b.attempt_id = pa.attempt_id
   where pa.checked and pa.correct = false and pa.text is not null and btrim(pa.text) <> ''
)
select lesson_key, lesson_version, screen_id, lesson_key || ':' || screen_id as question_key, answer as wrong_answer,
       count(distinct student_id)::int as students
  from w
 group by lesson_key, lesson_version, screen_id, answer
having count(distinct student_id) >= 5;

-- Reestr (§4, §5.2): dars × til → LMS qatori, Class, Learn testi, joriy versiya va yuklangan kun.
create view v_lessons as
select lesson_key, lang, lms_question_id, class_id, learn_id, lesson_version, uploaded_on, updated_at from lesson_lms_map;

-- Arena savoli → Learn testidagi tartib raqami (§5.3, 05.11 kelishuvi 2.4 a): uz 1…N, ru N+1…2N (N — darsdagi arena savollari).
create view v_quiz_learn as
select qk.lesson_key, qk.lesson_version, qk.question_id, qk.question_key, qk.revision, m.lang, m.learn_id,
       qk.order_no + case when m.lang = 'ru' then n.cnt else 0 end as learn_order
  from question_keys qk
  join lesson_lms_map m on m.lesson_key = qk.lesson_key
  join lateral (select count(*)::int as cnt from question_keys z where z.lesson_key = qk.lesson_key and z.lesson_version = qk.lesson_version and z.kind = 'arena') n on true
 where qk.kind = 'arena' and qk.order_no is not null;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'analitika_ro') then
    execute 'grant select on v_lesson_results, v_question_attempts, v_practice, v_screen_views, v_arena, v_arena_full_place, '
         || 'v_wrong_answers_top, v_sessions, v_skipped, v_practice_wrong_top, v_lessons, v_quiz_learn to analitika_ro';
  end if;
end $$;

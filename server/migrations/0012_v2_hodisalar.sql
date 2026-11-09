-- 0012_v2_hodisalar — F-1105-03 (2026-11-09): LMS/CRM analitika kontrakti v2 (Abdulloh yakuniy kelishuvi
-- `feedback/F-1105-03-analitika/25-YAKUNIY-JSX-DARS-LMS-KONTRAKT-UZ.md`) va Shahzoda analitikasi (`04`, `05`, `08`) uchun sxema.
-- Hammasi QO'SHIMCHA: eski jadvallar, v1 oqimi va eski funksiyalar ishlashda davom etadi. Eski migratsiyalar tegilmaydi (checksum).
--
-- Nima qo'shiladi:
--  1) attempts — lesson_version + version_source (attempt | backfill | unknown); yopilish sababi 'version_changed'.
--  2) lms_sessions.end_reason — 'session_limit' (2 soatlik mutlaq chegara); live_sessions — arena yakuni sababi va
--     ko'rsatilgan savollar soni (quiz_end_reason, quiz_max_q); quiz_control shuni yuritadi; quiz_close — server yopadi.
--  3) arena_participants — «birinchi arena savoli ko'rsatildi» (Learn avtomatik hisobi asosi): kim, qaysi savol, qachon, manba.
--  4) screen_views — ekran ochilish/yopilish (opened_at, skipped, faol vaqt bahosi; `participated` = o'quvchi O'ZI o'tgan).
--  5) practice_attempts — amaliyot ekrani urinishlari (har «Tekshirish»/«Bajardim»), matn ≤300 faqat shu bazada.
--  6) quiz_key_versions — kalitlar versiya bilan (eski urinish o'z versiyasi bilan baholanadi); set_quiz_keys_v.
--  7) question_keys — doimiy topshiriq kaliti + reviziya (Shahzoda 04 §1.2), reliz skripti to'ldiradi.
--  8) result_events — v2 ustunlari (schema_version, event_type, student_id, occurred_at, processing_*); noyoblik:
--     v1 — sessiya/urinishga bitta hodisa (avvalgidek), v2 — bir urinish × hodisa turi bitta.

-- 1) Urinish: versiya
alter table attempts add column if not exists lesson_version text
  check (lesson_version is null or length(lesson_version) between 1 and 32);
alter table attempts add column if not exists version_source text not null default 'unknown'
  check (version_source in ('attempt', 'backfill', 'unknown'));
alter table attempts add constraint attempts_version_source_consistent
  check (version_source <> 'unknown' or lesson_version is null);
alter table attempts drop constraint if exists attempts_finish_reason_check;
alter table attempts add constraint attempts_finish_reason_check
  check (finish_reason is null or finish_reason in ('completed', 'live_ended', 'auto_7d', 'restarted', 'live_started', 'version_changed'));

-- 2) Sessiya chegaralari va arena yakuni
alter table lms_sessions drop constraint if exists lms_sessions_end_reason_check;
alter table lms_sessions add constraint lms_sessions_end_reason_check
  check (end_reason is null or end_reason in ('mentor', 'auto_replaced', 'stale', 'solo_done', 'live_started', 'session_limit'));
alter table live_sessions add column if not exists quiz_end_reason text
  check (quiz_end_reason is null or quiz_end_reason in ('mentor', 'last_question_timeout', 'arena_limit', 'session_limit', 'session_closed'));
alter table live_sessions add column if not exists quiz_max_q int not null default -1 check (quiz_max_q >= -1);

-- quiz_control: 0010 bilan bir xil + ko'rsatilgan savollar soni (quiz_max_q) va mentor yopganda sabab.
create or replace function quiz_control(p_pin text, p_token text, p_state text, p_q int default -1)
returns void
language plpgsql
as $$
begin
  if p_state not in ('off', 'lobby', 'q', 'r', 'done') then
    raise exception 'Noto''g''ri holat: %', p_state;
  end if;

  update live_sessions ls
     set quiz_state      = p_state,
         quiz_q          = coalesce(p_q, -1),
         quiz_started_at = case when p_state = 'q' then now() else ls.quiz_started_at end,
         quiz_done_at    = coalesce(ls.quiz_done_at, case when p_state = 'done' then now() end),
         quiz_max_q      = case when p_state = 'q' then greatest(ls.quiz_max_q, coalesce(p_q, -1)) else ls.quiz_max_q end,
         quiz_end_reason = coalesce(ls.quiz_end_reason, case when p_state = 'done' then 'mentor' end),
         updated_at      = now()
    from session_secrets s
   where ls.pin = p_pin
     and s.pin = ls.pin
     and s.mentor_token = p_token
     and ls.status = 'live';

  if not found then
    raise exception 'Sessiya topilmadi yoki ruxsat yo''q';
  end if;
end;
$$;

-- Server (sweeper) arenani yopadi: 45 daqiqa, oxirgi savol + 1 daqiqa, sessiya chegarasi/yopilishi. Tokensiz — faqat server chaqiradi.
-- true = shu chaqiruv yopdi; false = allaqachon yopiq edi yoki arena boshlanmagan.
create or replace function quiz_close(p_pin text, p_reason text)
returns boolean
language plpgsql
as $$
declare
  v_rows int;
begin
  if p_reason not in ('mentor', 'last_question_timeout', 'arena_limit', 'session_limit', 'session_closed') then
    raise exception 'Noto''g''ri sabab: %', p_reason;
  end if;
  update live_sessions ls
     set quiz_state      = 'done',
         quiz_done_at    = coalesce(ls.quiz_done_at, now()),
         quiz_end_reason = coalesce(ls.quiz_end_reason, p_reason),
         updated_at      = now()
   where ls.pin = p_pin
     and ls.quiz_state in ('lobby', 'q', 'r')
     and ls.quiz_done_at is null;
  get diagnostics v_rows = row_count;
  return v_rows > 0;
end;
$$;

-- 3) Arena qatnashishi: o'quvchi ekranida BIRINCHI arena savoli ko'rsatildi (25 §2: Learn avtomatik hisobi shu lahzadan)
create table arena_participants (
  pin                  text not null references live_sessions (pin) on delete cascade,
  player_id            uuid not null references live_players (id) on delete cascade,
  attempt_id           uuid references attempts (id),
  first_question_id    text not null check (length(first_question_id) between 1 and 64),
  first_question_order int not null check (first_question_order between 1 and 999),
  first_shown_at       timestamptz not null default now(),
  source               text not null check (source in ('shown', 'answer')), -- shown: ko'rsatish tasdig'i · answer: tasdiq yo'qolgan, javobdan
  primary key (pin, player_id)
);
create index arena_participants_attempt_idx on arena_participants (attempt_id);

-- O'quvchi: «arena savoli ko'rindi». true = birinchi marta yozildi; false = allaqachon bor edi / arena yopiq / sessiya yo'q.
create or replace function arena_shown(p_pin text, p_player_id uuid, p_token text, p_question_id text, p_order int)
returns boolean
language plpgsql
as $$
declare
  v_rows int;
begin
  if not exists (
    select 1 from player_secrets ps
    join live_players lp on lp.id = ps.player_id
    where ps.player_id = p_player_id and ps.token = p_token and lp.pin = p_pin
  ) then
    raise exception 'Ruxsat yo''q';
  end if;
  if not exists (select 1 from live_sessions ls where ls.pin = p_pin and ls.status = 'live' and ls.quiz_state in ('q', 'r') and ls.quiz_done_at is null) then
    return false;
  end if;
  insert into arena_participants (pin, player_id, attempt_id, first_question_id, first_question_order, source)
  select p_pin, p_player_id, p.attempt_id, p_question_id, p_order, 'shown'
    from (select 1) x
    left join lms_participants p on p.player_id = p_player_id
  on conflict (pin, player_id) do nothing;
  get diagnostics v_rows = row_count;
  return v_rows > 0;
end;
$$;

-- 4) Ekran ko'rinishlari: har ekran ochilishi (o'quvchi o'zi yoki mentor avto-almashtirishi bilan). Oldingi ochiq yozuv yopiladi.
create table screen_views (
  id          bigint generated always as identity primary key,
  attempt_id  uuid not null references attempts (id) on delete cascade,
  screen_idx  int  not null check (screen_idx between 0 and 9999),
  screen_id   text not null default '' check (length(screen_id) <= 64),
  opened_at   timestamptz not null default now(),
  closed_at   timestamptz,
  by_student  boolean not null default true,   -- false = mentor ekranni almashtirdi (o'quvchi o'zi o'tmagan)
  client_ts   bigint
);
create index screen_views_attempt_idx on screen_views (attempt_id, opened_at);

-- O'quvchi: ekran ochildi. Urinishga bog'lanmagan (PIN bilan kirgan) o'yinchida yozilmaydi — false.
create or replace function screen_open(p_pin text, p_player_id uuid, p_token text, p_screen int, p_screen_id text, p_by_student boolean, p_client_ts bigint default null)
returns boolean
language plpgsql
as $$
declare
  v_attempt uuid;
begin
  if not exists (
    select 1 from player_secrets ps
    join live_players lp on lp.id = ps.player_id
    where ps.player_id = p_player_id and ps.token = p_token and lp.pin = p_pin
  ) then
    raise exception 'Ruxsat yo''q';
  end if;
  select p.attempt_id into v_attempt from lms_participants p where p.player_id = p_player_id;
  if v_attempt is null then
    return false;
  end if;
  if not exists (select 1 from attempts a where a.id = v_attempt and a.status = 'active') then
    return false;
  end if;
  -- bir xil ekran ketma-ket ikki marta kelsa (qayta yuborish) — yangi yozuv ochilmaydi
  if exists (select 1 from screen_views v where v.attempt_id = v_attempt and v.closed_at is null and v.screen_idx = p_screen) then
    return true;
  end if;
  update screen_views set closed_at = now() where attempt_id = v_attempt and closed_at is null;
  insert into screen_views (attempt_id, screen_idx, screen_id, by_student, client_ts)
  values (v_attempt, p_screen, coalesce(p_screen_id, ''), coalesce(p_by_student, true), p_client_ts);
  return true;
end;
$$;

-- 5) Amaliyot urinishlari: har «Tekshirish» (checked=true, correct boolean) yoki «Bajardim» (checked=false, correct null)
create table practice_attempts (
  id          bigint generated always as identity primary key,
  attempt_id  uuid not null references attempts (id) on delete cascade,
  screen_idx  int  not null check (screen_idx between 0 and 9999),
  screen_id   text not null check (length(screen_id) between 1 and 64),
  attempt_no  int  not null check (attempt_no between 1 and 50),
  checked     boolean not null,
  correct     boolean,
  text        text check (text is null or length(text) <= 300),   -- o'quvchi yozgan matn/kod — faqat shu bazada, hodisaga chiqmaydi
  at          timestamptz not null default now(),
  unique (attempt_id, screen_idx, attempt_no),
  constraint practice_attempts_correct_consistent check (checked or correct is null)
);
create index practice_attempts_attempt_idx on practice_attempts (attempt_id, screen_idx);

-- O'quvchi: amaliyot urinishi. Qaytarilgan son — urinish raqami; 0 = yozilmadi (urinish yo'q/yopiq, 50 dan oshdi).
create or replace function record_practice(p_pin text, p_player_id uuid, p_token text, p_screen int, p_screen_id text, p_checked boolean, p_correct boolean, p_text text default null)
returns int
language plpgsql
as $$
declare
  v_attempt uuid;
  v_no int;
begin
  if not exists (
    select 1 from player_secrets ps
    join live_players lp on lp.id = ps.player_id
    where ps.player_id = p_player_id and ps.token = p_token and lp.pin = p_pin
  ) then
    raise exception 'Ruxsat yo''q';
  end if;
  select p.attempt_id into v_attempt from lms_participants p where p.player_id = p_player_id;
  if v_attempt is null or not exists (select 1 from attempts a where a.id = v_attempt and a.status = 'active') then
    return 0;
  end if;
  select coalesce(max(attempt_no), 0) + 1 into v_no from practice_attempts where attempt_id = v_attempt and screen_idx = p_screen;
  if v_no > 50 then
    return 0;
  end if;
  insert into practice_attempts (attempt_id, screen_idx, screen_id, attempt_no, checked, correct, text)
  values (v_attempt, p_screen, p_screen_id, v_no, coalesce(p_checked, false),
          case when coalesce(p_checked, false) then p_correct else null end,
          case when p_text is null then null else left(p_text, 300) end);
  return v_no;
end;
$$;

-- 6) Kalitlar versiya bilan (25 §9: yangi reliz eski kalitlarni ustidan yozmaydi)
create table quiz_key_versions (
  lesson_id      text not null,
  lesson_version text not null check (length(lesson_version) between 1 and 32),
  question_id    text not null,
  correct_idx    int  not null,
  updated_at     timestamptz not null default now(),
  primary key (lesson_id, lesson_version, question_id)
);

-- set_quiz_keys bilan bir xil (joriy kalitlar), qo'shimcha versiyali nusxa. Versiya yo'q bo'lsa set_quiz_keys ishlatiladi.
create or replace function set_quiz_keys_v(p_lesson_id text, p_lesson_version text, p_mentor_code text, p_keys jsonb)
returns int
language plpgsql
as $$
declare
  v_n int;
begin
  v_n := set_quiz_keys(p_lesson_id, p_mentor_code, p_keys);
  if p_lesson_version is null or length(p_lesson_version) = 0 then
    return v_n;
  end if;
  insert into quiz_key_versions (lesson_id, lesson_version, question_id, correct_idx)
  select p_lesson_id, p_lesson_version, e.key, (e.value)::int
    from jsonb_each_text(p_keys) as e(key, value)
  on conflict (lesson_id, lesson_version, question_id) do update
    set correct_idx = excluded.correct_idx, updated_at = now();
  return v_n;
end;
$$;

-- 7) Doimiy topshiriq kaliti (Shahzoda 04 §1.2): `<dars kodi -vN siz>:<question_id>` + reviziya (uz+ru matn xeshi)
create table question_keys (
  lesson_key     text not null,        -- netlify-deploy (lesson_id dan -vN olib tashlangan)
  lesson_version text not null,        -- reestr versiyasi (v5 …)
  question_id    text not null,        -- s4, quiz-0
  question_key   text not null,        -- netlify-deploy:s4
  revision       text not null,        -- 12 hex — uz+ru savol va variantlar matni xeshi
  kind           text not null check (kind in ('test', 'arena', 'practice')),
  order_no       int,
  text_uz        text,
  text_ru        text,
  updated_at     timestamptz not null default now(),
  primary key (lesson_key, lesson_version, question_id)
);
create index question_keys_key_idx on question_keys (question_key);

-- 8) result_events: v2 ustunlari va noyoblik
alter table result_events add column if not exists schema_version int not null default 1 check (schema_version in (1, 2));
alter table result_events add column if not exists event_type text
  check (event_type is null or event_type in ('lesson_result', 'arena_participation', 'arena_result'));
alter table result_events add column if not exists student_id bigint check (student_id is null or student_id > 0);
alter table result_events add column if not exists occurred_at timestamptz;
alter table result_events add column if not exists processing_status text
  check (processing_status is null or processing_status in ('queued', 'applied', 'failed', 'review'));
alter table result_events add column if not exists processing_next_at timestamptz;
alter table result_events add column if not exists processing_checked_at timestamptz;
alter table result_events add column if not exists processing_response jsonb;
alter table result_events add constraint result_events_v2_consistent
  check (schema_version = 1 or (event_type is not null and student_id is not null and attempt_id is not null));

drop index if exists result_events_live_session_idx;
drop index if exists result_events_solo_attempt_idx;
create unique index result_events_live_session_idx on result_events (session_id) where mode = 'live' and schema_version = 1;
create unique index result_events_solo_attempt_idx on result_events (attempt_id) where mode = 'solo' and schema_version = 1;
create unique index result_events_v2_attempt_type_idx on result_events (attempt_id, event_type) where schema_version = 2;
create index result_events_processing_idx on result_events (processing_next_at) where processing_status = 'queued';
create index result_events_v2_student_idx on result_events (student_id, lesson_id) where schema_version = 2;

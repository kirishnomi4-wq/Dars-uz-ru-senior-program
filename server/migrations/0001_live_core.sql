-- 0001_live_core — JONLI DARS YADROSI (Supabase'dan ko'chirildi, 2026-09-03)
-- Manba: supabase/live_sessions.sql … live_phase11_cur_screen.sql (12 fayl) ning YAKUNIY holati.
-- Klient (98 dars) shu funksiya imzolari va xabarlariga bog'langan — imzo va xabar O'ZGARMAYDI.
--
-- Ataylab qilingan farqlar:
--  * RLS / grant anon / supabase_realtime / pg_cron YO'Q — bazaga faqat Node kiradi.
--  * security definer YO'Q — funksiyalar chaqiruvchi (dars_app) huquqida yuradi.
--  * create_session eski sessiyalarni O'CHIRMAYDI — ko'rish rejimi (review) uchun tarix kerak.
--    PIN qayta ishlatilmaydi: 6 xona = 1 000 000; kuniga 50 sessiyada 50 yilga yetadi.
--  * Tozalash o'chirmaydi: close_stale_live_sessions() faqat jim qolgan «live» ni «ended» qiladi.
--  * quiz_keys seed YO'Q — kalit mentor ochganda set_quiz_keys orqali avto-yuklanadi (faza 10).
--  * app_config seed YO'Q — mentor_code env'dan startda sinxronlanadi (sir SQL'da turmaydi).

-- ============================================================ JADVALLAR

create table live_sessions (
  pin             text primary key check (pin ~ '^[0-9]{6}$'),
  lesson_id       text not null check (length(lesson_id) between 1 and 128),
  cur_screen      int  not null default 0,            -- mentor HOZIR turgan ekran (kamayishi mumkin) — darvoza shunga qaraydi
  max_screen      int  not null default 0,            -- mentor yetgan ENG OLIS ekran (faqat o'sadi) — reveal/statistika
  status          text not null default 'live' check (status in ('live', 'ended')),
  quiz_state      text not null default 'off' check (quiz_state in ('off', 'lobby', 'q', 'r', 'done')),
  quiz_q          int  not null default -1,
  quiz_started_at timestamptz,
  reveal_screen   int  not null default -1,           -- Kahoot-reveal: mentor natijasini ochgan ekran (-1 = hech qaysi)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()  -- heartbeat: mentor tirikligi
);
create index live_sessions_status_updated_idx on live_sessions (status, updated_at);
create index live_sessions_lesson_created_idx on live_sessions (lesson_id, created_at desc);

-- Mentor sirlari — hech qachon mijozga o'qish uchun berilmaydi
create table session_secrets (
  pin          text primary key references live_sessions (pin) on delete cascade,
  mentor_token text not null
);

create table live_players (
  id        uuid primary key default gen_random_uuid(),
  pin       text not null references live_sessions (pin) on delete cascade,
  nickname  text not null,
  joined_at timestamptz not null default now(),
  unique (pin, nickname)
);
create index live_players_pin_joined_idx on live_players (pin, joined_at);

create table player_secrets (
  player_id uuid primary key references live_players (id) on delete cascade,
  token     text not null
);

-- (player, ekran) = bitta javob; birinchisi qotadi
create table live_answers (
  id          bigint generated always as identity primary key,
  pin         text not null references live_sessions (pin) on delete cascade,
  player_id   uuid not null references live_players (id) on delete cascade,
  screen_idx  int  not null,                 -- test <100 · arena 100+N · praktika 500+N
  question_id text not null default '',      -- SCREEN_META id ('s4') yoki 'quiz-N'
  picked      int  not null,
  correct     boolean not null,              -- SERVER hisoblaydi (quiz_keys), mijozga ishonilmaydi
  elapsed_ms  int  not null default 0,
  answered_at timestamptz not null default now(),
  unique (player_id, screen_idx)
);
create index live_answers_pin_screen_idx on live_answers (pin, screen_idx);

-- Javob kaliti: correct_idx 0..3 = MCQ; -1 = ishtirok savoli (to'ldirgani = to'g'ri)
create table quiz_keys (
  lesson_id   text not null,
  question_id text not null,
  correct_idx int  not null,
  updated_at  timestamptz not null default now(),
  primary key (lesson_id, question_id)
);

create table app_config (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- ============================================================ FUNKSIYALAR

-- Mentor: yangi sessiya → (pin, token). Mentor-kod app_config'dan (bo'sh bo'lsa ham rad — yopiq-xavfsiz).
create or replace function create_session(p_lesson_id text, p_mentor_code text default '')
returns table (pin text, token text)
language plpgsql
as $$
declare
  v_pin   text;
  v_token text;
  v_try   int := 0;
begin
  if p_mentor_code is distinct from (select value from app_config where key = 'mentor_code') then
    raise exception 'Mentor kodi noto''g''ri';
  end if;
  if p_lesson_id is null or length(trim(p_lesson_id)) = 0 then
    raise exception 'Dars identifikatori berilmagan';
  end if;

  loop
    v_try := v_try + 1;
    v_pin := lpad((floor(random() * 1000000))::int::text, 6, '0');
    exit when not exists (select 1 from live_sessions s where s.pin = v_pin);
    if v_try > 50 then
      raise exception 'PIN yaratib bo''lmadi, qayta urinib ko''ring';
    end if;
  end loop;

  v_token := replace(gen_random_uuid()::text, '-', '');
  insert into live_sessions (pin, lesson_id) values (v_pin, p_lesson_id);
  insert into session_secrets (pin, mentor_token) values (v_pin, v_token);
  return query select v_pin, v_token;
end;
$$;

-- Mentor: ekran o'zgardi. cur — hozirgi (kamayishi mumkin), max — monoton. Xato bermaydi (faza 11).
create or replace function advance_session(p_pin text, p_token text, p_screen int)
returns void
language plpgsql
as $$
begin
  update live_sessions ls
     set max_screen = greatest(ls.max_screen, p_screen),
         cur_screen = p_screen,
         updated_at = now()
    from session_secrets s
   where ls.pin = p_pin
     and s.pin = ls.pin
     and s.mentor_token = p_token
     and ls.status = 'live';
end;
$$;

-- Mentor: tiriklik belgisi (klient 10 s da uradi; o'quvchi 180 s jimlikdan keyin «uzildi» deb biladi)
create or replace function session_heartbeat(p_pin text, p_token text)
returns void
language plpgsql
as $$
begin
  update live_sessions ls
     set updated_at = now()
    from session_secrets s
   where ls.pin = p_pin and s.pin = ls.pin
     and s.mentor_token = p_token and ls.status = 'live';
end;
$$;

-- Mentor: «Erkin qilish / Tamom» → status ended (o'quvchilar erkin rejimga o'tadi)
create or replace function end_session(p_pin text, p_token text)
returns void
language plpgsql
as $$
begin
  update live_sessions ls
     set status = 'ended', updated_at = now()
    from session_secrets s
   where ls.pin = p_pin and s.pin = ls.pin
     and s.mentor_token = p_token;
end;
$$;

-- O'quvchi: PIN + ism → (player_id, token). Ism sessiya ichida noyob (katta-kichik harf farqsiz).
create or replace function join_session(p_pin text, p_nickname text)
returns table (player_id uuid, token text)
language plpgsql
as $$
declare
  v_nick   text;
  v_status text;
  v_id     uuid;
  v_token  text;
begin
  v_nick := trim(p_nickname);
  if v_nick is null or length(v_nick) < 2 or length(v_nick) > 24 then
    raise exception 'Ism 2 dan 24 gacha belgi bo''lsin';
  end if;

  select s.status into v_status from live_sessions s where s.pin = p_pin;
  if v_status is null then
    raise exception 'Bunday kod topilmadi';
  end if;
  if v_status <> 'live' then
    raise exception 'Bu dars allaqachon yakunlangan';
  end if;

  if exists (
    select 1 from live_players lp
    where lp.pin = p_pin and lower(lp.nickname) = lower(v_nick)
  ) then
    raise exception 'Bu ism band — boshqa ism tanlang';
  end if;

  v_token := replace(gen_random_uuid()::text, '-', '');
  insert into live_players (pin, nickname) values (p_pin, v_nick) returning id into v_id;
  insert into player_secrets (player_id, token) values (v_id, v_token);
  return query select v_id, v_token;
end;
$$;

-- O'quvchi: javob. true = yozildi, false = shu ekranga allaqachon javob bergan (birinchisi qotadi).
-- p_correct E'TIBORGA OLINMAYDI (imzo mosligi uchun turibdi): to'g'rilik quiz_keys'dan, arena vaqti serverdan.
create or replace function submit_answer(
  p_pin text, p_player_id uuid, p_token text,
  p_screen int, p_question_id text, p_picked int,
  p_correct boolean, p_elapsed_ms int
)
returns boolean
language plpgsql
as $$
declare
  v_rows    int;
  v_lesson  text;
  v_state   text;
  v_started timestamptz;
  v_key     int;
  v_correct boolean;
  v_elapsed int;
begin
  if not exists (
    select 1 from player_secrets ps
    join live_players lp on lp.id = ps.player_id
    where ps.player_id = p_player_id and ps.token = p_token and lp.pin = p_pin
  ) then
    raise exception 'Ruxsat yo''q';
  end if;

  select ls.lesson_id, ls.quiz_state, ls.quiz_started_at
    into v_lesson, v_state, v_started
    from live_sessions ls
   where ls.pin = p_pin;
  if v_lesson is null then
    raise exception 'Sessiya topilmadi';
  end if;

  select qk.correct_idx into v_key
    from quiz_keys qk
   where qk.lesson_id = v_lesson
     and qk.question_id = coalesce(p_question_id, '');
  if v_key is null then
    v_correct := false;                 -- noma'lum savol → ballga kirmaydi
  elsif v_key < 0 then
    v_correct := true;                  -- ishtirok savoli → to'ldirgani = to'g'ri
  else
    v_correct := (p_picked = v_key);
  end if;

  if p_screen >= 100 and v_state = 'q' and v_started is not null then
    v_elapsed := greatest(0, least((extract(epoch from (now() - v_started)) * 1000)::int, 3600000));
  else
    v_elapsed := greatest(0, least(coalesce(p_elapsed_ms, 0), 3600000));
  end if;

  insert into live_answers (pin, player_id, screen_idx, question_id, picked, correct, elapsed_ms)
  values (p_pin, p_player_id, p_screen, coalesce(p_question_id, ''), p_picked, v_correct, v_elapsed)
  on conflict (player_id, screen_idx) do nothing;

  get diagnostics v_rows = row_count;
  return v_rows > 0;
end;
$$;

-- Mentor: arena (Mustahkamlash) holati — off | lobby | q | r | done
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

-- Mentor: «Natijani ochish» — to'g'ri javob barcha o'quvchilarda ochiladi
create or replace function reveal_screen(p_pin text, p_token text, p_screen int)
returns void
language plpgsql
as $$
begin
  update live_sessions ls
     set reveal_screen = p_screen,
         updated_at    = now()
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

-- Mentor-kodli: dars kalitini yuklash/yangilash. p_keys = {"s4":1,"quiz-0":2,"s6":-1}. Qaytaradi: yozilgan qatorlar.
create or replace function set_quiz_keys(p_lesson_id text, p_mentor_code text, p_keys jsonb)
returns int
language plpgsql
as $$
declare
  v_n int;
begin
  if p_mentor_code is distinct from (select value from app_config where key = 'mentor_code') then
    raise exception 'Mentor kodi noto''g''ri';
  end if;
  if p_keys is null or jsonb_typeof(p_keys) <> 'object' then
    raise exception 'Kalit obyekt bo''lsin';
  end if;

  insert into quiz_keys (lesson_id, question_id, correct_idx)
  select p_lesson_id, e.key, (e.value)::int
    from jsonb_each_text(p_keys) as e(key, value)
  on conflict (lesson_id, question_id) do update
    set correct_idx = excluded.correct_idx, updated_at = now();

  get diagnostics v_n = row_count;
  return v_n;
end;
$$;

-- Xizmat: p_silence davomida jim qolgan «live» sessiyalarni «ended» qiladi (heartbeat 10 s; 2 soat jimlik = tashlandiq).
-- O'CHIRMAYDI. Node har 15 daqiqada chaqiradi. Qaytaradi: yopilganlar soni.
create or replace function close_stale_live_sessions(p_silence interval default interval '2 hours')
returns int
language sql
as $$
  with closed as (
    update live_sessions
       set status = 'ended', updated_at = now()
     where status = 'live'
       and updated_at < now() - p_silence
    returning 1
  )
  select count(*)::int from closed;
$$;

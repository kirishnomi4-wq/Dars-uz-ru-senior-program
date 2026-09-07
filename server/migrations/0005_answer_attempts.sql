-- 0005_answer_attempts — HAR URINISH TARIXI + yutuq-vaqtlari (LMS analitika-so'rovi 2026-09-07, TZ_LESSON_RESULT_DETAILS_RU).
-- live_answers = BALL (birinchi urinish, UNIQUE, o'zgarmaydi). answer_attempts = TARIX (har bosish, savolga 10 tagacha).
-- record_attempt: urinishni yozadi VA birinchi urinishda ball-qatorini ham qo'yadi — shu bilan mustaqil (solo) rejimdagi
-- «javoblar nol ketadi» nuqsoni yopiladi (solo'da dars submit_answer chaqirmas edi). Jonli darsda submit_answer ham
-- chaqirilaveradi: ikkalasi idempotent (on conflict do nothing).
-- texts — faqat ko'rsatish uchun (savol/variant matni, o'quvchi tili); ball hisobiga KIRMAYDI, 4 KB dan katta bo'lsa tashlanadi.

create table answer_attempts (
  id           bigint generated always as identity primary key,
  pin          text not null references live_sessions (pin) on delete cascade,
  player_id    uuid not null references live_players (id) on delete cascade,
  screen_idx   int  not null,
  question_id  text not null default '',
  attempt_no   int  not null check (attempt_no between 1 and 10),
  picked       int  not null,
  correct      boolean not null,               -- SERVER hisoblaydi (quiz_keys)
  elapsed_ms   int  not null default 0,
  texts        jsonb,
  answered_at  timestamptz not null default now(),
  unique (player_id, screen_idx, attempt_no)
);
create index answer_attempts_pin_player_idx on answer_attempts (pin, player_id, screen_idx);

-- Darsdagi yutuqlar: qachon olingani (progress'dagi earned ro'yxati o'sganda yoziladi)
create table achievement_events (
  attempt_id      uuid not null references attempts (id) on delete cascade,
  achievement_id  text not null check (achievement_id ~ '^[a-z0-9_-]{1,32}$'),
  earned_at       timestamptz not null default now(),
  primary key (attempt_id, achievement_id)
);

-- Qaytaradi: urinish raqami (1..10); 0 = limit oshdi (yozilmadi).
create or replace function record_attempt(
  p_pin text, p_player_id uuid, p_token text,
  p_screen int, p_question_id text, p_picked int, p_elapsed_ms int, p_texts jsonb
)
returns int
language plpgsql
as $$
declare
  v_lesson  text;
  v_state   text;
  v_started timestamptz;
  v_key     int;
  v_correct boolean;
  v_elapsed int;
  v_n       int;
  v_texts   jsonb;
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
   where qk.lesson_id = v_lesson and qk.question_id = coalesce(p_question_id, '');
  if v_key is null then
    v_correct := false;
  elsif v_key < 0 then
    v_correct := true;
  else
    v_correct := (p_picked = v_key);
  end if;

  if p_screen >= 100 and v_state = 'q' and v_started is not null then
    v_elapsed := greatest(0, least((extract(epoch from (now() - v_started)) * 1000)::int, 3600000));
  else
    v_elapsed := greatest(0, least(coalesce(p_elapsed_ms, 0), 3600000));
  end if;

  select coalesce(max(aa.attempt_no), 0) + 1 into v_n
    from answer_attempts aa
   where aa.player_id = p_player_id and aa.screen_idx = p_screen;
  if v_n > 10 then
    return 0;
  end if;

  v_texts := case when p_texts is null or length(p_texts::text) > 4000 then null else p_texts end;

  insert into answer_attempts (pin, player_id, screen_idx, question_id, attempt_no, picked, correct, elapsed_ms, texts)
  values (p_pin, p_player_id, p_screen, coalesce(p_question_id, ''), v_n, p_picked, v_correct, v_elapsed, v_texts);

  if v_n = 1 then
    insert into live_answers (pin, player_id, screen_idx, question_id, picked, correct, elapsed_ms)
    values (p_pin, p_player_id, p_screen, coalesce(p_question_id, ''), p_picked, v_correct, v_elapsed)
    on conflict (player_id, screen_idx) do nothing;
  end if;

  return v_n;
end;
$$;

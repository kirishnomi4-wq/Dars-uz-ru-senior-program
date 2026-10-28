-- 0010_arena_yopilishi (2026-10-28, F-1023-01 PODIUM-05 — Abdulloh QA):
-- Arena yakunlangach (quiz_state 'done') shu sessiyada arena javoblari QABUL QILINMAYDI.
--
-- Nega: dars javobni tarmoq xatosida 3/6/9 s dan keyin qayta yuboradi. Mentor arenani yakunlagandan keyin yetib kelgan
-- javob live_answers'ga tushib, YAKUNIY jadvalni o'zgartirardi — dars esa yakuniy o'rinni (codestrike.podium) done
-- paytidagi jadvaldan hisoblab LMS'ga yuborgan bo'ladi. QA'da: kechikkan javobsiz 3-o'rin, javob yetgach — 1-o'rin.
-- Kafolat: done'dan keyin arena jadvali = done paytidagi jadval.
--
-- Qoidalar:
--   · quiz_done_at — sessiyada BIRINCHI marta 'done' bo'lgan vaqt; keyin holat o'zgarsa (API orqali qayta 'lobby'/'q')
--     ham tozalanmaydi — yopilgan arena qayta ochilib jadval to'ldirilmaydi.
--   · Arena = screen_idx >= 100 (darslardagi QUIZ_BASE_IDX). Dars ekranlaridagi savollar (< 100) bunga kirmaydi.
--   · Yopiq arenaga javob: submit_answer → false (yozilmadi — «allaqachon javob bergan» bilan bir xil, dars qayta
--     yubormaydi), record_attempt → 0 (yozilmadi). Xato (exception) emas — o'quvchiga xabar chiqmaydi.
--   · Poyga: javob va «yakunlash» bir lahzada kelsa — sessiya qatori qulflanadi (submit/record: FOR SHARE,
--     quiz_control: UPDATE). Yoki javob done'dan OLDIN yoziladi, yoki done'dan keyin rad etiladi — o'rtasi yo'q.
--   · Eski migratsiyalar tegilmaydi (checksum): funksiyalar shu yerda to'liq qayta yoziladi, mazmuni 0001/0005 bilan
--     bir xil, faqat yopilish tekshiruvi va qulf qo'shilgan.

alter table live_sessions add column if not exists quiz_done_at timestamptz;

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

-- O'quvchi: javob. true = yozildi, false = yozilmadi (shu ekranga allaqachon javob bergan YOKI arena yopilgan).
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
  v_done    timestamptz;
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

  -- FOR SHARE: quiz_control('done') shu tranzaksiya tugaguncha kutadi (poyga yo'q); javoblar bir-birini kutmaydi.
  select ls.lesson_id, ls.quiz_state, ls.quiz_started_at, ls.quiz_done_at
    into v_lesson, v_state, v_started, v_done
    from live_sessions ls
   where ls.pin = p_pin
     for share;
  if v_lesson is null then
    raise exception 'Sessiya topilmadi';
  end if;

  if p_screen >= 100 and v_done is not null then
    return false;                       -- arena yopilgan: yakuniy jadval o'zgarmaydi (0010)
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

-- Qaytaradi: urinish raqami (1..10); 0 = yozilmadi (limit oshdi YOKI arena yopilgan).
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
  v_done    timestamptz;
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

  select ls.lesson_id, ls.quiz_state, ls.quiz_started_at, ls.quiz_done_at
    into v_lesson, v_state, v_started, v_done
    from live_sessions ls
   where ls.pin = p_pin
     for share;
  if v_lesson is null then
    raise exception 'Sessiya topilmadi';
  end if;

  if p_screen >= 100 and v_done is not null then
    return 0;                           -- arena yopilgan: urinish ham, ball-qatori ham yozilmaydi (0010)
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

-- 0015_quiz_close_at — F-1105-03 S7 (2026-11-09): server arenani yopganda yakun lahzasi = MANTIQIY chegara, ishchi kelgan vaqt emas.
-- 25 §12 band 11: «worker kechiksa o'yin vaqti uzaymaydi». Avval quiz_close `quiz_done_at = now()` yozardi — ishchi 5 s (yoki
-- server qayta ishga tushsa daqiqalar) kech kelsa, arena_result.finished_at va javoblar chegarasi shuncha surilardi.
-- Endi chaqiruvchi chegarani beradi (45 daqiqa · oxirgi savol + 1 daqiqa · sessiya yopilgan / 2 soat); now() dan katta bo'lmaydi.
drop function if exists quiz_close(text, text);

create or replace function quiz_close(p_pin text, p_reason text, p_at timestamptz default null)
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
         quiz_done_at    = coalesce(ls.quiz_done_at, least(now(), coalesce(p_at, now()))),
         quiz_end_reason = coalesce(ls.quiz_end_reason, p_reason),
         updated_at      = now()
   where ls.pin = p_pin
     and ls.quiz_state in ('lobby', 'q', 'r')
     and ls.quiz_done_at is null;
  get diagnostics v_rows = row_count;
  return v_rows > 0;
end;
$$;

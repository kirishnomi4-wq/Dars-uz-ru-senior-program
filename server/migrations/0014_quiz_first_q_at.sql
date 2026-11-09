-- 0014_quiz_first_q_at — F-1105-03 S4 (2026-11-09): arena BOSHLANGAN lahza. `quiz_started_at` har savolda qayta yoziladi
-- (joriy savol boshlanishi — oxirgi savol + 1 daqiqa chegarasi uchun kerak), arena boshlanishi esa alohida: 25 §5
-- `arena.started_at`, §6 «arena boshlanish + 45 daqiqa». quiz_control 0012 bilan bir xil + quiz_first_q_at (birinchi 'q').
alter table live_sessions add column if not exists quiz_first_q_at timestamptz;

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
         quiz_first_q_at = coalesce(ls.quiz_first_q_at, case when p_state = 'q' then now() end),
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

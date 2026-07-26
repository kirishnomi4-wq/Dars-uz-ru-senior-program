-- ============================================================
-- PHASE 11 — cur_screen: mentor HOZIR turgan ekran (F-0726-01 jonli-darvoza tuzatishi)
-- ============================================================
-- MUAMMO: advance_session faqat max_screen = greatest(...) yozardi — u HECH QACHON
-- kamaymaydi. Mentor darsdan oldin ekranlarni varaqlab chiqsa (yoki bir marta oldinga
-- o'tib qaytsa), o'quvchi-darvoza o'sha ENG UZOQ nuqtagacha ochiq qolardi va o'quvchilar
-- mentorni kutmasdan oldinga yugurardi.
-- YECHIM: cur_screen — mentorning hozirgi ekrani (kamayishi mumkin). Darvoza endi shunga
-- qaraydi; max_screen statistika uchun qoladi. Klient cur_screen ?? max_screen o'qiydi —
-- migratsiya ishga tushmagan bazada ham sinmaydi (select=*).
-- QO'LLASH: Supabase SQL Editor'da shu faylni to'liq ishga tushiring.
-- ============================================================

alter table public.live_sessions
  add column if not exists cur_screen int not null default 0;

create or replace function public.advance_session(p_pin text, p_token text, p_screen int)
returns void
language plpgsql
security definer
set search_path = public
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

grant execute on function public.advance_session(text, text, int) to anon, authenticated;

-- TEST (ixtiyoriy):
--   select advance_session('<pin>', '<token>', 8);  -- cur=8, max=8
--   select advance_session('<pin>', '<token>', 3);  -- cur=3, max=8 (darvoza 3 da!)
--   select pin, cur_screen, max_screen from live_sessions;

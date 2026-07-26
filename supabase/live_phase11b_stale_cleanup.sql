-- ============================================================
-- PHASE 11b — TASHLANDIQ SESSIYALARNI YOPISH (bir martalik tozalash)
-- ============================================================
-- SABAB: phase11 (cur_screen) dan OLDIN ochilgan sessiyalarda cur_screen=0
-- turibdi (yangi ustun eski qatorlarga standart 0 bilan qo'shilgan). Ular hali
-- status='live' — kimdir eski PIN bilan qayta ulansa, darvoza 0-ekranda ushlab
-- qoladi (mentor kirib bir harakat qilgunicha). end_session'ni tashqaridan
-- chaqirib bo'lmaydi (mentor-token session_secrets'da) — shuning uchun SQL'da.
-- QO'LLASH: Supabase SQL Editor'da Run. IDEMPOTENT — qayta bajarsa ham zarasiz.
-- ============================================================

-- 1) 2 soatdan beri jim turgan barcha "live" sessiyalarni yopamiz
--    (jonli dars 2 soat jim turmaydi; heartbeat 10s da uradi).
update public.live_sessions
   set status = 'ended', updated_at = now()
 where status = 'live'
   and updated_at < now() - interval '2 hours';

-- 2) Ehtiyot-chora: yopilmagan (yaqinda faol) eski qatorlar bo'lsa —
--    cur_screen'ni max_screen bilan tenglashtiramiz, darvoza 0 da qotmasin.
--    (Faqat cur=0 va max>0 bo'lganlar — yangi mantiq buzilmaydi.)
update public.live_sessions
   set cur_screen = max_screen
 where status = 'live'
   and cur_screen = 0
   and max_screen > 0;

-- 3) Natijani ko'rish
select pin, lesson_id, cur_screen, max_screen, status, updated_at
  from public.live_sessions
 order by updated_at desc
 limit 10;

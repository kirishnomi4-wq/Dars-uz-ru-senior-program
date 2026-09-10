-- F-0910-01 (2026-09-10): o'quvchi mentordan OLDIN kirsa solo urinish ochiladi; mentor keyin dars ochganda
-- server solo'ni 'live_started' sababi bilan yopadi va o'quvchini jonli sessiyaga kiritadi.
-- 'live_started' natija-navbatga TUSHMAYDI (result-service faqat completed|auto_7d ni yuboradi) — tanga jonli natijadan keladi.
alter table attempts drop constraint if exists attempts_finish_reason_check;
alter table attempts add constraint attempts_finish_reason_check
  check (finish_reason is null or finish_reason in ('completed', 'live_ended', 'auto_7d', 'restarted', 'live_started'));
-- solo sessiyasi ham shu sabab bilan yopiladi (admin «Sessiyalar» da ko'rinadi)
alter table lms_sessions drop constraint if exists lms_sessions_end_reason_check;
alter table lms_sessions add constraint lms_sessions_end_reason_check
  check (end_reason is null or end_reason in ('mentor', 'auto_replaced', 'stale', 'solo_done', 'live_started'));

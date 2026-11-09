-- 0013_reached_end_at — F-1105-03 S3 (2026-11-09): v2 `lesson_result.result.completed_at` va `occurred_at` (trigger reached_end)
-- uchun oxirgi ekranga yetgan LAHZA kerak; 0003 da faqat `reached_end boolean` bor edi (updated_at keyin o'zgarib ketadi).
-- Eski qatorlar uchun null qoladi — vaqt o'ylab topilmaydi (25 §5: «vaqtni o'ylab topmaymiz»).
alter table attempts add column if not exists reached_end_at timestamptz;
alter table attempts add constraint attempts_reached_end_at_consistent
  check (reached_end_at is null or reached_end);

-- 0009_result_skipped — F-0918-04 (2026-09-18): «bir o'quvchi — bir dars — bitta natija» jonli hodisaga ham.
-- Muammo: tanga-qoidasi (result-service `hasRewardedResult`) faqat SOLO'ni to'xtatardi. Jonli sessiya qayta o'tilsa
-- (mentor darsni takrorladi, sinov-guruh) — o'sha o'quvchi uchun IKKINCHI hodisa ham LMS'ga ketardi: tanga va nishonlar
-- ikki marta. Staging 2026-09-18: bitta o'quvchiga shu dars bo'yicha ikki jonli natija yetkazilgan.
-- Yechim (kod: `enqueueLiveSession`): oldin TUGALLANGAN natijasi bor o'quvchi yangi jonli hodisadan chiqariladi.
-- Hodisadagi HAMMA o'quvchi shunday bo'lsa — hodisa yuborilmaydi, lekin yozuv qoladi (analitika + sweeper shu
-- sessiyani qayta-qayta olmasligi uchun). Shu yozuv uchun yangi holat kerak: 'skipped'.
-- Ishchi navbati (`result_events_queue_idx`) faqat pending/retry_wait ni ko'radi — 'skipped' hech qachon yuborilmaydi.
alter table result_events drop constraint if exists result_events_status_check;
alter table result_events add constraint result_events_status_check
  check (status in ('pending', 'retry_wait', 'delivered', 'manual_review', 'skipped'));

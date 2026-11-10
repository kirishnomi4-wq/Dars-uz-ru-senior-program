-- 0017_v2_cutoff — F-1105-03 (10.11.2026): v2 hodisalar faqat yangi oqim YOQILGAN lahzadan keyin boshlangan urinishlar uchun.
-- Sabab: staging'da bayroq yoqilganda sweeper sentyabrdagi eski urinishlar uchun ham lr_/ar_ yaratdi (26 ta, chala yuk, 422).
-- Prod'da bu minglab eski urinish = CRM'ga ommaviy hodisa. 25-kontrakt §9: T dan oldingi urinishlar uchun backfill yo'q.
-- Lahza bir marta qotadi (ishchi bayroq «on» bilan birinchi ishga tushganda); qayta ishga tushish uni surmaydi.
-- Qo'lda berish: RESULT_SCHEMA_V2_FROM (ISO) — masalan bayroq o'chirilib, qayta yoqilganda.
create table if not exists dars_settings (
  key        text primary key,
  value      timestamptz not null,
  set_at     timestamptz not null default now()
);

-- 0011_result_revisions — F-1106-01 (2026-11-06): School API rad etgan (422, manual_review) hodisani QAYTA YIG'ISH.
-- Muammo: 21.09–02.11 da 49 hodisa 422 olgan (kalitsiz yozilgan `correct`, jonlida 2 urinish, o'zgargan variant matni).
-- Kod tuzatildi (result-builder), lekin `requeue` ESKI payload'ni qayta yuboradi — u yana 422 oladi.
-- Yechim (kod: result-service `rebuildEvent`, admin POST /admin/api/results/rebuild): hodisa manbadan (sessiya / urinish)
-- yangi kod bilan qayta yig'iladi, shu QATORning o'zida almashtiriladi (UNIQUE session_id / attempt_id — ikkinchi qator
-- bo'lishi mumkin emas); kerak bo'lsa event_id ham yangilanadi (`_r1`). Eski holat (payload, javob, xato) shu jadvalga
-- ko'chiriladi — hech narsa yo'qolmaydi, tahlil va qaytarish uchun.
create table result_event_revisions (
  id               bigserial primary key,
  event_id         text not null,          -- almashtirilgunga qadar bo'lgan id
  new_event_id     text not null,          -- almashtirilgandan keyingi id (o'zgarmasa — o'sha)
  reason           text not null,
  old_status       text not null,
  old_payload      jsonb not null,
  old_response     jsonb,
  old_last_http_status int,
  old_last_request_id  text,
  old_last_error   text,
  old_send_attempts int not null default 0,
  created_at       timestamptz not null default now()
);
create index result_event_revisions_event_idx on result_event_revisions (event_id);
create index result_event_revisions_new_event_idx on result_event_revisions (new_event_id);

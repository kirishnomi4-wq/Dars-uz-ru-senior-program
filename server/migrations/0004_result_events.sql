-- 0004_result_events — NATIJA-NAVBAT (BACKEND_REJA §6.5, §7; LMS v1.2 §7–§10).
-- Hodisa avval bazaga «pending» yoziladi, keyin ishchi School API'ga yuboradi (idempotent event_id).
-- Statuslar: pending → delivered · pending → retry_wait → delivered · pending → manual_review (401/403/409/422).
-- Live: bir sessiya = bir hodisa (UNIQUE). Solo: bir urinish = bir hodisa (UNIQUE).

create table result_events (
  event_id        text primary key check (event_id ~ '^[A-Za-z0-9][A-Za-z0-9._:@-]*$' and length(event_id) <= 128),
  mode            text not null check (mode in ('live', 'solo')),
  session_id      uuid references lms_sessions (id),
  attempt_id      uuid references attempts (id),
  lesson_id       text not null,
  payload         jsonb not null,
  students_count  int not null default 0,
  status          text not null default 'pending' check (status in ('pending', 'retry_wait', 'delivered', 'manual_review')),
  send_attempts   int not null default 0,
  next_try_at     timestamptz not null default now(),
  last_http_status int,
  last_request_id text,
  last_error      text,
  response        jsonb,
  delivered_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint result_events_source check ((mode = 'live' and session_id is not null) or (mode = 'solo' and attempt_id is not null))
);
create unique index result_events_live_session_idx on result_events (session_id) where mode = 'live';
create unique index result_events_solo_attempt_idx on result_events (attempt_id) where mode = 'solo';
create index result_events_queue_idx on result_events (next_try_at) where status in ('pending', 'retry_wait');
create index result_events_status_idx on result_events (status, updated_at desc);

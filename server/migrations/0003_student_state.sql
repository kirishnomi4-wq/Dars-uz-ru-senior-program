-- 0003_student_state — O'QUVCHI-HOLAT (BACKEND_REJA §4.3, §6.2–§6.7): urinishlar, server-progress, solo, ko'rish rejimi.
-- attempts          — o'quvchining shu darsdagi urinishi: live (guruh sessiyasi) yoki solo (shaxsiy sessiya).
--                     Bir vaqtda BITTA faol urinish (UNIQUE partial). Tugash: completed (solo: oxirgi ekran),
--                     live_ended (jonli dars yopildi), auto_7d (yarim qolgan solo), restarted (qayta boshlash).
-- student_progress  — dars ildizi har 2 s yuboradigan holat (ekran, javoblar, nishonlar). Istalgan qurilmadan davom,
--                     tugagach — ko'rish rejimi manbai. client_ts: eskirgan yozuv yangisini bosmaydi.
-- lms_participants.attempt_id — ishtirok ↔ urinish (natija-payload 4-bosqichda shu orqali yig'iladi).

create table attempts (
  id              uuid primary key default gen_random_uuid(),
  subject_id      bigint not null check (subject_id > 0),
  lesson_id       text not null check (length(lesson_id) between 1 and 128),
  kind            text not null check (kind in ('live', 'solo')),
  session_id      uuid references lms_sessions (id),
  status          text not null default 'active' check (status in ('active', 'finished')),
  finish_reason   text check (finish_reason is null or finish_reason in ('completed', 'live_ended', 'auto_7d', 'restarted')),
  reached_end     boolean not null default false,   -- oxirgi ekranga yetdi (natijada `completed`)
  started_at      timestamptz not null default now(),
  finished_at     timestamptz,
  result_event_id text,
  updated_at      timestamptz not null default now(),
  constraint attempts_finished_consistent check (status <> 'finished' or (finished_at is not null and finish_reason is not null))
);
create unique index attempts_one_active_idx on attempts (subject_id, lesson_id) where status = 'active';
create index attempts_subject_lesson_idx on attempts (subject_id, lesson_id, started_at desc);
create index attempts_session_idx on attempts (session_id);
create index attempts_solo_active_idx on attempts (started_at) where status = 'active' and kind = 'solo';

create table student_progress (
  attempt_id    uuid primary key references attempts (id) on delete cascade,
  screen        int not null default 0 check (screen >= 0 and screen <= 9999),
  total         int check (total is null or (total > 0 and total <= 9999)),
  answers       jsonb not null default '{}'::jsonb,
  earned        jsonb not null default '[]'::jsonb,
  started_at_ms bigint,
  client_ts     bigint not null default 0,
  updated_at    timestamptz not null default now()
);

alter table lms_participants add column attempt_id uuid references attempts (id);
create index lms_participants_attempt_idx on lms_participants (attempt_id);

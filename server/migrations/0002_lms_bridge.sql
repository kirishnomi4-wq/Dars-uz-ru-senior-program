-- 0002_lms_bridge — LMS-ko'prik jadvallari (BACKEND_REJA §4.2). Jonli qatlam (0001) ga TEGILMAYDI.
-- lms_sessions   — bizning jonli sessiya ↔ LMS guruhi/o'qituvchisi (pin → live_sessions)
-- lms_tokens     — ko'rilgan JWT jti'lar (UNIQUE) va qaysi sessiyaga bog'langani (LMS §5.4)
-- lms_participants — sessiyadagi LMS-shaxslar (o'quvchi/mentor), shifrlangan sessiya-tokenlari, ism (90 kun)
-- context_cache  — integration-context javobi (guruhlar), 5 daqiqa
-- lesson_catalog — server-tomon dars ro'yxati: lesson_id brauzerdan kelsa ham faqat katalogdagisi qabul (LMS §6)

create table lms_sessions (
  id             uuid primary key default gen_random_uuid(),
  pin            text not null unique references live_sessions (pin),
  lesson_id      text not null check (length(lesson_id) between 1 and 128),
  lesson_version text,
  mode           text not null check (mode in ('live', 'solo')),
  gid            bigint check (gid is null or gid > 0),            -- live: guruh (mentor JWT `gid`)
  teacher_id     bigint check (teacher_id is null or teacher_id > 0), -- live: mentor JWT `sub`
  mentor_jti     text,
  status         text not null default 'live' check (status in ('live', 'ended')),
  end_reason     text check (end_reason is null or end_reason in ('mentor', 'auto_replaced', 'stale', 'solo_done')),
  auto_ended_by  uuid references lms_sessions (id),
  started_at     timestamptz not null default now(),
  finished_at    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint lms_sessions_live_needs_group check (mode <> 'live' or (gid is not null and teacher_id is not null))
);
-- Bir guruh — bir dars — bir vaqtda bitta jonli sessiya (§6.6 bazada ham kafolatlanadi)
create unique index lms_sessions_one_live_per_group on lms_sessions (gid, lesson_id) where status = 'live' and mode = 'live';
create index lms_sessions_lookup_idx on lms_sessions (lesson_id, status, mode);
create index lms_sessions_teacher_idx on lms_sessions (teacher_id, status) where mode = 'live';

create table lms_tokens (
  jti           text primary key,
  role          text not null check (role in ('student', 'mentor')),
  subject_id    bigint not null check (subject_id > 0),
  exp           timestamptz not null,
  first_seen_at timestamptz not null default now(),
  session_id    uuid references lms_sessions (id)
);
create index lms_tokens_exp_idx on lms_tokens (exp);

create table lms_participants (
  id               uuid primary key default gen_random_uuid(),
  session_id       uuid not null references lms_sessions (id) on delete cascade,
  role             text not null check (role in ('student', 'mentor')),
  subject_id       bigint not null check (subject_id > 0),
  player_id        uuid references live_players (id) on delete set null, -- o'quvchi
  session_token_enc text,   -- o'quvchi: player_token · mentor: mentor_token (AES-256-GCM, lib/crypto.js)
  crm_id           bigint,
  display_name     text,    -- 90 kundan keyin null (name_purged_at)
  name_purged_at   timestamptz,
  joined_at        timestamptz not null default now(),
  unique (session_id, role, subject_id)
);
create index lms_participants_subject_idx on lms_participants (subject_id, role);

create table context_cache (
  subject_id bigint primary key,
  groups     jsonb not null,
  found      boolean not null default true,
  fetched_at timestamptz not null default now()
);

create table lesson_catalog (
  lesson_id       text primary key check (lesson_id ~ '^[A-Za-z0-9][A-Za-z0-9._:@-]*$'),
  title_uz        text not null,
  title_ru        text,
  version         text,
  total_questions int,
  active          boolean not null default true,
  updated_at      timestamptz not null default now()
);

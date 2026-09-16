-- 0008_mentor_gaps — F-0914-11 (2026-09-15): mentor-jimlik dalili.
-- Muammo: o'quvchi mijozi mentor qatorining updated_at o'zgarishini 180 s ko'rmasa «mentor uzildi» deb biladi
-- (klient LIVE_STALE_MS, src/live/liveClient.js). Bu lahza hech qayerda saqlanmasdi: so'rov-log o'chiq
-- (disableRequestLogging), updated_at tarixi yo'q. Natijada «20 o'quvchidan 1 tasida praktika sakradi»
-- holatini serverdan tiklab bo'lmadi.
-- Yechim: live_sessions.updated_at 180 s dan ko'p sakrasa (mentor qaytib heartbeat / advance / quiz / reveal
-- yuborganda yoki sessiya yopilganda) — bo'shliq shu jadvalga yoziladi. Klientga tegilmaydi, yangi RPC yo'q.
-- Tozalash o'chirmaydi (0001 qoidasi); satr kichik, bo'shliq kamdan-kam.
-- Chegara klient LIVE_STALE_MS bilan bir xil — 180 s. U o'zgarsa, yangi migratsiya yoziladi (bu fayl tahrirlanmaydi).

create table live_mentor_gaps (
  id              bigint generated always as identity primary key,
  pin             text not null,
  lesson_id       text not null,
  gap_started_at  timestamptz not null,  -- mentordan oxirgi belgi (eski updated_at)
  gap_ended_at    timestamptz not null,  -- mentor qaytgan yoki sessiya yopilgan lahza (yangi updated_at)
  gap_ms          bigint not null,
  cur_screen      int not null,          -- jimlik paytida mentor turgan ekran
  ended_by        text not null check (ended_by in ('mentor', 'session_end')),
  created_at      timestamptz not null default now()
);
create index live_mentor_gaps_pin_idx on live_mentor_gaps (pin, gap_started_at);
create index live_mentor_gaps_started_idx on live_mentor_gaps (gap_started_at desc);

create or replace function log_live_mentor_gap()
returns trigger
language plpgsql
as $$
begin
  insert into live_mentor_gaps (pin, lesson_id, gap_started_at, gap_ended_at, gap_ms, cur_screen, ended_by)
  values (
    new.pin, new.lesson_id, old.updated_at, new.updated_at,
    (extract(epoch from (new.updated_at - old.updated_at)) * 1000)::bigint,
    old.cur_screen,
    case when new.status = 'ended' then 'session_end' else 'mentor' end
  );
  return null;
end;
$$;

-- Faqat «live» sessiyada va faqat 180 s dan uzun sakrashda. Yopilgan sessiyadagi yangilanish yozilmaydi.
create trigger live_sessions_mentor_gap
  after update of updated_at on live_sessions
  for each row
  when (old.status = 'live' and new.updated_at - old.updated_at > interval '180 seconds')
  execute function log_live_mentor_gap();

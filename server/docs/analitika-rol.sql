-- F-1105-03 S11 / F-1112-01: Shahzoda konnektori uchun FAQAT O'QISH roli. Migratsiyada emas — prod baza egasi qo'lda bajaradi (psql, superuser).
-- Parol bu faylda yo'q: bajarilgandan keyin `\password analitika_ro` bilan beriladi. Tarmoq (IP ruxsati) — Abdulloh tomoni.
-- Xavfsiz: qayta bajarilsa xato bermaydi; baza nomi o'zi olinadi; ruxsat faqat bazada MAVJUD view'larga beriladi
-- (migratsiya 0018 gacha — 8 ta, 0018 dan keyin — 12 ta; 0018 mavjud rolga ruxsatlarni o'zi qayta beradi).
do $$
declare
  v text;
begin
  if not exists (select 1 from pg_roles where rolname = 'analitika_ro') then
    create role analitika_ro login;
  end if;
  execute format('grant connect on database %I to analitika_ro', current_database());
  grant usage on schema public to analitika_ro;
  foreach v in array array['v_lesson_results', 'v_question_attempts', 'v_practice', 'v_screen_views', 'v_arena', 'v_arena_full_place',
                           'v_wrong_answers_top', 'v_sessions', 'v_skipped', 'v_practice_wrong_top', 'v_lessons', 'v_quiz_learn'] loop
    if to_regclass('public.' || v) is not null then
      execute format('grant select on public.%I to analitika_ro', v);
      raise notice 'ruxsat: %', v;
    end if;
  end loop;
end $$;
-- Jadvallarning o'ziga (ism, token, matn) ruxsat BERILMAYDI. v_attempts_base — ichki, unga ham berilmaydi.
alter role analitika_ro set statement_timeout = '30s';
-- Tekshiruv: select table_name from information_schema.role_table_grants where grantee = 'analitika_ro' order by 1;

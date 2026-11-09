-- F-1105-03 S11: Shahzoda konnektori uchun FAQAT O'QISH roli. Migratsiyada emas — prod DB egasi (Kristina) qo'lda bajaradi.
-- Parol bu faylda yo'q: \password analitika_ro bilan beriladi. Tarmoq (IP ruxsati) — Abdulloh / Kristina.
create role analitika_ro login;
grant connect on database dars to analitika_ro;            -- baza nomi prod'dagiga moslanadi
grant usage on schema public to analitika_ro;
grant select on v_lesson_results, v_question_attempts, v_practice, v_screen_views, v_arena, v_arena_full_place, v_wrong_answers_top, v_sessions to analitika_ro;
-- jadvallarning o'ziga (ism, token, matn) ruxsat BERILMAYDI. v_attempts_base — ichki, ham berilmaydi.
alter role analitika_ro set statement_timeout = '30s';

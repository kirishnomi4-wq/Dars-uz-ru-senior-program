-- 0020 — F-1120-01: jonli darsda yakuniy test javobi «A, xato, 0 s» bo'lib yozilgan qatorlarni tiklash (MA'LUMOT-TUZATISH).
--
-- Sabab: dars recordAnswer'i yakuniy ekranda QuestionScreen'dan OLDIN submit_answer(…, picked 0, …, elapsed 0) yuborardi,
-- server birinchisini qotirardi (on conflict do nothing). O'quvchining HAQIQIY birinchi javobi answer_attempts'da
-- (attempt_no = 1) to'g'ri saqlangan — tiklash faqat shu manbadan, taxmin yo'q.
-- Kod tuzatildi: b4320a99 + 5cf99e5f. Prod o'lchovi (20.11, faqat o'qish): 192 urinish, 26 sessiya (v1 natija LMS'ga yuborilgan).
--
-- 1) BALL: faqat ikki dars (kalit > 0 bo'lgan yakuniy MCQ) — practice-02-ai-promo-v18 s7, git-github-v19 s14.
--    Shart: ball-qatori aynan soxta shaklda (picked 0, vaqt 0, xato) VA 1-urinish boshqa variant.
-- 2) VAQT: barcha darslar, test zonasi (<100): ball-qatorida vaqt 0, 1-urinish AYNAN o'sha variant va vaqti > 0.
--    (Maxsus ekranlarda 1-urinish yozuvi yo'q — ularning vaqti tiklanmaydi.)
-- LMS'ga yuborilgan natijalar BU MIGRATSIYA BILAN O'ZGARMAYDI (qayta yuborish 409) — CRM ro'yxati alohida.
-- Idempotent: ikkinchi yurishda 0 qator (shartlar soxta shaklga bog'langan).

do $$
declare
  n_ball int;
  n_vaqt int;
begin
  with fix as (
    select a.id, t.picked, t.elapsed_ms, (t.picked = qk.correct_idx) as correct
      from live_answers a
      join live_sessions ls on ls.pin = a.pin
      join answer_attempts t on t.player_id = a.player_id and t.screen_idx = a.screen_idx
                            and t.attempt_no = 1 and t.question_id = a.question_id
      join quiz_keys qk on qk.lesson_id = ls.lesson_id and qk.question_id = a.question_id
     where (ls.lesson_id, a.question_id) in (('practice-02-ai-promo-v18', 's7'), ('git-github-v19', 's14'))
       and a.picked = 0 and a.elapsed_ms = 0 and a.correct = false
       and t.picked <> 0
  )
  update live_answers a
     set picked = f.picked, correct = f.correct, elapsed_ms = f.elapsed_ms
    from fix f
   where a.id = f.id;
  get diagnostics n_ball = row_count;

  update live_answers a
     set elapsed_ms = t.elapsed_ms
    from answer_attempts t
   where t.player_id = a.player_id and t.screen_idx = a.screen_idx and t.attempt_no = 1 and t.question_id = a.question_id
     and a.screen_idx < 100 and a.elapsed_ms = 0 and t.elapsed_ms > 0 and t.picked = a.picked;
  get diagnostics n_vaqt = row_count;

  raise notice 'F-1120-01: ball tiklandi % qator, vaqt tiklandi % qator', n_ball, n_vaqt;
end $$;
